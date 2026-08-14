import { apiClient } from '../api/client';

export interface WorldConfig {
  id: string;
  key: string;
  displayName: string;
  description: string;
  gravityX: number;
  gravityY: number;
  gravityZ: number;
  restitution: number;
  damping: number;
  particleType: string;
  particleDensity: number;
  // Excludes complex nested config unless requesting details
}

export const worldService = {
  listWorlds: async (): Promise<WorldConfig[]> => {
    const response = await apiClient.get<WorldConfig[]>('/worlds');
    return response.data;
  },

  getWorldConfig: async (key: string): Promise<WorldConfig> => {
    const response = await apiClient.get<WorldConfig>(`/worlds/${key}`);
    return response.data;
  }
};
