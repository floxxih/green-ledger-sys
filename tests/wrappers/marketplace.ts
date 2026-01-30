import { Tx, types } from "@hirosystems/clarinet-sdk";

export class StacksmintMarketplace {
  static getContractName() {
    return "stacksmint-marketplace-v2-1-3";
  }

  static listNft(tokenId: number, price: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "list-nft",
      [types.uint(tokenId), types.uint(price)],
      sender
    );
  }

  static cancelListing(tokenId: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "cancel-listing",
      [types.uint(tokenId)],
      sender
    );
  }

  static updateListingPrice(tokenId: number, price: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "update-listing-price",
      [types.uint(tokenId), types.uint(price)],
      sender
    );
  }

  static buyNft(tokenId: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "buy-nft",
      [types.uint(tokenId)],
      sender
    );
  }

  static makeOffer(tokenId: number, amount: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "make-offer",
      [types.uint(tokenId), types.uint(amount)],
      sender
    );
  }

  static cancelOffer(tokenId: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "cancel-offer",
      [types.uint(tokenId)],
      sender
    );
  }

  static acceptOffer(tokenId: number, offerer: string, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "accept-offer",
      [types.uint(tokenId), types.principal(offerer)],
      sender
    );
  }

  static createAuction(tokenId: number, reservePrice: number, duration: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "create-auction",
      [types.uint(tokenId), types.uint(reservePrice), types.uint(duration)],
      sender
    );
  }

  static placeBid(auctionId: number, amount: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "place-bid",
      [types.uint(auctionId), types.uint(amount)],
      sender
    );
  }

  static settleAuction(auctionId: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "settle-auction",
      [types.uint(auctionId)],
      sender
    );
  }

  static createBundle(tokenIds: number[], price: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "create-bundle",
      [types.list(tokenIds.map(id => types.uint(id))), types.uint(price)],
      sender
    );
  }

  static buyBundle(bundleId: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "buy-bundle",
      [types.uint(bundleId)],
      sender
    );
  }

  static setMarketplacePaused(paused: boolean, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "set-marketplace-paused",
      [types.bool(paused)],
      sender
    );
  }
}
