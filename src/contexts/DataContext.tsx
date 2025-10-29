import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import portfolioData from '../data/portfolioData';
import { database } from '../services/database';
import { GuideSettings, defaultGuideSettings } from '../utils/storage';
import { portfolioAPI } from '../services/api';

// Define context shape with precise typing
interface DataContextType {
  data: typeof portfolioData;
  guideSettings: GuideSettings;
  updateGuideSettings: (settings: Partial<GuideSettings>) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

// Create context with default values
const DataContext = createContext<DataContextType>({
  data: portfolioData,
  guideSettings: defaultGuideSettings,
  updateGuideSettings: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
  loading: false,
  error: null,
  refreshData: async () => {},
});

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Initialize with data from portfolioData.ts as fallback
  const [data, setData] = useState(portfolioData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize with defaults that will be replaced with stored values
  const [guideSettings, setGuideSettings] = useState<GuideSettings>({ 
    ...defaultGuideSettings,
    selectedCharacter: (
      portfolioData.characterSettings.defaultCharacter === 'robot' 
        ? 'dog' 
        : portfolioData.characterSettings.defaultCharacter
    ) as 'dog' | 'cat' | 'rabbit' | 'hamster' | 'fox',
  });
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Fetch portfolio data from backend
  const fetchPortfolioData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await portfolioAPI.getAll();
      if (response.data.success) {
        // Merge API data with local portfolioData structure
        setData({
          ...portfolioData,
          ...response.data.data,
        });
      }
    } catch (err: any) {
      console.error('Error fetching portfolio data:', err);
      setError(err.message || 'Failed to load portfolio data');
      // Keep using fallback data from portfolioData.ts
    } finally {
      setLoading(false);
    }
  };

  // Refresh data function
  const refreshData = async () => {
    await fetchPortfolioData();
  };

  // Load portfolio data and settings on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load both settings and portfolio data in parallel
        const [savedGuideSettings, userPrefs] = await Promise.all([
          database.getGuideSettings(),
          database.getUserPreferences(),
          fetchPortfolioData(), // Fetch from backend
        ]);
        
        if (savedGuideSettings) {
          setGuideSettings(savedGuideSettings);
        }
        
        setIsDarkMode(userPrefs.themeMode === 'dark');
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Update guide settings and save to database
  const updateGuideSettings = (settings: Partial<GuideSettings>) => {
    const newSettings = { ...guideSettings, ...settings };
    // Only update if something changed
    if (JSON.stringify(guideSettings) !== JSON.stringify(newSettings)) {
      setGuideSettings(newSettings);
      database.saveGuideSettings(newSettings)
        .catch(error => console.error('Failed to save guide settings:', error));
    }
  };
  
  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      database.saveUserPreferences({
        themeMode: newMode ? 'dark' : 'light',
        guideSettings
      }).catch(error => console.error('Failed to save theme preference:', error));
      return newMode;
    });
  };
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    data,
    guideSettings,
    updateGuideSettings,
    isDarkMode,
    toggleDarkMode,
    loading,
    error,
    refreshData
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [data, guideSettings, isDarkMode, loading, error]);
  
  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook for using the context
export const usePortfolioData = () => useContext(DataContext);

export default DataContext; 