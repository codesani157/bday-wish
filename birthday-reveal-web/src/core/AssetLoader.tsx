import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';

export const AssetLoader = ({ onComplete }: { onComplete: () => void }) => {
  const { progress, loaded, total } = useProgress();
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Ensure we don't trigger completion before Drei registers items to load
    if (progress === 100 && total > 0) {
      setIsFading(true);
      setTimeout(onComplete, 1000); // 1s fade out before removing loader
    }
  }, [progress, total, onComplete]);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: '#111', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', color: 'white',
      zIndex: 9999, transition: 'opacity 1s ease', opacity: isFading ? 0 : 1,
      fontFamily: 'sans-serif'
    }}>
      <h2 style={{ letterSpacing: '2px', fontWeight: 300 }}>LOADING GIFT UNIVERSE</h2>
      <div style={{ width: '300px', height: '4px', background: '#333', borderRadius: '2px', marginTop: '20px', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: '#fff', borderRadius: '2px', transition: 'width 0.2s' }} />
      </div>
      <p style={{ marginTop: '10px', fontSize: '11px', color: '#666', letterSpacing: '1px' }}>
        ASSETS: {loaded} / {total}
      </p>
    </div>
  );
};
