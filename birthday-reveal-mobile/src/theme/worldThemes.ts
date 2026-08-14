/**
 * World Theme Resolver
 * Returns the correct palette, glassmorphism config, and accent colors
 * for any given WorldKey.
 */

import { palette } from './colors';
import { motion } from './motion';
import type { WorldKey } from '../types/world';

export interface ResolvedWorldTheme {
  bgPrimary: string;
  surface: string;
  accent: string;
  accentSecondary: string;
  textMain: string;
  textMuted: string;
  glowSoft: string;
  glowStrong: string;
  glass: {
    background: string;
    borderColor: string;
    blurIntensity: number;
  };
  spring: { stiffness: number; damping: number; mass: number };
}

const worldThemes: Record<WorldKey, ResolvedWorldTheme> = {
  'starlight-loft': {
    bgPrimary: palette.loft.bgPrimary,
    surface: palette.loft.surface,
    accent: palette.loft.accentAmber,
    accentSecondary: palette.loft.accentGold,
    textMain: palette.loft.textMain,
    textMuted: palette.loft.textMuted,
    glowSoft: palette.loft.glowSoft,
    glowStrong: palette.loft.glowStrong,
    glass: {
      background: 'rgba(28, 37, 65, 0.65)',
      borderColor: 'rgba(247, 208, 112, 0.15)',
      blurIntensity: 12,
    },
    spring: motion.worldSprings['starlight-loft'],
  },
  'midnight-garden': {
    bgPrimary: palette.garden.bgPrimary,
    surface: palette.garden.surface,
    accent: palette.garden.cyanGlow,
    accentSecondary: palette.garden.roseAccent,
    textMain: palette.garden.textMain,
    textMuted: palette.garden.textMuted,
    glowSoft: palette.garden.glowSoft,
    glowStrong: palette.garden.glowStrong,
    glass: {
      background: 'rgba(19, 42, 19, 0.65)',
      borderColor: 'rgba(78, 250, 175, 0.15)',
      blurIntensity: 12,
    },
    spring: motion.worldSprings['midnight-garden'],
  },
  'arcade-cabinet': {
    bgPrimary: palette.arcade.bgPrimary,
    surface: palette.arcade.surface,
    accent: palette.arcade.magenta,
    accentSecondary: palette.arcade.electricCyan,
    textMain: palette.arcade.textMain,
    textMuted: palette.arcade.textMuted,
    glowSoft: palette.arcade.glowSoft,
    glowStrong: palette.arcade.glowStrong,
    glass: {
      background: 'rgba(45, 18, 77, 0.70)',
      borderColor: 'rgba(255, 42, 133, 0.20)',
      blurIntensity: 14,
    },
    spring: motion.worldSprings['arcade-cabinet'],
  },
  'cloud-terrace': {
    bgPrimary: palette.cloud.bgPrimary,
    surface: palette.cloud.surface,
    accent: palette.cloud.paleGold,
    accentSecondary: palette.cloud.textMain,
    textMain: palette.cloud.textMain,
    textMuted: palette.cloud.textMuted,
    glowSoft: palette.cloud.glowSoft,
    glowStrong: palette.cloud.glowStrong,
    glass: {
      background: 'rgba(255, 255, 255, 0.75)',
      borderColor: 'rgba(255, 209, 102, 0.20)',
      blurIntensity: 16,
    },
    spring: motion.worldSprings['cloud-terrace'],
  },
};

/** Resolve full visual theme from a WorldKey */
export function resolveWorldTheme(worldKey: WorldKey): ResolvedWorldTheme {
  return worldThemes[worldKey] ?? worldThemes['starlight-loft'];
}

/** Default app theme (used outside world context) */
export const defaultTheme = worldThemes['starlight-loft'];
