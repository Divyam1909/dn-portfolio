import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface RealPlanetProps {
  position: [number, number, number];
  size: number;
  color: string;
  name: string;
  description: string;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  onClick: () => void;
  hasRings?: boolean;
  atmosphereColor?: string;
  features?: any;
}

const RealPlanet: React.FC<RealPlanetProps> = ({
  position,
  size,
  color,
  name,
  description,
  orbitRadius,
  orbitSpeed,
  rotationSpeed,
  onClick,
  hasRings = false,
  atmosphereColor,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Realistic orbit and rotation
  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += orbitSpeed;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
    // Clouds rotation (slightly faster for Earth-like planets)
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += rotationSpeed * 1.3;
    }
    // Subtle atmosphere pulse on hover
    if (atmosphereRef.current && hovered) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.015;
      atmosphereRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group ref={orbitRef}>
      <group position={position}>
        {/* Main planet sphere */}
        <Sphere
          ref={meshRef}
          args={[size, 64, 64]}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.1 : 1}
        >
          <meshStandardMaterial
            color={color}
            metalness={0.3}
            roughness={0.7}
            emissive={color}
            emissiveIntensity={hovered ? 0.15 : 0.05}
          />
        </Sphere>

        {/* Atmosphere layer */}
        {atmosphereColor && (
          <Sphere ref={atmosphereRef} args={[size * 1.12, 32, 32]} scale={hovered ? 1.05 : 1}>
            <meshBasicMaterial
              color={atmosphereColor}
              transparent
              opacity={hovered ? 0.3 : 0.18}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </Sphere>
        )}

        {/* Cloud layer for Earth-like planets */}
        {name === 'Earth' && (
          <Sphere ref={cloudsRef} args={[size * 1.02, 32, 32]}>
            <meshStandardMaterial
              color="#FFFFFF"
              transparent
              opacity={0.15}
              roughness={1}
            />
          </Sphere>
        )}

        {/* Outer glow when hovered */}
        {hovered && (
          <>
            <Sphere args={[size * 1.25, 32, 32]}>
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.15}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
              />
            </Sphere>
            <Sphere args={[size * 1.4, 24, 24]}>
              <meshBasicMaterial
                color={atmosphereColor || color}
                transparent
                opacity={0.08}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
              />
            </Sphere>
          </>
        )}

        {/* Rings (Saturn) */}
        {hasRings && (
          <>
            <mesh rotation={[Math.PI / 2.3, 0, 0]}>
              <ringGeometry args={[size * 1.5, size * 2.5, 64]} />
              <meshStandardMaterial
                color="#E6D5B8"
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
                metalness={0.1}
                roughness={0.8}
              />
            </mesh>
            {/* Ring shadow for depth */}
            <mesh rotation={[Math.PI / 2.3, 0, 0]}>
              <ringGeometry args={[size * 1.8, size * 2.2, 64]} />
              <meshBasicMaterial
                color="#B8A586"
                transparent
                opacity={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
          </>
        )}

        {/* Planet name label */}
        <Text
          position={[0, size + 0.8, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={hovered ? 0.1 : 0.06}
          outlineColor="#000000"
          fontWeight={hovered ? 700 : 500}
        >
          {name}
        </Text>

        {/* Description label (shows on hover) */}
        {hovered && (
          <Text
            position={[0, size + 1.3, 0]}
            fontSize={0.3}
            color="#93C5FD"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.04}
            outlineColor="#000000"
          >
            {description}
          </Text>
        )}
      </group>

      {/* Orbit path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 128]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.5 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Orbit glow on hover */}
      {hovered && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[orbitRadius - 0.1, orbitRadius + 0.1, 128]} />
          <meshBasicMaterial
            color={atmosphereColor || color}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
};

export default RealPlanet;

