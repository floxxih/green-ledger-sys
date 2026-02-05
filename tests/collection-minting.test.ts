import { describe, it, expect } from "vitest";
import { Cl } from "@hirosystems/clarinet-sdk";
import { StacksmintCollection } from "./wrappers/collection";

describe("AuroraMint Collection - Minting Phases", () => {
  const accounts = simnet.getAccounts();
  const creator = accounts.get("wallet_1")!;
  const user1 = accounts.get("wallet_2")!;
  const user2 = accounts.get("wallet_3")!;

  it("should manage phases and allow minting", () => {
    // Create collection
    simnet.mineBlock([
      StacksmintCollection.createCollection("Phased Mint", 100, creator)
    ]);

    // Set Public Phase (ID 1, Phase 2)
    // start: 0, end: 1000, price: 100, max: 5
    simnet.mineBlock([
      StacksmintCollection.setMintPhase(1, 2, 0, 1000, 100, 5, creator)
    ]);

    // Activate Phase
    const activate = simnet.mineBlock([
      StacksmintCollection.activatePhase(1, 2, creator)
    ]);
    expect(activate[0].result).toBeOk(Cl.uint(2));

    // Public Mint
    const mint = simnet.mineBlock([
      StacksmintCollection.mintFromCollection(1, user1)
    ]);
    expect(mint[0].result).toBeOk(Cl.uint(1)); // Minted count 1
  });

  it("should respect allowlist", () => {
    // Create collection 2
    simnet.mineBlock([
      StacksmintCollection.createCollection("Allowlist Mint", 100, creator)
    ]);

    // Set Allowlist Phase (ID 2, Phase 1)
    simnet.mineBlock([
      StacksmintCollection.setMintPhase(2, 1, 0, 1000, 50, 2, creator)
    ]);

    // Add user2 to allowlist
    simnet.mineBlock([
      StacksmintCollection.addToAllowlist(2, user2, 1, creator)
    ]);

    // Activate Allowlist Phase
    simnet.mineBlock([
      StacksmintCollection.activatePhase(2, 1, creator)
    ]);

    // Mint success for user2
    const mintSuccess = simnet.mineBlock([
      StacksmintCollection.mintFromCollection(2, user2)
    ]);
    expect(mintSuccess[0].result).toBeOk(Cl.uint(1));

    // Mint fail for user2 (limit 1)
    const mintFailLimit = simnet.mineBlock([
      StacksmintCollection.mintFromCollection(2, user2)
    ]);
    expect(mintFailLimit[0].result).toBeErr(Cl.uint(111)); // ERR_MINT_LIMIT_REACHED

    // Mint fail for user1 (not on allowlist)
    const mintFail = simnet.mineBlock([
      StacksmintCollection.mintFromCollection(2, user1)
    ]);
    expect(mintFail[0].result).toBeErr(Cl.uint(109)); // ERR_NOT_ALLOWLISTED
  });
});
