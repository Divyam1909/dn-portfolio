import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface RealisticPlanetProps {
  position: [number, number, number];
  size: number;
  color: string;
  name: string;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  onClick: () => void;
  hasRings?: boolean;
  emissive?: boolean;
  atmosphereColor?: string;
}

const RealisticPlanet: React.FC<RealisticPlanetProps> = ({
  position,
  size,
  color,
  name,
  orbitRadius,
  orbitSpeed,
  rotationSpeed,
  onClick,
  hasRings = false,
  emissive = false,
  atmosphereColor,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Animate orbit and rotation
  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += orbitSpeed;
    }
    // Rotate planet on its axis
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
    // Pulse atmosphere
    if (atmosphereRef.current && hovered) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      atmosphereRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={position}>
        {/* Planet sphere with detailed material */}
        <Sphere
          ref={meshRef}
          args={[size, 64, 64]}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.15 : 1}
        >
          <meshStandardMaterial
            color={color}
            emissive={emissive ? color : undefined}
            emissiveIntensity={emissive ? 0.3 : 0}
            metalness={0.4}
            roughness={0.7}
            map={null}
          />
        </Sphere>

        {/* Atmosphere glow */}
        {atmosphereColor && (
          <Sphere ref={atmosphereRef} args={[size * 1.15, 32, 32]} scale={hovered ? 1.1 : 1}>
            <meshBasicMaterial
              color={atmosphereColor}
              transparent
              opacity={hovered ? 0.25 : 0.15}
              side={THREE.BackSide}
            />
          </Sphere>
        )}

        {/* Inner glow when hovered */}
        {hovered && (
          <Sphere args={[size * 1.3, 32, 32]}>
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.15}
              side={THREE.BackSide}
            />
          </Sphere>
        )}

        {/* Rings (like Saturn) */}
        {hasRings && (
          <mesh rotation={[Math.PI / 2.5, 0, 0]}>
            <ringGeometry args={[size * 1.4, size * 2.2, 64]} />
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
              metalness={0.2}
              roughness={0.8}
            />
          </mesh>
        )}

        {/* Planet label with better styling */}
        <Text
          position={[0, size + 0.6, 0]}
          fontSize={0.35}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={hovered ? 0.08 : 0.05}
          outlineColor="#000000"
          fontWeight={hovered ? 700 : 400}
        >
          {name}
        </Text>
      </group>

      {/* Orbit ring with gradient effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.03, orbitRadius + 0.03, 128]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.4 : 0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default RealisticPlanet;

