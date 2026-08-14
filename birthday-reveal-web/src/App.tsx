import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { TierDetector, type PerformanceTier } from './core/TierDetector';
import { AssetLoader } from './core/AssetLoader';
import { StarlightLoft } from './worlds/StarlightLoft';
import { MidnightGarden } from './worlds/MidnightGarden';
import { ArcadeCabinet } from './worlds/ArcadeCabinet';
import { useMachine } from '@xstate/react';
import { revealMachine } from './core/RevealMachine';
import { MemoryGateOverlay } from './ui/MemoryGateOverlay';
import confetti from 'canvas-confetti';

import { SenderPortal } from './ui/SenderPortal';

interface RevealPayload {
  mode: 'reveal' | 'countdown';
  unlocksAt?: string;
  celebration?: {
    id: string;
    recipientName: string;
    headline: string;
    messageBody: string;
    musicUrl: string | null;
    memoryPromptQuestion: string | null;
  };
  worldConfig: {
    id: string;
    key: string;
  };
}

const API_BASE = 'http://localhost:3000'; // Match backend port

function App() {
  const [tier, setTier] = useState<PerformanceTier>('full');
  const [loading, setLoading] = useState(true);
  const [state, send] = useMachine(revealMachine);
  const confettiFired = useRef(false);
  const [showPortal, setShowPortal] = useState(false);
  
  const [payload, setPayload] = useState<RevealPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTier(TierDetector.detect());
    
    // 1. Extract Token
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    
    if (!token) {
      setShowPortal(true);
      setLoading(false);
      return;
    }

    // 2. Fetch API
    fetch(`${API_BASE}/public/reveals/${token}`)
      .then(res => {
        if (!res.ok) throw new Error('Gift not found or not ready yet.');
        return res.json();
      })
      .then((data: RevealPayload) => {
        setPayload(data);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Post telemetry event when the API resolves successfully
  useEffect(() => {
    if (payload?.celebration?.id) {
      fetch(`${API_BASE}/public/reveals/${payload.celebration.id}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventType: 'link_opened' })
      }).catch(console.error);
    }
  }, [payload]);

  // Trigger celebration confetti
  useEffect(() => {
    if (state.matches('celebration') && !confettiFired.current) {
      confettiFired.current = true;
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
      }, 250);
      
      // Send telemetry
      if (payload?.celebration?.id) {
        fetch(`${API_BASE}/public/reveals/${payload.celebration.id}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventType: 'celebration_reached' })
        }).catch(console.error);
      }
    }
  }, [state.value, payload]);

  const handleAssetsLoaded = () => {
    setLoading(false);
    send({ type: 'ASSETS_LOADED' });
    setTimeout(() => send({ type: 'SWOOP_DONE' }), 2000); // Simulate swoop duration
  };

  // Performance scaling based on tier
  const dpr = tier === 'full' ? [1, 2] : [1, 1];
  const antialias = tier === 'full';
  
  if (showPortal) {
    return (
      <SenderPortal 
        onLaunchDemo={() => {
          setShowPortal(false);
          setLoading(true);
          setPayload({
            mode: 'reveal',
            celebration: {
              id: 'demo-celebration',
              recipientName: 'Alex',
              headline: 'Happy Birthday',
              messageBody: 'Wishing you a day filled with joy, magical moments, and extraordinary surprises!',
              musicUrl: null,
              memoryPromptQuestion: 'What is our favorite vacation spot?'
            },
            worldConfig: {
              id: 'demo-world',
              key: 'starlight-loft'
            }
          });
        }}
      />
    );
  }

  if (error) {
    return (
      <div style={{ ...fallbackStyle, background: '#000', width: '100vw', height: '100vh' }}>
        <h1 style={{ color: '#FF4C4C', fontSize: '36px', marginBottom: '16px' }}>Oops!</h1>
        <p style={{ fontSize: '18px', opacity: 0.8 }}>{error}</p>
      </div>
    );
  }

  if (payload?.mode === 'countdown') {
    return (
      <div style={{ ...fallbackStyle, background: '#000', width: '100vw', height: '100vh' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '16px' }}>It's Not Time Yet!</h1>
        <p style={{ fontSize: '18px', opacity: 0.8 }}>This gift for {payload.recipientName} opens on: {new Date(payload.unlocksAt!).toLocaleString()}</p>
      </div>
    );
  }

  // Dynamic World Selector
  const renderWorld = () => {
    const key = payload?.worldConfig?.key;
    const onTap = () => send({ type: 'TAP_GIFT' });
    
    switch (key) {
      case 'midnight-garden': return <MidnightGarden onTapGift={onTap} />;
      case 'arcade-cabinet': return <ArcadeCabinet onTapGift={onTap} />;
      case 'starlight-loft':
      default:
        return <StarlightLoft onTapGift={onTap} />;
    }
  };

  const recipientName = payload?.celebration?.recipientName || 'You';

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000', margin: 0, overflow: 'hidden', position: 'relative' }}>
      {loading && !error && <AssetLoader onComplete={handleAssetsLoaded} />}
      
      {!loading && payload && (
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, color: 'white', fontFamily: '"Inter", "Outfit", sans-serif' }}>
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}>
            <span style={{ textTransform: 'uppercase', letterSpacing: 1, opacity: 0.7 }}>Phase: </span>
            <span style={{ fontWeight: 'bold' }}>{state.value as string}</span>
          </div>
        </div>
      )}

      {!loading && payload && state.matches('sealed_gift') && (
        <div style={overlayHintStyle}>Tap the gift to unwrap!</div>
      )}

      {!loading && payload && state.matches('unwrapping') && (
        <div className="animate-fade-in" style={overlayHintStyle}>
          <button className="btn-premium" onClick={() => send({ type: 'UNWRAP_DONE' })}>
            Finish Unwrapping (Debug)
          </button>
        </div>
      )}

      {payload && state.matches('memory_gate') && (
        <MemoryGateOverlay 
          onPassed={() => send({ type: 'PROMPT_PASSED' })}
        />
      )}

      {payload && state.matches('greeting') && (
        <div style={centeredOverlayStyle}>
          <div className="glass-panel animate-fade-in" style={{ padding: '60px 40px', textAlign: 'center', maxWidth: '600px', width: '90%' }}>
            <h1 className="animate-float" style={greetingTitleStyle}>
              {payload.celebration?.headline || `Happy Birthday`}
              <br/><span style={{ color: 'var(--color-brand)' }}>{recipientName}!</span>
            </h1>
            <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', marginBottom: '40px', lineHeight: 1.5 }}>
              {payload.celebration?.messageBody || 'Wishing you a day filled with joy, surprises, and magical moments.'}
            </p>
            <button className="btn-premium" onClick={() => send({ type: 'NEXT' })}>View Memories</button>
          </div>
        </div>
      )}

      {payload && state.matches('memories') && (
        <div style={centeredOverlayStyle}>
          <div className="glass-panel animate-fade-in" style={{ padding: '50px', textAlign: 'center', maxWidth: '800px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '36px', marginBottom: '30px', fontWeight: 600 }}>Your Memories</h2>
            <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '40px' }}>
              <div style={{ height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}></div>
              <div style={{ height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}></div>
              <div style={{ height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}></div>
            </div>
            <button className="btn-premium" onClick={() => send({ type: 'NEXT' })}>Celebrate!</button>
          </div>
        </div>
      )}

      {payload && state.matches('celebration') && (
        <div style={centeredOverlayStyle}>
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <button className="btn-premium" style={{ marginTop: '20vh' }} onClick={() => send({ type: 'REPLAY' })}>Replay Experience</button>
          </div>
        </div>
      )}

      {payload && tier !== 'css' && tier !== 'canvas' && (
        <Canvas shadows gl={{ antialias, powerPreference: 'high-performance' }} dpr={dpr as [number, number]}>
          <Suspense fallback={null}>
            {renderWorld()}
          </Suspense>
        </Canvas>
      )}

      {payload && tier === 'canvas' && (
        <div style={fallbackStyle}>
          <h1>Canvas Fallback Active</h1>
          <p>WebGL disabled or low performance device. 2D Reveal will play here.</p>
        </div>
      )}

      {payload && tier === 'css' && (
        <div style={fallbackStyle}>
          <h1>CSS Fallback Active</h1>
          <p>Reduced motion or no WebGL support. Basic Reveal will play here.</p>
        </div>
      )}
    </div>
  );
}

// Reusable Styles
const overlayHintStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '10%',
  left: 0,
  right: 0,
  textAlign: 'center',
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '18px',
  letterSpacing: '1px',
  zIndex: 10,
  pointerEvents: 'none',
  fontFamily: '"Inter", "Outfit", sans-serif',
  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
};

const centeredOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 20,
  background: 'radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
};

const greetingTitleStyle: React.CSSProperties = {
  color: '#fff',
  fontSize: '56px',
  lineHeight: 1.2,
  marginBottom: '16px',
  textShadow: '0 4px 20px rgba(233, 69, 96, 0.4)',
  fontWeight: 700,
};

const fallbackStyle: React.CSSProperties = {
  color: 'white', 
  padding: '20px', 
  height: '100%', 
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center', 
  justifyContent: 'center',
  fontFamily: '"Inter", "Outfit", sans-serif',
};

export default App;
