import Purchases from 'react-native-purchases';
import { SubscriptionPlan } from '../types/user';

let purchasesConfigured = false;

export const initializeRevenueCat = () => {
  const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
  const useMock = (process.env.EXPO_PUBLIC_IAP_MOCK || '').toString().toLowerCase() === 'true';

  if (!apiKey) {
    console.warn('[RevenueCat] Missing API key. Skipping configure (dev).');
    purchasesConfigured = false;
    return;
  }
  // Prevent using secret keys in the app bundle
  if (apiKey.startsWith('sk_')) {
    console.warn('[RevenueCat] Secret API key detected. Do not use secret keys in the app. Skipping configure.');
    purchasesConfigured = false;
    return;
  }
  // Optionally bypass in mock mode
  if (useMock) {
    console.log('[RevenueCat] Mock mode enabled. Skipping real configuration.');
    purchasesConfigured = false;
    return;
  }

  Purchases.configure({ apiKey });
  purchasesConfigured = true;
};

export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    if (!purchasesConfigured) {
      return [];
    }
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    
    if (!current) return [];
    
    return current.availablePackages.map(pkg => ({
      id: pkg.identifier,
      name: pkg.product.title,
      description: pkg.product.description,
      price: pkg.product.price,
      currency: pkg.product.priceString.replace(/[0-9.,]/g, ''),
      interval: pkg.packageType === 'MONTHLY' ? 'month' : 'year',
      features: [
        'Unlimited resumes',
        'AI-powered suggestions',
        'PDF export',
      ],
    }));
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    return [];
  }
};

export const purchaseSubscription = async (planId: string) => {
  try {
    if (!purchasesConfigured) {
      throw new Error('Purchases not configured. Skipping in dev.');
    }
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    
    if (!current) {
      throw new Error('No subscription plans available');
    }
    
    const packageToPurchase = current.availablePackages.find(
      pkg => pkg.identifier === planId
    );
    
    if (!packageToPurchase) {
      throw new Error('Requested subscription plan not found');
    }
    
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    
    if (!customerInfo.entitlements.active.pro) {
      throw new Error('Purchase was not successful');
    }
    
    return customerInfo;
  } catch (error) {
    console.error('Purchase error:', error);
    throw error;
  }
};

export const restorePurchases = async () => {
  try {
    if (!purchasesConfigured) {
      return false;
    }
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo.entitlements.active.pro !== undefined;
  } catch (error) {
    console.error('Restore purchases error:', error);
    return false;
  }
};