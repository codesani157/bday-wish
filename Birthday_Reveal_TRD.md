# Technical Requirements Document v2.0 — Birthday Reveal

---

## 1. Document Purpose

This TRD translates the PRD v2.0 into an implementation-ready technical plan. It supersedes TRD v1 and adds support for the physics-powered Gift Universe experience inspired by Bruno Simon's 3D portfolio.

Key additions over v1: 3D rendering pipeline (Three.js + Rapier.js), World system with per-world physics, adaptive performance tiers, camera cinematography, 3D asset pipeline, and dual-platform frontend (web reveal + React Native sender app).

---

## 2. Technical Principles

1. Modular monolith backend — no premature microservices.
2. Stateless API servers — horizontally scalable.
3. PostgreSQL as system of record.
4. Object storage + CDN for all media and 3D assets.
5. Scheduling and email delivery are first-class backend concerns.
6. The recipient reveal is a **web experience** — browser-based 3D.
7. The sender builder is a **React Native app** — existing mobile codebase.
8. Physics runs **client-side only** — the server never simulates physics.
9. Performance tiers are automatic — device capability detection on load.
10. Asset loading is blocking — the world must be ready before the curtain rises.

---

## 3. System Architecture Overview

### 3.1 Runtime Components

```
┌─────────────────────────────────────────────────────┐
│                     CLIENTS                          │
│  ┌──────────────┐    ┌────────────────────────────┐ │
│  │ React Native │    │ Web Reveal (Three.js +     │ │
│  │ Sender App   │    │ Rapier.js WASM)            │ │
│  │ - Builder    │    │ - Pre-load boot sequence   │ │
│  │ - Dashboard  │    │ - Camera cinematography    │ │
│  │ - Preview    │    │ - Physics simulation       │ │
│  └──────┬───────┘    │ - Gesture engine           │ │
│         │            │ - Adaptive perf tiers      │ │
│         │            └─────────────┬──────────────┘ │
└─────────┼──────────────────────────┼────────────────┘
          ▼                          ▼
┌─────────────────────────────────────────────────────┐
│              APPLICATION API (Node.js)               │
│  Auth · Celebrations · Media · Reveals · Worlds      │
│  Scheduling · Events · Webhooks                      │
└────────┬─────────────────────────┬──────────────────┘
         │                         │
   ┌─────▼──────┐          ┌──────▼────────┐
   │ PostgreSQL  │          │ Background    │
   │             │          │ Worker        │
   │ senders     │          │ - Delivery    │
   │ sessions    │          │ - Retries     │
   │ worlds      │          │ - Cleanup     │
   │ celebrations│          └───────────────┘
   │ media       │
   │ jobs/events │
   └─────────────┘
         │
   ┌─────▼────────────────────────────────────┐
   │  Object Storage + CDN                     │
   │  Photos · 3D models (.glb) · Textures    │
   │  Audio (ambient + SFX) · Email templates  │
   └───────────────────────────────────────────┘
```

### 3.2 Logical Flow

1. Sender builds Gift Universe in React Native app.
2. App calls API to persist draft; uploads media via signed URLs.
3. Sender schedules — API writes delivery job with UTC timestamp.
4. Worker polls due jobs, sends themed birthday email.
5. Recipient clicks link → loads web reveal experience.
6. Browser detects device capability → selects performance tier.
7. Asset loader downloads 3D models, textures, photos, audio.
8. Pre-load plays → camera swoops into World.
9. Recipient interacts via gestures → physics engine responds.
10. Events (opened, completed) sent back to API.

---

## 4. Frontend Responsibilities

### 4.1 Sender Application (React Native)

**Tech:** React Native (existing `birthday-reveal-mobile/` codebase)

**Responsibilities:**
- Magic link auth via deep links
- Gift Builder: recipient details, World selection, content assembly
- Photo upload via signed URLs
- Simplified 2D preview (not full 3D — use animated representation)
- Schedule confirmation with sealing animation
- Dashboard: Draft → Sealed → Delivered → Opened → Completed
- Draft auto-save, multi-step form persistence

