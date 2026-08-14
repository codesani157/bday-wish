# Code Review: birthday-reveal-mobile

> [!NOTE]
> Reviewed all 39 source files across 7 top-level modules. Findings ordered by severity.

---

## 1. Reusability Issues

### 1a. Inline card styles duplicate `AppCard` — 3 locations

[MagicLinkRequestScreen.tsx](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/screens/sender/MagicLinkRequestScreen.tsx#L58-L65), [MemoryPromptGateScreen.tsx](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/screens/recipient/MemoryPromptGateScreen.tsx#L38-L45), and [StateScreen.tsx](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/components/layout/StateScreen.tsx#L64-L72) all manually replicate the `AppCard` visual pattern (`backgroundColor: colors.surface`, `borderColor`, `borderRadius: radii.lg`, `borderWidth: 1`, `padding`). These should compose `AppCard` instead.

```diff
 // MagicLinkRequestScreen.tsx — replace inline card style with AppCard
-<View style={styles.card}>
+<AppCard style={styles.card}>
   ...
-</View>
+</AppCard>
```

### 1b. `StateScreen` vs `EmptyStateView` — overlapping responsibility

Both are "centered message + action(s)" patterns. Key differences:

| Feature | `StateScreen` | `EmptyStateView` |
|---|---|---|
| Wraps in `Screen` | ✅ | ❌ |
| Eyebrow label | ✅ | ❌ |
| Illustration slot | ❌ | ✅ (placeholder circle) |
| Secondary action | ✅ | ❌ |

**Recommendation:** Collapse these into one component. Add an optional `illustration` prop to `StateScreen` and remove `EmptyStateView`. `EmptyDashboardScreen` would compose `Screen` + `TopBar` + `StateScreen` directly.

### 1c. `StickyFooter` is not truly sticky

[StickyFooter.tsx](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/components/layout/StickyFooter.tsx#L10-L11) renders as a normal `View` child inside a `ScrollView`. It scrolls with the content — the name is misleading. To be reusable as a real sticky footer, it needs to sit **outside** the `ScrollView` in `Screen`, using `position: 'absolute'` or a flex split.

**Impact:** Every step screen (RecipientDetails, ThemeSelection, ContentBuilder, Preview, ScheduleConfirm) has a footer that disappears on scroll.

### 1d. No barrel exports for `components/`

`components/primitives/` and `components/layout/` lack `index.ts` files. Every consumer uses deep path imports:

```ts
import { AppButton } from '../../components/primitives/AppButton';
import { AppText } from '../../components/primitives/AppText';
import { AppCard } from '../../components/primitives/AppCard';
```

This makes refactoring (rename, relocate) expensive and clutters screen files with 4–7 import lines for layout/primitives alone.

---

## 2. Naming Inconsistencies

### 2a. `App` prefix is inconsistent and overloaded

| Prefix | Files |
|---|---|
| `App*` | `AppButton`, `AppText`, `AppCard`, `AppTextField`, `AppNavigator` |
| No prefix | `StatusBadge`, `Screen`, `TopBar`, `StickyFooter`, `StepHeader`, `SectionHeader`, `EmptyStateView`, `StateScreen` |

The `App` prefix signals "primitive" for 4 components but also appears on `AppNavigator` (which is infrastructure). Either prefix **all** primitives or **none**.

### 2b. `StateScreen` naming collision

`StateScreen` sounds like it manages application state. It's actually a presentational "message card with actions" layout. A better name: `MessageScreen`, `StatusMessageScreen`, or `FeedbackScreen`.

### 2c. `EmptyDashboardScreen` is a route, not a conditional

The empty state of `SenderDashboard` is a separate **navigation route** instead of a conditional branch within `SenderDashboardScreen`. This leaks UI state into the routing layer. The navigator shouldn't know about "dashboard has items" vs "dashboard is empty."

### 2d. Inconsistent prop naming on `StateScreen`

```ts
primaryActionLabel  / onPrimaryAction    // noun + callback
secondaryActionLabel / onSecondaryAction  // noun + callback
```
Compare `EmptyStateView`:
```ts
actionLabel / onActionPress  // ← different suffix: "Press" vs "Action"
```

Pick one convention. `onPrimaryPress` / `onSecondaryPress` aligns better with React Native norms.

---

## 3. Component Coupling

### 3a. Screens import mock data directly

[SenderDashboardScreen](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/screens/sender/SenderDashboardScreen.tsx#L10) and [CelebrationDetailScreen](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/screens/sender/CelebrationDetailScreen.tsx#L12) import from `../../data/mockCelebrations`. When you add real data fetching, every screen import must change. **Inject data via props or a context/hook** so screens stay data-source agnostic.

### 3b. Feature components reach upward for primitives

Every file in `features/celebrations/components/` imports from `../../../components/primitives/`. This 3-level relative path creates tight coupling between feature and shared layers. If you add barrel exports (see 1d), the import becomes `from '@/components'` or at minimum `from '../../../components'` via a single index.

### 3c. Navigation is hardcoded in screens, not parameterized

[ContentBuilderScreen L68](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/screens/sender/ContentBuilderScreen.tsx#L68): `navigation.navigate('ThemeSelection')` in a "Back" button. The screen knows its position in the wizard sequence. If you reorder steps, you rewrite multiple screens. A `StepWizard` orchestrator or `goBack()` is more resilient.

### 3d. `CelebrationDetailScreen` falls back silently

[CelebrationDetailScreen L23-L24](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/screens/sender/CelebrationDetailScreen.tsx#L23-L24):
```ts
const celebration =
    mockCelebrations.find(...) ?? mockCelebrations[0];
```
If `celebrationId` is invalid, the user sees the **wrong** celebration with no error. This should navigate to `NotFound` or show an error state.

---

## 4. Performance Risks

### 4a. No memoization anywhere

None of the 12 primitives/feature components use `React.memo`. For list-rendered items (`CelebrationListItem`, `ThemeCard`, `TimelineItem`, `StatusSummaryStrip` metric cards) this means every parent re-render re-renders the entire list. Wrap at minimum:

- `CelebrationListItem`
- `ThemeCard`
- `TimelineItem`
- `StatusBadge`

### 4b. `FlatList` not used for any list

[SenderDashboardScreen](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/screens/sender/SenderDashboardScreen.tsx#L32-L38) uses `mockCelebrations.map(...)` inside a `ScrollView` (via `Screen`). Once the list exceeds ~20 items, this will allocate all row views upfront. Switch to `FlatList` with `keyExtractor` and `renderItem`.

Same pattern in [ThemeSelectionScreen](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/screens/sender/ThemeSelectionScreen.tsx#L24-L31) and [CelebrationDetailScreen](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/screens/sender/CelebrationDetailScreen.tsx#L52-L54) (timeline).

### 4c. `Pressable` style function re-creates arrays every render

[AppButton L42-L48](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/components/primitives/AppButton.tsx#L42-L48): The `style` callback creates a new array on every render. For buttons rendered in lists, this generates garbage. Use `useMemo` or `useCallback` for the style function.

### 4d. `ContentBuilderScreen` — 5 independent `useState` calls

[ContentBuilderScreen L16-L20](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/screens/sender/ContentBuilderScreen.tsx#L16-L20): Each keystroke in any field triggers a re-render that re-renders **all** fields and the `PreviewPanel`. Consider `useReducer` or coalescing into a single form state object, and memoizing `PreviewPanel`.

---

## 5. Technical Debt

### 5a. 18 of 22 routes pass `undefined` params

[navigation.ts](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/types/navigation.ts): Only `CelebrationDetail` has params. Routes like `EditLocked`, `DeliveryFailure`, `RevealNotAvailable` will eventually need a `celebrationId` to show context-relevant information. The current types will force a breaking change across all call sites.

**Do now:** Add `celebrationId` (or at least `{ celebrationId?: string }`) to the routes that logically belong to a celebration context: `EditLocked`, `DeliveryFailure`, `Preview`, `ScheduleConfirm`, `ContentBuilder`, `ThemeSelection`, `RecipientDetails`.

### 5b. No path aliases configured

[tsconfig.json](file:///home/samiran/Coding/projects/birthday-reveal-mobile/tsconfig.json) sets `"baseUrl": "."` but defines no `paths`. Add:
```json
"paths": {
  "@/*": ["src/*"]
}
```
This converts `../../components/primitives/AppButton` → `@/components/primitives/AppButton`, reducing cognitive load and making refactoring safer.

### 5c. Hardcoded strings in screens

Multiple screens contain hardcoded recipient data:
- [PreviewScreen L26](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/screens/sender/PreviewScreen.tsx#L26): `"Happy Birthday, Maya"`
- [ScheduleConfirmScreen L26-L32](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/screens/sender/ScheduleConfirmScreen.tsx#L26-L32): `"Maya"`, `"maya@example.com"`, `"August 18, 2026..."`
- [MainRevealScreen L17](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/screens/recipient/MainRevealScreen.tsx#L17): `"Happy Birthday, Maya"`

These should flow from route params or a data context. They're currently indistinguishable from real user data, making it easy to ship mock content to production.

### 5d. Wizard state is not shared across steps

`RecipientDetailsScreen`, `ThemeSelectionScreen`, `ContentBuilderScreen` each have local `useState`. Navigate forward and back and **all data is lost**. The wizard needs a shared store — `React.createContext` + `useReducer` at minimum — to survive navigation transitions.

### 5e. `TopBar` renders an empty `<View />` when no right action

[TopBar.tsx L25](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/components/layout/TopBar.tsx#L25): The empty `<View />` is a spacer hack for `justifyContent: 'space-between'`. Use `marginLeft: 'auto'` on the right action or `flex: 1` on the title instead.

### 5f. `StatusBadge` has raw hex literals outside the theme

[StatusBadge.tsx L10-L15](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/components/primitives/StatusBadge.tsx#L10-L15): Six hex colors (`#F7E8D8`, `#DDE9F5`, `#DDF2E7`, `#E4F4EA`, `#F7E1E1`, `#ECE6DE`) bypass the theme system. Move these into `colors.ts` as semantic tokens (e.g., `statusScheduledBg`, `statusSentBg`).

---

## 6. Structural Improvements

### 6a. Recommended folder restructure

```text
src/
  components/
    index.ts                ← barrel: export all primitives + layout
    primitives/
    layout/
  features/
    celebrations/
      components/
      hooks/                ← useCelebrationData, useCelebrationForm
      context/              ← CelebrationWizardContext
  navigation/
    AppNavigator.tsx
    stacks/                 ← SenderStack.tsx, RecipientStack.tsx
    useAppNavigation.ts
  screens/                  ← unchanged
  data/                     ← unchanged (mock layer)
  theme/                    ← unchanged
  types/                    ← unchanged
```

### 6b. Split the monolithic navigator

[AppNavigator.tsx](file:///home/samiran/Coding/projects/birthday-reveal-mobile/src/navigation/AppNavigator.tsx) registers **21 screens** in a single flat stack. This guarantees:
- The navigator file grows linearly with every screen.
- All 21 screen modules are imported eagerly at startup.
- No logical grouping of sender vs recipient vs system flows.

**Recommended split:**

| Stack | Screens | Entry point |
|---|---|---|
| `AuthStack` | Landing, MagicLinkRequest, MagicLinkVerify | Unauthenticated users |
| `SenderStack` | SenderDashboard, EmptyDashboard*, RecipientDetails, ThemeSelection, ContentBuilder, Preview, ScheduleConfirm, CelebrationDetail, EditLocked, DeliveryFailure | Authenticated senders |
| `RecipientStack` | RevealLoading, MemoryPromptGate, MainReveal, RevealReplay, RevealNotAvailable, InvalidLink | Reveal link recipients |
| `SystemStack` | GenericError, NotFound | Fallback |

*\*EmptyDashboard should be a conditional render inside SenderDashboard, not a separate route.*

### 6c. Add a CelebrationWizardContext

The 5-step sender flow (RecipientDetails → ThemeSelection → ContentBuilder → Preview → ScheduleConfirm) currently has:
- No shared state
- Hardcoded next/back targets
- Independent form state per screen

Introduce a `CelebrationWizardProvider` wrapping the wizard screens with `useReducer` to hold the draft. Each step reads/writes from context instead of local state.

### 6d. Theme: add a `useTheme` hook for future dynamic theming

All components import `colors`, `spacing`, etc. directly. If you later need dark mode or per-celebration themes (paper, midnight, gallery, sunrise), a `useTheme()` hook returning the active token set will avoid rewriting every import.

---

## Summary Severity Matrix

| # | Issue | Severity | Effort |
|---|---|---|---|
| 5d | Wizard state lost on navigation | 🔴 Critical | Medium |
| 3d | Silent fallback on invalid celebrationId | 🔴 Critical | Low |
| 1c | StickyFooter doesn't stick | 🟠 High | Medium |
| 4b | `.map()` instead of `FlatList` | 🟠 High | Low |
| 5c | Hardcoded mock strings in screens | 🟠 High | Medium |
| 3a | Screens import mock data directly | 🟡 Medium | Low |
| 5a | Most routes lack params they'll need | 🟡 Medium | Medium |
| 6b | Monolithic navigator | 🟡 Medium | Medium |
| 4a | No `React.memo` on list items | 🟡 Medium | Low |
| 1b | StateScreen / EmptyStateView overlap | 🟢 Low | Low |
| 2a | Inconsistent `App` prefix | 🟢 Low | Low |
| 5f | Raw hex literals outside theme | 🟢 Low | Low |
