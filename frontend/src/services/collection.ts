import { CONTRACTS } from '../lib/constants';
import { MOCK_COLLECTIONS } from '../lib/mocks/collections';

export interface Collection {
  id: number;
  name: string;
  description: string;
  logo: string;
  banner: string;
  floorPrice: number;
  volume: number;
  owner: string;
}

export const CollectionService = {
  getCollections: async (): Promise<Collection[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return MOCK_COLLECTIONS;
  },

  getCollectionById: async (id: number): Promise<Collection | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_COLLECTIONS.find(c => c.id === id) || null;
  },

  getCollectionStats: async (id: number) => {
    // Mock stats
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      items: 10000,
      owners: 2500,
      floorPrice: 100,
      volume: 50000,
      listed: 120
    };
  },

  createCollection: async (data: Partial<Collection>) => {
    // Contract call preparation logic would go here
    console.log("Preparing to create collection:", data);
    return true;
  }
};
