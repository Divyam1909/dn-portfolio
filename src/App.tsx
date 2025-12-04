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

  const toggleView = () => {
    setShowUniverseView(prev => {
      const newValue = !prev;
      wasInSimplifiedViewRef.current = !newValue;
      // Update URL hash when view changes
      window.location.hash = newValue ? 'universe' : 'simplified';
      // If switching to universe view, navigate to root
      if (newValue && location.pathname !== '/') {
        navigate('/');
        // Set hash after navigation
        setTimeout(() => {
          window.location.hash = 'universe';
        }, 0);
      }
      return newValue;
    });
  };

  // Update view when location or hash changes
  React.useEffect(() => {
    const hash = window.location.hash;
    const pathname = location.pathname;
    const wasInSimplifiedView = wasInSimplifiedViewRef.current;
    const previousPathname = previousPathnameRef.current;
    
    // If hash explicitly says universe, show universe view
    if (hash === '#universe') {
      setShowUniverseView(true);
      wasInSimplifiedViewRef.current = false;
      previousPathnameRef.current = pathname;
      return;
    }
    
    // If hash explicitly says simplified, show simplified view
    if (hash === '#simplified') {
      setShowUniverseView(false);
      wasInSimplifiedViewRef.current = true;
      previousPathnameRef.current = pathname;
      return;
    }
    
    // If we're on a specific route (not root), show simplified view
    if (pathname !== '/' && pathname !== '') {
      setShowUniverseView(false);
      wasInSimplifiedViewRef.current = true;
      // Set hash when navigating to non-root routes to preserve state on refresh
      if (hash !== '#simplified') {
        window.location.hash = 'simplified';
      }
      previousPathnameRef.current = pathname;
      return;
    }
    
    // If we're navigating to root from a non-root path and were in simplified view, preserve it
    if (pathname === '/' && previousPathname !== '/' && wasInSimplifiedView) {
      setShowUniverseView(false);
      wasInSimplifiedViewRef.current = true;
      window.location.hash = 'simplified';
      previousPathnameRef.current = pathname;
      return;
    }
    
    // Default to universe view only on root path with no hash
    setShowUniverseView(true);
    wasInSimplifiedViewRef.current = false;
    previousPathnameRef.current = pathname;
  }, [location.pathname]);

  // Listen for hash changes (browser back/forward)
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const pathname = location.pathname;
      
      // If hash explicitly says universe, show universe view
      if (hash === '#universe') {
        setShowUniverseView(true);
        wasInSimplifiedViewRef.current = false;
        return;
      }
      
      // If hash explicitly says simplified, show simplified view
      if (hash === '#simplified') {
        setShowUniverseView(false);
        wasInSimplifiedViewRef.current = true;
        return;
      }
      
      // If we're on a specific route (not root), show simplified view
      if (pathname !== '/' && pathname !== '') {
        setShowUniverseView(false);
        wasInSimplifiedViewRef.current = true;
        return;
      }
      
      // Default to universe view only on root path
      setShowUniverseView(true);
      wasInSimplifiedViewRef.current = false;
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
        <Route path="/*" element={
          showUniverseView ? (
            <UniverseView toggleView={() => {
              setLastPathFromUniverseView(null);
              toggleView();
            }} />
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
        } />
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
