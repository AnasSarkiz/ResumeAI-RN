import Purchases from 'react-native-purchases';
import { SubscriptionPlan } from '../types/user';

export const initializeRevenueCat = () => {
  const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RevenueCat API key");
  }
  Purchases.configure({ apiKey });
};

export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
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
        'Cover letter generator',
      ],
    }));
  } catch (error) {
    console.error('Error getting subscription plans:', error);
    return [];
  }
};

export const purchaseSubscription = async (planId: string) => {
  try {
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
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo.entitlements.active.pro !== undefined;
  } catch (error) {
    console.error('Restore purchases error:', error);
    return false;
  }
};