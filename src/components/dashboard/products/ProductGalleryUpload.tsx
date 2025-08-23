'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useUploadThing } from '@/lib/uploadthing'
import { Upload, X, Plus } from 'lucide-react'
import Image from 'next/image'

interface ProductGalleryUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

const ProductGalleryUpload: React.FC<ProductGalleryUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const { startUpload } = useUploadThing("productImages", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        const newImageUrls = res.map(file => file.url)
        onImagesChange([...images, ...newImageUrls])
        setUploading(false)
        setUploadProgress(0)
        // Select the first newly uploaded image
        setSelectedImageIndex(images.length)
      }
    },
    onUploadError: (error: Error) => {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
      setUploading(false)
      setUploadProgress(0)
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress)
    },
  })

  // Main upload zone dropzone
  const onDropMain = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    
    setUploading(true)
    setUploadProgress(0)
    
    try {
      await startUpload(acceptedFiles)
    } catch (error) {
      console.error('Upload failed:', error)
      setUploading(false)
      setUploadProgress(0)
    }
  }, [startUpload])

  // Add more button dropzone - separate from main
  const onDropAdd = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return
    
    setUploading(true)
    setUploadProgress(0)
    
    try {
      await startUpload(acceptedFiles)
    } catch (error) {
      console.error('Upload failed:', error)
      setUploading(false)
      setUploadProgress(0)
    }
  }, [startUpload])

  const { getRootProps: getMainRootProps, getInputProps: getMainInputProps, isDragActive: isMainDragActive } = useDropzone({
    onDrop: onDropMain,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxSize: 8 * 1024 * 1024, // 8MB
    maxFiles: maxImages - images.length,
    disabled: uploading
  })

  const { getRootProps: getAddRootProps, getInputProps: getAddInputProps, isDragActive: isAddDragActive } = useDropzone({
    onDrop: onDropAdd,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxSize: 8 * 1024 * 1024, // 8MB
    maxFiles: maxImages - images.length,
    disabled: uploading
  })

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
    // Adjust selected index if needed
    if (selectedImageIndex >= newImages.length) {
      setSelectedImageIndex(Math.max(0, newImages.length - 1))
    }
  }

  const selectImage = (index: number) => {
    setSelectedImageIndex(index)
  }

  const remainingSlots = maxImages - images.length

  return (
    <div className="space-y-4">
      {/* Main Preview Area - Square Aspect Ratio */}
      <div className="relative w-full aspect-square bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
        {images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={images[selectedImageIndex]}
              alt={`Product preview ${selectedImageIndex + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
            {/* Remove Button for Selected Image */}
            <button
              onClick={() => removeImage(selectedImageIndex)}
              className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-full transition-colors shadow-lg"
              title="Remove this image"
            >
              <X className="h-4 w-4" />
            </button>
            {/* Image Counter */}
            <div className="absolute top-3 left-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} of {images.length}
            </div>
          </div>
        ) : (
          // Upload Drop Zone when no images
          <div
            {...getMainRootProps()}
            className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-colors ${
              isMainDragActive
                ? "border-blue-500 bg-blue-50"
                : uploading
                ? "border-gray-400 bg-gray-50 cursor-not-allowed"
                : "hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <input {...getMainInputProps()} disabled={uploading} />
            {uploading ? (
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
                <p className="text-base font-medium text-blue-900">Uploading...</p>
                <p className="text-sm text-blue-500">{uploadProgress}% complete</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-base font-medium text-gray-700 mb-2">
                  Upload your first product image
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Drag & drop or click to select
                </p>
                <div className="text-xs text-gray-400">
                  JPEG, PNG, WebP, GIF up to 8MB each
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Carousel/Thumbnail Row - smaller thumbnails */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {/* Existing Image Thumbnails */}
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => selectImage(index)}
            className={`relative flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
              selectedImageIndex === index
                ? 'border-blue-500 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
          </button>
        ))}

        {/* Add More Images Button - Fixed upload issue */}
        {remainingSlots > 0 && (
          <div className="flex-shrink-0">
            <div
              {...getAddRootProps()}
              className={`w-12 h-12 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer transition-colors ${
                isAddDragActive
                  ? "border-blue-500 bg-blue-50"
                  : uploading
                  ? "border-gray-400 bg-gray-50 cursor-not-allowed"
                  : "hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              <input {...getAddInputProps()} disabled={uploading} />
              {uploading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
              ) : (
                <Plus className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Upload Info */}
      <div className="text-sm text-gray-500 text-center">
        {images.length === 0 ? (
          <p>Upload up to {maxImages} product images</p>
        ) : (
          <p>
            {images.length} of {maxImages} images uploaded
            {remainingSlots > 0 && ` • ${remainingSlots} slots remaining`}
          </p>
        )}
      </div>
    </div>
  )
}

export default ProductGalleryUpload
