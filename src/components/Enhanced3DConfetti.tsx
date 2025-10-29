import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, useTheme, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import CelebrationIcon from '@mui/icons-material/Celebration';
import * as THREE from 'three';

interface Enhanced3DConfettiProps {
  count?: number;
  continuous?: boolean;
}

const Enhanced3DConfetti: React.FC<Enhanced3DConfettiProps> = ({ 
  count = 150,
  continuous = false
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isExploding, setIsExploding] = useState(continuous);
  const [clickCount, setClickCount] = useState(0);
  const [isContinuous, setIsContinuous] = useState(continuous);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Object3D[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const continuousTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      canvasRef.current.clientWidth / canvasRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Add point light for added sparkle
    const pointLight = new THREE.PointLight(0xffff99, 1, 10);
    pointLight.position.set(0, 2, 3);
    scene.add(pointLight);
    
    // Initial render
    renderer.render(scene, camera);
    
    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Start continuous celebration if enabled
    if (isContinuous) {
      startContinuousCelebration();
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Clean up animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Clean up continuous timer
      if (continuousTimerRef.current) {
        clearInterval(continuousTimerRef.current);
        continuousTimerRef.current = null;
      }
      
      // Clean up particles
      if (sceneRef.current) {
        particlesRef.current.forEach(particle => {
          if (sceneRef.current) {
            sceneRef.current.remove(particle);
            // @ts-ignore
            if (particle.geometry) particle.geometry.dispose();
            // @ts-ignore
            if (particle.material) particle.material.dispose();
          }
        });
        particlesRef.current = [];
      }
      
      // Dispose of renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [isContinuous, count]);
  
  // Start continuous celebration
  const startContinuousCelebration = () => {
    // Set exploding state for continuous mode
    setIsExploding(true);
    setIsContinuous(true);
    
    // Create initial confetti
    createConfetti(continuous ? Math.floor(count / 3) : count);
    
    // Set up interval for continuous mode
    if (!continuousTimerRef.current) {
      // Create a constant stream of particles from different positions
      continuousTimerRef.current = setInterval(() => {
        // Only add more if we're below a certain threshold to prevent performance issues
        if (particlesRef.current.length < 350) {
          // Generate random positions across the scene
          const positions = [
            { x: (Math.random() - 0.5) * 6, y: -2, z: (Math.random() - 0.5) * 3 },
            { x: (Math.random() - 0.5) * 6, y: 4, z: (Math.random() - 0.5) * 3 },
            { x: -3, y: (Math.random() - 0.5) * 4, z: (Math.random() - 0.5) * 3 },
            { x: 3, y: (Math.random() - 0.5) * 4, z: (Math.random() - 0.5) * 3 },
            { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4, z: -2 }, // Added depth
          ];
          
          // Add small bursts from multiple positions
          positions.forEach(position => {
            const burstSize = Math.floor(Math.random() * 5) + 3;
            createConfettiFromPosition(burstSize, position);
          });
        }
      }, 250); // Faster interval for more consistent confetti
    }
  };
  
  // Stop continuous celebration
  const stopContinuousCelebration = () => {
    setIsExploding(false);
    setIsContinuous(false);
    
    // Clear the continuous timer
    if (continuousTimerRef.current) {
      clearInterval(continuousTimerRef.current);
      continuousTimerRef.current = null;
    }
    
    // Let existing particles fade out naturally
    // We don't clear them immediately for a smoother transition
  };
  
  // Create confetti particles from a specific position
  const createConfettiFromPosition = (particleCount: number, position = { x: 0, y: 0, z: 0 }) => {
    if (!sceneRef.current) return;
    
    // Colors for confetti - more vibrant selection
    const colors = [
      new THREE.Color(theme.palette.primary.main),
      new THREE.Color(theme.palette.secondary.main),
      new THREE.Color(theme.palette.success.main),
      new THREE.Color(theme.palette.error.main),
      new THREE.Color(theme.palette.warning.main),
      new THREE.Color(theme.palette.info.main),
      new THREE.Color('#FF1493'), // Deep pink
      new THREE.Color('#00FFFF'), // Cyan
      new THREE.Color('#FFD700'), // Gold
      new THREE.Color('#9932CC'), // Dark orchid
    ];
    
    // Create new particles
    for (let i = 0; i < particleCount; i++) {
      // Choose random shape
      let geometry;
      const shapeType = Math.floor(Math.random() * 8); // More shape variety
      
      switch(shapeType) {
        case 0: // Cube
          geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
          break;
        case 1: // Small pyramid
          geometry = new THREE.ConeGeometry(0.08, 0.15, 4);
          break;
        case 2: // Sphere
          geometry = new THREE.SphereGeometry(0.05, 8, 8);
          break;
        case 3: // Flat rectangle
          geometry = new THREE.PlaneGeometry(0.15, 0.05);
          break;
        case 4: // Star-like shape (octahedron)
          geometry = new THREE.OctahedronGeometry(0.08);
          break;
        case 5: // Donut (torus)
          geometry = new THREE.TorusGeometry(0.05, 0.02, 8, 12);
          break;
        case 6: // Tetrahedron
          geometry = new THREE.TetrahedronGeometry(0.08);
          break;
        default: // Thin cylinder
          geometry = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 8);
      }
      
      // Choose random color
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Create material with physical properties
      const material = new THREE.MeshPhongMaterial({ 
        color, 
        flatShading: true,
        shininess: 150,
        specular: new THREE.Color(0xffffff)
      });
      
      // Randomly add metallic sparkle to some particles
      if (Math.random() > 0.7) {
        material.shininess = 300;
        material.specular = new THREE.Color(0xffffee);
      }
      
      // Create mesh
      const particle = new THREE.Mesh(geometry, material);
      
      // Set initial position
      particle.position.set(position.x, position.y, position.z);
      
      // Add random rotation
      particle.rotation.x = Math.random() * Math.PI * 2;
      particle.rotation.y = Math.random() * Math.PI * 2;
      particle.rotation.z = Math.random() * Math.PI * 2;
      
      // Add random velocity
      // @ts-ignore - adding custom properties to the THREE.Object3D
      particle.velocity = {
        x: (Math.random() - 0.5) * 0.3,
        y: Math.random() * 0.2 + 0.1, // Upward bias
        z: (Math.random() - 0.5) * 0.3
      };
      
      // Add random rotation velocity
      // @ts-ignore
      particle.rotationVelocity = {
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 0.2
      };
      
      // Add lifespan for continuous mode
      if (continuous) {
        // @ts-ignore
        particle.lifespan = Math.random() * 3 + 2; // 2-5 seconds
        // @ts-ignore
        particle.age = 0;
      }
      
      // Add to scene
      sceneRef.current.add(particle);
      particlesRef.current.push(particle);
    }
    
    // Start animation if not already running
    if (!animationFrameRef.current) {
      animate();
    }
  };
  
  // Create confetti particles
  const createConfetti = (particleCount = count) => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
    
    setIsExploding(true);
    setClickCount(prev => prev + 1);
    
    // For manual explosions, clear existing particles
    if (!continuous) {
      particlesRef.current.forEach(particle => {
        if (sceneRef.current) {
          sceneRef.current.remove(particle);
          // @ts-ignore
          if (particle.geometry) particle.geometry.dispose();
          // @ts-ignore
          if (particle.material) particle.material.dispose();
        }
      });
      particlesRef.current = [];
    }
    
    // Create new particles from center
    createConfettiFromPosition(particleCount);
    
    // Reset button state after a while for non-continuous mode
    if (!continuous) {
      setTimeout(() => {
        setIsExploding(false);
      }, 5000);
    }
  };
  
  // Animation loop
  const animate = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
    
    const deltaTime = 0.016; // Approximately 60 FPS
    
    // Update particles
    particlesRef.current = particlesRef.current.filter(particle => {
      if (!sceneRef.current) return false;
      
      // @ts-ignore - accessing custom properties
      particle.position.x += particle.velocity.x;
      // @ts-ignore
      particle.position.y += particle.velocity.y;
      // @ts-ignore
      particle.position.z += particle.velocity.z;
      
      // Apply gravity
      // @ts-ignore
      particle.velocity.y -= 0.01;
      
      // Apply rotation
      // @ts-ignore
      particle.rotation.x += particle.rotationVelocity.x;
      // @ts-ignore
      particle.rotation.y += particle.rotationVelocity.y;
      // @ts-ignore
      particle.rotation.z += particle.rotationVelocity.z;
      
      // Update age for continuous mode
      // @ts-ignore
      if (continuous && particle.lifespan) {
        // @ts-ignore
        particle.age += deltaTime;
        
        // Fade out particles as they age
        // @ts-ignore
        if (particle.age / particle.lifespan > 0.7) {
          // @ts-ignore
          const opacity = 1 - (particle.age / particle.lifespan - 0.7) / 0.3;
          // @ts-ignore
          particle.material.opacity = Math.max(0, opacity);
          // @ts-ignore
          particle.material.transparent = true;
        }
        
        // Remove if expired
        // @ts-ignore
        if (particle.age >= particle.lifespan) {
          sceneRef.current.remove(particle);
          // @ts-ignore
          if (particle.geometry) particle.geometry.dispose();
          // @ts-ignore
          if (particle.material) particle.material.dispose();
          return false;
        }
      }
      
      // Check if particle is out of bounds
      if (
        particle.position.y < -5 ||
        Math.abs(particle.position.x) > 10 ||
        Math.abs(particle.position.z) > 10
      ) {
        sceneRef.current.remove(particle);
        // @ts-ignore
        if (particle.geometry) particle.geometry.dispose();
        // @ts-ignore
        if (particle.material) particle.material.dispose();
        return false;
      }
      
      return true;
    });
    
    // Render scene
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    
    // Continue animation if particles remain or in continuous mode
    if (particlesRef.current.length > 0 || continuous) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      animationFrameRef.current = null;
    }
  };
  
  // Easter egg message based on click count
  const getEasterEggMessage = () => {
    if (clickCount >= 10) {
      return "WOW! You REALLY love celebrations! 🎉🎉🎉";
    } else if (clickCount >= 5) {
      return "You're a celebration enthusiast! 🎉🎉";
    } else if (clickCount >= 3) {
      return "That's the spirit! Keep celebrating! 🎉";
    }
    return null;
  };
  
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Hide instructions if in continuous mode */}
      {!continuous && !isContinuous && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 2, 
            width: '100%', 
            bgcolor: 'background.paper',
            border: '1px dashed',
            borderColor: 'secondary.light',
            borderRadius: 2
          }}
        >
          <Typography variant="body2" align="center" sx={{ fontWeight: 'medium' }}>
            Click the button below to launch an amazing 3D celebration! 🎉
          </Typography>
        </Paper>
      )}
      
      {/* 3D Confetti container */}
      <Box 
        ref={containerRef}
        sx={{ 
          position: 'relative', 
          width: '100%', 
          height: 300, 
          overflow: 'hidden',
          border: continuous || isContinuous ? '2px solid' : '2px solid',
          borderColor: isExploding ? 'secondary.main' : 'secondary.light',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: continuous || isContinuous ? (theme.palette.mode === 'dark' ? 'rgba(10,10,10,0.3)' : 'rgba(240,240,240,0.3)') : (theme.palette.mode === 'dark' ? 'rgba(20,20,20,0.3)' : 'rgba(250,250,250,0.3)'),
          boxShadow: isExploding ? `0 0 20px ${theme.palette.secondary.main}` : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        <canvas 
          ref={canvasRef} 
          style={{ 
            width: '100%', 
            height: '100%', 
            position: 'absolute',
            top: 0,
            left: 0
          }} 
        />
        
        {particlesRef.current.length === 0 && !isExploding && !isContinuous && !continuous && (
          <Box sx={{ textAlign: 'center', opacity: 0.7, zIndex: 1 }}>
            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
              Celebration area
            </Typography>
          </Box>
        )}
        
        {/* Easter egg message */}
        {getEasterEggMessage() && !continuous && !isContinuous && (
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 10, 
              left: '50%', 
              transform: 'translateX(-50%)',
              bgcolor: 'background.paper',
              p: 1, 
              px: 2,
              borderRadius: 5,
              boxShadow: 3,
              zIndex: 10
            }}
          >
            <Typography variant="caption" color="secondary" sx={{ fontWeight: 'bold' }}>
              {getEasterEggMessage()}
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Control buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        {/* Show start button in non-continuous mode or when celebration is stopped */}
        {(!isContinuous && !continuous) && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CelebrationIcon />}
            onClick={() => startContinuousCelebration()}
            disabled={isExploding}
            sx={{ 
              position: 'relative',
              minWidth: 150,
              overflow: 'hidden',
              '&::after': !isExploding ? {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'inherit',
                animation: 'pulse-button 1.5s infinite',
                zIndex: -1
              } : {},
              '@keyframes pulse-button': {
                '0%': { boxShadow: `0 0 0 0 ${theme.palette.secondary.main}40` },
                '70%': { boxShadow: `0 0 0 10px ${theme.palette.secondary.main}00` },
                '100%': { boxShadow: `0 0 0 0 ${theme.palette.secondary.main}00` }
              }
            }}
          >
            Start Celebration
          </Button>
        )}
        
        {/* Show stop button when in continuous mode or celebration is running */}
        {(isContinuous || continuous) && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => stopContinuousCelebration()}
            sx={{ 
              minWidth: 150,
              borderWidth: 2
            }}
          >
            Stop Celebration
          </Button>
        )}
      </Box>
      
      {/* Status message */}
      {!continuous && (
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            mt: 1,
            fontStyle: 'italic',
            visibility: isExploding ? 'visible' : 'hidden'
          }}
        >
          {isExploding ? "Woohoo! Celebration in progress!" : ""}
        </Typography>
      )}
    </Box>
  );
};

export default Enhanced3DConfetti; 