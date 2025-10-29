import React, { useEffect, useRef, useState } from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import {
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface AudioManagerProps {
  onSoundToggle?: (enabled: boolean) => void;
}

const AudioManager: React.FC<AudioManagerProps> = ({ onSoundToggle }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const oscillatorsRef = React.useRef<OscillatorNode[]>([]);

  useEffect(() => {
    // Initialize audio context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;

    // Create ambient sound when enabled
    if (soundEnabled) {
      // Resume context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Clear any existing oscillators
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator already stopped
        }
      });
      oscillatorsRef.current = [];

      // Create realistic space ambient sound with multiple layers
      const oscillator1 = audioContext.createOscillator();
      const oscillator2 = audioContext.createOscillator();
      const oscillator3 = audioContext.createOscillator();
      const oscillator4 = audioContext.createOscillator();
      
      const gainNode1 = audioContext.createGain();
      const gainNode2 = audioContext.createGain();
      const gainNode3 = audioContext.createGain();
      const gainNode4 = audioContext.createGain();
      const masterGain = audioContext.createGain();

      // Deep space rumble
      oscillator1.type = 'sine';
      oscillator1.frequency.setValueAtTime(40, audioContext.currentTime);
      gainNode1.gain.setValueAtTime(0.015, audioContext.currentTime);
      
      // Harmonic layer
      oscillator2.type = 'sine';
      oscillator2.frequency.setValueAtTime(80, audioContext.currentTime);
      gainNode2.gain.setValueAtTime(0.012, audioContext.currentTime);
      
      // Mid-range atmosphere
      oscillator3.type = 'triangle';
      oscillator3.frequency.setValueAtTime(120, audioContext.currentTime);
      gainNode3.gain.setValueAtTime(0.008, audioContext.currentTime);
      
      // High ethereal layer
      oscillator4.type = 'sine';
      oscillator4.frequency.setValueAtTime(200, audioContext.currentTime);
      gainNode4.gain.setValueAtTime(0.005, audioContext.currentTime);

      // Master volume
      masterGain.gain.setValueAtTime(0.4, audioContext.currentTime);

      // Connect all layers
      oscillator1.connect(gainNode1);
      oscillator2.connect(gainNode2);
      oscillator3.connect(gainNode3);
      oscillator4.connect(gainNode4);
      
      gainNode1.connect(masterGain);
      gainNode2.connect(masterGain);
      gainNode3.connect(masterGain);
      gainNode4.connect(masterGain);
      
      masterGain.connect(audioContext.destination);

      // Start all oscillators
      oscillator1.start();
      oscillator2.start();
      oscillator3.start();
      oscillator4.start();

      oscillatorsRef.current = [oscillator1, oscillator2, oscillator3, oscillator4];
    } else {
      // Stop oscillators when disabled
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator already stopped
        }
      });
      oscillatorsRef.current = [];
    }

    return () => {
      // Cleanup on unmount
      oscillatorsRef.current.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Oscillator already stopped
        }
      });
    };
  }, [soundEnabled]);

  const handleToggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    if (onSoundToggle) {
      onSoundToggle(newState);
    }
  };

  // Function to play enhanced click sound
  const playClickSound = React.useCallback(() => {
    if (!soundEnabled || !audioContextRef.current) return;
    
    const audioContext = audioContextRef.current;
    
    // Resume context if suspended
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    // Create a pleasant "whoosh" click sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Main tone
    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.2);

    // Harmonic
    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(1200, audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2);

    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.2);
    oscillator2.stop(audioContext.currentTime + 0.2);
  }, [soundEnabled]);

  // Expose click sound function globally
  useEffect(() => {
    (window as any).playSpaceClick = playClickSound;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundEnabled]);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Tooltip title={soundEnabled ? 'Mute sounds' : 'Enable sounds'} placement="left">
          <IconButton
            onClick={handleToggleSound}
            sx={{
              bgcolor: 'rgba(147, 197, 253, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(147, 197, 253, 0.3)',
              color: soundEnabled ? '#93C5FD' : '#6B7280',
              '&:hover': {
                bgcolor: 'rgba(147, 197, 253, 0.25)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            {soundEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
          </IconButton>
        </Tooltip>
      </motion.div>
    </Box>
  );
};

export default AudioManager;

