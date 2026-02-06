import { describe, it, expect, beforeEach } from 'vitest';
import { Clarinet, Tx, Chain, Account, types } from '@hirosystems/clarinet-sdk';

/**
 * Auction Tests for StacksMint Marketplace v2.1.3
 * 
 * Tests auction creation, bidding, extension, and settlement flows
 */
describe('Marketplace Auctions', () => {
  let deployer: Account;
  let seller: Account;
  let bidder1: Account;
  let bidder2: Account;
  let bidder3: Account;

  beforeEach(() => {
    // Account setup happens automatically via Clarinet
  });

  describe('Auction Creation', () => {
    it('should create auction with valid reserve price', () => {
      Clarinet.test({
        name: 'Create auction with reserve price',
        async fn(chain: Chain, accounts: Map<string, Account>) {
          deployer = accounts.get('deployer')!;
          seller = accounts.get('wallet_1')!;

          const tokenId = 1;
          const reservePrice = 1000000; // 1 STX
          const duration = 144; // ~1 day

          // First mint NFT
          let block = chain.mineBlock([
            Tx.contractCall(
              'stacksmint-nft-v2-1-3',
              'mint',
              [types.ascii('ipfs://test'), types.none()],
              seller.address
            ),
          ]);
          block.receipts[0].result.expectOk();

          // Create auction
          block = chain.mineBlock([
            Tx.contractCall(
              'stacksmint-marketplace-v2-1-3',
              'create-auction',
              [
                types.uint(tokenId),
                types.uint(reservePrice),
                types.uint(duration),
              ],
              seller.address
            ),
          ]);

          block.receipts[0].result.expectOk();
          
          // Verify auction data
          const auctionData = chain.callReadOnlyFn(
            'stacksmint-marketplace-v2-1-3',
            'get-auction',
            [types.uint(1)],
            seller.address
          );
          
          const auction = auctionData.result.expectSome().expectTuple();
          expect(auction['reserve-price']).toBe(types.uint(reservePrice));
          expect(auction['seller']).toBe(types.principal(seller.address));
        },
      });
    });

    it('should fail to create auction with invalid reserve price', () => {
      Clarinet.test({
        name: 'Reject auction with zero reserve price',
        async fn(chain: Chain, accounts: Map<string, Account>) {
          seller = accounts.get('wallet_1')!;
          const tokenId = 1;

          const block = chain.mineBlock([
            Tx.contractCall(
              'stacksmint-marketplace-v2-1-3',
              'create-auction',
              [
                types.uint(tokenId),
                types.uint(0), // Invalid
                types.uint(144),
              ],
              seller.address
            ),
          ]);

          block.receipts[0].result.expectErr(types.uint(103)); // ERR_INVALID_PRICE
        },
      });
    });

    it('should fail when non-owner tries to create auction', () => {
      Clarinet.test({
        name: 'Only NFT owner can create auction',
        async fn(chain: Chain, accounts: Map<string, Account>) {
          seller = accounts.get('wallet_1')!;
          bidder1 = accounts.get('wallet_2')!;

          // Mint NFT as seller
          let block = chain.mineBlock([
            Tx.contractCall(
              'stacksmint-nft-v2-1-3',
              'mint',
              [types.ascii('ipfs://test'), types.none()],
              seller.address
            ),
          ]);

          // Try to create auction as non-owner
          block = chain.mineBlock([
            Tx.contractCall(
              'stacksmint-marketplace-v2-1-3',
              'create-auction',
              [types.uint(1), types.uint(1000000), types.uint(144)],
              bidder1.address
            ),
          ]);

          block.receipts[0].result.expectErr(types.uint(100)); // ERR_NOT_OWNER
        },
      });
    });
  });

  describe('Auction Bidding', () => {
    it('should accept valid bid above reserve price', () => {
      Clarinet.test({
        name: 'Place bid above reserve',
        async fn(chain: Chain, accounts: Map<string, Account>) {
          seller = accounts.get('wallet_1')!;
          bidder1 = accounts.get('wallet_2')!;

          const reservePrice = 1000000; // 1 STX
          const bidAmount = 1500000; // 1.5 STX

          // Setup: mint and create auction
          let block = chain.mineBlock([
            Tx.contractCall(
              'stacksmint-nft-v2-1-3',
              'mint',
              [types.ascii('ipfs://test'), types.none()],
              seller.address
            ),
          ]);

          block = chain.mineBlock([
            Tx.contractCall(
              'stacksmint-marketplace-v2-1-3',
              'create-auction',
              [types.uint(1), types.uint(reservePrice), types.uint(144)],
              seller.address
            ),
          ]);

          // Place bid
          block = chain.mineBlock([
            Tx.contractCall(
              'stacksmint-marketplace-v2-1-3',
              'place-bid',
              [types.uint(1), types.uint(bidAmount)],
              bidder1.address
            ),
          ]);

          block.receipts[0].result.expectOk();
          
          // Verify bid was recorded
          const auctionData = chain.callReadOnlyFn(
            'stacksmint-marketplace-v2-1-3',
            'get-auction',
            [types.uint(1)],
            bidder1.address
          );
          
          const auction = auctionData.result.expectSome().expectTuple();
          expect(auction['current-bid']).toBe(types.uint(bidAmount));
          expect(auction['highest-bidder']).toBe(types.some(types.principal(bidder1.address)));
        },
      });
    });

    it('should reject bid below reserve price', () => {
      Clarinet.test({
        name: 'Reject low bid',
        async fn(chain: Chain, accounts: Map<string, Account>) {
          seller = accounts.get('wallet_1')!;
          bidder1 = accounts.get('wallet_2')!;

          const reservePrice = 1000000;
          const lowBid = 500000; // Below reserve

          // Setup auction
          let block = chain.mineBlock([
            Tx.contractCall('stacksmint-nft-v2-1-3', 'mint', 
              [types.ascii('ipfs://test'), types.none()], seller.address),
          ]);

          block = chain.mineBlock([
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'create-auction',
              [types.uint(1), types.uint(reservePrice), types.uint(144)], seller.address),
          ]);

          // Try low bid
          block = chain.mineBlock([
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'place-bid',
              [types.uint(1), types.uint(lowBid)], bidder1.address),
          ]);

          block.receipts[0].result.expectErr(types.uint(113)); // ERR_BID_TOO_LOW
        },
      });
    });

    it('should require minimum bid increment for outbidding', () => {
      Clarinet.test({
        name: 'Enforce minimum bid increment',
        async fn(chain: Chain, accounts: Map<string, Account>) {
          seller = accounts.get('wallet_1')!;
          bidder1 = accounts.get('wallet_2')!;
          bidder2 = accounts.get('wallet_3')!;

          // Setup auction with first bid
          let block = chain.mineBlock([
            Tx.contractCall('stacksmint-nft-v2-1-3', 'mint',
              [types.ascii('ipfs://test'), types.none()], seller.address),
          ]);

          block = chain.mineBlock([
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'create-auction',
              [types.uint(1), types.uint(1000000), types.uint(144)], seller.address),
          ]);

          block = chain.mineBlock([
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'place-bid',
              [types.uint(1), types.uint(1000000)], bidder1.address),
          ]);

          // Try to outbid with insufficient increment (need 5% minimum)
          const insufficientBid = 1010000; // Only 1% more
          block = chain.mineBlock([
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'place-bid',
              [types.uint(1), types.uint(insufficientBid)], bidder2.address),
          ]);

          block.receipts[0].result.expectErr(types.uint(113)); // ERR_BID_TOO_LOW

          // Now try with valid increment
          const validBid = 1050000; // 5% more
          block = chain.mineBlock([
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'place-bid',
              [types.uint(1), types.uint(validBid)], bidder2.address),
          ]);

          block.receipts[0].result.expectOk();
        },
      });
    });

    it('should extend auction on last-minute bids', () => {
      Clarinet.test({
        name: 'Extend auction end time for late bids',
        async fn(chain: Chain, accounts: Map<string, Account>) {
          seller = accounts.get('wallet_1')!;
          bidder1 = accounts.get('wallet_2')!;

          const duration = 144; // blocks

          // Setup auction
          let block = chain.mineBlock([
            Tx.contractCall('stacksmint-nft-v2-1-3', 'mint',
              [types.ascii('ipfs://test'), types.none()], seller.address),
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'create-auction',
              [types.uint(1), types.uint(1000000), types.uint(duration)], seller.address),
          ]);

          const startBlock = block.height;

          // Mine blocks close to end
          chain.mineEmptyBlockUntil(startBlock + duration - 10);

          // Get original end block
          let auctionData = chain.callReadOnlyFn(
            'stacksmint-marketplace-v2-1-3', 'get-auction',
            [types.uint(1)], seller.address
          );
          const originalEndBlock = auctionData.result.expectSome().expectTuple()['end-block'];

          // Place bid near end
          block = chain.mineBlock([
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'place-bid',
              [types.uint(1), types.uint(1500000)], bidder1.address),
          ]);

          // Verify extension happened (should add ~12 hours / 72 blocks)
          auctionData = chain.callReadOnlyFn(
            'stacksmint-marketplace-v2-1-3', 'get-auction',
            [types.uint(1)], seller.address
          );
          const newEndBlock = auctionData.result.expectSome().expectTuple()['end-block'];
          
          expect(Number(newEndBlock)).toBeGreaterThan(Number(originalEndBlock));
        },
      });
    });
  });

  describe('Auction Settlement', () => {
    it('should settle auction and transfer NFT to winner', () => {
      Clarinet.test({
        name: 'Settle completed auction',
        async fn(chain: Chain, accounts: Map<string, Account>) {
          seller = accounts.get('wallet_1')!;
          bidder1 = accounts.get('wallet_2')!;

          // Setup and complete auction
          let block = chain.mineBlock([
            Tx.contractCall('stacksmint-nft-v2-1-3', 'mint',
              [types.ascii('ipfs://test'), types.none()], seller.address),
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'create-auction',
              [types.uint(1), types.uint(1000000), types.uint(10)], seller.address),
          ]);

          block = chain.mineBlock([
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'place-bid',
              [types.uint(1), types.uint(1500000)], bidder1.address),
          ]);

          // Mine past end
          chain.mineEmptyBlock(20);

          // Settle auction
          block = chain.mineBlock([
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'settle-auction',
              [types.uint(1)], seller.address),
          ]);

          block.receipts[0].result.expectOk();

          // Verify NFT ownership transferred
          const owner = chain.callReadOnlyFn(
            'stacksmint-nft-v2-1-3', 'get-owner',
            [types.uint(1)], bidder1.address
          );
          
          expect(owner.result.expectSome()).toBe(types.principal(bidder1.address));
        },
      });
    });

    it('should fail to settle auction before end time', () => {
      Clarinet.test({
        name: 'Cannot settle active auction',
        async fn(chain: Chain, accounts: Map<string, Account>) {
          seller = accounts.get('wallet_1')!;

          let block = chain.mineBlock([
            Tx.contractCall('stacksmint-nft-v2-1-3', 'mint',
              [types.ascii('ipfs://test'), types.none()], seller.address),
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'create-auction',
              [types.uint(1), types.uint(1000000), types.uint(100)], seller.address),
          ]);

          // Try to settle immediately
          block = chain.mineBlock([
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'settle-auction',
              [types.uint(1)], seller.address),
          ]);

          block.receipts[0].result.expectErr(types.uint(111)); // ERR_AUCTION_ACTIVE
        },
      });
    });

    it('should refund previous bidder when outbid', () => {
      Clarinet.test({
        name: 'Refund outbid participant',
        async fn(chain: Chain, accounts: Map<string, Account>) {
          seller = accounts.get('wallet_1')!;
          bidder1 = accounts.get('wallet_2')!;
          bidder2 = accounts.get('wallet_3')!;

          // Setup auction
          let block = chain.mineBlock([
            Tx.contractCall('stacksmint-nft-v2-1-3', 'mint',
              [types.ascii('ipfs://test'), types.none()], seller.address),
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'create-auction',
              [types.uint(1), types.uint(1000000), types.uint(100)], seller.address),
          ]);

          // Get initial balance
          const initialBalance = chain.getAssetsMaps().assets['STX'][bidder1.address];

          // First bid
          block = chain.mineBlock([
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'place-bid',
              [types.uint(1), types.uint(1000000)], bidder1.address),
          ]);

          // Second bid should refund first
          block = chain.mineBlock([
            Tx.contractCall('stacksmint-marketplace-v2-1-3', 'place-bid',
              [types.uint(1), types.uint(1100000)], bidder2.address),
          ]);

          // Check bidder1 was refunded
          const finalBalance = chain.getAssetsMaps().assets['STX'][bidder1.address];
          expect(finalBalance).toBe(initialBalance); // Should be refunded
        },
      });
    });
  });
});
