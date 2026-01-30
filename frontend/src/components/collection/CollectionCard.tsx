import React from 'react';
import { Collection } from '../../services/collection';

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-32 w-full relative">
        <img 
          src={collection.banner} 
          alt={`${collection.name} banner`}
          className="w-full h-full object-cover" 
        />
        <div className="absolute -bottom-10 left-4">
          <img 
            src={collection.logo} 
            alt={`${collection.name} logo`}
            className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800"
          />
        </div>
      </div>
      <div className="pt-12 pb-4 px-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{collection.name}</h3>
        <p className="text-sm text-gray-500 mt-1 truncate">{collection.description}</p>
        
        <div className="flex justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-500 uppercase">Floor</p>
            <p className="font-semibold">{collection.floorPrice} STX</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase">Volume</p>
            <p className="font-semibold">{collection.volume.toLocaleString()} STX</p>
          </div>
        </div>
      </div>
    </div>
  );
};
