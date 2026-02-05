import { describe, it, expect } from "vitest";
import { Cl } from "@hirosystems/clarinet-sdk";
import { StacksmintCollection } from "./wrappers/collection";

describe("AuroraMint Collection - Admin & Airdrop", () => {
  const accounts = simnet.getAccounts();
  const creator = accounts.get("wallet_1")!;
  const user1 = accounts.get("wallet_2")!;
  const user2 = accounts.get("wallet_3")!;

  it("should perform airdrops", () => {
    simnet.mineBlock([
      StacksmintCollection.createCollection("Airdrop Coll", 100, creator)
    ]);

    const airdrop = simnet.mineBlock([
      StacksmintCollection.airdrop(1, [user1, user2], creator)
    ]);
    // Result is (ok { collection-id: 1, count: 2 })
    expect(airdrop[0].result).toBeOk(expect.anything());
  });

  it("should lock collection", () => {
    simnet.mineBlock([
      StacksmintCollection.createCollection("Locked Coll", 100, creator)
    ]);

    const lock = simnet.mineBlock([
      StacksmintCollection.lockCollection(2, creator)
    ]);
    expect(lock[0].result).toBeOk(Cl.bool(true));

    // Try minting (even if setup correctly, should fail)
    // Setup phase
    simnet.mineBlock([
      StacksmintCollection.setMintPhase(2, 2, 0, 1000, 0, 10, creator),
      StacksmintCollection.activatePhase(2, 2, creator)
    ]);

    const mint = simnet.mineBlock([
      StacksmintCollection.mintFromCollection(2, user1)
    ]);
    expect(mint[0].result).toBeErr(Cl.uint(106)); // ERR_COLLECTION_LOCKED
  });
});
