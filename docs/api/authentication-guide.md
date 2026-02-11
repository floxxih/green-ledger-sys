# API Authentication Guide

Complete guide to authenticating with the AuroraMint API.

## Authentication Methods

AuroraMint supports JWT (JSON Web Token) authentication.

## Obtaining a Token

### 1. Login with Credentials

```bash
curl -X POST "https://api.auroramint.io/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your_password"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

### 2. Login with Wallet

```bash
curl -X POST "https://api.auroramint.io/v1/auth/login-wallet" \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173",
    "signature": "0x...",
    "message": "Sign in to AuroraMint"
  }'
```

## Using the Token

Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## Token Expiration

Tokens expire after 24 hours. Use the refresh token to get a new token:

```bash
curl -X POST "https://api.auroramint.io/v1/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

## Scopes and Permissions

Tokens include scopes that determine what actions you can perform:

- `read`: Read data (NFTs, collections, user profile)
- `write`: Create and modify data (mint NFTs, create collections)
- `trade`: Buy and sell NFTs
- `admin`: Administrative actions

## Revoking Tokens

To revoke a token (logout):

```bash
curl -X POST "https://api.auroramint.io/v1/auth/logout" \
  -H "Authorization: Bearer <token>"
```

## Security Considerations

1. Never expose tokens in client-side code
2. Store tokens securely (httpOnly cookies recommended)
3. Use HTTPS for all API requests
4. Implement token refresh before expiration
5. Revoke tokens on logout
