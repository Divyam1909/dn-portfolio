import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const RealisticSun: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const corona1Ref = useRef<THREE.Mesh>(null);
  const corona2Ref = useRef<THREE.Mesh>(null);
  const corona3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
    
    // Animated corona layers
    if (corona1Ref.current) {
      const scale = 1 + Math.sin(time * 0.5) * 0.05;
      corona1Ref.current.scale.set(scale, scale, scale);
      corona1Ref.current.rotation.y += 0.002;
    }
    
    if (corona2Ref.current) {
      const scale = 1 + Math.sin(time * 0.7 + 1) * 0.06;
      corona2Ref.current.scale.set(scale, scale, scale);
      corona2Ref.current.rotation.y -= 0.001;
    }
    
    if (corona3Ref.current) {
      const scale = 1 + Math.sin(time * 0.3 + 2) * 0.04;
      corona3Ref.current.scale.set(scale, scale, scale);
      corona3Ref.current.rotation.y += 0.0015;
    }
  });

  return (
    <group>
      {/* Main sun sphere with enhanced glow */}
      <Sphere ref={meshRef} args={[2.5, 64, 64]}>
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FF8C00"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Sphere>

      {/* Corona layer 1 - Inner glow */}
      <Sphere ref={corona1Ref} args={[2.5, 32, 32]} scale={1.3}>
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Corona layer 2 - Middle glow */}
      <Sphere ref={corona2Ref} args={[2.5, 32, 32]} scale={1.6}>
        <meshBasicMaterial
          color="#FF6347"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Corona layer 3 - Outer glow */}
      <Sphere ref={corona3Ref} args={[2.5, 32, 32]} scale={2}>
        <meshBasicMaterial
          color="#FF4500"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Volumetric light rays effect */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
        const radians = (angle * Math.PI) / 180;
        return (
          <mesh
            key={index}
            position={[Math.cos(radians) * 3, 0, Math.sin(radians) * 3]}
            rotation={[0, -radians, 0]}
          >
            <coneGeometry args={[0.1, 2, 8]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.15}
            />
          </mesh>
        );
      })}

      {/* Sun label */}
      <Text
        position={[0, 3.5, 0]}
        fontSize={0.6}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.15}
        outlineColor="#000000"
        fontWeight={700}
      >
        Portfolio
      </Text>

      {/* Enhanced point light from sun */}
      <pointLight position={[0, 0, 0]} intensity={3} distance={150} decay={1.5} color="#FFD700" />
      
      {/* Additional soft light for ambiance */}
      <pointLight position={[0, 0, 0]} intensity={1} distance={100} decay={2} color="#FFA500" />
    </group>
  );
};

export default RealisticSun;

