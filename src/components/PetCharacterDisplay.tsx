import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import PetSprite from './PetSprite';

interface PetCharacterDisplayProps {
  trackInteraction?: () => void;
  forcedMood?: 'happy' | 'sleepy' | 'curious' | 'playful';
  size?: number;
}

const PetCharacterDisplay: React.FC<PetCharacterDisplayProps> = ({ 
  trackInteraction,
  forcedMood,
  size = 180
}) => {
  // Get selected pet from localStorage or default to 'dog'
  const [selectedPet, setSelectedPet] = useState<'dog' | 'cat' | 'rabbit' | 'hamster' | 'fox'>('dog');
  const [mood, setMood] = useState<'happy' | 'sleepy' | 'curious' | 'playful'>('happy');
  
  // Listen for changes to localStorage
  useEffect(() => {
    const loadSelectedPet = () => {
      const storedPet = localStorage.getItem('selectedPet');
      if (storedPet && ['dog', 'cat', 'rabbit', 'hamster', 'fox'].includes(storedPet)) {
        setSelectedPet(storedPet as 'dog' | 'cat' | 'rabbit' | 'hamster' | 'fox');
      }
    };
    
    // Load initial selection
    loadSelectedPet();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', loadSelectedPet);
    
    // Custom event for same-tab updates
    window.addEventListener('petSelected', loadSelectedPet);
    
    return () => {
      window.removeEventListener('storage', loadSelectedPet);
      window.removeEventListener('petSelected', loadSelectedPet);
    };
  }, []);

  // Listen for mood changes from external source (if forcedMood is provided)
  useEffect(() => {
    if (forcedMood) {
      setMood(forcedMood);
    }
  }, [forcedMood]);
  
  // Also listen to mood changes from localStorage for sync across components
  useEffect(() => {
    const loadMood = () => {
      const storedMood = localStorage.getItem('petMood');
      if (storedMood && ['happy', 'sleepy', 'curious', 'playful'].includes(storedMood)) {
        setMood(storedMood as 'happy' | 'sleepy' | 'curious' | 'playful');
      }
    };
    
    // Set up event listener for mood changes
    window.addEventListener('moodChanged', loadMood);
    
    // Load initial mood
    loadMood();
    
    return () => {
      window.removeEventListener('moodChanged', loadMood);
    };
  }, []);
  
  // Handle character interaction
  const handleCharacterClick = () => {
    // Cycle through moods on click
    const moods: Array<'happy' | 'sleepy' | 'curious' | 'playful'> = ['happy', 'sleepy', 'curious', 'playful'];
    const currentIndex = moods.indexOf(mood);
    const nextMood = moods[(currentIndex + 1) % moods.length];
    setMood(nextMood);
    
    // Store mood in localStorage and dispatch event
    localStorage.setItem('petMood', nextMood);
    window.dispatchEvent(new Event('moodChanged'));
    
    // Track interaction if provided
    if (trackInteraction) {
      trackInteraction();
    }
  };
  
  return (
    <Box 
      sx={{ 
        cursor: 'pointer',
        transition: 'transform 0.3s, filter 0.3s',
        '&:hover': {
          transform: 'scale(1.05)',
          filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))'
        },
        position: 'relative'
      }}
    >
      <PetSprite 
        type={selectedPet} 
        size={size} 
        mood={mood}
        onClick={handleCharacterClick}
      />
    </Box>
  );
};

export default PetCharacterDisplay; 