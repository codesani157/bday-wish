# Frontend Code Review — `birthday-reveal-mobile`

Reviewed all 55 source files in the current tree. The prior [`analysis_results.md`](analysis_results.md) references an older structure (`AppCard`, `ThemeSelectionScreen`, etc.) that no longer exists — this review reflects the **current** codebase.

---

## Executive read

You have a well-typed UI shell with a coherent visual language (`GlassCard`, world themes, haptics). The architecture is **presentation-complete, integration-empty**: every screen is a prototype wired to local state and mock data. The highest-risk debt is not styling — it's **the wizard having no memory**, **world theme selection not propagating past Step 2**, and **seven recipient screens that contradict the TRD's web-only reveal**.

---

## 1. Reusability issues

### 1a. World metadata is scattered and inconsistent

The same four worlds are described in three places with **different emoji**:

```24:29:birthday-reveal-mobile/src/components/cards/CelebrationListItem.tsx
const worldEmoji: Record<string, string> = {
  'starlight-loft': '🌟',
  'midnight-garden': '🌿',
  ...
```

```25:37:birthday-reveal-mobile/src/components/cards/WorldCard.tsx
const worldIcons: Record<WorldKey, string> = {
  'starlight-loft': '✨',
  ...
const physicsTags: Record<WorldKey, string[]> = { ... }
```

Physics tags live only in `WorldCard`, while [`mockData.ts`](birthday-reveal-mobile/src/data/mockData.ts) already has full `World` objects with physics configs. **Extract one `worldMeta.ts`** (icon, emoji, tag labels) or derive display tags from `World.physics` at runtime.

### 1b. Progress bar is copy-pasted three times

Identical track/fill pattern appears in:

- [`StepWizardHeader.tsx`](birthday-reveal-mobile/src/components/layout/StepWizardHeader.tsx) (step progress)
- [`RevealLoadingScreen.tsx`](birthday-reveal-mobile/src/screens/recipient/RevealLoadingScreen.tsx) (asset load)
- [`GiftBuilderStep5Screen.tsx`](birthday-reveal-mobile/src/screens/sender/GiftBuilderStep5Screen.tsx) (seal animation)

All hardcode `#F7D070` and `rgba(247,208,112,0.12)`. One `<ProgressBar value={0–1} worldTheme />` component would eliminate drift when worlds change accent colors.

### 1c. "Centered card on dark stage" is a repeated layout

These screens share the same `{ flex: 1, justifyContent: 'center' }` + `GlassCard` pattern:

- `MagicLinkRequestScreen`, `MemoryGateScreen`, `RevealLoadingScreen`, `GiftBuilderStep5Screen`

Extract a **`CenteredStage`** layout (children + optional footer hint) instead of duplicating `styles.centered` in six files.

### 1d. Primitives are half-finished

| Exists | Missing counterpart |
|---|---|
| `AppTextField` | `AppCheckbox` / `AppToggle` — Step 3 hand-rolls a checkbox with hardcoded `#F7D070` |
| `AppButton` | `IconButton` — dashboard "+ Build New Gift" squeezes a full button into header |
| `GlassCard` | `FormSection` — Step 3 repeats label + `GlassCard` + actions boilerplate |
| `StatusBadge` uses raw `Text` | Should compose `AppText` for typography consistency |

### 1e. Barrel exports exist but aren't used as a boundary

[`components/primitives/index.ts`](birthday-reveal-mobile/src/components/primitives/index.ts) and [`layout/index.ts`](birthday-reveal-mobile/src/components/layout/index.ts) exist, yet every screen still deep-imports:

```ts
import { AppButton } from '../../components/primitives/AppButton';
import { AppText } from '../../components/primitives/AppText';
// × 4–7 lines per screen
```

Barrels save nothing until screens import from `@/components`.

### 1f. `GlassCard` doesn't deliver on its name

Comments promise glassmorphism; implementation is a semi-transparent `View` with border. No `expo-blur` / `BlurView`. Not a bug today, but every screen built on `GlassCard` will need a visual pass later — or you'll ship "glass" that isn't.

---

## 2. Naming inconsistencies

### 2a. `App*` prefix applies to 4 of 9 primitives

`AppButton`, `AppText`, `AppTextField` vs `GlassCard`, `StatusBadge`. The prefix doesn't signal a layer — it signals "we started naming and stopped."

**Pick one rule:** either all themed interactives get `App*`, or none do. `GlassCard` is the most-used primitive; if anything gets a prefix, it's the card.

### 2b. `SenderTabs` is a lie

