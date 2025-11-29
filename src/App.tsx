import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

// Wrapper component to conditionally render features that need access to DataContext
const AppContent: React.FC = () => {
  const { data } = usePortfolioData();
  const { interactiveFeatures } = data;
  const { enableParticles } = interactiveFeatures;
  const { theme, toggleTheme } = useThemeToggle();
  
  // Check hash on initial load - default to UNIVERSE view
  const getInitialView = () => {
    const hash = window.location.hash;
    // Show universe view by default, unless explicitly set to #simplified
    if (hash === '#simplified') {
      return false;
    }
    return true; // Default to universe view
  };
  
  const [showUniverseView, setShowUniverseView] = React.useState(getInitialView);
  const [lastPathFromUniverseView, setLastPathFromUniverseView] = React.useState<string | null>(null);

  const toggleView = () => {
    setShowUniverseView(prev => {
      const newValue = !prev;
      // Update URL hash when view changes
      window.location.hash = newValue ? 'universe' : 'simplified';
      return newValue;
    });
  };

  // Listen for hash changes (e.g., browser back/forward)
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setShowUniverseView(hash === '#universe');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Render BackgroundParticles if enabled */}
      {enableParticles && (
        <Suspense fallback={null}>
          <BackgroundParticles />
        </Suspense>
      )}
      
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Conditional rendering for Universe View or Portfolio */}
            <Route path="/*" element={
              showUniverseView ? (
                <UniverseView toggleView={() => {
                  setLastPathFromUniverseView(null);
                  toggleView();
                }} /> // Pass toggleView to UniverseView
              ) : (
                <Layout toggleTheme={toggleTheme} toggleView={toggleView} setLastPathFromUniverseView={setLastPathFromUniverseView} lastPathFromUniverseView={lastPathFromUniverseView}> {/* Pass toggleView to Layout */}
                  <Routes>
                    <Route index element={<Home />} /> {/* Changed to index route */}
                    <Route path="about" element={<About />} />
                    <Route path="resume" element={<Resume />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="contact" element={<Contact />} />
                  </Routes>
                </Layout>
              )
            } />
          </Routes>
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
