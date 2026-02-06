/**
 * Test Helper Utilities
 * Common functions and constants for Clarity contract testing
 * @module test-helpers
 */

import { Cl, ClarityValue } from "@hirosystems/clarinet-sdk";

// ============================================================================
// Constants
// ============================================================================

export const ONE_STX = 1_000_000; // 1 STX in microSTX
export const MIN_LISTING_PRICE = 1_000; // 0.001 STX
export const DEFAULT_AUCTION_DURATION = 144; // ~1 day in blocks
export const MAX_BUNDLE_SIZE = 10;
export const MARKETPLACE_FEE_BPS = 250; // 2.5%
export const MAX_ROYALTY_BPS = 2500; // 25%

// Error codes
export const ERR_NOT_OWNER = Cl.uint(100);
export const ERR_ALREADY_LISTED = Cl.uint(101);
export const ERR_NOT_LISTED = Cl.uint(102);
export const ERR_INVALID_PRICE = Cl.uint(103);
export const ERR_SELLER_ONLY = Cl.uint(104);
export const ERR_CANNOT_BUY_OWN = Cl.uint(105);
export const ERR_OFFER_NOT_FOUND = Cl.uint(106);
export const ERR_OFFER_EXPIRED = Cl.uint(107);
export const ERR_INSUFFICIENT_OFFER = Cl.uint(108);
export const ERR_LISTING_EXPIRED = Cl.uint(109);
export const ERR_MARKETPLACE_PAUSED = Cl.uint(110);
export const ERR_AUCTION_ACTIVE = Cl.uint(111);
export const ERR_AUCTION_ENDED = Cl.uint(112);
export const ERR_BID_TOO_LOW = Cl.uint(113);
export const ERR_BUNDLE_EMPTY = Cl.uint(114);
export const ERR_BUNDLE_TOO_LARGE = Cl.uint(115);
export const ERR_ESCROW_LOCKED = Cl.uint(116);
export const ERR_NOT_BIDDER = Cl.uint(117);

// ============================================================================
// Conversion Utilities
// ============================================================================

/**
 * Convert STX to microSTX
 */
export function stxToMicroStx(stx: number): number {
  return Math.floor(stx * ONE_STX);
}

/**
 * Convert microSTX to STX
 */
export function microStxToStx(microStx: number): number {
  return microStx / ONE_STX;
}

/**
 * Convert basis points to percentage
 */
export function bpsToPercent(bps: number): number {
  return bps / 100;
}

/**
 * Convert percentage to basis points
 */
export function percentToBps(percent: number): number {
  return Math.floor(percent * 100);
}

// ============================================================================
// Calculation Helpers
// ============================================================================

/**
 * Calculate marketplace fee
 */
export function calculateMarketplaceFee(price: number): number {
  return Math.floor(price * (MARKETPLACE_FEE_BPS / 10000));
}

/**
 * Calculate royalty amount
 */
export function calculateRoyalty(price: number, royaltyBps: number): number {
  return Math.floor(price * (royaltyBps / 10000));
}

/**
 * Calculate seller proceeds after fees and royalties
 */
export function calculateSellerProceeds(
  price: number,
  royaltyBps: number = 0
): number {
  const marketplaceFee = calculateMarketplaceFee(price);
  const royalty = calculateRoyalty(price, royaltyBps);
  return price - marketplaceFee - royalty;
}

/**
 * Calculate minimum bid increment (5%)
 */
export function calculateMinBidIncrement(currentBid: number): number {
  return Math.floor(currentBid * 1.05);
}

// ============================================================================
// Assertion Helpers
// ============================================================================

/**
 * Assert value is within tolerance of expected
 */
export function assertWithinTolerance(
  actual: number,
  expected: number,
  tolerancePercent: number = 1
): boolean {
  const tolerance = expected * (tolerancePercent / 100);
  const diff = Math.abs(actual - expected);
  return diff <= tolerance;
}

/**
 * Assert STX balance changed by expected amount
 */
export function assertBalanceChange(
  balanceBefore: number,
  balanceAfter: number,
  expectedChange: number,
  tolerancePercent: number = 1
): boolean {
  const actualChange = balanceAfter - balanceBefore;
  return assertWithinTolerance(actualChange, expectedChange, tolerancePercent);
}

// ============================================================================
// Mock Data Generators
// ============================================================================

/**
 * Generate mock IPFS URI
 */
export function mockIpfsUri(id: string | number): string {
  return `ipfs://Qm${id}`;
}

/**
 * Generate mock collection name
 */
export function mockCollectionName(id: string | number): string {
  return `Test Collection ${id}`;
}

/**
 * Generate array of token IDs
 */
