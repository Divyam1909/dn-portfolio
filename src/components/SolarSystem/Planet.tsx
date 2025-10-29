import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  size: number;
  color: string;
  name: string;
  orbitRadius: number;
  orbitSpeed: number;
  onClick: () => void;
  emissive?: boolean;
}

const Planet: React.FC<PlanetProps> = ({
  position,
  size,
  color,
  name,
  orbitRadius,
  orbitSpeed,
  onClick,
  emissive = false,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Animate orbit
  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += orbitSpeed;
    }
    // Rotate planet on its axis
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={position}>
        {/* Planet sphere */}
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.2 : 1}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive ? color : undefined}
            emissiveIntensity={emissive ? 0.5 : 0}
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        {/* Glow effect when hovered */}
        {hovered && (
          <mesh scale={1.3}>
            <sphereGeometry args={[size, 32, 32]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {/* Planet label */}
        <Text
          position={[0, size + 0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#000000"
        >
          {name}
        </Text>
      </group>

      {/* Orbit ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.05, orbitRadius + 0.05, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default Planet;