**Constraints:**
- All validation repeated server-side
- Timezone normalization is server-side
- File uploads via signed URLs (no API proxy)

### 4.2 Recipient Reveal Experience (Web)

**Tech:** Vite + TypeScript + Three.js + Rapier.js (WASM)

#### 4.2.1 Rendering Stack

| Layer | Technology | Purpose |
|---|---|---|
| Render | Three.js (WebGL2/WebGPU via TSL) | Geometry, textures, camera |
| Physics | Rapier.js (Rust → WASM) | Gravity, collision, springs |
| UI overlay | HTML/CSS DOM | Loading, text, music controls |
| Audio | Web Audio API + Howler.js | Ambient, SFX, music fade-in |

#### 4.2.2 Pre-Load Boot Sequence (Bruno Simon Pattern)

1. HTML overlay with themed loading screen + progress bar.
2. Asset loader blocks WebGL — downloads `.glb` models, textures, photos, audio.
3. Progress updates overlay in real-time.
4. Once assets in GPU memory, overlay fades out.
5. Camera starts high/wide, lerps into World over ~2 seconds.
6. Control handed to recipient.

#### 4.2.3 Camera System (Bruno Simon Inspired)

- **Lerping:** Camera smoothly interpolates to targets — never snaps.
- **State-driven:** Named states (overview, gift-focus, photo-zoom, celebration-wide) with timed, eased transitions.
- **Auto-framing:** Clamps to scene bounds — no empty void visible.
- **Scripted sequences:** Entry swoop, unwrap zoom, celebration pull-back.

#### 4.2.4 Physics Model

Per-world config consumed by Rapier.js:

```typescript
interface WorldPhysicsConfig {
  gravity: { x: number; y: number; z: number };
  restitution: number;     // bounciness 0-1
  damping: number;          // motion decay
  particleDensity: number;  // confetti count
  particleType: string;     // 'star' | 'petal' | 'pixel'
  minInteractionMs: number; // floor for physics response
}
```

**Gesture → Physics:**

| Gesture | Physics Action |
|---|---|
| Tap | Impulse force with spring damping |
| Swipe up | Directional force with friction |
| Swipe horizontal | Lateral momentum with deceleration |
| Tap-and-hold | Oscillating micro-force (vibration) |
| Shake (mobile) | Particle burst with random vectors |
| Pinch/expand | Scale with inertia snap-back |

#### 4.2.5 Adaptive Performance Tiers

| Tier | Detection | Rendering | Physics |
|---|---|---|---|
| **Full** | WebGL2 + high GPU + 4+ cores | Three.js full scene | Rapier.js WASM |
| **Canvas** | WebGL1 only or low GPU | Canvas 2D particles | Simplified JS physics |
| **CSS** | No WebGL or `prefers-reduced-motion` | CSS animations + statics | No physics |

Detection strategy: `navigator.hardwareConcurrency`, pixel ratio clamping, WebGL benchmark, `prefers-reduced-motion` query.

#### 4.2.6 Performance Optimization (Bruno Simon Patterns)

- **Texture atlasing:** Single color palette per World, UV-mapped in Blender.
- **Baked lighting:** Static shadows pre-computed, painted into textures.
- **Fake dynamic shadows:** Raycast down → draw blurred circle.
- **Frustum culling:** Three.js default — skip off-screen geometry.
- **Matrix auto-update disable:** Static objects set `matrixAutoUpdate = false`.
- **Object pooling:** Reuse Vector3/Quaternion in render loop — zero GC.
- **Pixel ratio clamping:** Cap at 2x on mobile.
- **Physics sleep:** Rapier sleeps static bodies until collision.

#### 4.2.7 Reveal State Machine

```
LOADING → SWOOP → SEALED_GIFT → UNWRAPPING → GREETING →
[MEMORY_GATE] → MESSAGE → MEMORIES → MUSIC_BUILD →
CELEBRATION → REPLAY
```

