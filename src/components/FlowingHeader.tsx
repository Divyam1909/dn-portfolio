import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import ThemeSwitch from './toggle';

interface FlowingHeaderProps {
  toggleTheme: () => void;
  onMenuClick: () => void;
}

const FlowingHeader: React.FC<FlowingHeaderProps> = ({ toggleTheme, onMenuClick }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Resume', path: '/resume' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'transparent',
        backdropFilter: 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? 'linear-gradient(180deg, rgba(18, 18, 18, 0.95) 0%, rgba(18, 18, 18, 0.85) 70%, transparent 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 70%, transparent 100%)',
          backdropFilter: 'blur(20px) saturate(180%)',
          zIndex: -1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: isDark
            ? 'linear-gradient(90deg, transparent, rgba(147, 197, 253, 0.3), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.3), transparent)',
        },
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            px: { xs: 0, sm: 2 },
            py: 2,
          }}
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                fontWeight: 800,
                background: isDark
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: isActive('/') ? '100%' : '0%',
                  height: '3px',
                  background: 'linear-gradient(90deg, #667eea, #764ba2)',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease',
                },
                '&:hover::after': {
                  width: '100%',
                },
              }}
            >
              Divyam's Portfolio
            </Typography>
          </motion.div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <LayoutGroup>
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  background: isDark
                    ? 'rgba(255, 255, 255, 0.03)'
                    : 'rgba(0, 0, 0, 0.03)',
                  borderRadius: '50px',
                  p: 0.5,
                  border: `1px solid ${
                    isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
                  }`,
                }}
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Button
                      onClick={() => navigate(item.path)}
                      sx={{
                        color: isActive(item.path)
                          ? '#fff'
                          : theme.palette.text.primary,
                        fontWeight: isActive(item.path) ? 700 : 500,
                        px: 3,
                        py: 1,
                        borderRadius: '50px',
                        position: 'relative',
                        overflow: 'hidden',
                        background: 'transparent',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer', // Ensure clickability feedback
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: isDark
                            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
                            : 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        },
                        '&:hover::before': {
                          opacity: isActive(item.path) ? 0 : 1,
                        },
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: isActive(item.path)
                            ? '0 8px 16px rgba(102, 126, 234, 0.3)'
                            : 'none',
                        },
                      }}
                    >
                      {isActive(item.path) && (
                        <motion.span
                          layoutId="navBubble"
                          layout
                          style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 8px 18px rgba(102, 126, 234, 0.35)',
                            zIndex: 0,
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 260,
                            damping: 28,
                            mass: 0.8,
                          }}
                        />
                      )}
                      <Box component="span" sx={{ position: 'relative', zIndex: 1 }}>
                        {item.label}
                      </Box>
                    </Button>
                  </motion.div>
                ))}
              </Box>
            </LayoutGroup>
          )}

          {/* Right Actions */}
          <Box sx={{ display: 'flex', gap: 1.25, alignItems: 'center' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  transform: { xs: 'scale(0.38)', sm: 'scale(0.48)', md: 'scale(0.54)' },
                  transformOrigin: 'center',
                }}
              >
                <ThemeSwitch
                  checked={isDark}
                  onChange={() => toggleTheme()}
                  size={7}
                  ariaLabel="Toggle light/dark theme"
                />
              </Box>
            </motion.div>

            {isMobile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <IconButton
                  onClick={onMenuClick}
                  sx={{
                    color: theme.palette.text.primary,
                    bgcolor: isDark
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.05)',
                    border: `1px solid ${
                      isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }`,
                    '&:hover': {
                      bgcolor: isDark
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </motion.div>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default FlowingHeader;

