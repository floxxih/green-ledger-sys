import { Tx, types } from "@hirosystems/clarinet-sdk";

export class StacksmintCollection {
  static getContractName() {
    return "stacksmint-collection-v2-1-3";
  }

  static createCollection(name: string, maxSupply: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "create-collection",
      [types.ascii(name), types.uint(maxSupply)],
      sender
    );
  }

  static createCollectionFull(
    name: string,
    maxSupply: number,
    royalty: number,
    mintPrice: number,
    description: string,
    imageUri: string,
    bannerUri: string,
    website: string,
    twitter: string,
    discord: string,
    sender: string
  ) {
    return Tx.contractCall(
      this.getContractName(),
      "create-collection-full",
      [
        types.ascii(name),
        types.uint(maxSupply),
        types.uint(royalty),
        types.uint(mintPrice),
        types.ascii(description),
        types.ascii(imageUri),
        types.ascii(bannerUri),
        types.ascii(website),
        types.ascii(twitter),
        types.ascii(discord)
      ],
      sender
    );
  }

  static setMintPhase(
    collectionId: number,
    phase: number,
    startBlock: number,
    endBlock: number,
    price: number,
    maxPerWallet: number,
    sender: string
  ) {
    return Tx.contractCall(
      this.getContractName(),
      "set-mint-phase",
      [
        types.uint(collectionId),
        types.uint(phase),
        types.uint(startBlock),
        types.uint(endBlock),
        types.uint(price),
        types.uint(maxPerWallet)
      ],
      sender
    );
  }

  static activatePhase(collectionId: number, phase: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "activate-phase",
      [types.uint(collectionId), types.uint(phase)],
      sender
    );
  }

  static addToAllowlist(collectionId: number, user: string, spots: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "add-to-allowlist",
      [types.uint(collectionId), types.principal(user), types.uint(spots)],
      sender
    );
  }

  static mintFromCollection(collectionId: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "mint-from-collection",
      [types.uint(collectionId)],
      sender
    );
  }

  static airdrop(collectionId: number, recipients: string[], sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "airdrop",
      [types.uint(collectionId), types.list(recipients.map(r => types.principal(r)))],
      sender
    );
  }

  static lockCollection(collectionId: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "lock-collection",
      [types.uint(collectionId)],
      sender
    );
  }
}