Each state defines: camera position, active physics bodies, UI overlays, audio levels, valid gestures.

---

## 5. Backend Responsibilities

### 5.1 Core (carried from v1)
- CRUD celebrations, validate metadata/schedule/content
- Generate/verify signed tokens (management + reveal)
- Issue signed upload URLs, normalize UTC times
- Enqueue delivery jobs, send email, track state
- Expose dashboard data, record reveal events, rate limit

### 5.2 New v2 Additions
- **Serve World configs** — physics params, asset manifests, camera paths
- **3D asset manifests** — per-world `.glb`, textures, audio references
- **Themed email templates** — each World has matching email design
- **Extended event tracking** — tier used, easter eggs found, gesture counts
- **Performance metrics** — FPS, tier selection, load times from client

### 5.3 Centralized Business Rules
- Max photo count and file size
- Allowed MIME types
- Send cutoff before delivery
- Duplicate scheduling policy
- Memory Gate: 3 attempts → auto-bypass
- Reveal link availability window
- Token expiration/rotation
- World availability flags
- Pre-birthday countdown mode
- Post-birthday graceful framing

---

## 6. Database Schema

PostgreSQL. UUID PKs. All timestamps UTC.

### `senders`
| Column | Type | Constraint |
|---|---|---|
| id | UUID | PK |
| email | CITEXT | UNIQUE NOT NULL |
| display_name | TEXT | NULL |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |

### `sender_sessions`
| Column | Type | Constraint |
|---|---|---|
| id | UUID | PK |
| sender_id | UUID | FK → senders |
| session_token_hash | TEXT | NOT NULL |
| expires_at | TIMESTAMPTZ | NOT NULL |
| last_seen_at | TIMESTAMPTZ | NULL |
| created_at | TIMESTAMPTZ | NOT NULL |

### `magic_link_tokens`
| Column | Type | Constraint |
|---|---|---|
| id | UUID | PK |
| sender_id | UUID | FK → senders |
| token_hash | TEXT | NOT NULL |
| purpose | TEXT | NOT NULL |
| expires_at | TIMESTAMPTZ | NOT NULL |
| used_at | TIMESTAMPTZ | NULL |
| created_at | TIMESTAMPTZ | NOT NULL |

### `worlds` *(NEW)*
| Column | Type | Constraint |
|---|---|---|
| id | UUID | PK |
| key | TEXT | UNIQUE NOT NULL |
| display_name | TEXT | NOT NULL |
| description | TEXT | NOT NULL |
| gravity_x | FLOAT | NOT NULL DEFAULT 0 |
| gravity_y | FLOAT | NOT NULL DEFAULT -9.81 |
| gravity_z | FLOAT | NOT NULL DEFAULT 0 |
| restitution | FLOAT | NOT NULL DEFAULT 0.5 |
| damping | FLOAT | NOT NULL DEFAULT 0.3 |
| particle_density | INT | NOT NULL DEFAULT 200 |
| particle_type | TEXT | NOT NULL |
| min_interaction_ms | INT | NOT NULL DEFAULT 150 |
| ambient_audio_key | TEXT | NOT NULL |
| email_template_key | TEXT | NOT NULL |
| asset_manifest | JSONB | NOT NULL |
| camera_swoop_config | JSONB | NOT NULL |
| is_active | BOOLEAN | NOT NULL DEFAULT true |
| sort_order | INT | NOT NULL DEFAULT 0 |
| created_at | TIMESTAMPTZ | NOT NULL |

Example `asset_manifest`:
```json
{
  "model": "worlds/starlight-loft/scene.glb",
  "texture_atlas": "worlds/starlight-loft/atlas.webp",
  "ambient_audio": "worlds/starlight-loft/ambient.mp3",
  "sfx": { "unwrap": "unwrap.mp3", "confetti": "confetti.mp3" },
  "gift_wrap_texture": "worlds/starlight-loft/wrap.webp",
  "particle_sprite": "worlds/starlight-loft/star.webp"
}
```

