'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Store, CreateStoreData } from '@/types/store'
import { useUploadThing } from '@/lib/uploadthing'
import { useStore } from '@/components/dashboard/DashboardWrapper'

interface StoreManagementProps {
  onStoreChange: () => void
}

export default function StoreManagement({ onStoreChange }: StoreManagementProps) {
  const [stores, setStores] = useState<Store[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingStore, setEditingStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<CreateStoreData>({
    name: '',
    description: '',
    storeType: '',
    village: '',
    phaseNumber: '',
    blockNumber: '',
    lotNumber: ''
  })
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [formReady, setFormReady] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const { startUpload, isUploading } = useUploadThing('storeLogo')
  const { refreshStores } = useStore()

  // Configuration check for debugging
  useEffect(() => {
    console.log('=== UPLOADTHING CONFIGURATION CHECK ===')
    console.log('NEXT_PUBLIC_UPLOADTHING_URL:', process.env.NEXT_PUBLIC_UPLOADTHING_URL)
    console.log('UPLOADTHING_SECRET exists:', !!process.env.UPLOADTHING_SECRET)
    console.log('UPLOADTHING_APP_ID exists:', !!process.env.UPLOADTHING_APP_ID)
    console.log('Current uploadthing config:', { startUpload: !!startUpload, isUploading })
    console.log('=== END CONFIG CHECK ===')
  }, [startUpload, isUploading])

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

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores')
      if (response.ok) {
        const storesData = await response.json()
        console.log('Fetched stores data:', storesData)
        storesData.forEach((store: Store, index: number) => {
          console.log(`Store ${index + 1}:`, {
            id: store.id,
            name: store.name,
            logoUrl: store.logoUrl,
            hasLogoUrl: !!store.logoUrl,
            logoUrlType: typeof store.logoUrl
          })
        })
        setStores(storesData)
      } else {
        const errorData = await response.json()
        console.error('Stores API error:', errorData)
        console.error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error fetching stores:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Ensure all form data values are strings before submission
      const sanitizedFormData = ensureStringValues(formData)
      const storeData = {
        ...sanitizedFormData,
        logoUrl: logoUrl || undefined
      }

      console.log('=== FORM SUBMISSION DEBUG ===')
      console.log('Original logoUrl state:', logoUrl)
      console.log('Type of logoUrl:', typeof logoUrl)
      console.log('Is logoUrl truthy?', !!logoUrl)
      console.log('Sanitized form data:', sanitizedFormData)
      console.log('Final store data being sent:', storeData)
      console.log('Logo URL in final data:', storeData.logoUrl)
      console.log('=== END DEBUG ===')

      const url = editingStore ? `/api/stores/${editingStore.id}` : '/api/stores'
      const method = editingStore ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData)
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Store saved successfully:', result)
        
        // Refresh stores list immediately
        await fetchStores()
        
        // Notify parent components about the change
        onStoreChange()
        refreshStores()
        
        // Close modal and reset form
        setIsAddModalOpen(false)
        setEditingStore(null)
        
        // Reset form after modal is closed to avoid clearing logo URL prematurely
        setTimeout(() => {
          resetForm()
        }, 100)
        
        // Show success message
        console.log(`Store ${editingStore ? 'updated' : 'created'} successfully!`)
      } else {
        const error = await response.json()
        console.error('Error response:', error)
        alert(error.error || 'An error occurred')
      }
    } catch (error) {
      console.error('Error saving store:', error)
      alert('An error occurred while saving the store')
    }
  }

  const handleDelete = async (storeId: string) => {
    if (!confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/stores/${storeId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchStores()
        onStoreChange()
        refreshStores() // Notify other components that stores changed
      } else {
        const error = await response.json()
        alert(error.error || 'An error occurred')
      }
    } catch (error) {
      console.error('Error deleting store:', error)
      alert('An error occurred while deleting the store')
    }
  }

  const handleEdit = (store: Store) => {
    setEditingStore(store)
    setFormData(ensureStringValues({
      name: store.name,
      description: store.description,
      storeType: store.storeType,
      village: store.village,
      phaseNumber: store.phaseNumber,
      blockNumber: store.blockNumber,
      lotNumber: store.lotNumber
    }))
    setLogoUrl(store.logoUrl || '')
    setIsAddModalOpen(true)
  }

  // Helper function to ensure all form values are strings
  const ensureStringValues = (data: Partial<CreateStoreData>): CreateStoreData => ({
    name: data.name || '',
    description: data.description || '',
    storeType: data.storeType || '',
    village: data.village || '',
    phaseNumber: data.phaseNumber || '',
    blockNumber: data.blockNumber || '',
    lotNumber: data.lotNumber || ''
  })

  const resetForm = () => {
    setFormData(ensureStringValues({}))
    setLogoUrl('')
    setUploadProgress(0)
  }

  const openAddModal = () => {
    resetForm()
    setEditingStore(null)
    setIsAddModalOpen(true)
  }

  // Ensure form data is properly initialized when modal opens
  useEffect(() => {
    if (isAddModalOpen && !editingStore) {
      // For new stores, ensure all fields are empty strings
      setFormData(ensureStringValues({}))
      setLogoUrl('')
      setFormReady(true)
    } else if (isAddModalOpen && editingStore) {
      setFormReady(true)
    } else {
      setFormReady(false)
    }
  }, [isAddModalOpen, editingStore])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex mb-1 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Store Management</h2>
          <p className="text-gray-600">Manage your stores and their settings</p>
        </div>
        {stores.length < 3 && (
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#1E466A] text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Store
          </button>
        )}
      </div>

      <div className="pl-0">
        <p className="text-xs text-gray-600">
          You can create up to 3 stores. Currently using {stores.length}/3.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <div key={store.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {store.logoUrl ? (
                  <Image 
                    src={store.logoUrl} 
                    alt={store.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', store.logoUrl, e)
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', store.logoUrl)
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-600">
                      {store.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{store.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {store.storeType}
                    </span>
                  </div>
                  {store.description && (
                    <p className="text-sm text-gray-600 mt-1">{store.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(store)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(store.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            
            {/* Store Address Information */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{store.village}</span>
              </div>
              
              {(store.phaseNumber || store.blockNumber || store.lotNumber) && (
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {store.phaseNumber && (
                    <span>Phase {store.phaseNumber}</span>
                  )}
                  {store.blockNumber && (
                    <span>Block {store.blockNumber}</span>
                  )}
                  {store.lotNumber && (
                    <span>Lot {store.lotNumber}</span>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-500 mt-4">
              Created {new Date(store.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-white/20 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="rounded-lg bg-white p-6 w-full max-w-md mx-4 shadow-2xl transform transition-all duration-200 ease-out scale-100">
            {!formReady ? (
              <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-grey">Loading form...</span>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4 text-black">
                  {editingStore ? 'Edit Store' : 'Add New Store'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-black/50 mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                  placeholder="Enter store name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none bg-white text-gray-900"
                  placeholder="Enter store description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Store Type *
                </label>
                <select
                  value={formData.storeType || ''}
                  onChange={(e) => setFormData({ ...formData, storeType: e.target.value })}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white ${
                    !formData.storeType ? 'text-gray-500' : 'text-gray-900'
                  }`}
                  required
                >
                  <option value="" className="text-gray-900">Select store type</option>
                  {storeTypes.map(type => (
                    <option key={type} value={type} className="text-gray-900">{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Village *
                </label>
                <input
                  type="text"
                  value={formData.village || ''}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                  placeholder="Enter village name"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Phase Number
                  </label>
                  <input
                    type="text"
                    value={formData.phaseNumber || ''}
                    onChange={(e) => setFormData({ ...formData, phaseNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    placeholder="Phase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Block Number
                  </label>
                  <input
                    type="text"
                    value={formData.blockNumber || ''}
                    onChange={(e) => setFormData({ ...formData, blockNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    placeholder="Block"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Lot Number
                  </label>
                  <input
                    type="text"
                    value={formData.lotNumber || ''}
                    onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    placeholder="Lot"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Store Logo
                </label>
                
                {/* Upload Files Section */}
                <div className="mb-4">
                  
                  {/* File Upload Zone */}
                  <div className="flex-1 items-center max-w-screen-sm mx-auto mb-3 space-y-4 sm:flex sm:space-y-0">
                    <div className="relative w-full">
                      <div className="items-center justify-center max-w-xl mx-auto">
                        {/* Show upload box only when no image is uploaded */}
                        {!logoUrl ? (
                          <label className="relative flex justify-center w-full h-15 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none" id="drop">
                            <span className="flex items-center space-x-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                              </svg>
                              <span className="text-xs text-gray-600">
                                Drop files to Attach, or
                                <span className="text-blue-600 underline ml-[4px] cursor-pointer">browse</span>
                              </span>
                            </span>
                            
                            <input 
                              type="file" 
                              name="file_upload" 
                              className="hidden" 
                              accept="image/png,image/jpeg"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  try {
                                    console.log('=== UPLOAD DEBUG ===')
                                    console.log('File details:', { name: file.name, size: file.size, type: file.type })
                                    
                                    // Reset progress and start upload
                                    setUploadProgress(0)
                                    
                                    // Simulate progress updates during upload
                                    const progressInterval = setInterval(() => {
                                      setUploadProgress(prev => {
                                        if (prev >= 90) {
                                          clearInterval(progressInterval)
                                          return prev
                                        }
                                        return prev + Math.random() * 15
                                      })
                                    }, 200)
                                    
                                    const uploadResponse = await startUpload([file])
                                    console.log('Full upload response:', uploadResponse)
                                    console.log('Upload response type:', typeof uploadResponse)
                                    console.log('Upload response length:', uploadResponse?.length)
                                    console.log('Upload response keys:', uploadResponse ? Object.keys(uploadResponse) : 'undefined')
                                    
                                    // Clear progress interval and set to 100%
                                    clearInterval(progressInterval)
                                    setUploadProgress(100)
                                    
                                    // Handle different possible response formats
                                    let logoUrl = null
                                    if (uploadResponse && Array.isArray(uploadResponse) && uploadResponse.length > 0) {
                                      const firstResult = uploadResponse[0]
                                      console.log('First upload result:', firstResult)
                                      console.log('First result keys:', Object.keys(firstResult))
                                      
                                      // Use the url property from the upload result
                                      logoUrl = firstResult.url
                                      console.log('Extracted logo URL:', logoUrl)
                                    }
                                    
                                    if (logoUrl) {
                                      console.log('Setting logo URL to:', logoUrl)
                                      
                                      // Validate the URL format
                                      try {
                                        const url = new URL(logoUrl)
                                        console.log('URL validation passed:', {
                                          protocol: url.protocol,
                                          hostname: url.hostname,
                                          pathname: url.pathname
                                        })
                                        
                                        // Check if it's a valid UploadThing URL
                                        if (url.hostname.includes('utfs.io') || url.hostname.includes('uploadthing.com')) {
                                          console.log('Valid UploadThing URL detected')
                                        } else {
                                          console.warn('Non-UploadThing URL detected:', url.hostname)
                                        }
                                        
                                        setLogoUrl(logoUrl)
                                      } catch (urlError) {
                                        console.error('Invalid URL format:', logoUrl, urlError)
                                        alert('Invalid URL format received from upload service')
                                      }
                                    } else {
                                      console.error('Could not extract logo URL from response:', uploadResponse)
                                      alert('Upload completed but could not get file URL')
                                    }
                                    console.log('=== END UPLOAD DEBUG ===')
                                  } catch (uploadError) {
                                    console.error('Upload error:', uploadError)
                                    alert('Error uploading file')
                                    setUploadProgress(0)
                                  }
                                }
                              }}
                              disabled={isUploading}
                              id="logo-file-input"
                            />
                          </label>
                        ) : (
                          /* Show image preview when uploaded */
                          <div className="relative w-full h-20 px-4 bg-white rounded-md">
                            <div className="absolute top-2 left-2 z-20">
                              <div className="relative">
                                <Image 
                                  src={logoUrl} 
                                  alt="Logo preview" 
                                  width={60}
                                  height={60}
                                  className="w-20 h-20 object-cover rounded-lg"
                                  onError={(e) => {
                                    console.error('Preview image failed to load:', logoUrl, e)
                                    console.error('Image error details:', {
                                      url: logoUrl,
                                      error: e,
                                      timestamp: new Date().toISOString()
                                    })
                                  }}
                                  onLoad={() => {
                                    console.log('Preview image loaded successfully:', logoUrl)
                                  }}
                                />
                                {/* Remove button */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setLogoUrl('')
                                  }}
                                  className="absolute -top-2 -right-2 w-5 h-5  bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-red-600 transition-colors"
                                  title="Remove image"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Upload Status */}
                  {isUploading && (
                    <div className="mt-3">
                      <div className="relative h-[6px] w-full rounded-lg bg-[#E2E5EF]">
                        <div 
                          className="absolute left-0 h-full rounded-lg bg-[#6A64F1] transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
        
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
                >
                  {editingStore ? 'Update Store' : 'Create Store'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false)
                    setEditingStore(null)
                    resetForm()
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm bg-white"
                >
                  Cancel
                </button>
              </div>
            </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
