'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Store, CreateStoreData } from '@/types/store'
import { useUploadThing } from '@/lib/uploadthing'

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
    description: ''
  })
  const [logoUrl, setLogoUrl] = useState<string>('')
  const { startUpload, isUploading } = useUploadThing('storeLogo')

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores')
      if (response.ok) {
        const storesData = await response.json()
        setStores(storesData)
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
      const storeData = {
        ...formData,
        logoUrl: logoUrl || undefined
      }

      const url = editingStore ? `/api/stores/${editingStore.id}` : '/api/stores'
      const method = editingStore ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeData)
      })

      if (response.ok) {
        await fetchStores()
        onStoreChange()
        resetForm()
        setIsAddModalOpen(false)
        setEditingStore(null)
      } else {
        const error = await response.json()
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
    setFormData({
      name: store.name,
      description: store.description || ''
    })
    setLogoUrl(store.logoUrl || '')
    setIsAddModalOpen(true)
  }

  const resetForm = () => {
    setFormData({ name: '', description: '' })
    setLogoUrl('')
  }

  const openAddModal = () => {
    resetForm()
    setEditingStore(null)
    setIsAddModalOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Store Management</h2>
          <p className="text-gray-600">Manage your stores and their settings</p>
        </div>
        {stores.length < 3 && (
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Store
          </button>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
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
                  {store.description && (
                    <p className="text-sm text-gray-600">{store.description}</p>
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
            <div className="text-xs text-gray-500">
              Created {new Date(store.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingStore ? 'Edit Store' : 'Add New Store'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter store name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter store description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      try {
                        const uploadResponse = await startUpload([file])
                        if (uploadResponse && uploadResponse[0]) {
                          setLogoUrl(uploadResponse[0].url)
                        }
                      } catch (uploadError) {
                        console.error('Upload error:', uploadError)
                        alert('Error uploading file')
                      }
                    }
                  }}
                  disabled={isUploading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {isUploading && (
                  <div className="mt-2 text-sm text-blue-600">Uploading...</div>
                )}
                {logoUrl && (
                  <div className="mt-2">
                    <Image 
                      src={logoUrl} 
                      alt="Logo preview" 
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
