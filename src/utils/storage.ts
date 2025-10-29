// Use string type instead of ThemeMode
// import { ThemeMode } from '@mui/material';

// Storage version for schema migrations
const STORAGE_VERSION = '1.0.0';

export interface GuideSettings {
  showGuide: boolean;
  selectedCharacter: 'dog' | 'cat' | 'rabbit' | 'hamster' | 'fox';
  selectedTab: number;
  lastSection: string;
}

export interface UserPreferences {
  themeMode: 'light' | 'dark'; // Use string literals instead of ThemeMode
  guideSettings: GuideSettings;
}

const STORAGE_KEYS = {
  USER_PREFERENCES: 'portfolio_user_preferences',
  GUIDE_SETTINGS: 'portfolio_guide_settings',
  VERSION: 'portfolio_storage_version'
};

export const defaultGuideSettings: GuideSettings = {
  showGuide: true,
  selectedCharacter: 'dog',
  selectedTab: 0,
  lastSection: 'intro'
};

export const defaultUserPreferences: UserPreferences = {
  themeMode: 'dark',
  guideSettings: defaultGuideSettings
};

// Detect if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Check if storage quota is exceeded
const isQuotaExceeded = (e: unknown): boolean => {
  return e instanceof DOMException && 
    (e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || 
    e.name === 'QuotaExceededError' ||
    e.name === 'QUOTA_EXCEEDED_ERR');
};

// In-memory fallback storage
const memoryStorage: Record<string, string> = {};

// Create a debounce function for storage operations
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>): void => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Set up storage event listener for cross-tab synchronization
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    // If relevant storage keys change in another tab, refresh the page or update the state
    if (
      event.key === STORAGE_KEYS.GUIDE_SETTINGS ||
      event.key === STORAGE_KEYS.USER_PREFERENCES
    ) {
      // Dispatch a custom event that components can listen for
      window.dispatchEvent(new CustomEvent('portfolioStorageUpdated', {
        detail: { key: event.key, newValue: event.newValue }
      }));
    }
  });
}

export const storage = {
  // Check storage version and handle migrations if needed
  initStorage: () => {
    try {
      if (!isLocalStorageAvailable()) return;
      
      const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
      
      // If no version or different version, perform migration
      if (storedVersion !== STORAGE_VERSION) {
        // Set the current version
        localStorage.setItem(STORAGE_KEYS.VERSION, STORAGE_VERSION);
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  },
  
  // Save guide settings to local storage with debounce
  saveGuideSettings: debounce((settings: GuideSettings) => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(STORAGE_KEYS.GUIDE_SETTINGS, JSON.stringify({
          ...settings,
          __version: STORAGE_VERSION
        }));
      } else {
        // Fallback to memory storage
        memoryStorage[STORAGE_KEYS.GUIDE_SETTINGS] = JSON.stringify({
          ...settings,
          __version: STORAGE_VERSION
        });
      }
    } catch (error) {
      if (isQuotaExceeded(error)) {
        console.warn('Storage quota exceeded. Falling back to memory storage.');
        // Clear some storage to make room
        try {
          localStorage.removeItem('__temporary_items__');
        } catch {
          // If still can't free space, use memory storage
          memoryStorage[STORAGE_KEYS.GUIDE_SETTINGS] = JSON.stringify(settings);
        }
      } else {
        console.error('Error saving guide settings:', error);
      }
    }
  }, 300), // Debounce for 300ms

  // Load guide settings from local storage
  loadGuideSettings: (): GuideSettings => {
    try {
      if (isLocalStorageAvailable()) {
        const savedSettings = localStorage.getItem(STORAGE_KEYS.GUIDE_SETTINGS);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          // If version mismatch, could handle migration here too
          return parsed;
        }
      } else {
        // Fallback to memory storage
        const savedSettings = memoryStorage[STORAGE_KEYS.GUIDE_SETTINGS];
        if (savedSettings) {
          return JSON.parse(savedSettings);
        }
      }
      
      return defaultGuideSettings;
    } catch (error) {
      console.error('Error loading guide settings:', error);
      return defaultGuideSettings;
    }
  },

  // Save user preferences to local storage with debounce
  saveUserPreferences: debounce((preferences: UserPreferences) => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify({
          ...preferences,
          __version: STORAGE_VERSION
        }));
      } else {
        // Fallback to memory storage
        memoryStorage[STORAGE_KEYS.USER_PREFERENCES] = JSON.stringify({
          ...preferences,
          __version: STORAGE_VERSION
        });
      }
    } catch (error) {
      if (isQuotaExceeded(error)) {
        console.warn('Storage quota exceeded. Falling back to memory storage.');
        memoryStorage[STORAGE_KEYS.USER_PREFERENCES] = JSON.stringify(preferences);
      } else {
        console.error('Error saving user preferences:', error);
      }
    }
  }, 300), // Debounce for 300ms

  // Load user preferences from local storage
  loadUserPreferences: (): UserPreferences => {
    try {
      if (isLocalStorageAvailable()) {
        const savedPreferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
        if (savedPreferences) {
          const parsed = JSON.parse(savedPreferences);
          // If version mismatch, could handle migration here
          return parsed;
        }
      } else {
        // Fallback to memory storage
        const savedPreferences = memoryStorage[STORAGE_KEYS.USER_PREFERENCES];
        if (savedPreferences) {
          return JSON.parse(savedPreferences);
        }
      }
      
      return defaultUserPreferences;
    } catch (error) {
      console.error('Error loading user preferences:', error);
      return defaultUserPreferences;
    }
  },

  // Clear all stored data
  clearStorage: () => {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(STORAGE_KEYS.GUIDE_SETTINGS);
        localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
        // Don't remove version so we don't trigger migrations again
      }
      
      // Clear memory storage too
      delete memoryStorage[STORAGE_KEYS.GUIDE_SETTINGS];
      delete memoryStorage[STORAGE_KEYS.USER_PREFERENCES];
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
}; 

// Initialize storage on first import
storage.initStorage(); 