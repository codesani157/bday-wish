# Birthday Reveal Web — Comprehensive A-to-Z Codebase & Architecture Guide 🎁

Welcome to the definitive documentation for the **`birthday-reveal-web`** frontend application. This guide explains **every single file** in the project directory in complete detail. Whether you are a non-technical stakeholder trying to understand the product flow or a software engineer debugging low-level 3D WebGL physics, this document is structured for future reference and zero-friction maintenance.

---

## 🧭 Executive Summary & Core Concept

`birthday-reveal-web` is a high-performance 3D web experience that acts as the recipient-facing reveal stage for the Birthday Reveal platform. When a recipient opens their unique link (`https://reveal.domain.com/?token=<UUID>`), the application:
1. **Audits System Capabilities (`TierDetector`)**: Evaluates GPU/CPU hardware capabilities to choose between 60FPS 3D physics, simplified canvas rendering, or CSS fallback mode.
2. **Authenticates & Fetches (`App.tsx`)**: Queries the backend API (`GET /public/reveals/:token`) to verify time locks, sender messages, and world selections.
3. **Preloads Assets (`AssetLoader`)**: Blocks interaction until GPU textures and 3D geometry are 100% ready.
4. **Enforces Sequential UX (`RevealMachine`)**: Drives the flow through strict finite state machine states: `loading` ➔ `swoop` ➔ `sealed_gift` ➔ `unwrapping` ➔ `memory_gate` ➔ `greeting` ➔ `memories` ➔ `celebration`.
5. **Renders 3D Worlds (`src/worlds/*`)**: Runs React Three Fiber (`@react-three/fiber`) and Rapier WASM physics (`@react-three/rapier`) for physical interaction with the birthday gift box.

---

## 📂 Complete File Tree Map

```text
birthday-reveal-web/
├── index.html                      # HTML5 Root Template
├── package.json                    # Dependencies, Scripts & Metadata
├── package-lock.json               # Lockfile for Dependency Versions
├── vite.config.ts                  # Vite Dev & Build Configuration
├── tsconfig.json                   # TypeScript Project References Root
├── tsconfig.app.json               # TypeScript Compiler Rules (Application Source)
├── tsconfig.node.json              # TypeScript Compiler Rules (Build Tools)
├── public/
│   ├── _headers                    # Cloudflare Pages Security & CSP Headers
│   ├── favicon.svg                 # Browser Tab Icon
│   └── icons.svg                   # Vector Asset Sprite
└── src/
    ├── main.tsx                    # React Root Entry Point
    ├── App.tsx                     # Main Application Controller & API Integration
    ├── index.css                   # Master CSS Design System & Glassmorphism Tokens
    ├── App.css                     # Component Layer CSS Reset
    ├── assets/                     # Static UI Graphics
    │   ├── hero.png
    │   ├── react.svg
    │   └── vite.svg
    ├── core/                       # Foundation Services & State Engine
    │   ├── RevealMachine.ts        # XState v5 State Machine
    │   ├── TierDetector.ts         # Hardware Performance Auditor
    │   └── AssetLoader.tsx         # Drei 3D Asset Loading Overlay
    ├── ui/                         # Interactive Overlays
    │   └── MemoryGateOverlay.tsx   # Glassmorphism Memory Gate Puzzle
    └── worlds/                     # 3D WebGL Physics Scenes
        ├── StarlightLoft.tsx       # Low-Gravity Cosmic World
        ├── MidnightGarden.tsx      # Forest Ambient World with Fireflies
        └── ArcadeCabinet.tsx       # Neon Retro High-Bounce World
```

---

## 🔬 A-to-Z Detailed File Inventory

---

### 1. Root Build & Configuration Files

#### 📄 `index.html`
- **What it is**: The standard HTML5 document loaded by the recipient's browser.
- **Non-Technical Explanation**: The blank canvas on which the web application mounts.
- **Technical & Debugger Details**:
  - Contains `<div id="root"></div>`, which is target number one for React rendering.
  - Loads the Google Fonts `Outfit` and `Inter` asynchronously.
  - Imports `/src/main.tsx` directly as an ES module during Vite development.

