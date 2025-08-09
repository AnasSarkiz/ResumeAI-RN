export interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
  createdAt: Date;
  lastLogin: Date;
  isPro: boolean;
  subscriptionId?: string;
  resumes?: string[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval?: 'month' | 'year';
  features: string[];
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