export function generateTokenIds(count: number, startId: number = 1): number[] {
  return Array.from({ length: count }, (_, i) => startId + i);
}

/**
 * Generate Clarity list of uints
 */
export function createUintList(values: number[]): ClarityValue {
  return Cl.list(values.map(v => Cl.uint(v)));
}

// ============================================================================
// Time Helpers
// ============================================================================

/**
 * Calculate blocks for time period
 * @param hours - Number of hours
 * @returns Number of blocks (assuming ~10 min blocks)
 */
export function hoursToBlocks(hours: number): number {
  return Math.floor(hours * 6); // 6 blocks per hour
}

/**
 * Calculate blocks for days
 */
export function daysToBlocks(days: number): number {
  return hoursToBlocks(days * 24);
}

// ============================================================================
// Test Scenario Builders
// ============================================================================

/**
 * Setup: Mint NFT for testing
 */
export interface MintNFTSetup {
  tokenId: number;
  owner: string;
  uri: string;
}

/**
 * Setup: Create collection for testing
 */
export interface CreateCollectionSetup {
  collectionId: number;
  name: string;
  maxSupply: number;
  royaltyBps: number;
  creator: string;
}

/**
 * Setup: Create listing for testing
 */
export interface CreateListingSetup {
  tokenId: number;
  price: number;
  seller: string;
  expirationBlocks?: number;
}

/**
 * Setup: Create auction for testing
 */
export interface CreateAuctionSetup {
  tokenId: number;
  reservePrice: number;
  duration: number;
  seller: string;
}

/**
 * Setup: Create bundle for testing
 */
export interface CreateBundleSetup {
  tokenIds: number[];
  price: number;
  seller: string;
}

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * Validate royalty percentage
 */
export function isValidRoyalty(royaltyBps: number): boolean {
  return royaltyBps >= 0 && royaltyBps <= MAX_ROYALTY_BPS;
}

/**
 * Validate listing price
 */
export function isValidListingPrice(price: number): boolean {
  return price >= MIN_LISTING_PRICE;
}

/**
 * Validate bundle size
 */
export function isValidBundleSize(tokenCount: number): boolean {
  return tokenCount > 0 && tokenCount <= MAX_BUNDLE_SIZE;
}

/**
 * Validate auction duration
 */
export function isValidAuctionDuration(blocks: number): boolean {
  return blocks >= 10 && blocks <= 17280; // Min 10 blocks, max ~120 days
}

// ============================================================================
// Pretty Printing
// ============================================================================

/**
 * Format microSTX for display
 */
export function formatStx(microStx: number): string {
  return `${microStxToStx(microStx).toFixed(6)} STX`;
}

/**
 * Format basis points as percentage
 */
export function formatBps(bps: number): string {
  return `${bpsToPercent(bps)}%`;
}

/**
 * Format test scenario description
 */
export function describeScenario(
  action: string,
  params: Record<string, any>
): string {
  const paramStrings = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join(", ");
  return `${action} (${paramStrings})`;
}

// ============================================================================
// Comparison Utilities
// ============================================================================

/**
 * Deep equal for Clarity values
 */
export function clarityValuesEqual(a: ClarityValue, b: ClarityValue): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Check if error matches expected
 */
export function isExpectedError(
  actual: ClarityValue,
  expectedErrorCode: number
): boolean {
  return clarityValuesEqual(actual, Cl.uint(expectedErrorCode));
}

// ============================================================================
// Export all
// ============================================================================

export default {
  // Constants
  ONE_STX,
  MIN_LISTING_PRICE,
  DEFAULT_AUCTION_DURATION,
  MAX_BUNDLE_SIZE,
  MARKETPLACE_FEE_BPS,
  MAX_ROYALTY_BPS,

  // Error codes
  ERR_NOT_OWNER,
  ERR_ALREADY_LISTED,
  ERR_NOT_LISTED,
  ERR_INVALID_PRICE,
  ERR_SELLER_ONLY,
  ERR_CANNOT_BUY_OWN,
  ERR_BUNDLE_EMPTY,
  ERR_BUNDLE_TOO_LARGE,

  // Functions
  stxToMicroStx,
  microStxToStx,
  bpsToPercent,
  percentToBps,
  calculateMarketplaceFee,
  calculateRoyalty,
  calculateSellerProceeds,
  calculateMinBidIncrement,
  assertWithinTolerance,
  assertBalanceChange,
  mockIpfsUri,
  mockCollectionName,
  generateTokenIds,
  createUintList,
  hoursToBlocks,
  daysToBlocks,
  isValidRoyalty,
  isValidListingPrice,
  isValidBundleSize,
  isValidAuctionDuration,
  formatStx,
  formatBps,
  describeScenario,
  clarityValuesEqual,
  isExpectedError,
};
