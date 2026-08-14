# UX Screen & System Design Specification v2.0 — Birthday Reveal
### "A World Built for One Person"

---

## 1. Executive Summary & Design Philosophy

This document defines the complete user experience, spatial design language, UI layout blueprints, interaction mechanics, design system tokens, and procedural scattering logic for **Birthday Reveal v2.0**.

Where traditional web products rely on scrolling standard DOM containers, Birthday Reveal v2.0 treats **interaction as the medium and physics as the language**. Inspired by Bruno Simon's 3D portfolio architecture, the user experience is divided into two distinct, harmonized emotional journeys:
- **The Builder (Sender):** A tactile, satisfying creation canvas where assembling photos, text, and audio feels as intentional as physical gift wrapping.
- **The Discovery (Recipient):** A browser-based, spatially-aware 3D physics universe where the recipient unwraps, explores, and experiences a personalized world built exclusively for them.

### Core UX Principles
1. **Interaction is the Medium, Physics is the Language**: Content is physically discovered. Objects have inertia, restitution, spring-damping, and collision weight.
2. **Minimalist Chrome, Spatial Depth**: Interfaces keep UI chrome ultra-clean, letting 3D pre-rendered baked lighting, soft dark modes, glassmorphism, and live physics take center stage.
3. **Paced & Earned Ceremony**: Unwrapping a gift happens in intentional layers. The camera guides focus with linear interpolation (`lerp`), zooming in on intimate moments and pulling back for epic celebrations.
4. **Sender Assembly Satisfaction**: Building a gift feels as tactile as physical gift wrapping. Live canvas updates, drag-and-drop mechanics, and cinematic sealing animations make scheduling memorable.
5. **Adaptive Respect**: Responsive gestures and graceful physics fallbacks ensure emotional resonance regardless of recipient device performance (Full WebGL physics → Canvas 2D → CSS fallback).
6. **Zero Level-Design Friction via Procedural Scattering**: Senders never manually adjust 3D X/Y/Z spatial coordinates. Senders simply drop extra photos and short inside joke notes into a "Hidden Surprises" bucket. The engine procedurally scatters items onto pre-configured Blender invisible spawn nodes (`spawn_easter_egg_*`) with automated raycast ground snapping.

---

## 2. Design System Tokens & Visual Language

### 2.1 Color Systems per World

| Token Name | Hex Code | Purpose |
|---|---|---|
| **Starlight Loft** | | *Timeless, warm, romantic attic space* |
| `loft-bg-primary` | `#0B132B` | Midnight sky background |
| `loft-surface` | `#1C2541` | Soft glassmorphism panel background |
| `loft-accent-amber` | `#F7D070` | Warm string-light glow & star confetti |
| `loft-accent-gold` | `#E0A96D` | Ribbon accent & wax seal stamp |
| `loft-text-main` | `#EDF2F4` | High-contrast readable typography |
| **Midnight Garden** | | *Atmospheric outdoor lantern & firefly sanctuary* |
| `garden-bg-primary` | `#0A0F0D` | Obsidian night backdrop |
| `garden-surface` | `#132A13` | Deep foliage glass tint |
| `garden-cyan-glow` | `#4EFAAF` | Bioluminescent firefly particle emission |
| `garden-rose-accent` | `#FF758F` | Blooming petal accent & gift wrap ribbon |
| `garden-text-main` | `#E8F5E9` | Soft luminescent typography |
| **Arcade Cabinet** | | *Vibrant retro 3D pixel-art sandbox* |
| `arcade-bg-primary` | `#1A0933` | Deep CRT violet background |
| `arcade-surface` | `#2D124D` | Beveled arcade glass surface |
| `arcade-magenta` | `#FF2A85` | High-restitution pixel confetti & neon border |
| `arcade-electric-cyan` | `#00F0FF` | Interactive physics impulse feedback |
| `arcade-text-main` | `#FFFFFF` | Crisp pixel-ready white typography |
| **Cloud Terrace** | | *Bright elevated daytime sky domain (Stretch MVP)* |
| `cloud-bg-primary` | `#E8F4F8` | Soft airy sky gradient top |
| `cloud-surface` | `#FFFFFF` | Frosted white glass card (`backdrop-filter: blur(16px)`) |
| `cloud-pale-gold` | `#FFD166` | Sunlight reflections & floating gift ribbon |
| `cloud-text-main` | `#1D3557` | Deep navy readable typography |

---

### 2.2 Typography Hierarchy

```
Display 3D Hero     ─── Outfit / Inter Bold ─── 48px / 1.1 Line Height (Rendered as 3D Mesh in World)
Headline H1          ─── Outfit SemiBold     ─── 32px / 1.2 Line Height
Section Title H2     ─── Outfit Medium       ─── 24px / 1.3 Line Height
Body Text (Message)  ─── Playfair Display    ─── 18px / 1.6 Line Height (Intimate, readable)
UI Label / Button    ─── Inter Medium        ─── 14px / 1.0 Line Height (All-Caps 0.5px letter-spacing)
Arcade Specialty     ─── "Press Start 2P"    ─── 16px (Arcade Cabinet World text override)
```

---

### 2.3 Motion, Easing & Camera Cinematography

