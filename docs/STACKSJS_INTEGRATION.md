# Stacks.js Integration Guide

## Overview

This guide covers integrating with the AuroraMint smart contracts using Stacks.js. Learn how to interact with NFTs, collections, and the marketplace from your JavaScript application.

## Installation

```bash
npm install @stacks/transactions @stacks/network @stacks/connect
```

## Network Configuration

Use the centralized network configuration:

```typescript
import { getNetwork, getCurrentNetworkKey, isMainnet } from './lib/network';

// Get current network
const network = getNetwork();
const networkKey = getCurrentNetworkKey();

// Check environment
if (isMainnet()) {
  console.log('Running on mainnet');
}
```

## Contract Calls

### Minting an NFT

```typescript
import { buildMintNFTOptions } from './lib/contracts';
import { openContractCall } from '@stacks/connect';

async function mintNFT() {
  const options = buildMintNFTOptions({
    uri: 'ipfs://Qm...',
    collectionId: 1,
    royaltyPercent: 5, // 5% royalty
  });

  await openContractCall({
    ...options,
    onFinish: (data) => {
      console.log('Transaction broadcast:', data.txId);
    },
    onCancel: () => {
      console.log('User cancelled');
    },
  });
}
```

### Listing an NFT for Sale

```typescript
import { buildListNFTOptions } from './lib/contracts';
import { stxToMicroSTX } from './lib/contracts';

async function listNFT(tokenId: number, priceInSTX: number) {
  const options = buildListNFTOptions({
    tokenId,
    price: stxToMicroSTX(priceInSTX),
    expirationBlock: currentBlock + 4320, // ~30 days
  });

  await openContractCall({
    ...options,
    onFinish: (data) => {
      console.log('NFT listed:', data.txId);
    },
  });
}
```

### Buying an NFT (with Post Conditions)

```typescript
import { buildBuyNFTOptions } from './lib/contracts';
import { userSession } from './lib/stacks';

async function buyNFT(tokenId: number, price: number, seller: string) {
  const buyerAddress = userSession.loadUserData()?.profile?.stxAddress?.mainnet;
  
  // Post conditions ensure transaction safety
  const options = buildBuyNFTOptions(
    {
      tokenId,
      price,
      seller,
    },
    'mainnet',
    buyerAddress
  );

  await openContractCall({
    ...options,
    onFinish: (data) => {
      console.log('Purchase initiated:', data.txId);
      // Monitor transaction confirmation
      waitForConfirmation(data.txId);
    },
  });
}
```

## Transaction Monitoring

### Wait for Confirmation

```typescript
import { api } from './lib/api';

async function waitForConfirmation(txId: string) {
  try {
    const tx = await api.waitForTransactionConfirmation(txId, 30, 10000);
    console.log('Transaction confirmed:', tx);
  } catch (error) {
    console.error('Transaction failed or timed out:', error);
  }
}
```

### Check Transaction Status

```typescript
import { api } from './lib/api';

async function checkStatus(txId: string) {
  const status = await api.getTransactionStatus(txId);
  
  switch (status) {
    case 'success':
      console.log('Transaction succeeded');
      break;
    case 'failed':
      console.log('Transaction failed');
      break;
    case 'pending':
      console.log('Transaction pending');
      break;
  }
}
```

## Read-Only Calls

### Get NFT Metadata

```typescript
import { getNFTMetadata } from './lib/contracts';

async function fetchNFT(tokenId: number) {
  const metadata = await getNFTMetadata(tokenId);
  if (metadata) {
    console.log('NFT URI:', metadata.uri);
    console.log('Owner:', metadata.owner);
  }
}
```

### Get Listing Information

```typescript
import { getListingInfo } from './lib/contracts';
import { parseListingInfo } from './lib/clarity-parser';

async function fetchListing(tokenId: number) {
  const response = await getListingInfo(tokenId);
  const listing = parseListingInfo(response);
  
  if (listing) {
    console.log('Price:', listing.price);
    console.log('Seller:', listing.seller);
  }
}
```

## Parsing Contract Responses

### Using the Parser Utilities

