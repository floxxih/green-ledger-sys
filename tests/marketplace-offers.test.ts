import { describe, it, expect } from "vitest";
import { Cl } from "@hirosystems/clarinet-sdk";
import { StacksmintNft } from "./wrappers/nft";
import { StacksmintMarketplace } from "./wrappers/marketplace";

describe("StackMint Marketplace - Offers", () => {
  const accounts = simnet.getAccounts();
  const owner = accounts.get("wallet_1")!;
  const buyer = accounts.get("wallet_2")!;

  it("should make and accept an offer", () => {
    // Mint
    simnet.mineBlock([StacksmintNft.mint("ipfs://offer-1", owner)]);

    // Make offer
    const offer = simnet.mineBlock([
      StacksmintMarketplace.makeOffer(1, 1000, buyer)
    ]);
    expect(offer[0].result).toBeOk(Cl.uint(1000));

    // Accept offer (owner needs to approve marketplace contract first? 
    // Usually marketplace transfers NFT, so owner must approve marketplace contract or list it?
    // Let's check accept-offer code.
    // (try! (contract-call? '...stacksmint-nft-v2-1-3 transfer token-id tx-sender offerer))
    // It calls transfer directly from tx-sender (owner) to offerer. 
    // So no approval needed if owner calls accept-offer.
    
    const accept = simnet.mineBlock([
      StacksmintMarketplace.acceptOffer(1, buyer, owner)
    ]);
    expect(accept[0].result).toBeOk(expect.anything());
  });

  it("should cancel an offer", () => {
    simnet.mineBlock([StacksmintNft.mint("ipfs://offer-2", owner)]);

    simnet.mineBlock([
      StacksmintMarketplace.makeOffer(2, 2000, buyer)
    ]);

    const cancel = simnet.mineBlock([
      StacksmintMarketplace.cancelOffer(2, buyer)
    ]);
    expect(cancel[0].result).toBeOk(Cl.bool(true));
  });
});
