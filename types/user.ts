export interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
  createdAt: Date;
  lastLogin: Date;
  // Pay-as-you-go Career Credits balance
  creditBalance?: number; // number of Career Credits available
  resumes?: string[];
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
