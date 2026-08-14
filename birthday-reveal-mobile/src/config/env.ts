/**
 * Environment Configuration
 * Centralized config for API URLs, deep link prefixes, upload limits.
 */

const ENV = {
  development: {
    API_BASE_URL: 'http://localhost:3000/api/v1',
    DEEP_LINK_PREFIX: 'birthdayreveal://',
    CDN_BASE_URL: 'http://localhost:3000/cdn',
    MAX_PHOTO_SIZE_BYTES: 15 * 1024 * 1024, // 15MB
    MAX_PHOTOS_PER_CELEBRATION: 10,
    MAX_HIDDEN_SURPRISES: 12,
    MAX_NOTE_CHARS: 140,
    MAGIC_LINK_RESEND_COOLDOWN_SEC: 60,
    SESSION_TOKEN_KEY: 'br_access_token',
    REFRESH_TOKEN_KEY: 'br_refresh_token',
    MEMORY_GATE_MAX_ATTEMPTS: 3,
    MIN_SCHEDULE_LEAD_MINUTES: 15,
  },
  staging: {
    API_BASE_URL: 'https://staging-api.birthdayreveal.com/api/v1',
    DEEP_LINK_PREFIX: 'birthdayreveal://',
    CDN_BASE_URL: 'https://staging-cdn.birthdayreveal.com',
    MAX_PHOTO_SIZE_BYTES: 15 * 1024 * 1024,
    MAX_PHOTOS_PER_CELEBRATION: 10,
    MAX_HIDDEN_SURPRISES: 12,
    MAX_NOTE_CHARS: 140,
    MAGIC_LINK_RESEND_COOLDOWN_SEC: 60,
    SESSION_TOKEN_KEY: 'br_access_token',
    REFRESH_TOKEN_KEY: 'br_refresh_token',
    MEMORY_GATE_MAX_ATTEMPTS: 3,
    MIN_SCHEDULE_LEAD_MINUTES: 15,
  },
  production: {
    API_BASE_URL: 'https://api.birthdayreveal.com/api/v1',
    DEEP_LINK_PREFIX: 'birthdayreveal://',
    CDN_BASE_URL: 'https://cdn.birthdayreveal.com',
    MAX_PHOTO_SIZE_BYTES: 15 * 1024 * 1024,
    MAX_PHOTOS_PER_CELEBRATION: 10,
    MAX_HIDDEN_SURPRISES: 12,
    MAX_NOTE_CHARS: 140,
    MAGIC_LINK_RESEND_COOLDOWN_SEC: 60,
    SESSION_TOKEN_KEY: 'br_access_token',
    REFRESH_TOKEN_KEY: 'br_refresh_token',
    MEMORY_GATE_MAX_ATTEMPTS: 3,
    MIN_SCHEDULE_LEAD_MINUTES: 15,
  },
} as const;

type Environment = keyof typeof ENV;

function getEnvironment(): Environment {
  // Override via env variable or default to dev
  return (__DEV__ ? 'development' : 'production') as Environment;
}

export const config = ENV[getEnvironment()];
export type AppConfig = typeof config;