- **Camera Lerp Speed (`alpha`):** `0.06` per frame (Linear interpolation for smooth rubber-band tracking without motion sickness).
- **Camera Lerp Curves:** `cubic-bezier(0.25, 1, 0.5, 1)` (Quartic ease-out for camera state transitions).
- **Spring Physics Parameters (Rapier.js WASM):**
  - *Starlight Loft:* Stiffness `120`, Damping `14`, Mass `1.0` (Gentle floating motion).
  - *Midnight Garden:* Stiffness `90`, Damping `18`, Mass `1.2` (Heavy, calm settling).
  - *Arcade Cabinet:* Stiffness `220`, Damping `8`, Mass `0.8` (High restitution, bouncy, energetic).

---

### 2.4 Haptic & Audio Feedback Vocabulary

| Action | Haptic Feedback (Mobile) | Audio Trigger |
|---|---|---|
| Single Tap / Nudge | `Haptics.impactAsync(Light)` | Soft wooden / ceramic tap click |
| Swipe Unwrap Peel | `Haptics.impactAsync(Medium)` | Paper tearing / ribbon sliding friction sound |
| Photo Expand | `Haptics.selectionAsync()` | Subtle camera shutter / chime |
| Wax Seal Impact (Seal Step) | `Haptics.impactAsync(Heavy)` | Deep metallic thud & wax stamp crunch |
| Celebration Apex | `Haptics.notificationAsync(Success)` | Confetti popper explosion & music peak |
| Shake Easter Egg | Double pulse (`Medium`) | Sparkle burst sound effect |

---

## 3. Global Screen Index

### Sender-Facing Experience (React Native App / Web Builder)
- **1. Landing Page**: Interactive 3D Hero & Gateway
- **2. Magic Link Request**: Passwordless Sign-In Entry
- **3. Magic Link Verification**: Session Auth & Redirection
- **4. Sender Dashboard**: Active & Past Gift Manager with Visual Urgency Pulsing
- **5. Empty Dashboard**: Friendly Zero-State & Creation Launcher
- **6. Gift Builder Step 1 — Recipient Details**: Core Metadata & Live 3D Name Injection
- **7. Gift Builder Step 2 — World Selection**: Spatial Environment Choice with Animated Thumbnails
- **8. Gift Builder Step 3 — Assembly Canvas**: Drag-and-Drop Content, "Hidden Surprises" Bucket & Live 3D Preview
- **9. Gift Builder Step 4 — Interactive Preview Run**: Sender Experience of Recipient Journey
- **10. Gift Builder Step 5 — The Seal & Schedule**: Cinematic Gift Wrapping & Lock-In Animation
- **11. Celebration Detail & Management**: Live Status, Interaction Timeline & Controls
- **12. Edit Locked State**: Read-Only Snapshot & Cutoff Explanation
- **13. Delivery Failure State**: Alert Banner & Immediate Recovery Workflow

### Recipient-Facing Experience (Browser 3D/Physics Reveal)
- **14. Themed Birthday Email**: Inbox Invitation Matched to Chosen World
- **15. Pre-Load & Boot Sequence**: Atmospheric Loading Curtain & Asset Preloader
- **16. Pre-Birthday Countdown**: Early Open Stage with Interactive Bouncy Gift
- **17. Cinematic Entry & Camera Swoop**: 3D Environment Arrival & Name Reveal
- **18. Playful Memory Gate (Optional)**: Anticipation Barrier with Friendly Bypass
- **19. Interactive Unwrapping & Physical Reveal**: Multi-Layer Gesture Discovery (Paper physics, Card zoom, Photo scatter, Music fade)
- **20. Celebration Apex & Procedural Sandbox**: Boundary-Colliding Confetti, Auto-Scattered Easter Eggs & Replay Stage
- **21. Invalid / Expired Link**: Privacy-Safe Soft Fallback

### System & Support Screens
- **22. Generic Error Screen**: System Exception Recovery
- **23. 404 / Not Found**: Navigation Fallback

---

## 4. Detailed Screen Specifications & Visual Layout Blueprints

---

### 4.1 Landing Page (Sender Gateway)

#### Purpose
Establish the product's physics-driven, spatial identity immediately while converting visitors into gift creators with zero friction.

#### ASCII Layout Blueprint
```text
┌─────────────────────────────────────────────────────────────────────────┐
│ [Logo] Birthday Reveal                          [How It Works]  [Sign In] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                       3D HERO CANVAS (Interactive)                      │
│                  ┌──────────────────────────────────┐                   │
│                  │   [ Floating 3D Gift Box ]       │                   │
│                  │   (Responds to cursor / tilt)    │                   │
│                  └──────────────────────────────────┘                   │
│                                                                         │
│                      A World Built for One Person                       │
│           Unwrap a spatially simulated birthday universe.               │
│                                                                         │
│                      [ Build a Birthday Surprise ]                      │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│  [Step 1: Choose World]   [Step 2: Assemble Gift]   [Step 3: Unwraps]   │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Component Breakdown
- `Hero3DCanvas`: Lightweight WebGL viewport rendering a floating 3D gift box with ambient floating particles.
- `GlassNavbar`: Sticky header with backdrop blur (`backdrop-filter: blur(12px)`).
- `PrimaryButton`: High-contrast CTA with spring scale hover animation (`scale: 1.04`).
- `FeatureStepCard`: Card container with 3D tilt response on hover.

#### Interaction Logic
- Cursor movements create gravitational tugs on the hero gift box, causing it to tilt and bounce gently.
- Mobile touch drag rotates the 3D gift box in real time.
- Tapping "Build a Birthday" triggers a subtle gift lid opening particle burst before transitioning to Magic Link Request.

#### Empty States
- N/A.

#### Error States
- **WebGL Unavailable**: Hero canvas gracefully falls back to an animated CSS glassmorphic 3D gift box with floating CSS particle effects.

---

### 4.2 Magic Link Request

#### Purpose
Authenticate senders passwordlessly without interrupting creative momentum.

#### Layout Hierarchy
- **Centered Card Layout**: Floating elevated glass card on ambient dark backdrop.
- **Card Header**: Icon, title ("Start Your Gift"), helper text.
- **Form Area**: Email text input field with real-time format validation.
- **Action Area**: Primary submit button ("Send Magic Link"), return home link.

#### Component Breakdown
- `AppTextField`: Input with active glow border (`#F7D070` tint) and floating label.
- `AppButton`: Full-width primary button with particle spinner loading state.
- `InlineAlert`: Dynamic status message strip.

