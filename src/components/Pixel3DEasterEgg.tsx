import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface Pixel3DEasterEggProps {
  isUnlocked: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  type?: 'robot' | 'cat' | 'alien';
}

const Pixel3DEasterEgg: React.FC<Pixel3DEasterEggProps> = ({ 
  isUnlocked, 
  position = 'bottom-right',
  type = 'robot'
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [showMessage, setShowMessage] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(true);
  const [characterMood, setCharacterMood] = useState<'normal' | 'happy' | 'wink' | 'surprised'>('surprised');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const characterRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Define position styles
  let positionStyles = {};
  switch(position) {
    case 'top-left':
      positionStyles = { top: 20, left: 20 };
      break;
    case 'top-right':
      positionStyles = { top: 20, right: 20 };
      break;
    case 'bottom-left':
      positionStyles = { bottom: 20, left: 20 };
      break;
    case 'bottom-right':
    default:
      positionStyles = { bottom: 20, right: 20 };
      break;
  }
  
  // Setup Three.js scene
  useEffect(() => {
    if (!isUnlocked || !canvasRef.current) return;
    
    // Hide notification after 5 seconds
    const notificationTimer = setTimeout(() => {
      setNotificationVisible(false);
    }, 5000);
    
    // Set up Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 3;
    cameraRef.current = camera;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(80, 80);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create character
    const character = createVoxelCharacter(type, characterMood);
    characterRef.current = character;
    scene.add(character);
    
    // Animation loop
    let counter = 0;
    const animate = () => {
      counter += 0.05;
      
      if (characterRef.current) {
        // Spin and bounce
        characterRef.current.rotation.y += 0.03;
        characterRef.current.position.y = Math.sin(counter) * 0.2;
      }
      
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      clearTimeout(notificationTimer);
      
      if (scene && characterRef.current) {
        scene.remove(characterRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [isUnlocked, type, characterMood]);
  
  // Handle interaction with character
  const handleCharacterClick = () => {
    // Cycle through moods
    const moods: ('normal' | 'happy' | 'wink' | 'surprised')[] = ['normal', 'happy', 'wink', 'surprised'];
    const currentIndex = moods.indexOf(characterMood);
    const nextIndex = (currentIndex + 1) % moods.length;
    setCharacterMood(moods[nextIndex]);
    
    // Toggle message
    setShowMessage(!showMessage);
  };
  
  // Create voxel character
  const createVoxelCharacter = (type: string, mood: string) => {
    const group = new THREE.Group();
    
    // Color palette
    const mainColor = isDark ? 0xffffff : 0x333333;
    const accentColor = new THREE.Color(theme.palette.warning.main).getHex();
    const secondaryColor = new THREE.Color(theme.palette.secondary.main).getHex();
    const tertiaryColor = 0x00ffff; // Cyan
    
    // Create voxel data based on character type
    let voxelData: number[][][] = [];
    
    if (type === 'alien') {
      voxelData = createAlienVoxels(mood);
    } else if (type === 'cat') {
      voxelData = createCatVoxels(mood);
    } else {
      voxelData = createRobotVoxels(mood);
    }
    
    // Create each voxel cube
    for (let x = 0; x < voxelData.length; x++) {
      for (let y = 0; y < voxelData[x].length; y++) {
        for (let z = 0; z < voxelData[x][y].length; z++) {
          const voxel = voxelData[x][y][z];
          
          if (voxel === 0) continue; // Skip empty voxels
          
          // Create voxel cube
          const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
          
          // Choose color based on voxel value
          let color;
          switch(voxel) {
            case 1: color = mainColor; break;
            case 2: color = accentColor; break;
            case 3: color = secondaryColor; break;
            case 4: color = tertiaryColor; break;
            default: color = mainColor;
          }
          
          const material = new THREE.MeshLambertMaterial({ color });
          
          // Create mesh and position it
          const cube = new THREE.Mesh(geometry, material);
          cube.position.set(
            (x - voxelData.length / 2) * 0.2,
            (y - voxelData[x].length / 2) * 0.2, 
            (z - voxelData[x][y].length / 2) * 0.2
          );
          
          // Add to group
          group.add(cube);
        }
      }
    }
    
    return group;
  };
  
  // Voxel data for robot character
  const createRobotVoxels = (mood: string) => {
    // 8x8x8 voxel data
    const voxels = Array(8).fill(0).map(() => 
      Array(8).fill(0).map(() => Array(8).fill(0))
    );
    
    // Body
    for (let x = 2; x < 6; x++) {
      for (let y = 2; y < 5; y++) {
        for (let z = 2; z < 6; z++) {
          voxels[x][y][z] = 1; // Main body
        }
      }
    }
    
    // Head
    for (let x = 3; x < 5; x++) {
      for (let y = 5; y < 7; y++) {
        for (let z = 3; z < 5; z++) {
          voxels[x][y][z] = 2; // Accent color for head
        }
      }
    }
    
    // Antenna
    voxels[4][7][4] = 4;
    
    // Arms
    for (let y = 3; y < 5; y++) {
      voxels[1][y][3] = 3;
      voxels[6][y][3] = 3;
    }
    
    // Eyes based on mood
    if (mood === 'wink') {
      voxels[3][5][2] = 4; // Left eye
      voxels[4][5][2] = 1; // Right eye winking
    } else if (mood === 'surprised') {
      voxels[3][5][2] = 4; // Left eye
      voxels[4][5][2] = 4; // Right eye
      // Open mouth
      voxels[3][4][2] = 4;
      voxels[4][4][2] = 4;
    } else if (mood === 'happy') {
      voxels[3][5][2] = 4; // Left eye
      voxels[4][5][2] = 4; // Right eye
      // Smile
      voxels[3][4][2] = 3;
      voxels[4][4][2] = 3;
    } else {
      voxels[3][5][2] = 4; // Left eye
      voxels[4][5][2] = 4; // Right eye
    }
    
    return voxels;
  };
  
  // Voxel data for alien character
  const createAlienVoxels = (mood: string) => {
    // 8x8x8 voxel data
    const voxels = Array(8).fill(0).map(() => 
      Array(8).fill(0).map(() => Array(8).fill(0))
    );
    
    // Body - oval shaped
    for (let x = 3; x < 5; x++) {
      for (let y = 2; y < 4; y++) {
        for (let z = 3; z < 5; z++) {
          voxels[x][y][z] = 3; // Secondary color for body
        }
      }
    }
    
    // Head - larger oval
    for (let x = 2; x < 6; x++) {
      for (let y = 4; y < 7; y++) {
        for (let z = 2; z < 6; z++) {
          voxels[x][y][z] = 2; // Accent color for head
        }
      }
    }
    
    // Antennae
    voxels[2][7][3] = 4;
    voxels[5][7][3] = 4;
    
    // Eyes based on mood - larger alien eyes
    if (mood === 'wink') {
      voxels[2][5][2] = 4; // Left eye
      voxels[3][5][2] = 4; // Left eye extended
      voxels[4][5][2] = 2; // Right eye winking
      voxels[5][5][2] = 2; // Right eye extended winking
    } else if (mood === 'surprised') {
      voxels[2][5][2] = 4; // Left eye
      voxels[3][5][2] = 4; // Left eye extended
      voxels[4][5][2] = 4; // Right eye
      voxels[5][5][2] = 4; // Right eye extended
      // Open mouth
      voxels[3][4][2] = 1;
      voxels[4][4][2] = 1;
    } else if (mood === 'happy') {
      voxels[2][5][2] = 4; // Left eye
      voxels[3][5][2] = 4; // Left eye extended
      voxels[4][5][2] = 4; // Right eye
      voxels[5][5][2] = 4; // Right eye extended
      // Smile
      voxels[3][4][2] = 1;
      voxels[4][4][2] = 1;
    } else {
      voxels[2][5][2] = 4; // Left eye
      voxels[3][5][2] = 4; // Left eye extended
      voxels[4][5][2] = 4; // Right eye
      voxels[5][5][2] = 4; // Right eye extended
    }
    
    return voxels;
  };
  
  // Voxel data for cat character
  const createCatVoxels = (mood: string) => {
    // 8x8x8 voxel data
    const voxels = Array(8).fill(0).map(() => 
      Array(8).fill(0).map(() => Array(8).fill(0))
    );
    
    // Body
    for (let x = 2; x < 6; x++) {
      for (let y = 2; y < 4; y++) {
        for (let z = 2; z < 6; z++) {
          voxels[x][y][z] = 2; // Accent color for body
        }
      }
    }
    
    // Head
    for (let x = 3; x < 5; x++) {
      for (let y = 4; y < 6; y++) {
        for (let z = 3; z < 5; z++) {
          voxels[x][y][z] = 2; // Accent color for head
        }
      }
    }
    
    // Ears - pointy cat ears
    voxels[2][6][3] = 2;
    voxels[5][6][3] = 2;
    
    // Tail
    voxels[6][3][4] = 2;
    voxels[7][4][4] = 2;
    
    // Eyes based on mood
    if (mood === 'wink') {
      voxels[3][5][2] = 4; // Left eye
      voxels[4][5][2] = 2; // Right eye winking
    } else if (mood === 'surprised') {
      voxels[3][5][2] = 1; // Left eye
      voxels[4][5][2] = 1; // Right eye
    } else if (mood === 'happy') {
      voxels[3][5][2] = 3; // Left eye
      voxels[4][5][2] = 3; // Right eye
      // Smile
      voxels[3][4][2] = 4;
      voxels[4][4][2] = 4;
    } else {
      voxels[3][5][2] = 4; // Left eye
      voxels[4][5][2] = 4; // Right eye
    }
    
    // Nose
    voxels[3][4][2] = 1;
    voxels[4][4][2] = 1;
    
    // Whiskers
    voxels[2][4][2] = 1;
    voxels[5][4][2] = 1;
    
    return voxels;
  };
  
  if (!isUnlocked) return null;
  
  return (
    <AnimatePresence>
      {isUnlocked && (
        <>
          {/* Initial notification when unlocked */}
          <AnimatePresence>
            {notificationVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2000,
                  pointerEvents: 'none'
                }}
              >
                <Box sx={{
                  bgcolor: 'background.paper',
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 5,
                  border: '2px solid',
                  borderColor: 'warning.main',
                  textAlign: 'center',
                  maxWidth: 300
                }}>
                  <Typography variant="h6" gutterBottom color="warning.main">
                    🎉 Easter Egg Unlocked! 🎉
                  </Typography>
                  <Typography variant="body2" paragraph>
                    You found the secret 3D pixel friend! Look for it in the {position.replace('-', ' ')} corner of the screen.
                  </Typography>
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        This message will disappear in 5 seconds...
                      </Typography>
                    </motion.div>
                  </Box>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 3D Character */}
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 5 }}
            style={{ 
              position: 'fixed',
              zIndex: 1000,
              ...positionStyles,
              cursor: 'pointer'
            }}
            onClick={handleCharacterClick}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(40, 40, 40, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                border: '2px solid',
                borderColor: 'warning.main',
                p: 1,
                boxShadow: '0 0 15px rgba(255, 152, 0, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'glow 2s infinite alternate',
                '@keyframes glow': {
                  '0%': { boxShadow: '0 0 10px rgba(255, 152, 0, 0.4)' },
                  '100%': { boxShadow: '0 0 20px rgba(255, 152, 0, 0.8)' }
                }
              }}
            >
              <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%' }}
              />
            </Box>
            
            <AnimatePresence>
              {showMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{ 
                    position: 'absolute',
                    bottom: '100%',
                    right: position === 'bottom-left' || position === 'top-left' ? 'auto' : 0,
                    left: position === 'bottom-left' || position === 'top-left' ? 0 : 'auto',
                    marginBottom: 10,
                    zIndex: 1001,
                    width: 240,
                  }}
                >
                  <Box sx={{
                    bgcolor: 'background.paper',
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                    border: `2px solid ${theme.palette.warning.main}`,
                  }}>
                    <Typography variant="body2" align="center" sx={{ fontWeight: 'medium' }}>
                      {type === 'robot' && "Beep boop! I'm a secret robot friend! You've found me! 🤖"}
                      {type === 'alien' && "Greetings Earthling! I come in peace! 👽"}
                      {type === 'cat' && "Meow! You've found the secret kitty! Purrrfect! 🐱"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                      (Click me again to close this message)
                    </Typography>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Pixel3DEasterEgg; 