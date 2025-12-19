import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { Box, CircularProgress } from '@mui/material';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import RealisticSun from './RealisticSun';
import RealPlanet from './RealPlanet';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const RealSolarSystem: React.FC = () => {
  const navigate = useNavigate();

  // Real planets with accurate data (scaled for visualization)
  // Orbital periods scaled to make visible movement (real/365 for days to complete orbit)
  const planets = [
    {
      name: 'Mercury',
      size: 0.38,
      color: '#8C7853',
      atmosphereColor: '#A0A0A0',
      orbitRadius: 5,
      orbitSpeed: 0.004, // 88 Earth days -> fast
      rotationSpeed: 0.002,
      route: '/about',
      description: 'About Me',
      features: { craters: true }
    },
    {
      name: 'Venus',
      size: 0.95,
      color: '#FFC649',
      atmosphereColor: '#FFD700',
      orbitRadius: 7.2,
      orbitSpeed: 0.0016, // 225 Earth days
      rotationSpeed: -0.0005, // Retrograde rotation
      route: '/resume',
      description: 'Resume',
      features: { thickAtmosphere: true }
    },
    {
      name: 'Earth',
      size: 1,
      color: '#4A90E2',
      atmosphereColor: '#87CEEB',
      orbitRadius: 10,
      orbitSpeed: 0.001, // 365 days (baseline)
      rotationSpeed: 0.01,
      route: '/projects',
      description: 'Projects',
      features: { oceans: true, clouds: true }
    },
    {
      name: 'Mars',
      size: 0.53,
      color: '#E27B58',
      atmosphereColor: '#FFB6A3',
      orbitRadius: 15.2,
      orbitSpeed: 0.00053, // 687 Earth days
      rotationSpeed: 0.009,
      route: '/resume?resume=experience',
      description: 'Experience',
      features: { desert: true }
    },
    {
      name: 'Jupiter',
      size: 2.5, // Scaled down from real 11.2
      color: '#C8956A',
      atmosphereColor: '#E6BE8A',
      orbitRadius: 25,
      orbitSpeed: 0.000084, // 12 Earth years
      rotationSpeed: 0.02, // Fastest rotation
      route: '/resume?resume=education',
      description: 'Education',
      features: { gasGiant: true, storms: true }
    },
    {
      name: 'Saturn',
      size: 2.2, // Scaled down from real 9.5
      color: '#FAD5A5',
      atmosphereColor: '#FFE4B5',
      orbitRadius: 35,
      orbitSpeed: 0.000034, // 29 Earth years
      rotationSpeed: 0.018,
      route: '/resume?resume=skills',
      description: 'Skills',
      hasRings: true,
      features: { gasGiant: true, rings: true }
    },
    {
      name: 'Uranus',
      size: 1.5,
      color: '#4FD0E7',
      atmosphereColor: '#7FFFD4',
      orbitRadius: 45,
      orbitSpeed: 0.000012, // 84 Earth years
      rotationSpeed: 0.012,
      route: '/resume?resume=certifications',
      description: 'Certifications',
      features: { iceGiant: true, tilted: true }
    },
    {
      name: 'Neptune',
      size: 1.45,
      color: '#4169E1',
      atmosphereColor: '#6495ED',
      orbitRadius: 55,
      orbitSpeed: 0.000006, // 165 Earth years
      rotationSpeed: 0.013,
      route: '/contact',
      description: 'Contact',
      features: { iceGiant: true, storms: true }
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
        <Canvas gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 25, 40]} fov={60} />

          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={100}
            autoRotate={true}
            autoRotateSpeed={0.2}
            enableDamping={true}
            dampingFactor={0.05}
            maxPolarAngle={Math.PI / 1.8}
            minPolarAngle={Math.PI / 4}
          />

          {/* Lights */}
          <ambientLight intensity={0.08} />
          <hemisphereLight args={['#ffffff', '#000033', 0.2]} />

          {/* Stars - Multiple layers for depth */}
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

          {/* Sun */}
          <RealisticSun />

          {/* Planets */}
          {planets.map((planet, index) => (
            <RealPlanet
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

          {/* Bloom for glow effects */}
          <EffectComposer>
            <Bloom
              intensity={0.9}
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

export default RealSolarSystem;