#### Interaction Logic
- Input validates email format on keypress/blur.
- Submitting disables input, transforms button state to a rotating particle loader, and triggers an email send request.
- On success, card flips in 3D to reveal "Check your inbox" confirmation with a 60-second resend countdown timer.

#### Empty States
- Clean placeholder text (`alex@example.com`).

#### Error States
- **Invalid Email Format**: Red accent outline on text field with inline warning.
- **Rate Limit Exceeded**: Warning banner ("Too many requests. Please wait 60 seconds.").

---

### 4.3 Magic Link Verification / Session Entry

#### Purpose
Seamlessly convert an incoming magic link click into an authenticated sender session.

#### Layout Hierarchy
- **Centered Verification Card**: Glass card with dynamic status spinner.
- **Progress View**: Animated progress ring with ambient particle pulse.
- **Status Typography**: "Verifying your magic link..." transitioning to "Welcome back!".

#### Component Breakdown
- `StatusSpinner`: Physics-inspired orbiting ring animation.
- `StateCard`: Glassmorphism container.

#### Interaction Logic
- Deep link / URL token parsed automatically on load.
- Sends verification request to backend; on success, stores session tokens in secure storage and auto-redirects to Dashboard or active Draft.

#### Empty States
- N/A.

#### Error States
- **Expired Token**: Displays error icon, message ("Link expired"), and button to request a new magic link.
- **Already Used Token**: Shows explanation and button to return to Sign In.

---

### 4.4 Sender Dashboard

#### Purpose
Provide a clear overview of all created, scheduled, and delivered gifts with real-time engagement tracking and visual urgency.

