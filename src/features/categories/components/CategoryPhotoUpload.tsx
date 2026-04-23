'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

interface CategoryPhotoUploadProps {
  onFileChange: (file: File | null) => void;
  existingPhoto?: string | null;
  isDisabled?: boolean;
}

interface PreviewFile {
  file: File;
  preview: string;
}

export function CategoryPhotoUpload({
  onFileChange,
  existingPhoto,
  isDisabled = false,
}: CategoryPhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<PreviewFile | null>(null);
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
      if (!files || files.length === 0) return;

      const file = files[0];
      const error = validateFile(file);

      if (error) {
        toast.error(error);
        return;
      }

      const preview = URL.createObjectURL(file);
      setSelectedFile({ file, preview });
      onFileChange(file);
      toast.success('Photo selected');
    },
    [onFileChange]
  );

  const removeFile = () => {
    setSelectedFile(null);
    onFileChange(null);
    toast.success('Photo removed');
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

  const hasPhoto = selectedFile || existingPhoto;

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      {!hasPhoto ? (
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
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleInputChange}
            disabled={isDisabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <Upload className="w-8 h-8 text-gray-400" />
            <div>
              <p className="font-medium text-gray-700">Drag & drop a photo or click to select</p>
              <p className="text-sm text-gray-500">JPG, PNG, GIF • Max 1MB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Existing Photo */}
          {existingPhoto && !selectedFile && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Current photo</p>
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                <img
                  src={existingPhoto}
                  alt="Category photo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Preview */}
          {selectedFile && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                {existingPhoto ? 'New photo (will replace current)' : 'Selected photo'}
              </p>
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border bg-gray-50">
                <img
                  src={selectedFile.preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeFile}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  title="Remove photo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Replace/Change Button */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              'relative border-2 border-dashed rounded-lg p-6 transition-colors',
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            )}
          >
            <input
              type="file"
              accept={ALLOWED_TYPES.join(',')}
              onChange={handleInputChange}
              disabled={isDisabled}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className="flex flex-col items-center justify-center gap-1 text-center text-sm">
              <Plus className="w-5 h-5 text-gray-400" />
              <p className="font-medium text-gray-700">
                {existingPhoto && selectedFile ? 'Or drag & drop to replace' : 'Drag & drop to replace or click'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
