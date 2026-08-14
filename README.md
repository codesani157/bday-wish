# Birthday Reveal v2 — Flagship MVP

Welcome to the **Birthday Reveal v2** monorepo workspace. This project orchestrates a premium, highly-interactive, and reliable end-to-end birthday gifting experience. It allows a sender to create a customized "Virtual Gift" via a mobile app, which is securely sealed, scheduled, and ultimately delivered to a recipient as a stunning 3D interactive web experience on their special day.

---

## 🏗 System Architecture

The MVP is explicitly designed to separate the **Sender** (Mobile) and **Recipient** (Web) paths to maximize accessibility and visual fidelity while minimizing app-install friction.

### 1. `birthday-reveal-api` (Core Backend)
The nervous system of the platform, built for speed, type safety, and background processing.
- **Framework:** Fastify
- **Database:** PostgreSQL with Drizzle ORM
- **Key Features:** 
  - Passwordless Magic Link Auth (JWT + secure refresh rotation)
  - Presigned S3/R2 direct-upload pipelines for rich media
  - Advanced Timezone-Aware Scheduling Engine (UTC scaling, Leap Year safety)
  - `SKIP LOCKED` atomic job workers for idempotent email delivery
  - Webhook integration + XState Telemetry collection

### 2. `birthday-reveal-web` (Recipient Reveal Engine)
The flagship front-end web experience delivered to the recipient. No installs required, just pure immersion.
- **Framework:** Vite + React + TypeScript
- **3D Engine:** `@react-three/fiber` with `Rapier` WASM Physics
- **Key Features:**
  - Strict performance scaling (`TierDetector`) to gracefully degrade from 60fps WebGL rendering on flagship devices down to CSS fallback on low-end hardware.
  - Immersive "Memory Gate" puzzle UI with flagship-tier glassmorphism.
  - XState finite state machine (`revealMachine`) governing the cinematic swoop, interactive unwrapping, and physics-driven celebration confetti explosion.
  - Fully contained edge-to-edge canvas with modern dual-font typography (Outfit + Inter).

### 3. `birthday-reveal-mobile` (Sender Builder App)
The native mobile app empowering senders to craft, preview, and dispatch their digital gifts.
- **Framework:** Expo (React Native) + TypeScript
- **State Management:** Zustand (Wizard UI) + TanStack React Query (Server state)
- **Key Features:**
  - Robust multi-step forms utilizing `react-hook-form` + `zod`.
  - Zero-cost re-rendering UI primitives with native `Pressable` animations and custom dynamic `worldThemes` styling.
  - Debounced auto-save drafts via React Query optimistic mutations.
  - Built-in `WebView` that renders a staging version of the 3D gift exactly as the recipient will see it before the user hits "Seal".

---

## 🚦 MVP Status: Gate 7 Completed

The initial **Implementation Roadmap** has been executed in full. 
- All 7 Gates have been passed successfully. 
- Technical debt has been purged (including 50+ prototype recipient screens that previously polluted the mobile codebase).
- 100% Type safety achieved across all three repositories (`tsc --noEmit` exit code 0).
- Fully validated via end-to-end testing (`create → seal → email worker dispatch → web reveal click`).

---

## 🚀 Getting Started

To spin up the environment locally:

1. **Boot Database:** Ensure a PostgreSQL instance is running. (Migrations are in `birthday-reveal-api/src/db`).
2. **Start Backend:** 
   ```bash
   cd birthday-reveal-api
   npm install
   npm run dev
   ```
3. **Start Web Reveal:**
   ```bash
   cd birthday-reveal-web
   npm install
   npm run dev
   ```
4. **Start Mobile App:**
   ```bash
   cd birthday-reveal-mobile
   npm install
   npx expo start
   ```

*Check `.env.example` inside each respective project for required sandbox keys (AWS/R2, Email provider, etc).*

---

## 🔮 Future Roadmap (v3+)

- **Dynamic Sound Engine:** Add global Web Audio context for unwrapping swooshes, impacts, and background music cross-fading on the web client.
- **GSAP Camera Swoops:** Add advanced cinematic arcs into the Three.js scenes before the user takes control.
- **Push Notifications:** Deep-link the sender app to alert them the exact moment the recipient unlocks the Memory Gate.
