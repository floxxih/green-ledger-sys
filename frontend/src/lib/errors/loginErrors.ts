/**
 * Login Error Types and Constants
 * Provides specific error messages for different login failure scenarios
 */

export enum LoginErrorCode {
  INVALID_EMAIL = 'INVALID_EMAIL',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

export interface LoginError {
  code: LoginErrorCode;
  message: string;
  field?: 'email' | 'password' | 'general';
  helpText?: string;
  actionLabel?: string;
  actionUrl?: string;
}

/**
 * User-friendly error messages for login failures
 */
export const LOGIN_ERROR_MESSAGES: Record<LoginErrorCode, LoginError> = {
  [LoginErrorCode.INVALID_EMAIL]: {
    code: LoginErrorCode.INVALID_EMAIL,
    message: 'The email address you entered is incorrect.',
    field: 'email',
    helpText: 'Please check your email address and try again.',
  },
  [LoginErrorCode.INVALID_PASSWORD]: {
    code: LoginErrorCode.INVALID_PASSWORD,
    message: 'The password you entered is incorrect.',
    field: 'password',
    helpText: 'Passwords are case-sensitive. Check your caps lock key.',
    actionLabel: 'Forgot password?',
    actionUrl: '/forgot-password',
  },
  [LoginErrorCode.ACCOUNT_LOCKED]: {
    code: LoginErrorCode.ACCOUNT_LOCKED,
    message: 'Your account has been temporarily locked.',
    field: 'general',
    helpText: 'Too many failed login attempts. Please try again in 15 minutes or reset your password.',
    actionLabel: 'Reset password',
    actionUrl: '/reset-password',
  },
  [LoginErrorCode.ACCOUNT_NOT_FOUND]: {
    code: LoginErrorCode.ACCOUNT_NOT_FOUND,
    message: 'No account found with this email address.',
    field: 'email',
    helpText: 'Please check your email or create a new account.',
    actionLabel: 'Sign up',
    actionUrl: '/signup',
  },
  [LoginErrorCode.EMAIL_NOT_VERIFIED]: {
    code: LoginErrorCode.EMAIL_NOT_VERIFIED,
    message: 'Please verify your email address before logging in.',
    field: 'general',
    helpText: 'Check your inbox for a verification email.',
    actionLabel: 'Resend verification email',
    actionUrl: '/resend-verification',
  },
  [LoginErrorCode.NETWORK_ERROR]: {
    code: LoginErrorCode.NETWORK_ERROR,
    message: 'Unable to connect to the server.',
    field: 'general',
    helpText: 'Please check your internet connection and try again.',
  },
  [LoginErrorCode.SERVER_ERROR]: {
    code: LoginErrorCode.SERVER_ERROR,
    message: 'Something went wrong on our end.',
    field: 'general',
    helpText: 'Please try again in a few moments. If the problem persists, contact support.',
    actionLabel: 'Contact support',
    actionUrl: '/support',
  },
  [LoginErrorCode.RATE_LIMIT_EXCEEDED]: {
    code: LoginErrorCode.RATE_LIMIT_EXCEEDED,
    message: 'Too many login attempts.',
    field: 'general',
    helpText: 'Please wait a few minutes before trying again.',
  },
};

/**
 * Parse backend error response and return appropriate LoginError
 */
export function parseLoginError(error: any): LoginError {
  // Network error
  if (!error.response) {
    return LOGIN_ERROR_MESSAGES[LoginErrorCode.NETWORK_ERROR];
  }

  const { status, data } = error.response;

  // Server error
  if (status >= 500) {
    return LOGIN_ERROR_MESSAGES[LoginErrorCode.SERVER_ERROR];
  }

  // Rate limiting
  if (status === 429) {
    return LOGIN_ERROR_MESSAGES[LoginErrorCode.RATE_LIMIT_EXCEEDED];
  }

  // Parse specific error codes from backend
  if (data?.errorCode) {
    switch (data.errorCode) {
      case 'INVALID_EMAIL':
        return LOGIN_ERROR_MESSAGES[LoginErrorCode.INVALID_EMAIL];
      case 'INVALID_PASSWORD':
        return LOGIN_ERROR_MESSAGES[LoginErrorCode.INVALID_PASSWORD];
      case 'ACCOUNT_LOCKED':
        return LOGIN_ERROR_MESSAGES[LoginErrorCode.ACCOUNT_LOCKED];
      case 'ACCOUNT_NOT_FOUND':
        return LOGIN_ERROR_MESSAGES[LoginErrorCode.ACCOUNT_NOT_FOUND];
      case 'EMAIL_NOT_VERIFIED':
        return LOGIN_ERROR_MESSAGES[LoginErrorCode.EMAIL_NOT_VERIFIED];
    }
  }

  // Parse based on error message
  const errorMessage = data?.message?.toLowerCase() || '';
  
  if (errorMessage.includes('email')) {
    return LOGIN_ERROR_MESSAGES[LoginErrorCode.INVALID_EMAIL];
  }
  
  if (errorMessage.includes('password')) {
    return LOGIN_ERROR_MESSAGES[LoginErrorCode.INVALID_PASSWORD];
  }
  
  if (errorMessage.includes('locked') || errorMessage.includes('disabled')) {
    return LOGIN_ERROR_MESSAGES[LoginErrorCode.ACCOUNT_LOCKED];
  }
  
  if (errorMessage.includes('not found') || errorMessage.includes('does not exist')) {
    return LOGIN_ERROR_MESSAGES[LoginErrorCode.ACCOUNT_NOT_FOUND];
  }
  
  if (errorMessage.includes('verify') || errorMessage.includes('verification')) {
    return LOGIN_ERROR_MESSAGES[LoginErrorCode.EMAIL_NOT_VERIFIED];
  }

  // Default to password error for generic auth failures
  return LOGIN_ERROR_MESSAGES[LoginErrorCode.INVALID_PASSWORD];
}
