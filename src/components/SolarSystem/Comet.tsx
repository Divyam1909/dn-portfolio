import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Comet: React.FC = () => {
  const cometRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!cometRef.current) return;
    
    const time = state.clock.elapsedTime * 0.2;
    
    // Elliptical orbit path
    const a = 80; // Semi-major axis
    const b = 50; // Semi-minor axis
    const angle = time;
    
    cometRef.current.position.x = Math.cos(angle) * a;
    cometRef.current.position.z = Math.sin(angle) * b;
    cometRef.current.position.y = Math.sin(angle * 2) * 10; // Add some vertical movement
    
    // Rotate comet
    cometRef.current.rotation.y += 0.02;
  });

  return (
    <group ref={cometRef}>
      {/* Comet head */}
      <Sphere args={[0.4, 16, 16]}>
        <meshStandardMaterial
          color="#E0E0E0"
          emissive="#FFFFFF"
          emissiveIntensity={0.3}
          roughness={0.8}
        />
      </Sphere>
      
      {/* Comet glow */}
      <Sphere args={[0.6, 16, 16]}>
        <meshBasicMaterial
          color="#87CEEB"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Tail particles */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[-i * 0.5, 0, 0]}>
          <sphereGeometry args={[0.15 - i * 0.01, 8, 8]} />
          <meshBasicMaterial
            color="#87CEEB"
            transparent
            opacity={0.6 - i * 0.07}
          />
        </mesh>
      ))}
    </group>
  );
};

export default Comet;

