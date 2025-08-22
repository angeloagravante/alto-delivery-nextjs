'use client'

import { useState } from 'react'
import { Store, CreateStoreData } from '@/types/store'
import { useUploadThing } from '@/lib/uploadthing'
import StoreCard from './StoreCard'
import Link from 'next/link'

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

  const handleViewDetails = () => {
    // This function is passed to StoreCard but won't be used in this view
    // since we're already showing the details
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Store Details</h2>
            <p className="text-gray-600">View and edit store information</p>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - Store Card */}
        <div className="flex justify-center lg:justify-start">
          <div className="w-full max-w-sm">
            <StoreCard
              store={store}
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>

        {/* Right Side - Edit Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Edit Store Information</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Logo
              </label>
              <div className="mb-4">
                {!logoUrl ? (
                  <>
                    <input type="file" name="file" id="file" className="sr-only" accept="image/png,image/jpeg" onChange={handleFileChange} />
                    <label htmlFor="file" className="relative flex min-h-[120px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-4 text-center cursor-pointer hover:border-[#1E466A] transition-colors">
                      <div>
                        <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="block text-sm font-medium text-gray-900 mb-1">Upload new logo</span>
                        <span className="block text-xs text-gray-500">Click to browse files</span>
                      </div>
                    </label>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">Current Logo</span>
                      <button 
                        type="button" 
                        onClick={() => setLogoUrl('')} 
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <img src={logoUrl} alt="Logo preview" className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
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
                  value={formData.lotNumber}
                  onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors"
                  placeholder="Lot"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#1E466A] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                disabled={isUpdating || isUploading}
              >
                {isUpdating ? 'Updating Store...' : 'Update Store'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
