'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
const MAX_FILES = 5;

interface ProductPhotoUploadProps {
  onFilesChange: (files: File[]) => void;
  existingPhotos?: Array<{ id: number; image_url: string }>;
  isDisabled?: boolean;
}

interface PreviewFile {
  file: File;
  preview: string;
  id: string;
}

export function ProductPhotoUpload({
  onFilesChange,
  existingPhotos = [],
  isDisabled = false,
}: ProductPhotoUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<PreviewFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type: ${file.name}. Allowed: JPG, PNG, GIF`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large: ${file.name}. Max 1MB`;
    }
    return null;
  };

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newFiles: PreviewFile[] = [];
      let errorCount = 0;

      Array.from(files).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          toast.error(error);
          errorCount++;
          return;
        }

        if (selectedFiles.length + newFiles.length >= MAX_FILES) {
          toast.error(`Maximum ${MAX_FILES} photos allowed`);
          return;
        }

        const preview = URL.createObjectURL(file);
        newFiles.push({
          file,
          preview,
          id: `${Date.now()}-${Math.random()}`,
        });
      });

      const updated = [...selectedFiles, ...newFiles];
      setSelectedFiles(updated);
      onFilesChange(updated.map((f) => f.file));

      if (newFiles.length > 0 && errorCount === 0) {
        toast.success(`Added ${newFiles.length} photo${newFiles.length > 1 ? 's' : ''}`);
      }
    },
    [selectedFiles, onFilesChange]
  );

  const removeFile = (id: string) => {
    const updated = selectedFiles.filter((f) => f.id !== id);
    setSelectedFiles(updated);
    onFilesChange(updated.map((f) => f.file));
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const fileCount = selectedFiles.length + existingPhotos.length;
  const canAddMore = fileCount < MAX_FILES && !isDisabled;

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 transition-colors',
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
          isDisabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          onChange={handleInputChange}
          disabled={!canAddMore}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Plus className="w-8 h-8 text-gray-400" />
          <div>
            <p className="font-medium text-gray-700">
              {canAddMore ? 'Drag & drop photos or click to select' : 'Maximum photos reached'}
            </p>
            <p className="text-sm text-gray-500">
              {ALLOWED_TYPES.map((t) => t.split('/')[1].toUpperCase()).join(', ')} • Max 1MB each
            </p>
          </div>
        </div>
      </div>

      {/* File Counter */}
      <div className="text-sm text-gray-600">
        {fileCount} / {MAX_FILES} photos
        {selectedFiles.length > 0 && <span className="text-blue-600 ml-2">({selectedFiles.length} new)</span>}
      </div>

      {/* Existing Photos */}
      {existingPhotos.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Current photos</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {existingPhotos.map((photo) => (
              <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border">
                <img
                  src={photo.image_url}
                  alt="Product photo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-medium">Existing</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New File Previews */}
      {selectedFiles.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">New photos</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {selectedFiles.map((item) => (
              <div key={item.id} className="relative aspect-square rounded-lg overflow-hidden border">
                <img
                  src={item.preview}
                  alt={item.file.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(item.id)}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  title={`Remove ${item.file.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-1 left-1 right-1 text-xs text-white bg-black/60 px-2 py-1 rounded truncate">
                  {item.file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
