import { storage, GuideSettings, UserPreferences } from '../utils/storage';

/**
 * Database service that abstracts storage operations.
 * Currently uses local storage but designed to be easily replaced with a real database.
 * 
 * To switch to a real database in the future:
 * 1. Replace these methods with API calls to your backend
 * 2. Keep the method signatures the same to maintain compatibility
 * 3. Ensure proper error handling for network requests
 */

// Queue to store failed operations for retry
interface QueuedOperation {
  type: 'save' | 'get' | 'clear';
  key: string;
  data?: any;
  retries: number;
  timestamp: number;
}

class DatabaseService {
  private queue: QueuedOperation[] = [];
  private isProcessingQueue = false;
  private maxRetries = 3;
  private processingInterval: number | null = null;
  private syncListenerSet = false;
  private lastSyncTimestamp = Date.now();
  private throttleMap: Record<string, number> = {};
  private throttleWait = 1000; // 1 second throttle

  constructor() {
    this.setupSyncListener();
    this.startQueueProcessor();
  }

  private setupSyncListener() {
    if (typeof window === 'undefined' || this.syncListenerSet) return;
    
    window.addEventListener('portfolioStorageUpdated', (e: Event) => {
      // Cast to CustomEvent with our expected detail shape
      const customEvent = e as CustomEvent<{ key: string, newValue: string }>;
      this.lastSyncTimestamp = Date.now();
      
      // Could dispatch events to notify components about updates
      // or update internal caches if implemented
      console.log('Storage updated in another tab:', customEvent.detail.key);
    });
    
    this.syncListenerSet = true;
  }

  private startQueueProcessor() {
    if (this.processingInterval !== null) return;
    
    this.processingInterval = window.setInterval(() => {
      this.processQueue();
    }, 5000) as unknown as number; // Process every 5 seconds
  }

  private stopQueueProcessor() {
    if (this.processingInterval !== null) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }

  private async processQueue() {
    if (this.isProcessingQueue || this.queue.length === 0) return;

    this.isProcessingQueue = true;
    
    try {
      // Process operations that have waited at least 2 seconds (to avoid immediate retries)
      const now = Date.now();
      const operationsToProcess = this.queue.filter(op => now - op.timestamp > 2000);
      
      for (const operation of operationsToProcess) {
        try {
          if (operation.type === 'save') {
            if (operation.key === 'guideSettings') {
              storage.saveGuideSettings(operation.data);
            } else if (operation.key === 'userPreferences') {
              storage.saveUserPreferences(operation.data);
            }
          } else if (operation.type === 'clear') {
            storage.clearStorage();
          }
          
          // If successful, remove from queue
          this.queue = this.queue.filter(op => op !== operation);
        } catch (error) {
          console.error(`Failed to process queued operation (${operation.retries}/${this.maxRetries}):`, operation, error);
          
          // Increment retry count
          operation.retries++;
          
          // If max retries reached, remove from queue
          if (operation.retries > this.maxRetries) {
            this.queue = this.queue.filter(op => op !== operation);
            console.warn('Max retries reached, dropping operation:', operation);
          }
        }
      }
    } finally {
      this.isProcessingQueue = false;
    }
  }

  private isThrottled(key: string): boolean {
    const now = Date.now();
    const lastTime = this.throttleMap[key] || 0;
    
    if (now - lastTime < this.throttleWait) {
      return true;
    }
    
    this.throttleMap[key] = now;
    return false;
  }

  // Public API methods below

  // Guide settings operations with retry logic
  async getGuideSettings(): Promise<GuideSettings> {
    try {
      return storage.loadGuideSettings();
    } catch (error) {
      console.error('Error getting guide settings:', error);
      // Add to retry queue
      this.queue.push({
        type: 'get',
        key: 'guideSettings',
        retries: 0,
        timestamp: Date.now()
      });
      
      // Return default to avoid breaking the UI
      const defaultSettings = storage.loadGuideSettings();
      if (typeof defaultSettings === 'object') {
        return defaultSettings;
      }
      throw error; // Re-throw if we couldn't even get defaults
    }
  }

  async saveGuideSettings(settings: GuideSettings): Promise<void> {
    // Skip if throttled
    if (this.isThrottled('guideSettings')) {
      // Still enqueue for background processing
      this.queue.push({
        type: 'save',
        key: 'guideSettings',
        data: settings,
        retries: 0,
        timestamp: Date.now()
      });
      return;
    }
    
    try {
      storage.saveGuideSettings(settings);
    } catch (error) {
      console.error('Error saving guide settings:', error);
      // Add to retry queue
      this.queue.push({
        type: 'save',
        key: 'guideSettings',
        data: settings,
        retries: 0,
        timestamp: Date.now()
      });
    }
  }

  // User preferences operations with retry logic
  async getUserPreferences(): Promise<UserPreferences> {
    try {
      return storage.loadUserPreferences();
    } catch (error) {
      console.error('Error getting user preferences:', error);
      // Add to retry queue
      this.queue.push({
        type: 'get',
        key: 'userPreferences',
        retries: 0,
        timestamp: Date.now()
      });
      
      // Return default to avoid breaking the UI
      const defaultPrefs = storage.loadUserPreferences();
      if (typeof defaultPrefs === 'object') {
        return defaultPrefs;
      }
      throw error; // Re-throw if we couldn't even get defaults
    }
  }

  async saveUserPreferences(preferences: UserPreferences): Promise<void> {
    // Skip if throttled
    if (this.isThrottled('userPreferences')) {
      // Still enqueue for background processing
      this.queue.push({
        type: 'save',
        key: 'userPreferences',
        data: preferences,
        retries: 0,
        timestamp: Date.now()
      });
      return;
    }
    
    try {
      storage.saveUserPreferences(preferences);
    } catch (error) {
      console.error('Error saving user preferences:', error);
      // Add to retry queue
      this.queue.push({
        type: 'save',
        key: 'userPreferences',
        data: preferences,
        retries: 0,
        timestamp: Date.now()
      });
    }
  }

  // Data management operations
  async clearData(): Promise<void> {
    try {
      storage.clearStorage();
    } catch (error) {
      console.error('Error clearing data:', error);
      // Add to retry queue
      this.queue.push({
        type: 'clear',
        key: 'all',
        retries: 0,
        timestamp: Date.now()
      });
    }
  }

  // Get status information about pending operations
  getStatus(): { queueLength: number, lastSync: Date } {
    return {
      queueLength: this.queue.length,
      lastSync: new Date(this.lastSyncTimestamp)
    };
  }
}

// Create and export a singleton instance
export const database = new DatabaseService(); 