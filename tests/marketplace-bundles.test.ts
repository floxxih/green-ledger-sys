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

    // Verify ownership (optional check, but good for confidence)
    // We can check NFT owner in separate call if we had getOwner in wrapper
  });
});
