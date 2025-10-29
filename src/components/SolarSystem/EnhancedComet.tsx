import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

const EnhancedComet: React.FC = () => {
  const cometRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  
  // Create tail particles
  const tailParticles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      index: i,
      size: 0.2 - i * 0.008,
      opacity: 0.8 - i * 0.038,
      offset: i * 0.6,
    }));
  }, []);
  
  useFrame((state) => {
    if (!cometRef.current) return;
    
    const time = state.clock.elapsedTime * 0.15; // Slower, more majestic
    
    // Elliptical orbit path - more dramatic
    const a = 90; // Semi-major axis
    const b = 60; // Semi-minor axis
    const angle = time;
    
    cometRef.current.position.x = Math.cos(angle) * a;
    cometRef.current.position.z = Math.sin(angle) * b;
    cometRef.current.position.y = Math.sin(angle * 3) * 15; // More vertical variation
    
    // Rotate comet to face direction of travel
    const nextAngle = angle + 0.01;
    const nextX = Math.cos(nextAngle) * a;
    const nextZ = Math.sin(nextAngle) * b;
    const direction = new THREE.Vector3(nextX - cometRef.current.position.x, 0, nextZ - cometRef.current.position.z);
    cometRef.current.lookAt(cometRef.current.position.clone().add(direction));
    
    // Animate tail particles
    if (tailRef.current) {
      tailRef.current.children.forEach((child, index) => {
        const wobble = Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
        child.position.y = wobble;
      });
    }
  });

  return (
    <group ref={cometRef}>
      {/* Comet nucleus - icy core */}
      <Sphere args={[0.5, 32, 32]}>
        <meshStandardMaterial
          color="#C0E0F0"
          emissive="#FFFFFF"
          emissiveIntensity={0.4}
          roughness={0.6}
          metalness={0.2}
        />
      </Sphere>
      
      {/* Inner glow */}
      <Sphere args={[0.7, 16, 16]}>
        <meshBasicMaterial
          color="#87CEEB"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Outer glow */}
      <Sphere args={[1, 16, 16]}>
        <meshBasicMaterial
          color="#87CEEB"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* Enhanced tail with more particles */}
      <group ref={tailRef}>
        {tailParticles.map((particle) => (
          <mesh key={particle.index} position={[-particle.offset, 0, 0]}>
            <sphereGeometry args={[particle.size, 12, 12]} />
            <meshBasicMaterial
              color="#87CEEB"
              transparent
              opacity={particle.opacity}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      {/* Gas tail (bluish) */}
      <group>
        {Array.from({ length: 15 }, (_, i) => {
          const offset = i * 0.8;
          const spread = i * 0.15;
          return (
            <mesh key={`gas-${i}`} position={[-offset, spread * Math.sin(i), spread * Math.cos(i)]}>
              <sphereGeometry args={[0.15 - i * 0.007, 8, 8]} />
              <meshBasicMaterial
                color="#4FC3F7"
                transparent
                opacity={0.6 - i * 0.038}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        })}
      </group>

      {/* Dust tail (yellowish) */}
      <group>
        {Array.from({ length: 15 }, (_, i) => {
          const offset = i * 0.7;
          const spread = i * 0.12;
          return (
            <mesh key={`dust-${i}`} position={[-offset, -spread * Math.sin(i), spread * Math.cos(i)]}>
              <sphereGeometry args={[0.13 - i * 0.006, 8, 8]} />
              <meshBasicMaterial
                color="#FFE082"
                transparent
                opacity={0.5 - i * 0.032}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        })}
      </group>

      {/* Point light from comet */}
      <pointLight position={[0, 0, 0]} intensity={0.5} distance={20} color="#87CEEB" />
    </group>
  );
};

export default EnhancedComet;

