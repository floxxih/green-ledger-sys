# StackMint Frontend

The official frontend for the StackMint NFT Marketplace.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Adjust the variables if you are connecting to Mainnet or Testnet. By default, it is configured for local Devnet.

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## Contract Integration

The application uses `@stacks/connect` and `@stacks/network` to interact with the blockchain.
Contract addresses are defined in `src/lib/constants.ts`.

## Generating Types

To ensure type safety when interacting with contracts, we recommend using `clarigen`.
(Scripts coming soon).
