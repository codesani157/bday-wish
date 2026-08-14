/**
 * Haptic Feedback Vocabulary
 * Maps to UX Spec Section 2.4 — Haptic & Audio Feedback.
 */

import * as Haptics from 'expo-haptics';

export const haptics = {
  /** Single tap / nudge — light touch */
  tap: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

  /** Swipe unwrap peel — medium resistance */
  swipe: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),

  /** Photo expand — selection click */
  select: () => Haptics.selectionAsync(),

  /** Wax seal impact — heavy stamp */
  sealImpact: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),

  /** Celebration apex — success notification */
  celebrate: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

  /** Shake easter egg — double medium pulse */
  shakeEgg: async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 100);
  },

  /** Error feedback */
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),

  /** Warning feedback */
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
};
