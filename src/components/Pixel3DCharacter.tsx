import React, { useRef, useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import * as THREE from 'three';
import { characterSettings } from '../data/portfolioData';

interface Pixel3DCharacterProps {
  mood?: 'normal' | 'happy' | 'wink' | 'surprised';
  type?: 'dog' | 'cat' | 'robot';
  size?: number;
  autoRotate?: boolean;
}

const Pixel3DCharacter: React.FC<Pixel3DCharacterProps> = ({
  mood = 'normal',
  type = characterSettings.defaultCharacter,
  size = 180,
  autoRotate = true
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  
  // Set up Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create 3D voxel character
    const character = createVoxelCharacter(type, mood, isDark);
    scene.add(character);
    
    // Position camera
    camera.position.z = 5;
    
    // Animation loop
    let frameId: number;
    let counter = 0;
    
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      counter += 0.02;
      
      // Smooth character movement
      const targetY = isHovered ? Math.sin(counter * 2) * 0.15 : Math.sin(counter) * 0.1;
      const targetX = isHovered ? Math.cos(counter * 2) * 0.05 : 0;
      const targetZ = isHovered ? Math.sin(counter * 2) * 0.05 : 0;
      
      // Smooth position updates
      character.position.y += (targetY - character.position.y) * 0.1;
      character.position.x += (targetX - character.position.x) * 0.1;
      character.position.z += (targetZ - character.position.z) * 0.1;
      
      // Smooth rotation
      if (autoRotate) {
        const targetRotation = currentRotation + 0.01;
        character.rotation.y += (targetRotation - character.rotation.y) * 0.1;
      }
      
      // Add extra animation when hovered
      if (isHovered) {
        character.rotation.y += 0.02;
      }
      
      // Add bounce effect when animating
      if (isAnimating) {
        const bounceScale = 1 + Math.sin(counter * 4) * 0.1;
        character.scale.set(bounceScale, bounceScale, bounceScale);
      } else {
        character.scale.set(scale, scale, scale);
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Clean up on unmount
    return () => {
      cancelAnimationFrame(frameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of resources
      scene.remove(character);
      renderer.dispose();
    };
  }, [isDark, mood, type, size, autoRotate, isHovered, isAnimating, currentRotation, scale]);
  
  // Handle click interaction
  const handleClick = () => {
    setIsAnimating(true);
    setScale(1.1);
    setTimeout(() => {
      setIsAnimating(false);
      setScale(1);
    }, 1000);
  };
  
  // Handle hover interaction
  const handleMouseEnter = () => {
    setIsHovered(true);
    setScale(1.05);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setScale(1);
  };
  
  // Create voxel character based on type
  const createVoxelCharacter = (type: string, mood: string, isDark: boolean) => {
    const group = new THREE.Group();
    
    // Get colors from character settings in portfolioData
    const characterColors = characterSettings.characterColors[type as keyof typeof characterSettings.characterColors];
    
    // Color palette
    const mainColor = isDark ? 0xffffff : 0x333333;
    const accentColor = new THREE.Color(characterColors.primary).getHex();
    const secondaryColor = new THREE.Color(characterColors.secondary).getHex();
    const tertiaryColor = 0xff9800; // Orange
    
    // Create voxel data based on character type
    const voxelData = type === 'dog' 
      ? createDogVoxels(mood)
      : type === 'cat' 
        ? createCatVoxels(mood) 
        : createRobotVoxels(mood);
    
    // Shared function to create a voxel cube and add it to the group
    const createVoxelCube = (x: number, y: number, z: number, voxelType: number) => {
      // Skip empty voxels
      if (voxelType === 0) return;
      
      // Create voxel cube
      const geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
      
      // Choose color based on voxel value
      let color;
      switch(voxelType) {
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
        (x - voxelData.length / 2) * 0.25,
        (y - voxelData[x].length / 2) * 0.25, 
        (z - voxelData[x][y].length / 2) * 0.25
      );
      
      // Add to group
      group.add(cube);
    };
    
    // Create each voxel cube
    for (let x = 0; x < voxelData.length; x++) {
      for (let y = 0; y < voxelData[x].length; y++) {
        for (let z = 0; z < voxelData[x][y].length; z++) {
          createVoxelCube(x, y, z, voxelData[x][y][z]);
        }
      }
    }
    
    return group;
  };
  
  // Shared helper to create base character body
  const createBaseCharacterVoxels = (size = 8) => {
    return Array(size).fill(0).map(() => 
      Array(size).fill(0).map(() => Array(size).fill(0))
    );
  };
  
  // Voxel data for dog character
  const createDogVoxels = (mood: string) => {
    // 8x8x8 voxel data (0 = empty, 1 = main color, 2 = accent, 3 = secondary, 4 = tertiary)
    const voxels = createBaseCharacterVoxels();
    
    // Body
    for (let x = 2; x < 6; x++) {
      for (let y = 2; y < 4; y++) {
        for (let z = 2; z < 6; z++) {
          voxels[x][y][z] = 1;
        }
      }
    }
    
    // Head
    for (let x = 2; x < 6; x++) {
      for (let y = 4; y < 6; y++) {
        for (let z = 3; z < 7; z++) {
          voxels[x][y][z] = 1;
        }
      }
    }
    
    // Ears
    voxels[2][6][5] = voxels[5][6][5] = voxels[2][6][4] = voxels[5][6][4] = 1;
    
    // Legs
    voxels[2][1][2] = voxels[5][1][2] = voxels[2][1][5] = voxels[5][1][5] = 1;
    
    // Tail
    voxels[3][3][1] = 1;
    
    // Face details - based on mood
    // Eyes
    if (mood === 'wink') {
      voxels[3][5][6] = 3; // Left eye
      voxels[4][5][6] = 1; // Right eye closed
    } else if (mood === 'surprised') {
      voxels[3][5][6] = voxels[4][5][6] = 4; // Both eyes
    } else if (mood === 'happy') {
      voxels[3][5][6] = voxels[4][5][6] = 2; // Both eyes
    } else {
      voxels[3][5][6] = voxels[4][5][6] = 3; // Both eyes
    }
    
    // Nose
    voxels[3][4][6] = voxels[4][4][6] = 4;
    
    // Collar
    for (let x = 2; x < 6; x++) {
      voxels[x][3][6] = 2;
    }
    
    return voxels;
  };
  
  // Voxel data for cat character
  const createCatVoxels = (mood: string) => {
    const voxels = createBaseCharacterVoxels();
    
    // Body
    for (let x = 2; x < 6; x++) {
      for (let y = 2; y < 4; y++) {
        for (let z = 2; z < 6; z++) {
          voxels[x][y][z] = 1;
        }
      }
    }
    
    // Head
    for (let x = 2; x < 6; x++) {
      for (let y = 4; y < 6; y++) {
        for (let z = 3; z < 7; z++) {
          voxels[x][y][z] = 1;
        }
      }
    }
    
    // Pointed ears
    voxels[2][6][4] = voxels[5][6][4] = 1;
    
    // Legs
    voxels[2][1][2] = voxels[5][1][2] = voxels[2][1][5] = voxels[5][1][5] = 1;
    
    // Tail - more curvy
    voxels[3][3][1] = voxels[3][4][1] = 1;
    
    // Face details - based on mood
    // Eyes
    if (mood === 'wink') {
      voxels[3][5][6] = 3; // Left eye
      voxels[4][5][6] = 1; // Right eye closed
    } else if (mood === 'surprised') {
      voxels[3][5][6] = voxels[4][5][6] = 4; // Both eyes
    } else if (mood === 'happy') {
      voxels[3][5][6] = voxels[4][5][6] = 2; // Both eyes
    } else {
      voxels[3][5][6] = voxels[4][5][6] = 3; // Both eyes
    }
    
    // Nose
    voxels[3][4][6] = voxels[4][4][6] = 2;
    
    // Whiskers
    voxels[1][4][6] = voxels[6][4][6] = 3;
    
    return voxels;
  };
  
  // Voxel data for robot character
  const createRobotVoxels = (mood: string) => {
    const voxels = createBaseCharacterVoxels();
    
    // Body - more boxy
    for (let x = 2; x < 6; x++) {
      for (let y = 1; y < 4; y++) {
        for (let z = 2; z < 6; z++) {
          voxels[x][y][z] = 1;
        }
      }
    }
    
    // Head - cube
    for (let x = 2; x < 6; x++) {
      for (let y = 4; y < 7; y++) {
        for (let z = 2; z < 6; z++) {
          voxels[x][y][z] = 3;
        }
      }
    }
    
    // Antenna
    voxels[3][7][3] = voxels[4][7][4] = 2;
    
    // Arms
    for (let y = 2; y < 4; y++) {
      voxels[1][y][3] = voxels[6][y][3] = 2;
    }
    
    // Legs
    voxels[2][0][3] = voxels[5][0][3] = 2;
    
    // Face details - based on mood
    if (mood === 'wink') {
      voxels[3][5][1] = 4; // Left eye
      voxels[4][5][1] = 1; // Right eye (off)
      
      // Smile
      voxels[3][4][1] = voxels[4][4][1] = 4;
    } else if (mood === 'surprised') {
      voxels[3][5][1] = voxels[4][5][1] = 4; // Both eyes
      
      // O mouth
      voxels[3][4][1] = voxels[4][4][1] = voxels[3][3][1] = voxels[4][3][1] = 4;
    } else if (mood === 'happy') {
      voxels[3][5][1] = voxels[4][5][1] = 4; // Both eyes
      
      // Smile
      voxels[3][4][1] = voxels[4][4][1] = 4;
    } else {
      voxels[3][5][1] = voxels[4][5][1] = 4; // Both eyes
      
      // Neutral mouth
      voxels[3][3][1] = voxels[4][3][1] = 4;
    }
    
    // Control panel details on chest
    voxels[3][2][1] = 4;
    voxels[4][2][1] = 2;
    
    return voxels;
  };
  
  return (
    <Box 
      ref={mountRef}
      onClick={handleClick}
      sx={{ 
        width: size, 
        height: size,
        margin: 'auto',
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
        transform: `scale(${scale})`,
        '&:hover': {
          transform: `scale(${scale * 1.05})`,
        }
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default Pixel3DCharacter; 