#### ASCII Layout Blueprint
```text
┌─────────────────────────────────────────────────────────────────────────┐
│ Sender Dashboard                                    [+ Build New Gift]  │
├─────────────────────────────────────────────────────────────────────────┤
│ [ Scheduled: 2 ]   [ Sent: 5 ]   [ Opened: 4 ]   [ Completed: 4 ]      │
├─────────────────────────────────────────────────────────────────────────┤
│ Active Birthday Surprises                                               │
│                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ 🌟 Maya's Birthday (Starlight Loft)              [ Deliver Tomorrow ]│ │
│ │ Scheduled: Aug 18, 2026 (00:00 EST)              ✦ Pulsing Glow     │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ 🌿 Sam's Celebration (Midnight Garden)           [ Opened & Replayed]│ │
│ │ Delivered: Jul 30, 2026 • 3 Photos Viewed                           │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Component Breakdown
- `MetricSummaryBadge`: Counter pill with theme-specific background tint.
- `CelebrationListItem`: Rich list item featuring recipient name, chosen World theme preview thumbnail, delivery date badge, and real-time status indicator.
- `UrgencyGlow`: CSS/Native animated pulse frame for imminent gifts (delivering within 24 hours).

#### Interaction Logic
- Tapping a celebration item opens `Celebration Detail Screen`.
- Tapping "Build New Gift" initializes a new celebration draft and navigates to Recipient Details.
- Context menu options allow duplicating past gifts as new drafts.

#### Empty States
- Handled by **Screen 4.5 (Empty Dashboard)**.

#### Error States
- **Network Load Failure**: Redesigns feed into a retry state with error banner and "Tap to refresh" button.

---

### 4.5 Empty Dashboard

#### Purpose
Welcome first-time senders and guide them instantly into crafting their first Gift Universe.

#### Layout Hierarchy
- **Centered Zero-State Container**: Clean vertical stack.
- **Interactive Object**: Floating pre-wrapped mini 3D gift box that tumbles lightly when tapped.
- **Headline & Copy**: "No Birthday Surprises Yet", "Build an unforgettable world for someone special."
- **Primary CTA**: Prominent "Create Your First Gift" button.

#### Component Breakdown
- `InteractiveZeroStateGraphic`: Physics-enabled mini canvas object.
- `AppButton`: High-contrast primary CTA.

#### Interaction Logic
- Recipient can tap/flick the 3D graphic to make it spin and bounce off boundaries.
- Tapping CTA immediately launches the Gift Builder flow.

#### Empty States
- Default zero-state display.

#### Error States
- N/A.

---

### 4.6 Gift Builder Step 1 — Recipient Details

#### Purpose
Collect core recipient metadata while providing immediate visual feedback of the recipient's name appearing inside the Gift Universe scene.

#### Layout Hierarchy
- **Step Header**: Step progress indicator (Step 1 of 5), back button, draft auto-save tag.
- **Main Form Area**:
  - Recipient Name input.
  - Recipient Email input.
  - Birthdate picker (supports Feb 29 leap day logic).
  - Timezone selector (searchable IANA list with auto-detected local default).
- **Live Canvas Teaser**: 3D scene preview where recipient's name renders live in 3D typography into the environment as typed.

#### Component Breakdown
- `StepWizardHeader`: Step progress indicator and title.
- `AppTextField`: Inputs for Name, Email.
- `DatePicker`: Calendar sheet with leap-year handling.
- `TimezoneDropdown`: Searchable select dialog.
- `LiveNamePreviewCanvas`: Mini WebGL view rendering recipient name in real-time 3D space.

#### Interaction Logic
- Typing into "Recipient Name" updates the `LiveNamePreviewCanvas` letter by letter.
- Auto-saves draft on field blur with a subtle checkmark notification ("Draft saved").
- Tapping "Next: Choose World" validates inputs and transitions to Step 2.

#### Empty States
- Empty form with helpful placeholder text.

#### Error States
- **Missing Required Fields**: Highlighted input borders with clear validation messaging.
- **Invalid Email Format**: Inline warning on Recipient Email.

---

### 4.7 Gift Builder Step 2 — World Selection

#### Purpose
Allow the sender to choose a spatially distinct Gift Universe environment, previewing real physics and visual atmosphere in motion.

#### Layout Hierarchy
- **Step Header**: Step 2 of 5 title ("Choose a World Environment").
- **World Carousel / Grid**: Large interactive cards showcasing MVP Worlds:
  1. *Starlight Loft* (Warm attic, low gravity, star confetti).
  2. *Midnight Garden* (Dark outdoor, fireflies, blooming petals).
  3. *Arcade Cabinet* (Retro 3D, pixel confetti, bouncy physics).
  4. *Cloud Terrace* (Bright sky, floating drift).
- **Live Preview Window**: Full-frame video/canvas viewport showing the active world's lighting, physics particles, and ambient audio sample.
- **Footer Actions**: Back button, "Next: Assemble Gift" CTA.

#### Component Breakdown
- `WorldCard`: Selection card with thumbnail preview and physics tag indicators (Gravity level, Confetti style).
- `AmbientAudioPreviewToggle`: Small mute/unmute button to test World audio signatures.
- `PrimaryButton`: Navigation control.

#### Interaction Logic
- Tapping a World card instantly updates the live viewport, changing lighting, particle rendering, and playing a 3-second sample of ambient audio.
- Selected card gains a glowing gold border and active badge.

#### Empty States
- One World is pre-selected by default (*Starlight Loft*).

#### Error States
- **Asset Load Failure**: Shows static poster thumbnail with warning tag ("Preview video unavailable").

---

### 4.8 Gift Builder Step 3 — Assembly Canvas

#### Purpose
Provide a visual, drag-and-drop gift assembly environment where senders place core photos, compose messages, add music, configure Memory Gates, and drop extra photos or text notes into the "Hidden Surprises" bucket for automatic procedural scattering.

#### ASCII Layout Blueprint
```text
┌─────────────────────────────────────────┬───────────────────────────────┐
│ ASSEMBLY WORKSPACE                      │ LIVE 3D GIFT PREVIEW          │
├─────────────────────────────────────────┤                               │
│ Headline Input                          │   ┌───────────────────────┐   │
│ [ Happy Birthday Maya!                ] │   │                       │   │
│                                         │   │  [ Floating Photos ]  │   │
│ Personal Message Editor                 │   │   [ Pinned Card ]     │   │
│ [ Write your heartfelt message...     ] │   │                       │   │
│                                         │   └───────────────────────┘   │
│ Photo Deck (Core Memories)              │                               │
│ [ + Add Photo ] [Img1] [Img2] [Img3]    │  Updates live as content      │
│                                         │  is added by the sender.      │
│ ✦ Hidden Surprises Bucket (Optional)   │                               │
│ [ + Add Extra Photo ] [ + Add Note ]    │  Items scatter procedurally   │
│ - "Remember Paris 2024?" (Note)         │  at spawn nodes at runtime.   │
│ - ExtraPhoto_01.jpg                     │  (Zero 3D coordinate setup!)  │
│                                         │                               │
│ Music Layer                             │                               │
│ [ Spotify / YouTube Link            ]   │                               │
│                                         │                               │
│ [x] Enable Memory Gate Prompt           │                               │
│ Question: [ Where did we first meet?  ] │                               │
│ Answer:   [ Paris                     ] │                               │
└─────────────────────────────────────────┴───────────────────────────────┘
```

#### Component Breakdown
- `DragDropUploader`: Multi-file photo drag target with upload progress bars.
- `PhotoThumbnailList`: Reorderable photo grid with delete and rotate buttons.
- `HiddenSurprisesBucket`: Expandable drop bucket container for optional secondary photos and text notes.
- `NoteInputField`: Short text note creator for hidden spatial notes (up to 140 chars).
- `AudioUrlField`: Link input with automated metadata fetch.
- `MemoryGateConfigBox`: Accordion box containing question/answer fields.

#### Interaction Logic
- Dragging photos onto the primary uploader sets core story photos.
- Dragging items into `HiddenSurprisesBucket` adds extra items to the gift's procedural scattering manifest. Senders do not configure 3D coordinates — the engine handles placement automatically at runtime!
- Toggling Memory Gate expands question and answer inputs; typing answer generates salted hash preview.

#### Empty States
- Photo grid displays empty drop target slots ("Drag photos here or tap to upload").
- Hidden Surprises bucket shows friendly copy ("Drop secret photos or inside joke notes here — we'll hide them in the world!").

#### Error States
- **Photo Over Size Limit (>15MB)**: Displays toast warning and triggers client-side auto-compression before retrying upload.
- **Unsupported MIME Type**: Displays error badge on invalid file item.

---

### 4.9 Gift Builder Step 4 — Interactive Preview Run

#### Purpose
Let the sender experience the full recipient journey in sender preview mode — testing camera swoops, physics unwrapping, procedural easter egg discovery, and music timing before sealing.

#### Layout Hierarchy
- **Full-Screen Stage**: Exact 1:1 simulation of the Web Reveal experience.
- **Sender Overlay Controls**:
  - "Sender Preview Mode" badge.
  - Replay Swoop button.
  - Test Memory Gate button.
  - "Edit Gift" secondary action.
  - "Proceed to Seal" primary CTA button.

#### Component Breakdown
- `FullRevealSimulator`: Integrated WebGL container executing live Three.js + Rapier.js physics scene.
- `PreviewControlBar`: Top overlay bar with non-intrusive frosted glass design.

#### Interaction Logic
- Sender can touch, swipe, unwrap, and interact with the preview exactly like a recipient.
- Tapping "Test Memory Gate" simulates the riddle prompt unlock.
- Tapping "Proceed to Seal" locks progress and transitions to Step 5.

#### Empty States
- N/A.

#### Error States
- **WebGL Hardware Limit**: Auto-switches preview to 2D Canvas or CSS fallback tier with banner notification ("Running in Canvas Compatibility Mode").

---

### 4.10 Gift Builder Step 5 — The Seal & Schedule

#### Purpose
Transform the administrative act of scheduling into a cinematic, satisfying moment of intentional gift wrapping.

#### Layout Hierarchy
- **Center Canvas**: Interactive 3D scene displaying the assembled Gift Universe.
- **Cinematic Sealing Animation Stage**: Upon confirmation, the 3D gift folds, wraps, ribbon-ties, and stamps a metallic wax seal containing the delivery date.
- **Delivery Confirmation Form**:
  - Scheduled send date & UTC-normalized send time summary.
  - Sender email confirmation notice.
- **Action Bar**: "Seal & Schedule Birthday Surprise" primary button.

#### Component Breakdown
- `SealingAnimationCanvas`: 3D animation controller rendering wrapping folds and wax seal stamp.
- `ScheduleSummaryCard`: Glass card detailing recipient email, delivery time in both sender & recipient timezones.
- `PrimaryButton`: Sealing trigger button.

#### Interaction Logic
- Tapping "Seal & Schedule" disables inputs and triggers the `SealingAnimationCanvas` sequence (~3.5 seconds of physical folding, ribbon tightening, and wax seal impact with haptic/audio feedback).
- Upon animation completion, sends scheduling payload to backend, marks status as `Sealed`, and redirects to Dashboard with glowing urgency badge.

#### Empty States
- N/A.

#### Error States
- **Delivery Time In Past**: Highlights date picker with warning ("Scheduled send time must be at least 15 minutes in the future").

---

### 4.11 Celebration Detail & Management

#### Purpose
Allow senders to monitor delivery status, view recipient engagement events, edit content before cutoff, or duplicate gifts.

#### Layout Hierarchy
- **Top Header**: Recipient name, World theme badge, current status indicator (Draft, Sealed, Delivered, Opened, Completed).
- **Activity Timeline**: Vertical event log showing real-time timestamps (e.g., "Gift Sealed", "Email Delivered", "Link Opened", "Celebration Completed", "Hidden Note Found").
- **Content Overview Cards**: Read-only cards summarizing message, photo count, hidden surprises count, music link, and Memory Gate settings.
- **Action Toolbar**: "Edit Gift" (if before cutoff), "Cancel Delivery", "Duplicate Gift".

#### Component Breakdown
- `StatusBadge`: Color-coded pill reflecting live delivery state.
- `EngagementTimeline`: Interactive list with icon indicators for open/completion/discovery events.
- `ActionButtonGroup`: Edit, Cancel, Duplicate control buttons.

#### Interaction Logic
- If status is `Sealed` and before delivery cutoff window, tapping "Edit Gift" opens builder steps.
- Tapping "Duplicate Gift" creates a copy draft with pre-filled content.
- Tapping "Cancel Delivery" opens confirmation dialog before revoking delivery job.

#### Empty States
- Timeline shows single event ("Gift Sealed — Awaiting Scheduled Delivery Time").

#### Error States
- **Fetch Failure**: Displays retry prompt banner.

---

### 4.12 Edit Locked State

#### Purpose
Explain clearly when a gift is past its editing cutoff window while preserving read-only access and duplication capability.

#### Layout Hierarchy
- **Header Alert**: Lock icon with message ("This gift is locked for delivery").
- **Cutoff Timeline Notice**: Explains cutoff timestamp and estimated delivery countdown.
- **Read-Only Content Snapshot**: Non-editable view of message, photos, and settings.
- **Primary CTA**: "Duplicate as New Gift".

#### Component Breakdown
- `LockStateBanner`: High-contrast informational alert block.
- `AppButton`: Duplication action button.

#### Interaction Logic
- All form inputs are disabled/read-only.
- Tapping "Duplicate as New Gift" copies all content into a fresh draft for a different recipient or future date.

#### Empty States
- N/A.

#### Error States
- N/A.

---

### 4.13 Delivery Failure State

#### Purpose
Surface delivery failures (e.g., bounced recipient email) immediately with clear, stress-free recovery options.

#### Layout Hierarchy
- **Alert Banner**: Critical warning banner ("Delivery couldn't be completed").
- **Diagnostic Details**: Recipient email address, error timestamp, bounce reason summary.
- **Recovery Actions**:
  - "Update Email & Resend" primary CTA.
  - "Copy Private Reveal Link" direct fallback link.

#### Component Breakdown
- `AlertBanner`: Red error container with warning icon.
- `AppTextField`: Recipient email correction field.
- `ClipboardButton`: One-tap copy link control.

#### Interaction Logic
- Sender updates email and taps "Resend Now"; enqueues immediate worker send job.
- Sender can tap "Copy Private Reveal Link" to manually send the URL via personal messaging app.

#### Empty States
- N/A.

#### Error States
- **Resend Failure**: Provides direct manual link copying as ultimate fallback.

---

### 4.14 Themed Birthday Email (Recipient Inbox)

#### Purpose
Serve as an elegant, mystery-building invitation matched to the chosen World theme.

#### Layout Hierarchy
- **Email Container**: Responsive HTML email rendered with World visual design system (Starlight Loft, Midnight Garden, Arcade Cabinet).
- **Visual Banner**: High-resolution themed graphic header.
- **Personal Invitation Copy**: Recipient name, sender teaser line.
- **Single CTA**: "Open Your Gift" button linking to private reveal URL.

#### Component Breakdown
- `EmailHeaderGraphic`: World-themed artwork.
- `EmailCallToAction`: High-visibility button.

#### Interaction Logic
- Tapping "Open Your Gift" opens the web browser to the secure reveal URL (`/public/reveals/:token`).

#### Empty States
- N/A.

#### Error States
- N/A.

---

### 4.15 Pre-Load & Boot Sequence (Web Reveal)

#### Purpose
Block WebGL rendering smoothly while downloading 3D assets, turning asset loading into an atmospheric curtain rise.

#### Layout Hierarchy
- **Full-Screen Stage**: Ambient background color matching World theme.
- **Atmospheric Visual**: Subtle glowing particles or ambient lighting animation.
- **Progress Bar & Copy**: Minimal progress indicator ("Building your world... 68%").

#### Component Breakdown
- `PreloadOverlay`: DOM layer blocking 3D scene until assets exist in GPU memory.
- `ProgressBar`: Smooth animated indicator line.

#### Interaction Logic
- Asset loader downloads `.glb` models, texture atlases, photo assets, and ambient audio files.
- Once assets are 100% loaded, `PreloadOverlay` fades out smoothly over 800ms.
- Triggers camera swoop sequence (Screen 4.17).

#### Empty States
- N/A.

#### Error States
- **Asset Network Timeout**: Displays soft retry button ("Network is slow. Tap to resume loading").

---

### 4.16 Pre-Birthday Countdown (Early Open State)

#### Purpose
Handle early reveal link opens gracefully, transforming an error into an interactive anticipation feature.

#### Layout Hierarchy
- **Centered 3D Stage**: Pre-rendered World atmosphere containing the sealed 3D gift box.
- **Interactive Elements**: Sealed gift box that reacts to tap/touch with bouncy physical feedback.
- **Countdown Clock**: Stylized ticking countdown to recipient's local midnight.
- **Teaser Message**: "Your surprise is locked until your birthday!"

#### Component Breakdown
- `InteractiveSealedGift`: Bouncy 3D gift object with spring restitution.
- `CountdownTimer`: Real-time clock counter.

#### Interaction Logic
- Tapping or dragging the sealed gift box causes it to wobble, emit soft sound effects, and bounce off screen boundaries.
- Content remains completely locked until `scheduled_send_at_utc` passes.

#### Empty States
- N/A.

#### Error States
- N/A.

---

### 4.17 Cinematic Entry & Camera Swoop

#### Purpose
Deliver a sense of arrival by swooping the camera into the World and revealing the recipient's name woven into the 3D environment.

#### ASCII Layout Blueprint
```text
┌─────────────────────────────────────────────────────────────────────────┐
│ 3D SPATIAL REVEAL CANVAS                                                │
│                                                                         │
│                  [ CAMERA SWOOP PATH (2 Seconds) ]                      │
│                  │                                                      │
│                  ▼                                                      │
│            ┌────────────────────────────────────────┐                   │
│            │  3D RECIPIENT NAME IN ENVIRONMENT      │                   │
│            │  " HAPPY BIRTHDAY MAYA "               │                   │
│            └────────────────────────────────────────┘                   │
│                                                                         │
│                     ┌──────────────────────┐                            │
│                     │  SEALED 3D GIFT BOX  │                            │
│                     │  (Gently Bouncing)   │                            │
│                     └──────────────────────┘                            │
│                                                                         │
│                      [ Swipe Up to Unwrap ▲ ]                           │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Component Breakdown
- `CinematicCameraManager`: Three.js camera controller executing scripted lerp paths.
- `EnvironmentNameMesh`: 3D text geometry.

