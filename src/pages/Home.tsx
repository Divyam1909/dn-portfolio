import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, useTheme, Avatar, Paper, Divider, Link } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ArrowForward as ArrowForwardIcon, Explore as ExploreIcon } from '@mui/icons-material';
import PixelGuide from '../components/PixelGuide';
import { usePortfolioData } from '../contexts/DataContext';

const Home: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const navigate = useNavigate();
  const { data } = usePortfolioData();
  const { personalInfo } = data;
  
  const [beforeCursor, setBeforeCursor] = useState('');
  const fullText = "Welcome to Divyam's Portfolio";

  // Hacker-style scramble animation effect
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const FRAME_INTERVAL = 20; // ms between frames (faster)
    const REVEAL_STEPS = 4;    // reveal a letter every 4 frames (user preference)

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
      <Grid container spacing={4} sx={{ minHeight: 'calc(100vh - 200px)' }}>
        <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
                  onClick={() => navigate('/universe')}
                  startIcon={<ExploreIcon />}
                  sx={{
                    borderRadius: 50,
                    px: 3,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    boxShadow: '0 3px 15px 2px rgba(102, 126, 234, .3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #764ba2 30%, #667eea 90%)',
                      boxShadow: '0 5px 20px 2px rgba(118, 75, 162, .4)',
                    },
                  }}
                >
                  🌌 Universe View
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
                    <Link component={RouterLink} to="/resume#skills" color="primary" underline="hover">
                      skills
                    </Link>{' '} 
                    and{' '} 
                    <Link component={RouterLink} to="/resume#experience" color="primary" underline="hover">
                      experience
                    </Link>
                    !
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Paper
              elevation={4}
              sx={{
                p: 3,
                overflow: 'hidden',
                position: 'relative',
                minHeight: 400,
                width: '100%',
                borderRadius: 4,
                backgroundColor: isDark ? 'rgba(30, 30, 30, 0.9)' : 'rgba(245, 245, 245, 0.9)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PixelGuide section="intro" embedded={true} />
              
              {/* Decorative elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 40,
                  left: 40,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  boxShadow: `0 0 20px ${theme.palette.primary.main}`,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 60,
                  right: 60,
                  width: 15,
                  height: 15,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.secondary.main,
                  boxShadow: `0 0 15px ${theme.palette.secondary.main}`,
                }}
              />
            </Paper>
          </motion.div>
        </Grid>
        
        {/* Professional skills section */}
        <Grid item xs={12} sx={{ mt: 6 }}>
          <Divider sx={{ mb: 6 }} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography variant="h4" align="center" gutterBottom sx={{ 
              fontWeight: 700,
              background: isDark 
                ? 'linear-gradient(90deg, #90CAF9 0%, #F48FB1 100%)'
                : 'linear-gradient(90deg, #3F51B5 0%, #F50057 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Professional Expertise
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
              With a strong foundation in both frontend and backend technologies, I bring a comprehensive skill set to every project.
            </Typography>
          </motion.div>
          
          <Grid container spacing={4} sx={{ mt: 2, justifyContent: 'center' }}>
            {/* Add a professional skills section here with 3 cards */}
            {['Frontend Development', 'Backend Solutions', 'UI/UX Design'].map((skill, index) => (
              <Grid item xs={12} md={4} key={skill}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 2,
                    backgroundColor: isDark ? 'rgba(30, 30, 30, 0.7)' : 'rgba(245, 245, 245, 0.7)',
                    backdropFilter: 'blur(5px)',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)'
                    }
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {skill}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {index === 0 && 'Creating responsive and intuitive user interfaces with React, TypeScript, and modern CSS frameworks.'}
                    {index === 1 && 'Building robust and scalable server applications using Node.js, Express, and various database technologies.'}
                    {index === 2 && 'Designing beautiful and functional interfaces that prioritize user experience and accessibility.'}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Home; 