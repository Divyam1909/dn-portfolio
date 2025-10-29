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
} from '@mui/material';
import {
  Close as CloseIcon,
  Home as HomeIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NASASolarSystem from '../components/SolarSystem/NASASolarSystem';
import UniverseQuote from '../components/UniverseQuote';

const UniverseView: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showInfo, setShowInfo] = useState(false);
  const [showHint, setShowHint] = useState(true);

  // Hide hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#000' }}>
      {/* NASA Solar System Scene */}
      <NASASolarSystem />

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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {/* Controls */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Information" arrow>
                <IconButton
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

              <Tooltip title="Home" arrow>
                <IconButton
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

      {/* Quote Section - Top Center with Flowing Text */}
      <AnimatePresence>
        {!showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{
              position: 'absolute',
              top: 100,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 500,
              width: isMobile ? '95%' : '90%',
              maxWidth: '1000px',
              textAlign: 'center',
            }}
          >
            <UniverseQuote category="universe" variant="universe" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2000,
              width: isMobile ? '90%' : '600px',
              maxWidth: '90vw',
            }}
          >
            <Paper
              elevation={24}
              sx={{
                p: 4,
                background: 'linear-gradient(135deg, rgba(18, 18, 62, 0.98) 0%, rgba(30, 30, 90, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(147, 197, 253, 0.3)',
                borderRadius: 4,
                position: 'relative',
              }}
            >
              <IconButton
                onClick={() => setShowInfo(false)}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  color: '#93C5FD',
                  '&:hover': { bgcolor: 'rgba(147, 197, 253, 0.1)' },
                }}
              >
                <CloseIcon />
              </IconButton>

              <Typography
                variant="h5"
                sx={{
                  color: '#E0E7FF',
                  fontWeight: 700,
                  mb: 3,
                  textAlign: 'center',
                }}
              >
                Navigate the Solar System
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#93C5FD', mb: 2, fontWeight: 600 }}>
                  🪐 Planets & Sections
                </Typography>
                {[
                  { planet: 'Mercury', section: 'About', color: '#8C7853', moons: 0 },
                  { planet: 'Venus', section: 'Resume', color: '#FFC649', moons: 0 },
                  { planet: 'Earth', section: 'Projects', color: '#4A90E2', moons: 1 },
                  { planet: 'Mars', section: 'Experience', color: '#E27B58', moons: 2 },
                  { planet: 'Jupiter', section: 'Education', color: '#C8956A', moons: 4 },
                  { planet: 'Saturn', section: 'Skills', color: '#FAD5A5', moons: 3 },
                  { planet: 'Uranus', section: 'Certifications', color: '#4FD0E7', moons: 2 },
                  { planet: 'Neptune', section: 'Contact', color: '#4169E1', moons: 1 },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 1.5,
                      p: 1.5,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.03)',
                      '&:hover': {
                        background: 'rgba(147, 197, 253, 0.1)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: item.color,
                        mr: 2,
                        boxShadow: `0 0 10px ${item.color}`,
                      }}
                    />
                    <Typography sx={{ color: '#E0E7FF', flex: 1 }}>
                      <strong>{item.planet}</strong>
                      {item.moons > 0 && (
                        <Typography component="span" sx={{ color: '#9CA3AF', fontSize: '0.75rem', ml: 1 }}>
                          ({item.moons} moon{item.moons > 1 ? 's' : ''})
                        </Typography>
                      )}
                    </Typography>
                    <Typography sx={{ color: '#93C5FD' }}>{item.section}</Typography>
                  </Box>
                ))}
              </Box>

              <Box>
                <Typography variant="h6" sx={{ color: '#93C5FD', mb: 2, fontWeight: 600 }}>
                  🎮 Controls
                </Typography>
                <Typography sx={{ color: '#C7D2FE', mb: 1 }}>
                  🖱️ <strong>Drag:</strong> Rotate view
                </Typography>
                <Typography sx={{ color: '#C7D2FE', mb: 1 }}>
                  🔍 <strong>Scroll:</strong> Zoom in/out
                </Typography>
                <Typography sx={{ color: '#C7D2FE', mb: 1 }}>
                  🎯 <strong>Click Planet:</strong> Navigate to section
                </Typography>
                <Typography sx={{ color: '#C7D2FE' }}>
                  🔄 <strong>Auto-rotate:</strong> Enabled by default
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initial Hint */}
      <AnimatePresence>
        {showHint && !showInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: '#93C5FD',
                fontSize: { xs: '1rem', sm: '1.2rem' },
                fontWeight: 600,
                textAlign: 'center',
                textShadow: '0 0 20px rgba(147, 197, 253, 0.8)',
                bgcolor: 'rgba(10, 10, 30, 0.6)',
                backdropFilter: 'blur(10px)',
                px: 4,
                py: 2,
                borderRadius: 2,
                display: showInfo ? 'none' : 'block',
              }}
            >
              👆 Click any planet to explore
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend - Bottom Left Corner */}
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
                background: 'linear-gradient(135deg, rgba(18, 18, 62, 0.95) 0%, rgba(30, 30, 90, 0.92) 100%)',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(147, 197, 253, 0.2)',
                borderRadius: 3,
                p: 2.5,
                maxWidth: { xs: '200px', sm: '280px' },
                display: { xs: 'none', sm: 'block' }
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#93C5FD',
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: '0.9rem',
                  letterSpacing: '0.5px'
                }}
              >
                🌍 Planet Guide
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                {[
                  { planet: 'Mercury', color: '#8C7853', section: 'About' },
                  { planet: 'Venus', color: '#FFC649', section: 'Resume' },
                  { planet: 'Earth', color: '#4A90E2', section: 'Projects' },
                  { planet: 'Mars', color: '#E27B58', section: 'Experience' },
                  { planet: 'Jupiter', color: '#C8956A', section: 'Education' },
                  { planet: 'Saturn', color: '#FAD5A5', section: 'Skills' },
                  { planet: 'Uranus', color: '#4FD0E7', section: 'Certifications' },
                  { planet: 'Neptune', color: '#4169E1', section: 'Contact' },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: item.color,
                        flexShrink: 0,
                        boxShadow: `0 0 8px ${item.color}`,
                      }}
                    />
                    <Typography
                      sx={{
                        color: '#E0E7FF',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      {item.section}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid rgba(147, 197, 253, 0.15)' }}>
                <Typography sx={{ color: '#C7D2FE', fontSize: '0.7rem', mb: 0.5 }}>
                  🖱️ Drag to rotate
                </Typography>
                <Typography sx={{ color: '#C7D2FE', fontSize: '0.7rem', mb: 0.5 }}>
                  🔍 Scroll to zoom
                </Typography>
                <Typography sx={{ color: '#C7D2FE', fontSize: '0.7rem' }}>
                  🎯 Click to navigate
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default UniverseView;
