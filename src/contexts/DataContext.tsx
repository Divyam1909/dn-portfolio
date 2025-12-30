import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import portfolioData from '../data/portfolioData';
import { database } from '../services/database';
import { GuideSettings, defaultGuideSettings } from '../utils/storage';

// Import JSON data files
import personalInfoData from '../data/personalInfo.json';
import experienceData from '../data/experience.json';
import educationData from '../data/education.json';
import skillsData from '../data/skills.json';
import projectsData from '../data/projects.json';
import certificationsData from '../data/certifications.json';
import quotesData from '../data/quotes.json';

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
  updateGuideSettings: () => { },
  isDarkMode: false,
  toggleDarkMode: () => { },
  loading: false,
  error: null,
  refreshData: async () => { },
});

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  // Initialize with data from JSON files merged with portfolioData.ts defaults
  const [data, setData] = useState(() => ({
    ...portfolioData,
    personalInfo: personalInfoData,
    workExperience: experienceData,
    education: educationData,
    skills: skillsData,
    projects: projectsData,
    certifications: certificationsData,
    quotes: quotesData,
  }));
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

  // Refresh data function (now just re-reads from static JSON)
  const refreshData = async () => {
    setLoading(true);
    try {
      // Data is now static from JSON files, just trigger a re-render
      setData({
        ...portfolioData,
        personalInfo: personalInfoData,
        workExperience: experienceData,
        education: educationData,
        skills: skillsData,
        projects: projectsData,
        certifications: certificationsData,
        quotes: quotesData,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load settings on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user settings from local storage
        const [savedGuideSettings, userPrefs] = await Promise.all([
          database.getGuideSettings(),
          database.getUserPreferences(),
        ]);

        if (savedGuideSettings) {
          setGuideSettings(savedGuideSettings);
        }

        setIsDarkMode(userPrefs.themeMode === 'dark');
      } catch (error) {
        console.error('Error loading settings:', error);
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