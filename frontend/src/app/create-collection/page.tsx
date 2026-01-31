'use client';

import { CreateCollectionForm } from '@/components/forms/CreateCollectionForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CreateCollectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Create New Collection</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Deploy your own NFT collection to the Stacks blockchain.
          </p>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <CreateCollectionForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