#### Interaction Logic
- Camera begins high and wide, lerping down over 2 seconds to focus on the sealed gift box.
- Ambient audio texture fades in smoothly.
- Control hands over to the recipient; subtle swipe prompt appears ("Swipe up to unwrap").

#### Empty States
- N/A.

#### Error States
- N/A.

---

### 4.18 Playful Memory Gate (Optional)

#### Purpose
Create an anticipation barrier if enabled by sender, using playful failure logic and auto-bypass to prevent frustration.

#### Layout Hierarchy
- **Floating Glass Card**: Overlay container positioned in 3D scene space.
- **Riddle Content**: Sender's custom question.
- **Input Field**: Answer text field with single-tap submit.
- **Attempt Counter**: Subtle indicator ("Attempt 1 of 3").

#### Component Breakdown
- `MemoryGateCard`: Glassmorphism overlay card.
- `AppTextField`: Input field.

#### Interaction Logic
- Recipient enters answer; backend checks normalized salted hash.
- **Success**: Card dissolves into particle sparklers, camera zooms deeper into gift.
- **Failure (Attempts 1-2)**: Card shakes gently; friendly copy ("Not quite! Try again.").
- **Failure (Attempt 3)**: Auto-bypasses with playful copy ("Close enough! Happy Birthday anyway! 🎉") and unlocks content automatically.

