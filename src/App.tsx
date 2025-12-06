import React, { Suspense, lazy } from 'react';
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
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Resume = lazy(() => import('./pages/Resume'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
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

// Component that handles routing logic - must be inside Router
type ToggleViewOptions = {
  /** When toggling from universe -> simplified, keep the current history entry unchanged. */
  preserveCurrentHash?: boolean;
};

const RoutingHandler: React.FC<{
  toggleTheme: () => void;
}> = ({ toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = usePortfolioData();
  const { interactiveFeatures } = data;
  const { enableParticles } = interactiveFeatures;
  
  // Determine initial view based on hash and pathname
  const getInitialView = () => {
    const hash = window.location.hash;
    const pathname = location.pathname;
    
    // If hash explicitly says universe, show universe view
    if (hash === '#universe') {
      return true;
    }
    
    // If hash explicitly says simplified, show simplified view
    if (hash === '#simplified') {
      return false;
    }
    
    // If we're on a specific route (not root), show simplified view
    // This ensures /contact, /about, etc. stay on those pages after refresh
    if (pathname !== '/' && pathname !== '') {
      return false;
    }
    
    // Default to universe view only on root path with no hash
    return true;
  };
  
  const [showUniverseView, setShowUniverseView] = React.useState(getInitialView);
  const [lastPathFromUniverseView, setLastPathFromUniverseView] = React.useState<string | null>(null);
  const previousPathnameRef = React.useRef<string>(location.pathname);
  const wasInSimplifiedViewRef = React.useRef<boolean>(!getInitialView());
  const isUpdatingHashRef = React.useRef<boolean>(false); // Track when we're programmatically updating hash

  // Replace hash without creating a new history entry
  const setHashWithoutHistory = React.useCallback(
    (hash: string | null, pathOverride?: string) => {
      const basePath = pathOverride ?? `${window.location.pathname}${window.location.search}`;
      const url = hash ? `${basePath}#${hash}` : basePath;
      window.history.replaceState(null, '', url);
    },
    []
  );

  const toggleView = (options?: ToggleViewOptions) => {
    setShowUniverseView(prev => {
      const newValue = !prev;
      wasInSimplifiedViewRef.current = !newValue;
      // Mark that we're updating hash programmatically to prevent hashchange handler from running
      isUpdatingHashRef.current = true;
      const skipHashUpdateOnCurrentEntry = options?.preserveCurrentHash && !newValue;
      // Update URL hash when view changes, unless we want to preserve the current entry (universe -> simplified navigation)
      if (!skipHashUpdateOnCurrentEntry) {
        setHashWithoutHistory(newValue ? 'universe' : 'simplified');
      }
      // Reset flag after a brief delay
      setTimeout(() => {
        isUpdatingHashRef.current = false;
      }, 50);
      return newValue;
    });
  };

  // Navigate to root after toggling to universe to avoid setState during render/updater
  React.useEffect(() => {
    if (showUniverseView && location.pathname !== '/') {
      navigate('/', { replace: true });
      // Set hash after navigation
      setTimeout(() => {
        isUpdatingHashRef.current = true;
        setHashWithoutHistory('universe', '/');
        setTimeout(() => {
          isUpdatingHashRef.current = false;
        }, 50);
      }, 0);
    }
  }, [showUniverseView, location.pathname, navigate, setHashWithoutHistory]);

  // Update view when location or hash changes
  React.useEffect(() => {
    const hash = window.location.hash;
    const pathname = location.pathname;
    const wasInSimplifiedView = wasInSimplifiedViewRef.current;
    const previousPathname = previousPathnameRef.current;
    
    // Determine what the view should be
    let shouldShowUniverse = false;
    
    // If hash explicitly says universe, show universe view
    if (hash === '#universe') {
      shouldShowUniverse = true;
    }
    // If hash explicitly says simplified, show simplified view
    else if (hash === '#simplified') {
      shouldShowUniverse = false;
    }
    // If we're on a specific route (not root), show simplified view
    else if (pathname !== '/' && pathname !== '') {
      shouldShowUniverse = false;
      // Set hash when navigating to non-root routes to preserve state on refresh
      if (hash !== '#simplified' && !isUpdatingHashRef.current) {
        isUpdatingHashRef.current = true;
        setHashWithoutHistory('simplified');
        setTimeout(() => {
          isUpdatingHashRef.current = false;
        }, 50);
      }
    }
    // If we're navigating to root from a non-root path and were in simplified view, preserve it
    else if (pathname === '/' && previousPathname !== '/' && wasInSimplifiedView) {
      shouldShowUniverse = false;
      if (!isUpdatingHashRef.current) {
        isUpdatingHashRef.current = true;
        setHashWithoutHistory('simplified');
        setTimeout(() => {
          isUpdatingHashRef.current = false;
        }, 50);
      }
    }
    // Default to universe view only on root path with no hash
    else {
      shouldShowUniverse = true;
    }
    
    // Only update state if it actually changed to avoid unnecessary re-renders
    setShowUniverseView(prev => {
      if (prev === shouldShowUniverse) {
        // Still update refs even if state doesn't change
        wasInSimplifiedViewRef.current = !shouldShowUniverse;
        previousPathnameRef.current = pathname;
        return prev;
      }
      wasInSimplifiedViewRef.current = !shouldShowUniverse;
      previousPathnameRef.current = pathname;
      return shouldShowUniverse;
    });
  }, [location.pathname]);

  // Listen for hash changes (browser back/forward)
  React.useEffect(() => {
    const handleHashChange = () => {
      // Skip if we're programmatically updating the hash to prevent circular updates
      if (isUpdatingHashRef.current) {
        return;
      }

      // Defer state updates to next frame to avoid blocking the event handler
      requestAnimationFrame(() => {
        const hash = window.location.hash;
        const pathname = location.pathname;
        
        // Determine what the view should be
        let shouldShowUniverse = false;
        
        // If hash explicitly says universe, show universe view
        if (hash === '#universe') {
          shouldShowUniverse = true;
        }
        // If hash explicitly says simplified, show simplified view
        else if (hash === '#simplified') {
          shouldShowUniverse = false;
        }
        // If we're on a specific route (not root), show simplified view
        else if (pathname !== '/' && pathname !== '') {
          shouldShowUniverse = false;
        }
        // Default to universe view only on root path
        else {
          shouldShowUniverse = true;
        }
        
        // Only update state if it actually changed to avoid unnecessary re-renders
        setShowUniverseView(prev => {
          if (prev === shouldShowUniverse) {
            return prev; // No change needed
          }
          wasInSimplifiedViewRef.current = !shouldShowUniverse;
          return shouldShowUniverse;
        });
      });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [location.pathname]);

  return (
    <>
      {enableParticles && (
        <Suspense fallback={null}>
          <BackgroundParticles />
        </Suspense>
      )}
      
      <Routes>
        {/* Conditional rendering for Universe View or Portfolio */}
        <Route
          path="/*"
          element={
            showUniverseView ? (
              <UniverseView
                toggleView={(options) => {
                  setLastPathFromUniverseView(null);
                  toggleView(options);
                }}
              />
            ) : (
              <Layout
                toggleTheme={toggleTheme}
                toggleView={toggleView}
                setLastPathFromUniverseView={setLastPathFromUniverseView}
                lastPathFromUniverseView={lastPathFromUniverseView}
              >
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="resume" element={<Resume />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="contact" element={<Contact />} />
                </Routes>
              </Layout>
            )
          }
        />
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
