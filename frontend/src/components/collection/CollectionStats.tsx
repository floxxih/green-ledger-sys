import React from 'react';

interface StatsProps {
  stats: {
    items: number;
    owners: number;
    floorPrice: number;
    volume: number;
    listed: number;
  };
}

export const CollectionStats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-6 border-y border-gray-200 dark:border-gray-800 my-6">
      <div className="text-center">
        <p className="text-xs uppercase text-gray-500 font-semibold">Items</p>
        <p className="text-xl font-bold">{stats.items.toLocaleString()}</p>
      </div>
      <div className="text-center">
        <p className="text-xs uppercase text-gray-500 font-semibold">Owners</p>
        <p className="text-xl font-bold">{stats.owners.toLocaleString()}</p>
      </div>
      <div className="text-center">
        <p className="text-xs uppercase text-gray-500 font-semibold">Floor Price</p>
        <p className="text-xl font-bold">{stats.floorPrice} STX</p>
      </div>
      <div className="text-center">
        <p className="text-xs uppercase text-gray-500 font-semibold">Volume Traded</p>
        <p className="text-xl font-bold">{stats.volume.toLocaleString()} STX</p>
      </div>
      <div className="text-center">
        <p className="text-xs uppercase text-gray-500 font-semibold">Listed</p>
        <p className="text-xl font-bold">{stats.listed}</p>
      </div>
    </div>
  );
};