### `celebrations` *(extended)*
| Column | Type | Constraint |
|---|---|---|
| id | UUID | PK |
| sender_id | UUID | FK → senders |
| world_id | UUID | FK → worlds |
| recipient_name | TEXT | NOT NULL |
| recipient_email | CITEXT | NOT NULL |
| recipient_birthdate | DATE | NOT NULL |
| recipient_timezone | TEXT | NOT NULL |
| scheduled_send_at_utc | TIMESTAMPTZ | NULL |
| default_send_local_time | TIME | NOT NULL DEFAULT '00:00' |
| headline | TEXT | NOT NULL |
| message_body | TEXT | NOT NULL |
| music_url | TEXT | NULL |
| memory_prompt_question | TEXT | NULL |
| memory_prompt_answer_hash | TEXT | NULL |
| status | TEXT | NOT NULL DEFAULT 'draft' |
| reveal_token_hash | TEXT | NOT NULL |
| reveal_available_at_utc | TIMESTAMPTZ | NULL |
| sent_at | TIMESTAMPTZ | NULL |
| first_opened_at | TIMESTAMPTZ | NULL |
| completed_at | TIMESTAMPTZ | NULL |
| recipient_device_tier | TEXT | NULL |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |

Status values: `draft`, `sealed`, `sending`, `delivered`, `opened`, `completed`, `delivery_failed`, `cancelled`

### `celebration_media`
| Column | Type | Constraint |
|---|---|---|
| id | UUID | PK |
| celebration_id | UUID | FK → celebrations |
| storage_key | TEXT | NOT NULL |
| original_filename | TEXT | NOT NULL |
| mime_type | TEXT | NOT NULL |
| file_size_bytes | BIGINT | NOT NULL |
| sort_order | INT | NOT NULL |
| width | INT | NULL |
| height | INT | NULL |
| upload_status | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL |

### `delivery_jobs`
| Column | Type | Constraint |
|---|---|---|
| id | UUID | PK |
| celebration_id | UUID | FK → celebrations |
| job_type | TEXT | NOT NULL |
| run_at_utc | TIMESTAMPTZ | NOT NULL |
| status | TEXT | NOT NULL |
| attempt_count | INT | DEFAULT 0 |
| last_attempt_at | TIMESTAMPTZ | NULL |
| last_error | TEXT | NULL |
| provider_message_id | TEXT | NULL |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |

### `email_events`
| Column | Type | Constraint |
|---|---|---|
| id | UUID | PK |
| celebration_id | UUID | FK → celebrations |
| provider | TEXT | NOT NULL |
| provider_message_id | TEXT | NOT NULL |
| event_type | TEXT | NOT NULL |
| event_timestamp | TIMESTAMPTZ | NOT NULL |
| payload_json | JSONB | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL |

### `reveal_events` *(extended)*
| Column | Type | Constraint |
|---|---|---|
| id | UUID | PK |
| celebration_id | UUID | FK → celebrations |
| event_type | TEXT | NOT NULL |
| occurred_at | TIMESTAMPTZ | NOT NULL |
| ip_hash | TEXT | NULL |
| user_agent | TEXT | NULL |
| metadata_json | JSONB | NULL |

Event types: `link_opened`, `tier_detected`, `assets_loaded`, `swoop_completed`, `gift_tapped`, `unwrap_started`, `unwrap_completed`, `prompt_passed`, `prompt_failed`, `prompt_bypassed`, `message_viewed`, `photos_viewed`, `music_started`, `easter_egg_found`, `celebration_reached`, `replay_triggered`

### Key Indexes
- `worlds(key)` unique
- `celebrations(sender_id)`, `celebrations(status)`, `celebrations(scheduled_send_at_utc)`
- `delivery_jobs(run_at_utc, status)`
- `reveal_events(celebration_id, occurred_at)`
- `email_events(provider_message_id)`

---

## 7. API Structure

Versioned REST. Base path: `/api/v1`

