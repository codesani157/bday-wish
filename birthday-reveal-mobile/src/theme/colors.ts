/**
 * Design System Color Tokens
 * Maps directly to UX Spec Section 2.1 — Color Systems per World.
 */

export const palette = {
  // ─── Global Base ───────────────────────────────────────
  black: '#000000',
  white: '#FFFFFF',
  transparent: 'transparent',

  // ─── Starlight Loft ────────────────────────────────────
  loft: {
    bgPrimary: '#0B132B',
    surface: '#1C2541',
    accentAmber: '#F7D070',
    accentGold: '#E0A96D',
    textMain: '#EDF2F4',
    textMuted: 'rgba(237, 242, 244, 0.55)',
    glowSoft: 'rgba(247, 208, 112, 0.12)',
    glowStrong: 'rgba(247, 208, 112, 0.35)',
  },

  // ─── Midnight Garden ───────────────────────────────────
  garden: {
    bgPrimary: '#0A0F0D',
    surface: '#132A13',
    cyanGlow: '#4EFAAF',
    roseAccent: '#FF758F',
    textMain: '#E8F5E9',
    textMuted: 'rgba(232, 245, 233, 0.55)',
    glowSoft: 'rgba(78, 250, 175, 0.10)',
    glowStrong: 'rgba(78, 250, 175, 0.30)',
  },

  // ─── Arcade Cabinet ────────────────────────────────────
  arcade: {
    bgPrimary: '#1A0933',
    surface: '#2D124D',
    magenta: '#FF2A85',
    electricCyan: '#00F0FF',
    textMain: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.55)',
    glowSoft: 'rgba(255, 42, 133, 0.12)',
    glowStrong: 'rgba(0, 240, 255, 0.35)',
  },

  // ─── Cloud Terrace ─────────────────────────────────────
  cloud: {
    bgPrimary: '#E8F4F8',
    surface: '#FFFFFF',
    paleGold: '#FFD166',
    textMain: '#1D3557',
    textMuted: 'rgba(29, 53, 87, 0.55)',
    glowSoft: 'rgba(255, 209, 102, 0.12)',
    glowStrong: 'rgba(255, 209, 102, 0.35)',
  },

  // ─── Semantic ──────────────────────────────────────────
  error: '#FF4C4C',
  errorSoft: 'rgba(255, 76, 76, 0.12)',
  success: '#4EFAAF',
  successSoft: 'rgba(78, 250, 175, 0.12)',
  warning: '#F7D070',
  warningSoft: 'rgba(247, 208, 112, 0.12)',
} as const;

export type PaletteKey = keyof typeof palette;
export type WorldPalette = typeof palette.loft | typeof palette.garden | typeof palette.arcade | typeof palette.cloud;
