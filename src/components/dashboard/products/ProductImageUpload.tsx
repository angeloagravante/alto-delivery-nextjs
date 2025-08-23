'use client'

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadThing } from '@/lib/uploadthing';
import { Upload, X, Eye } from 'lucide-react';
import Image from 'next/image';

interface ProductImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageName: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  imageName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="relative max-w-4xl max-h-[90vh] p-4">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-md transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <Image
          src={imageUrl}
          alt={imageName}
          fill
          className="max-w-full max-h-full object-contain rounded-lg"
          unoptimized
        />
      </div>
    </div>
  );
};

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10
}) => {
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    imageUrl: string;
    imageName: string;
  }>({
    isOpen: false,
    imageUrl: '',
    imageName: ''
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload } = useUploadThing("productImages", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        const newImageUrls = res.map(file => file.url);
        onImagesChange([...images, ...newImageUrls]);
        setUploading(false);
        setUploadProgress(0);
      }
    },
    onUploadError: (error: Error) => {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log('ProductImageUpload - Received files:', acceptedFiles);
    
    if (acceptedFiles.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      await startUpload(acceptedFiles);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
      setUploadProgress(0);
    }
  }, [startUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxSize: 8 * 1024 * 1024, // 8MB
    maxFiles: maxImages - images.length
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const openPreview = (imageUrl: string, imageName: string) => {
    setPreviewModal({
      isOpen: true,
      imageUrl,
      imageName
    });
  };

  const closePreview = () => {
    setPreviewModal({
      isOpen: false,
      imageUrl: '',
      imageName: ''
    });
  };

  const remainingSlots = maxImages - images.length;

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-2">
                <div className="relative aspect-square">
                  <Image
                    src={image}
                    alt={`Product ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                    onLoad={() => console.log('Regular img loaded successfully:', image)}
                    onError={(e) => console.error('Image failed to load:', image, e)}
                    unoptimized
                  />
                  
                  {/* Preview Button */}
                  <button
                    onClick={() => openPreview(image, `Product ${index + 1}`)}
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white text-gray-800 p-1 rounded-md"
                  >
                    <Eye className="h-3 w-3" />
                  </button>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/80 hover:bg-red-500 text-white p-1 rounded-md"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  
                  {/* Main Badge for first image */}
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Main
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1 text-center">
                  Image {index + 1}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {remainingSlots > 0 && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : uploading
              ? "border-gray-400 bg-gray-50 cursor-not-allowed"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <input {...getInputProps()} disabled={uploading} />
          <div className="flex flex-col items-center space-y-4">
            {uploading ? (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <div>
                  <p className="text-lg font-medium text-blue-900">
                    Uploading images...
                  </p>
                  <p className="text-sm text-blue-500">
                    {uploadProgress}% complete
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Upload product images
                  </p>
                  <p className="text-sm text-gray-500">
                    Drag & drop or click to select
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  JPEG, PNG, WebP, GIF up to 8MB each
                </div>
                <div className="text-sm text-gray-500">
                  {remainingSlots} images remaining
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      <ImagePreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreview}
        imageUrl={previewModal.imageUrl}
        imageName={previewModal.imageName}
      />
    </div>
  );
};

export default ProductImageUpload;
