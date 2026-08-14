export type PerformanceTier = 'full' | 'canvas' | 'css';

export class TierDetector {
  static detect(): PerformanceTier {
    // 1. Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'css';
    }

    // 2. Check WebGL support and hardware concurrency
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      return 'css';
    }

    // Check logical cores (rough heuristic for device power)
    const cores = navigator.hardwareConcurrency || 2;
    
    if (cores >= 4) {
      return 'full';
    }

    // Fallback for lower-end devices with WebGL
    return 'canvas';
  }
}
