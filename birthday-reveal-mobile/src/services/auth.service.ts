import { apiClient } from '../api/client';
import { tokenService } from './token.service';

export interface AuthSession {
  id: string;
  senderId: string;
  email: string;
  displayName: string | null;
}

export const authService = {
  /**
   * Trigger magic link generation for the given email.
   */
  requestMagicLink: async (email: string): Promise<void> => {
    await apiClient.post('/auth/request-magic-link', { email });
  },

  /**
   * Exchange magic link token for session and access tokens.
   */
  verifyMagicLink: async (token: string): Promise<AuthSession> => {
    const response = await apiClient.post<{ 
      accessToken: string; 
      refreshToken: string; 
      session: AuthSession 
    }>('/auth/verify-magic-link', { token });
    
    await tokenService.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data.session;
  },

  /**
   * Log out the current session and clear tokens.
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      await tokenService.clearTokens();
    }
  },

  /**
   * Retrieve the current session identity.
   */
  getSession: async (): Promise<AuthSession> => {
    const response = await apiClient.get<AuthSession>('/auth/session');
    return response.data;
  },
};
