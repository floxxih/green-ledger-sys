import React, { useState } from 'react';
import { CreateCollectionFormData, initialCreateCollectionState } from './types';
import { ImageUpload } from './ImageUpload';
import { CollectionService } from '@/services/collection';
import { useRouter } from 'next/navigation';

export const CreateCollectionForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateCollectionFormData>(initialCreateCollectionState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await CollectionService.createCollection(formData);
      // Simulate success
      router.push('/collections');
    } catch (error) {
      console.error('Failed to create collection', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUpload 
          label="Logo Image" 
          onChange={(file) => setFormData(prev => ({ ...prev, logo: file }))} 
        />
        <ImageUpload 
          label="Banner Image" 
          aspectRatio="aspect-[3/1]"
          onChange={(file) => setFormData(prev => ({ ...prev, banner: file }))} 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Collection Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Max Supply</label>
          <input
            type="number"
            name="maxSupply"
            value={formData.maxSupply}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Royalty (%)</label>
          <input
            type="number"
            name="royalty"
            value={formData.royalty}
            onChange={handleChange}
            min="0"
            max="10"
            step="0.1"
            className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
      >
        {isSubmitting ? 'Creating...' : 'Create Collection'}
      </button>
    </form>
  );
};
