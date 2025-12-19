import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Typography, Button, Grid, useTheme, Avatar, Paper, Link, IconButton, useMediaQuery, SwipeableDrawer } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowForward as ArrowForwardIcon, Close as CloseIcon, Email as EmailIcon } from '@mui/icons-material';
import Robot3D, { Robot3DHandle } from '../components/Robot3D';
import Chatbot from '../components/Chatbot';
import { usePortfolioData } from '../contexts/DataContext';

const Home: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data } = usePortfolioData();
  const { personalInfo } = data;
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const robotRef = useRef<Robot3DHandle>(null);
  
  const [beforeCursor, setBeforeCursor] = useState('');
  const fullText = "Welcome to Divyam's Portfolio";
  
  // Memoize the robot click handler to prevent re-renders
  const handleRobotClick = useCallback(() => {
    setChatbotOpen(true);
  }, []);

  // Handle animation from chatbot
  const handleAnimation = useCallback((animationName: string) => {
    if (robotRef.current) {
      robotRef.current.playAnimation(animationName);
    }
  }, []);

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const FRAME_INTERVAL = 20;
    const REVEAL_STEPS = 4;

    let iteration = 0;
    let resolvedChars = 0;
    const interval = setInterval(() => {
      setBeforeCursor(() => {
        if (resolvedChars >= fullText.length) return fullText;
        const resolved = fullText.slice(0, resolvedChars);
        const nextRandom = fullText[resolvedChars] === ' '
          ? ' '
          : chars[Math.floor(Math.random() * chars.length)];
        return resolved + nextRandom;
      });

      iteration++;
      if (iteration % REVEAL_STEPS === 0) {
        resolvedChars++;
      }

      if (resolvedChars > fullText.length) {
        clearInterval(interval);
        setBeforeCursor(fullText);
      }
    }, FRAME_INTERVAL);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <>
      <Grid container spacing={2} sx={{ 
        minHeight: 'auto', 
        pb: 0, 
        overflow: 'visible',
        px: { xs: 3, sm: 5, md: 8 },
        py: { xs: 2, sm: 3, md: 4 }
      }}>
        {/* Left Text Content */}
        <Grid item xs={12} md={6} sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <Box sx={{ mb: 4 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  fontFamily: 'monospace',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                  background: isDark 
                    ? 'linear-gradient(90deg, #90CAF9 0%, #F48FB1 100%)'
                    : 'linear-gradient(90deg, #3F51B5 0%, #F50057 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {beforeCursor}
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    width: '4px',
                    height: '1em',
                    bgcolor: isDark ? '#90CAF9' : '#3F51B5',
                    ml: 1,
                    verticalAlign: 'middle',
                    animation: 'blink 1s step-end infinite',
                    '@keyframes blink': {
                      'from, to': { opacity: 1 },
                      '50%': { opacity: 0 },
                    },
                  }}
                />
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
                {personalInfo.title}
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
                {personalInfo.bio}
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  component={RouterLink}
                  to="/resume"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ borderRadius: 50, px: 3 }}
                >
                  Resume
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  component={RouterLink}
                  to="/projects"
                  sx={{ borderRadius: 50, px: 3 }}
                >
                  Projects
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/contact"
                  startIcon={<EmailIcon />}
                  sx={{ 
                    borderRadius: 50, 
                    px: 3,
                    background: isDark 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    '&:hover': {
                      background: isDark 
                        ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                        : 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                    }
                  }}
                >
                  Contact Me
                </Button>
              </Box>
            </motion.div>
          </Box>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Paper 
              elevation={0}
              sx={{
                p: 3, 
                maxWidth: 500,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                backgroundColor: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(8px)',
                borderRadius: 2,
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 50,
                      height: 50,
                    }}
                  >
                    👋
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Typography variant="body2" color="text.secondary">
                    Looking for a developer to build your next project? Check out my{' '}
                    <Link component={RouterLink} to="/resume?resume=skills" color="primary" underline="hover">
                      skills
                    </Link>{' '} 
                    and{' '} 
                    <Link component={RouterLink} to="/resume?resume=experience" color="primary" underline="hover">
                      experience
                    </Link>
                    !
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </Grid>
        
        {/* Right 3D Robot Section with Chat */}
        <Grid item xs={12} md={6} sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: { xs: 'center', md: 'flex-start' },
          minHeight: { xs: '400px', sm: '450px', md: '600px' },
          position: 'relative',
          overflow: 'visible',
          zIndex: 2,
          pl: 0,
          ml: { xs: 0, md: -14 }
        }}>
          <Box sx={{ 
            width: '100%', 
            height: '100%',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: { xs: 'center', md: 'flex-start' },
            gap: 1.5,
            maxWidth: '900px',
          }}>
            {/* 3D Robot - Always visible (FIRST) */}
            <Box
              sx={{
                position: 'relative',
                width: { xs: '100%', sm: '400px', md: '520px' },
                height: { xs: '350px', sm: '400px', md: '520px' },
                maxWidth: { xs: '350px', sm: '400px', md: '520px' },
                flexShrink: 0,
                // Subtle gradient background to help robot visibility
                background: isDark 
                  ? 'radial-gradient(ellipse at center, rgba(144, 202, 249, 0.05) 0%, transparent 70%)'
                  : 'radial-gradient(ellipse at center, rgba(63, 81, 181, 0.05) 0%, transparent 70%)',
                borderRadius: 3,
                transition: 'all 0.3s ease',
              }}
            >
              <Robot3D ref={robotRef} onRobotClick={handleRobotClick} isDarkMode={isDark} />
                
              
              {/* Floating hint text - above robot's head */}
              {!chatbotOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                    pointerEvents: 'none',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 1.5,
                      py: 0.8,
                      borderRadius: 50,
                      bgcolor: isDark ? 'rgba(144, 202, 249, 0.15)' : 'rgba(63, 81, 181, 0.15)',
                      color: isDark ? '#90CAF9' : '#3F51B5',
                      fontWeight: 600,
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      boxShadow: isDark
                        ? '0 4px 12px rgba(0, 0, 0, 0.5)'
                        : '0 4px 12px rgba(0, 0, 0, 0.15)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    💬 Hi! I'm Pixel. Click to chat!
                  </Typography>
                </motion.div>
              )}
            </Box>

            {/* Desktop Chatbot - appears to the RIGHT of robot (hidden on mobile) */}
            {!isMobile && (
              <AnimatePresence mode="wait">
                {chatbotOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -30, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -30, scale: 0.8 }}
                    transition={{ 
                      type: 'spring',
                      stiffness: 400,
                      damping: 25 
                    }}
                    style={{
                      position: 'relative',
                      zIndex: 1000,
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      sx={{
                        width: '300px',
                        height: '420px',
                        background: isDark 
                          ? 'rgba(20, 25, 35, 0.55)'
                          : 'rgba(255, 255, 255, 0.45)',
                        borderRadius: 4,
                        boxShadow: isDark 
                          ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(144, 202, 249, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                          : '0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px rgba(63, 81, 181, 0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
                        backdropFilter: 'blur(30px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(30px) saturate(150%)',
                        border: `1px solid ${isDark ? 'rgba(144, 202, 249, 0.15)' : 'rgba(63, 81, 181, 0.2)'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {/* Chat bubble tail pointing to robot (on the left side) */}
                      <Box
                        sx={{
                          position: 'absolute',
                          left: '-12px',
                          top: '15%',
                          width: 0,
                          height: 0,
                          borderTop: '12px solid transparent',
                          borderBottom: '12px solid transparent',
                          borderRight: isDark 
                            ? '12px solid rgba(20, 25, 35, 0.55)'
                            : '12px solid rgba(255, 255, 255, 0.45)',
                          filter: 'drop-shadow(-2px 0 6px rgba(0,0,0,0.15))',
                          backdropFilter: 'blur(30px)',
                        }}
                      />

                      {/* Compact Chat Header */}
                      <Box
                        sx={{
                          background: isDark 
                            ? 'rgba(59, 130, 246, 0.12)'
                            : 'rgba(92, 107, 192, 0.12)',
                          backdropFilter: 'blur(15px)',
                          color: isDark ? '#90CAF9' : theme.palette.primary.main,
                          px: 2,
                          py: 1.5,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderBottom: `1px solid ${isDark ? 'rgba(144, 202, 249, 0.15)' : 'rgba(63, 81, 181, 0.15)'}`,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: '#4ade80',
                              boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)',
                              animation: 'pulse 2s ease-in-out infinite',
                              '@keyframes pulse': {
                                '0%, 100%': { opacity: 1 },
                                '50%': { opacity: 0.5 },
                              },
                            }}
                          />
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                            Pixel
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={() => setChatbotOpen(false)}
                          size="small"
                          sx={{ 
                            color: isDark ? '#90CAF9' : theme.palette.primary.main,
                            p: 0.5,
                            '&:hover': { 
                              bgcolor: isDark ? 'rgba(144, 202, 249, 0.1)' : 'rgba(63, 81, 181, 0.1)',
                            } 
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Chatbot Component */}
                      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Chatbot onAnimation={handleAnimation} />
                      </Box>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Mobile Bottom Sheet Chatbot */}
      {isMobile && (
        <SwipeableDrawer
          anchor="bottom"
          open={chatbotOpen}
          onClose={() => setChatbotOpen(false)}
          onOpen={() => setChatbotOpen(true)}
          disableSwipeToOpen
          PaperProps={{
            sx: {
              height: '75vh',
              maxHeight: '600px',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              background: isDark 
                ? 'rgba(20, 25, 35, 0.98)'
                : 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(30px) saturate(150%)',
              WebkitBackdropFilter: 'blur(30px) saturate(150%)',
              overflow: 'hidden',
            }
          }}
        >
          {/* Bottom Sheet Handle */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              pt: 1.5,
              pb: 1,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 4,
                borderRadius: 2,
                bgcolor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
              }}
            />
          </Box>

          {/* Mobile Chat Header */}
          <Box
            sx={{
              background: isDark 
                ? 'rgba(59, 130, 246, 0.12)'
                : 'rgba(92, 107, 192, 0.12)',
              backdropFilter: 'blur(15px)',
              color: isDark ? '#90CAF9' : theme.palette.primary.main,
              px: 2,
              py: 1.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: `1px solid ${isDark ? 'rgba(144, 202, 249, 0.15)' : 'rgba(63, 81, 181, 0.15)'}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: '#4ade80',
                  boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Chat with Pixel 🤖
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ ml: 1, display: { xs: 'block', sm: 'none' } }}
              >
                For best experience, switch to desktop.
              </Typography>
            </Box>
            <IconButton
              onClick={() => setChatbotOpen(false)}
              sx={{ 
                color: isDark ? '#90CAF9' : theme.palette.primary.main,
                '&:hover': { 
                  bgcolor: isDark ? 'rgba(144, 202, 249, 0.1)' : 'rgba(63, 81, 181, 0.1)',
                } 
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chatbot Component */}
          <Box sx={{ flexGrow: 1, overflow: 'hidden', height: 'calc(100% - 100px)' }}>
            <Chatbot onAnimation={handleAnimation} />
          </Box>
        </SwipeableDrawer>
      )}
    </>
  );
};

export default Home;