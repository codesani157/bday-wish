import React, { useState } from 'react';

interface SenderPortalProps {
  onLaunchDemo: () => void;
}

export function SenderPortal({ onLaunchDemo }: SenderPortalProps) {
  const [step, setStep] = useState<'landing' | 'builder' | 'success'>('landing');
  
  // Form State
  const [recipientName, setRecipientName] = useState('');
  const [headline, setHeadline] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [worldKey, setWorldKey] = useState('starlight-loft');
  const [promptQuestion, setPromptQuestion] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCreateGift = (e: React.FormEvent) => {
    e.preventDefault();
    const demoToken = 'demo-' + Math.random().toString(36).substring(2, 9);
    const link = `${window.location.origin}/?token=${demoToken}`;
    setGeneratedLink(link);
    setStep('success');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  return (
    <div style={containerStyle}>
      <div style={navbarStyle}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-heading)' }}>
          🎁 Birthday Reveal
        </div>
        <button className="btn-premium" style={{ fontSize: '14px', padding: '10px 20px' }} onClick={onLaunchDemo}>
          🎮 Test 3D Reveal Demo
        </button>
      </div>

      {step === 'landing' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '60px 40px', textAlign: 'center', maxWidth: '700px', margin: '40px auto 0' }}>
          <h1 className="animate-float" style={{ fontSize: '48px', fontWeight: 700, marginBottom: '20px' }}>
            A World Built for <span style={{ color: 'var(--color-brand)' }}>One Person</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '40px', lineHeight: 1.6 }}>
            Create a custom 3D spatial birthday universe for your friends and family. Zero downloads required for recipients!
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-premium" onClick={() => setStep('builder')}>
              ✨ Create a Birthday Gift
            </button>
            <button 
              className="btn-premium" 
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
              onClick={onLaunchDemo}
            >
              🚀 View 3D Physics Scene
            </button>
          </div>
        </div>
      )}

      {step === 'builder' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '40px', maxWidth: '650px', margin: '20px auto', maxHeight: '85vh', overflowY: 'auto' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '8px', fontWeight: 600 }}>Create Your Birthday Surprise</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px', fontSize: '14px' }}>
            Customize the recipient's 3D physics environment and personalized message.
          </p>

          <form onSubmit={handleCreateGift} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Recipient's Name</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Alex" 
                value={recipientName} 
                onChange={(e) => setRecipientName(e.target.value)} 
                style={inputStyle} 
              />
            </div>

            <div>
              <label style={labelStyle}>Headline Greeting</label>
              <input 
                type="text" 
                required 
                placeholder="e.g. Happy 25th Birthday!" 
                value={headline} 
                onChange={(e) => setHeadline(e.target.value)} 
                style={inputStyle} 
              />
            </div>

            <div>
              <label style={labelStyle}>Personalized Message</label>
              <textarea 
                required 
                rows={3} 
                placeholder="Write your special message here..." 
                value={messageBody} 
                onChange={(e) => setMessageBody(e.target.value)} 
                style={{ ...inputStyle, resize: 'vertical' }} 
              />
            </div>

            <div>
              <label style={labelStyle}>Choose 3D World Theme</label>
              <select 
                value={worldKey} 
                onChange={(e) => setWorldKey(e.target.value)} 
                style={inputStyle}
              >
                <option value="starlight-loft" style={{ background: '#111' }}>🌌 Starlight Loft (Cosmic Floating Physics)</option>
                <option value="midnight-garden" style={{ background: '#111' }}>🌲 Midnight Garden (Glowing Fireflies & Cylinder)</option>
                <option value="arcade-cabinet" style={{ background: '#111' }}>🕹️ Arcade Cabinet (High-Bounce Retro Physics)</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Memory Gate Security Question (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. What is the name of our favorite cafe?" 
                value={promptQuestion} 
                onChange={(e) => setPromptQuestion(e.target.value)} 
                style={inputStyle} 
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button type="submit" className="btn-premium" style={{ flex: 1 }}>
                🔒 Seal & Generate Reveal Link
              </button>
              <button 
                type="button" 
                className="btn-premium" 
                style={{ background: 'rgba(255,255,255,0.1)' }} 
                onClick={() => setStep('landing')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {step === 'success' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '50px 40px', textAlign: 'center', maxWidth: '600px', margin: '40px auto 0' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontSize: '32px', marginBottom: '12px', fontWeight: 700 }}>Gift Successfully Sealed!</h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginBottom: '30px' }}>
            Share this link with <strong>{recipientName}</strong>. When they open it, their 3D reveal experience will launch instantly!
          </p>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', wordBreak: 'break-all', fontFamily: 'monospace', color: '#4EFAAF', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            {generatedLink}
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn-premium" onClick={copyToClipboard}>
              {copySuccess ? '✓ Copied!' : '📋 Copy Link'}
            </button>
            <button 
              className="btn-premium" 
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
              onClick={() => window.location.href = generatedLink}
            >
              👀 Open Reveal Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  width: '100vw',
  minHeight: '100vh',
  background: '#000',
  color: '#fff',
  fontFamily: '"Inter", "Outfit", sans-serif',
  padding: '20px',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column'
};

const navbarStyle: React.CSSProperties = {
  display: 'flex',
  justifySpaceBetween: 'space-between',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1000px',
  width: '100%',
  margin: '0 auto'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  marginBottom: '6px',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.9)'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(255,255,255,0.05)',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: '"Inter", sans-serif'
};
