import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { useThemeToggle } from './hooks/useThemeToggle';
import { DataProvider, usePortfolioData } from './contexts/DataContext';
import { queryClient } from './lib/queryClient';

// Components (loaded eagerly)
import Layout from './components/Layout';

// Lazy-loaded components for better performance
const BackgroundParticles = lazy(() => import('./components/BackgroundParticles'));
const SinglePage = lazy(() => import('./pages/SinglePage'));
const UniverseView = lazy(() => import('./pages/UniverseView'));

// Loading fallback
const LoadingFallback = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <CircularProgress />
  </Box>
);

const RoutingHandler: React.FC<{
  toggleTheme: () => void;
}> = ({ toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = usePortfolioData();
  const { interactiveFeatures } = data;
  const { enableParticles } = interactiveFeatures;

  // On first site load, default "/" to Universe View.
  // This preserves the simplified view at "/" for later navigation, while making the
  // initial landing experience the Universe page.
  const isFirstLoadRef = useRef(true);
  useEffect(() => {
    if (!isFirstLoadRef.current) return;
    isFirstLoadRef.current = false;

    const hash = window.location.hash;
    if (location.pathname === '/' && !hash) {
      navigate('/universe', { replace: true, state: { from: '/' } });
    }
  }, [location.pathname, navigate]);

  // Backwards-compatible redirects:
  // - "/#universe"  -> "/universe"
  // - "/resume#skills" -> "/resume?resume=skills"
  useEffect(() => {
    const applyLegacyRedirects = () => {
      const hash = window.location.hash;

      // Legacy view-mode hash.
      if (hash === '#universe' && location.pathname !== '/universe') {
        navigate('/universe', { replace: true });
        return;
      }

      // Legacy resume tab hash.
      if (location.pathname === '/resume') {
        const legacy = hash?.replace('#', '').toLowerCase();
        const allowed = new Set(['experience', 'education', 'skills', 'certifications']);
        if (legacy && allowed.has(legacy)) {
          const params = new URLSearchParams(location.search);
          params.set('resume', legacy);
          navigate({ pathname: '/resume', search: `?${params.toString()}` }, { replace: true });
        }
      }
    };

    // Apply once on mount / path change.
    applyLegacyRedirects();

    // Also handle hash changes while the SPA is already running.
    window.addEventListener('hashchange', applyLegacyRedirects);
    return () => window.removeEventListener('hashchange', applyLegacyRedirects);
  }, [location.pathname, location.search, navigate]);

  const lastSimplifiedPathRef = useRef<string>('/');
  useEffect(() => {
    if (location.pathname !== '/universe') {
      lastSimplifiedPathRef.current = `${location.pathname}${location.search}`;
    }
  }, [location.pathname, location.search]);

  const goToUniverse = useCallback(() => {
    // Capture the current route at click time (more reliable than relying on
    // a ref that may be updated by scroll-spy during smooth scroll).
    const from = `${location.pathname}${location.search}` || lastSimplifiedPathRef.current || '/';
    navigate('/universe', { state: { from } });
  }, [location.pathname, location.search, navigate]);

  const goToSimplified = useCallback(
    (routeOverride?: string) => {
      const from = (location.state as any)?.from as string | undefined;
      const destination = routeOverride ?? from ?? lastSimplifiedPathRef.current ?? '/';
      navigate(destination);
    },
    [location.state, navigate]
  );

  const universeElement = useMemo(
    () => (
      <Suspense fallback={<LoadingFallback />}>
        <UniverseView
          // If invoked without a route, go back to the last simplified path.
          toggleView={() => goToSimplified()}
          // Allow UniverseView to jump to specific simplified routes (planet clicks).
          navigateToRoute={(route) => goToSimplified(route)}
        />
      </Suspense>
    ),
    [goToSimplified]
  );

  const simplifiedElement = useMemo(
    () => (
      <Layout
        toggleTheme={toggleTheme}
        toggleView={goToUniverse}
        setLastPathFromUniverseView={() => {}}
        lastPathFromUniverseView={null}
      >
        <SinglePage />
      </Layout>
    ),
    [goToUniverse, toggleTheme]
  );

  return (
    <>
      {enableParticles && (
        <Suspense fallback={null}>
          <BackgroundParticles />
        </Suspense>
      )}
      
      <Routes>
        <Route path="/universe" element={universeElement} />
        <Route path="/*" element={simplifiedElement} />
      </Routes>
    </>
  );
};

// Wrapper component to conditionally render features that need access to DataContext
const AppContent: React.FC = () => {
  const { theme, toggleTheme } = useThemeToggle();
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <RoutingHandler toggleTheme={toggleTheme} />
        </Suspense>
      </Router>
    </ThemeProvider>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </QueryClientProvider>
  );
};

export default App;
