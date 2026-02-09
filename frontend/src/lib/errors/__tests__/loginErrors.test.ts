import { describe, it, expect } from '@jest/globals';
import { parseLoginError, LoginErrorCode, LOGIN_ERROR_MESSAGES } from '../loginErrors';

describe('Login Error Handling', () => {
  describe('parseLoginError', () => {
    it('should return NETWORK_ERROR for network failures', () => {
      const error = { message: 'Network Error' };
      const result = parseLoginError(error);
      
      expect(result.code).toBe(LoginErrorCode.NETWORK_ERROR);
      expect(result.message).toBe('Unable to connect to the server.');
    });

    it('should return SERVER_ERROR for 500 status', () => {
      const error = {
        response: {
          status: 500,
          data: {},
        },
      };
      const result = parseLoginError(error);
      
      expect(result.code).toBe(LoginErrorCode.SERVER_ERROR);
      expect(result.field).toBe('general');
    });

    it('should return RATE_LIMIT_EXCEEDED for 429 status', () => {
      const error = {
        response: {
          status: 429,
          data: {},
        },
      };
      const result = parseLoginError(error);
      
      expect(result.code).toBe(LoginErrorCode.RATE_LIMIT_EXCEEDED);
    });

    it('should parse INVALID_EMAIL from backend error code', () => {
      const error = {
        response: {
          status: 401,
          data: {
            errorCode: 'INVALID_EMAIL',
            message: 'Email not found',
          },
        },
      };
      const result = parseLoginError(error);
      
      expect(result.code).toBe(LoginErrorCode.INVALID_EMAIL);
      expect(result.field).toBe('email');
    });

    it('should parse INVALID_PASSWORD from backend error code', () => {
      const error = {
        response: {
          status: 401,
          data: {
            errorCode: 'INVALID_PASSWORD',
            message: 'Wrong password',
          },
        },
      };
      const result = parseLoginError(error);
      
      expect(result.code).toBe(LoginErrorCode.INVALID_PASSWORD);
      expect(result.field).toBe('password');
    });

    it('should parse ACCOUNT_LOCKED from backend error code', () => {
      const error = {
        response: {
          status: 403,
          data: {
            errorCode: 'ACCOUNT_LOCKED',
            message: 'Account is locked',
          },
        },
      };
      const result = parseLoginError(error);
      
      expect(result.code).toBe(LoginErrorCode.ACCOUNT_LOCKED);
      expect(result.actionLabel).toBe('Reset password');
    });

    it('should parse ACCOUNT_NOT_FOUND from backend error code', () => {
      const error = {
        response: {
          status: 404,
          data: {
            errorCode: 'ACCOUNT_NOT_FOUND',
          },
        },
      };
      const result = parseLoginError(error);
      
      expect(result.code).toBe(LoginErrorCode.ACCOUNT_NOT_FOUND);
      expect(result.field).toBe('email');
      expect(result.actionLabel).toBe('Sign up');
    });

    it('should parse EMAIL_NOT_VERIFIED from backend error code', () => {
      const error = {
        response: {
          status: 403,
          data: {
            errorCode: 'EMAIL_NOT_VERIFIED',
          },
        },
      };
      const result = parseLoginError(error);
      
      expect(result.code).toBe(LoginErrorCode.EMAIL_NOT_VERIFIED);
      expect(result.actionLabel).toBe('Resend verification email');
    });

    it('should detect email error from message', () => {
      const error = {
        response: {
          status: 401,
          data: {
            message: 'Invalid email address provided',
          },
        },
      };
      const result = parseLoginError(error);
      
      expect(result.code).toBe(LoginErrorCode.INVALID_EMAIL);
    });

    it('should detect password error from message', () => {
      const error = {
        response: {
          status: 401,
          data: {
            message: 'Password is incorrect',
          },
        },
      };
      const result = parseLoginError(error);
      
      expect(result.code).toBe(LoginErrorCode.INVALID_PASSWORD);
    });

    it('should default to INVALID_PASSWORD for generic 401', () => {
      const error = {
        response: {
          status: 401,
          data: {},
        },
      };
      const result = parseLoginError(error);
      
      expect(result.code).toBe(LoginErrorCode.INVALID_PASSWORD);
    });
  });

  describe('LOGIN_ERROR_MESSAGES', () => {
    it('should have messages for all error codes', () => {
      Object.values(LoginErrorCode).forEach((code) => {
        expect(LOGIN_ERROR_MESSAGES[code]).toBeDefined();
        expect(LOGIN_ERROR_MESSAGES[code].message).toBeTruthy();
      });
    });

    it('should have help text for user guidance', () => {
      const errorWithHelp = LOGIN_ERROR_MESSAGES[LoginErrorCode.INVALID_PASSWORD];
      expect(errorWithHelp.helpText).toBeTruthy();
    });

    it('should have action links where appropriate', () => {
      const errorWithAction = LOGIN_ERROR_MESSAGES[LoginErrorCode.ACCOUNT_LOCKED];
      expect(errorWithAction.actionLabel).toBeTruthy();
      expect(errorWithAction.actionUrl).toBeTruthy();
    });

    it('should specify field for field-specific errors', () => {
      const emailError = LOGIN_ERROR_MESSAGES[LoginErrorCode.INVALID_EMAIL];
      expect(emailError.field).toBe('email');
      
      const passwordError = LOGIN_ERROR_MESSAGES[LoginErrorCode.INVALID_PASSWORD];
      expect(passwordError.field).toBe('password');
    });
  });
});
