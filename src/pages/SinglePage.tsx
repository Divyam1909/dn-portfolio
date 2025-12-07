import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import Home from './Home';
import About from './About';
import Resume from './Resume';
import Projects from './Projects';
import Contact from './Contact';

type SectionKey = 'home' | 'about' | 'resume' | 'projects' | 'contact';

const sectionOrder: SectionKey[] = ['home', 'about', 'resume', 'projects', 'contact'];

type SectionDefinition = {
  key: SectionKey;
  label: string;
  Component: React.ComponentType;
  ref: React.RefObject<HTMLDivElement | null>;
};

const pathToSection = (pathname: string): SectionKey => {
  switch (pathname.toLowerCase()) {
    case '/about':
      return 'about';
    case '/resume':
      return 'resume';
    case '/projects':
      return 'projects';
    case '/contact':
      return 'contact';
    default:
      return 'home';
  }
};

const SinglePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const homeRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useMemo(
    () => ({
      home: homeRef,
      about: aboutRef,
      resume: resumeRef,
      projects: projectsRef,
      contact: contactRef,
    }),
    []
  );

  const skipScrollRef = useRef(false);

  const sections = useMemo<SectionDefinition[]>(
    () => [
      { key: 'home', label: 'Home', Component: Home, ref: sectionRefs.home },
      { key: 'about', label: 'About', Component: About, ref: sectionRefs.about },
      { key: 'resume', label: 'Resume', Component: Resume, ref: sectionRefs.resume },
      { key: 'projects', label: 'Projects', Component: Projects, ref: sectionRefs.projects },
      { key: 'contact', label: 'Contact', Component: Contact, ref: sectionRefs.contact },
    ],
    [sectionRefs]
  );

  const [sectionVisibility, setSectionVisibility] = useState<Record<SectionKey, number>>(() =>
    sectionOrder.reduce(
      (acc, key) => ({
        ...acc,
        [key]: 0,
      }),
      {} as Record<SectionKey, number>
    )
  );
  const [activeSection, setActiveSection] = useState<SectionKey>(() => pathToSection(location.pathname));

  const scrollToSection = useCallback(
    (section: SectionKey) => {
      if (section === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = sectionRefs[section]?.current;
      if (!target) return;
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    },
    [sectionRefs]
  );

  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }

    const section = pathToSection(location.pathname);
    const timer = window.setTimeout(() => {
      scrollToSection(section);
    }, 50);

    return () => window.clearTimeout(timer);
  }, [location.pathname, scrollToSection]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target.getAttribute('data-section') as SectionKey | null;
          if (!section) return;

          // Calculate visibility ratio (0 to 1) based on intersection ratio
          const visibilityRatio = Math.min(entry.intersectionRatio * 1.5, 1);
          
          setSectionVisibility((prev) => {
            if (prev[section] !== visibilityRatio) {
              return { ...prev, [section]: visibilityRatio };
            }
            return prev;
          });
        });
      },
      {
        threshold: Array.from({ length: 21 }, (_, i) => i * 0.05), // 0, 0.05, 0.1, ..., 1
        rootMargin: '-5% 0px -5% 0px',
      }
    );

    sectionOrder.forEach((key) => {
      const target = sectionRefs[key]?.current;
      if (target) observer.observe(target);
    });

    return () => observer.disconnect();
  }, [sectionRefs]);

  useEffect(() => {
    const visibilityEntries = Object.entries(sectionVisibility) as [SectionKey, number][];
    if (!visibilityEntries.length) return;

    const [nextSection, visibility] = visibilityEntries.reduce<[SectionKey, number]>(
      (max, entry) => (entry[1] > max[1] ? entry : max),
      visibilityEntries[0]
    );

    if (visibility <= 0) return;
    if (nextSection !== activeSection) {
      setActiveSection(nextSection);
    }
  }, [sectionVisibility, activeSection]);

  useEffect(() => {
    const currentSection = pathToSection(location.pathname);
    if (activeSection === currentSection) return;

    const basePath = activeSection === 'home' ? '/' : `/${activeSection}`;
    const hash = activeSection === 'resume' ? location.hash : '';
    const nextUrl = `${basePath}${hash}`;

    skipScrollRef.current = true;
    navigate(nextUrl, { replace: true });
  }, [activeSection, location.pathname, location.hash, navigate]);

  const sectionProps = {
    sx: {
      scrollMarginTop: { xs: theme.spacing(10), md: theme.spacing(12) },
      width: '100%',
      minHeight: '60vh',
    },
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        pb: 0,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 50%, ${theme.palette.primary.main}08 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, ${theme.palette.secondary.main}08 0%, transparent 50%)`,
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      {sections.map((section, index) => {
        const { key, label, Component, ref } = section;
        const visibility = sectionVisibility[key];
        const opacity = Math.pow(visibility, 0.7); // Smooth easing
        const translateY = (1 - visibility) * 40;
        const scale = 0.95 + visibility * 0.05;

        return (
          <React.Fragment key={key}>
            <Box
              id={key}
              ref={ref}
              data-section={key}
              {...sectionProps}
              sx={{
                ...sectionProps.sx,
                position: 'relative',
                px: key === 'about' ? { xs: 2, md: 4 } : { xs: 3, md: 6 },
                pt: { xs: 4, md: 7 },
                pb:
                  key === 'home' || key === 'contact'
                    ? 0
                    : ({ xs: 4, md: 7 } as const),
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  opacity: opacity,
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
                  willChange: 'opacity, transform',
                }}
              >
                {/* Section Title with Gradient Effect */}
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    mb: { xs: 2.5, md: 3.5 },
                  }}
                >
                  <Typography
                    variant="h3"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '2rem', md: '2.75rem', lg: '3.25rem' },
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.primary.main} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      position: 'relative',
                      textAlign: 'center',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '84%',
                        height: '3px',
                        background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
                        borderRadius: '999px',
                        boxShadow: `0 0 16px ${theme.palette.primary.main}60`,
                      },
                    }}
                  >
                    {label}
                  </Typography>
                </Box>

                {/* Content Container */}
                <Box
                  sx={{
                    mt: { xs: 1, md: 2 },
                    position: 'relative',
                  }}
                >
                  <Component />
                </Box>
              </Box>
            </Box>

            {/* Modern Section Divider */}
            {index < sections.length - 1 && (
              <Box
                sx={{
                  width: '100%',
                  px: { xs: 3, md: 6 },
                  py: { xs: 1, md: 2 },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '800px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Gradient Line */}
                  <Box
                    sx={{
                      position: 'absolute',
                      width: '100%',
                      height: '2px',
                      background: `linear-gradient(90deg, 
                        transparent 0%, 
                        ${theme.palette.primary.main}40 25%,
                        ${theme.palette.primary.main} 50%,
                        ${theme.palette.primary.main}40 75%,
                        transparent 100%)`,
                      boxShadow: `0 0 20px ${theme.palette.primary.main}30`,
                      borderRadius: '999px',
                    }}
                  />
                  
                  {/* Center Dot */}
                  <Box
                    sx={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: theme.palette.primary.main,
                      boxShadow: `0 0 24px ${theme.palette.primary.main}80,
                                  inset 0 0 8px ${theme.palette.primary.light}`,
                      zIndex: 1,
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      '@keyframes pulse': {
                        '0%, 100%': {
                          opacity: 1,
                          transform: 'scale(1)',
                        },
                        '50%': {
                          opacity: 0.8,
                          transform: 'scale(1.1)',
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default SinglePage;