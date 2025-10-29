import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import PlanetInfoCard from './PlanetInfoCard';

interface EnhancedPlanetProps {
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
  hasMoons?: boolean;
  moonCount?: number;
  orbitPeriod: string;
  rotationPeriod: string;
  features?: string[];
  startAngle?: number;
}

const EnhancedPlanet: React.FC<EnhancedPlanetProps> = ({
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
  hasMoons = false,
  moonCount = 1,
  orbitPeriod,
  rotationPeriod,
  features = [],
  startAngle = 0,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const moonsRef = useRef<THREE.Group>(null);
  const labelRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(false); // Persistent info card
  const { camera } = useThree();

  // Set initial orbit rotation based on startAngle
  React.useEffect(() => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y = startAngle;
    }
  }, [startAngle]);

  // Realistic orbit and rotation
  useFrame((state) => {
    if (orbitRef.current) {
      orbitRef.current.rotation.y += orbitSpeed;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += rotationSpeed * 1.3;
    }
    // Subtle atmosphere pulse on hover
    if (atmosphereRef.current && hovered) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.015;
      atmosphereRef.current.scale.set(scale, scale, scale);
    }
    
    // Animate moons
    if (moonsRef.current && hasMoons) {
      moonsRef.current.children.forEach((moon, index) => {
        const moonSpeed = 0.01 + index * 0.005;
        const moonOrbit = size * (1.8 + index * 0.4);
        const angle = state.clock.elapsedTime * moonSpeed + (index * Math.PI * 2) / moonCount;
        moon.position.x = Math.cos(angle) * moonOrbit;
        moon.position.z = Math.sin(angle) * moonOrbit;
        moon.rotation.y += 0.01;
      });
    }
    
    // Billboard the label to always face camera
    if (labelRef.current) {
      labelRef.current.quaternion.copy(camera.quaternion);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    
    // Play click sound if available
    if ((window as any).playSpaceClick) {
      (window as any).playSpaceClick();
    }
    
    // Smooth camera zoom to planet before navigating
    const planetWorldPos = new THREE.Vector3();
    if (meshRef.current && orbitRef.current) {
      // Get the actual planet position in world coordinates
      meshRef.current.getWorldPosition(planetWorldPos);
      
      // Calculate zoom position - closer and more focused
      const zoomDistance = size * 5;
      const direction = camera.position.clone().sub(planetWorldPos).normalize();
      const zoomPos = planetWorldPos.clone().add(direction.multiplyScalar(zoomDistance));
      
      // Smooth animation with better easing
      const startPos = camera.position.clone();
      const duration = 1200; // Slightly longer for smoother feel
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth ease-in-out cubic
        const eased = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        camera.position.lerpVectors(startPos, zoomPos, eased);
        camera.lookAt(planetWorldPos);
        camera.updateProjectionMatrix();
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Navigate after zoom completes
          setTimeout(() => onClick(), 200);
        }
      };
      
      animate();
    } else {
      onClick();
    }
  };

  return (
    <group ref={orbitRef}>
      <group position={position}>
        {/* Invisible larger clickable sphere for easier interaction */}
        <Sphere
          args={[size * 2, 16, 16]}
          onClick={handleClick}
          onPointerOver={() => {
            setHovered(true);
            if (!showInfo) setShowInfo(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          visible={false}
        />

        {/* Main planet sphere with improved hover/click effects */}
        <Sphere
          ref={meshRef}
          args={[size, 64, 64]}
          onClick={handleClick}
          onPointerOver={() => {
            setHovered(true);
            if (!showInfo) setShowInfo(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          scale={hovered ? 1.15 : 1}
        >
          <meshStandardMaterial
            color={color}
            metalness={hovered ? 0.4 : 0.3}
            roughness={hovered ? 0.6 : 0.7}
            emissive={color}
            emissiveIntensity={hovered ? 0.25 : 0.05}
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

        {/* Enhanced multi-layer glow when hovered */}
        {hovered && (
          <>
            <Sphere args={[size * 1.25, 32, 32]}>
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.2}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
              />
            </Sphere>
            <Sphere args={[size * 1.4, 24, 24]}>
              <meshBasicMaterial
                color={atmosphereColor || color}
                transparent
                opacity={0.12}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
              />
            </Sphere>
            <Sphere args={[size * 1.6, 24, 24]}>
              <meshBasicMaterial
                color={atmosphereColor || color}
                transparent
                opacity={0.06}
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

        {/* Moons */}
        {hasMoons && (
          <group ref={moonsRef}>
            {Array.from({ length: moonCount }).map((_, index) => (
              <mesh key={index}>
                <sphereGeometry args={[size * 0.15, 16, 16]} />
                <meshStandardMaterial
                  color="#C0C0C0"
                  roughness={0.9}
                  metalness={0.1}
                />
              </mesh>
            ))}
          </group>
        )}

        {/* Page name label (billboard - always faces camera) */}
        <Text
          ref={labelRef}
          position={[0, size + (hovered ? 1.2 : 0.9), 0]}
          fontSize={hovered ? 0.55 : 0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={hovered ? 0.12 : 0.08}
          outlineColor="#000000"
          fontWeight={hovered ? 800 : 600}
        >
          {description}
        </Text>

        {/* Info Card - Persistent after first hover */}
        <PlanetInfoCard
          name={name}
          description={description}
          orbitPeriod={orbitPeriod}
          rotationPeriod={rotationPeriod}
          size={`${(size * 100).toFixed(0)}% of Earth`}
          features={features}
          show={showInfo && hovered}
        />
      </group>

      {/* Orbit path with enhanced highlight */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.03, orbitRadius + 0.03, 128]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.6 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Multi-layer orbit glow on hover */}
      {hovered && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[orbitRadius - 0.15, orbitRadius + 0.15, 128]} />
            <meshBasicMaterial
              color={atmosphereColor || color}
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[orbitRadius - 0.25, orbitRadius + 0.25, 128]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.15}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </>
      )}
    </group>
  );
};

export default EnhancedPlanet;

