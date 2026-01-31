export interface CreateCollectionFormData {
  name: string;
  description: string;
  maxSupply: number;
  royalty: number;
  logo: File | null;
  banner: File | null;
  website?: string;
  twitter?: string;
  discord?: string;
}

export const initialCreateCollectionState: CreateCollectionFormData = {
  name: '',
  description: '',
  maxSupply: 1000,
  royalty: 5,
  logo: null,
  banner: null,
};
