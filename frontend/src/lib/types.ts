export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Attribute[];
}

export interface Attribute {
  trait_type: string;
  value: string | number;
}

export interface Listing {
  tokenId: number;
  price: number;
  seller: string;
  expiresAt: number;
}

export interface Auction {
  auctionId: number;
  tokenId: number;
  seller: string;
  highestBid: number;
  highestBidder: string | null;
  endTime: number;
}
