import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const EnhancedSun: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const corona1Ref = useRef<THREE.Mesh>(null);
  const corona2Ref = useRef<THREE.Mesh>(null);
  const corona3Ref = useRef<THREE.Mesh>(null);
  const flaresRef = useRef<THREE.Group>(null);

  // Create solar flares
  const flares = useMemo(() => {
    const flareData = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      flareData.push({
        angle,
        offset: Math.random() * 0.5,
        speed: 0.001 + Math.random() * 0.002,
        height: 1.5 + Math.random() * 1,
      });
    }
    return flareData;
  }, []);

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

    // Animate solar flares
    if (flaresRef.current) {
      flaresRef.current.children.forEach((flare, index) => {
        const data = flares[index];
        const flareTime = time * data.speed + data.offset;
        const intensity = Math.sin(flareTime) * 0.5 + 0.5;
        flare.scale.y = 0.5 + intensity * data.height;
        
        // Color intensity
        const material = (flare as THREE.Mesh).material as THREE.MeshBasicMaterial;
        material.opacity = 0.3 + intensity * 0.4;
      });
    }
  });

  return (
    <group>
      {/* Main sun sphere with texture-like appearance */}
      <Sphere ref={meshRef} args={[2.5, 64, 64]}>
        <meshStandardMaterial
          color="#FDB813"
          emissive="#FF8C00"
          emissiveIntensity={2.5}
          roughness={0.9}
          metalness={0.1}
          toneMapped={false}
        />
      </Sphere>

      {/* Corona layers */}
      <Sphere ref={corona1Ref} args={[2.5, 32, 32]} scale={1.3}>
        <meshBasicMaterial
          color="#FFA500"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      <Sphere ref={corona2Ref} args={[2.5, 32, 32]} scale={1.6}>
        <meshBasicMaterial
          color="#FF6347"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      <Sphere ref={corona3Ref} args={[2.5, 32, 32]} scale={2}>
        <meshBasicMaterial
          color="#FF4500"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Solar flares - smooth pulsing glow */}
      <group ref={flaresRef}>
        {flares.map((flare, index) => {
          const x = Math.cos(flare.angle) * 2.8;
          const z = Math.sin(flare.angle) * 2.8;
          return (
            <mesh key={index} position={[x, 0, z]}>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshBasicMaterial
                color="#FFD700"
                transparent
                opacity={0.3}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        })}
      </group>

      {/* Sun label */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.65}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.15}
        outlineColor="#000000"
        fontWeight={700}
      >
        Divyam's Portfolio
      </Text>

      {/* Enhanced point lights */}
      <pointLight position={[0, 0, 0]} intensity={4} distance={150} decay={1.5} color="#FFD700" />
      <pointLight position={[0, 0, 0]} intensity={2} distance={100} decay={2} color="#FFA500" />
      <pointLight position={[0, 0, 0]} intensity={1} distance={80} decay={2.5} color="#FF6347" />
    </group>
  );
};

export default EnhancedSun;

