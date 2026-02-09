/**
 * Authentication Service
 * Handles login, logout, and session management with detailed error handling
 */

import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.auroramint.io/v1';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
    walletAddress?: string;
  };
}

export interface AuthError {
  errorCode: string;
  message: string;
  field?: string;
}

class AuthService {
  private token: string | null = null;

  /**
   * Log in with email and password
   * @throws {AxiosError} with detailed error information
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/auth/login`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          validateStatus: (status) => status < 600, // Don't throw for any status
        }
      );

      // Handle successful login
      if (response.status === 200) {
        this.token = response.data.token;
        this.saveToken(response.data.token);
        return response.data;
      }

      // Handle error responses
      throw this.createAuthError(response.status, response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error;
      }
      // Network or other errors
      throw new Error('Unable to connect to authentication server');
    }
  }

  /**
   * Log out current user
   */
  async logout(): Promise<void> {
    try {
      if (this.token) {
        await axios.post(
          `${API_BASE_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );
      }
    } finally {
      this.token = null;
      this.clearToken();
    }
  }

  /**
   * Verify if current session is valid
   */
  async verifySession(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      token,
      password: newPassword,
    });
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<void> {
    await axios.post(`${API_BASE_URL}/auth/resend-verification`, { email });
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    if (this.token) return this.token;
    
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    
    return null;
  }

  /**
   * Save token to localStorage
   */
  private saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * Clear token from localStorage
   */
  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Create detailed auth error from response
   */
  private createAuthError(status: number, data: any): AxiosError {
    const error: any = new Error();
    error.response = {
      status,
      data: this.parseErrorResponse(status, data),
    };
    return error as AxiosError;
  }

  /**
   * Parse error response to standardized format
   */
  private parseErrorResponse(status: number, data: any): AuthError {
    // Server provided error code
    if (data?.errorCode) {
      return {
        errorCode: data.errorCode,
        message: data.message || 'Authentication failed',
        field: data.field,
      };
    }

    // Status-based error mapping
    switch (status) {
      case 400:
        return {
          errorCode: 'INVALID_REQUEST',
          message: 'Invalid email or password format',
        };
      case 401:
        // Try to determine if it's email or password
        if (data?.message?.toLowerCase().includes('email')) {
          return {
            errorCode: 'INVALID_EMAIL',
            message: 'Email address not found',
            field: 'email',
          };
        }
        return {
          errorCode: 'INVALID_PASSWORD',
          message: 'Incorrect password',
          field: 'password',
        };
      case 403:
        if (data?.message?.toLowerCase().includes('locked')) {
          return {
            errorCode: 'ACCOUNT_LOCKED',
            message: 'Account temporarily locked',
          };
        }
        if (data?.message?.toLowerCase().includes('verify')) {
          return {
            errorCode: 'EMAIL_NOT_VERIFIED',
            message: 'Email not verified',
          };
        }
        return {
          errorCode: 'FORBIDDEN',
          message: 'Access denied',
        };
      case 404:
        return {
          errorCode: 'ACCOUNT_NOT_FOUND',
          message: 'Account not found',
          field: 'email',
        };
      case 429:
        return {
          errorCode: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many login attempts',
        };
      case 500:
      case 502:
      case 503:
        return {
          errorCode: 'SERVER_ERROR',
          message: 'Server error occurred',
        };
      default:
        return {
          errorCode: 'UNKNOWN_ERROR',
          message: 'An unexpected error occurred',
        };
    }
  }
}

export const authService = new AuthService();
