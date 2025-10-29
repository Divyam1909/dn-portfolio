import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, useTheme, Tooltip, Tabs, Tab, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PetsIcon from '@mui/icons-material/Pets';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import PetCharacterDisplay from './PetCharacterDisplay';
import { usePortfolioData } from '../contexts/DataContext';

// Animation configurations
const FADE_ANIMATION = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

const MESSAGE_ANIMATION = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
};

// Portfolio guide messages imported from DataContext
interface PixelGuideProps {
  section?: 'intro' | 'about' | 'resume' | 'projects' | 'contact';
  embedded?: boolean; // Add this prop to determine if the component is embedded in a card
}

const PixelGuide: React.FC<PixelGuideProps> = ({ 
  section = 'intro',
  embedded = false // Default to not embedded
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { data, guideSettings, updateGuideSettings } = usePortfolioData();
  const GUIDE_MESSAGES = data.guideMessages;

  const [mood, setMood] = useState<'happy' | 'sleepy' | 'curious' | 'playful'>('happy');
  const [currentMessage, setCurrentMessage] = useState<string>(GUIDE_MESSAGES[section][0]);
  const [messageIndex, setMessageIndex] = useState(0);
  const [animateMessage, setAnimateMessage] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with guide always visible and default to tab 0
  const { selectedTab, selectedCharacter } = guideSettings;
  const [showGuide, setShowGuide] = useState(true);
  const dragControls = useDragControls();

  // Update guideSettings in context when section changes
  useEffect(() => {
    // Only update if section has changed from last stored section
    if (guideSettings.lastSection !== section) {
      updateGuideSettings({ lastSection: section, showGuide: true });
    }
  }, [section, guideSettings.lastSection, updateGuideSettings]);

  // Helper to clear timeout
  const clearReactionTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  // Handle emoji reactions
  const handleReaction = (reaction: 'wave' | 'pet') => {
    if (reaction === 'wave') {
      setMood('playful');
      setCurrentMessage("Hello there! Thanks for waving! 👋");
    } else if (reaction === 'pet') {
      setMood('sleepy');
      setCurrentMessage("Aww, I love pets! Thanks for being friendly! 🐾");
    }

    // Reset mood after delay
    clearReactionTimeout();
    timeoutRef.current = setTimeout(() => {
      setMood('happy');
      setCurrentMessage(GUIDE_MESSAGES[section][messageIndex]);
    }, 2000);
  };

  // Handle next message
  const handleNextMessage = () => {
    setAnimateMessage(false);
    setTimeout(() => {
      const nextIndex = (messageIndex + 1) % GUIDE_MESSAGES[section].length;
      setMessageIndex(nextIndex);
      setCurrentMessage(GUIDE_MESSAGES[section][nextIndex]);
      setAnimateMessage(true);
    }, 300);
  };

  // Reset message when section changes
  useEffect(() => {
    setMessageIndex(0);
    setCurrentMessage(GUIDE_MESSAGES[section][0]);
    setAnimateMessage(true);
  }, [section, GUIDE_MESSAGES]);

  // Clean up on unmount
  useEffect(() => {
    return clearReactionTimeout;
  }, []);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    updateGuideSettings({ selectedTab: newValue });
  };

  // Handle character change with dropdown
  const handleCharacterChange = (event: SelectChangeEvent<string>) => {
    const type = event.target.value as 'dog' | 'cat' | 'rabbit' | 'hamster' | 'fox';
    
    // First update guideSettings
    updateGuideSettings({ selectedCharacter: type });
    
    // Also store in localStorage so PetCharacterDisplay will pick it up
    localStorage.setItem('selectedPet', type);
    
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('petSelected'));
  };

  // Handle mood change with dropdown
  const handleMoodChange = (event: SelectChangeEvent<string>) => {
    const newMood = event.target.value as 'happy' | 'sleepy' | 'curious' | 'playful';
    setMood(newMood);
    // Store the mood in localStorage for sync across components
    localStorage.setItem('petMood', newMood);
    // Dispatch an event for components listening for mood changes
    window.dispatchEvent(new Event('moodChanged'));
  };

  // Toggle guide visibility
  const toggleGuideVisibility = () => {
    setShowGuide(!showGuide);
    updateGuideSettings({ showGuide: !showGuide });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Main guide container */}
      <motion.div
        drag={!embedded} // Only enable drag if not embedded
        dragControls={dragControls}
        dragMomentum={false}
        dragElastic={0}
        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
        whileDrag={{ scale: 1.02 }}
        style={{ 
          position: embedded ? 'static' : 'fixed',
          bottom: embedded ? 'auto' : 30,
          right: embedded ? 'auto' : 30,
          zIndex: embedded ? 'auto' : 1000,
          width: embedded ? '100%' : 'auto'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: embedded ? 2 : 3,
            borderRadius: embedded ? 0 : 3,
            bgcolor: isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            boxShadow: embedded ? 'none' : '0 6px 20px rgba(0,0,0,0.15)',
            border: embedded ? 'none' : '1px solid',
            borderColor: theme.palette.primary.main,
            overflow: 'hidden',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease',
            width: embedded ? '100%' : 320,
            maxHeight: embedded ? 'none' : '80vh',
            overflowY: 'auto',
            height: embedded ? 400 : 'auto' // Fixed height for embedded version
          }}
        >
          {/* Drag handle - only show if not embedded */}
          {!embedded && (
            <Box 
              sx={{ 
                position: 'absolute', 
                top: 10, 
                left: 10, 
                zIndex: 5,
                cursor: 'grab',
                '&:active': { cursor: 'grabbing' }
              }}
              onPointerDown={(e) => dragControls.start(e)}
            >
              <DragIndicatorIcon fontSize="small" />
            </Box>
          )}

          {/* Toggle button */}
          <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 5 }}>
            <Button 
              size="small" 
              variant="text" 
              color="inherit"
              onClick={toggleGuideVisibility}
              sx={{ minWidth: 0, p: 0.5 }}
            >
              {showGuide ? "×" : "?"}
            </Button>
          </Box>

          {/* Always show the pet character */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            my: 2,
            position: 'relative',
            zIndex: 1,
            width: '100%'
          }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%'
            }}>
              <PetCharacterDisplay
                trackInteraction={() => handleReaction('pet')}
                forcedMood={mood}
                size={embedded ? 120 : 140}
              />
            </Box>
            
            {/* Speech bubble - moved closer to the pet character */}
            <Box
              sx={{ 
                mt: 1,
                p: 2, 
                width: '100%',
                maxWidth: 220,
                mx: 'auto',
                bgcolor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(240, 240, 240, 0.7)', 
                borderRadius: 2,
                position: 'relative',
                minHeight: 60, // Add fixed minimum height to prevent size changes
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: '50%',
                  top: -10,
                  transform: 'translateX(-50%)',
                  borderWidth: '0 10px 10px 10px',
                  borderStyle: 'solid',
                  borderColor: `transparent transparent ${isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(240, 240, 240, 0.7)'} transparent`
                }
              }}
            >
              <AnimatePresence mode="wait">
                {animateMessage && (
                  <motion.div
                    key={currentMessage}
                    {...MESSAGE_ANIMATION}
                    style={{ width: '100%' }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {currentMessage}
                    </Typography>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
            
            {/* Move interaction buttons here - directly below speech bubble */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              mt: 1,
              mb: 0.5
            }}>
              <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                maxWidth: 230,
              }}>
                {/* Interaction buttons */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Tooltip title="Wave hello" arrow>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ 
                        borderRadius: 4,
                        minWidth: 32,
                        height: 28,
                        p: '3px 6px'
                      }}
                      onClick={() => handleReaction('wave')}
                    >
                      <WavingHandIcon sx={{ fontSize: '0.95rem' }} />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Pet" arrow>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      sx={{ 
                        borderRadius: 4,
                        minWidth: 32,
                        height: 28,
                        p: '3px 6px'
                      }}
                      onClick={() => handleReaction('pet')}
                    >
                      <PetsIcon sx={{ fontSize: '0.95rem' }} />
                    </Button>
                  </Tooltip>
                </Box>
                
                {/* Navigation button */}
                <Tooltip title="See next tip" arrow>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small" 
                    onClick={handleNextMessage}
                    sx={{ 
                      borderRadius: 4,
                      height: 28,
                      p: '3px 10px',
                      fontSize: '0.75rem',
                      boxShadow: 'none'
                    }}
                  >
                    Next <ArrowForwardIcon sx={{ fontSize: '0.85rem', ml: 0.3 }} />
                  </Button>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          {/* Collapsible content */}
          <AnimatePresence>
            {showGuide && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%' }}
              >
                {/* Title bar */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center', 
                  mb: 1, 
                  mt: 1,
                  width: '100%',
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  pt: 1
                }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', fontSize: embedded ? '1.1rem' : '1.25rem', textAlign: 'center' }}>
                    Portfolio Guide
                  </Typography>
                </Box>

                {/* Tabs for different views */}
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  sx={{ 
                    mb: 2, 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    width: '100%',
                    '& .MuiTabs-flexContainer': {
                      justifyContent: 'center'
                    }
                  }}
                  variant="fullWidth"
                  centered
                >
                  <Tab label="Guide" />
                  <Tab label="Character" />
                </Tabs>
                
                {/* Fixed height container for tab content - consistent size across tabs */}
                <Box sx={{ 
                  height: embedded ? 100 : 120, 
                  overflow: 'auto', 
                  width: '100%',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AnimatePresence mode="wait">
                    {selectedTab === 0 && (
                      <motion.div
                        key="guide"
                        {...FADE_ANIMATION}
                        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {/* Add content information - removed buttons */}
                        <Box sx={{ 
                          p: 1, 
                          width: '100%',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%'
                        }}>
                          <Typography variant="body2" color="text.secondary">
                            Click "Next Tip" to learn about different portfolio sections, or interact with the guide using the buttons above.
                          </Typography>
                        </Box>
                      </motion.div>
                    )}

                    {selectedTab === 1 && (
                      <motion.div
                        key="character"
                        {...FADE_ANIMATION}
                        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: 2,
                          width: '100%',
                          px: 2,
                          maxWidth: '90%'
                        }}>
                          {/* Use dropdowns instead of button groups */}
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            gap: 2,
                            width: '100%'
                          }}>
                            {/* Character dropdown */}
                            <FormControl fullWidth size="small">
                              <InputLabel id="pet-select-label">Character Type</InputLabel>
                              <Select
                                labelId="pet-select-label"
                                id="pet-select"
                                value={selectedCharacter}
                                onChange={handleCharacterChange}
                                label="Character Type"
                                sx={{ borderRadius: 2 }}
                              >
                                {['dog', 'cat', 'rabbit', 'hamster', 'fox'].map((type) => (
                                  <MenuItem key={type} value={type} sx={{ textTransform: 'capitalize' }}>
                                    {type}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            
                            {/* Mood dropdown */}
                            <FormControl fullWidth size="small">
                              <InputLabel id="mood-select-label">Expression</InputLabel>
                              <Select
                                labelId="mood-select-label"
                                id="mood-select"
                                value={mood}
                                onChange={handleMoodChange}
                                label="Expression"
                                sx={{ borderRadius: 2 }}
                              >
                                {['happy', 'sleepy', 'curious', 'playful'].map((characterMood) => (
                                  <MenuItem key={characterMood} value={characterMood} sx={{ textTransform: 'capitalize' }}>
                                    {characterMood}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Minimized state message */}
          {!showGuide && (
            <Typography variant="caption" color="text.secondary">
              Click to show guide
            </Typography>
          )}
        </Box>
      </motion.div>
    </Box>
  );
};

export default PixelGuide; 