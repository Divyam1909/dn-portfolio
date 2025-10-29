import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { Box, CircularProgress } from '@mui/material';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import EnhancedSun from './EnhancedSun';
import EnhancedPlanet from './EnhancedPlanet';
import ShootingStars from './ShootingStars';
import EnhancedComet from './EnhancedComet';
import CosmosBackground from './CosmosBackground';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const UltimateSolarSystem: React.FC = () => {
  const navigate = useNavigate();
  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  // Store planet positions to prevent lag when returning
  const planetAnglesRef = useRef<number[]>([]);

  // Initialize planet angles once
  useEffect(() => {
    if (planetAnglesRef.current.length === 0) {
      planetAnglesRef.current = [
        0, 0.8, 1.6, 2.4, 3.2, 4.0, 4.8, 5.6
      ]; // Evenly distributed starting positions
    }
  }, []);

  // Real planets with COMPLETE accurate data
  const planets = [
    {
      name: 'Mercury',
      size: 0.38,
      color: '#8C7853',
      atmosphereColor: '#A0A0A0',
      orbitRadius: 5,
      orbitSpeed: 0.004,
      rotationSpeed: 0.002,
      route: '/about',
      description: 'About',
      startAngle: planetAnglesRef.current[0] || 0,
      orbitPeriod: '88 Earth days',
      rotationPeriod: '59 Earth days',
      features: ['Cratered surface', 'No atmosphere', 'Extreme temperatures'],
    },
    {
      name: 'Venus',
      size: 0.95,
      color: '#FFC649',
      atmosphereColor: '#FFD700',
      orbitRadius: 7.2,
      orbitSpeed: 0.0016,
      rotationSpeed: -0.0005,
      route: '/resume',
      description: 'Resume',
      startAngle: planetAnglesRef.current[1] || 0.8,
      orbitPeriod: '225 Earth days',
      rotationPeriod: '243 Earth days (retrograde)',
      features: ['Thick atmosphere', 'Sulfuric acid clouds', 'Retrograde rotation'],
    },
    {
      name: 'Earth',
      size: 1,
      color: '#4A90E2',
      atmosphereColor: '#87CEEB',
      orbitRadius: 10,
      orbitSpeed: 0.001,
      rotationSpeed: 0.01,
      route: '/projects',
      description: 'Projects',
      startAngle: planetAnglesRef.current[2] || 1.6,
      orbitPeriod: '365.25 days',
      rotationPeriod: '24 hours',
      features: ['Liquid water', 'Oxygen atmosphere', 'Life'],
      hasMoons: true,
      moonCount: 1,
    },
    {
      name: 'Mars',
      size: 0.53,
      color: '#E27B58',
      atmosphereColor: '#FFB6A3',
      orbitRadius: 15.2,
      orbitSpeed: 0.00053,
      rotationSpeed: 0.009,
      route: '/resume#experience',
      description: 'Experience',
      startAngle: planetAnglesRef.current[3] || 2.4,
      orbitPeriod: '687 Earth days',
      rotationPeriod: '24.6 hours',
      features: ['Iron oxide surface', 'Polar ice caps', 'Largest volcano'],
      hasMoons: true,
      moonCount: 2,
    },
    {
      name: 'Jupiter',
      size: 2.5,
      color: '#C8956A',
      atmosphereColor: '#E6BE8A',
      orbitRadius: 25,
      orbitSpeed: 0.000084,
      rotationSpeed: 0.02,
      route: '/resume#education',
      description: 'Education',
      startAngle: planetAnglesRef.current[4] || 3.2,
      orbitPeriod: '12 Earth years',
      rotationPeriod: '10 hours',
      features: ['Great Red Spot', '79 moons', 'Strongest magnetosphere'],
      hasMoons: true,
      moonCount: 4, // Galilean moons
    },
    {
      name: 'Saturn',
      size: 2.2,
      color: '#FAD5A5',
      atmosphereColor: '#FFE4B5',
      orbitRadius: 35,
      orbitSpeed: 0.000034,
      rotationSpeed: 0.018,
      route: '/resume#skills',
      description: 'Skills',
      startAngle: planetAnglesRef.current[5] || 4.0,
      orbitPeriod: '29 Earth years',
      rotationPeriod: '10.7 hours',
      hasRings: true,
      features: ['Spectacular rings', '82 moons', 'Hexagonal storm'],
      hasMoons: true,
      moonCount: 3,
    },
    {
      name: 'Uranus',
      size: 1.5,
      color: '#4FD0E7',
      atmosphereColor: '#7FFFD4',
      orbitRadius: 45,
      orbitSpeed: 0.000012,
      rotationSpeed: 0.012,
      route: '/resume#certifications',
      description: 'Certifications',
      startAngle: planetAnglesRef.current[6] || 4.8,
      orbitPeriod: '84 Earth years',
      rotationPeriod: '17 hours',
      features: ['Tilted 98°', 'Ice giant', '27 moons'],
      hasMoons: true,
      moonCount: 2,
    },
    {
      name: 'Neptune',
      size: 1.45,
      color: '#4169E1',
      atmosphereColor: '#6495ED',
      orbitRadius: 55,
      orbitSpeed: 0.000006,
      rotationSpeed: 0.013,
      route: '/contact',
      description: 'Contact',
      startAngle: planetAnglesRef.current[7] || 5.6,
      orbitPeriod: '165 Earth years',
      rotationPeriod: '16 hours',
      features: ['Supersonic winds', 'Great Dark Spot', '14 moons'],
      hasMoons: true,
      moonCount: 1,
    },
  ];

  const handlePlanetClick = (route: string) => {
    navigate(route);
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', background: '#000000' }}>
      <Suspense
        fallback={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              background: '#000000',
            }}
          >
            <CircularProgress sx={{ color: '#FDB813' }} />
          </Box>
        }
      >
        <Canvas 
          gl={{ 
            antialias: true, 
            alpha: false, 
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
          }}
          frameloop="always"
        >
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 25, 40]} fov={60} ref={cameraRef} />

          {/* Controls with improved smoothness */}
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={100}
            autoRotate={true}
            autoRotateSpeed={0.3}
            enableDamping={true}
            dampingFactor={0.08}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 4}
            smoothTime={0.25}
            makeDefault
          />

          {/* Lights */}
          <ambientLight intensity={0.08} />
          <hemisphereLight args={['#ffffff', '#000033', 0.2]} />

          {/* Stars - Multiple layers */}
          <Stars
            radius={200}
            depth={100}
            count={10000}
            factor={6}
            saturation={0}
            fade
            speed={0.3}
          />
          
          <Stars
            radius={150}
            depth={60}
            count={4000}
            factor={4}
            saturation={0.1}
            fade
            speed={0.2}
          />

          {/* Enhanced Cosmos Background with Nebulas */}
          <CosmosBackground />

          {/* Shooting Stars */}
          <ShootingStars />

          {/* Enhanced Comet */}
          <EnhancedComet />

          {/* Deep space background */}
          <mesh>
            <sphereGeometry args={[250, 32, 32]} />
            <meshBasicMaterial
              color="#0A0A1A"
              side={THREE.BackSide}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* Enhanced Sun */}
          <EnhancedSun />

          {/* Enhanced Planets with all features */}
          {planets.map((planet, index) => (
            <EnhancedPlanet
              key={index}
              {...planet}
              position={[planet.orbitRadius, 0, 0]}
              onClick={() => handlePlanetClick(planet.route)}
            />
          ))}

          {/* Asteroid belt between Mars and Jupiter */}
          <group>
            {Array.from({ length: 200 }, (_, i) => {
              const angle = (i / 200) * Math.PI * 2;
              const radius = 19 + Math.random() * 3;
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;
              return (
                <mesh key={i} position={[x, (Math.random() - 0.5) * 0.5, z]}>
                  <sphereGeometry args={[0.05 + Math.random() * 0.05, 8, 8]} />
                  <meshStandardMaterial color="#8B7355" roughness={0.9} />
                </mesh>
              );
            })}
          </group>

          {/* Enhanced Bloom for all the glow effects */}
          <EffectComposer>
            <Bloom
              intensity={1}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              height={300}
            />
          </EffectComposer>
        </Canvas>
      </Suspense>
    </Box>
  );
};

export default UltimateSolarSystem;

