import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const Sun: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    if (glowRef.current) {
      // Pulsing glow effect
      const scale = 1 + Math.sin(state.clock.elapsedTime) * 0.05;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Main sun sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FDB813"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      {/* Glow layer 1 */}
      <mesh ref={glowRef} scale={1.2}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Glow layer 2 */}
      <mesh scale={1.4}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#FF6347"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Sun label */}
      <Text
        position={[0, 2.8, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#000000"
        fontWeight={700}
      >
        Portfolio
      </Text>

      {/* Point light from sun */}
      <pointLight position={[0, 0, 0]} intensity={2} distance={100} decay={2} />
    </group>
  );
};

export default Sun;