#### Empty States
- N/A.

#### Error States
- **Network Error during check**: Auto-bypasses to avoid gating the birthday experience.

---

### 4.19 Interactive Unwrapping & Physical Reveal

#### Purpose
Deliver the core birthday surprise through multi-layer, gesture-driven unboxing featuring live physics, camera zoom transitions, and building audio.

#### Layout Hierarchy
- **Full-Screen Interactive 3D Stage**:
  - **Layer 1 (Unwrapping)**: Sealed gift wrapper responding to swipe-up physics gestures.
  - **Layer 2 (Headline & Message)**: 3D Greeting Card unfurls; camera lerps close for comfortable reading.
  - **Layer 3 (Memories Photo Deck)**: Floating photo items pinned/placed in spatial 3D.
  - **Layer 4 (Audio Building)**: Sender's music URL fades in progressively as scrolling/swiping advances.

#### Component Breakdown
- `PhysicsWrapperMesh`: Peeling wrapping paper simulation (Rapier.js WASM physics).
- `MessageCardMesh`: Unfurling card mesh with text texture atlas.
- `PhotoCarousel3D`: Momentum-preserving photo carousel with inertia deceleration.
- `AudioFadeController`: Web Audio API progressive volume scaler.

#### Interaction Logic
- **Swipe Up**: Wrapping paper peels away with realistic friction and settles onto the ground plane.
- **Tap Photo**: Camera zooms closer to photo (`lerp`); background dims softly; tap again or swipe horizontal to browse next photo.
- **Scroll / Drag**: Advances reveal depth; music volume scales smoothly up to 100%.

