import React, { useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface PetCharacterProps {
  type: 'dog' | 'cat' | 'rabbit' | 'hamster' | 'fox';
  size?: number;
  mood?: 'happy' | 'sleepy' | 'curious' | 'playful';
  onClick?: () => void;
}

// URLs for high-quality animal images (transparent PNGs)
const PET_IMAGES = {
  dog: {
    happy: 'https://freepngimg.com/thumb/dog/2-dog-png-image.png',
    sleepy: 'https://freepngimg.com/thumb/dog/35438-8-dog-transparent-background.png',
    curious: 'https://freepngimg.com/thumb/dog/37105-3-dog-transparent.png',
    playful: 'https://freepngimg.com/thumb/dog/10-dog-png-image-picture-download-dogs.png'
  },
  cat: {
    happy: 'https://freepngimg.com/thumb/cat/22193-3-adorable-cat.png',
    sleepy: 'https://freepngimg.com/thumb/cat/95358-animals-tabby-dog-sleep-cat-pet.png',
    curious: 'https://freepngimg.com/thumb/cat/22628-9-cat-transparent.png',
    playful: 'https://freepngimg.com/thumb/cat/73441-cat-kitten-pets-sleeping-domestic-persian.png'
  },
  rabbit: {
    happy: 'https://freepngimg.com/thumb/rabbit/5-rabbit-png-image.png',
    sleepy: 'https://freepngimg.com/thumb/rabbit/7-rabbit-png-image.png',
    curious: 'https://freepngimg.com/thumb/rabbit/6-rabbit-png-image.png',
    playful: 'https://freepngimg.com/thumb/rabbit/9-rabbit-png-image.png'
  },
  hamster: {
    happy: 'https://freepngimg.com/thumb/hamster/2-hamster-png-image.png',
    sleepy: 'https://freepngimg.com/thumb/hamster/6-hamster-png-image.png',
    curious: 'https://freepngimg.com/thumb/hamster/4-hamster-png-image.png',
    playful: 'https://freepngimg.com/thumb/hamster/3-hamster-png-image.png'
  },
  fox: {
    happy: 'https://freepngimg.com/thumb/fox/12-fox-png-image.png',
    sleepy: 'https://freepngimg.com/thumb/fox/17-fox-png-image.png',
    curious: 'https://freepngimg.com/thumb/fox/15-fox-png-image.png',
    playful: 'https://freepngimg.com/thumb/fox/3-fox-png-image.png'
  }
};

const PetCharacter: React.FC<PetCharacterProps> = ({
  type = 'dog',
  size = 140,
  mood = 'happy',
  onClick
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Choose image based on type and mood
  const imageUrl = PET_IMAGES[type][mood];
  
  // Handle image loading
  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        y: -5 
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: [0, -5, 0],
        rotate: isHovered ? [0, -2, 0, 2, 0] : 0
      }}
      transition={{ 
        y: { repeat: Infinity, duration: 3 },
        rotate: { repeat: Infinity, duration: 2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        filter: isDark ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))' : 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))'
      }}
    >
      <Box
        sx={{
          width: size,
          height: size,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible'
        }}
      >
        {/* Loading placeholder */}
        {!isLoaded && (
          <Box 
            sx={{ 
              width: size * 0.8, 
              height: size * 0.8, 
              borderRadius: '50%', 
              bgcolor: 'background.paper',
              opacity: 0.7
            }}
          />
        )}
        
        {/* Pet image */}
        <Box
          component="img"
          src={imageUrl}
          alt={`${mood} ${type}`}
          onLoad={handleImageLoad}
          sx={{
            maxWidth: '100%',
            maxHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            transform: 'scale(1.2)', // Make the image slightly larger to fill the container
            filter: `saturate(${isHovered ? 1.2 : 1})`
          }}
        />
      </Box>
    </motion.div>
  );
};

export default PetCharacter; 