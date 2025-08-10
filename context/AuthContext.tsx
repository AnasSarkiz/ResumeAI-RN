import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { User } from '../types/user';
import { getUser, registerWithEmail, loginWithEmail, logoutUser } from '../services/auth';
import { storageService, StoredSession } from '../services/storage';
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize session on app start
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Check if we have a stored session
        const storedSession = await storageService.getUserSession();
        const isSessionValid = await storageService.isSessionValid();
        
        if (storedSession && isSessionValid) {
          // Restore user from stored session
          setUser({
            id: storedSession.userId,
            email: storedSession.email,
            name: storedSession.name,
            isPro: storedSession.isPro || false,
            createdAt: new Date(storedSession.lastLogin),
            lastLogin: new Date()
          });
          
          // Update last activity
          await storageService.updateLastActivity();
          console.log('Session restored from storage');
        } else if (storedSession && !isSessionValid) {
          // Clear expired session
          await storageService.clearUserSession();
          console.log('Expired session cleared');
        }
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    };

    initializeSession();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userData = await getUser(firebaseUser.uid);
          setUser(userData);
          
          // Save session to storage
          const sessionData: StoredSession = {
            userId: userData.id || firebaseUser.uid,
            email: userData.email,
            name: userData.name || '',
            isPro: userData.isPro || false,
            lastLogin: new Date().toISOString()
          };
          await storageService.saveUserSession(sessionData);
          console.log('Session saved to storage');
        } catch (err) {
          setError('Failed to load user data');
          console.error(err);
        }
      } else {
        setUser(null);
        // Clear session when user logs out
        await storageService.clearUserSession();
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      await registerWithEmail(email, password, name);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      // Clear stored session
      await storageService.clearUserSession();
      console.log('Session cleared on logout');
    } catch (err) {
      setError('Logout failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    try {
      const userData = await getUser(auth.currentUser.uid);
      setUser(userData);
    } catch (err) {
      setError('Failed to refresh user data');
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
