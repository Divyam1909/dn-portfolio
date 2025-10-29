import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, useTheme, Typography, Paper, Stack, ButtonGroup } from '@mui/material';
import { motion } from 'framer-motion';
import CelebrationIcon from '@mui/icons-material/Celebration';
import BalloonIcon from '@mui/icons-material/Brightness7';
import FireworkIcon from '@mui/icons-material/AutoAwesome';
import PetalIcon from '@mui/icons-material/Spa';
import * as THREE from 'three';

interface CelebrationEffectsProps {
  count?: number;
  continuous?: boolean;
}

type EffectType = 'confetti' | 'balloons' | 'fireworks' | 'petals';

interface Particle {
  object: THREE.Object3D;
  velocity: { x: number; y: number; z: number };
  rotationVelocity: { x: number; y: number; z: number };
  lifespan: number;
  age: number;
  type: EffectType;
  delay?: number;
  exploded?: boolean;
  childParticles?: Particle[];
}

const CelebrationEffects: React.FC<CelebrationEffectsProps> = ({ 
  count = 150,
  continuous = false
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isExploding, setIsExploding] = useState(continuous);
  const [selectedEffect, setSelectedEffect] = useState<EffectType>('confetti');
  const [isCelebrating, setIsCelebrating] = useState(continuous);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const effectsTimerRef = useRef<NodeJS.Timeout | null>(null);
  
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
    
    // Start celebration if continuous mode is enabled
    if (continuous) {
      startCelebration();
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Clean up animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Clean up effects timer
      if (effectsTimerRef.current) {
        clearInterval(effectsTimerRef.current);
        effectsTimerRef.current = null;
      }
      
      // Clean up particles
      if (sceneRef.current) {
        particlesRef.current.forEach(particle => {
          if (sceneRef.current) {
            sceneRef.current.remove(particle.object);
            // @ts-ignore
            if (particle.object.geometry) particle.object.geometry.dispose();
            // @ts-ignore
            if (particle.object.material) particle.object.material.dispose();
          }
        });
        particlesRef.current = [];
      }
      
      // Dispose of renderer
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [continuous]);
  
  // Start celebration
  const startCelebration = () => {
    setIsExploding(true);
    setIsCelebrating(true);
    
    // Create initial burst of particles
    createParticles(count / 3, selectedEffect);
    
    // Set up timer for continuous effects
    if (!effectsTimerRef.current) {
      effectsTimerRef.current = setInterval(() => {
        if (!isCelebrating) return;
        
        // Only add more if we're below a certain threshold to prevent performance issues
        if (particlesRef.current.length < 350) {
          // Generate random positions around the scene
          const positions = [
            { x: (Math.random() - 0.5) * 6, y: -2, z: (Math.random() - 0.5) * 3 },
            { x: (Math.random() - 0.5) * 6, y: 4, z: (Math.random() - 0.5) * 3 },
            { x: -3, y: (Math.random() - 0.5) * 4, z: (Math.random() - 0.5) * 3 },
            { x: 3, y: (Math.random() - 0.5) * 4, z: (Math.random() - 0.5) * 3 },
            { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4, z: -2 },
          ];
          
          // Create particles at random positions
          positions.forEach(position => {
            if (Math.random() > 0.7) {
              // Occasionally switch effects for variety
              const effects: EffectType[] = ['confetti', 'balloons', 'fireworks', 'petals'];
              const randomEffect = effects[Math.floor(Math.random() * effects.length)];
              createParticlesAtPosition(Math.floor(Math.random() * 5) + 3, randomEffect, position);
            } else {
              createParticlesAtPosition(Math.floor(Math.random() * 5) + 3, selectedEffect, position);
            }
          });
        }
      }, 300);
    }
  };
  
  // Stop celebration
  const stopCelebration = () => {
    setIsExploding(false);
    setIsCelebrating(false);
    
    // Clear the effects timer
    if (effectsTimerRef.current) {
      clearInterval(effectsTimerRef.current);
      effectsTimerRef.current = null;
    }
  };
  
  // Create particles at a specific position
  const createParticlesAtPosition = (particleCount: number, effectType: EffectType, position = { x: 0, y: 0, z: 0 }) => {
    if (!sceneRef.current) return;
    
    // Add particles based on the effect type
    for (let i = 0; i < particleCount; i++) {
      let particle: Particle | null = null;
      
      switch (effectType) {
        case 'confetti':
          particle = createConfettiParticle(position);
          break;
        case 'balloons':
          particle = createBalloonParticle(position);
          break;
        case 'fireworks':
          particle = createFireworkParticle(position);
          break;
        case 'petals':
          particle = createPetalParticle(position);
          break;
      }
      
      if (particle && sceneRef.current) {
        sceneRef.current.add(particle.object);
        particlesRef.current.push(particle);
      }
    }
    
    // Start animation if not already running
    if (!animationFrameRef.current) {
      animate();
    }
  };
  
  // Create particles
  const createParticles = (particleCount: number, effectType: EffectType) => {
    // Create particles from center
    createParticlesAtPosition(particleCount, effectType);
  };
  
  // Create a confetti particle
  const createConfettiParticle = (position: { x: number; y: number; z: number }): Particle => {
    // Colors for confetti
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
    ];
    
    // Choose random shape for confetti
    let geometry;
    const shapeType = Math.floor(Math.random() * 5);
    
    switch(shapeType) {
      case 0: // Cube
        geometry = new THREE.BoxGeometry(0.1, 0.1, 0.02);
        break;
      case 1: // Pyramid
        geometry = new THREE.ConeGeometry(0.08, 0.15, 4);
        break;
      case 2: // Sphere
        geometry = new THREE.SphereGeometry(0.05, 8, 8);
        break;
      case 3: // Flat rectangle
        geometry = new THREE.PlaneGeometry(0.15, 0.05);
        break;
      default: // Thin cylinder
        geometry = new THREE.CylinderGeometry(0.03, 0.03, 0.15, 8);
    }
    
    // Choose random color
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Create material
    const material = new THREE.MeshPhongMaterial({ 
      color, 
      flatShading: true,
      shininess: 150,
      specular: new THREE.Color(0xffffff)
    });
    
    // Create mesh
    const object = new THREE.Mesh(geometry, material);
    
    // Set position
    object.position.set(position.x, position.y, position.z);
    
    // Add random rotation
    object.rotation.x = Math.random() * Math.PI * 2;
    object.rotation.y = Math.random() * Math.PI * 2;
    object.rotation.z = Math.random() * Math.PI * 2;
    
    // Create particle
    return {
      object,
      velocity: {
        x: (Math.random() - 0.5) * 0.3,
        y: Math.random() * 0.2 + 0.1, // Upward bias
        z: (Math.random() - 0.5) * 0.3
      },
      rotationVelocity: {
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 0.2
      },
      lifespan: Math.random() * 3 + 2, // 2-5 seconds
      age: 0,
      type: 'confetti'
    };
  };
  
  // Create a balloon particle
  const createBalloonParticle = (position: { x: number; y: number; z: number }): Particle => {
    // Colors for balloons
    const colors = [
      '#FF5252', // Red
      '#448AFF', // Blue
      '#FF4081', // Pink
      '#69F0AE', // Green
      '#FFEB3B', // Yellow
      '#FF9800', // Orange
      '#9C27B0', // Purple
    ];
    
    // Create balloon shape
    const balloonGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    
    // Deform the geometry to make it look like a balloon
    const vertices = balloonGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      if (vertices[i + 1] < 0) {
        vertices[i + 1] *= 1.2; // Stretch the bottom
      }
    }
    
    // Choose random color
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Create material with slight transparency
    const material = new THREE.MeshPhongMaterial({ 
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.9,
      shininess: 100,
      specular: new THREE.Color(0xffffff)
    });
    
    // Create mesh
    const object = new THREE.Mesh(balloonGeometry, material);
    
    // Add string to balloon
    const stringGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.4, 8);
    const stringMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const string = new THREE.Mesh(stringGeometry, stringMaterial);
    string.position.y = -0.3;
    object.add(string);
    
    // Set position
    object.position.set(position.x, position.y, position.z);
    
    // Create balloon particle
    return {
      object,
      velocity: {
        x: (Math.random() - 0.5) * 0.1,
        y: Math.random() * 0.2 + 0.05, // Slow upward movement
        z: (Math.random() - 0.5) * 0.1
      },
      rotationVelocity: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
      },
      lifespan: Math.random() * 10 + 5, // Longer lifespan for balloons
      age: 0,
      type: 'balloons'
    };
  };
  
  // Create a firework particle
  const createFireworkParticle = (position: { x: number; y: number; z: number }): Particle => {
    // Create rocket geometry
    const rocketGeometry = new THREE.CylinderGeometry(0.02, 0.05, 0.2, 8);
    
    // Choose random color for the firework
    const colors = [
      '#FF5252', // Red
      '#448AFF', // Blue
      '#FF4081', // Pink
      '#69F0AE', // Green
      '#FFEB3B', // Yellow
      '#FF9800', // Orange
    ];
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Create material
    const material = new THREE.MeshPhongMaterial({ 
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.5
    });
    
    // Create mesh
    const object = new THREE.Mesh(rocketGeometry, material);
    
    // Set position - start from bottom
    object.position.set(position.x, position.y - 2, position.z);
    
    // Create firework particle with delayed explosion
    return {
      object,
      velocity: {
        x: (Math.random() - 0.5) * 0.1,
        y: Math.random() * 0.3 + 0.2, // Fast upward movement
        z: (Math.random() - 0.5) * 0.1
      },
      rotationVelocity: {
        x: 0,
        y: 0,
        z: 0
      },
      lifespan: Math.random() * 2 + 1, // Short lifespan before explosion
      age: 0,
      type: 'fireworks',
      exploded: false,
      childParticles: []
    };
  };
  
  // Create a petal particle
  const createPetalParticle = (position: { x: number; y: number; z: number }): Particle => {
    // Colors for petals
    const colors = [
      '#FF97C1', // Pink
      '#FFD700', // Yellow
      '#FF7F50', // Coral
      '#E6E6FA', // Lavender
      '#FFFACD', // Cream
      '#98FB98', // Pale green
      '#DDA0DD', // Plum
    ];
    
    // Create petal shape (flattened sphere)
    const petalGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const scaleMatrix = new THREE.Matrix4().makeScale(1, 0.1, 0.8);
    petalGeometry.applyMatrix4(scaleMatrix);
    
    // Choose random color
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Create material with transparency
    const material = new THREE.MeshPhongMaterial({ 
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    });
    
    // Create mesh
    const object = new THREE.Mesh(petalGeometry, material);
    
    // Set position
    object.position.set(position.x, position.y, position.z);
    
    // Create petal particle
    return {
      object,
      velocity: {
        x: (Math.random() - 0.5) * 0.2,
        y: Math.random() * -0.1 - 0.05, // Gentle falling
        z: (Math.random() - 0.5) * 0.2
      },
      rotationVelocity: {
        x: (Math.random() - 0.5) * 0.05,
        y: (Math.random() - 0.5) * 0.05,
        z: (Math.random() - 0.5) * 0.05
      },
      lifespan: Math.random() * 5 + 3, // Moderately long lifespan
      age: 0,
      type: 'petals'
    };
  };
  
  // Create firework explosion particles
  const createFireworkExplosion = (position: { x: number; y: number; z: number }, color: THREE.Color) => {
    if (!sceneRef.current) return;
    
    // Number of particles in explosion
    const particleCount = Math.floor(Math.random() * 30) + 20;
    
    // Create explosion particles
    for (let i = 0; i < particleCount; i++) {
      // Create small sphere for explosion particle
      const geometry = new THREE.SphereGeometry(0.03, 8, 8);
      
      // Create material with glow
      const material = new THREE.MeshPhongMaterial({ 
        color: color,
        emissive: color,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 1
      });
      
      // Create mesh
      const object = new THREE.Mesh(geometry, material);
      
      // Set position
      object.position.set(position.x, position.y, position.z);
      
      // Calculate velocity in all directions (spherical)
      const speed = Math.random() * 0.3 + 0.1;
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      
      const velocity = {
        x: speed * Math.sin(theta) * Math.cos(phi),
        y: speed * Math.sin(theta) * Math.sin(phi),
        z: speed * Math.cos(theta)
      };
      
      // Create explosion particle
      const particle: Particle = {
        object,
        velocity,
        rotationVelocity: {
          x: 0, y: 0, z: 0
        },
        lifespan: Math.random() * 1 + 0.5, // Short lifespan
        age: 0,
        type: 'fireworks'
      };
      
      // Add to scene and particles array
      sceneRef.current.add(object);
      particlesRef.current.push(particle);
    }
  };
  
  // Animation loop
  const animate = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
    
    const deltaTime = 0.016; // Approximately 60 FPS
    
    // Update all particles
    particlesRef.current = particlesRef.current.filter(particle => {
      if (!sceneRef.current) return false;
      
      const obj = particle.object;
      
      // Update position
      obj.position.x += particle.velocity.x;
      obj.position.y += particle.velocity.y;
      obj.position.z += particle.velocity.z;
      
      // Update rotation
      obj.rotation.x += particle.rotationVelocity.x;
      obj.rotation.y += particle.rotationVelocity.y;
      obj.rotation.z += particle.rotationVelocity.z;
      
      // Apply type-specific behavior
      switch (particle.type) {
        case 'confetti':
          // Apply gravity
          particle.velocity.y -= 0.01;
          break;
          
        case 'balloons':
          // Slight float and sway
          particle.velocity.x += (Math.random() - 0.5) * 0.01;
          particle.velocity.z += (Math.random() - 0.5) * 0.01;
          break;
          
        case 'fireworks':
          if (!particle.exploded && particle.velocity.y < 0.05 && particle.age > 0.5) {
            // Check if object is a Mesh with material property
            const mesh = obj as THREE.Mesh;
            if (mesh.material && mesh.material instanceof THREE.MeshPhongMaterial) {
              const color = mesh.material.color;
              createFireworkExplosion(obj.position, color);
            }
            particle.exploded = true;
            
            // Remove the rocket
            sceneRef.current.remove(obj);
            return false;
          }
          
          // Apply gravity to firework
          particle.velocity.y -= 0.005;
          break;
          
        case 'petals':
          // Gentle falling and swaying
          particle.velocity.x += (Math.random() - 0.5) * 0.01;
          particle.velocity.z += (Math.random() - 0.5) * 0.01;
          particle.velocity.y -= 0.002; // Gentle gravity
          break;
      }
      
      // Update age
      particle.age += deltaTime;
      
      // Fade out particles as they age
      if (particle.age / particle.lifespan > 0.7) {
        const opacity = 1 - (particle.age / particle.lifespan - 0.7) / 0.3;
        
        // Apply opacity only to meshes with materials
        if ((obj as THREE.Mesh).material) {
          ((obj as THREE.Mesh).material as THREE.Material).transparent = true;
          ((obj as THREE.Mesh).material as any).opacity = Math.max(0, opacity);
        }
      }
      
      // Remove if expired
      if (particle.age >= particle.lifespan) {
        sceneRef.current.remove(obj);
        // Dispose of geometry and material
        if ((obj as THREE.Mesh).geometry) {
          (obj as THREE.Mesh).geometry.dispose();
        }
        if ((obj as THREE.Mesh).material) {
          ((obj as THREE.Mesh).material as THREE.Material).dispose();
        }
        return false;
      }
      
      // Check if out of bounds
      if (
        obj.position.y < -5 ||
        Math.abs(obj.position.x) > 10 ||
        Math.abs(obj.position.z) > 10
      ) {
        sceneRef.current.remove(obj);
        // Dispose of geometry and material
        if ((obj as THREE.Mesh).geometry) {
          (obj as THREE.Mesh).geometry.dispose();
        }
        if ((obj as THREE.Mesh).material) {
          ((obj as THREE.Mesh).material as THREE.Material).dispose();
        }
        return false;
      }
      
      return true;
    });
    
    // Render scene
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    
    // Continue animation if particles remain or continuous mode is enabled
    if (particlesRef.current.length > 0 || isCelebrating) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      animationFrameRef.current = null;
    }
  };
  
  // Handle effect selection
  const handleEffectChange = (effect: EffectType) => {
    setSelectedEffect(effect);
    
    // If currently celebrating, create a burst of the new effect
    if (isCelebrating) {
      createParticles(20, effect);
    }
  };
  
  // Get icon and color for effect
  const getEffectIcon = (effect: EffectType) => {
    switch (effect) {
      case 'confetti':
        return {
          icon: <CelebrationIcon />,
          color: 'primary'
        };
      case 'balloons':
        return {
          icon: <BalloonIcon />,
          color: 'secondary'
        };
      case 'fireworks':
        return {
          icon: <FireworkIcon />,
          color: 'error'
        };
      case 'petals':
        return {
          icon: <PetalIcon />,
          color: 'success'
        };
    }
  };
  
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Instructions */}
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
        <Typography variant="body2" align="center" sx={{ fontWeight: 'medium', mb: 1 }}>
          Choose an effect and start the celebration! 🎉
        </Typography>
        
        {/* Effect selection */}
        <ButtonGroup 
          variant="outlined" 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            width: '100%', 
            flexWrap: 'wrap',
            mb: 2
          }}
        >
          {(['confetti', 'balloons', 'fireworks', 'petals'] as EffectType[]).map((effect) => {
            const { icon, color } = getEffectIcon(effect);
            return (
              <Button
                key={effect}
                // @ts-ignore - MUI types don't accept string literals for color
                color={color}
                variant={selectedEffect === effect ? 'contained' : 'outlined'}
                onClick={() => handleEffectChange(effect)}
                startIcon={icon}
                sx={{ 
                  borderRadius: 0,
                  textTransform: 'capitalize',
                  m: 0.5
                }}
              >
                {effect}
              </Button>
            );
          })}
        </ButtonGroup>
      </Paper>
      
      {/* Canvas container */}
      <Box 
        ref={containerRef}
        sx={{ 
          position: 'relative', 
          width: '100%', 
          height: 350, 
          overflow: 'hidden',
          border: '2px solid',
          borderColor: isExploding ? 'secondary.main' : 'secondary.light',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(10,10,10,0.3)' : 'rgba(240,240,240,0.3)',
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
        
        {particlesRef.current.length === 0 && !isExploding && (
          <Box sx={{ textAlign: 'center', opacity: 0.7, zIndex: 1 }}>
            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
              Celebration area
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Control buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        {!isCelebrating ? (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<CelebrationIcon />}
            onClick={startCelebration}
            sx={{ 
              position: 'relative',
              minWidth: 150,
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: 'inherit',
                animation: 'pulse-button 1.5s infinite',
                zIndex: -1
              },
              '@keyframes pulse-button': {
                '0%': { boxShadow: `0 0 0 0 ${theme.palette.secondary.main}40` },
                '70%': { boxShadow: `0 0 0 10px ${theme.palette.secondary.main}00` },
                '100%': { boxShadow: `0 0 0 0 ${theme.palette.secondary.main}00` }
              }
            }}
          >
            Start Celebration
          </Button>
        ) : (
          <Button
            variant="outlined"
            color="error"
            onClick={stopCelebration}
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
    </Box>
  );
};

export default CelebrationEffects; 