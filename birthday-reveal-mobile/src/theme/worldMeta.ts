import { WorldKey } from '../types/world';

export interface WorldMetadata {
  icon: string;
  emoji: string;
  tags: string[];
}

export const worldMeta: Record<WorldKey, WorldMetadata> = {
  'starlight-loft': {
    icon: '✨',
    emoji: '🌟',
    tags: ['Low Gravity', 'Star Confetti', 'Warm'],
  },
  'midnight-garden': {
    icon: '🌿',
    emoji: '🌿',
    tags: ['Normal Gravity', 'Petal Confetti', 'Cinematic'],
  },
  'arcade-cabinet': {
    icon: '👾',
    emoji: '🕹️',
    tags: ['Heavy Gravity', 'Pixel Confetti', 'Bouncy'],
  },
  'cloud-terrace': {
    icon: '☁️',
    emoji: '🌤️',
    tags: ['Low Gravity', 'Drifting Confetti', 'Airy'],
  },
};
