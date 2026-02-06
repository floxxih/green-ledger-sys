# AuroraMint

AuroraMint is a decentralized NFT marketplace on Stacks built for creators, collectors, and teams who want flexible minting, transparent trading, and Bitcoin-secured settlement.

## What AuroraMint Delivers

- **Creator-first minting** with SIP-009 NFTs, metadata control, and royalties.
- **Multi-mode trading** including fixed-price listings, offers, and auctions.
- **Bundle sales** for drops, collections, and multi-asset deals.
- **Escrow-backed settlement** to keep buyers and sellers protected.
- **Clear auditability** through Clarity smart contracts and on-chain history.

## Repo Layout

- `contracts/`: Clarity smart contracts for NFTs, marketplace, and treasury.
- `frontend/`: Next.js frontend experience.
- `tests/`: Clarinet and Vitest coverage for contracts.
- `deployments/`: Example deployment plans for mainnet and devnet.

## Getting Started

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet)
- Node.js v18+

### Install

```bash
git clone https://github.com/floxxih/green-ledger-sys.git
cd green-ledger-sys
npm install
cd frontend && npm install
```

### Development

Run the local Stacks devnet and contract suite:

```bash
clarinet integrate
```

Launch the frontend:

```bash
cd frontend
npm run dev
```

## Configuration

- Frontend configuration and contract addresses live in `frontend/src/lib/constants.ts`.
- Example environment variables are in `frontend/.env.example`.

## Testing

AuroraMint includes comprehensive test coverage for all smart contract functionality using Clarinet SDK and Vitest.

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test marketplace-auctions

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure

- `tests/` - Main test directory
  - `collection-*.test.ts` - Collection contract tests
  - `nft-*.test.ts` - NFT contract tests
  - `marketplace-*.test.ts` - Marketplace contract tests
  - `helpers/` - Shared test utilities
  - `wrappers/` - Contract wrapper functions

### Test Coverage Areas

**NFT Contract Tests**
- Basic minting and transfers
- Metadata management
- Ownership verification
- Delegation mechanisms

**Collection Contract Tests**
- Collection creation and configuration
- Minting within collections
- Royalty configuration (0-25%)
- Access control

**Marketplace Contract Tests**
- Fixed-price listings
- Offers and counter-offers
- Auction mechanics (bidding, extension, settlement)
- Bundle sales (up to 10 NFTs)
- Royalty distribution
- Fee calculations

**Advanced Test Scenarios**
- Auction bid increments (5% minimum)
- Last-minute auction extensions
- Bundle size constraints
- Royalty enforcement on secondary sales
- Combined fee and royalty calculations

### Test Helpers

Common utilities are available in `tests/helpers/test-utils.ts`:

```typescript
import {
  ONE_STX,
  calculateMarketplaceFee,
  calculateRoyalty,
  mockIpfsUri,
  hoursToBlocks,
} from './helpers/test-utils';

// Convert 5 STX to microSTX
const price = 5 * ONE_STX;

// Calculate fees
const fee = calculateMarketplaceFee(price);
const royalty = calculateRoyalty(price, 1000); // 10% royalty

// Generate mock data
const uri = mockIpfsUri(1); // ipfs://Qm1
const duration = hoursToBlocks(24); // ~144 blocks
```

### Writing Tests

Example test using helpers:

```typescript
import { describe, it, expect } from "vitest";
import { Cl } from "@hirosystems/clarinet-sdk";
import { ONE_STX, ERR_INVALID_PRICE } from "./helpers/test-utils";
import { StacksmintMarketplace } from "./wrappers/marketplace";

describe("My Test", () => {
  it("should reject invalid price", () => {
    const result = simnet.mineBlock([
      StacksmintMarketplace.listNft(1, 100, seller) // Below minimum
    ]);
    expect(result[0].result).toBeErr(ERR_INVALID_PRICE);
  });
});
```

### Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Pre-deployment verification

See `.github/workflows/contracts.yaml` for CI configuration.

## Contributing

Review `CONTRIBUTING.md` for branching, testing, and release workflows.

## License

MIT
