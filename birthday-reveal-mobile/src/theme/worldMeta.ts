import { WorldKey } from '../types/world';

export const worldIcons: Record<WorldKey, string> = {
  'starlight-loft': '✨',
  'midnight-garden': '🌙',
  'arcade-cabinet': '👾',
  'cloud-terrace': '☁️',
};

export const physicsTags: Record<WorldKey, string[]> = {
  'starlight-loft': ['Low Gravity', 'Star Confetti', 'Warm Glow'],
  'midnight-garden': ['Normal Gravity', 'Fireflies', 'Petals'],
  'arcade-cabinet': ['Heavy Gravity', 'Bouncy', 'Pixel FX'],
  'cloud-terrace': ['Float Drift', 'Sunlight', 'Gentle'],
};
