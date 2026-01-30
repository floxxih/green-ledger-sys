# StackMint - Decentralized NFT Marketplace on Stacks

StackMint is a premier NFT marketplace and auction platform built on the Stacks blockchain, leveraging Clarity smart contracts for secure, transparent, and efficient digital asset trading.

## Key Features

- **NFT Minting**: Create and deploy SIP-009 compliant NFTs with customizable metadata.
- **Marketplace**: List NFTs for sale with fixed prices or open offers.
- **Auctions**: Create time-bound auctions with reserve prices and extended bidding periods.
- **Bundles**: Sell multiple NFTs as a single package.
- **Escrow System**: Secure fund management ensuring safe transactions between buyers and sellers.
- **Royalty Support**: Built-in royalty enforcement for creators on secondary sales.

## Project Structure

- `contracts/`: Clarity smart contracts (SIP-009 NFT, Marketplace, Treasury).
- `frontend/`: Next.js 14 frontend application.
- `tests/`: Clarinet test suite (in progress).

## Getting Started

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) (for contract development)
- Node.js v18+ & npm/yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/stacksmint/stacksmint.git
   cd stacksmint
   ```

2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```

### Development

To run the local Stacks devnet and test contracts:

```bash
clarinet integrate
```

To start the frontend:

```bash
cd frontend
npm run dev
```

## Contributing

Please check `CONTRIBUTING.md` for details on how to contribute to this project.

## License

MIT