#### 📄 `package.json`
- **What it is**: Manifest defining project metadata, execution scripts, and npm dependencies.
- **Non-Technical Explanation**: The shopping list and master controls for building the application.
- **Technical & Debugger Details**:
  - **Scripts**:
    - `dev`: Launches Vite development server on port 5173.
    - `build`: Runs `tsc -b` (TypeScript check) followed by `vite build` to output production static assets in `dist/`.
  - **Core Production Dependencies**:
    - `@react-three/fiber` (`^9.7.0`): React renderer for Three.js.
    - `@react-three/drei` (`^10.7.8`): Utility helpers for Three.js (orbit controls, float wrappers, environment maps).
    - `@react-three/rapier` (`^2.2.0`): React wrapper for Rapier WASM physics engine.
    - `@xstate/react` & `xstate` (`^5.32.5`): Finite state machine management.
    - `canvas-confetti` (`^1.9.4`): Hardware-accelerated 2D canvas confetti particle system.

#### 📄 `vite.config.ts`
- **What it is**: The configuration file for Vite, the ultra-fast web bundler.
- **Non-Technical Explanation**: The factory settings that turn raw code files into a fast website.
- **Technical & Debugger Details**:
  - Registers `@vitejs/plugin-react` to support JSX transformation and Fast Refresh (HMR).
  - Handles WebAssembly (WASM) loading required by `@dimforge/rapier3d-compat`.

#### 📄 `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- **What it is**: TypeScript configuration files establishing code type checking.
- **Non-Technical Explanation**: The automated proofreader preventing coding bugs.
- **Technical & Debugger Details**:
  - `tsconfig.json`: Root reference linking application code and build scripts.
  - `tsconfig.app.json`: Targets `es2023` and `DOM`, enforces `noUnusedLocals`, `noUnusedParameters`, and `moduleResolution: "bundler"`.
  - `tsconfig.node.json`: Configures environment for build tooling scripts (`vite.config.ts`).

---

### 2. Public Static Assets (`public/`)

#### 📄 `public/_headers`
- **What it is**: Cloudflare Pages / hosting header configuration file.
- **Non-Technical Explanation**: The security guard restricting unauthorized servers from communicating with the website.
- **Technical & Debugger Details**:
  - Defines Content Security Policy (CSP):
    `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.cloudflare.net https://*.r2.cloudflarestorage.com; connect-src 'self' http://localhost:3000 https://api.birthdayreveal.com; font-src 'self' data:; media-src 'self' blob:; worker-src 'self' blob:;`
  - Allows inline scripts for WASM initializers and R2 storage asset fetches.

#### 📄 `public/favicon.svg` & `public/icons.svg`
- **What it is**: Vector icon files for browser tab displays and UI graphics.

---

### 3. Application Entry & Design System (`src/`)

#### 📄 `src/main.tsx`
- **What it is**: The JavaScript entry point executed when the web browser opens the site.
- **Non-Technical Explanation**: The key in the ignition that turns on React.
- **Technical & Debugger Details**:
  - Calls `createRoot(document.getElementById('root')!)`.
  - Wraps `<App />` inside React's `<StrictMode>` to highlight potential lifecycle side-effects during development.

#### 📄 `src/index.css`
- **What it is**: Master CSS stylesheet containing the visual design system, glassmorphism UI rules, fonts, and custom animations.
- **Non-Technical Explanation**: The paint, typography, and styling instructions for the entire site.
- **Technical & Debugger Details**:
  - Imports Google Fonts: `Outfit` (Headings) and `Inter` (Body).
  - Establishes CSS custom properties (variables):
    - `--color-brand`: `#e94560`
    - `--glass-bg`: `rgba(255, 255, 255, 0.08)`
    - `--glass-border`: `rgba(255, 255, 255, 0.15)`
  - **Keyframes**: `@keyframes fadeInScale`, `@keyframes float`, `@keyframes pulseGlow`.
  - **Utility Classes**:
    - `.glass-panel`: Applies `backdrop-filter: blur(16px)` with semi-transparent border and heavy box-shadow.
    - `.btn-premium`: Gradient button with hover transforms and glowing shadow effects.

#### 📄 `src/App.css`
- **What it is**: Secondary style file (superseded by `index.css`).

#### 📄 `src/App.tsx`
- **What it is**: Main application orchestrator, API client controller, and state-driven UI renderer.
- **Non-Technical Explanation**: The central director that fetches the recipient's gift data from the server, handles loading screens, renders overlays, and switches between 3D worlds.
- **Technical & Debugger Details**:
  - **URL Token Extraction**: Parses `new URLSearchParams(window.location.search).get('token')`.
  - **API Integration**: Performs HTTP GET to `${API_BASE}/public/reveals/${token}`. Returns `mode: 'countdown'` or `mode: 'reveal'` payload containing `celebration` data and `worldConfig`.
  - **Telemetry Pipeline**: Dispatches HTTP POST to `${API_BASE}/public/reveals/${celebration.id}/events` for events `link_opened` and `celebration_reached`.
  - **XState Machine Hook**: `const [state, send] = useMachine(revealMachine)`.
  - **Confetti Physics**: Fires 5-second confetti loop via `canvas-confetti` when `state.matches('celebration')`.
  - **Dynamic World Switcher**: Evaluates `payload.worldConfig.key` and dynamically mounts `<StarlightLoft />`, `<MidnightGarden />`, or `<ArcadeCabinet />` inside a `<Suspense>` wrapper.

