/**
 * Clarity Value Parsing Utilities
 * Helper functions for parsing Clarity contract responses
 * @module clarity-parser
 * @version 1.0.0
 */

import { cvToValue, type ClarityValue, cvToJSON } from '@stacks/transactions';

// ============================================================================
// Type Definitions
// ============================================================================

export interface ParsedTuple {
  [key: string]: any;
}

export interface ParsedResponse {
  success: boolean;
  value?: any;
  error?: string;
}

// ============================================================================
// Clarity Value Parsers
// ============================================================================

/**
 * Parse a Clarity response value
 */
export function parseResponse(clarityValue: ClarityValue): ParsedResponse {
  try {
    const json = cvToJSON(clarityValue);
    
    // Handle Response types (ok/err)
    if (json.type === 'ok') {
      return {
        success: true,
        value: parseValue(json.value),
      };
    } else if (json.type === 'err') {
      return {
        success: false,
        error: parseValue(json.value),
      };
    }
    
    // Handle other types
    return {
      success: true,
      value: parseValue(json),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown parsing error',
    };
  }
}

/**
 * Parse any Clarity value to JavaScript value
 */
export function parseValue(value: any): any {
  if (!value) return null;
  
  // Handle different Clarity types
  switch (value.type) {
    case 'uint':
    case 'int':
      return BigInt(value.value);
    
    case 'bool':
      return value.value === 'true' || value.value === true;
    
    case 'principal':
      return value.value;
    
    case 'buffer':
      return value.value;
    
    case 'string-ascii':
    case 'string-utf8':
      return value.value;
    
    case 'optional':
      return value.value ? parseValue(value.value) : null;
    
    case 'tuple':
      return parseTuple(value.value);
    
    case 'list':
      return parseList(value.value);
    
    case 'ok':
      return parseValue(value.value);
    
    case 'err':
      return parseValue(value.value);
    
    default:
      // If value is already primitive, return as is
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return value;
      }
      return value.value || value;
  }
}

/**
 * Parse a Clarity tuple to JavaScript object
 */
export function parseTuple(tuple: any): ParsedTuple {
  if (!tuple || typeof tuple !== 'object') return {};
  
  const result: ParsedTuple = {};
  
  for (const [key, value] of Object.entries(tuple)) {
    result[key] = parseValue(value);
  }
  
  return result;
}

/**
 * Parse a Clarity list to JavaScript array
 */
export function parseList(list: any[]): any[] {
  if (!Array.isArray(list)) return [];
  return list.map(item => parseValue(item));
}

// ============================================================================
// Specific Contract Response Parsers
// ============================================================================

/**
 * Parse NFT metadata response
 */
export function parseNFTMetadata(clarityValue: ClarityValue): {
  tokenId: bigint;
  owner: string;
  uri: string;
} | null {
  const response = parseResponse(clarityValue);
  
  if (!response.success || !response.value) return null;
  
  const data = typeof response.value === 'object' ? response.value : {};
  
  return {
    tokenId: data.tokenId || data['token-id'] || BigInt(0),
    owner: data.owner || '',
    uri: data.uri || data.tokenUri || '',
  };
}

/**
 * Parse listing info response
 */
export function parseListingInfo(clarityValue: ClarityValue): {
  price: bigint;
  seller: string;
  listedAt: bigint;
  expiresAt: bigint;
} | null {
  const response = parseResponse(clarityValue);
  
  if (!response.success || !response.value) return null;
  
  const data = typeof response.value === 'object' ? response.value : {};
  
  return {
    price: data.price || BigInt(0),
    seller: data.seller || '',
    listedAt: data.listedAt || data['listed-at'] || BigInt(0),
    expiresAt: data.expiresAt || data['expires-at'] || BigInt(0),
  };
}

/**
 * Parse collection info response
 */
export function parseCollectionInfo(clarityValue: ClarityValue): {
  name: string;
  maxSupply: bigint;
  currentSupply: bigint;
  creator: string;
} | null {
  const response = parseResponse(clarityValue);
  
  if (!response.success || !response.value) return null;
  
  const data = typeof response.value === 'object' ? response.value : {};
  
  return {
    name: data.name || '',
    maxSupply: data.maxSupply || data['max-supply'] || BigInt(0),
    currentSupply: data.currentSupply || data['current-supply'] || BigInt(0),
    creator: data.creator || '',
  };
}

/**
 * Parse auction info response
 */
export function parseAuctionInfo(clarityValue: ClarityValue): {
  tokenId: bigint;
  seller: string;
  reservePrice: bigint;
  currentBid: bigint;
  highestBidder: string | null;
  endBlock: bigint;
} | null {
  const response = parseResponse(clarityValue);
  
  if (!response.success || !response.value) return null;
  
  const data = typeof response.value === 'object' ? response.value : {};
  
  return {
    tokenId: data.tokenId || data['token-id'] || BigInt(0),
    seller: data.seller || '',
    reservePrice: data.reservePrice || data['reserve-price'] || BigInt(0),
    currentBid: data.currentBid || data['current-bid'] || BigInt(0),
    highestBidder: data.highestBidder || data['highest-bidder'] || null,
    endBlock: data.endBlock || data['end-block'] || BigInt(0),
  };
}

// ============================================================================
// Error Code Parsers
// ============================================================================

/**
 * Parse Clarity error code to human-readable message
 */
export function parseErrorCode(errorCode: number | bigint | string): string {
  const code = typeof errorCode === 'bigint' ? Number(errorCode) : Number(errorCode);
  
  const errorMessages: Record<number, string> = {
    100: 'Not the owner',
    101: 'Already listed',
    102: 'Not listed',
    103: 'Invalid price',
    104: 'Seller only',
    105: 'Cannot buy own NFT',
    106: 'Offer not found',
    107: 'Offer expired',
    108: 'Insufficient offer amount',
    109: 'Listing expired',
    110: 'Marketplace paused',
    111: 'Auction still active',
    112: 'Auction ended',
    113: 'Bid too low',
    114: 'Bundle is empty',
    115: 'Bundle too large',
    116: 'Escrow locked',
    117: 'Not the bidder',
  };
  
  return errorMessages[code] || `Unknown error (code: ${code})`;
}

/**
 * Check if Clarity value represents an error
 */
export function isError(clarityValue: ClarityValue): boolean {
  const json = cvToJSON(clarityValue);
  return json.type === 'err';
}

/**
 * Check if Clarity value represents success
 */
export function isSuccess(clarityValue: ClarityValue): boolean {
  const json = cvToJSON(clarityValue);
  return json.type === 'ok';
}
