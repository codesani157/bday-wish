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

  // Preview (Replaces native recipient screens)
  WebViewPreview: { token: string };

  // System
  GenericError: { message?: string };
  InvalidLink: undefined;
  NotFound: undefined;
};

/**
 * Helper type for screen props
 */
export type ScreenName = keyof RootStackParamList;
