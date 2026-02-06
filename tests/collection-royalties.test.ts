import { describe, it, expect } from "vitest";
import { Cl } from "@hirosystems/clarinet-sdk";
import { StacksmintCollection } from "./wrappers/collection";
import { StacksmintNft } from "./wrappers/nft";
import { StacksmintMarketplace } from "./wrappers/marketplace";

/**
 * Collection Royalty Tests
 * 
 * Tests royalty enforcement, distribution, and edge cases
 */
describe("AuroraMint Collection - Royalties", () => {
  const accounts = simnet.getAccounts();
  const creator = accounts.get("wallet_1")!;
  const seller = accounts.get("wallet_2")!;
  const buyer = accounts.get("wallet_3")!;

  describe("Royalty Configuration", () => {
    it("should create collection with valid royalty percentage", () => {
      const result = simnet.mineBlock([
        StacksmintCollection.createCollection(
          "Test Collection",
          100,
          "ipfs://base/",
          500, // 5% royalty (in basis points)
          creator
        )
      ]);
      expect(result[0].result).toBeOk(Cl.uint(1));
    });

    it("should reject royalty percentage above 25%", () => {
      const result = simnet.mineBlock([
        StacksmintCollection.createCollection(
          "High Royalty Collection",
          100,
          "ipfs://base/",
          2600, // 26% - too high
          creator
        )
      ]);
      // Should fail with ERR_INVALID_ROYALTY or similar
      expect(result[0].result).toBeErr(expect.anything());
    });

    it("should allow zero royalty", () => {
      const result = simnet.mineBlock([
        StacksmintCollection.createCollection(
          "No Royalty Collection",
          100,
          "ipfs://base/",
          0, // 0% royalty
          creator
        )
      ]);
      expect(result[0].result).toBeOk(Cl.uint(1));
    });

    it("should store royalty information correctly", () => {
      simnet.mineBlock([
        StacksmintCollection.createCollection(
          "Royalty Test",
          100,
          "ipfs://base/",
          1000, // 10% royalty
          creator
        )
      ]);

      // Read collection data
      const collectionData = simnet.callReadOnlyFn(
        "stacksmint-collection-v2-1-3",
        "get-collection",
        [Cl.uint(1)],
        creator
      );

      expect(collectionData.result).toBeSome(expect.anything());
      // Verify royalty percentage is stored
    });
  });

  describe("Royalty Distribution on Sales", () => {
    it("should distribute royalty to creator on secondary sale", () => {
      // Create collection with 10% royalty
      simnet.mineBlock([
        StacksmintCollection.createCollection(
          "Royalty Collection",
          100,
          "ipfs://base/",
          1000, // 10%
          creator
        )
      ]);

      // Mint NFT in collection
      simnet.mineBlock([
        StacksmintNft.mint("ipfs://token1", seller)
      ]);

      // Get initial creator balance
      const creatorBalanceBefore = simnet.getAssetsMap().get("STX")![creator];

      // List and sell NFT
      const salePrice = 10000000; // 10 STX
      simnet.mineBlock([
        StacksmintMarketplace.listNft(1, salePrice, seller)
      ]);

      simnet.mineBlock([
        StacksmintMarketplace.buyNft(1, buyer)
      ]);

      // Verify creator received royalty
      const creatorBalanceAfter = simnet.getAssetsMap().get("STX")![creator];
      const royaltyReceived = creatorBalanceAfter - creatorBalanceBefore;

      // Should be approximately 10% of sale price (1 STX)
      const expectedRoyalty = salePrice * 0.1;
      expect(royaltyReceived).toBeGreaterThanOrEqual(expectedRoyalty * 0.95); // Allow 5% variance for fees
    });

    it("should handle multiple royalty recipients correctly", () => {
      // For future enhancement: split royalties between multiple addresses
      // This would test more complex royalty distribution logic
    });

    it("should not pay royalty on initial sale (mint)", () => {
      simnet.mineBlock([
        StacksmintCollection.createCollection(
          "Test Collection",
          100,
          "ipfs://base/",
          1000,
          creator
        )
      ]);

      const creatorBalanceBefore = simnet.getAssetsMap().get("STX")![creator];

      // Mint NFT (initial sale)
      simnet.mineBlock([
        StacksmintNft.mint("ipfs://token1", seller)
      ]);

      const creatorBalanceAfter = simnet.getAssetsMap().get("STX")![creator];

      // Creator should not receive royalty on mint
      expect(creatorBalanceAfter).toBe(creatorBalanceBefore);
    });
  });

  describe("Royalty Edge Cases", () => {
    it("should handle very small royalty amounts", () => {
      simnet.mineBlock([
        StacksmintCollection.createCollection(
          "Low Royalty",
          100,
          "ipfs://base/",
          10, // 0.1% royalty
          creator
        )
      ]);

      simnet.mineBlock([
        StacksmintNft.mint("ipfs://token1", seller)
      ]);

      // Sell for 1 STX (royalty would be 0.001 STX = 1000 microSTX)
      simnet.mineBlock([
        StacksmintMarketplace.listNft(1, 1000000, seller)
      ]);

      const result = simnet.mineBlock([
        StacksmintMarketplace.buyNft(1, buyer)
      ]);

      expect(result[0].result).toBeOk(expect.anything());
    });

    it("should handle maximum royalty percentage (25%)", () => {
      simnet.mineBlock([
        StacksmintCollection.createCollection(
          "Max Royalty",
          100,
          "ipfs://base/",
          2500, // 25% royalty
          creator
        )
      ]);

      simnet.mineBlock([
        StacksmintNft.mint("ipfs://token1", seller)
      ]);

      const salePrice = 10000000; // 10 STX
      simnet.mineBlock([
        StacksmintMarketplace.listNft(1, salePrice, seller)
      ]);

      const creatorBalanceBefore = simnet.getAssetsMap().get("STX")![creator];

      simnet.mineBlock([
        StacksmintMarketplace.buyNft(1, buyer)
      ]);

      const creatorBalanceAfter = simnet.getAssetsMap().get("STX")![creator];
      const royaltyReceived = creatorBalanceAfter - creatorBalanceBefore;

      // Should be approximately 25% of sale price (2.5 STX)
      const expectedRoyalty = salePrice * 0.25;
      expect(royaltyReceived).toBeGreaterThanOrEqual(expectedRoyalty * 0.95);
    });

    it("should correctly calculate royalty with marketplace fee", () => {
      // Test that both marketplace fee and royalty are deducted properly
      const royaltyPercent = 1000; // 10%
      const marketplaceFee = 250; // 2.5%
      const salePrice = 10000000; // 10 STX

      simnet.mineBlock([
        StacksmintCollection.createCollection(
          "Fee Test",
          100,
          "ipfs://base/",
          royaltyPercent,
          creator
        )
      ]);

      simnet.mineBlock([
        StacksmintNft.mint("ipfs://token1", seller)
      ]);

      simnet.mineBlock([
        StacksmintMarketplace.listNft(1, salePrice, seller)
      ]);

      const sellerBalanceBefore = simnet.getAssetsMap().get("STX")![seller];
      const creatorBalanceBefore = simnet.getAssetsMap().get("STX")![creator];

      simnet.mineBlock([
        StacksmintMarketplace.buyNft(1, buyer)
      ]);

      const sellerBalanceAfter = simnet.getAssetsMap().get("STX")![seller];
      const creatorBalanceAfter = simnet.getAssetsMap().get("STX")![creator];

      const sellerReceived = sellerBalanceAfter - sellerBalanceBefore;
      const creatorReceived = creatorBalanceAfter - creatorBalanceBefore;

      // Seller should get: salePrice - royalty - marketplace fee
      const expectedSellerAmount = salePrice * (1 - 0.10 - 0.025);
      expect(sellerReceived).toBeCloseTo(expectedSellerAmount, -4); // within 10000 microSTX

      // Creator should get royalty
      const expectedCreatorAmount = salePrice * 0.10;
      expect(creatorReceived).toBeCloseTo(expectedCreatorAmount, -4);
    });
  });

  describe("Royalty Updates", () => {
    it("should allow collection owner to update royalty", () => {
      simnet.mineBlock([
        StacksmintCollection.createCollection(
          "Updatable Royalty",
          100,
          "ipfs://base/",
          500, // 5%
          creator
        )
      ]);

      // Update royalty to 10%
      const result = simnet.mineBlock([
        StacksmintCollection.updateRoyalty(1, 1000, creator)
      ]);

      expect(result[0].result).toBeOk(expect.anything());
    });

    it("should prevent non-owner from updating royalty", () => {
      simnet.mineBlock([
        StacksmintCollection.createCollection(
          "Protected Royalty",
          100,
          "ipfs://base/",
          500,
          creator
        )
      ]);

      // Try to update as different user
      const result = simnet.mineBlock([
        StacksmintCollection.updateRoyalty(1, 1000, seller)
      ]);

      expect(result[0].result).toBeErr(expect.anything());
    });

    it("should enforce maximum royalty on updates", () => {
      simnet.mineBlock([
        StacksmintCollection.createCollection(
          "Update Test",
          100,
          "ipfs://base/",
          500,
          creator
        )
      ]);

      // Try to update to invalid percentage
      const result = simnet.mineBlock([
        StacksmintCollection.updateRoyalty(1, 3000, creator) // 30% - too high
      ]);

      expect(result[0].result).toBeErr(expect.anything());
    });
  });
});
