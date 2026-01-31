import { CollectionService } from '@/services/collection';
import { CollectionHeader } from '@/components/collection/CollectionHeader';
import { CollectionStats } from '@/components/collection/CollectionStats';
import { notFound } from 'next/navigation';

export default async function CollectionDetailsPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const collection = await CollectionService.getCollectionById(id);
  
  if (!collection) {
    notFound();
  }

  const stats = await CollectionService.getCollectionStats(id);

  return (
    <div className="min-h-screen pb-20">
      <CollectionHeader collection={collection} />
      
      <div className="container mx-auto px-4">
        <CollectionStats stats={stats} />
        
        {/* Placeholder for items grid */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Items</h2>
          <div className="p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <p className="text-gray-500">NFT items will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
