import { useRef } from 'react';
import { Environment, PerspectiveCamera, OrbitControls, Float, Box } from '@react-three/drei';
import { Physics, RigidBody, type RapierRigidBody } from '@react-three/rapier';

export const StarlightLoft = ({ onTapGift }: { onTapGift?: () => void }) => {
  const giftRef = useRef<RapierRigidBody>(null);

  const handleTap = () => {
    if (giftRef.current) {
      // Apply an upward/wobble impulse to simulate tapping the gift
      giftRef.current.applyImpulse({ x: (Math.random() - 0.5) * 2, y: 5, z: (Math.random() - 0.5) * 2 }, true);
      giftRef.current.applyTorqueImpulse({ x: Math.random() * 2, y: Math.random() * 2, z: Math.random() * 2 }, true);
    }
    onTapGift?.();
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
      <OrbitControls makeDefault enableZoom={true} maxPolarAngle={Math.PI / 2} />
      
      <Environment preset="city" />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      <Physics gravity={[0, -6, 0]}> {/* Low gravity for Starlight Loft per TRD */}
        {/* Placeholder Environment / Floor */}
        <RigidBody type="fixed" restitution={0.4} friction={0.5}>
          <Box args={[20, 0.5, 20]} position={[0, -0.25, 0]}>
            <meshStandardMaterial color="#1a1a2e" />
          </Box>
        </RigidBody>

        {/* Floating Gift Box */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <RigidBody ref={giftRef} colliders="cuboid" restitution={0.5} mass={1}>
            <Box args={[1.5, 1.5, 1.5]} position={[0, 3, 0]} onClick={handleTap}>
              <meshStandardMaterial color="#e94560" metalness={0.8} roughness={0.2} />
            </Box>
          </RigidBody>
        </Float>
      </Physics>
    </>
  );
};