#### Empty States
- **No Photos Uploaded**: Photo section omitted cleanly; camera transitions directly from Message to Celebration.
- **No Music Attached**: Ambient World audio texture continues cleanly throughout.

#### Error States
- **Image Load Error**: Renders framed placeholder image card with soft gradient fallback.
- **Audio Autoplay Blocked**: Displays non-intrusive floating music control pill ("Tap to play audio 🎵").

---

### 4.20 Celebration Apex & Procedural Sandbox

#### Purpose
Provide the emotional climax of the experience with boundary-colliding confetti physics, prominent name display, procedurally scattered hidden surprises, and an unhurried replay sandbox.

#### ASCII Layout Blueprint
```text
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                🎉 HAPPY BIRTHDAY MAYA! 🎉                               │
│              ( Illuminated 3D Text at Apex )                            │
│                                                                         │
│      *   .    *      .    *      .     *      .    *     .    *         │
│    *   ┌───────┐  *   ┌───────┐   *  ┌───────┐  *  ┌───────┐   *       │
│   .    │Photo 1│ .    │Photo 2│  .   │Photo 3│ .   │Photo 4│  .        │
│        └───────┘      └───────┘      └───────┘     └───────┘           │
│                                                                         │
│    [ Procedurally Scattered Hidden Notes & Extra Photos Tucked          │
│      in Corners / Behind Objects at Safe Node Coordinates ]             │
│                                                                         │
│   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~       │
│   [ Live Rapier.js Confetti Particles Bouncing Off Screen Floor ]       │
│   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~       │
│                                                                         │
│              [ ↺ Replay Experience ]    [ 🔍 Explore World ]             │
└─────────────────────────────────────────────────────────────────────────┘
```

#### Component Breakdown
- `ConfettiPhysicsSystem`: Rapier.js body particles with screen boundary collision bounds.
- `ProceduralScatterEngine`: Three.js runtime loop instantiating sender's hidden surprises onto Blender helper nodes.
- `FloatingReplayBar`: Frosted glass control bar.

#### Interaction Logic
- Confetti particles fall, bounce off screen edges, and settle realistically on the floor.
- **Procedural Exploration**: Extra photos and hidden text notes drop into pre-computed invisible spawn nodes around the map. Tapping a hidden object triggers a camera lerp zoom and records an `easter_egg_found` event.
- **Shake Gesture (Mobile)** or **Tap Anywhere**: Triggers additional mini confetti particle bursts.
- **Tap "Replay"**: Smoothly resets camera to initial entry swoop without re-downloading assets.

#### Empty States
- N/A.

#### Error States
- N/A.

---

### 4.21 Invalid / Expired Link

#### Purpose
Handle invalid, tampered, or expired reveal links safely without exposing privacy-sensitive information.

#### Layout Hierarchy
- **Centered Glass Card**: Calm error message block.
- **Copy**: "This reveal link is no longer active or may be invalid."
- **Action**: "Contact the person who sent this gift for a new link."

