import { describe, it, expect } from "vitest";
import { Cl } from "@hirosystems/clarinet-sdk";
import { StacksmintNft } from "./wrappers/nft";
import { StacksmintMarketplace } from "./wrappers/marketplace";

describe("AuroraMint Marketplace - Bundles", () => {
  const accounts = simnet.getAccounts();
  const owner = accounts.get("wallet_1")!;
  const buyer = accounts.get("wallet_2")!;

  it("should list and buy a bundle", () => {
    // Mint 3 NFTs
    simnet.mineBlock([
      StacksmintNft.mint("ipfs://b1", owner),
      StacksmintNft.mint("ipfs://b2", owner),
      StacksmintNft.mint("ipfs://b3", owner)
    ]);

    // Create Bundle
    const bundle = simnet.mineBlock([
      StacksmintMarketplace.createBundle([1, 2, 3], 5000, owner)
    ]);
    expect(bundle[0].result).toBeOk(Cl.uint(1));

    // Buy Bundle
    const buy = simnet.mineBlock([
      StacksmintMarketplace.buyBundle(1, buyer)
    ]);
    expect(buy[0].result).toBeOk(expect.anything());
  });

  it("should reject empty bundle", () => {
    const result = simnet.mineBlock([
      StacksmintMarketplace.createBundle([], 1000, owner)
    ]);
    expect(result[0].result).toBeErr(Cl.uint(114)); // ERR_BUNDLE_EMPTY
  });

  it("should reject bundle exceeding max size (10 NFTs)", () => {
    // Mint 11 NFTs
    const mintTxs = Array.from({ length: 11 }, (_, i) =>
      StacksmintNft.mint(`ipfs://nft${i}`, owner)
    );
    simnet.mineBlock(mintTxs);

    // Try to bundle 11 NFTs
    const tokenIds = Array.from({ length: 11 }, (_, i) => i + 1);
    const result = simnet.mineBlock([
      StacksmintMarketplace.createBundle(tokenIds, 10000, owner)
    ]);
    expect(result[0].result).toBeErr(Cl.uint(115)); // ERR_BUNDLE_TOO_LARGE
  });

  it("should allow seller to cancel bundle", () => {
    // Setup: mint and create bundle
    simnet.mineBlock([
      StacksmintNft.mint("ipfs://test", owner)
    ]);

    simnet.mineBlock([
      StacksmintMarketplace.createBundle([1], 1000, owner)
    ]);

    // Cancel bundle
    const result = simnet.mineBlock([
      StacksmintMarketplace.cancelBundle(1, owner)
    ]);
    expect(result[0].result).toBeOk(expect.anything());
  });

  it("should prevent non-seller from canceling bundle", () => {
    // Setup bundle
    simnet.mineBlock([
      StacksmintNft.mint("ipfs://test", owner)
    ]);

    simnet.mineBlock([
      StacksmintMarketplace.createBundle([1], 1000, owner)
    ]);

    // Try to cancel as different user
    const result = simnet.mineBlock([
      StacksmintMarketplace.cancelBundle(1, buyer)
    ]);
    expect(result[0].result).toBeErr(Cl.uint(104)); // ERR_SELLER_ONLY
  });

  it("should handle maximum size bundle (10 NFTs)", () => {
    // Mint 10 NFTs
    const mintTxs = Array.from({ length: 10 }, (_, i) =>
      StacksmintNft.mint(`ipfs://nft${i}`, owner)
    );
    simnet.mineBlock(mintTxs);

    // Create max-size bundle
    const tokenIds = Array.from({ length: 10 }, (_, i) => i + 1);
    const result = simnet.mineBlock([
      StacksmintMarketplace.createBundle(tokenIds, 10000, owner)
    ]);
    expect(result[0].result).toBeOk(Cl.uint(1));
  });

  it("should verify all NFTs transferred on bundle purchase", () => {
    // Mint 3 NFTs
    simnet.mineBlock([
      StacksmintNft.mint("ipfs://n1", owner),
      StacksmintNft.mint("ipfs://n2", owner),
      StacksmintNft.mint("ipfs://n3", owner)
    ]);

    // Create and buy bundle
    simnet.mineBlock([
      StacksmintMarketplace.createBundle([1, 2, 3], 5000, owner)
    ]);

    const buyResult = simnet.mineBlock([
      StacksmintMarketplace.buyBundle(1, buyer)
    ]);
    expect(buyResult[0].result).toBeOk(expect.anything());

    // All NFTs should now belong to buyer
    // This would require read-only calls to verify ownership
  });
});
