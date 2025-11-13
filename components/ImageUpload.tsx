'use client';

import { useState, useRef } from 'react';
import { Button } from './Button';

interface ImageUploadProps {
  onUpload: (file: File, preview: string) => void;
  currentImage?: string;
  maxSize?: number;
}

export const ImageUpload = ({ onUpload, currentImage, maxSize = 5 * 1024 * 1024 }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onUpload(file, result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {preview && (
          <img src={preview} alt="Profile preview" className="h-24 w-24 rounded-full object-cover" />
        )}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
            {preview ? 'Change Image' : 'Upload Image'}
          </Button>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
};

