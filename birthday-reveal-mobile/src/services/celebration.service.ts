import { apiClient } from '../api/client';
import type { CelebrationListItemData } from '../types/celebration';

export interface CelebrationDraftPayload {
  recipientName: string;
  recipientEmail: string;
  recipientBirthdate: string; // YYYY-MM-DD
  recipientTimezone: string;
  worldId?: string;
  headline?: string;
  messageBody?: string;
  musicUrl?: string;
  memoryPromptQuestion?: string;
  memoryPromptAnswerHash?: string;
}

export interface Celebration {
  id: string;
  status: 'draft' | 'sealed' | 'sending' | 'delivered' | 'opened' | 'completed' | 'delivery_failed' | 'cancelled';
  recipientName: string;
  recipientEmail: string;
  scheduledSendAtUtc: string | null;
  headline: string;
  messageBody: string;
  musicUrl: string | null;
}

export const celebrationService = {
  createDraft: async (data: CelebrationDraftPayload): Promise<Celebration> => {
    const response = await apiClient.post<Celebration>('/celebrations', data);
    return response.data;
  },

  getCelebration: async (id: string): Promise<Celebration> => {
    const response = await apiClient.get<Celebration>(`/celebrations/${id}`);
    return response.data;
  },

  listCelebrations: async (): Promise<CelebrationListItemData[]> => {
    const response = await apiClient.get<CelebrationListItemData[]>('/celebrations');
    return response.data;
  },

  updateCelebration: async (id: string, data: Partial<CelebrationDraftPayload>): Promise<Celebration> => {
    const response = await apiClient.patch<Celebration>(`/celebrations/${id}`, data);
    return response.data;
  },

  sealCelebration: async (id: string, defaultSendLocalTime: string): Promise<void> => {
    await apiClient.post(`/celebrations/${id}/seal`, { defaultSendLocalTime });
  },
  
  getUploadUrl: async (id: string, metadata: { filename: string, mimeType: string }): Promise<{ uploadUrl: string, storageKey: string }> => {
    const response = await apiClient.post(`/celebrations/${id}/media/upload-url`, metadata);
    return response.data;
  }
};
