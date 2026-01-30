import { Tx, types } from "@hirosystems/clarinet-sdk";

export class StacksmintNft {
  static getContractName() {
    return "stacksmint-nft-v2-1-3";
  }

  static mint(uri: string, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "mint",
      [types.ascii(uri)],
      sender
    );
  }

  static mintWithRoyalty(uri: string, royalty: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "mint-with-royalty",
      [types.ascii(uri), types.uint(royalty)],
      sender
    );
  }

  static transfer(tokenId: number, sender: string, recipient: string) {
    return Tx.contractCall(
      this.getContractName(),
      "transfer",
      [types.uint(tokenId), types.principal(sender), types.principal(recipient)],
      sender
    );
  }

  static burn(tokenId: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "burn",
      [types.uint(tokenId)],
      sender
    );
  }
}
