# Postman Collection for AuroraMint API

This Postman collection provides examples of all authenticated API endpoints.

## Setup

1. Import this collection into Postman
2. Set the `base_url` variable to `https://api.auroramint.io/v1`
3. Set the `auth_token` variable after logging in

## Authentication

### Login
```json
{
  "method": "POST",
  "url": "{{base_url}}/auth/login",
  "body": {
    "email": "{{email}}",
    "password": "{{password}}"
  }
}
```

### Set Auth Token
After login, set the `auth_token` collection variable with the response token.

## Endpoints

### User Profile
```
GET {{base_url}}/user/profile
Authorization: Bearer {{auth_token}}
```

### Get User NFTs
```
GET {{base_url}}/nfts/owner/{{wallet_address}}?limit=20&offset=0
Authorization: Bearer {{auth_token}}
```

### Mint NFT
```
POST {{base_url}}/nfts/mint
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "collectionId": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-collection-v2-1-3",
  "recipient": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173",
  "metadata": {
    "name": "My NFT",
    "description": "An awesome NFT",
    "image": "ipfs://Qm...",
    "attributes": []
  }
}
```

### List NFT
```
POST {{base_url}}/marketplace/list
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "tokenId": 123,
  "price": 1000000,
  "contractId": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-nft-v2-1-3"
}
```

### Purchase NFT
```
POST {{base_url}}/marketplace/purchase
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "listingId": 456
}
```

### Unlist NFT
```
POST {{base_url}}/marketplace/unlist
Authorization: Bearer {{auth_token}}
Content-Type: application/json

{
  "listingId": 456
}
```

## Environment Variables

```json
{
  "base_url": "https://api.auroramint.io/v1",
  "auth_token": "",
  "wallet_address": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173"
}
```

## Testing

Each request includes tests to verify:
- Response status code
- Response time
- Response schema
- Authorization header presence
