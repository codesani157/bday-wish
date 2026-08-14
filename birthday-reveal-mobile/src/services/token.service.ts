import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'birthday_reveal_access_token';
const REFRESH_TOKEN_KEY = 'birthday_reveal_refresh_token';

export const tokenService = {
  /**
   * Securely save access and refresh tokens.
   */
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  },

  /**
   * Retrieve the access token.
   */
  async getAccessToken(): Promise<string | null> {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  /**
   * Retrieve the refresh token.
   */
  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  /**
   * Clear tokens on logout or unauthorized error.
   */
  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};
