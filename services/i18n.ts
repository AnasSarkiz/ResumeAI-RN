// Minimal i18n utility with English defaults
// Usage: import { t, setLocale } from './i18n'

export type Locale = 'en';

let currentLocale: Locale = 'en';

const dict: Record<Locale, Record<string, string>> = {
  en: {
    // Common
    'errors.common.network': 'Network error. Check your connection and try again.',
    'errors.common.too_many_requests': 'Too many attempts. Try again later.',
    'errors.common.unknown': 'An unknown error occurred',
    'errors.common.setup_failed':
      'Account created, but failed to complete setup. Please try again.',

    // Auth
    'errors.auth.invalid_email': 'The email address is invalid.',
    'errors.auth.user_disabled': 'This account has been disabled. Please contact support.',
    'errors.auth.user_not_found': 'No account found with this email.',
    'errors.auth.wrong_password': 'Incorrect email or password.',
    'errors.auth.email_in_use': 'An account already exists with this email address.',
    'errors.auth.weak_password': 'Password is too weak. Please use at least 6 characters.',
    'errors.auth.operation_not_allowed': 'Email/password sign-in is currently disabled.',

    // Form
    'errors.form.missing_password': 'Please enter your password.',
    'errors.form.missing_email': 'Please enter your email address.',
    'errors.form.invalid_email': 'Please enter a valid email address.',
    'errors.form.name_required': 'Please enter your full name.',
    'errors.form.password_min': 'Password must be at least 6 characters.',

    // UI strings
    'auth.login.title': 'Log In',
    'auth.login.subtitle': 'Welcome back. Access your AI resume workspace.',
    'auth.login.submit': 'Log In',
    'auth.login.submitting': 'Logging In...',
    'auth.register.title': 'Create Account',
    'auth.register.subtitle': 'Start crafting a standout resume powered by AI.',
    'auth.register.submit': 'Sign Up',
    'auth.register.submitting': 'Creating Account...',
    'auth.alert.login_failed': 'Login Failed',
    'auth.alert.register_failed': 'Registration Failed',
    'auth.cta.signup': "Don't have an account? Sign up",
    'auth.cta.login': 'Already have an account? Log in',
    'auth.welcome.title': 'ResumeAI',
    'auth.welcome.subtitle': 'Design, refine and export job-ready resumes in minutes.',
    'auth.cta.get_started': 'Get Started',
    'auth.cta.continue': 'Continue to App',
  },
};

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(key: string): string {
  const m = dict[currentLocale]?.[key];
  return m ?? dict.en[key] ?? key;
}

// Helper to translate Error or fallback to unknown
export function tFromError(e: unknown, fallbackKey = 'errors.common.unknown') {
  if (e instanceof Error) {
    return t(e.message);
  }
  return t(fallbackKey);
}
