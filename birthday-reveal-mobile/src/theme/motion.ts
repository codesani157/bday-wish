/**
 * Motion & Animation Tokens
 * Maps to UX Spec Section 2.3 — Motion, Easing & Camera Cinematography.
 */

import { Easing } from 'react-native';

export const motion = {
  /** Camera lerp alpha per frame */
  cameraLerpAlpha: 0.06,

  /** Standard easing curves */
  easing: {
    /** Quartic ease-out for camera state transitions */
    cameraSwoop: Easing.bezier(0.25, 1, 0.5, 1),
    /** Standard smooth entry for UI elements */
    enter: Easing.bezier(0.0, 0.0, 0.2, 1),
    /** Smooth exit */
    exit: Easing.bezier(0.4, 0.0, 1, 1),
    /** Snappy spring-like for interactive feedback */
    spring: Easing.bezier(0.175, 0.885, 0.32, 1.275),
    /** Gentle deceleration */
    decelerate: Easing.bezier(0, 0, 0.2, 1),
  },

  /** Duration presets in ms */
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    smooth: 450,
    slow: 600,
    cinematic: 800,
    swoopEntry: 2000,
    sealAnimation: 3500,
    preloadFade: 800,
  },

  /** Spring physics per world — UX Spec Section 2.3 */
  worldSprings: {
    'starlight-loft': { stiffness: 120, damping: 14, mass: 1.0 },
    'midnight-garden': { stiffness: 90, damping: 18, mass: 1.2 },
    'arcade-cabinet': { stiffness: 220, damping: 8, mass: 0.8 },
    'cloud-terrace': { stiffness: 100, damping: 12, mass: 1.0 },
  },
} as const;

export type WorldSpringKey = keyof typeof motion.worldSprings;
