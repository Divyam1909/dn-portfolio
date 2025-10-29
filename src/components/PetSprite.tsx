import React, { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface PetSpriteProps {
  type?: 'dog' | 'cat' | 'rabbit' | 'hamster' | 'fox'; 
  size?: number;
  mood?: 'happy' | 'sleepy' | 'curious' | 'playful';
  onClick?: () => void;
}

const PetSprite: React.FC<PetSpriteProps> = ({
  type = 'dog',
  size = 140,
  mood = 'happy',
  onClick
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine colors based on theme and pet type
  const mainColor = isDark ? '#ffffff' : '#333333';
  const accentColor = type === 'dog' 
    ? theme.palette.primary.main 
    : type === 'cat' 
      ? theme.palette.secondary.main 
      : type === 'rabbit' 
        ? '#9c27b0' 
        : type === 'hamster' 
          ? '#ff9800' 
          : '#ff5722'; // fox

  // Get SVG based on type and mood
  const renderSvg = () => {
    switch (type) {
      case 'cat':
        return renderCatSvg();
      case 'rabbit':
        return renderRabbitSvg();
      case 'hamster':
        return renderHamsterSvg();
      case 'fox':
        return renderFoxSvg();
      default:
        return renderDogSvg();
    }
  };

  // Simple SVG dog
  const renderDogSvg = () => (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Body */}
      <ellipse cx="50" cy="60" rx="30" ry="25" fill={mainColor} />
      
      {/* Head */}
      <circle cx="50" cy="35" r="20" fill={mainColor} />
      
      {/* Ears */}
      <ellipse cx="35" cy="20" rx="10" ry="12" fill={mainColor} />
      <ellipse cx="65" cy="20" rx="10" ry="12" fill={mainColor} />
      
      {/* Muzzle */}
      <ellipse cx="50" cy="45" rx="10" ry="8" fill={accentColor} />
      <circle cx="50" cy="48" r="5" fill="#000" />
      
      {/* Eyes - change based on mood */}
      {mood === 'happy' && (
        <>
          <circle cx="40" cy="30" r="4" fill="#fff" />
          <circle cx="60" cy="30" r="4" fill="#fff" />
          <circle cx="42" cy="30" r="2" fill="#000" />
          <circle cx="62" cy="30" r="2" fill="#000" />
        </>
      )}
      
      {mood === 'sleepy' && (
        <>
          <ellipse cx="40" cy="30" rx="5" ry="1" fill="#fff" />
          <ellipse cx="60" cy="30" rx="5" ry="1" fill="#fff" />
        </>
      )}
      
      {mood === 'curious' && (
        <>
          <circle cx="40" cy="30" r="4" fill="#fff" />
          <circle cx="60" cy="30" r="4" fill="#fff" />
          <circle cx="42" cy="28" r="2" fill="#000" />
          <circle cx="62" cy="28" r="2" fill="#000" />
        </>
      )}
      
      {mood === 'playful' && (
        <>
          <circle cx="40" cy="30" r="4" fill="#fff" />
          <circle cx="60" cy="30" r="4" fill="#fff" />
          <circle cx="42" cy="30" r="2" fill="#000" />
          <circle cx="62" cy="30" r="2" fill="#000" />
          <path d="M 40 55 Q 50 60 60 55" stroke={accentColor} strokeWidth="2" fill="none" />
        </>
      )}
      
      {/* Tail */}
      <path d="M 75 60 Q 85 40 90 60" stroke={mainColor} strokeWidth="8" fill="none" />
    </svg>
  );

  // Simple SVG cat
  const renderCatSvg = () => (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Body */}
      <ellipse cx="50" cy="60" rx="25" ry="20" fill={mainColor} />
      
      {/* Head */}
      <circle cx="50" cy="35" r="18" fill={mainColor} />
      
      {/* Ears - pointy for cat */}
      <polygon points="30,25 35,10 40,25" fill={mainColor} />
      <polygon points="70,25 65,10 60,25" fill={mainColor} />
      
      {/* Eyes - change based on mood */}
      {mood === 'happy' && (
        <>
          <circle cx="40" cy="30" r="4" fill="#fff" />
          <circle cx="60" cy="30" r="4" fill="#fff" />
          <ellipse cx="40" cy="30" rx="1" ry="3" fill="#000" />
          <ellipse cx="60" cy="30" rx="1" ry="3" fill="#000" />
        </>
      )}
      
      {mood === 'sleepy' && (
        <>
          <ellipse cx="40" cy="30" rx="5" ry="1" fill="#fff" />
          <ellipse cx="60" cy="30" rx="5" ry="1" fill="#fff" />
        </>
      )}
      
      {mood === 'curious' && (
        <>
          <circle cx="40" cy="30" r="4" fill="#fff" />
          <circle cx="60" cy="30" r="4" fill="#fff" />
          <circle cx="42" cy="28" r="2" fill="#000" />
          <circle cx="62" cy="28" r="2" fill="#000" />
        </>
      )}
      
      {mood === 'playful' && (
        <>
          <circle cx="40" cy="30" r="4" fill="#fff" />
          <circle cx="60" cy="30" r="4" fill="#fff" />
          <circle cx="40" cy="30" r="2" fill="#000" />
          <circle cx="60" cy="30" r="2" fill="#000" />
          <path d="M 45 38 Q 50 40 55 38" stroke="#000" strokeWidth="1" fill="none" />
        </>
      )}
      
      {/* Nose */}
      <polygon points="50,40 48,36 52,36" fill={accentColor} />
      
      {/* Whiskers */}
      <line x1="25" y1="40" x2="40" y2="38" stroke="#fff" strokeWidth="1" />
      <line x1="25" y1="42" x2="40" y2="40" stroke="#fff" strokeWidth="1" />
      <line x1="60" y1="38" x2="75" y2="40" stroke="#fff" strokeWidth="1" />
      <line x1="60" y1="40" x2="75" y2="42" stroke="#fff" strokeWidth="1" />
      
      {/* Tail */}
      <path d="M 70 55 Q 80 40 90 50" stroke={mainColor} strokeWidth="6" fill="none" />
    </svg>
  );

  // Simple SVG rabbit
  const renderRabbitSvg = () => (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Body */}
      <ellipse cx="50" cy="65" rx="20" ry="15" fill={mainColor} />
      
      {/* Head */}
      <circle cx="50" cy="40" r="15" fill={mainColor} />
      
      {/* Ears - long for rabbit */}
      <ellipse cx="40" cy="15" rx="5" ry="15" fill={mainColor} />
      <ellipse cx="60" cy="15" rx="5" ry="15" fill={mainColor} />
      <ellipse cx="40" cy="15" rx="3" ry="10" fill={accentColor} />
      <ellipse cx="60" cy="15" rx="3" ry="10" fill={accentColor} />
      
      {/* Eyes */}
      {mood === 'happy' && (
        <>
          <circle cx="43" cy="35" r="3" fill="#fff" />
          <circle cx="57" cy="35" r="3" fill="#fff" />
          <circle cx="43" cy="35" r="1.5" fill="#000" />
          <circle cx="57" cy="35" r="1.5" fill="#000" />
        </>
      )}
      
      {mood === 'sleepy' && (
        <>
          <ellipse cx="43" cy="35" rx="4" ry="1" fill="#fff" />
          <ellipse cx="57" cy="35" rx="4" ry="1" fill="#fff" />
        </>
      )}
      
      {mood === 'curious' && (
        <>
          <circle cx="43" cy="35" r="3" fill="#fff" />
          <circle cx="57" cy="35" r="3" fill="#fff" />
          <circle cx="44" cy="34" r="1.5" fill="#000" />
          <circle cx="58" cy="34" r="1.5" fill="#000" />
        </>
      )}
      
      {mood === 'playful' && (
        <>
          <circle cx="43" cy="35" r="3" fill="#fff" />
          <circle cx="57" cy="35" r="3" fill="#fff" />
          <circle cx="43" cy="35" r="1.5" fill="#000" />
          <circle cx="57" cy="35" r="1.5" fill="#000" />
          <path d="M 45 45 Q 50 48 55 45" stroke="#000" strokeWidth="1" fill="none" />
        </>
      )}
      
      {/* Nose */}
      <ellipse cx="50" cy="42" rx="3" ry="2" fill={accentColor} />
      
      {/* Feet */}
      <ellipse cx="40" cy="80" rx="5" ry="3" fill={mainColor} />
      <ellipse cx="60" cy="80" rx="5" ry="3" fill={mainColor} />
    </svg>
  );

  // Simple SVG hamster
  const renderHamsterSvg = () => (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Body - rounder for hamster */}
      <ellipse cx="50" cy="55" rx="25" ry="20" fill={mainColor} />
      
      {/* Head - larger cheeks */}
      <circle cx="50" cy="35" r="15" fill={mainColor} />
      <circle cx="35" cy="40" r="8" fill={accentColor} /> {/* Left cheek */}
      <circle cx="65" cy="40" r="8" fill={accentColor} /> {/* Right cheek */}
      
      {/* Ears - small and round */}
      <circle cx="40" cy="22" r="5" fill={mainColor} />
      <circle cx="60" cy="22" r="5" fill={mainColor} />
      
      {/* Eyes */}
      {mood === 'happy' && (
        <>
          <circle cx="43" cy="30" r="3" fill="#fff" />
          <circle cx="57" cy="30" r="3" fill="#fff" />
          <circle cx="43" cy="30" r="1.5" fill="#000" />
          <circle cx="57" cy="30" r="1.5" fill="#000" />
        </>
      )}
      
      {mood === 'sleepy' && (
        <>
          <ellipse cx="43" cy="30" rx="4" ry="1" fill="#fff" />
          <ellipse cx="57" cy="30" rx="4" ry="1" fill="#fff" />
        </>
      )}
      
      {mood === 'curious' && (
        <>
          <circle cx="43" cy="30" r="3" fill="#fff" />
          <circle cx="57" cy="30" r="3" fill="#fff" />
          <circle cx="44" cy="29" r="1.5" fill="#000" />
          <circle cx="58" cy="29" r="1.5" fill="#000" />
        </>
      )}
      
      {mood === 'playful' && (
        <>
          <circle cx="43" cy="30" r="3" fill="#fff" />
          <circle cx="57" cy="30" r="3" fill="#fff" />
          <circle cx="43" cy="30" r="1.5" fill="#000" />
          <circle cx="57" cy="30" r="1.5" fill="#000" />
          <path d="M 45 38 Q 50 40 55 38" stroke="#000" strokeWidth="1" fill="none" />
        </>
      )}
      
      {/* Nose */}
      <ellipse cx="50" cy="35" rx="2" ry="1.5" fill="#000" />
      
      {/* Feet */}
      <ellipse cx="40" cy="75" rx="5" ry="3" fill={mainColor} />
      <ellipse cx="60" cy="75" rx="5" ry="3" fill={mainColor} />
    </svg>
  );

  // Simple SVG fox
  const renderFoxSvg = () => (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {/* Body */}
      <ellipse cx="50" cy="60" rx="25" ry="20" fill={mainColor} />
      
      {/* Head */}
      <circle cx="50" cy="35" r="18" fill={mainColor} />
      
      {/* Ears - pointed fox ears */}
      <polygon points="32,25 30,8 42,20" fill={mainColor} />
      <polygon points="68,25 70,8 58,20" fill={mainColor} />
      <polygon points="32,25 30,12 38,20" fill={accentColor} />
      <polygon points="68,25 70,12 62,20" fill={accentColor} />
      
      {/* Snout - pointed for fox */}
      <polygon points="40,45 50,50 60,45 50,40" fill={accentColor} />
      <ellipse cx="50" cy="48" rx="2" ry="1" fill="#000" />
      
      {/* Eyes */}
      {mood === 'happy' && (
        <>
          <circle cx="40" cy="30" r="4" fill="#fff" />
          <circle cx="60" cy="30" r="4" fill="#fff" />
          <circle cx="40" cy="30" r="2" fill="#000" />
          <circle cx="60" cy="30" r="2" fill="#000" />
        </>
      )}
      
      {mood === 'sleepy' && (
        <>
          <ellipse cx="40" cy="30" rx="5" ry="1" fill="#fff" />
          <ellipse cx="60" cy="30" rx="5" ry="1" fill="#fff" />
        </>
      )}
      
      {mood === 'curious' && (
        <>
          <circle cx="40" cy="30" r="4" fill="#fff" />
          <circle cx="60" cy="30" r="4" fill="#fff" />
          <circle cx="42" cy="28" r="2" fill="#000" />
          <circle cx="62" cy="28" r="2" fill="#000" />
        </>
      )}
      
      {mood === 'playful' && (
        <>
          <circle cx="40" cy="30" r="4" fill="#fff" />
          <circle cx="60" cy="30" r="4" fill="#fff" />
          <circle cx="40" cy="30" r="2" fill="#000" />
          <circle cx="60" cy="30" r="2" fill="#000" />
          <path d="M 45 42 Q 50 44 55 42" stroke="#000" strokeWidth="1" fill="none" />
        </>
      )}
      
      {/* Fluffy tail */}
      <path d="M 70 55 Q 85 45 90 60" stroke={mainColor} strokeWidth="8" fill="none" />
      <path d="M 70 55 Q 85 45 90 60" stroke={accentColor} strokeWidth="4" fill="none" />
    </svg>
  );

  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        y: -5 
      }}
      whileTap={{ scale: 0.95 }}
      animate={{
        y: [0, -10, 0],
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
        {renderSvg()}
      </Box>
    </motion.div>
  );
};

export default PetSprite; 