---

### 4. Core Logic (`src/core/`)

#### 📄 `src/core/RevealMachine.ts`
- **What it is**: XState finite state machine governing the exact sequence of reveal stages.
- **Non-Technical Explanation**: The unbypassable rulebook ensuring steps happen in order (e.g., you cannot celebrate before unlocking the gift).
- **Technical & Debugger Details**:
  - **States**:
    1. `loading`: Waits for `ASSETS_LOADED`.
    2. `swoop`: Camera entrance animation; waits for `SWOOP_DONE`.
    3. `sealed_gift`: Gift floating in 3D scene; waits for `TAP_GIFT`.
    4. `unwrapping`: Gift unwrapping physics active; waits for `UNWRAP_DONE`.
    5. `memory_gate`: Prompts recipient with Memory Gate overlay; waits for `PROMPT_PASSED`.
    6. `greeting`: Displays headline & personalized message; waits for `NEXT`.
    7. `memories`: Displays photo/surprise gallery; waits for `NEXT`.
    8. `celebration`: Fires confetti explosion & shows replay button; accepts `REPLAY`.

#### 📄 `src/core/TierDetector.ts`
- **What it is**: Device hardware benchmarking module.
- **Non-Technical Explanation**: A system inspector that tests if the device is fast enough for full 3D graphics or needs simpler graphics to avoid lagging.
- **Technical & Debugger Details**:
  - `TierDetector.detect(): PerformanceTier` returning `'full' | 'canvas' | 'css'`.
  - **Rules**:
    - Checks `prefers-reduced-motion: reduce` ➔ returns `'css'`.
    - Checks WebGL/WebGL2 context availability ➔ if unavailable, returns `'css'`.
    - Checks `navigator.hardwareConcurrency` ➔ if $\ge 4$ CPU cores returns `'full'`, else returns `'canvas'`.

#### 📄 `src/core/AssetLoader.tsx`
- **What it is**: Loading screen component reflecting Drei loading progress.
- **Non-Technical Explanation**: The progress bar showing how much of the 3D scene has downloaded.
- **Technical & Debugger Details**:
  - Uses `useProgress()` from `@react-three/drei` (`progress`, `loaded`, `total`).
  - Smoothly fades opacity from `1` to `0` when `progress === 100` before triggering `onComplete()`.

---

### 5. UI Overlays (`src/ui/`)

#### 📄 `src/ui/MemoryGateOverlay.tsx`
- **What it is**: The security prompt overlay requiring the recipient to answer a personal memory question.
- **Non-Technical Explanation**: The digital lock on the gift asking a secret shared question.
- **Technical & Debugger Details**:
  - Renders inside a `.glass-panel` container with a lock icon.
  - Accepts `promptQuestion`, `correctAnswer`, and `onPassed` callback.
  - Features localized error state: triggers CSS `@keyframes shake` on incorrect answers.
  - Built-in fail-safe: automatically bypasses and grants access after 3 unsuccessful attempts (`attempts >= 2`).

---

### 6. 3D WebGL Physics Scenes (`src/worlds/`)

#### 📄 `src/worlds/StarlightLoft.tsx`
- **What it is**: Low-gravity cosmic 3D environment scene.
- **Non-Technical Explanation**: A peaceful space loft where the gift box floats gently in zero gravity.
- **Technical & Debugger Details**:
  - **Camera**: `<PerspectiveCamera position={[0, 5, 10]} fov={50} />`.
  - **Physics Environment**: `<Physics gravity={[0, -6, 0]}>` (low gravity).
  - **3D Components**:
    - Floor: `<Box args={[20, 0.5, 20]}>` fixed rigid body.
    - Gift: Floating `<RigidBody colliders="cuboid" restitution={0.5} mass={1}>` inside `<Float>`.
  - **Interaction**: Clicking gift applies upward `impulse` and random rotational `torqueImpulse`.
  - **Easter Egg**: Tapping 5 times turns gift material gold (`#ffd700`) with metallic reflectance (`metalness={1}`).

