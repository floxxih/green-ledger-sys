import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  label: string;
  onChange: (file: File) => void;
  aspectRatio?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ label, onChange, aspectRatio = 'aspect-square' }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`relative ${aspectRatio} w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg hover:border-purple-500 cursor-pointer overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors`}
      >
        {preview ? (
          <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-4">
            <div className="text-gray-400 mb-2">📸</div>
            <p className="text-sm text-gray-500">Click to upload</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
    </div>
  );
};
