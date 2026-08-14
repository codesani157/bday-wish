/**
 * Navigation Types
 * Type-safe route params for every screen in the app.
 */

export type RootStackParamList = {
  // Auth
  Landing: undefined;
  MagicLinkRequest: undefined;
  MagicLinkVerification: { token: string };

  // Sender
  SenderDashboard: undefined;
  CelebrationDetail: { celebrationId: string };

  // Gift Builder Wizard
  GiftBuilderStep1: { celebrationId?: string };
  GiftBuilderStep2: { celebrationId: string };
  GiftBuilderStep3: { celebrationId: string };
  GiftBuilderStep4: { celebrationId: string };
  GiftBuilderStep5: { celebrationId: string };

  // Recipient
  RevealLoading: { token: string };
  PreBirthdayCountdown: { token: string; countdownTo: string };
  CinematicEntry: { token: string };
  MemoryGate: { token: string; question: string };
  InteractiveReveal: { token: string };
  CelebrationApex: { token: string };
  InvalidLink: undefined;

  // System
  GenericError: { message?: string };
  NotFound: undefined;
};

/**
 * Helper type for screen props
 */
export type ScreenName = keyof RootStackParamList;
