import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Avatar, 
  Divider, 
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Code as CodeIcon,
  School as SchoolIcon,
  SportsEsports as HobbyIcon,
  Instagram as InstagramIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon
} from '@mui/icons-material';
import { usePortfolioData } from '../contexts/DataContext';

const About: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { data } = usePortfolioData();
  const { personalInfo, skills, education } = data;
  
  // Social links from data
  const socialLinks = personalInfo.socialLinks || {};
  
  // Interests/Hobbies - can be extended in database
  const interests = [
    'Web Development',
    'Open Source',
    'UI/UX Design',
    'Learning New Technologies',
    'Problem Solving'
  ];
  
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                background: isDark 
                  ? 'linear-gradient(90deg, #90CAF9 0%, #F48FB1 100%)'
                  : 'linear-gradient(90deg, #3F51B5 0%, #F50057 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              About Me
            </Typography>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper 
              elevation={2} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                boxSizing: 'border-box',
                backgroundImage: isDark 
                  ? 'linear-gradient(45deg, rgba(30, 30, 30, 0.8), rgba(30, 30, 30, 0.9))'
                  : 'linear-gradient(45deg, rgba(255, 255, 255, 0.8), rgba(245, 245, 245, 0.9))',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: { xs: 120, sm: 150 },
                    height: { xs: 120, sm: 150 },
                    border: `4px solid ${theme.palette.primary.main}`,
                    mb: 2,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                  }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 'bold' }}>DN</Typography>
                </Avatar>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                  {personalInfo.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" align="center" gutterBottom>
                  {personalInfo.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                  {socialLinks.github && (
                    <Tooltip title="GitHub" arrow>
                      <IconButton
                        component="a"
                        href={socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          color: isDark ? '#fff' : '#333',
                          '&:hover': { transform: 'translateY(-3px)', color: isDark ? '#90CAF9' : '#000' }
                        }}
                      >
                        <GitHubIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {socialLinks.linkedin && (
                    <Tooltip title="LinkedIn" arrow>
                      <IconButton
                        component="a"
                        href={socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          color: '#0077B5',
                          '&:hover': { transform: 'translateY(-3px)' }
                        }}
                      >
                        <LinkedInIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {socialLinks.twitter && (
                    <Tooltip title="Twitter" arrow>
                      <IconButton
                        component="a"
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          color: '#1DA1F2',
                          '&:hover': { transform: 'translateY(-3px)' }
                        }}
                      >
                        <TwitterIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {socialLinks.instagram && (
                    <Tooltip title="Instagram" arrow>
                      <IconButton
                        component="a"
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ 
                          color: '#E1306C',
                          '&:hover': { transform: 'translateY(-3px)' }
                        }}
                      >
                        <InstagramIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Personal Info
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                    {personalInfo.email}
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body2">
                    {personalInfo.location}
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Languages
                  </Typography>
                  <Typography variant="body2">
                    English, Hindi
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: { xs: 2, sm: 3 },
                    borderRadius: 4,
                    boxSizing: 'border-box',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                  }}
                >
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    Who I Am
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" paragraph>
                    {personalInfo.bio || 'Passionate developer dedicated to creating exceptional digital experiences.'}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: { xs: 2, sm: 3 },
                    height: '100%',
                    borderRadius: 4,
                    boxSizing: 'border-box',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CodeIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Skills
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {skills.technical.map((skill: any, index: number) => (
                      <SkillChip key={index} label={skill.name} />
                    ))}
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: { xs: 2, sm: 3 },
                    height: '100%',
                    borderRadius: 4,
                    boxSizing: 'border-box',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Education
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <List disablePadding>
                    {education.length > 0 ? (
                      education.map((edu: any, index: number) => (
                        <ListItem key={index} disablePadding sx={{ mb: 2 }}>
                          <ListItemText 
                            primary={<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{edu.degree}</Typography>}
                            secondary={
                              <>
                                <Typography variant="body2" component="span">
                                  {edu.institution}
                                </Typography>
                                <br />
                                <Typography variant="body2" color="text.secondary" component="span">
                                  {edu.startDate} - {edu.endDate}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Education details coming soon.
                      </Typography>
                    )}
                  </List>
                </Paper>
              </motion.div>
            </Grid>
            
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: { xs: 2, sm: 3 },
                    borderRadius: 4,
                    boxSizing: 'border-box',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HobbyIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Interests
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {interests.map((interest, index) => (
                      <Chip 
                        key={index}
                        label={interest}
                        size="small"
                        sx={{
                          bgcolor: isDark ? 'rgba(144, 202, 249, 0.1)' : 'rgba(63, 81, 181, 0.1)',
                          color: theme.palette.primary.main,
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

// Helper components
const SkillChip: React.FC<{ label: string }> = ({ label }) => {
  const theme = useTheme();
  return (
    <Chip 
      label={label} 
      sx={{ 
        fontWeight: 500,
        bgcolor: theme.palette.mode === 'dark' 
          ? 'rgba(144, 202, 249, 0.1)' 
          : 'rgba(63, 81, 181, 0.1)',
        color: theme.palette.primary.main,
        border: `1px solid ${theme.palette.primary.main}`,
        '&:hover': {
          bgcolor: theme.palette.mode === 'dark' 
            ? 'rgba(144, 202, 249, 0.2)' 
            : 'rgba(63, 81, 181, 0.2)',
        },
      }} 
    />
  );
};

export default About; 