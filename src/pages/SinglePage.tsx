import React, { useCallback, useEffect, useMemo, useRef } from 'react';
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

  // Prevent the browser from restoring scroll position on refresh/back-forward.
  // We manage scroll explicitly based on the route.
  useEffect(() => {
    try {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    } catch {
      // no-op (some browsers / iframes can throw)
    }
  }, []);

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

  // When the observer updates the URL based on scroll position, we do NOT want
  // the "URL change -> scrollIntoView" effect to run (it causes fighting/jank).
  const skipScrollRef = useRef(false);

  // Lock to prevent the observer from updating the URL while a smooth scroll is
  // happening due to a user navigation (clicking a link / using back/forward).
  const isManualScrolling = useRef(false);
  const manualScrollUnlockTimeoutRef = useRef<number | null>(null);
  const manualScrollUnlockIntervalRef = useRef<number | null>(null);
  const scrollSpyDebounceTimeoutRef = useRef<number | null>(null);
  const lastScrollSpySectionRef = useRef<SectionKey | null>(null);

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

  const scrollToSection = useCallback(
    (section: SectionKey, behavior: ScrollBehavior = 'smooth') => {
      if (section === 'home') {
        window.scrollTo({ top: 0, behavior });
        return;
      }

      const target = sectionRefs[section]?.current;
      if (!target) return;
      target.scrollIntoView({
        behavior,
        block: 'start',
      });
    },
    [sectionRefs]
  );

  // On initial mount / refresh, do a non-smooth jump to the section.
  // This avoids scroll-spy + smooth-scroll timing issues that can land you
  // near the wrong section after a reload.
  const isFirstScrollRef = useRef(true);
  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }

    const section = pathToSection(location.pathname);
    const behavior: ScrollBehavior = isFirstScrollRef.current ? 'auto' : 'smooth';
    isFirstScrollRef.current = false;

    // Treat a route change as a "manual navigation" and temporarily lock the
    // scroll observer so it doesn't fight the smooth scroll animation.
    isManualScrolling.current = true;
    if (manualScrollUnlockTimeoutRef.current) {
      window.clearTimeout(manualScrollUnlockTimeoutRef.current);
    }
    if (manualScrollUnlockIntervalRef.current) {
      window.clearInterval(manualScrollUnlockIntervalRef.current);
      manualScrollUnlockIntervalRef.current = null;
    }
    if (scrollSpyDebounceTimeoutRef.current) {
      window.clearTimeout(scrollSpyDebounceTimeoutRef.current);
      scrollSpyDebounceTimeoutRef.current = null;
    }

    // Unlock when scrolling settles (more reliable than a fixed timeout).
    let lastY = window.scrollY;
    let stableTicks = 0;
    let elapsed = 0;
    manualScrollUnlockIntervalRef.current = window.setInterval(() => {
      const y = window.scrollY;
      // Consider scroll "settled" if it hasn't changed meaningfully for ~200ms.
      if (Math.abs(y - lastY) < 2) {
        stableTicks += 1;
      } else {
        stableTicks = 0;
      }
      lastY = y;
      elapsed += 50;

      if (stableTicks >= 4 || elapsed >= 2000) {
        if (manualScrollUnlockIntervalRef.current) {
          window.clearInterval(manualScrollUnlockIntervalRef.current);
          manualScrollUnlockIntervalRef.current = null;
        }
        isManualScrolling.current = false;
      }
    }, 50);

    const timer = window.setTimeout(() => {
      scrollToSection(section, behavior);
    }, 50);

    return () => window.clearTimeout(timer);
  }, [location.pathname, scrollToSection]);

  useEffect(() => {
    // Legacy support: "/resume#skills" -> "/resume?resume=skills"
    if (location.pathname === '/resume' && location.hash) {
      const legacy = location.hash.replace('#', '').toLowerCase();
      const allowed = new Set(['experience', 'education', 'skills', 'certifications']);
      if (allowed.has(legacy)) {
        const params = new URLSearchParams(location.search);
        params.set('resume', legacy);
        navigate({ pathname: '/resume', search: `?${params.toString()}` }, { replace: true });
      }
    }
  }, [location.pathname, location.search, location.hash, navigate]);

  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      // Use a single threshold. 0.5 means the middle of the section must be visible.
      // This reduces churn and avoids the old 21-threshold "jank".
      threshold: 0.5,
      // Adding a margin helps prevent "fighting" near section edges.
      rootMargin: '-10% 0px -10% 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      // If we are currently scrolling because a user clicked a nav link (or used
      // back/forward), DON'T update the URL based on scroll position.
      if (isManualScrolling.current) return;

      const intersecting = entries.filter((e) => e.isIntersecting);
      if (!intersecting.length) return;

      // If multiple sections intersect, choose the one most visible.
      const best = intersecting.reduce((a, b) =>
        b.intersectionRatio > a.intersectionRatio ? b : a
      );

      const sectionKey = best.target.getAttribute('data-section') as SectionKey | null;
      if (!sectionKey) return;

      // Debounce scroll-spy updates so UI-driven layout shifts (like accordions)
      // don't cause rapid URL changes.
      if (lastScrollSpySectionRef.current !== sectionKey) {
        lastScrollSpySectionRef.current = sectionKey;
      }

      if (scrollSpyDebounceTimeoutRef.current) {
        window.clearTimeout(scrollSpyDebounceTimeoutRef.current);
      }

      scrollSpyDebounceTimeoutRef.current = window.setTimeout(() => {
        if (isManualScrolling.current) return;

        const currentSection = lastScrollSpySectionRef.current;
        if (!currentSection) return;

        const basePath = currentSection === 'home' ? '/' : `/${currentSection}`;
        const nextSearch = currentSection === 'resume' ? location.search : '';
        const nextUrl = `${basePath}${nextSearch}`;
        const currentUrl = `${location.pathname}${location.search}`;

        // Only navigate if the path actually changed to avoid redundant re-renders
        if (currentUrl !== nextUrl) {
          // Prevent the "URL change -> scrollIntoView" effect from firing for
          // scroll-driven URL updates.
          skipScrollRef.current = true;
          // Use { replace: true } to keep the browser history clean
          navigate(nextUrl, { replace: true });
        }
      }, 120);
    }, observerOptions);

    // Register all refs
    [homeRef, aboutRef, resumeRef, projectsRef, contactRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => {
      observer.disconnect();
      if (scrollSpyDebounceTimeoutRef.current) {
        window.clearTimeout(scrollSpyDebounceTimeoutRef.current);
      }
    };
  }, [location.pathname, location.search, navigate]);

  useEffect(() => {
    return () => {
      if (manualScrollUnlockTimeoutRef.current) {
        window.clearTimeout(manualScrollUnlockTimeoutRef.current);
      }
      if (manualScrollUnlockIntervalRef.current) {
        window.clearInterval(manualScrollUnlockIntervalRef.current);
      }
    };
  }, []);

  const sectionProps = {
    sx: {
      scrollMarginTop: { xs: theme.spacing(10), md: theme.spacing(12) },
      width: '100%',
      minHeight: '60vh',
    },
  };

  const BlackHoleSeparator: React.FC = () => {
    // Keep original yellow/orange separator palette (not theme-driven).
    const lineColor = 'rgba(255, 180, 50, 0.8)';
    const glowColor = 'rgba(255, 100, 0, 0.4)';
    const ringColor = 'rgba(255, 180, 50, 0.7)';

    return (
      <Box
        aria-hidden="true"
        sx={{
          position: 'relative',
          width: '100%',
          // Separator-only: keep compact height, no background panel.
          height: { xs: 90, md: 110 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          cursor: 'default',
          '@keyframes bhPulse': {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.5 },
            '50%': { transform: 'scale(1.1)', opacity: 0.7 },
          },
          '@keyframes bhSpin': {
            from: { transform: 'rotateX(78deg) rotateZ(0deg)' },
            to: { transform: 'rotateX(78deg) rotateZ(360deg)' },
          },
          '& .bh-line-container': {
            position: 'absolute',
            width: '100%',
            height: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
            pointerEvents: 'none',
          },
          '& .bh-line-segment': {
            flex: 1,
            height: '2px',
            boxShadow: `0 0 12px ${glowColor}`,
          },
          '& .bh-line-left': {
            background: `linear-gradient(90deg, transparent 0%, ${lineColor} 100%)`,
          },
          '& .bh-line-right': {
            background: `linear-gradient(90deg, ${lineColor} 0%, transparent 100%)`,
          },
          '& .bh-gap': {
            width: { xs: 72, md: 96 },
            flexShrink: 0,
          },
          '& .bh-core-wrap': {
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '& .bh-lensing': {
            position: 'absolute',
            width: { xs: 110, md: 130 },
            height: { xs: 110, md: 130 },
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255, 100, 0, 0.12) 0%, transparent 70%)',
            filter: 'blur(22px)',
            animation: 'bhPulse 5s ease-in-out infinite',
            opacity: 0.55,
          },
          '& .bh-disk': {
            position: 'absolute',
            width: { xs: 64, md: 72 },
            height: { xs: 64, md: 72 },
            borderRadius: '50%',
            border: `1.5px solid ${ringColor}`,
            boxShadow: `0 0 20px rgba(255, 150, 0, 0.5), inset 0 0 20px rgba(255, 150, 0, 0.3)`,
            transform: 'rotateX(78deg)',
            animation: 'bhSpin 12s linear infinite',
          },
          '& .bh-event-horizon': {
            position: 'absolute',
            width: { xs: 32, md: 36 },
            height: { xs: 32, md: 36 },
            borderRadius: '50%',
            background: '#000',
            border: '1.5px solid #fff',
            boxShadow: '0 0 8px #fff, 0 0 25px #ff7b00, 0 0 60px #ff4800',
            zIndex: 5,
          },
          '& .bh-singularity': {
            position: 'absolute',
            width: { xs: 28, md: 32 },
            height: { xs: 28, md: 32 },
            borderRadius: '50%',
            background: '#000',
            zIndex: 6,
          },
        }}
      >
        <Box className="bh-line-container">
          <Box className="bh-line-segment bh-line-left" />
          <Box className="bh-gap" />
          <Box className="bh-line-segment bh-line-right" />
        </Box>

        <Box className="bh-core-wrap">
          <Box className="bh-lensing" />
          <Box className="bh-disk" />
          <Box className="bh-event-horizon" />
          <Box className="bh-singularity" />
        </Box>
      </Box>
    );
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
                    : key === 'projects'
                      ? { xs: 0, md: 0 }
                      : ({ xs: 4, md: 7 } as const),
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  // Keep sections static to prevent UI instability during
                  // dynamic height changes (e.g., accordions expanding).
                  opacity: 1,
                  transform: 'none',
                }}
              >
                {/* Section Title with Gradient Effect */}
                <Box
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    mb: key === 'projects' ? { xs: 0.5, md: 1 } : { xs: 2.5, md: 3.5 },
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
                    mt: key === 'projects' ? { xs: 0, md: 0 } : { xs: 1, md: 2 },
                    position: 'relative',
                  }}
                >
                  <Component />
                </Box>
              </Box>
            </Box>

            {/* Black Hole Separator */}
            {index < sections.length - 1 && (
              <Box
                sx={{
                  width: '100%',
                  px: { xs: 0, md: 0 },
                  py: { xs: 0, md: 1 },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <BlackHoleSeparator />
              </Box>
            )}
          </React.Fragment>
        );
      })}
    </Box>
  );
};

export default SinglePage;