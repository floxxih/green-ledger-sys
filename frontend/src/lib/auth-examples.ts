// Authentication service with comprehensive examples

export interface AuthToken {
  token: string;
  refreshToken: string;
  expiresIn: number;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface WalletLoginRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

/**
 * Login with email and password
 * @example
 * const auth = await login({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * localStorage.setItem('token', auth.token);
 */
export async function login(credentials: LoginCredentials): Promise<AuthToken> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  return response.json();
}

/**
 * Login with wallet signature
 * @example
 * const message = 'Sign in to AuroraMint';
 * const signature = await wallet.sign(message);
 * const auth = await loginWithWallet({
 *   walletAddress: wallet.address,
 *   signature,
 *   message
 * });
 */
export async function loginWithWallet(request: WalletLoginRequest): Promise<AuthToken> {
  const response = await fetch('/api/auth/login-wallet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    throw new Error('Wallet login failed');
  }
  
  return response.json();
}

/**
 * Refresh authentication token
 * @example
 * const newToken = await refreshToken(currentRefreshToken);
 * localStorage.setItem('token', newToken.token);
 */
export async function refreshToken(refreshToken: string): Promise<AuthToken> {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  
  if (!response.ok) {
    throw new Error('Token refresh failed');
  }
  
  return response.json();
}

/**
 * Logout and revoke token
 * @example
 * await logout(token);
 * localStorage.removeItem('token');
 */
export async function logout(token: string): Promise<void> {
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
}
