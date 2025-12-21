import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Paper,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  Apps as AppsIcon,
  ArrowBack as BackIcon,
  CameraAlt as CameraIcon,
  MusicNote as MusicIcon,
  VideoLibrary as VideoIcon,
  PhotoLibrary as PhotoIcon,
  CalendarToday as CalendarIcon,
  Map as MapIcon,
  ShoppingCart as ShopIcon,
  Book as BookIcon,
  SportsEsports as GameIcon,
  Settings as SettingsIcon,
  Mail as MailIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { usePortfolioData } from '../contexts/DataContext';
import animePhoto from '../assets/images/anime-photo.png';

interface ContactPopup {
  type: 'github' | 'linkedin' | 'email' | 'phone' | 'photo' | null;
}

interface BurstState {
  color: string;
  x: number;
  y: number;
  isActive: boolean;
  type: 'github' | 'linkedin' | 'email' | 'phone' | 'photo' | null;
}

const Contact: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { data } = usePortfolioData();
  const { personalInfo } = data;
  const socialLinks = personalInfo.socialLinks || {};
  const cardIntRef = useRef<HTMLDivElement>(null);
  
  const [popup, setPopup] = useState<ContactPopup>({ type: null });
  const [burst, setBurst] = useState<BurstState>({
    color: '',
    x: 0,
    y: 0,
    isActive: false,
    type: null,
  });
  const colorMap: Record<string, string> = {
    github: '#6f42c1',
    linkedin: '#0077b5',
    email: '#ff6b35',
    phone: '#34a853',
    photo: '#ffd700', // Golden color
  };

  const updateBurstState = (type: 'github' | 'linkedin' | 'email' | 'phone' | 'photo' | null, event: React.MouseEvent<HTMLDivElement | HTMLImageElement>) => {
    if (!type) {
      setBurst(prev => ({ ...prev, isActive: false, type: null }));
      return;
    }

    const iconElement = event.currentTarget;
    const cardIntElement = cardIntRef.current;
    
    if (cardIntElement) {
      const cardRect = cardIntElement.getBoundingClientRect();
      const iconRect = iconElement.getBoundingClientRect();
      
      // Calculate center position of icon relative to card-int
      const x = iconRect.left + iconRect.width / 2 - cardRect.left;
      const y = iconRect.top + iconRect.height / 2 - cardRect.top;
      
      setBurst({
        color: colorMap[type] || '#000',
        x,
        y,
        isActive: true,
        type,
      });
    }
  };

  const handleIconClick = (type: 'github' | 'linkedin' | 'email' | 'phone' | 'photo', event: React.MouseEvent<HTMLDivElement | HTMLImageElement>) => {
    setPopup({ type });
    updateBurstState(type, event);
  };

  const handleIconHover = (type: 'github' | 'linkedin' | 'email' | 'phone' | 'photo' | null, event: React.MouseEvent<HTMLDivElement | HTMLImageElement>) => {
    updateBurstState(type, event);
  };

  const handleIconLeave = () => {
    // Only reset if no popup is open
    if (!popup.type) {
      setBurst(prev => ({ ...prev, isActive: false, type: null }));
    }
  };

  const handleClosePopup = () => {
    setPopup({ type: null });
    // Reset color when popup closes
    setBurst(prev => ({ ...prev, isActive: false, type: null }));
  };

  const getPopupContent = () => {
    switch (popup.type) {
      case 'github':
        return {
          title: 'GitHub',
          content: socialLinks.github || 'Not available',
          icon: <GitHubIcon sx={{ fontSize: 40 }} />,
          color: '#6f42c1',
          link: socialLinks.github,
        };
      case 'linkedin':
        return {
          title: 'LinkedIn',
          content: socialLinks.linkedin || 'Not available',
          icon: <LinkedInIcon sx={{ fontSize: 40 }} />,
          color: '#0077b5',
          link: socialLinks.linkedin,
        };
      case 'email':
        return {
          title: 'Email',
          content: personalInfo.email,
          icon: <EmailIcon sx={{ fontSize: 40 }} />,
          color: '#ff6b35', // Light red/orange
          link: `mailto:${personalInfo.email}`,
        };
      case 'phone':
        return {
          title: 'Phone',
          content: personalInfo.phone || 'Not available',
          icon: <PhoneIcon sx={{ fontSize: 40 }} />,
          color: '#34a853',
          link: personalInfo.phone ? `tel:${personalInfo.phone}` : undefined,
        };
      case 'photo':
        return {
          title: personalInfo.name || 'Profile',
          content: '',
          icon: <AccountCircleIcon sx={{ fontSize: 40 }} />,
          color: '#ffd700', // Golden color
          link: undefined,
        };
      default:
        return null;
    }
  };

  const popupData = getPopupContent();
  const portfolioUrlFull = socialLinks.website || 'https://divyam-n-portfolio.vercel.app';
  const portfolioUrl = portfolioUrlFull.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleAppClick = (appType: string) => {
    switch (appType) {
      case 'camera':
        // Try to open camera
        if (cameraInputRef.current) {
          cameraInputRef.current.click();
        } else {
          // Fallback: request camera access
          navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
              // Camera accessed successfully
              stream.getTracks().forEach(track => track.stop());
            })
            .catch((err) => {
              console.log('Camera access denied or not available:', err);
            });
        }
        break;
      case 'music':
        // Try to open Spotify web player
        window.open('https://open.spotify.com/', '_blank');
        break;
      case 'video':
        // Try to open YouTube or video platform
        window.open('https://www.youtube.com/', '_blank');
        break;
      case 'gallery':
        // Open file picker for images
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
        break;
      case 'mail':
        // Open email client
        window.location.href = `mailto:${personalInfo.email}`;
        break;
      case 'calendar':
        // Try to open Google Calendar or create calendar event
        const calendarUrl = `https://calendar.google.com/calendar/render`;
        window.open(calendarUrl, '_blank');
        break;
      case 'map':
        // Open Google Maps
        window.open('https://www.google.com/maps', '_blank');
        break;
      case 'shop':
        // Open shopping site
        window.open('https://www.amazon.com/', '_blank');
        break;
      default:
        break;
    }
  };

  // App icons - first 4 are contact apps, rest are functional apps
  const appIcons = [
    { icon: <GitHubIcon sx={{ fontSize: 28 }} />, type: 'github', isContact: true, appType: null },
    { icon: <LinkedInIcon sx={{ fontSize: 28 }} />, type: 'linkedin', isContact: true, appType: null },
    { icon: <EmailIcon sx={{ fontSize: 28 }} />, type: 'email', isContact: true, appType: null },
    { icon: <PhoneIcon sx={{ fontSize: 28 }} />, type: 'phone', isContact: true, appType: null },
    { icon: <CameraIcon sx={{ fontSize: 28 }} />, type: null, isContact: false, appType: 'camera' },
    { icon: <MusicIcon sx={{ fontSize: 28 }} />, type: null, isContact: false, appType: 'music' },
    { icon: <VideoIcon sx={{ fontSize: 28 }} />, type: null, isContact: false, appType: 'video' },
    { icon: <PhotoIcon sx={{ fontSize: 28 }} />, type: null, isContact: false, appType: 'gallery' },
    { icon: <MailIcon sx={{ fontSize: 28 }} />, type: null, isContact: false, appType: 'mail' },
    { icon: <CalendarIcon sx={{ fontSize: 28 }} />, type: null, isContact: false, appType: 'calendar' },
    { icon: <MapIcon sx={{ fontSize: 28 }} />, type: null, isContact: false, appType: 'map' },
    { icon: <ShopIcon sx={{ fontSize: 28 }} />, type: null, isContact: false, appType: 'shop' },
  ];

  return (
    <StyledContainer>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', lg: 'row' },
        alignItems: { xs: 'center', lg: 'flex-start' },
        justifyContent: { xs: 'center', lg: 'flex-start' },
        gap: { xs: 4, lg: 6 },
        px: { xs: 2, sm: 4 },
        py: { xs: 4, sm: 6 },
        minHeight: '100vh',
        position: 'relative',
      }}>
        {/* Phone Mockup - Fixed on Left */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'sticky', top: '20px', alignSelf: 'flex-start' }}
        >
          <PhoneWrapper>
            <div className="card">
              <div className="btn1" />
              <div className="btn2" />
              <div className="btn3" />
              <div className="btn4" />
              <div 
                className="card-int" 
                ref={cardIntRef}
                onMouseLeave={handleIconLeave}
                style={{
                  background: burst.isActive && burst.type
                    ? `radial-gradient(circle at ${burst.x}px ${burst.y}px, ${burst.color} 0%, ${burst.color}70 20%, ${burst.color}50 40%, ${burst.color}30 60%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.5) 100%)`
                    : undefined,
                  transition: 'background 0.6s ease-out',
                }}
              >
                {/* Top Section - Search Bar and Icons */}
                <div className="top-section">
                  {/* Google Search Bar */}
                  <div className="searchbar-container">
                    <div className="searchbar">
                      <div className="searchbar-wrapper">
                        <div className="searchbar-left">
                          <div className="search-icon-wrapper">
                            <span className="search-icon searchbar-icon">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                              </svg>
                            </span>
                          </div>
                        </div>
                        <div className="searchbar-center">
                          <div className="searchbar-input-spacer">{portfolioUrl}</div>
                          <input 
                            type="text" 
                            className="searchbar-input" 
                            maxLength={2048}
                            name="q"
                            autoCapitalize="off"
                            autoComplete="off"
                            title="Search"
                            role="combobox"
                            value={portfolioUrl}
                            readOnly
                          />
                        </div>
                        <div className="searchbar-right">
                          <svg className="voice-search" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="#4285f4" d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z" />
                            <path fill="#34a853" d="m11 18.08h2v3.92h-2z" />
                            <path fill="#fbbc05" d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z" />
                            <path fill="#ea4335" d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Image */}
                  <div 
                    className="profile-image-container"
                    onClick={(e) => handleIconClick('photo', e)}
                    onMouseEnter={(e) => handleIconHover('photo', e)}
                    onMouseLeave={() => !popup.type && handleIconLeave()}
                    style={{ cursor: 'pointer' }}
                  >
                    <img 
                      src={personalInfo.profileImage || animePhoto} 
                      alt={`${personalInfo.name} profile photo`}
                      className="profile-image"
                    />
                  </div>
                </div>

                {/* Apps Grid */}
                <div className="apps-container">
                  {/* Hidden file inputs for gallery and camera */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      // File selected - gallery opened
                      e.target.value = '';
                    }}
                  />
                  <input
                    type="file"
                    ref={cameraInputRef}
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      // Camera photo taken
                      e.target.value = '';
                    }}
                  />
                  <div className="apps-grid">
                    {appIcons.map((app, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div 
                          className={`app-icon ${app.isContact ? 'contact-app' : ''} ${app.type || ''}`}
                          onClick={(e) => {
                            if (app.type) {
                              handleIconClick(app.type as 'github' | 'linkedin' | 'email' | 'phone', e);
                            } else if (app.appType) {
                              handleAppClick(app.appType);
                            }
                          }}
                          onMouseEnter={(e) => app.type && handleIconHover(app.type as 'github' | 'linkedin' | 'email' | 'phone', e)}
                          onMouseLeave={() => !popup.type && handleIconLeave()}
                          style={{ cursor: (app.type || app.appType) ? 'pointer' : 'default', position: 'relative', zIndex: 10 }}
                        >
                          {app.icon}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Navigation Bar */}
                <div className="nav-bar">
                  <div className="nav-button">
                    <BackIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div className="nav-button">
                    <HomeIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div className="nav-button">
                    <AppsIcon sx={{ fontSize: 20 }} />
                  </div>
                </div>
              </div>
              <div className="top">
                <div className="camera">
                  <div className="int" />
                </div>
                <div className="speaker" />
              </div>
            </div>
          </PhoneWrapper>
        </motion.div>

        {/* Popup Panel */}
        <AnimatePresence>
          {popup.type && popupData && (
            <Box
              sx={{ 
                width: '100%',
                maxWidth: { xs: '100%', lg: '400px' },
                position: { xs: 'relative', lg: 'sticky' },
                top: { lg: '20px' },
                alignSelf: 'flex-start',
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  elevation={12}
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: isDark
                      ? `linear-gradient(135deg, ${popupData.color}15 0%, #1e1e1e 50%, #2d2d2d 100%)`
                      : `linear-gradient(135deg, ${popupData.color}10 0%, #ffffff 50%, #f5f5f5 100%)`,
                    border: `2px solid ${popupData.color}60`,
                    boxShadow: `0 8px 32px ${popupData.color}30`,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `radial-gradient(circle at top right, ${popupData.color}20 0%, transparent 70%)`,
                      pointerEvents: 'none',
                    },
                  }}
                >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${popupData.color} 0%, ${popupData.color}dd 100%)`,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 20px ${popupData.color}50`,
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'rotate(360deg) scale(1.1)',
                        },
                      }}
                    >
                      {popupData.icon}
                    </Box>
                    <Box>
                      <Typography variant="h5" fontWeight={700} sx={{ color: popupData.color, mb: 0.5 }}>
                        {popupData.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        {popup.type === 'photo' ? 'Profile Photo' : 'Contact Information'}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton 
                    onClick={handleClosePopup} 
                    size="small"
                    sx={{
                      color: popupData.color,
                      '&:hover': {
                        backgroundColor: `${popupData.color}20`,
                        transform: 'rotate(90deg)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>

                {popup.type !== 'photo' && (
                  <Box sx={{ 
                    p: 2.5, 
                    borderRadius: 2, 
                    mb: 3, 
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    border: `1px solid ${popupData.color}30`,
                    position: 'relative',
                    zIndex: 1,
                  }}>
                    <Typography variant="body1" color="text.secondary" sx={{ wordBreak: 'break-word', fontSize: '1.1rem' }}>
                      {popupData.content}
                    </Typography>
                  </Box>
                )}

                {popup.type === 'photo' && (
                  <Box sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
                    <img 
                      src={personalInfo.profileImage || animePhoto} 
                      alt={`${personalInfo.name} profile photo`}
                      style={{
                        width: '100%',
                        maxWidth: '300px',
                        borderRadius: '12px',
                        boxShadow: `0 8px 24px ${popupData.color}40`,
                      }}
                    />
                  </Box>
                )}

                {popupData.link && (
                  <motion.a
                    href={popupData.link}
                    target={popup.type === 'email' || popup.type === 'phone' ? '_self' : '_blank'}
                    rel={popup.type === 'email' || popup.type === 'phone' ? '' : 'noopener noreferrer'}
                    style={{
                      display: 'inline-block',
                      padding: '14px 28px',
                      background: `linear-gradient(135deg, ${popupData.color} 0%, ${popupData.color}dd 100%)`,
                      color: 'white',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontWeight: 600,
                      textAlign: 'center',
                      width: '100%',
                      boxSizing: 'border-box',
                      boxShadow: `0 4px 15px ${popupData.color}40`,
                      position: 'relative',
                      zIndex: 1,
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: `0 6px 20px ${popupData.color}60`
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {popup.type === 'email' ? 'Send Email' : 
                     popup.type === 'phone' ? 'Call Now' : 
                     'Visit Profile'}
                  </motion.a>
                )}

                {popup.type === 'phone' && !personalInfo.phone && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                    Phone number not available. Please use email to contact.
                  </Typography>
                )}
                </Paper>
              </motion.div>
            </Box>
          )}
        </AnimatePresence>
      </Box>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
`;

const PhoneWrapper = styled.div`
  .card {
    width: 280px;
    height: 560px;
    background: black;
    border-radius: 35px;
    border: 2px solid rgb(40, 40, 40);
    padding: 7px;
    position: relative;
    box-shadow: 2px 5px 15px rgba(212, 175, 55, 0.9);
  }

  .card-int {
    background-image: linear-gradient(to right bottom, #ff0000, #ff0045, #ff0078, #ea00aa, #b81cd7, #8a3ad6, #5746cf, #004ac2, #003d94, #002e66, #001d3a, #020812);
    background-size: 200% 200%;
    background-position: 0% 0%;
    height: 100%;
    border-radius: 25px;
    transition: all 0.6s ease-out;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .card:hover .card-int {
    background-position: 100% 100%;
  }


  .top {
    position: absolute;
    top: 0px;
    right: 50%;
    transform: translate(50%, 0%);
    width: 35%;
    height: 18px;
    background-color: black;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    z-index: 10;
  }

  .speaker {
    position: absolute;
    top: 2px;
    right: 50%;
    transform: translate(50%, 0%);
    width: 40%;
    height: 2px;
    border-radius: 2px;
    background-color: rgb(20, 20, 20);
    z-index: 11;
  }

  .camera {
    position: absolute;
    top: 6px;
    right: 84%;
    transform: translate(50%, 0%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.048);
    z-index: 11;
  }

  .int {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
    background-color: white;
  }

  .btn1, .btn2, .btn3, .btn4 {
    position: absolute;
    width: 2px;
  }

  .btn1, .btn2, .btn3 {
    height: 45px;
    top: 30%;
    right: -4px;
    background-image: linear-gradient(to right, #111111, #222222, #333333, #464646, #595959);
  }

  .btn2, .btn3 {
    transform: scale(-1);
    left: -4px;
  }

  .btn2, .btn3 {
    transform: scale(-1);
    height: 30px;
  }

  .btn2 {
    top: 26%;
  }

  .btn3 {
    top: 36%;
  }

  .top-section {
    padding: 20px 12px 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    z-index: 5;
  }

  .searchbar-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .searchbar {
    font-size: 14px;
    font-family: arial, sans-serif;
    color: #202124;
    display: flex;
    z-index: 3;
    height: 44px;
    background: white;
    border: 1px solid #dfe1e5;
    box-shadow: none;
    border-radius: 24px;
    margin: 0 auto;
    width: 100%;
    max-width: 240px;
    min-width: 200px;
  }

  .searchbar:hover {
    box-shadow: 0 1px 6px rgb(32 33 36 / 28%);
    border-color: rgba(223,225,229,0);
  }

  .searchbar-wrapper {
    flex: 1;
    display: flex;
    padding: 5px 8px 0 14px;
    align-items: center;
    min-width: 0;
  }

  .searchbar-left {
    font-size: 14px;
    font-family: arial, sans-serif;
    color: #202124;
    display: flex;
    align-items: center;
    padding-right: 8px;
    margin-top: -5px;
    flex-shrink: 0;
  }

  .search-icon-wrapper {
    margin: auto;
  }

  .search-icon {
    margin-top: 3px;
    color: #9aa0a6;
    height: 20px;
    line-height: 20px;
    width: 20px;
  }

  .searchbar-icon {
    display: inline-block;
    fill: currentColor;
    height: 24px;
    line-height: 24px;
    position: relative;
    width: 24px;
  }

  .searchbar-center {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    min-width: 0;
    overflow: hidden;
  }

  .searchbar-input-spacer {
    color: transparent;
    flex: 100%;
    white-space: pre;
    height: 34px;
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .searchbar-input {
    background-color: transparent;
    border: none;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, .87);
    word-wrap: break-word;
    outline: none;
    display: flex;
    flex: 100%;
    margin-top: -37px;
    height: 34px;
    font-size: 11.5px;
    max-width: 100%;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .searchbar-right {
    display: flex;
    flex: 0 0 auto;
    margin-top: -5px;
    align-items: stretch;
    flex-direction: row;
    flex-shrink: 0;
    padding-left: 4px;
  }

  .voice-search {
    flex: 1 0 auto;
    display: flex;
    cursor: pointer;
    align-items: center;
    border: 0;
    background: transparent;
    outline: none;
    padding: 0 8px;
    width: 2.8em;
    flex-shrink: 0;
  }

  .profile-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    margin-top: 8px;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .profile-image-container:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }

  .profile-image {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.1);
  }

  .apps-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 12px 80px 12px;
    overflow-y: auto;
  }

  .apps-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    width: 100%;
    max-width: 220px;
  }

  .app-icon {
    width: 45px;
    height: 45px;
    background-color: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .app-icon:hover {
    background-color: rgba(255, 255, 255, 0.25);
    transform: scale(1.1);
  }

  .app-icon.contact-app {
    background-color: rgba(255, 255, 255, 0.25);
    border: 2px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
    animation: pulse 2s ease-in-out infinite;
  }

  .app-icon.contact-app:hover {
    background-color: rgba(255, 255, 255, 0.35);
    box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
  }

  .app-icon.github:hover {
    background-color: rgba(111, 66, 193, 0.8);
    border-color: rgba(111, 66, 193, 0.9);
    color: white;
  }

  .app-icon.linkedin:hover {
    background-color: rgba(0, 119, 181, 0.8);
    border-color: rgba(0, 119, 181, 0.9);
    color: white;
  }

  .app-icon.email:hover {
    background-color: rgba(255, 107, 53, 0.8);
    border-color: rgba(255, 107, 53, 0.9);
    color: white;
  }

  .app-icon.phone:hover {
    background-color: rgba(52, 168, 83, 0.8);
    border-color: rgba(52, 168, 83, 0.9);
    color: white;
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
    }
    50% {
      box-shadow: 0 4px 20px rgba(255, 255, 255, 0.5);
    }
  }

  .nav-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 0 30px;
    border-radius: 0 0 25px 25px;
    z-index: 10;
  }

  .nav-button {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .nav-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
  }

`;

export default Contact;