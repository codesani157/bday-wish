import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { TierDetector, type PerformanceTier } from './core/TierDetector';
import { AssetLoader } from './core/AssetLoader';
import { StarlightLoft } from './worlds/StarlightLoft';
import { useMachine } from '@xstate/react';
import { revealMachine } from './core/RevealMachine';

function App() {
  const [tier, setTier] = useState<PerformanceTier>('full');
  const [loading, setLoading] = useState(true);
  const [state, send] = useMachine(revealMachine);

  useEffect(() => {
    setTier(TierDetector.detect());
  }, []);

  const handleAssetsLoaded = () => {
    setLoading(false);
    send({ type: 'ASSETS_LOADED' });
    setTimeout(() => send({ type: 'SWOOP_DONE' }), 2000); // Simulate swoop duration
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', margin: 0, overflow: 'hidden' }}>
      {loading && <AssetLoader onComplete={handleAssetsLoaded} />}
      
      {!loading && (
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, color: 'white', fontFamily: 'sans-serif' }}>
          <h3 style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Phase: {state.value as string}</h3>
          {state.matches('sealed_gift') && <p>Tap the gift to unwrap!</p>}
          {state.matches('unwrapping') && <button onClick={() => send({ type: 'UNWRAP_DONE' })}>Finish Unwrapping</button>}
          {state.matches('memory_gate') && <button onClick={() => send({ type: 'PROMPT_PASSED' })}>Solve Gate</button>}
          {state.matches('greeting') && <button onClick={() => send({ type: 'NEXT' })}>View Memories</button>}
          {state.matches('memories') && <button onClick={() => send({ type: 'NEXT' })}>Celebrate</button>}
          {state.matches('celebration') && <button onClick={() => send({ type: 'REPLAY' })}>Replay</button>}
        </div>
      )}

      {tier === 'full' && (
        <Canvas shadows gl={{ antialias: true }} dpr={[1, 2]}>
          <StarlightLoft onTapGift={() => send({ type: 'TAP_GIFT' })} />
        </Canvas>
      )}

      {tier === 'canvas' && (
        <div style={{ color: 'white', padding: 20 }}>
          <h1>Canvas Fallback Active</h1>
          <p>WebGL disabled or low performance device.</p>
        </div>
      )}

      {tier === 'css' && (
        <div style={{ color: 'white', padding: 20 }}>
          <h1>CSS Fallback Active</h1>
          <p>Reduced motion or no WebGL support.</p>
        </div>
      )}
    </div>
  );
}

export default App;
