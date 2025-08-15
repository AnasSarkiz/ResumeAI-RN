import React, { createContext, useContext, useEffect, useState } from 'react';
import Purchases from 'react-native-purchases';
import { SubscriptionPlan } from '../types/user';
import {
  initializeRevenueCat,
  getSubscriptionPlans,
  purchaseSubscription,
} from '../services/subscription';

interface SubscriptionContextType {
  isPro: boolean;
  loading: boolean;
  error: string | null;
  plans: SubscriptionPlan[];
  refreshSubscriptionStatus: () => Promise<void>;
  purchasePlan: (planId: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  isPro: false,
  loading: false,
  error: null,
  plans: [],
  refreshSubscriptionStatus: async () => {},
  purchasePlan: async () => {},
});

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    initializeRevenueCat();
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const availablePlans = await getSubscriptionPlans();
      setPlans(availablePlans);
    } catch (err) {
      setError('Failed to load subscription plans');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscriptionStatus = async () => {
    setLoading(true);
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      setIsPro(customerInfo.entitlements.active?.pro?.isActive === true);
    } catch (err) {
      setError('Failed to refresh subscription status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const purchasePlan = async (planId: string) => {
    setLoading(true);
    try {
      await purchaseSubscription(planId);
      await refreshSubscriptionStatus();
    } catch (err) {
      setError('Purchase failed');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        isPro,
        loading,
        error,
        plans,
        refreshSubscriptionStatus,
        purchasePlan,
      }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
