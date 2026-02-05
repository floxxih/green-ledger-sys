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

```bash
clarinet check
npm test
```

## Contributing

Review `CONTRIBUTING.md` for branching, testing, and release workflows.

## License

MIT