```54:54:birthday-reveal-mobile/src/navigation/RootNavigator.tsx
<Stack.Screen name="SenderTabs" component={SenderDashboardScreen} />
```

There are no tabs. [`SenderTabParamList`](birthday-reveal-mobile/src/types/navigation.ts) (`Dashboard`, `Profile`) is defined but never wired. Rename route to `SenderDashboard` now — every `navigation.reset({ name: 'SenderTabs' })` call will otherwise confuse future tab implementation.

### 2c. Type/component name collision

```typescript
import type { CelebrationListItem as CelebrationListItemType } from '../../types/celebration';
// component also named CelebrationListItem
```

Rename the type to `CelebrationListItemData` or the component to `CelebrationRow` — the alias is a smell that will spread.

### 2d. Screen doc comments leak design-doc IDs

Every file opens with `/** GiftBuilderStep3Screen (Screen 4.8) */`. Useful during design handoff; noise in production. Move screen inventory to a `SCREENS.md` or Storybook catalog.

### 2e. Product language ≠ code language

| Product (PRD) | Code |
|---|---|
| Seal & Schedule | `GiftBuilderStep5` |
| Assembly Canvas | `GiftBuilderStep3` |
| Preview Run | `GiftBuilderStep4` |

Not wrong, but when you add analytics/event names, this mismatch will hurt. Consider `BuilderStep.Seal` enum used in navigation and telemetry.

### 2f. Ghost routes in the type system

[`navigation.ts`](birthday-reveal-mobile/src/types/navigation.ts) declares `EditLocked` and `DeliveryFailure` but [`RootNavigator.tsx`](birthday-reveal-mobile/src/navigation/RootNavigator.tsx) never registers them. TypeScript won't catch `navigation.navigate('EditLocked', …)` if someone adds the call — the route silently won't exist at runtime.

---

## 3. Component coupling

### 3a. Screens are fused to mock data

```18:25:birthday-reveal-mobile/src/screens/sender/SenderDashboardScreen.tsx
import { mockCelebrations } from '../../data/mockData';
...
const celebrations = mockCelebrations;
```

Same pattern in Step 2. When API lands, you'll touch every screen. **One hook** (`useCelebrations()`) returning mock-today / API-tomorrow isolates the swap to a single file.

### 3b. `CelebrationDetailScreen` ignores its route param

The screen accepts `celebrationId` via navigation types but never reads `route.params`. Everything is hardcoded "Maya" + a static timeline. This is worse than a missing screen — it **looks done** while being entirely disconnected.

### 3c. Wizard state is fragmented and non-persistent

Each builder step owns isolated `useState`. Navigate Step 1 → Step 2 → back → **all fields empty**. Step 2 selects a world and applies `activeTheme`, but Step 3 immediately reverts to `defaultTheme`:

```46:46:birthday-reveal-mobile/src/screens/sender/GiftBuilderStep3Screen.tsx
<ScreenContainer worldTheme={defaultTheme}>
```

The PRD's "World choice must feel cohesive from email → loading → reveal" is broken at Step 3 of the builder itself.

### 3d. `celebrationId` is passed but never validated or created

Step 1 navigates with `celebrationId: route.params?.celebrationId ?? 'new-draft'` — a string literal, not a UUID. No step calls the API client in [`client.ts`](birthday-reveal-mobile/src/api/client.ts). The token accessor pattern (`setTokenAccessor`) is ready but nothing calls it.

### 3e. Nested scroll in Step 2

```31:38:birthday-reveal-mobile/src/screens/sender/GiftBuilderStep2Screen.tsx
<ScreenContainer worldTheme={activeTheme}>  {/* scrollable=true by default */}
  ...
  <ScrollView style={styles.worldList}>     {/* inner scroll */}
```

`ScreenContainer` wraps everything in a `ScrollView`; Step 2 adds another. This causes scroll fighting, hides the footer "Next" button on small screens, and is a classic RN footgun. Step 2 should use `scrollable={false}` on the container, or drop the inner `ScrollView`.

### 3f. Recipient flow is a parallel app inside the sender app

Seven recipient screens form a hardcoded chain:

`RevealLoading → CinematicEntry → InteractiveReveal → CelebrationApex`

Memory Gate and PreBirthday Countdown exist but aren't in the chain. Per TRD §4, **recipients use the web reveal** — these screens are sender-preview prototypes that currently read as production routes in a flat 21-screen navigator.

### 3g. Monolithic navigator with eager imports

[`RootNavigator.tsx`](birthday-reveal-mobile/src/navigation/RootNavigator.tsx) imports all 21 screens at module load. No lazy loading, no stack grouping, no auth gate. Adding backend auth will require conditional rendering here — better to split now before the file grows.

