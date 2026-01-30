import { describe, it, expect } from "vitest";
import { Cl } from "@hirosystems/clarinet-sdk";
import { StacksmintNft } from "./wrappers/nft";

describe("StackMint NFT - Basic Operations", () => {
  const accounts = simnet.getAccounts();
  const wallet1 = accounts.get("wallet_1")!;
  const wallet2 = accounts.get("wallet_2")!;

  it("should mint a new token", () => {
    const response = simnet.mineBlock([
      StacksmintNft.mint("ipfs://test-uri", wallet1)
    ]);
    expect(response[0].result).toBeOk(Cl.uint(1));
  });

  it("should transfer token", () => {
    // Mint
    simnet.mineBlock([
      StacksmintNft.mint("ipfs://test-uri", wallet1)
    ]);

    // Transfer
    const transferResponse = simnet.mineBlock([
      StacksmintNft.transfer(1, wallet1, wallet2)
    ]);
    expect(transferResponse[0].result).toBeOk(Cl.bool(true));

    // Verify owner check failure
    const unauthorizedTransfer = simnet.mineBlock([
      StacksmintNft.transfer(1, wallet1, wallet2)
    ]);
    expect(unauthorizedTransfer[0].result).toBeErr(Cl.uint(100)); // ERR_NOT_OWNER
  });

  it("should burn token", () => {
    simnet.mineBlock([
      StacksmintNft.mint("ipfs://test-uri", wallet1)
    ]);

    const burnResponse = simnet.mineBlock([
      StacksmintNft.burn(1, wallet1)
    ]);
    expect(burnResponse[0].result).toBeOk(Cl.bool(true));

    // Verify cannot transfer burned token
    const transferResponse = simnet.mineBlock([
      StacksmintNft.transfer(1, wallet1, wallet2)
    ]);
    expect(transferResponse[0].result).toBeErr(Cl.uint(100)); // ERR_NOT_OWNER (actually not found/owner is none)
  });
});
