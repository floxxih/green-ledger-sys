import { describe, it, expect } from "vitest";
import { Cl } from "@hirosystems/clarinet-sdk";
import { StacksmintNft } from "./wrappers/nft";
import { StacksmintMarketplace } from "./wrappers/marketplace";

describe("StackMint Marketplace - Auctions", () => {
  const accounts = simnet.getAccounts();
  const owner = accounts.get("wallet_1")!;
  const bidder1 = accounts.get("wallet_2")!;
  const bidder2 = accounts.get("wallet_3")!;

  it("should create and settle an auction", () => {
    simnet.mineBlock([StacksmintNft.mint("ipfs://auction-1", owner)]);

    // Create Auction (100 blocks)
    const create = simnet.mineBlock([
      StacksmintMarketplace.createAuction(1, 500, 100, owner)
    ]);
    expect(create[0].result).toBeOk(Cl.uint(1)); // Auction ID 1

    // Bidder 1 bids
    const bid1 = simnet.mineBlock([
      StacksmintMarketplace.placeBid(1, 600, bidder1)
    ]);
    expect(bid1[0].result).toBeOk(Cl.uint(600));

    // Bidder 2 outbids
    const bid2 = simnet.mineBlock([
      StacksmintMarketplace.placeBid(1, 700, bidder2)
    ]);
    expect(bid2[0].result).toBeOk(Cl.uint(700));

    // Fast forward blocks (simnet limitation? usually mineEmptyBlocks)
    simnet.mineEmptyBlocks(101);

    // Settle
    const settle = simnet.mineBlock([
      StacksmintMarketplace.settleAuction(1, owner)
    ]);
    expect(settle[0].result).toBeOk(expect.anything());
  });
});
