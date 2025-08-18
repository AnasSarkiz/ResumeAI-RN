// Centralized Firebase Auth error mapper
// Converts Firebase error codes to user-friendly messages

export function mapFirebaseAuthError(error: unknown, fallback: string): string {
  const code = getFirebaseErrorCode(error);

  switch (code) {
    case 'auth/invalid-email':
      return 'The email address is invalid.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
    case 'auth/invalid-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is currently disabled.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/missing-password':
      return 'Please enter your password.';
    case 'auth/missing-email':
      return 'Please enter your email address.';
    default: {
      // If we have a message in the incoming error, prefer that
      const message = getErrorMessage(error);
      return message || fallback;
    }
  }
}

// Returns a localization key for Firebase Auth errors
// Consumers should pass the returned key to i18n.t()
export function mapFirebaseAuthErrorKey(error: unknown, fallbackKey: string): string {
  const code = getFirebaseErrorCode(error);
  switch (code) {
    case 'auth/invalid-email':
      return 'errors.auth.invalid_email';
    case 'auth/user-disabled':
      return 'errors.auth.user_disabled';
    case 'auth/user-not-found':
      return 'errors.auth.user_not_found';
    case 'auth/wrong-password':
    case 'auth/invalid-password':
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
      return 'errors.auth.wrong_password';
    case 'auth/email-already-in-use':
      return 'errors.auth.email_in_use';
    case 'auth/weak-password':
      return 'errors.auth.weak_password';
    case 'auth/operation-not-allowed':
      return 'errors.auth.operation_not_allowed';
    case 'auth/too-many-requests':
      return 'errors.common.too_many_requests';
    case 'auth/network-request-failed':
      return 'errors.common.network';
    case 'auth/missing-password':
      return 'errors.form.missing_password';
    case 'auth/missing-email':
      return 'errors.form.missing_email';
    default:
      return fallbackKey;
  }
}

function getFirebaseErrorCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error && 'code' in error) {
    const val = (error as any).code;
    if (typeof val === 'string') return val;
  }
  return undefined;
}

function getErrorMessage(error: unknown): string | undefined {
  if (typeof error === 'object' && error && 'message' in error) {
    const val = (error as any).message;
    if (typeof val === 'string') return val;
  }
  return undefined;
}
