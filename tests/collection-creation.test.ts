import { describe, it, expect } from "vitest";
import { Cl } from "@hirosystems/clarinet-sdk";
import { StacksmintCollection } from "./wrappers/collection";

describe("StackMint Collection - Creation", () => {
  const accounts = simnet.getAccounts();
  const creator = accounts.get("wallet_1")!;

  it("should create a basic collection", () => {
    const create = simnet.mineBlock([
      StacksmintCollection.createCollection("Genesis Punks", 1000, creator)
    ]);
    expect(create[0].result).toBeOk(Cl.uint(1)); // Collection ID 1
  });

  it("should create a full collection with metadata", () => {
    const create = simnet.mineBlock([
      StacksmintCollection.createCollectionFull(
        "Full Collection",
        5000,
        50, // 5% royalty
        1000000, // 1 STX mint price
        "A description",
        "ipfs://image",
        "ipfs://banner",
        "https://web",
        "@twitter",
        "discord",
        creator
      )
    ]);
    expect(create[0].result).toBeOk(Cl.uint(2)); // Collection ID 2
  });

  it("should fail with invalid name length", () => {
    const create = simnet.mineBlock([
      StacksmintCollection.createCollection("Ab", 1000, creator)
    ]);
    expect(create[0].result).toBeErr(Cl.uint(104)); // ERR_INVALID_NAME
  });
});
