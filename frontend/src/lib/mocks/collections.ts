import { Collection } from '../../services/collection';

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 1,
    name: "Genesis Punks",
    description: "The first collection on AuroraMint",
    logo: "https://placehold.co/100",
    banner: "https://placehold.co/600x200",
    floorPrice: 100,
    volume: 50000,
    owner: "SP123...",
  },
  {
    id: 2,
    name: "Stacks Monkeys",
    description: "Apes on Bitcoin L2",
    logo: "https://placehold.co/100?text=SM",
    banner: "https://placehold.co/600x200?text=Monkeys",
    floorPrice: 250,
    volume: 120000,
    owner: "SP456...",
  },
  {
    id: 3,
    name: "Bitcoin Birds",
    description: "Flying high on Stacks",
    logo: "https://placehold.co/100?text=BB",
    banner: "https://placehold.co/600x200?text=Birds",
    floorPrice: 50,
    volume: 10000,
    owner: "SP789...",
  },
  {
    id: 4,
    name: "Cyber Runners",
    description: "Futuristic PFPs",
    logo: "https://placehold.co/100?text=CR",
    banner: "https://placehold.co/600x200?text=Cyber",
    floorPrice: 500,
    volume: 85000,
    owner: "SPABC...",
  }
];

export const getMockCollection = (id: number) => MOCK_COLLECTIONS.find(c => c.id === id);
