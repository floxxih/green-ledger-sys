/**
 * Network Configuration Utilities
 * Centralized network management for Stacks blockchain
 * @module network
 * @version 1.0.0
 */

import { StacksMainnet, StacksTestnet, StacksDevnet, type StacksNetwork } from '@stacks/network';

// ============================================================================
// Network Configuration
// ============================================================================

export const NETWORKS = {
  mainnet: {
    name: 'Mainnet',
    network: new StacksMainnet(),
    url: 'https://api.mainnet.hiro.so',
    explorerUrl: 'https://explorer.stacks.co',
    wsUrl: 'wss://api.mainnet.hiro.so',
  },
  testnet: {
    name: 'Testnet',
    network: new StacksTestnet(),
    url: 'https://api.testnet.hiro.so',
    explorerUrl: 'https://explorer.stacks.co/?chain=testnet',
    wsUrl: 'wss://api.testnet.hiro.so',
  },
  devnet: {
    name: 'Devnet',
    network: new StacksDevnet({ url: 'http://localhost:3999' }),
    url: 'http://localhost:3999',
    explorerUrl: 'http://localhost:8000',
    wsUrl: 'ws://localhost:3999',
  },
} as const;

export type NetworkKey = keyof typeof NETWORKS;

// ============================================================================
// Network Helper Functions
// ============================================================================

/**
 * Get current network from environment or default to mainnet
 */
export function getCurrentNetworkKey(): NetworkKey {
  const env = process.env.NEXT_PUBLIC_NETWORK;
  if (env === 'testnet' || env === 'devnet') {
    return env;
  }
  return 'mainnet';
}

/**
 * Get network configuration
 */
export function getNetwork(networkKey?: NetworkKey): StacksNetwork {
  const key = networkKey || getCurrentNetworkKey();
  return NETWORKS[key].network;
}

/**
 * Get API URL for network
 */
export function getApiUrl(networkKey?: NetworkKey): string {
  const key = networkKey || getCurrentNetworkKey();
  return NETWORKS[key].url;
}

/**
 * Get explorer URL for network
 */
export function getExplorerUrl(networkKey?: NetworkKey): string {
  const key = networkKey || getCurrentNetworkKey();
  return NETWORKS[key].explorerUrl;
}

/**
 * Check if address is valid for current network
 */
export function isValidAddress(address: string, networkKey?: NetworkKey): boolean {
  const key = networkKey || getCurrentNetworkKey();
  
  if (key === 'mainnet') {
    return address.startsWith('SP') || address.startsWith('SM');
  } else {
    return address.startsWith('ST') || address.startsWith('SN');
  }
}

/**
 * Get WebSocket URL for network
 */
export function getWsUrl(networkKey?: NetworkKey): string {
  const key = networkKey || getCurrentNetworkKey();
  return NETWORKS[key].wsUrl;
}

// ============================================================================
// Network Detection
// ============================================================================

/**
 * Detect network from address prefix
 */
export function detectNetworkFromAddress(address: string): NetworkKey | null {
  if (address.startsWith('SP') || address.startsWith('SM')) {
    return 'mainnet';
  } else if (address.startsWith('ST') || address.startsWith('SN')) {
    return 'testnet';
  }
  return null;
}

/**
 * Check if running on localhost/devnet
 */
export function isDevnet(): boolean {
  return getCurrentNetworkKey() === 'devnet';
}

/**
 * Check if running on testnet
 */
export function isTestnet(): boolean {
  return getCurrentNetworkKey() === 'testnet';
}

/**
 * Check if running on mainnet
 */
export function isMainnet(): boolean {
  return getCurrentNetworkKey() === 'mainnet';
}