```typescript
import { parseResponse, parseErrorCode } from './lib/clarity-parser';

async function handleContractResponse(clarityValue: ClarityValue) {
  const parsed = parseResponse(clarityValue);
  
  if (parsed.success) {
    console.log('Success:', parsed.value);
  } else {
    const errorMessage = parseErrorCode(parsed.error);
    console.error('Error:', errorMessage);
  }
}
```

### Parsing Complex Data Structures

```typescript
import { parseTuple, parseList } from './lib/clarity-parser';

// Parse tuple response
const collectionData = parseTuple(response);
console.log('Collection name:', collectionData.name);
console.log('Max supply:', collectionData.maxSupply);

// Parse list response
const nftIds = parseList(listResponse);
console.log('NFT IDs:', nftIds);
```

## Post Conditions

Post conditions are critical for transaction safety. They ensure that the blockchain state changes exactly as expected.

### STX Transfer Post Conditions

```typescript
import { Pc } from '@stacks/transactions';

// Ensure exact amount is sent
const postConditions = [
  Pc.principal(senderAddress)
    .willSendEq(1000000n) // exactly 1 STX
    .ustx(),
  
  Pc.principal(recipientAddress)
    .willReceiveGte(975000n) // at least 0.975 STX (after fees)
    .ustx(),
];
```

### NFT Transfer Post Conditions

```typescript
import { Pc } from '@stacks/transactions';

// Ensure NFT ownership transfer
const postConditions = [
  Pc.principal(currentOwner)
    .willSendAsset()
    .nft(contractAddress, contractName, tokenId),
  
  Pc.principal(newOwner)
    .willReceiveAsset()
    .nft(contractAddress, contractName, tokenId),
];
```

## Error Handling

### Common Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 100 | Not the owner | Caller doesn't own the NFT |
| 101 | Already listed | NFT is already listed for sale |
| 102 | Not listed | NFT is not currently listed |
| 103 | Invalid price | Price is below minimum |
| 105 | Cannot buy own NFT | Seller cannot buy their own NFT |
| 110 | Marketplace paused | Marketplace is temporarily paused |

### Handling Errors

```typescript
import { parseErrorCode, isError } from './lib/clarity-parser';

try {
  const result = await callReadOnlyFunction(...);
  
  if (isError(result)) {
    const errorCode = parseValue(result);
    const errorMessage = parseErrorCode(errorCode);
    throw new Error(errorMessage);
  }
} catch (error) {
  console.error('Contract call failed:', error.message);
}
```

## Best Practices

1. **Always use post conditions** for state-changing transactions
2. **Monitor transaction confirmations** before updating UI
3. **Parse error codes** to provide user-friendly messages
4. **Validate inputs** before creating transactions
5. **Use network helpers** to ensure correct environment
6. **Handle wallet cancellations** gracefully
7. **Cache read-only calls** to reduce API load

## Example: Complete NFT Purchase Flow

```typescript
import { buildBuyNFTOptions } from './lib/contracts';
import { api } from './lib/api';
import { parseErrorCode } from './lib/clarity-parser';
import { openContractCall } from '@stacks/connect';

async function completePurchaseFlow(
  tokenId: number,
  price: number,
  seller: string,
  buyerAddress: string
) {
  try {
    // 1. Build transaction with post conditions
    const options = buildBuyNFTOptions(
      { tokenId, price, seller },
      'mainnet',
      buyerAddress
    );

    // 2. Prompt user to sign transaction
    const txData = await openContractCall({
      ...options,
      onFinish: (data) => data,
      onCancel: () => {
        throw new Error('User cancelled transaction');
      },
    });

    console.log('Transaction submitted:', txData.txId);

    // 3. Wait for confirmation
    const confirmedTx = await api.waitForTransactionConfirmation(
      txData.txId,
      30,
      10000
    );

    console.log('Purchase complete!', confirmedTx);
    return confirmedTx;
    
  } catch (error) {
    if (error.message.includes('u10')) {
      console.error('Error:', parseErrorCode(105));
    } else {
      console.error('Purchase failed:', error.message);
    }
    throw error;
  }
}
```

## Resources

- [Stacks.js Documentation](https://docs.stacks.co/build/sdks/stacks.js)
- [Clarity Language Reference](https://docs.stacks.co/clarity)
- [Stacks Explorer](https://explorer.stacks.co)
- [Hiro Platform](https://platform.hiro.so)
