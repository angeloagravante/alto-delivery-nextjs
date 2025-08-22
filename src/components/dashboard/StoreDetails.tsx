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

  return (
    <div className="max-w-4xl mx-auto p-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Store Card Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Store Preview</h2>
            <StoreCard store={store} onViewDetails={() => {}} />
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Store Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Logo
                </label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#1E466A] file:text-white hover:file:bg-[#1E466A]/90 transition-colors"
                    />
                    {logoUrl && (
                      <button
                        type="button"
                        onClick={() => setLogoUrl('')}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        title="Remove logo"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {logoUrl && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Current Logo:</span>
                        <button
                          type="button"
                          onClick={() => setLogoUrl('')}
                          className="text-sm text-red-600 hover:text-red-800 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex justify-center">
                        <Image 
                          src={logoUrl} 
                          alt="Logo preview" 
                          width={96}
                          height={96}
                          className="w-24 h-24 object-cover rounded-lg border border-gray-200" 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {isUploading && (
                  <div className="space-y-2">
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
                    value={formData.blockNumber}
                    onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors"
                    placeholder="Lot"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 bg-[#1E466A] text-white font-semibold rounded-lg hover:bg-[#1E466A]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isUpdating ? 'Updating...' : 'Update Store'}
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
