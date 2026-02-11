# API Authentication Examples

This document provides examples of JWT authentication headers for AuroraMint API.

## Overview

AuroraMint uses JWT (JSON Web Token) for API authentication. You need to include the token in the `Authorization` header of your requests.

## Authentication Header Format

```
Authorization: Bearer <your_jwt_token>
```

## Example: cURL

### Basic Request with Auth Header

```bash
# Get user profile
curl -X GET "https://api.auroramint.io/v1/user/profile" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# List user's NFTs
curl -X GET "https://api.auroramint.io/v1/nfts/owner/SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Create a new NFT
curl -X POST "https://api.auroramint.io/v1/nfts/mint" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "collectionId": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-collection-v2-1-3",
    "recipient": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173",
    "metadata": {
      "name": "My NFT",
      "description": "An awesome NFT",
      "image": "ipfs://Qm..."
    }
  }'

# List NFT for sale
curl -X POST "https://api.auroramint.io/v1/marketplace/list" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": 123,
    "price": 1000000,
    "contractId": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-nft-v2-1-3"
  }'
```

## Example: JavaScript (Fetch)

### Setting Up Authentication

```javascript
const API_BASE_URL = 'https://api.auroramint.io/v1';
const authToken = 'your_jwt_token_here';

// Helper function to make authenticated requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  
  return response.json();
}

// Get user profile
async function getUserProfile() {
  return apiRequest('/user/profile');
}

// List user's NFTs
async function getUserNFTs(address) {
  return apiRequest(`/nfts/owner/${address}`);
}

// Mint a new NFT
async function mintNFT(collectionId, recipient, metadata) {
  return apiRequest('/nfts/mint', {
    method: 'POST',
    body: JSON.stringify({
      collectionId,
      recipient,
      metadata
    })
  });
}

// List NFT for sale
async function listNFT(tokenId, price, contractId) {
  return apiRequest('/marketplace/list', {
    method: 'POST',
    body: JSON.stringify({
      tokenId,
      price,
      contractId
    })
  });
}

// Purchase NFT
async function purchaseNFT(listingId) {
  return apiRequest('/marketplace/purchase', {
    method: 'POST',
    body: JSON.stringify({ listingId })
  });
}
```

## Example: JavaScript (Axios)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.auroramint.io/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Usage examples
async function examples() {
  // Get user profile
  const profile = await api.get('/user/profile');
  
  // Get user's NFTs
  const nfts = await api.get('/nfts/owner/SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173');
  
  // Mint NFT
  const minted = await api.post('/nfts/mint', {
    collectionId: 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-collection-v2-1-3',
    recipient: 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173',
    metadata: {
      name: 'My NFT',
      description: 'An awesome NFT',
      image: 'ipfs://Qm...'
    }
  });
  
  // List NFT
  const listing = await api.post('/marketplace/list', {
    tokenId: 123,
    price: 1000000,
    contractId: 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-nft-v2-1-3'
  });
  
  // Purchase NFT
  const purchase = await api.post('/marketplace/purchase', {
    listingId: 456
  });
}
```

## Example: TypeScript

```typescript
interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

interface MintRequest {
  collectionId: string;
  recipient: string;
  metadata: NFTMetadata;
}

class AuroraMintAPI {
  private baseURL = 'https://api.auroramint.io/v1';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  async getUserProfile(): Promise<UserProfile> {
    return this.request('/user/profile');
  }

  async getNFTs(ownerAddress: string): Promise<NFTList> {
    return this.request(`/nfts/owner/${ownerAddress}`);
  }

  async mintNFT(request: MintRequest): Promise<MintResponse> {
    return this.request('/nfts/mint', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  async listNFT(tokenId: number, price: number, contractId: string) {
    return this.request('/marketplace/list', {
      method: 'POST',
      body: JSON.stringify({ tokenId, price, contractId })
    });
  }
}

// Usage
const api = new AuroraMintAPI('your_jwt_token');
const profile = await api.getUserProfile();
```

## Example: Python (Requests)

```python
import requests

API_BASE_URL = 'https://api.auroramint.io/v1'
AUTH_TOKEN = 'your_jwt_token_here'

headers = {
    'Authorization': f'Bearer {AUTH_TOKEN}',
    'Content-Type': 'application/json'
}

# Get user profile
response = requests.get(
    f'{API_BASE_URL}/user/profile',
    headers=headers
)
profile = response.json()

# Mint NFT
response = requests.post(
    f'{API_BASE_URL}/nfts/mint',
    headers=headers,
    json={
        'collectionId': 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-collection-v2-1-3',
        'recipient': 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173',
        'metadata': {
            'name': 'My NFT',
            'description': 'An awesome NFT',
            'image': 'ipfs://Qm...'
        }
    }
)
result = response.json()

# List NFT
response = requests.post(
    f'{API_BASE_URL}/marketplace/list',
    headers=headers,
    json={
        'tokenId': 123,
        'price': 1000000,
        'contractId': 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-nft-v2-1-3'
    }
)
listing = response.json()
```

## Example: Postman

### Setting Up Authorization

1. Create a new collection
2. Go to the "Authorization" tab
3. Select "Bearer Token" as the type
4. Paste your JWT token in the token field
5. All requests in the collection will automatically include the token

### Making Requests

```
GET {{base_url}}/user/profile
Authorization: Bearer {{auth_token}}

POST {{base_url}}/nfts/mint
Authorization: Bearer {{auth_token}}
Content-Type: application/json

Body:
{
  "collectionId": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-collection-v2-1-3",
  "recipient": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173",
  "metadata": {
    "name": "My NFT",
    "description": "An awesome NFT",
    "image": "ipfs://Qm..."
  }
}
```

## Token Refresh

When your token expires, you'll get a 401 Unauthorized response:

```javascript
// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Refresh the token
      const refreshToken = localStorage.getItem('refresh_token');
      const response = await axios.post('/auth/refresh', {
        refreshToken
      });
      
      const { token } = response.data;
      localStorage.setItem('auth_token', token);
      
      // Retry the original request
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);
```

## Security Best Practices

1. **Store tokens securely**: Use httpOnly cookies or secure storage
2. **Never expose tokens**: Don't include tokens in client-side code
3. **Use HTTPS**: Always use HTTPS for API requests
4. **Handle expiration**: Implement token refresh logic
5. **Validate tokens**: Check token expiration before making requests
6. **Clear on logout**: Remove tokens from storage on logout

## Error Handling

```javascript
async function safeApiCall() {
  try {
    const result = await api.get('/user/profile');
    return result;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('Authentication failed - please log in again');
      // Redirect to login
    } else if (error.response?.status === 403) {
      console.error('Insufficient permissions');
    } else {
      console.error('API error:', error.message);
    }
    throw error;
  }
}
```
