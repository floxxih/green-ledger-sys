# AuroraMint API Documentation

Complete API documentation for developers building on AuroraMint.

## 📚 Documentation Structure

### Getting Started

1. **[Contract Function Reference](./contract-functions.md)** - Complete reference for all smart contract functions
2. **[Frontend Integration Guide](./frontend-integration.md)** - How to integrate AuroraMint into your frontend
3. **[Code Examples](./examples.md)** - Practical examples for common use cases
4. **[REST API Endpoints](./endpoints.md)** - HTTP API reference
5. **[API Playground Setup](./playground-setup.md)** - Set up interactive API testing
6. **[OpenAPI Specification](./openapi.yaml)** - Machine-readable API spec

## 🚀 Quick Start

### For Smart Contract Developers

```clarity
;; Mint an NFT
(contract-call? .stacksmint-nft-v2-1-3 mint tx-sender "ipfs://QmHash...")

;; List NFT for sale
(contract-call? .stacksmint-marketplace-v2-1-3 list-asset 
  .stacksmint-nft-v2-1-3 
  u1 
  u1000000)
```

### For Frontend Developers

```typescript
import { openContractCall } from '@stacks/connect';
import { principalCV, stringAsciiCV } from '@stacks/transactions';

// Mint NFT
await openContractCall({
  contractAddress: 'SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173',
  contractName: 'stacksmint-nft-v2-1-3',
  functionName: 'mint',
  functionArgs: [
    principalCV(recipient),
    stringAsciiCV(tokenUri)
  ],
  onFinish: (data) => console.log(data.txId)
});
```

### For Backend Developers

```bash
# Get NFT details
curl https://api.auroramint.io/v1/nft/123

# List NFT for sale
curl -X POST https://api.auroramint.io/v1/marketplace/list \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tokenId": 123,
    "price": 1000000,
    "contractId": "SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-nft-v2-1-3"
  }'
```

## 📖 Core Concepts

### NFT Contracts

AuroraMint uses the SIP-009 NFT standard. Each NFT has:
- **Token ID**: Unique identifier
- **Owner**: Current holder's principal
- **Token URI**: Link to metadata (IPFS)
- **Contract ID**: Deploying contract address

### Marketplace

The marketplace contract handles:
- Listing NFTs for sale
- Processing purchases
- Managing royalties
- Unlisting NFTs

### Collections

Collections group related NFTs:
- Shared metadata base URI
- Common symbol and name
- Creator attribution

## 🔑 Authentication

Most write operations require wallet authentication using Stacks Connect:

```typescript
import { showConnect } from '@stacks/connect';

showConnect({
  appDetails: {
    name: 'Your App',
    icon: 'https://your-app.com/icon.png'
  },
  onFinish: () => {
    // User authenticated
  },
  userSession
});
```

## 🛠️ Tools & SDKs

### JavaScript/TypeScript
- **@stacks/connect**: Wallet connectivity
- **@stacks/transactions**: Transaction building
- **@stacks/network**: Network configuration

### Python
```bash
pip install stacks-blockchain
```

### CLI
```bash
npm install -g @stacks/cli
```

## 📦 Contract Addresses

### Mainnet

| Contract | Address |
|----------|---------|
| NFT v2.1.3 | `SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-nft-v2-1-3` |
| Marketplace v2.1.3 | `SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-marketplace-v2-1-3` |
| Collection v2.1.3 | `SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-collection-v2-1-3` |
| Treasury v2.1 | `SP2X0TZ59D5SZ8ACQ6YMCHHNR2ZN51Z32E2CJ173.stacksmint-treasury-v2-1` |

### Testnet

| Contract | Address |
|----------|---------|
| NFT v2.1.3 | `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stacksmint-nft-v2-1-3` |
| Marketplace v2.1.3 | `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stacksmint-marketplace-v2-1-3` |

## 🎯 Common Use Cases

### 1. Build an NFT Minting Platform
- [Minting Guide](./frontend-integration.md#1-mint-an-nft)
- [Metadata Best Practices](./examples.md#example-1-complete-nft-minting-flow)

### 2. Create an NFT Marketplace
- [Marketplace Integration](./frontend-integration.md#2-list-nft-on-marketplace)
- [Complete Example](./examples.md#example-2-nft-marketplace-with-react)

### 3. Manage NFT Collections
- [Collection Management](./contract-functions.md#collection-contract-functions)
- [Code Example](./examples.md#example-3-collection-management)

### 4. Query NFT Data
- [Read-Only Functions](./contract-functions.md#get-owner)
- [REST API](./endpoints.md#get-nft-details)

## 🔒 Error Handling

All contract errors are documented with codes and messages:

```typescript
try {
  await mintNFT(recipient, tokenUri);
} catch (error) {
  if (error.message.includes('u100')) {
    console.error('Unauthorized to mint');
  } else if (error.message.includes('u102')) {
    console.error('Invalid token URI');
  }
}
```

See [Error Codes Reference](./contract-functions.md#error-codes-reference) for complete list.

## 📊 Rate Limits

### REST API
- **Authenticated**: 100 requests/minute
- **Unauthenticated**: 20 requests/minute

### Contract Calls
- Limited by Stacks blockchain capacity
- ~30 second block time
- Use nonces for sequential transactions

## 🧪 Testing

### Testnet Setup

```typescript
import { StacksTestnet } from '@stacks/network';

const network = new StacksTestnet();

// Get testnet STX from faucet
// https://explorer.stacks.co/sandbox/faucet
```

### Local Development

```bash
# Install Clarinet
npm install -g @hirosystems/clarinet

# Run local devnet
clarinet integrate
```

## 📞 Support

- **Documentation Issues**: [GitHub Issues](https://github.com/auroramint/auroramint/issues)
- **Discord**: [Join our community](https://discord.gg/auroramint)
- **Email**: support@auroramint.io

## 🔄 API Versioning

Current version: **v1**

- All API endpoints are prefixed with `/v1`
- Breaking changes will increment the version
- Deprecated versions supported for 6 months

## 📝 Changelog

### v1.0.0 (2024-02-09)
- Initial API documentation release
- OpenAPI 3.0 specification
- Complete contract function reference
- Frontend integration examples
- Interactive API playground

## 🤝 Contributing

Found an error or want to improve the docs?

1. Fork the repository
2. Make your changes
3. Submit a pull request

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## 📄 License

This documentation is licensed under MIT License.

API usage is subject to [Terms of Service](https://auroramint.io/terms).

---

**Ready to build?** Start with the [Frontend Integration Guide](./frontend-integration.md) or explore [Code Examples](./examples.md).
