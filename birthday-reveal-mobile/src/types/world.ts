/**
 * World System Types
 * Defines the spatial environment configurations for each Gift Universe.
 */

export type WorldKey = 'starlight-loft' | 'midnight-garden' | 'arcade-cabinet' | 'cloud-terrace';

export type ParticleType = 'star' | 'petal' | 'pixel' | 'cloud';

export interface WorldPhysicsConfig {
  gravity: { x: number; y: number; z: number };
  restitution: number;
  damping: number;
  stiffness: number;
  mass: number;
  particleDensity: number;
  particleType: ParticleType;
  minInteractionMs: number;
}

export interface WorldAssetManifest {
  model: string;
  textureAtlas: string;
  ambientAudio: string;
  sfx: Record<string, string>;
  giftWrapTexture: string;
  particleSprite: string;
}

export interface WorldCameraSwoopConfig {
  startPosition: { x: number; y: number; z: number };
  endPosition: { x: number; y: number; z: number };
  lookAt: { x: number; y: number; z: number };
  durationMs: number;
  easing: string;
}

export interface World {
  id: string;
  key: WorldKey;
  displayName: string;
  description: string;
  physics: WorldPhysicsConfig;
  assetManifest: WorldAssetManifest;
  cameraSwoopConfig: WorldCameraSwoopConfig;
  emailTemplateKey: string;
  isActive: boolean;
  sortOrder: number;
}
