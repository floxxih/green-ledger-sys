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

  static batchMint(uris: string[], sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "batch-mint",
      [types.list(uris.map(uri => types.ascii(uri)))],
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

  static approve(spender: string, tokenId: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "approve",
      [types.principal(spender), types.uint(tokenId)],
      sender
    );
  }

  static setApprovalForAll(operator: string, approved: boolean, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "set-approval-for-all",
      [types.principal(operator), types.bool(approved)],
      sender
    );
  }

  static freezeToken(tokenId: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "freeze-token",
      [types.uint(tokenId)],
      sender
    );
  }

  static unfreezeToken(tokenId: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "unfreeze-token",
      [types.uint(tokenId)],
      sender
    );
  }

  static addDelegate(delegate: string, canMint: boolean, canTransfer: boolean, canList: boolean, duration: number, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "add-delegate",
      [
        types.principal(delegate),
        types.bool(canMint),
        types.bool(canTransfer),
        types.bool(canList),
        types.uint(duration)
      ],
      sender
    );
  }

  static removeDelegate(delegate: string, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "remove-delegate",
      [types.principal(delegate)],
      sender
    );
  }

  static setMintingPaused(paused: boolean, sender: string) {
    return Tx.contractCall(
      this.getContractName(),
      "set-minting-paused",
      [types.bool(paused)],
      sender
    );
  }
}
