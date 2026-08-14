import { useRef, useState } from 'react';
import { Environment, PerspectiveCamera, OrbitControls, Float, Box, Sparkles } from '@react-three/drei';
import { Physics, RigidBody, type RapierRigidBody } from '@react-three/rapier';

export const ArcadeCabinet = ({ onTapGift }: { onTapGift?: () => void }) => {
  const giftRef = useRef<RapierRigidBody>(null);
  const [tapCount, setTapCount] = useState(0);

  const handleTap = () => {
    if (giftRef.current) {
      // High restitution (bouncy) impulse for arcade
      const impulseStrength = tapCount >= 5 ? 15 : 8; 
      giftRef.current.applyImpulse({ 
        x: (Math.random() - 0.5) * 5, 
        y: impulseStrength, 
        z: (Math.random() - 0.5) * 5 
      }, true);
      giftRef.current.applyTorqueImpulse({ 
        x: Math.random() * 5, 
        y: Math.random() * 5, 
        z: Math.random() * 5 
      }, true);
    }
    
    setTapCount(c => c + 1);
    onTapGift?.();
  };

  // Easter Egg: Gift turns to neon magenta after 5 taps
  const giftColor = tapCount >= 5 ? '#FF2A85' : '#4E00B3';

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 4, 8]} fov={60} />
      <OrbitControls makeDefault enableZoom={true} maxPolarAngle={Math.PI / 1.8} />
      
      <Environment preset="studio" />
      
      <ambientLight intensity={0.4} color="#FF2A85" />
      <directionalLight position={[0, 10, -5]} intensity={2} color="#00E5FF" castShadow />
      
      {/* Neon Dust */}
      <Sparkles count={200} scale={12} size={3} speed={0.8} opacity={0.8} color="#00E5FF" />

      <Physics gravity={[0, -15, 0]}> {/* Heavy/bouncy gravity for Arcade */}
        {/* Arcade Floor */}
        <RigidBody type="fixed" restitution={0.8} friction={0.2}>
          <Box args={[12, 0.5, 12]} position={[0, -0.25, 0]}>
            <meshStandardMaterial 
              color="#13072E" 
              emissive="#FF2A85" 
              emissiveIntensity={0.1}
              metalness={0.8} 
              roughness={0.2} 
            />
          </Box>
        </RigidBody>

        {/* Bouncy Arcade Gift */}
        <Float speed={4} rotationIntensity={1} floatIntensity={2}>
          <RigidBody ref={giftRef} colliders="cuboid" restitution={0.9} mass={0.8}>
            <Box args={[1.2, 1.2, 1.2]} position={[0, 4, 0]} onClick={handleTap}>
              <meshStandardMaterial 
                color={giftColor} 
                emissive={tapCount >= 5 ? '#FF2A85' : '#00E5FF'}
                emissiveIntensity={tapCount >= 5 ? 0.8 : 0.2}
                metalness={0.5} 
                roughness={0.1} 
              />
            </Box>
          </RigidBody>
        </Float>
      </Physics>
    </>
  );
};
