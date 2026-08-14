import { useRef, useState } from 'react';
import { Environment, PerspectiveCamera, OrbitControls, Float, Cylinder, Sparkles } from '@react-three/drei';
import { Physics, RigidBody, type RapierRigidBody } from '@react-three/rapier';

export const MidnightGarden = ({ onTapGift }: { onTapGift?: () => void }) => {
  const giftRef = useRef<RapierRigidBody>(null);
  const [tapCount, setTapCount] = useState(0);

  const handleTap = () => {
    if (giftRef.current) {
      const impulseStrength = tapCount >= 5 ? 12 : 6; 
      giftRef.current.applyImpulse({ 
        x: (Math.random() - 0.5) * 3, 
        y: impulseStrength, 
        z: (Math.random() - 0.5) * 3 
      }, true);
      giftRef.current.applyTorqueImpulse({ 
        x: Math.random() * 3, 
        y: Math.random() * 3, 
        z: Math.random() * 3 
      }, true);
    }
    
    setTapCount(c => c + 1);
    onTapGift?.();
  };

  // Easter Egg: Gift turns to glowing cyan after 5 taps
  const giftColor = tapCount >= 5 ? '#4EFAAF' : '#132A13';

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 6, 12]} fov={55} />
      <OrbitControls makeDefault enableZoom={true} maxPolarAngle={Math.PI / 2.1} minPolarAngle={Math.PI / 4} />
      
      <Environment preset="forest" />
      
      <ambientLight intensity={0.15} color="#4EFAAF" />
      <directionalLight position={[5, 15, 5]} intensity={1.5} color="#D8F3DC" castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#132A13" />

      {/* Fireflies effect */}
      <Sparkles count={150} scale={15} size={2} speed={0.4} opacity={0.6} color="#4EFAAF" />

      <Physics gravity={[0, -9.81, 0]}> {/* Standard gravity for Garden */}
        {/* Garden Floor */}
        <RigidBody type="fixed" restitution={0.1} friction={1}>
          <Cylinder args={[15, 15, 0.5, 32]} position={[0, -0.25, 0]}>
            <meshStandardMaterial color="#081C15" roughness={0.9} />
          </Cylinder>
        </RigidBody>

        {/* Nesting Gift */}
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <RigidBody ref={giftRef} colliders="hull" restitution={0.3} mass={2}>
            {/* Using a cylinder (like a hat box) for the garden gift shape */}
            <Cylinder args={[1.2, 1.2, 1.5, 16]} position={[0, 2, 0]} onClick={handleTap}>
              <meshStandardMaterial 
                color={giftColor} 
                emissive={tapCount >= 5 ? '#4EFAAF' : '#000000'}
                emissiveIntensity={tapCount >= 5 ? 0.5 : 0}
                roughness={0.6} 
              />
            </Cylinder>
          </RigidBody>
        </Float>
      </Physics>
    </>
  );
};
