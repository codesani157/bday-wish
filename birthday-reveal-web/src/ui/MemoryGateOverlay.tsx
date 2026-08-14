import { useState } from 'react';

interface MemoryGateOverlayProps {
  promptQuestion?: string;
  correctAnswer?: string;
  onPassed: () => void;
}

export const MemoryGateOverlay = ({ 
  promptQuestion = "What is the name of the first pet we had?", 
  correctAnswer = "fluffy",
  onPassed 
}: MemoryGateOverlayProps) => {
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedAnswer = answer.trim().toLowerCase();
    
    // Fuzzy/exact match simulation or 3-attempt bypass
    if (normalizedAnswer === correctAnswer.toLowerCase() || attempts >= 2) {
      setError(false);
      onPassed();
    } else {
      setAttempts((a) => a + 1);
      setError(true);
      setAnswer('');
    }
  };

  return (
    <div style={overlayStyle}>
      <div className={`glass-panel animate-fade-in ${error ? 'shake' : ''}`} style={cardStyle}>
        <div style={iconContainerStyle}>
          <span style={lockIconStyle}>🔒</span>
        </div>
        
        <h2 style={titleStyle}>A Memory to Unlock</h2>
        <p style={questionStyle}>{promptQuestion}</p>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setError(false);
            }}
            placeholder="Type your answer..."
            style={error ? { ...inputStyle, borderColor: 'rgba(255, 107, 107, 0.6)', background: 'rgba(255, 107, 107, 0.1)' } : inputStyle}
            autoFocus
          />
          {error && <p style={errorStyle}>Incorrect. Give it another try! ({3 - attempts} left)</p>}
          
          <button type="submit" className="btn-premium" style={{ marginTop: '10px' }}>
            Unlock Gift
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

// Styles
const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0, left: 0, right: 0, bottom: 0,
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
};

const cardStyle: React.CSSProperties = {
  padding: '48px 40px',
  width: '90%',
  maxWidth: '420px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const iconContainerStyle: React.CSSProperties = {
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '24px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
};

const lockIconStyle: React.CSSProperties = {
  fontSize: '28px',
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
};

const titleStyle: React.CSSProperties = {
  color: '#fff',
  fontSize: '28px',
  margin: '0 0 12px 0',
  letterSpacing: '0.5px',
};

const questionStyle: React.CSSProperties = {
  color: 'rgba(255, 255, 255, 0.85)',
  fontSize: '18px',
  margin: '0 0 32px 0',
  lineHeight: 1.6,
  fontWeight: 300,
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
};

const inputStyle: React.CSSProperties = {
  padding: '16px 20px',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  background: 'rgba(0, 0, 0, 0.3)',
  color: '#fff',
  fontSize: '18px',
  outline: 'none',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  fontFamily: 'inherit',
};

const errorStyle: React.CSSProperties = {
  color: '#ff6b6b',
  fontSize: '14px',
  margin: 0,
  fontWeight: 500,
};
