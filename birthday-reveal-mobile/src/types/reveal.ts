/**
 * Recipient Reveal Types
 * Read-only payload and event tracking for the recipient experience.
 */

export type RevealState =
  | 'loading'
  | 'swoop'
  | 'sealed_gift'
  | 'unwrapping'
  | 'greeting'
  | 'memory_gate'
  | 'message'
  | 'memories'
  | 'music_build'
  | 'celebration'
  | 'replay';

export type RevealEventType =
  | 'link_opened'
  | 'tier_detected'
  | 'assets_loaded'
  | 'swoop_completed'
  | 'gift_tapped'
  | 'unwrap_started'
  | 'unwrap_completed'
  | 'prompt_passed'
  | 'prompt_failed'
  | 'prompt_bypassed'
  | 'message_viewed'
  | 'photos_viewed'
  | 'music_started'
  | 'easter_egg_found'
  | 'celebration_reached'
  | 'replay_triggered';

export type PerformanceTier = 'full' | 'canvas' | 'css';

export interface RevealPayload {
  recipientName: string;
  headline: string;
  messageBody: string;
  photos: Array<{
    id: string;
    url: string;
    width: number | null;
    height: number | null;
    sortOrder: number;
  }>;
  hiddenSurprises: Array<{
    id: string;
    type: 'photo' | 'note';
    content: string;
  }>;
  musicUrl: string | null;
  memoryGate: {
    enabled: boolean;
    question: string | null;
  } | null;
  world: {
    key: string;
    displayName: string;
    physics: {
      gravity: { x: number; y: number; z: number };
      restitution: number;
      damping: number;
      particleDensity: number;
      particleType: string;
    };
    assetManifest: Record<string, string>;
    cameraSwoopConfig: Record<string, unknown>;
  };
}

export interface RevealTokenValidation {
  status: 'valid' | 'early' | 'expired' | 'invalid';
  payload?: RevealPayload;
  countdownTo?: string;
  message?: string;
}

export interface RevealEvent {
  eventType: RevealEventType;
  occurredAt: string;
  metadata?: Record<string, unknown>;
}
