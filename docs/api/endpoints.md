# REST API Endpoints

This document describes the REST API endpoints for AuroraMint backend services.

## Base URL

- Production: `https://api.auroramint.io/v1`
- Staging: `https://api-staging.auroramint.io/v1`

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Get Authentication Token

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "walletAddress": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173",
  "signature": "0x...",
  "message": "Sign in to AuroraMint"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

## NFT Endpoints

### Get NFT Details

**Endpoint:** `GET /nft/{tokenId}`

**Parameters:**
- `tokenId` (path): NFT token ID

**Response:**
```json
{
  "tokenId": 1,
  "owner": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173",
  "contractId": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-nft-v2-1-3",
  "metadata": {
    "name": "Cool NFT #1",
    "description": "An awesome NFT",
    "image": "ipfs://Qm...",
    "attributes": []
  },
  "mintedAt": "2024-02-09T10:30:00Z"
}
```

### Get NFTs by Owner

**Endpoint:** `GET /nft/owner/{address}`

**Parameters:**
- `address` (path): Wallet address
- `limit` (query, optional): Number of results (default: 20, max: 100)
- `offset` (query, optional): Pagination offset (default: 0)

**Response:**
```json
{
  "nfts": [
    {
      "tokenId": 1,
      "contractId": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-nft-v2-1-3",
      "metadata": {
        "name": "Cool NFT #1",
        "image": "ipfs://Qm..."
      }
    }
  ],
  "total": 50,
  "limit": 20,
  "offset": 0
}
```

### Mint NFT

**Endpoint:** `POST /nft/mint`

**Authentication:** Required

**Request Body:**
```json
{
  "collectionId": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-collection-v2-1-3",
  "recipient": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173",
  "metadata": {
    "name": "My NFT",
    "description": "Description",
    "image": "ipfs://Qm...",
    "attributes": [
      {
        "trait_type": "Rarity",
        "value": "Common"
      }
    ]
  }
}
```

**Response:**
```json
{
  "success": true,
  "tokenId": 123,
  "txId": "0x1234567890abcdef...",
  "status": "pending"
}
```

## Marketplace Endpoints

### Get Marketplace Listings

**Endpoint:** `GET /marketplace/listings`

**Query Parameters:**
- `limit` (optional): Number of results (default: 20, max: 100)
- `offset` (optional): Pagination offset
- `minPrice` (optional): Minimum price filter (in microSTX)
- `maxPrice` (optional): Maximum price filter (in microSTX)
- `collectionId` (optional): Filter by collection
- `sort` (optional): Sort order (`price_asc`, `price_desc`, `recent`)

**Response:**
```json
{
  "listings": [
    {
      "listingId": 1,
      "tokenId": 5,
      "price": 1000000,
      "seller": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173",
      "contractId": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-nft-v2-1-3",
      "listedAt": "2024-02-09T10:30:00Z",
      "metadata": {
        "name": "Cool NFT #5",
        "image": "ipfs://Qm..."
      }
    }
  ],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

### Get Single Listing

**Endpoint:** `GET /marketplace/listing/{listingId}`

**Response:**
```json
{
  "listingId": 1,
  "tokenId": 5,
  "price": 1000000,
  "seller": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173",
  "contractId": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-nft-v2-1-3",
  "listedAt": "2024-02-09T10:30:00Z",
  "status": "active"
}
```

### List NFT for Sale

**Endpoint:** `POST /marketplace/list`

**Authentication:** Required

**Request Body:**
```json
{
  "tokenId": 5,
  "price": 1000000,
  "contractId": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-nft-v2-1-3"
}
```

**Response:**
```json
{
  "success": true,
  "listingId": 1,
  "txId": "0x1234567890abcdef...",
  "status": "pending"
}
```

### Purchase NFT

**Endpoint:** `POST /marketplace/purchase`

**Authentication:** Required

**Request Body:**
```json
{
  "listingId": 1
}
```

**Response:**
```json
{
  "success": true,
  "tokenId": 5,
  "txId": "0x1234567890abcdef...",
  "status": "pending"
}
```

### Unlist NFT

**Endpoint:** `POST /marketplace/unlist`

**Authentication:** Required

**Request Body:**
```json
{
  "listingId": 1
}
```

**Response:**
```json
{
  "success": true,
  "txId": "0x1234567890abcdef...",
  "status": "pending"
}
```

## Collection Endpoints

### Get All Collections

**Endpoint:** `GET /collections`

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "collections": [
    {
      "id": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-collection-v2-1-3",
      "name": "Cool Collection",
      "symbol": "COOL",
      "baseUri": "ipfs://base/",
      "creator": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173",
      "totalSupply": 100,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 10,
  "limit": 20,
  "offset": 0
}
```

