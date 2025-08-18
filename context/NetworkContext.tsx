import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import * as Network from 'expo-network';
import { AppState, AppStateStatus } from 'react-native';
import { setOnline } from '../services/connectivity';

interface NetworkContextType {
  isOnline: boolean;
  lastChecked: number;
  refresh: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType>({
  isOnline: true,
  lastChecked: Date.now(),
  refresh: async () => {},
});

export const NetworkProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [lastChecked, setLastChecked] = useState(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const check = async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      const online = !!(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);
      setOnline(online);
    } catch {
      // If we cannot determine, assume offline conservatively
      setIsOnline(false);
      setOnline(false);
    } finally {
      setLastChecked(Date.now());
    }
  };

  useEffect(() => {
    // Initial check
    check();

    // Re-check when app comes to foreground
    const onAppStateChange = (status: AppStateStatus) => {
      if (status === 'active') check();
    };
    const sub = AppState.addEventListener('change', onAppStateChange);

    // Light polling to catch changes while app is in foreground
    intervalRef.current = setInterval(check, 15_000);

    return () => {
      sub.remove();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const refresh = async () => {
    await check();
  };

  return (
    <NetworkContext.Provider value={{ isOnline, lastChecked, refresh }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
