import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
  Button,
} from '@mui/material';
import {
  Home as HomeIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NASASolarSystem from '../components/SolarSystem/NASASolarSystem';
import UniverseQuote from '../components/UniverseQuote';
import CometCursor from '../components/CometCursor';

interface UniverseViewProps {
  toggleView: () => void;
}

const UniverseView: React.FC<UniverseViewProps> = ({ toggleView }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showInfo, setShowInfo] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [legendCollapsed, setLegendCollapsed] = useState(true);
  const [creditsExpanded, setCreditsExpanded] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [cameraDistance, setCameraDistance] = useState(45);

  const handlePlanetClick = (route: string) => {
    // Set hash to simplified before navigating to ensure proper state on refresh
    window.location.hash = 'simplified';
    toggleView(); // Switch to simplified view
    navigate(route); // Navigate to the clicked planet's route
  };

  // Hide hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleResetView = () => {
    setResetTrigger(prev => prev + 1);
  };

  const handleCameraDistanceChange = (distance: number) => {
    setCameraDistance(distance);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#000' }}>
      {/* Comet Cursor Effect */}
      <CometCursor enabled={true} />
      
      {/* NASA Solar System Scene */}
      <NASASolarSystem
        resetTrigger={resetTrigger}
        onCameraDistanceChange={handleCameraDistanceChange}
        onPlanetClick={handlePlanetClick}
        onSunClick={() => {
          toggleView();
          navigate('/');
        }} // Add onSunClick handler
      />

      {/* Top Bar with glass morphism */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'linear-gradient(180deg, rgba(10, 10, 30, 0.8) 0%, transparent 100%)',
          backdropFilter: 'blur(10px)',
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
            {/* Controls */}
            <Box sx={{ display: 'flex', gap: 1, position: 'relative' }}>
              <Box sx={{ position: 'relative' }}>
                <Tooltip title="Information" arrow>
                  <IconButton
                    data-comet-clickable="info-button"
                    onClick={() => setShowInfo(!showInfo)}
                    sx={{
                      color: '#93C5FD',
                      bgcolor: 'rgba(147, 197, 253, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(147, 197, 253, 0.2)',
                      '&:hover': {
                        bgcolor: 'rgba(147, 197, 253, 0.2)',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </Tooltip>

                {/* Small Info Dropdown */}
                <AnimatePresence>
                  {showInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Paper
                        elevation={24}
                        sx={{
                          position: 'absolute',
                          top: 50,
                          right: 0,
                          width: '320px',
                          maxHeight: '80vh',
                          overflowY: 'auto',
                          p: 2.5,
                          background: 'linear-gradient(135deg, rgba(18, 18, 62, 0.98) 0%, rgba(30, 30, 90, 0.95) 100%)',
                          backdropFilter: 'blur(20px)',
                          border: '2px solid rgba(147, 197, 253, 0.3)',
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#FFD60A',
                            fontWeight: 700,
                            mb: 1.5,
                            fontFamily: '"Orbitron", monospace',
                            fontSize: '1rem',
                          }}
                        >
                          🌌 Welcome
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: '#E0E7FF',
                            mb: 2,
                            lineHeight: 1.6,
                            fontSize: '0.85rem',
                          }}
                        >
                          Welcome to Divyam's Portfolio Universe! Each planet represents a section of my work.
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ color: '#93C5FD', mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                            🪐 Navigation
                          </Typography>
                          {[
                            { planet: 'Mercury', section: 'About', color: '#8C7853' },
                            { planet: 'Venus', section: 'Resume', color: '#FFC649' },
                            { planet: 'Earth', section: 'Projects', color: '#4A90E2' },
                            { planet: 'Mars', section: 'Experience', color: '#E27B58' },
                            { planet: 'Jupiter', section: 'Education', color: '#C8956A' },
                            { planet: 'Saturn', section: 'Skills', color: '#FAD5A5' },
                            { planet: 'Uranus', section: 'Certifications', color: '#4FD0E7' },
                            { planet: 'Neptune', section: 'Contact', color: '#4169E1' },
                          ].map((item, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 0.8,
                                p: 0.8,
                                borderRadius: 1,
                                background: 'rgba(255, 255, 255, 0.03)',
                                '&:hover': {
                                  background: 'rgba(147, 197, 253, 0.1)',
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                  sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: item.color,
                                    boxShadow: `0 0 8px ${item.color}`,
                                  }}
                                />
                                <Typography sx={{ color: '#E0E7FF', fontSize: '0.75rem' }}>
                                  {item.planet}
                                </Typography>
                              </Box>
                              <Typography sx={{ color: '#93C5FD', fontSize: '0.7rem', fontWeight: 600 }}>
                                {item.section}
                              </Typography>
                            </Box>
                          ))}
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ color: '#93C5FD', mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
                            🎮 Controls
                          </Typography>
                          <Typography sx={{ color: '#C7D2FE', mb: 0.5, fontSize: '0.7rem' }}>
                            🖱️ Drag to rotate
                          </Typography>
                          <Typography sx={{ color: '#C7D2FE', mb: 0.5, fontSize: '0.7rem' }}>
                            🔍 Scroll to zoom
                          </Typography>
                          <Typography sx={{ color: '#C7D2FE', fontSize: '0.7rem' }}>
                            🎯 Click planet to navigate
                          </Typography>
                        </Box>

                        {/* Credits Section - Collapsible */}
                        <Box>
                          <Box
                            onClick={() => setCreditsExpanded(!creditsExpanded)}
                            sx={{
                              p: 1,
                              cursor: 'pointer',
                              background: 'rgba(147, 197, 253, 0.05)',
                              borderRadius: 1,
                              border: '1px solid rgba(147, 197, 253, 0.2)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              '&:hover': {
                                background: 'rgba(147, 197, 253, 0.1)',
                              }
                            }}
                          >
                            <Typography
                              sx={{
                                color: '#93C5FD',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              ℹ️ Credits
                            </Typography>
                            <Typography sx={{ color: '#93C5FD', fontSize: '1rem' }}>
                              {creditsExpanded ? '▲' : '▼'}
                            </Typography>
                          </Box>

                          <Box sx={{
                            maxHeight: creditsExpanded ? '200px' : '0',
                            opacity: creditsExpanded ? 1 : 0,
                            overflow: 'hidden',
                            transition: 'all 0.3s ease',
                          }}>
                            <Box sx={{ p: 1.5, pt: 1 }}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                  <Typography sx={{ color: '#FFD60A', fontSize: '0.9rem' }}>🚀</Typography>
                                  <Typography sx={{ color: '#E0E7FF', fontSize: '0.7rem' }}>
                                    <strong>NASA</strong> - Textures
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                  <Typography sx={{ color: '#FFD60A', fontSize: '0.9rem' }}>💻</Typography>
                                  <Typography sx={{ color: '#E0E7FF', fontSize: '0.7rem' }}>
                                    <strong>Cursor</strong> - AI Development
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                                  <Typography sx={{ color: '#FFD60A', fontSize: '0.9rem' }}>🌐</Typography>
                                  <Typography sx={{ color: '#E0E7FF', fontSize: '0.7rem' }}>
                                    <strong>GitHub</strong> - Resources
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                      </Paper>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>

              <Tooltip title="Home" arrow>
                <IconButton
                  data-comet-clickable="home-button"
                  onClick={() => navigate('/')}
                  sx={{
                    color: '#93C5FD',
                    bgcolor: 'rgba(147, 197, 253, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(147, 197, 253, 0.2)',
                    '&:hover': {
                      bgcolor: 'rgba(147, 197, 253, 0.2)',
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <HomeIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Quote Section - Centered */}
      <AnimatePresence>
        {!showInfo && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 500,
              pointerEvents: 'none',
            }}
          >
            <UniverseQuote category="universe" variant="universe" cameraDistance={cameraDistance} />
          </Box>
        )}
      </AnimatePresence>

      {/* Initial Hint - Bottom Right */}
      <AnimatePresence>
        {showHint && !showInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              sx={{
                position: 'absolute',
                bottom: { xs: 80, sm: 90 },
                right: { xs: 20, sm: 30 },
                color: '#FFD60A',
                fontSize: { xs: '0.85rem', sm: '1rem' },
                fontWeight: 700,
                fontFamily: '"Orbitron", monospace',
                textAlign: 'right',
                textShadow: '0 0 20px rgba(255, 214, 10, 0.8)',
                bgcolor: 'rgba(11, 61, 145, 0.85)',
                backdropFilter: 'blur(10px)',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                border: '1px solid rgba(255, 214, 10, 0.5)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              🎯 Click any planet to explore
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simplified View Button - Bottom Right */}
      <Button
        data-comet-clickable="simplified-view-button"
        variant="contained"
        onClick={toggleView}
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          bgcolor: '#FFD60A',
          color: '#1a1a2e',
          fontFamily: '"Orbitron", monospace',
          fontWeight: 700,
          fontSize: { xs: '0.75rem', sm: '0.85rem' },
          textTransform: 'uppercase',
          borderRadius: 2,
          px: 3,
          py: 1.5,
          boxShadow: '0 0 20px rgba(255, 214, 10, 0.6)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          '&:hover': {
            bgcolor: '#FFE066',
            boxShadow: '0 0 30px rgba(255, 214, 10, 0.9)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        Simplified View
      </Button>

      {/* Reset View Button - Bottom Right */}
      <Tooltip title="Reset View" arrow>
        <IconButton
          data-comet-clickable="reset-button"
          onClick={handleResetView}
          sx={{
            position: 'absolute',
            bottom: 90, // Adjusted position to be above Simplified View button
            right: 20,
            color: '#93C5FD',
            bgcolor: 'rgba(147, 197, 253, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(147, 197, 253, 0.2)',
            '&:hover': {
              bgcolor: 'rgba(147, 197, 253, 0.2)',
              transform: 'scale(1.1)',
            },
            zIndex: 1000,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 13.01 17.75 13.97 17.3 14.8L18.76 16.26C19.54 15.03 20 13.57 20 12C20 7.58 16.42 4 12 4ZM12 18C8.69 18 6 15.31 6 12C6 10.99 6.25 10.03 6.7 9.2L5.24 7.74C4.46 8.97 4 10.43 4 12C4 16.42 7.58 20 12 20V23L16 19L12 15V18Z" fill="currentColor"/>
          </svg>
        </IconButton>
      </Tooltip>

      {/* NASA-Style Legend - Bottom Left Corner - Collapsible */}
      <AnimatePresence>
        {!showInfo && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Paper
              elevation={8}
              sx={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                zIndex: 1000,
                background: 'linear-gradient(135deg, rgba(11, 61, 145, 0.85) 0%, rgba(0, 29, 61, 0.85) 100%)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255, 214, 10, 0.3)',
                borderRadius: 3,
                maxWidth: { xs: '200px', sm: '300px' },
                display: { xs: 'none', sm: 'block' },
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
            >
              <Box
                data-comet-clickable="solar-navigation-button"
                onClick={() => setLegendCollapsed(!legendCollapsed)}
                sx={{
                  p: 1.5,
                  cursor: 'pointer',
                  background: 'rgba(255, 214, 10, 0.1)',
                  borderBottom: legendCollapsed ? 'none' : '1px solid rgba(255, 214, 10, 0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  '&:hover': {
                    background: 'rgba(255, 214, 10, 0.2)',
                  }
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: '#FFD60A',
                    fontFamily: '"Orbitron", monospace',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    m: 0
                  }}
                >
                  🪐 Solar Navigation
                </Typography>
                <Typography sx={{ color: '#FFD60A', fontSize: '1.2rem', fontWeight: 700 }}>
                  {legendCollapsed ? '▼' : '▲'}
                </Typography>
              </Box>

              <Box sx={{ 
                maxHeight: legendCollapsed ? 0 : '500px',
                opacity: legendCollapsed ? 0 : 1,
                transition: 'all 0.3s ease',
                overflow: 'hidden'
              }}>
                <Box sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.7 }}>
                {[
                  { planet: 'Mercury', section: 'About', color: '#B59563' },
                  { planet: 'Venus', section: 'Resume', color: '#FFC649' },
                  { planet: 'Earth', section: 'Projects', color: '#6B9BD1' },
                  { planet: 'Mars', section: 'Experience', color: '#CD5C5C' },
                  { planet: 'Jupiter', section: 'Education', color: '#C88B5A' },
                  { planet: 'Saturn', section: 'Skills', color: '#FAD5A5' },
                  { planet: 'Uranus', section: 'Certifications', color: '#4FD0E7' },
                  { planet: 'Neptune', section: 'Contact', color: '#4169E1' },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                      p: 0.8,
                      borderRadius: 1,
                      background: 'rgba(0, 0, 0, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'rgba(255, 214, 10, 0.1)',
                        transform: 'translateX(5px)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: item.color,
                          flexShrink: 0,
                          boxShadow: `0 0 10px ${item.color}`,
                        }}
                      />
                      <Typography
                        sx={{
                          color: '#E0E7FF',
                          fontSize: '0.7rem',
                          fontWeight: 500,
                          fontFamily: '"Titillium Web", sans-serif',
                        }}
                      >
                        {item.planet}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        color: '#93C5FD',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                      }}
                    >
                      {item.section}
                    </Typography>
                  </Box>
                ))}
                  </Box>

                  <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(255, 214, 10, 0.2)' }}>
                    <Typography sx={{ color: '#C7D2FE', fontSize: '0.65rem', mb: 0.4, fontFamily: '"Titillium Web", sans-serif' }}>
                      🖱️ Drag to orbit
                    </Typography>
                    <Typography sx={{ color: '#C7D2FE', fontSize: '0.65rem', mb: 0.4, fontFamily: '"Titillium Web", sans-serif' }}>
                      🔍 Scroll to zoom
                    </Typography>
                    <Typography sx={{ color: '#C7D2FE', fontSize: '0.65rem', fontFamily: '"Titillium Web", sans-serif' }}>
                      🎯 Click planet to navigate
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default UniverseView;