---

## 4. Performance risks

### 4a. `CelebrationListItem` urgency pulse opts out of native driver

```40:51:birthday-reveal-mobile/src/components/cards/CelebrationListItem.tsx
Animated.timing(glowAnim, { ... useNativeDriver: false })
```

Animating `opacity` on a border can use `useNativeDriver: true`. With 10+ urgent gifts, this runs opacity on the JS thread every frame.

### 4b. No memoization on list rows

Dashboard uses `FlatList` (good — prior review's `.map()` concern was fixed), but:

```117:122:birthday-reveal-mobile/src/screens/sender/SenderDashboardScreen.tsx
renderItem={({ item }) => (
  <CelebrationListItem item={item} onPress={handleCelebrationPress} ... />
)}
```

`handleCelebrationPress` is stable, but `CelebrationListItem` isn't wrapped in `React.memo`, and `renderItem` is an inline function. Minor now; matters once dashboard polls for engagement updates.

### 4c. `AppTextField` is animation-heavy for forms

Each field owns 2 `Animated.Value` refs + parallel animations on focus/blur. Step 3 renders **8+ fields** when Memory Gate and hidden notes expand — that's 16+ animated values on one screen. Consider:

- Static label (drop float animation) on multiline / secondary fields
- Or a `AppTextField.Simple` variant for builder forms

### 4d. `AppButton` allocates `Animated.Value` per instance

Fine for action buttons; expensive if reused inside lists or tag clouds. World cards already have their own scale animation — two spring systems per card tap.

### 4e. Index keys in dynamic lists

```90:91:birthday-reveal-mobile/src/screens/sender/GiftBuilderStep3Screen.tsx
{photos.map((photo, i) => (
  <View key={i} ...
```

Reordering or deleting photos will cause unnecessary remounts and lost input focus on notes. Use stable IDs (even `photo_${uuid}`).

### 4f. `ScreenContainer` defaults to `scrollable={true}`

Most screens don't need scrolling (dashboard with FlatList, Step 2 with nested scroll, all recipient stages). Defaulting to `ScrollView` adds an unnecessary wrapper and complicates layouts with fixed footers. **Default should be `scrollable={false}`**; opt in where needed.

---

## 5. Technical debt

### 5a. Hardcoded "Maya" is indistinguishable from real data

Appears in placeholders *and* rendered content:

| File | Hardcoded |
|---|---|
| `CinematicEntryScreen` | `HAPPY BIRTHDAY MAYA` |
| `GiftBuilderStep4Screen` | `Happy Birthday Maya!` |
| `GiftBuilderStep5Screen` | `Recipient: Maya (maya@example.com)` |
| `CelebrationDetailScreen` | entire screen |

Placeholders are fine. Rendered copy will ship to production unnoticed. Use `{recipientName || 'Your recipient'}` from wizard context at minimum.

### 5b. Fake integrations that look real

| Screen | Simulates | Risk |
|---|---|---|
| `GiftBuilderStep1` | `simulateAutoSave()` with `setTimeout` | Masks missing PATCH wiring |
| `MagicLinkRequest` | 1.5s delay, no API | Auth flow appears complete |
| `MemoryGateScreen` | always wrong answer until bypass | No `/prompt-check` call |
| `RevealLoadingScreen` | random progress, no assets | Hides real preload requirements |

These should render a visible **"mock mode"** dev badge or guard behind `__DEV__` until wired — otherwise QA reports false bugs and engineers forget what's real.

### 5c. Path aliases configured, unused

[`tsconfig.json`](birthday-reveal-mobile/tsconfig.json) defines `@/*` but **zero imports** use it. Either adopt `@/components`, `@/theme`, `@/types` now, or remove the alias to avoid false expectations. Note: Expo also needs `babel-plugin-module-resolver` for runtime resolution.

### 5d. Missing TRD-mandated dependencies

[`package.json`](birthday-reveal-mobile/package.json) has none of: `@tanstack/react-query`, `zustand`, `react-hook-form`, `zod`, `expo-secure-store`, `expo-linking`, `expo-image-picker`. The types and API client are built for a stack that isn't installed.

### 5e. Recipient screens are architectural debt, not asset

~30% of the codebase (7 screens + types) implements a 2D reveal the TRD explicitly assigns to **Vite + Three.js + Rapier**. Keeping them as navigable routes creates two divergent reveal implementations. Step 4 preview should become a **WebView** to the web reveal URL — the existing recipient screens become dead code to delete or quarantine under `screens/recipient/_prototype/`.

### 5f. Validation logic duplicated

Email regex in `MagicLinkRequestScreen`; inline validation in Step 1. Birthdate is a free-text field with no parsing. When Zod schemas arrive for the API, you'll triplicate rules unless you centralize now in `src/validation/celebration.ts`.

---

## 6. Structural improvements (surgical, not a rewrite)

### A. Introduce a thin feature layer — don't reorganize screens yet

```
src/
  features/
    celebrations/
      hooks/
        useCelebrations.ts      ← mock → API swap point
        useCelebration(id).ts
        useCelebrationDraft.ts  ← wizard reducer
      context/
        BuilderWorldContext.tsx ← selected WorldKey → resolveWorldTheme()
```

Screens stay where they are. Only imports change from `mockData` → hooks. **~4 new files, ~15 import line edits.**

### B. `BuilderWorldContext` — fixes theme regression in one pass

Step 2 sets world; provider wraps Steps 2–5. Replace ~40 occurrences of `worldTheme={defaultTheme}` with `useBuilderWorld()` in builder screens only. Sender auth/dashboard stays on `defaultTheme`.

### C. Split navigator into two stacks + one modal group

```
AuthStack:     Landing → MagicLink*
SenderStack:   Dashboard → Builder* → CelebrationDetail
SystemModal:   GenericError, InvalidLink
PreviewModal:  WebView → {REVEAL_URL}/preview/:token
```

Remove recipient screens from production navigation. Keeps all screen files for reference; stops maintaining two reveal paths.

### D. Extract three micro-primitives (highest ROI)

1. **`ProgressBar`** — used in 3 places today, will be used in upload progress
2. **`CenteredStage`** — auth, memory gate, loading, seal
3. **`worldMeta.ts`** — single source for icons, tags, display copy

Total: ~80 lines of new code, eliminates ~200 lines of duplication.

### E. `ScreenContainer` footer slot — fixes sticky actions without `StickyFooter`

```tsx
<ScreenContainer footer={<AppButton title="Next" ... />}>
  {/* scrollable content */}
</ScreenContainer>
```

Flex split: content scrolls, footer pins. Solves Step 1–5 and Step 2 nested-scroll in one layout change.

### F. Wire the API client boundary before hooks

```
src/
  api/
    client.ts        ← exists
    auth.ts          ← POST request-magic-link, verify
    celebrations.ts  ← CRUD + seal
    worlds.ts        ← GET /worlds
```

Screens never import `client` directly — only domain API modules. Matches the token accessor pattern already started.

### G. Adopt `@/` imports incrementally

Add `babel-plugin-module-resolver` in Expo config. ESLint rule: no imports deeper than `../../` from screens. Migrate one folder (`theme/`, then `components/`) per PR.

---

## Severity matrix

| Issue | Severity | Effort | Fix |
|---|---|---|---|
| Wizard state lost on back-nav | Critical | Medium | `useCelebrationDraft` reducer |
| World theme resets at Step 3 | Critical | Low | `BuilderWorldContext` |
| `CelebrationDetail` ignores route param | Critical | Low | Read `route.params`, or show NotFound |
| Recipient screens vs TRD web reveal | High | Medium | WebView preview; quarantine prototypes |
| Nested scroll in Step 2 | High | Low | `scrollable={false}` on container |
| Hardcoded "Maya" in rendered UI | High | Low | Read from draft context |
| Mock flows look production-ready | High | Low | `__DEV__` badge or mock guard |
| World metadata triplicated | Medium | Low | `worldMeta.ts` |
| `SenderTabs` misnomer | Medium | Low | Rename route |
| Ghost routes in types | Medium | Low | Register screens or remove from types |
| `@/` paths unused | Medium | Low | babel resolver + migrate |
| No memo on list items | Low | Low | `React.memo(CelebrationListItem)` |
| `AppTextField` animation cost | Low | Medium | Simple variant for builder |
| Screen doc comment IDs | Low | Trivial | Strip or move to catalog |

---

## What not to do

- **Don't** refactor all screens into `features/` folders in one pass — high churn, zero user value
- **Don't** add `React.memo` everywhere preemptively — memoize `CelebrationListItem` and `WorldCard` only
- **Don't** invest in polishing recipient RN screens — redirect that energy to WebView + web reveal
- **Don't** rename all `App*` components — pick a convention and apply only to new primitives

The codebase is a strong visual prototype ready for integration. The shortest path to production is: **wizard context → API hooks → WebView preview → delete recipient route debt** — in that order.
