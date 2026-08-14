/**
 * Celebration Domain Types
 * Core entities for the gift creation and delivery lifecycle.
 */

export type CelebrationStatus =
  | 'draft'
  | 'sealed'
  | 'sending'
  | 'delivered'
  | 'opened'
  | 'completed'
  | 'delivery_failed'
  | 'cancelled';

export interface CelebrationMedia {
  id: string;
  celebrationId: string;
  storageKey: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  sortOrder: number;
  width: number | null;
  height: number | null;
  uploadStatus: 'pending' | 'confirmed' | 'failed';
  cdnUrl?: string;
  createdAt: string;
}

export interface HiddenSurprise {
  id: string;
  type: 'photo' | 'note';
  content: string; // CDN URL for photos, text content for notes
  sortOrder: number;
}

export interface Celebration {
  id: string;
  senderId: string;
  worldId: string;
  worldKey: string;
  recipientName: string;
  recipientEmail: string;
  recipientBirthdate: string;
  recipientTimezone: string;
  scheduledSendAtUtc: string | null;
  headline: string;
  messageBody: string;
  musicUrl: string | null;
  memoryPromptQuestion: string | null;
  memoryPromptAnswerHash: string | null;
  status: CelebrationStatus;
  media: CelebrationMedia[];
  hiddenSurprises: HiddenSurprise[];
  revealAvailableAtUtc: string | null;
  sentAt: string | null;
  firstOpenedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CelebrationListItemData {
  id: string;
  recipientName: string;
  worldKey: string;
  worldDisplayName: string;
  status: CelebrationStatus;
  scheduledSendAtUtc: string | null;
  sentAt: string | null;
  firstOpenedAt: string | null;
  completedAt: string | null;
  mediaCount: number;
  hiddenSurpriseCount: number;
}

export interface CelebrationDraft {
  recipientName: string;
  recipientEmail: string;
  recipientBirthdate: string;
  recipientTimezone: string;
  worldId: string;
  headline: string;
  messageBody: string;
  musicUrl: string;
  memoryPromptQuestion: string;
  memoryPromptAnswer: string;
  enableMemoryGate: boolean;
}
