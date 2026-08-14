/**
 * Authentication Types
 * Magic link + token exchange auth model for mobile.
 */

export interface Sender {
  id: string;
  email: string;
  displayName: string | null;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface AuthSession {
  sender: Sender;
  tokens: AuthTokens;
}

export interface MagicLinkRequest {
  email: string;
}

export interface MagicLinkVerifyRequest {
  token: string;
}

export interface MagicLinkVerifyResponse {
  sender: Sender;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}
