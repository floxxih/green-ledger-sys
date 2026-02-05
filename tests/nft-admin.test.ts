import { describe, it, expect } from "vitest";
import { Cl } from "@hirosystems/clarinet-sdk";
import { StacksmintNft } from "./wrappers/nft";

describe("AuroraMint NFT - Admin & Batch", () => {
  const accounts = simnet.getAccounts();
  const deployer = accounts.get("deployer")!;
  const user = accounts.get("wallet_1")!;

  it("should freeze and unfreeze tokens", () => {
    simnet.mineBlock([StacksmintNft.mint("ipfs://1", user)]);

    // Freeze (user can freeze their own token?)
    // Checking contract: freeze-token: asserts! (is-owner-or-approved ...)
    const freeze = simnet.mineBlock([
      StacksmintNft.freezeToken(1, user)
    ]);
    expect(freeze[0].result).toBeOk(Cl.bool(true));

    // Try transfer
    const transfer = simnet.mineBlock([
      StacksmintNft.transfer(1, user, deployer)
    ]);
    expect(transfer[0].result).toBeErr(Cl.uint(105)); // ERR_TOKEN_FROZEN

    // Unfreeze (only owner/admin?)
    // Checking contract: unfreeze-token: asserts! (is-eq tx-sender CONTRACT_OWNER)
    const unfreeze = simnet.mineBlock([
      StacksmintNft.unfreezeToken(1, deployer) // Deployer is contract owner
    ]);
    expect(unfreeze[0].result).toBeOk(Cl.bool(true));
  });

  it("should batch mint tokens", () => {
    const uris = ["ipfs://1", "ipfs://2", "ipfs://3"];
    const batchMint = simnet.mineBlock([
      StacksmintNft.batchMint(uris, user)
    ]);
    
    // Check if result is ok (it returns last token id usually or success count)
    // Contract returns (ok token-id) for last one? No, it folds...
    // Let's check contract logic.
    // batch-mint folds batch-mint-iter. 
    // batch-mint-iter returns (ok token-id).
    // So final result is ok token-id of last minted.
    expect(batchMint[0].result).toBeOk(expect.anything());
  });

  it("should pause minting", () => {
    simnet.mineBlock([
      StacksmintNft.setMintingPaused(true, deployer)
    ]);

    const mint = simnet.mineBlock([
      StacksmintNft.mint("ipfs://fail", user)
    ]);
    expect(mint[0].result).toBeErr(Cl.uint(104)); // ERR_NOT_AUTHORIZED
  });
});
