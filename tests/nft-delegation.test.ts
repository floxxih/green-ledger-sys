import { describe, it, expect } from "vitest";
import { Cl } from "@hirosystems/clarinet-sdk";
import { StacksmintNft } from "./wrappers/nft";

describe("AuroraMint NFT - Delegation & Approvals", () => {
  const accounts = simnet.getAccounts();
  const owner = accounts.get("wallet_1")!;
  const delegate = accounts.get("wallet_2")!;
  const operator = accounts.get("wallet_3")!;

  it("should support token specific approval", () => {
    simnet.mineBlock([StacksmintNft.mint("ipfs://1", owner)]);

    // Approve
    const approve = simnet.mineBlock([
      StacksmintNft.approve(operator, 1, owner)
    ]);
    expect(approve[0].result).toBeOk(Cl.bool(true));

    // Transfer by operator
    const transfer = simnet.mineBlock([
      StacksmintNft.transfer(1, operator, delegate)
    ]);
    expect(transfer[0].result).toBeOk(Cl.bool(true));
  });

  it("should support operator approval for all", () => {
    simnet.mineBlock([
      StacksmintNft.mint("ipfs://2", owner),
      StacksmintNft.mint("ipfs://3", owner)
    ]);

    // Set approval for all
    const setApproval = simnet.mineBlock([
      StacksmintNft.setApprovalForAll(operator, true, owner)
    ]);
    expect(setApproval[0].result).toBeOk(Cl.bool(true));

    // Transfer multiple by operator
    const transfer = simnet.mineBlock([
      StacksmintNft.transfer(2, operator, delegate),
      StacksmintNft.transfer(3, operator, delegate)
    ]);
    expect(transfer[0].result).toBeOk(Cl.bool(true));
    expect(transfer[1].result).toBeOk(Cl.bool(true));
  });

  it("should support delegation", () => {
    // Add delegate
    const addDelegate = simnet.mineBlock([
      StacksmintNft.addDelegate(delegate, true, true, true, 100, owner)
    ]);
    expect(addDelegate[0].result).toBeOk(Cl.bool(true));

    // Mint as delegate (not implemented in wrapper yet but assuming function exists in contract)
    // Actually mint-as-delegate exists in contract
    // Let's test transfer as delegate
    simnet.mineBlock([StacksmintNft.mint("ipfs://4", owner)]);
    
    const transfer = simnet.mineBlock([
      StacksmintNft.transfer(4, delegate, operator)
    ]);
    expect(transfer[0].result).toBeOk(Cl.bool(true));
  });
});
