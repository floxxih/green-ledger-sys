import { describe, it, expect } from "vitest";
import { Cl } from "@hirosystems/clarinet-sdk";
import { StacksmintNft } from "./wrappers/nft";
import { StacksmintMarketplace } from "./wrappers/marketplace";

describe("StackMint Marketplace", () => {
  const accounts = simnet.getAccounts();
  const seller = accounts.get("wallet_1")!;
  const buyer = accounts.get("wallet_2")!;

  it("should allow listing and buying an NFT", () => {
    // Mint NFT
    const mintResponse = simnet.mineBlock([
      StacksmintNft.mint("ipfs://test-uri", seller)
    ]);
    expect(mintResponse[0].result).toBeOk(Cl.uint(1));

    // List NFT
    const listResponse = simnet.mineBlock([
      StacksmintMarketplace.listNft(1, 1000000, seller)
    ]);
    expect(listResponse[0].result).toBeOk(Cl.uint(1));

    // Buy NFT
    const buyResponse = simnet.mineBlock([
      StacksmintMarketplace.buyNft(1, buyer)
    ]);
    expect(buyResponse[0].result).toBeOk(expect.anything());
  });

  it("should fail if buyer has insufficient funds", () => {
    // Mint NFT
    simnet.mineBlock([
      StacksmintNft.mint("ipfs://test-uri-2", seller)
    ]);

    // List NFT for huge price
    simnet.mineBlock([
      StacksmintMarketplace.listNft(2, 100000000000000, seller)
    ]);

    // Attempt Buy
    const buyResponse = simnet.mineBlock([
      StacksmintMarketplace.buyNft(2, buyer)
    ]);
    expect(buyResponse[0].result).toBeErr(expect.anything()); // Should fail transfer
  });
});
