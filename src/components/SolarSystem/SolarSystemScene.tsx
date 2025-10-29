import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { Box, CircularProgress } from '@mui/material';
import Sun from './Sun';
import Planet from './Planet';
import { useNavigate } from 'react-router-dom';

const SolarSystemScene: React.FC = () => {
  const navigate = useNavigate();

  const planets = [
    {
      name: 'About',
      size: 0.6,
      color: '#3498db',
      orbitRadius: 5,
      orbitSpeed: 0.001,
      route: '/about',
    },
    {
      name: 'Projects',
      size: 0.8,
      color: '#e74c3c',
      orbitRadius: 8,
      orbitSpeed: 0.0008,
      route: '/projects',
    },
    {
      name: 'Experience',
      size: 0.7,
      color: '#f39c12',
      orbitRadius: 11,
      orbitSpeed: 0.0006,
      route: '/resume#experience',
    },
    {
      name: 'Education',
      size: 0.65,
      color: '#9b59b6',
      orbitRadius: 14,
      orbitSpeed: 0.0005,
      route: '/resume#education',
    },
    {
      name: 'Skills',
      size: 0.75,
      color: '#1abc9c',
      orbitRadius: 17,
      orbitSpeed: 0.0004,
      route: '/resume#skills',
    },
    {
      name: 'Contact',
      size: 0.5,
      color: '#34495e',
      orbitRadius: 20,
      orbitSpeed: 0.0003,
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
        <Canvas>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 15, 25]} />

          {/* Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={50}
            autoRotate={true}
            autoRotateSpeed={0.5}
          />

          {/* Ambient light */}
          <ambientLight intensity={0.1} />

          {/* Stars background */}
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />

          {/* Sun at center */}
          <Sun />

          {/* Planets */}
          {planets.map((planet, index) => (
            <Planet
              key={index}
              position={[planet.orbitRadius, 0, 0]}
              size={planet.size}
              color={planet.color}
              name={planet.name}
              orbitRadius={planet.orbitRadius}
              orbitSpeed={planet.orbitSpeed}
              onClick={() => handlePlanetClick(planet.route)}
            />
          ))}
        </Canvas>
      </Suspense>
    </Box>
  );
};

export default SolarSystemScene;

