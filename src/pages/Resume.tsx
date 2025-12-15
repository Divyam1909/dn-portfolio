import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Button,
  Alert,
} from '@mui/material';
import { parseFlexibleDate, dateForSorting } from "../utils/date"; // Import dateForSorting
import {
  Work as WorkIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  EmojiEvents as AchievementsIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { usePortfolioData } from '../contexts/DataContext';
import { portfolioAPI } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`resume-tabpanel-${index}`}
      aria-labelledby={`resume-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ py: 3, px: { xs: 1, sm: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `resume-tab-${index}`,
    'aria-controls': `resume-tabpanel-${index}`,
  };
};

// Timeline component for experiences
const Timeline: React.FC<{ items: any[] }> = ({ items }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const primaryColor = theme.palette.primary.main;

  // Handle empty state
  if (!items || items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No entries found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add entries via the admin panel to see them here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Vertical timeline line */}
      <Box
        sx={{
          position: 'absolute',
          left: { xs: 14, md: 20 },
          top: 15,
          bottom: 15,
          width: 3,
          backgroundImage: isDark 
            ? `linear-gradient(to bottom, transparent, ${primaryColor} 10%, ${primaryColor} 90%, transparent)`
            : `linear-gradient(to bottom, transparent, ${primaryColor} 10%, ${primaryColor} 90%, transparent)`,
          zIndex: 1,
          borderRadius: '3px',
          boxShadow: isDark 
            ? `0 0 8px rgba(144, 202, 249, 0.4)` 
            : `0 0 8px rgba(63, 81, 181, 0.3)`,
        }}
      />

      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Box
            sx={{
              position: 'relative',
              mb: 4,
              ml: { xs: 4, sm: 5, md: 6 },
              pl: { xs: 1, sm: 2, md: 3 },
            }}
          >
            {/* Timeline connecting line to card */}
            <Box
              sx={{
                position: 'absolute',
                left: { xs: -14, sm: -20, md: -25 },
                top: 10,
                height: 2,
                width: { xs: 14, sm: 20, md: 25 },
                backgroundColor: primaryColor,
                opacity: 0.7,
              }}
            />
            
            {/* Timeline dot/bullet with decoration */}
            <Box
              sx={{
                position: 'absolute',
                left: { xs: -32, sm: -40, md: -48 },
                top: 0,
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Main dot */}
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${
                    isDark ? '#64B5F6' : '#7986CB'
                  } 100%)`,
                  border: `2px solid ${isDark ? '#121212' : '#fff'}`,
                  boxShadow: `0 0 8px ${isDark ? 'rgba(144, 202, 249, 0.6)' : 'rgba(63, 81, 181, 0.4)'}`,
                  zIndex: 3,
                  position: 'relative',
                }}
              />
              
              {/* Pulse animation effect */}
              <Box
                component={motion.div}
                initial={{ opacity: 0.7, scale: 0.8 }}
                animate={{ 
                  opacity: [0.7, 0.5, 0.7], 
                  scale: [0.8, 1.1, 0.8] 
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                sx={{
                  position: 'absolute',
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  background: isDark 
                    ? `radial-gradient(circle, ${primaryColor}60 0%, transparent 70%)` 
                    : `radial-gradient(circle, ${primaryColor}40 0%, transparent 70%)`,
                }}
              />
            </Box>

            {/* Timeline card */}
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                position: 'relative',
                width: '100%',
                overflow: 'hidden',
                boxSizing: 'border-box',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: theme.shadows[8],
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: -10,
                  top: 12,
                  width: 0,
                  height: 0,
                  borderTop: '10px solid transparent',
                  borderBottom: '10px solid transparent',
                  borderRight: `10px solid ${
                    isDark ? theme.palette.background.paper : theme.palette.background.paper
                  }`,
                },
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                {item.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', my: 1, flexWrap: 'wrap' }}>
                <Typography variant="subtitle1" color="primary">
                  {item.organization}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: { xs: 0, sm: 'auto' }, mt: { xs: 0.5, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}
                >
                  {item.date}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {item.location}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {item.description}
              </Typography>
              
              {item.highlights && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {item.highlights.map((highlight: string, i: number) => (
                    <Chip
                      key={i}
                      label={highlight}
                      size="small"
                      sx={{
                        backgroundColor: isDark
                          ? 'rgba(144, 202, 249, 0.1)'
                          : 'rgba(63, 81, 181, 0.1)',
                        color: theme.palette.primary.main,
                      }}
                    />
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        </motion.div>
      ))}
    </Box>
  );
};

// Skill component with progress bar
const Skill: React.FC<{ name: string; level: number }> = ({ name, level }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const primaryColor = theme.palette.primary.main;
  const secondaryColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)';
  
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 1.5 
      }}>
        <Typography variant="body1" fontWeight={500}>{name}</Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          position: 'relative'
        }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: primaryColor,
              position: 'relative',
              zIndex: 2
            }}
          >
            {level}%
          </Typography>
        </Box>
      </Box>
      
      <Box sx={{ position: 'relative', height: 10, width: '100%' }}>
        {/* Background bar */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          borderRadius: 5,
          background: secondaryColor,
        }} />
        
        {/* Foreground progress bar with animation */}
        <Box
          component={motion.div}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ 
            duration: 1.2, 
            ease: "easeOut",
            delay: 0.2
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            borderRadius: 5,
            background: `linear-gradient(90deg, ${primaryColor} 0%, ${
              isDark ? '#64B5F6' : '#7986CB'
            } 100%)`,
            boxShadow: `0 0 8px ${isDark ? 'rgba(144, 202, 249, 0.5)' : 'rgba(63, 81, 181, 0.4)'}`,
          }}
        />
        
        {/* Dots/bullets decoration */}
        {[0, 25, 50, 75, 100].map((mark) => (
          <Box
            key={mark}
            sx={{
              position: 'absolute',
              top: '50%',
              left: `${mark}%`,
              transform: 'translate(-50%, -50%)',
              width: mark === 0 || mark === 100 ? 7 : 5,
              height: mark === 0 || mark === 100 ? 7 : 5,
              borderRadius: '50%',
              backgroundColor: mark <= level ? primaryColor : secondaryColor,
              transition: 'background-color 0.3s',
              zIndex: 2,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const Resume: React.FC = () => {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(() => {
    const hash = location.hash.replace('#', '');
    switch (hash) {
      case 'experience':
        return 0;
      case 'education':
        return 1;
      case 'skills':
        return 2;
      case 'certifications':
        return 3;
      default:
        return 0;
    }
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isDark = theme.palette.mode === 'dark';
  const { data } = usePortfolioData();
  const { workExperience, education, skills } = data;
  const [certifications, setCertifications] = useState<any[]>([]);
  const [orderDesc, setOrderDesc] = useState(true); // New state for sorting order

  // Fetch certifications
  useEffect(() => {
    const loadCertifications = async () => {
      try {
        const response = await portfolioAPI.getCertifications();
        if (response.data.success) {
          setCertifications(response.data.data);
        }
      } catch (error) {
        console.error('Error loading certifications:', error);
      }
    };
    loadCertifications();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const hashMap = ['experience', 'education', 'skills', 'certifications'];
    if (hashMap[newValue]) {
      window.location.hash = hashMap[newValue];
    }
  };

  // Use the raw workExperience array for sorting, but map to Timeline items for display.
  // This preserves ISO fields for accurate sorting.
  const sortedExperience = useMemo(() => {
    const raw = Array.isArray(workExperience) ? [...workExperience] : [];

    // Attach parsedDate for sorting (avoid modifying original object by shallow copy)
    const stamped = raw.map(item => {
      const parsed = dateForSorting(item); // uses ISO if available
      return { __parsedDate: parsed ? parsed.valueOf() : 0, item };
    });

    // Sort by parsedDate (desc = newest first)
    stamped.sort((a, b) => (orderDesc ? b.__parsedDate - a.__parsedDate : a.__parsedDate - b.__parsedDate));

    // Map to Timeline display shape
    return stamped.map(({ item }) => ({
      title: (item as any).title || '',
      organization: (item as any).company || (item as any).organization || '',
      date: ((item as any).startDate && (item as any).endDate)
        ? `${(item as any).startDate} - ${(item as any).endDate}`
        : ((item as any).startDateISO || (item as any).startDate
            ? `${(item as any).startDate ?? (item as any).startDateISO}`
            : ''),
      location: (item as any).location || '',
      description: (item as any).description || '',
      highlights: (item as any).achievements || (item as any).highlights || [],
      // Keep original for debugging or click actions if needed:
      __meta: {
        startDateISO: (item as any).startDateISO ?? (item as any).startDateISO,
        endDateISO: (item as any).endDateISO ?? (item as any).endDateISO,
        current: (item as any).current ?? false
      }
    }));
  }, [workExperience, orderDesc]);


  const sortedEducation = useMemo(() => {
    const raw = Array.isArray(education) ? [...education] : [];
  
    const stamped = raw.map(item => {
      const parsed = dateForSorting(item);
      return { __parsedDate: parsed ? parsed.valueOf() : 0, item };
    });
  
    stamped.sort((a, b) => (orderDesc ? b.__parsedDate - a.__parsedDate : a.__parsedDate - b.__parsedDate));
  
    return stamped.map(({ item }) => ({
      title: (item as any).degree || '',
      organization: (item as any).institution || '',
      date: ((item as any).startDate && (item as any).endDate)
        ? `${(item as any).startDate} - ${(item as any).endDate}`
        : ((item as any).startDateISO || (item as any).startDate || ''),
      location: (item as any).location || '',
      description: (item as any)?.description || '',
      highlights: Array.isArray((item as any)?.achievements) ? (item as any).achievements : [],
      __meta: {
        startDateISO: (item as any)?.startDateISO,
        endDateISO: (item as any)?.endDateISO,
        current: (item as any)?.current ?? false
      }
    }));
  }, [education, orderDesc]);

  // Skill data formatting
  const skillsData = {
    technical: Array.isArray(skills.technical) ? skills.technical : [],
    softSkills: Array.isArray(skills.soft) ? skills.soft.map((skill: string) => ({ name: skill, level: 85 })) : [],
  };

  // Format certifications data to match Timeline component structure
  // Format certifications data to match Timeline component structure
  // NOTE: expiryDate removed per request — only show issueDate
  const sortedCertifications = useMemo(() => {
    const raw = Array.isArray(certifications) ? [...certifications] : [];
  
    const stamped = raw.map(item => {
      // dateForSorting will check issueDate / issueDateISO as fallback
      const parsed = dateForSorting(item);
      return { __parsedDate: parsed ? parsed.valueOf() : 0, item };
    });
  
    stamped.sort((a, b) => (orderDesc ? b.__parsedDate - a.__parsedDate : a.__parsedDate - b.__parsedDate));
  
    return stamped.map(({ item }) => ({
      title: item.title || '',
      organization: item.issuer || '',
      // show only issueDate (you requested expiry removed)
      date: item.issueDate || item.issueDateISO || '',
      location: item.credentialId ? `Credential ID: ${item.credentialId}` : '',
      description: item.description || '',
      highlights: item.skills || [],
      __meta: { issueDateISO: item.issueDateISO }
    }));
  }, [certifications, orderDesc]);

  const tabItems = useMemo(
    () => [
      { label: 'Experience', icon: <WorkIcon />, value: 0 },
      { label: 'Education', icon: <SchoolIcon />, value: 1 },
      { label: 'Skills', icon: <CodeIcon />, value: 2 },
      { label: 'Certifications', icon: <AchievementsIcon />, value: 3 },
    ],
    []
  );
  

  return (
    <Box sx={{ px: { xs: 2, sm: 4, md: 6 }, py: { xs: 2, sm: 3, md: 4 } }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

      </motion.div>

      <Paper
        elevation={1}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          width: '100%',
          background: isDark
            ? 'linear-gradient(135deg, rgba(18,24,39,0.72), rgba(30,41,59,0.58))'
            : 'linear-gradient(135deg, rgba(255,255,255,0.65), rgba(245,247,250,0.55))',
          backdropFilter: 'blur(14px) saturate(140%)',
          border: `1px solid ${isDark ? 'rgba(144, 202, 249, 0.25)' : 'rgba(63, 81, 181, 0.18)'}`,
          boxShadow: isDark
            ? '0 20px 45px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.02)'
            : '0 16px 40px rgba(63,81,181,0.12), 0 0 0 1px rgba(255,255,255,0.6)',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(0deg, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '28px 28px',
            opacity: isDark ? 0.08 : 0.12,
            pointerEvents: 'none',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            px: { xs: 1, sm: 2 },
            pt: { xs: 1, sm: 1.5 },
          }}
        >
          {isMobile ? (
            <Box sx={{ flexGrow: 1 }}>
              <Box
                component="select"
                value={tabValue}
                onChange={(e) => handleTabChange(e as any, Number(e.target.value))}
                aria-label="resume sections"
                className="resume-tabs-select"
                sx={{
                  width: '100%',
                  borderRadius: 12,
                  px: 1.5,
                  py: 1.2,
                  border: `1px solid ${
                    isDark ? 'rgba(255,255,255,0.15)' : 'rgba(63,81,181,0.25)'
                  }`,
                  backgroundColor: isDark ? 'rgba(22, 26, 33, 0.9)' : 'rgba(248, 249, 252, 0.95)',
                  color: isDark ? '#eef6ff' : '#1f2937',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontSize: '0.9rem',
                  boxShadow: isDark
                    ? '0 10px 24px rgba(0,0,0,0.45)'
                    : '0 10px 24px rgba(63,81,181,0.18)',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3csvg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236678ed' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'calc(100% - 14px) center',
                  backgroundSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease',
                  '&:focus': {
                    borderColor: theme.palette.primary.main,
                    boxShadow: `0 0 0 3px ${theme.palette.primary.main}33`,
                    transform: 'translateY(-1px)',
                  },
                  '& option': {
                    backgroundColor: isDark ? '#0f1419' : '#fff',
                    color: isDark ? '#e8f2ff' : '#1f2937',
                    fontWeight: 600,
                    textTransform: 'none',
                  },
                }}
              >
                {tabItems.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Box>
            </Box>
          ) : (
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons={false}
              aria-label="resume sections"
              TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 2,
                px: { xs: 0.4, sm: 0.85 },
                py: { xs: 0.1, sm: 0.5 },
                backgroundColor: isDark
                  ? 'rgba(22, 26, 33, 0.75)'
                  : 'rgba(248, 249, 252, 0.8)',
                backdropFilter: 'blur(8px)',
                boxShadow: isDark
                  ? '0 10px 30px rgba(0,0,0,0.35)'
                  : '0 10px 30px rgba(63,81,181,0.12)',
                '& .MuiTabs-indicator': {
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 4,
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  '& .MuiTabs-indicatorSpan': {
                    width: '82%',
                    maxWidth: 140,
                    height: '100%',
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${
                      isDark ? '#7aa6ff' : '#5c6bc0'
                    })`,
                    boxShadow: `0 6px 18px ${theme.palette.primary.main}40`,
                  },
                },
                minHeight: { xs: 38, md: 50 },
                '& .MuiTab-root': {
                  minHeight: { xs: 38, md: 50 },
                  px: { xs: 0.75, sm: 1.4 },
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  fontWeight: 700,
                  fontSize: { xs: '0.75rem', sm: '0.85rem' },
                  flex: 1,
                  maxWidth: 'unset',
                  color: isDark ? 'rgba(255,255,255,0.78)' : 'rgba(0,0,0,0.74)',
                  transition: 'color 0.25s ease, transform 0.25s ease, background 0.25s ease',
                  borderRadius: 999,
                  position: 'relative',
                  '&:hover': {
                    color: theme.palette.primary.main,
                    transform: 'translateY(-2px)',
                    background: isDark
                      ? 'rgba(255,255,255,0.04)'
                      : 'rgba(63,81,181,0.06)',
                  },
                  '&.Mui-selected': {
                    color: isDark ? '#fff' : theme.palette.primary.main,
                    textShadow: isDark ? '0 4px 18px rgba(124, 179, 255, 0.35)' : '0 4px 18px rgba(63, 81, 181, 0.35)',
                  },
                  '& .MuiTab-iconWrapper': {
                    mr: 0.5,
                    fontSize: '0.95rem',
                  },
                },
                flexGrow: 1,
                minWidth: 0,
              }}
            >
              {tabItems.map((item) => (
                <Tab
                  key={item.value}
                  icon={item.icon}
                  label={item.label}
                  {...a11yProps(item.value)}
                />
              ))}
            </Tabs>
          )}
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            sx={{ borderRadius: 8, whiteSpace: 'nowrap' }}
            component="a"
            href={`${process.env.PUBLIC_URL}/uploads/divyam_resume.pdf`}
            download
          >
            Download
          </Button>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Paper
            elevation={1}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              height: '100%',
              background: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button
                onClick={() => setOrderDesc((s) => !s)}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {orderDesc ? "Newest first" : "Oldest first"}
              </Button>
            </Box>
            <Timeline items={sortedExperience} />
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            onClick={() => setOrderDesc((s) => !s)}
            size="small"
            variant="outlined"
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              fontWeight: 700,
              letterSpacing: '0.04em',
              '&:hover': {
                borderColor: theme.palette.primary.dark,
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
              {orderDesc ? "Newest first" : "Oldest first"}
            </Button>
          </Box>
          <Timeline items={sortedEducation} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  borderRadius: 2,
                  height: '100%',
                  background: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.5)'
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600} sx={{ display: 'flex', alignItems: 'center' }}>
                  <CodeIcon color="primary" sx={{ mr: 1 }} />
                  Technical Skills
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                  {skillsData.technical && skillsData.technical.length > 0 ? (
                    skillsData.technical.map((skill: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Skill name={skill.name} level={skill.level} />
                      </motion.div>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No technical skills added yet. Add skills via the admin panel.
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  borderRadius: 2,
                  height: '100%',
                  background: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.5)'
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600} sx={{ display: 'flex', alignItems: 'center' }}>
                  <CodeIcon color="primary" sx={{ mr: 1 }} />
                  Soft Skills
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
                  {skillsData.softSkills && skillsData.softSkills.length > 0 ? (
                    skillsData.softSkills.map((skill: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Skill name={skill.name} level={skill.level} />
                      </motion.div>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No soft skills added yet. Add skills via the admin panel.
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Paper
            elevation={1}
            sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 2,
              height: '100%',
              background: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Button
                onClick={() => setOrderDesc((s) => !s)}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  '&:hover': {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {orderDesc ? "Newest first" : "Oldest first"}
              </Button>
            </Box>
            <Timeline items={sortedCertifications} />
          </Paper>
        </TabPanel>

      </Paper>
    </Box>
  );
};

export default Resume; 