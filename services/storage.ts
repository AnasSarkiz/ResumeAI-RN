import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_SESSION: '@user_session',
  USER_DATA: '@user_data',
  AUTH_TOKEN: '@auth_token',
  LAST_LOGIN: '@last_login',
} as const;

export interface StoredSession {
  userId: string;
  email: string;
  name: string;
  isPro?: boolean;
  lastLogin: string;
  authToken?: string;
}

class StorageService {
  // Save user session data
  async saveUserSession(sessionData: StoredSession): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(sessionData));
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
    } catch (error) {
      console.error('Failed to save user session:', error);
      throw error;
    }
  }

  // Get stored user session
  async getUserSession(): Promise<StoredSession | null> {
    try {
      const sessionData = await AsyncStorage.getItem(STORAGE_KEYS.USER_SESSION);
      if (sessionData) {
        return JSON.parse(sessionData);
      }
      return null;
    } catch (error) {
      console.error('Failed to get user session:', error);
      return null;
    }
  }

  // Clear user session (logout)
  async clearUserSession(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_SESSION,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.LAST_LOGIN,
      ]);
    } catch (error) {
      console.error('Failed to clear user session:', error);
      throw error;
    }
  }

  // Check if session is still valid (within 30 days)
  async isSessionValid(): Promise<boolean> {
    try {
      const lastLogin = await AsyncStorage.getItem(STORAGE_KEYS.LAST_LOGIN);
      if (!lastLogin) return false;

      const lastLoginDate = new Date(lastLogin);
      const now = new Date();
      const daysDiff = (now.getTime() - lastLoginDate.getTime()) / (1000 * 3600 * 24);
      
      // Session expires after 30 days
      return daysDiff < 30;
    } catch (error) {
      console.error('Failed to check session validity:', error);
      return false;
    }
  }

  // Update last activity timestamp
  async updateLastActivity(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString());
    } catch (error) {
      console.error('Failed to update last activity:', error);
    }
  }

  // Save specific user data
  async saveUserData(key: string, data: any): Promise<void> {
    try {
      await AsyncStorage.setItem(`@user_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save user data for key ${key}:`, error);
      throw error;
    }
  }

  // Get specific user data
  async getUserData(key: string): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(`@user_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Failed to get user data for key ${key}:`, error);
      return null;
    }
  }

  // Clear all app data (for debugging/reset)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }

  // Get all stored keys (for debugging)
  async getAllKeys(): Promise<readonly string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Failed to get all keys:', error);
      return [];
    }
  }
}

export const storageService = new StorageService();
export default storageService;
