import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';
import {
  getCreditBalance,
  consumeCredits,
  purchaseCreditsIOS,
  type CreditBundleId,
} from '../services/credits';

interface CreditBalanceContextType {
  balance: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  consume: (amount: number, reason?: string) => Promise<void>;
  openPurchase: (bundle?: CreditBundleId) => Promise<void>;
}

const CreditBalanceContext = createContext<CreditBalanceContextType>({
  balance: 0,
  loading: false,
  error: null,
  refresh: async () => {},
  consume: async () => {},
  openPurchase: async () => {},
});

export const CreditBalanceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Realtime sync across devices via Firestore
  useEffect(() => {
    if (!user?.id) return;
    const ref = doc(db, 'users', user.id);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        const data = snap.data() as any;
        const b = typeof data?.creditBalance === 'number' ? data.creditBalance : 0;
        setBalance(b);
      },
      (e) => setError(e?.message || 'Credit sync failed')
    );
    return unsub;
  }, [user?.id]);

  const refresh = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const b = await getCreditBalance(user.id);
      setBalance(b);
    } catch (e: any) {
      setError(e?.message || 'Failed to refresh credits');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const consume = useCallback(
    async (amount: number, reason?: string) => {
      if (!user?.id) throw new Error('Not authenticated');
      setLoading(true);
      try {
        await consumeCredits(user.id, amount, reason);
      } catch (e: any) {
        setError(e?.message || 'Failed to use Career Credits');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  const openPurchase = useCallback(
    async (bundle?: CreditBundleId) => {
      if (!user?.id) throw new Error('Not authenticated');
      setLoading(true);
      try {
        await purchaseCreditsIOS(user.id, bundle);
      } catch (e: any) {
        setError(e?.message || 'Purchase failed');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  const value = useMemo(
    () => ({ balance, loading, error, refresh, consume, openPurchase }),
    [balance, loading, error, refresh, consume, openPurchase]
  );

  return <CreditBalanceContext.Provider value={value}>{children}</CreditBalanceContext.Provider>;
};

export const useCredits = () => useContext(CreditBalanceContext);
