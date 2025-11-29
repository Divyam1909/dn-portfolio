import React, { ReactNode, useState, useEffect } from 'react';
import {
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Button,
  LinearProgress,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Code as CodeIcon,
  Email as EmailIcon,
  Close as CloseIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FlowingHeader from './FlowingHeader';

interface LayoutProps {
  children: ReactNode;
  toggleTheme: () => void;
  toggleView: () => void; // Add toggleView prop
  setLastPathFromUniverseView: (path: string | null) => void;
  lastPathFromUniverseView: string | null;
}

// Navigation items definition with keyboard shortcuts
const navItems = [
  { name: 'Home', path: '/', icon: <HomeIcon />, shortcut: 'Alt+1' },
  { name: 'About', path: '/about', icon: <PersonIcon />, shortcut: 'Alt+2' },
  { name: 'Resume', path: '/resume', icon: <WorkIcon />, shortcut: 'Alt+3' },
  { name: 'Projects', path: '/projects', icon: <CodeIcon />, shortcut: 'Alt+4' },
  { name: 'Contact', path: '/contact', icon: <EmailIcon />, shortcut: 'Alt+5' },
];

const Layout: React.FC<LayoutProps> = ({ children, toggleTheme, toggleView, setLastPathFromUniverseView, lastPathFromUniverseView }) => {
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isDarkMode = theme.palette.mode === 'dark';
  const [isNavigating, setIsNavigating] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  // Handle page transitions
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 500); // Match with animation duration

    // If navigating to a new path from the Universe View, record it.
    // If navigating back to the root ('/') and the last path was from Universe View,
    // then toggle back to Universe View.
    // This logic is being removed as per user request to default to simplified view
    // if (location.pathname !== '/' && !lastPathFromUniverseView) {
    //   setLastPathFromUniverseView(location.pathname);
    // } else if (location.pathname === '/' && lastPathFromUniverseView) {
    //   toggleView();
    //   setLastPathFromUniverseView(null);
    // }

    return () => clearTimeout(timer);
  }, [location.pathname, lastPathFromUniverseView, setLastPathFromUniverseView, toggleView]);

  // Set up keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const numKey = parseInt(e.key);
        if (!isNaN(numKey) && numKey > 0 && numKey <= navItems.length) {
          e.preventDefault();
          navigate(navItems[numKey - 1].path);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Prefetch routes when hovering over links
  const handlePrefetch = (path: string) => {
    setHoveredPath(path);
    // This would ideally trigger an actual prefetch if using a framework like Next.js
    // Since we're using plain React Router, this is a placeholder for future implementation
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Navigation animation variants
  const navVariants = {
    hidden: { 
      opacity: 0,
      y: -10,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      }
    }),
  };

  // Render desktop navigation items with animations
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderDesktopNavItems = () => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        const isHovered = hoveredPath === item.path;
        
        return (
          <Tooltip 
            key={item.name} 
            title={`${item.name} (${item.shortcut})`} 
            arrow
            placement="bottom"
          >
            <Button
              component={RouterLink}
              to={item.path}
              color={isActive ? 'primary' : 'inherit'}
              onMouseEnter={() => handlePrefetch(item.path)}
              onMouseLeave={() => setHoveredPath(null)}
              sx={{ 
                fontWeight: 500,
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  width: '100%',
                  height: '3px',
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '3px 3px 0 0',
                  transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'center',
                  transition: 'transform 0.3s ease'
                },
                '&:hover::after': {
                  transform: 'scaleX(1)',
                },
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <motion.span
                variants={navVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                {item.name}
              </motion.span>
              
              {/* Highlight indicator */}
              <Fade in={isHovered && !isActive}>
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 4, 
                    right: 4, 
                    height: 1, 
                    bgcolor: 'rgba(144, 202, 249, 0.3)' 
                  }} 
                />
              </Fade>
            </Button>
          </Tooltip>
        );
      })}
    </Box>
  );

  // Enhanced drawer navigation with keyboard support and aria attributes
  const renderNavItems = (onClick?: () => void) => (
    <List role="navigation" aria-label="Main Navigation">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <ListItem
            key={item.name}
            component={RouterLink}
            to={item.path}
            onClick={onClick}
            onMouseEnter={() => handlePrefetch(item.path)}
            onMouseLeave={() => setHoveredPath(null)}
            sx={{
              color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
              backgroundColor: isActive 
                ? (isDarkMode ? 'rgba(144, 202, 249, 0.08)' : 'rgba(63, 81, 181, 0.08)') 
                : 'transparent',
              borderRadius: 1,
              mb: 0.5,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(144, 202, 249, 0.12)' : 'rgba(63, 81, 181, 0.12)',
                transform: 'translateX(4px)'
              },
            }}
            role="menuitem"
            aria-current={isActive ? 'page' : undefined}
          >
            <ListItemIcon sx={{ 
              color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
              minWidth: 40,
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.name} />
            
            {/* Keyboard shortcut hint */}
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.7, 
                ml: 1, 
                display: { xs: 'none', sm: 'block' } 
              }}
            >
              {item.shortcut}
            </Typography>
            
            {isActive && (
              <KeyboardArrowRightIcon 
                sx={{ 
                  ml: 1, 
                  fontSize: '1rem', 
                  color: theme.palette.primary.main 
                }} 
              />
            )}
          </ListItem>
        );
      })}
    </List>
  );

  // Enhanced drawer with accessibility improvements
  const drawer = (
    <Box 
      sx={{ textAlign: 'center', mt: 2 }}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
        <Typography variant="h6" color="text.primary" sx={{ fontWeight: 700 }}>
          Portfolio
        </Typography>
        <IconButton 
          onClick={handleDrawerToggle} 
          aria-label="Close menu"
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ my: 2 }} />
      {renderNavItems(handleDrawerToggle)}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Animated progress indicator for page transitions */}
      {isNavigating && (
        <LinearProgress 
          color="primary" 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: theme.zIndex.appBar + 1,
            height: 3,
          }} 
        />
      )}
      
      {/* New Flowing Header */}
      <FlowingHeader toggleTheme={toggleTheme} onMenuClick={handleDrawerToggle} />
      
      {/* Mobile navigation drawer */}
      <Drawer
        id="navigation-drawer"
        variant="temporary"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            width: 280,
            boxSizing: 'border-box',
            boxShadow: theme.shadows[5]
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content with page transitions */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container 
          maxWidth={false}
          disableGutters
          sx={{ 
            py: 0,
            px: 0,
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'visible'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                type: 'spring',
                stiffness: 260,
                damping: 20,
                duration: 0.3
              }}
              style={{ 
                height: '100%',
                width: '100%',
                overflow: 'hidden'
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Container>
      </Box>

      {/* Universe View Button - Bottom Right */}
      <Button
        variant="contained"
        onClick={toggleView}
        sx={{
          position: 'fixed',
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
          zIndex: theme.zIndex.appBar + 10,
          '&:hover': {
            bgcolor: '#FFE066',
            boxShadow: '0 0 30px rgba(255, 214, 10, 0.9)',
            transform: 'translateY(-2px)',
          },
        }}
      >
        Universe View
      </Button>

    </Box>
  );
};

export default Layout; 