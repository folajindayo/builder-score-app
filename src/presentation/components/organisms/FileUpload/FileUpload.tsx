/**
 * FileUpload Organism Component
 * Drag-and-drop file upload
 */

import { useState, useRef, HTMLAttributes, forwardRef } from 'react';
import { Button } from '@atoms/Button';
import { Text } from '@atoms/Text';
import { Badge } from '@atoms/Badge';
import { ComponentProps } from '@presentation/types';

export interface FileUploadProps extends ComponentProps, Omit<HTMLAttributes<HTMLDivElement>, 'className'> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  onFilesSelect: (files: File[]) => void;
  disabled?: boolean;
}

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      accept,
      multiple = false,
      maxSize,
      onFilesSelect,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      handleFiles(files);
    };

    const handleFiles = (files: File[]) => {
      let validFiles = files;

      if (maxSize) {
        validFiles = files.filter((file) => file.size <= maxSize);
      }

      setSelectedFiles(validFiles);
      onFilesSelect(validFiles);
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const UploadIcon = (
      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    );

    return (
      <div ref={ref} className={className} {...props}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={disabled}
          className="hidden"
        />

        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : disabled
              ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-gray-400 dark:border-gray-700'
          }`}
        >
          <div className="flex flex-col items-center gap-4">
            {UploadIcon}
            <div>
              <Text weight="semibold">
                {isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
              </Text>
              <Text size="sm" color="muted">
                {accept || 'Any file type'}
                {maxSize && ` · Max ${formatFileSize(maxSize)}`}
              </Text>
            </div>
            <Button type="button" disabled={disabled}>
              Select Files
            </Button>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-md"
              >
                <div className="flex-1 min-w-0">
                  <Text className="truncate">{file.name}</Text>
                  <Text size="sm" color="muted">
                    {formatFileSize(file.size)}
                  </Text>
                </div>
                <Badge variant="subtle" colorScheme="success">
                  Ready
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

