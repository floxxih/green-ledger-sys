import React from 'react';
import { Collection } from '../../services/collection';

interface CollectionHeaderProps {
  collection: Collection;
}

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({ collection }) => {
  return (
    <div className="relative">
      <div className="h-48 md:h-64 w-full bg-gray-200 dark:bg-gray-800">
        <img 
          src={collection.banner} 
          alt={collection.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container mx-auto px-4">
        <div className="relative -mt-16 mb-6 flex flex-col md:flex-row items-center md:items-end gap-6">
          <img 
            src={collection.logo} 
            alt={collection.name} 
            className="w-32 h-32 rounded-xl border-4 border-white dark:border-gray-900 shadow-lg"
          />
          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-3xl font-bold">{collection.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">{collection.description}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Mint
            </button>
            <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
