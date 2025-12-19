import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Environment } from '@react-three/drei';
import { Box, CircularProgress } from '@mui/material';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import RealisticSun from './RealisticSun';
import RealisticPlanet from './RealisticPlanet';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const RealisticSolarSystemScene: React.FC = () => {
  const navigate = useNavigate();

  const planets = [
    {
      name: 'About',
      size: 0.6,
      color: '#4A90E2',
      atmosphereColor: '#87CEEB',
      orbitRadius: 6,
      orbitSpeed: 0.0012,
      rotationSpeed: 0.008,
      route: '/about',
    },
    {
      name: 'Projects',
      size: 0.9,
      color: '#E74C3C',
      atmosphereColor: '#FF6B6B',
      orbitRadius: 10,
      orbitSpeed: 0.0009,
      rotationSpeed: 0.006,
      route: '/projects',
      hasRings: true,
    },
    {
      name: 'Experience',
      size: 0.75,
      color: '#F39C12',
      atmosphereColor: '#FFB347',
      orbitRadius: 14,
      orbitSpeed: 0.0007,
      rotationSpeed: 0.005,
      route: '/resume?resume=experience',
    },
    {
      name: 'Education',
      size: 0.7,
      color: '#9B59B6',
      atmosphereColor: '#B19CD9',
      orbitRadius: 18,
      orbitSpeed: 0.0006,
      rotationSpeed: 0.007,
      route: '/resume?resume=education',
    },
    {
      name: 'Skills',
      size: 0.8,
      color: '#1ABC9C',
      atmosphereColor: '#7FFFD4',
      orbitRadius: 22,
      orbitSpeed: 0.0005,
      rotationSpeed: 0.004,
      route: '/resume?resume=skills',
    },
    {
      name: 'Contact',
      size: 0.55,
      color: '#34495E',
      atmosphereColor: '#5D6D7E',
      orbitRadius: 26,
      orbitSpeed: 0.0004,
      rotationSpeed: 0.009,
      route: '/contact',
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
        <Canvas gl={{ antialias: true, alpha: false }}>
          {/* Camera with better starting position */}
          <PerspectiveCamera makeDefault position={[0, 20, 30]} fov={60} />

          {/* Enhanced controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={8}
            maxDistance={60}
            autoRotate={true}
            autoRotateSpeed={0.3}
            enableDamping={true}
            dampingFactor={0.05}
          />

          {/* Enhanced ambient light */}
          <ambientLight intensity={0.15} />
          
          {/* Hemisphere light for better depth */}
          <hemisphereLight args={['#ffffff', '#080820', 0.3]} />

          {/* Stars background with multiple layers */}
          <Stars
            radius={150}
            depth={80}
            count={8000}
            factor={5}
            saturation={0}
            fade
            speed={0.5}
          />
          
          {/* Additional star layers for depth */}
          <Stars
            radius={100}
            depth={50}
            count={3000}
            factor={3}
            saturation={0.1}
            fade
            speed={0.3}
          />

          {/* Nebula-like background effect */}
          <mesh>
            <sphereGeometry args={[200, 32, 32]} />
            <meshBasicMaterial
              color="#0B0B1F"
              side={THREE.BackSide}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Realistic sun at center */}
          <RealisticSun />

          {/* Realistic planets */}
          {planets.map((planet, index) => (
            <RealisticPlanet
              key={index}
              position={[planet.orbitRadius, 0, 0]}
              size={planet.size}
              color={planet.color}
              atmosphereColor={planet.atmosphereColor}
              name={planet.name}
              orbitRadius={planet.orbitRadius}
              orbitSpeed={planet.orbitSpeed}
              rotationSpeed={planet.rotationSpeed}
              onClick={() => handlePlanetClick(planet.route)}
              hasRings={planet.hasRings}
            />
          ))}

          {/* Bloom effect for glow */}
          <EffectComposer>
            <Bloom
              intensity={0.8}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
            />
          </EffectComposer>
        </Canvas>
      </Suspense>
    </Box>
  );
};

export default RealisticSolarSystemScene;

