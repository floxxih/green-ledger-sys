# Contract Function Reference

This document provides a comprehensive reference for all smart contract functions available in AuroraMint.

## NFT Contract Functions

### `mint`

Mints a new NFT in the collection.

**Parameters:**
- `recipient` (principal): Address to receive the NFT
- `token-uri` (string-ascii): Metadata URI for the NFT

**Returns:**
- `(response uint uint)`: Token ID on success, error code on failure

**Example:**
```clarity
(contract-call? .stacksmint-nft-v2-1-3 mint tx-sender "ipfs://QmHash...")
```

**Errors:**
- `u100`: Unauthorized
- `u101`: Invalid recipient
- `u102`: Invalid URI

### `transfer`

Transfers an NFT to a new owner.

**Parameters:**
- `token-id` (uint): ID of the NFT to transfer
- `sender` (principal): Current owner
- `recipient` (principal): New owner

**Returns:**
- `(response bool uint)`: true on success, error code on failure

**Example:**
```clarity
(contract-call? .stacksmint-nft-v2-1-3 transfer u1 tx-sender 'SP123...)
```

### `get-owner`

Retrieves the owner of an NFT.

**Parameters:**
- `token-id` (uint): ID of the NFT

**Returns:**
- `(response (optional principal) uint)`: Owner address or none

**Example:**
```clarity
(contract-call? .stacksmint-nft-v2-1-3 get-owner u1)
```

## Marketplace Contract Functions

### `list-asset`

Lists an NFT for sale on the marketplace.

**Parameters:**
- `nft-asset-contract` (principal): NFT contract address
- `token-id` (uint): ID of the NFT
- `price` (uint): Sale price in microSTX

**Returns:**
- `(response uint uint)`: Listing ID on success, error code on failure

**Example:**
```clarity
(contract-call? .stacksmint-marketplace-v2-1-3 list-asset .stacksmint-nft-v2-1-3 u1 u1000000)
```

**Errors:**
- `u200`: Not NFT owner
- `u201`: Invalid price
- `u202`: Already listed

### `unlist-asset`

Removes an NFT listing from the marketplace.

**Parameters:**
- `listing-id` (uint): ID of the listing

**Returns:**
- `(response bool uint)`: true on success, error code on failure

**Example:**
```clarity
(contract-call? .stacksmint-marketplace-v2-1-3 unlist-asset u1)
```

### `purchase-asset`

Purchases a listed NFT.

**Parameters:**
- `listing-id` (uint): ID of the listing
- `nft-asset-contract` (principal): NFT contract address

**Returns:**
- `(response bool uint)`: true on success, error code on failure

**Example:**
```clarity
(contract-call? .stacksmint-marketplace-v2-1-3 purchase-asset u1 .stacksmint-nft-v2-1-3)
```

**Errors:**
- `u203`: Listing not found
- `u204`: Insufficient funds
- `u205`: Transfer failed

## Collection Contract Functions

### `create-collection`

Creates a new NFT collection.

**Parameters:**
- `name` (string-ascii): Collection name
- `symbol` (string-ascii): Collection symbol
- `base-uri` (string-ascii): Base URI for metadata

**Returns:**
- `(response uint uint)`: Collection ID on success, error code on failure

**Example:**
```clarity
(contract-call? .stacksmint-collection-v2-1-3 create-collection "My Collection" "MYC" "ipfs://base/")
```

### `update-collection-metadata`

Updates collection metadata.

**Parameters:**
- `collection-id` (uint): ID of the collection
- `new-base-uri` (string-ascii): New base URI

**Returns:**
- `(response bool uint)`: true on success, error code on failure

**Example:**
```clarity
(contract-call? .stacksmint-collection-v2-1-3 update-collection-metadata u1 "ipfs://new-base/")
```

## Treasury Contract Functions

### `withdraw-funds`

Withdraws funds from the treasury.

**Parameters:**
- `amount` (uint): Amount to withdraw in microSTX
- `recipient` (principal): Address to receive funds

**Returns:**
- `(response bool uint)`: true on success, error code on failure

**Example:**
```clarity
(contract-call? .stacksmint-treasury-v2-1 withdraw-funds u1000000 tx-sender)
```

**Errors:**
- `u300`: Unauthorized
- `u301`: Insufficient balance
- `u302`: Transfer failed

### `get-balance`

Retrieves the treasury balance.

**Returns:**
- `(response uint uint)`: Balance in microSTX

**Example:**
```clarity
(contract-call? .stacksmint-treasury-v2-1 get-balance)
```

## Error Codes Reference

| Code | Description |
|------|-------------|
| u100 | Unauthorized NFT operation |
| u101 | Invalid recipient address |
| u102 | Invalid token URI |
| u200 | Not NFT owner |
| u201 | Invalid listing price |
| u202 | NFT already listed |
| u203 | Listing not found |
| u204 | Insufficient funds for purchase |
| u205 | NFT transfer failed |
| u300 | Unauthorized treasury operation |
| u301 | Insufficient treasury balance |
| u302 | Treasury transfer failed |