### Get Collection Details

**Endpoint:** `GET /collections/{collectionId}`

**Response:**
```json
{
  "id": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-collection-v2-1-3",
  "name": "Cool Collection",
  "symbol": "COOL",
  "baseUri": "ipfs://base/",
  "creator": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173",
  "totalSupply": 100,
  "floorPrice": 500000,
  "volume24h": 5000000,
  "createdAt": "2024-01-01T00:00:00Z",
  "description": "A cool NFT collection"
}
```

### Get Collection NFTs

**Endpoint:** `GET /collections/{collectionId}/nfts`

**Query Parameters:**
- `limit` (optional): Number of results
- `offset` (optional): Pagination offset

**Response:**
```json
{
  "nfts": [
    {
      "tokenId": 1,
      "owner": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173",
      "metadata": {
        "name": "Cool NFT #1",
        "image": "ipfs://Qm..."
      }
    }
  ],
  "total": 100,
  "limit": 20,
  "offset": 0
}
```

## Analytics Endpoints

### Get Platform Stats

**Endpoint:** `GET /analytics/stats`

**Response:**
```json
{
  "totalVolume": 50000000,
  "totalNFTs": 10000,
  "totalCollections": 50,
  "activeListings": 500,
  "volume24h": 1000000,
  "sales24h": 25
}
```

### Get Collection Stats

**Endpoint:** `GET /analytics/collection/{collectionId}`

**Response:**
```json
{
  "collectionId": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-collection-v2-1-3",
  "floorPrice": 500000,
  "totalVolume": 5000000,
  "volume24h": 100000,
  "sales24h": 5,
  "averagePrice": 800000,
  "holders": 75
}
```

## Transaction Endpoints

### Get Transaction Status

**Endpoint:** `GET /transaction/{txId}`

**Response:**
```json
{
  "txId": "0x1234567890abcdef...",
  "status": "success",
  "type": "mint",
  "blockHeight": 100000,
  "timestamp": "2024-02-09T10:30:00Z",
  "details": {
    "tokenId": 123
  }
}
```

### Get User Transactions

**Endpoint:** `GET /transaction/user/{address}`

**Query Parameters:**
- `limit` (optional): Number of results
- `offset` (optional): Pagination offset
- `type` (optional): Filter by type (`mint`, `transfer`, `list`, `purchase`)

**Response:**
```json
{
  "transactions": [
    {
      "txId": "0x1234567890abcdef...",
      "type": "purchase",
      "status": "success",
      "timestamp": "2024-02-09T10:30:00Z",
      "tokenId": 5,
      "price": 1000000
    }
  ],
  "total": 50,
  "limit": 20,
  "offset": 0
}
```

## Error Responses

All error responses follow this format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": {}
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_REQUEST` | 400 | Invalid request parameters |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict (e.g., already listed) |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

## Rate Limiting

- **Authenticated requests:** 100 requests per minute
- **Unauthenticated requests:** 20 requests per minute

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1612876800
```

## Webhooks

Subscribe to real-time events via webhooks.

**Endpoint:** `POST /webhooks/subscribe`

**Request Body:**
```json
{
  "url": "https://your-domain.com/webhook",
  "events": ["nft.minted", "nft.transferred", "listing.created", "sale.completed"]
}
```

**Webhook Payload Example:**
```json
{
  "event": "sale.completed",
  "timestamp": "2024-02-09T10:30:00Z",
  "data": {
    "listingId": 1,
    "tokenId": 5,
    "buyer": "SP...",
    "seller": "SP...",
    "price": 1000000,
    "txId": "0x..."
  }
}
```