#### 📄 `src/worlds/MidnightGarden.tsx`
- **What it is**: Atmospheric forest 3D environment scene.
- **Non-Technical Explanation**: A moonlit garden scene with glowing fireflies floating around a gift box.
- **Technical & Debugger Details**:
  - **Camera**: `<PerspectiveCamera position={[0, 6, 12]} fov={55} />`.
  - **VFX**: Includes `<Sparkles count={150} color="#4EFAAF" />` ambient firefly particle system.
  - **Physics Environment**: `<Physics gravity={[0, -9.81, 0]}>` (Earth gravity).
  - **3D Components**:
    - Floor: `<Cylinder args={[15, 15, 0.5, 32]}>` fixed rigid body.
    - Gift: Cylinder hat-box shape `<Cylinder args={[1.2, 1.2, 1.5, 16]}>` rigid body inside `<Float>`.
  - **Easter Egg**: Tapping 5 times turns gift material into glowing cyan (`#4EFAAF`) with active emissive intensity.

#### 📄 `src/worlds/ArcadeCabinet.tsx`
- **What it is**: High-energy retro arcade 3D environment scene.
- **Non-Technical Explanation**: A vibrant neon room where the gift box bounces around like a pinball when tapped.
- **Technical & Debugger Details**:
  - **Camera**: `<PerspectiveCamera position={[0, 4, 8]} fov={60} />`.
  - **VFX**: Includes `<Sparkles count={200} color="#00E5FF" />` neon dust particles.
  - **Physics Environment**: `<Physics gravity={[0, -15, 0]}>` (heavy gravity).
  - **3D Components**:
    - Floor: Highly bouncy `<RigidBody restitution={0.8} friction={0.2}>`.
    - Gift: High restitution cuboid box `<RigidBody restitution={0.9} mass={0.8}>`.
  - **Easter Egg**: Tapping 5 times turns gift into glowing neon magenta (`#FF2A85`) and doubles tap impulse strength.

---

## 🛠 Troubleshooting & Debugging Reference Matrix

| Symptom / Issue | Primary Location to Debug | Troubleshooting Step |
|---|---|---|
| Black screen / Stuck on "LOADING GIFT UNIVERSE" | `src/core/AssetLoader.tsx` & Browser Network Tab | Check if a 3D asset or texture is failing with a 404 HTTP error. |
| "No gift token provided" error message | `src/App.tsx` (line 45) | Verify URL query string contains `?token=<VALID_UUID>`. |
| Gift not responding to clicks / taps | `src/core/RevealMachine.ts` & `src/worlds/*.tsx` | Verify XState machine is in `sealed_gift` state and `onTapGift` handler is connected to `<Box onClick={...}>`. |
| Memory Gate not unlocking | `src/ui/MemoryGateOverlay.tsx` | Inspect `handleSubmit` logic or verify `attempts >= 2` fail-safe trigger. |
| Low framerate / stuttering on mobile devices | `src/core/TierDetector.ts` | Verify hardware concurrency audit. Manually force tier to `'canvas'` or `'css'` to verify performance scaling. |
| Confetti not triggering | `src/App.tsx` (line 80) & `canvas-confetti` | Confirm XState transition reached `celebration` state and `canvas-confetti` script is imported. |

---

## 🚀 How to Add a New 3D World (Step-by-Step)

1. **Create World Component**: Create `src/worlds/MyNewWorld.tsx`.
2. **Implement R3F & Physics Structure**:
   ```tsx
   import { PerspectiveCamera, Environment, Float, Box } from '@react-three/drei';
   import { Physics, RigidBody } from '@react-three/rapier';

   export const MyNewWorld = ({ onTapGift }: { onTapGift?: () => void }) => (
     <>
       <PerspectiveCamera makeDefault position={[0, 5, 10]} />
       <Environment preset="sunset" />
       <Physics gravity={[0, -9.81, 0]}>
         <RigidBody type="fixed">
           <Box args={[10, 0.5, 10]} position={[0, -0.25, 0]} />
         </RigidBody>
         <Float>
           <RigidBody colliders="cuboid">
             <Box args={[1.5, 1.5, 1.5]} onClick={onTapGift} />
           </RigidBody>
         </Float>
       </Physics>
     </>
   );
   ```
3. **Register in `App.tsx`**:
   - Import `MyNewWorld` in `src/App.tsx`.
   - Update `renderWorld()` switch statement:
     ```tsx
     case 'my-new-world': return <MyNewWorld onTapGift={onTap} />;
     ```
4. **Seed in Database**: Ensure `worlds` table in `birthday-reveal-api` contains a record with `key = 'my-new-world'`.
