'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Store, CreateStoreData } from '@/types/store'
import { useUploadThing } from '@/lib/uploadthing'
import StoreCard from './StoreCard'

interface StoreDetailsProps {
  store: Store
  onStoreChange: () => void
  onBack: () => void
}

export default function StoreDetails({ store, onStoreChange, onBack }: StoreDetailsProps) {
  const [formData, setFormData] = useState<CreateStoreData>({
    name: store.name,
    description: store.description,
    storeType: store.storeType,
    village: store.village,
    phaseNumber: store.phaseNumber,
    blockNumber: store.blockNumber,
    lotNumber: store.lotNumber
  })
  const [logoUrl, setLogoUrl] = useState<string>(store.logoUrl || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const { startUpload, isUploading } = useUploadThing('storeLogo')

  const storeTypes = [
    'Restaurant',
    'Grocery',
    'Clothing',
    'Electronics',
    'Pharmacy',
    'Hardware',
    'Beauty & Wellness',
    'Sports & Fitness',
    'Bookstore',
    'Pet Store',
    'Other'
  ]

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadProgress(0)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) { clearInterval(progressInterval); return prev }
          return prev + Math.random() * 15
        })
      }, 200)

      const uploadResponse = await startUpload([file])
      clearInterval(progressInterval)
      setUploadProgress(100)

      if (uploadResponse && uploadResponse[0]) {
        setLogoUrl(uploadResponse[0].url)
        console.log('File uploaded successfully:', uploadResponse[0].url)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsUpdating(true)
    try {
      const storeData = {
        ...formData,
        logoUrl: logoUrl || undefined
      }

      const response = await fetch(`/api/stores/${store.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Store updated successfully:', result)
        
        // Notify parent components about the change
        onStoreChange()
        
        // Show success message
        alert('Store updated successfully!')
      } else {
        const error = await response.json()
        console.error('Error response:', error)
        alert(error.error || 'An error occurred')
      }
    } catch (error) {
      console.error('Error updating store:', error)
      alert('An error occurred while updating the store')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteStore = async () => {
    if (!confirm('Are you sure you want to delete this store? This action cannot be undone and will also delete all associated products.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/stores/${store.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        console.log('Store deleted successfully')
        
        // Notify parent components about the change
        onStoreChange()
        
        // Show success message and go back
        alert('Store deleted successfully!')
        onBack()
      } else {
        const error = await response.json()
        console.error('Error response:', error)
        alert(error.error || 'An error occurred while deleting the store')
      }
    } catch (error) {
      console.error('Error deleting store:', error)
      alert('An error occurred while deleting the store')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="w-full p-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Stores
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Store Details</h1>
          <p className="text-gray-600 mt-1">Manage your store information and settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left Column - Store Card Preview */}
        <div className="xl:col-span-1">
          <div className="sticky top-6">
            <StoreCard store={store} onViewDetails={() => {}} />
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-8">Edit Store Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Logo
                </label>
                <div className="space-y-4">
                  {/* Upload Area - Only show when no logo exists */}
                  {!logoUrl && (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="block w-full h-[350px] border-2 border-dashed border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col items-center justify-center h-full p-6">
                          {/* Upload Icon */}
                          <div className="relative mb-4">
                            <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                            {/* Plus Icon Overlay */}
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Upload Text */}
                          <p className="text-gray-700 text-lg font-medium mb-2">
                            Upload your store logo
                          </p>
                          
                          {/* Separator */}
                          <p className="text-gray-500 text-sm mb-4">
                            Or
                          </p>
                          
                          {/* Browse Files Button */}
                          <div className="px-6 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors">
                            <span className="text-gray-700 font-medium">Browse Files</span>
                          </div>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Current Logo Management - Only show when logo exists */}
                  {logoUrl && (
                    <div className="space-y-4">
                      <div className="relative inline-block">
                        <Image 
                          src={logoUrl} 
                          alt="Logo preview" 
                          width={96}
                          height={96}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200" 
                        />
                        {/* Remove Button - X icon overlay */}
                        <button
                          type="button"
                          onClick={() => setLogoUrl('')}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                          title="Remove logo"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">Logo uploaded successfully</p>
                        <p>This logo will be displayed in the store preview</p>
                        <p className="text-gray-500 mt-1">Recommended size: 96x96 pixels</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {isUploading && (
                  <div className="space-y-2 mt-4">
                    <div className="text-sm text-gray-600">Uploading...</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#1E466A] h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Store Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors"
                  placeholder="Enter store name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors resize-none"
                  placeholder="Enter store description"
                  rows={3}
                />
              </div>

              {/* Store Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Type *
                </label>
                <select
                  value={formData.storeType}
                  onChange={(e) => setFormData({ ...formData, storeType: e.target.value })}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors"
                  required
                >
                  {storeTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Village */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Village *
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors"
                  placeholder="Enter village name"
                  required
                />
              </div>

              {/* Phase, Block, Lot Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phase Number
                  </label>
                  <input
                    type="text"
                    value={formData.phaseNumber}
                    onChange={(e) => setFormData({ ...formData, phaseNumber: e.target.value })}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors"
                    placeholder="Phase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Block Number
                  </label>
                  <input
                    type="text"
                    value={formData.blockNumber}
                    onChange={(e) => setFormData({ ...formData, blockNumber: e.target.value })}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors"
                    placeholder="Block"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lot Number
                  </label>
                  <input
                    type="text"
                    value={formData.lotNumber}
                    onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors"
                    placeholder="Lot"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-gray-200 justify-end">
              <button
                  type="button"
                  onClick={handleDeleteStore}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-white text-red-700 font-semibold rounded-lg border border-red-700 hover:bg-red-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Store'}
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-3 bg-[#1E466A] text-white font-semibold rounded-lg hover:bg-[#1E466A]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdating ? 'Updating...' : 'Update Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