#### Component Breakdown
- `StateCard`: Glassmorphism error container.

#### Interaction Logic
- Displays privacy-safe copy without revealing recipient or sender details.

#### Empty States
- N/A.

#### Error States
- N/A.

---

### 4.22 Generic Error Screen & 4.23 404 Not Found

#### Purpose
Provide clean, non-disruptive fallbacks for unexpected system exceptions or broken navigation routes.

#### Layout Hierarchy
- **Centered Minimal Card**: Icon, plain-language description, "Return Home" CTA.

#### Component Breakdown
- `AppButton`: Return navigation trigger.

---

## 5. Interaction Matrix & Adaptive Performance Tiers

| Gesture / Input | Full WebGL Tier (High-End) | Canvas 2D Tier (Mid-Tier) | CSS Fallback Tier (Low-End / Reduced Motion) |
|---|---|---|---|
| **Single Tap** | Spring-damped 3D mesh bounce | 2D canvas scale spring | CSS transform pulse animation |
| **Swipe Up (Unwrap)** | WASM paper mesh peeling & tearing | 2D canvas sliding cover with friction | CSS fade-out transition |
| **Horizontal Swipe** | Spatial 3D photo carousel lerp | 2D canvas momentum carousel | Standard horizontal scrollbar |
| **Shake Device** | 3D Rapier particle explosion | 2D canvas particle spray | Static CSS celebration glow |
| **Celebration Confetti** | 3D rigid-body boundary collisions | 2D canvas bouncing dots | CSS falling confetti animation |

---

## 6. Accessibility (a11y) & Inclusivity Specifications

1. **`prefers-reduced-motion` Respect**: Automatically routes recipients to the **CSS Fallback Tier**. Camera swoops are replaced with smooth opacity fades; confetti physics are replaced with static decorative accents.
2. **Screen Reader Live Announcements**: Key state transitions announce via hidden `aria-live="polite"` regions:
   - *"Loading world complete. Unwrapping stage ready."*
   - *"Opened birthday greeting from Alex."*
   - *"Memory Gate unlocked successfully."*
   - *"Found hidden secret note in the garden."*
3. **Touch & Click Standards**: All interactive collision targets on 3D meshes maintain a minimum 44x44px hit-box projection boundary on the 2D viewport.

---

## 7. Automatic Procedural Object Scattering System Specification

To prevent level-design friction (where senders spend 45+ minutes manually placing 3D items), Birthday Reveal v2.0 uses an **automatic procedural scattering engine**.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ PROCEDURAL SCATTERING ARCHITECTURE                                      │
│                                                                         │
│  [Blender Map Design] ──► [Invisible Nodes: spawn_easter_egg_01..12]    │
│                                      │                                  │
│  [Sender Builder UI]  ──► [Hidden Surprises Bucket (Notes/Photos)]        │
│                                      │                                  │
│  [Three.js Engine]    ──► 1. Parse & Shuffle Node Coordinates           │
│                           2. Map Sender Bucket Items to Nodes           │
│                           3. Raycast Downward Ground-Snap Protection    │
│                           4. Dynamically Instantiate 3D Items           │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.1 Invisible Spawn Nodes (Blender Setup)
When modeling World scenes (*Starlight Loft*, *Midnight Garden*, *Arcade Cabinet*) in Blender:
- Place 12–16 empty helper objects strategically around the environment (tucked in corners, resting behind furniture/trees, floating near ambient lighting).
- Name helper nodes with a strict prefix convention: `spawn_easter_egg_01`, `spawn_easter_egg_02`, etc.
- Export nodes directly within the primary compressed `.glb` scene.

### 7.2 Sender UI ("Hidden Surprises" Bucket)
In Step 3 of the Gift Builder (Assembly Canvas):
- Senders see an optional section called **"Hidden Surprises"**.
- Senders drop extra photos or type short inside-joke text notes (up to 140 chars).
- **Zero X/Y/Z coordinate setup required**: The sender simply drops items into the bucket and trusts the system to hide them safely.

### 7.3 Procedural Distribution Loop (Three.js Runtime)
When the recipient reaches the reveal stage / sandbox mode:
1. **Node Extraction**: Three.js traverses loaded scene hierarchy and extracts position/rotation vectors for all meshes matching `/^spawn_easter_egg_/i`.
2. **Fisher-Yates Shuffle**: Shuffles extracted coordinate nodes to ensure random layout variations across gifts.
3. **Item Binding**: Iterates through sender's "Hidden Surprises" manifest array and binds each item to a shuffled coordinate node.
4. **Dynamic Instantiation**: Instantiates 3D frame meshes (for photos) or rolled parchment meshes (for notes) at target coordinates.

### 7.4 Bounding Box & Raycast Surface Protection
To guarantee dynamically spawned objects never clip into geometry or hover unnaturally:
- At spawn time, the engine casts a downward raycast (`THREE.Raycaster`) from the spawn coordinate vector `(x, y + 2.0, z)` along vector `(0, -1, 0)`.
- Upon intersection with the solid ground or surface mesh, the object's `position.y` snaps perfectly to `hitPoint.y + meshHalfHeight`.
- Ensures 100% reliable physical placement across all World geometries.

---

## 8. Summary

This UX Breakdown specification completes the design system for **Birthday Reveal v2.0**. It translates technical architecture, product requirements, and procedural 3D scattering logic into an emotionally resonant, interactive, and spatial reality.