### 7.1 Auth
| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/request-magic-link` | Send one-time link to sender email |
| POST | `/auth/verify-magic-link` | Verify token, create session |
| POST | `/auth/refresh` | Exchange refresh token (mobile) |
| POST | `/auth/logout` | Invalidate session |
| GET | `/auth/session` | Return current sender identity |

### 7.2 Worlds
| Method | Path | Purpose |
|---|---|---|
| GET | `/worlds` | List active worlds with preview metadata |
| GET | `/worlds/:key` | Full world config (physics, assets, camera) |

### 7.3 Celebrations
| Method | Path | Purpose |
|---|---|---|
| POST | `/celebrations` | Create draft |
| GET | `/celebrations` | List sender's celebrations |
| GET | `/celebrations/:id` | Get detail |
| PATCH | `/celebrations/:id` | Update editable fields |
| POST | `/celebrations/:id/seal` | Validate and schedule (renamed from "schedule") |
| POST | `/celebrations/:id/cancel` | Cancel if allowed |
| POST | `/celebrations/:id/duplicate` | Clone as new draft |

### 7.4 Media
| Method | Path | Purpose |
|---|---|---|
| POST | `/celebrations/:id/media/upload-url` | Issue signed upload URL |
| POST | `/celebrations/:id/media/confirm` | Confirm upload, persist metadata |
| DELETE | `/celebrations/:id/media/:mediaId` | Remove media |
| PATCH | `/celebrations/:id/media/reorder` | Update sort order |

### 7.5 Public Reveal
| Method | Path | Purpose |
|---|---|---|
| GET | `/public/reveals/:token` | Validate token, return reveal payload |
| GET | `/public/reveals/:token/assets` | Return world asset manifest + CDN URLs |
| POST | `/public/reveals/:token/prompt-check` | Verify Memory Gate answer |
| POST | `/public/reveals/:token/events` | Record recipient events |

### 7.6 Webhooks
| Method | Path | Purpose |
|---|---|---|
| POST | `/webhooks/email-provider` | Receive delivery/bounce/complaint |

### 7.7 API Design Principles
- Stable resource IDs, machine-readable error codes
- Idempotency for seal and send triggers
- Never expose raw token values after creation
- Reveal payload includes: world config, physics params, asset URLs, celebration content, camera config
- Asset URLs are signed CDN URLs with expiration

---

## 8. Authentication Strategy

### 8.1 Sender Auth (Magic Link + Token Exchange)

The mobile app cannot use HTTP-only cookies. Adjusted flow:

1. Sender enters email in app.
2. API sends magic link with deep link target.
3. App receives deep link, extracts one-time token.
4. App calls `POST /auth/verify-magic-link` with token.
5. API returns short-lived access token (15min) + refresh token (30 days).
6. App stores tokens in secure storage (`expo-secure-store` or `react-native-keychain`).
7. Access token sent as `Authorization: Bearer` header.
8. Refresh token used to obtain new access tokens silently.

**Safeguards:**
- Magic link tokens: single-use, 15-minute expiry, hashed storage
- Rate limiting on auth endpoints
- Refresh token rotation on each use
- Token revocation on logout

### 8.2 Recipient Access

No accounts. Signed reveal tokens:
- Long, random, URL-safe tokens embedded in email links
- Backend validates: token hash, availability window, celebration status
- Pre-birthday opens → countdown experience (sealed gift visible, no content)
- Post-birthday opens → full reveal with soft "your gift waited" framing

**Memory Gate:**
- Experience layer, not authentication
- Stored as salted hash of normalized answer
- 3 attempts → auto-bypass with playful copy
- Server-side validation only

---

## 9. Third-Party Dependencies

### 9.1 Core Infrastructure
| Service | Purpose | Options |
|---|---|---|
| Managed PostgreSQL | Primary datastore | Neon, RDS, Supabase |
| Object Storage | Photos + 3D assets | S3, Cloudflare R2 |
| CDN | Asset delivery | CloudFront, Cloudflare |
| Email Provider | Magic links + birthday delivery | Postmark, Resend, SES |
| Web Hosting | Reveal experience | Vercel, Cloudflare Pages |

### 9.2 Frontend Libraries
| Library | Purpose | Why |
|---|---|---|
| Three.js | 3D rendering | Industry standard, WebGPU-ready via TSL |
| Rapier.js | Physics (WASM) | Rust-compiled, deterministic, fast |
| Howler.js | Audio | Cross-browser, Web Audio API wrapper |
| GSAP | Animation sequencing | Timeline control for camera paths |
| Hammer.js | Gesture recognition | Touch/swipe/pinch normalization |

### 9.3 Backend Libraries
| Library | Purpose |
|---|---|
| Fastify or Express | HTTP framework |
| Prisma or Drizzle | ORM / query builder |
| node-cron or BullMQ | Job scheduling |
| sharp | Image optimization on upload confirm |
| zod | Request validation |
| nanoid | Token generation |

### 9.4 Mobile Libraries (existing + needed)
| Library | Purpose |
|---|---|
| @tanstack/react-query | Server state |
| zustand | App session state |
| react-hook-form + zod | Form state |
| expo-secure-store | Token storage |
| expo-image-picker | Photo selection |
| expo-linking | Deep link handling |
| @sentry/react-native | Error monitoring |

### 9.5 Avoid in MVP
- Separate Redis cluster (unless queue demands it)
- GraphQL gateway
- Dedicated search infrastructure
- Event bus / message broker
- Workflow orchestration platform

---

## 10. Scalability Considerations

### 10.1 Bottleneck Analysis

| Concern | Expected Load Pattern | Strategy |
|---|---|---|
| 3D assets | Heavy bandwidth at reveal time | CDN with aggressive caching, gzip/brotli |
| Photo delivery | Burst on reveal open | CDN, progressive loading, WebP conversion |
| Email delivery | Birthday clustering at midnight/morning | Batch processing, rate awareness |
| API reads | Dashboard polling | Cache headers, stale-while-revalidate |
| Physics | Client-side only | No server concern |
| Database | Low-moderate CRUD | Standard indexing, connection pooling |

### 10.2 Horizontal Scaling
- API servers are stateless → scale with load balancer
- Worker processes scale independently from API
- World configs are read-heavy, rarely written → cache aggressively
- 3D assets are immutable → infinite CDN cache with content-hash URLs

### 10.3 Birthday Burst Handling
Birthdays cluster around local midnight and morning. Mitigations:
- Configurable default send hour (not hardcoded midnight)
- Batch job polling with row-level locking
- Provider-side rate awareness and backpressure
- Pre-compute due jobs instead of scanning all candidates

### 10.4 Asset Delivery Optimization
- 3D models compressed with Draco or meshopt
- Texture atlases in WebP with quality tiers per device
- Audio in compressed formats (MP3/OGG) with bitrate variants
- Photos: client-side resize before upload, server-side WebP conversion
- Progressive asset loading: critical assets first, secondary lazy

### 10.5 Data Growth Management
- Media storage will vastly exceed relational data
- Reveal events are append-only → partition by month after scale
- Stale drafts pruned after retention period
- Orphaned media cleaned by background job

### 10.6 Future Scale Path
When the modular monolith outgrows a single process:
1. Extract delivery worker as independent service (first)
2. Extract media processing pipeline (second)
3. Add Redis for job queuing if BullMQ demands it
4. Add read replicas for dashboard queries
5. Shard by sender if table sizes justify it

---

## 11. Security Considerations

- Validate all uploaded MIME types and sizes server-side
- Signed upload URLs with short expiry (15 min)
- Hash all tokens (magic link, session, reveal) before persistence
- Rate limit: auth endpoints, reveal access, prompt-check
- Sanitize all user-generated text before rendering
- CSRF protection on state-changing endpoints
- Content Security Policy headers on reveal page
- No sensitive sender data in reveal payload
- Reveal tokens are URL-safe, 256-bit random, hashed with SHA-256

---

## 12. Scheduling and Delivery

### Design
- Store recipient timezone as IANA string (e.g., `America/New_York`)
- Compute `scheduled_send_at_utc` server-side when celebration is sealed
- Create `delivery_jobs` row for due timestamp
- Worker polls every 60 seconds, claims due jobs with `SELECT ... FOR UPDATE SKIP LOCKED`
- Use email provider idempotency keys

### Retry Policy
- Transient failures: exponential backoff (3 attempts over 15 minutes)
- Permanent failures (invalid email): no retry, surface to sender immediately
- Delivery status surfaced on dashboard within 5 minutes of occurrence

### Edge Cases
- Feb 29 birthdays → default Feb 28 in non-leap years with sender notice
- Same-day scheduling → allowed with 15-minute minimum lead time
- Timezone ambiguity → explicit confirmation step showing both local times

---

## 13. World System Technical Spec

### MVP Worlds

| World | Gravity Y | Restitution | Particle | Camera |
|---|---|---|---|---|
| Starlight Loft | -6.0 (low) | 0.4 | Gold/silver stars | Isometric, warm |
| Midnight Garden | -9.81 (normal) | 0.2 | Petals + fireflies | Low dramatic angle |
| Arcade Cabinet | -12.0 (heavy) | 0.8 (bouncy) | Pixel squares | Overhead, distorted |

### World Asset Pipeline
1. Environment modeled in Blender with baked lighting
2. Exported as `.glb` with Draco compression
3. Single texture atlas per world (UV-mapped)
4. Uploaded to object storage with content-hash filenames
5. Asset manifest stored in `worlds.asset_manifest` JSONB
6. CDN serves with immutable cache headers

### World Cohesion Rule
Email template → loading screen → reveal scene → confetti celebration must all use the same World's visual identity. No cross-world mixing in MVP.

---

## 14. Suggested Tech Stack Summary

| Layer | Technology |
|---|---|
| Sender App | React Native (Expo managed) |
| Reveal Experience | Vite + TypeScript + Three.js + Rapier.js |
| Backend API | Node.js + Fastify |
| ORM | Drizzle (type-safe, lightweight) |
| Database | PostgreSQL (Neon or Supabase) |
| Object Storage | Cloudflare R2 or S3 |
| CDN | Cloudflare or CloudFront |
| Email | Postmark or Resend |
| Job Queue | BullMQ (with PostgreSQL fallback) |
| Monitoring | Sentry + PostHog |
| 3D Tooling | Blender → glTF pipeline |

---

## 15. Implementation Boundaries

### In Scope for MVP
- Modular monolith backend with World system
- 3 production-ready Worlds with full asset pipelines
- Physics-based reveal experience with 3 performance tiers
- Camera cinematography system
- Gesture-driven interaction on touch and desktop
- Magic link auth with mobile token exchange
- Scheduled delivery worker with retry
- Themed emails per World
- Sender dashboard with engagement tracking
- Memory Gate with auto-bypass
- Easter egg: shake-to-confetti

### Out of Scope
- Multi-sender collaboration
- Custom World builder
- Video processing
- Live reveal presence notifications
- Real-time multiplayer (Bruno's ghost cars)
- Multi-region active-active deployment
- AI message assistant
- End-to-end encryption beyond HTTPS

---

## 16. Final Recommendation

Build the **backend as an extended modular monolith** (proven from v1) and invest engineering depth into the **web-based reveal experience** — that is where the product differentiation lives. The physics pipeline, camera system, and adaptive performance tiers are the technical moat.

The most critical engineering investments for v2:
1. **Reveal rendering pipeline** — Three.js + Rapier.js with graceful tier degradation
2. **Asset pipeline** — Blender → compressed `.glb` → CDN delivery under 3 seconds
3. **Scheduling correctness** — timezone handling, idempotent delivery, failure recovery
4. **World system** — clean separation of physics config, assets, and email templates

The sender app (React Native) and backend API are important but well-understood problems. The reveal experience is where Birthday Reveal becomes unforgettable.
