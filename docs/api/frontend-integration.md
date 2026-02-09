# Frontend Integration Guide

This guide shows how to integrate AuroraMint functionality into your frontend application.

## Installation

```bash
npm install @stacks/connect @stacks/transactions @stacks/network
```

## Setup

### Initialize Stacks Connection

```typescript
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const network = new StacksMainnet(); // or StacksTestnet() for testing

function authenticate() {
  showConnect({
    appDetails: {
      name: 'AuroraMint DApp',
      icon: window.location.origin + '/logo.png',
    },
    redirectTo: '/',
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
}
```

## Common Operations

### 1. Mint an NFT

```typescript
import { openContractCall } from '@stacks/connect';
import { 
  uintCV, 
  stringAsciiCV, 
  makeStandardSTXPostCondition,
  FungibleConditionCode,
  PostConditionMode
} from '@stacks/transactions';

async function mintNFT(recipient: string, tokenUri: string) {
  const functionArgs = [
    principalCV(recipient),
    stringAsciiCV(tokenUri)
  ];

  const options = {
    network,
    contractAddress: 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173',
    contractName: 'stacksmint-nft-v2-1-3',
    functionName: 'mint',
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    onFinish: (data) => {
      console.log('Transaction ID:', data.txId);
      console.log('Raw TX:', data.txRaw);
    },
  };

  await openContractCall(options);
}
```

### 2. List NFT on Marketplace

```typescript
async function listNFT(tokenId: number, price: number) {
  const nftContract = 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-nft-v2-1-3';
  
  const functionArgs = [
    contractPrincipalCV(
      'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173',
      'stacksmint-nft-v2-1-3'
    ),
    uintCV(tokenId),
    uintCV(price)
  ];

  const options = {
    network,
    contractAddress: 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173',
    contractName: 'stacksmint-marketplace-v2-1-3',
    functionName: 'list-asset',
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    onFinish: (data) => {
      console.log('NFT listed! TX:', data.txId);
    },
  };

  await openContractCall(options);
}
```

### 3. Purchase NFT

```typescript
import { principalCV } from '@stacks/transactions';

async function purchaseNFT(listingId: number, price: number) {
  const sellerAddress = 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173';
  
  // Add post-condition to ensure payment amount is correct
  const postCondition = makeStandardSTXPostCondition(
    userSession.loadUserData().profile.stxAddress.mainnet,
    FungibleConditionCode.Equal,
    price
  );

  const functionArgs = [
    uintCV(listingId),
    contractPrincipalCV(
      'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173',
      'stacksmint-nft-v2-1-3'
    )
  ];

  const options = {
    network,
    contractAddress: 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173',
    contractName: 'stacksmint-marketplace-v2-1-3',
    functionName: 'purchase-asset',
    functionArgs,
    postConditions: [postCondition],
    postConditionMode: PostConditionMode.Deny,
    onFinish: (data) => {
      console.log('Purchase successful! TX:', data.txId);
    },
  };

  await openContractCall(options);
}
```

### 4. Get NFT Owner

```typescript
import { callReadOnlyFunction, principalCV } from '@stacks/transactions';

async function getNFTOwner(tokenId: number): Promise<string | null> {
  const options = {
    network,
    contractAddress: 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173',
    contractName: 'stacksmint-nft-v2-1-3',
    functionName: 'get-owner',
    functionArgs: [uintCV(tokenId)],
    senderAddress: 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173',
  };

  const result = await callReadOnlyFunction(options);
  
  if (result.type === 'ok') {
    const ownerCV = result.value;
    if (ownerCV.type === 'some') {
      return cvToString(ownerCV.value);
    }
  }
  
  return null;
}
```

### 5. Transfer NFT

```typescript
async function transferNFT(tokenId: number, recipient: string) {
  const sender = userSession.loadUserData().profile.stxAddress.mainnet;
  
  const functionArgs = [
    uintCV(tokenId),
    principalCV(sender),
    principalCV(recipient)
  ];

  const options = {
    network,
    contractAddress: 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173',
    contractName: 'stacksmint-nft-v2-1-3',
    functionName: 'transfer',
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    onFinish: (data) => {
      console.log('Transfer successful! TX:', data.txId);
    },
  };

  await openContractCall(options);
}
```

## React Hooks

### Custom Hook for NFT Operations

```typescript
import { useState, useCallback } from 'react';
import { useConnect } from '@stacks/connect-react';

export function useNFT() {
  const { doContractCall } = useConnect();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mint = useCallback(async (recipient: string, tokenUri: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await doContractCall({
        contractAddress: 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173',
        contractName: 'stacksmint-nft-v2-1-3',
        functionName: 'mint',
        functionArgs: [principalCV(recipient), stringAsciiCV(tokenUri)],
        onFinish: (data) => {
          console.log('Minted NFT:', data.txId);
          setLoading(false);
        },
        onCancel: () => {
          setLoading(false);
        },
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [doContractCall]);

  return { mint, loading, error };
}
```

## Error Handling

```typescript
function handleTransactionError(error: any) {
  if (error.code === 'INSUFFICIENT_FUNDS') {
    return 'You do not have enough STX for this transaction.';
  } else if (error.code === 'UNAUTHORIZED') {
    return 'You are not authorized to perform this action.';
  } else if (error.code === 'NFT_NOT_FOUND') {
    return 'The requested NFT does not exist.';
  }
  
  return 'An unexpected error occurred. Please try again.';
}
```

## Best Practices

1. **Always use Post Conditions**: Protect users by specifying expected state changes
2. **Handle User Rejection**: Gracefully handle when users cancel transactions
3. **Show Transaction Status**: Provide feedback during transaction processing
4. **Cache Read-Only Calls**: Cache results from read-only functions to reduce API calls
5. **Validate Input**: Always validate user input before making contract calls
6. **Use TypeScript**: Leverage type safety for better developer experience

## Next Steps

- Check out the [API Reference](./contract-functions.md) for complete function documentation
- See [Code Examples](./examples.md) for more advanced use cases
- Review [Error Codes](./contract-functions.md#error-codes-reference) for troubleshooting
