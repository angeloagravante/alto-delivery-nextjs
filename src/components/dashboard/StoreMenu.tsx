'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Store } from '@/types/store'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@clerk/nextjs'

interface StoreMenuProps {
  onStoreChange: (store: Store | null) => void
}

export default function StoreMenu({ onStoreChange }: StoreMenuProps) {
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isSignedIn, isLoaded } = useAuth()

  useEffect(() => {
    // Wait for authentication to be loaded and user to be signed in
    if (isLoaded && isSignedIn) {
      // Add a small delay to ensure Clerk is fully ready
      const timer = setTimeout(() => {
        fetchStores()
      }, 500)
      
      return () => clearTimeout(timer)
    } else if (isLoaded && !isSignedIn) {
      setLoading(false)
      setError('Not authenticated')
    }
  }, [isLoaded, isSignedIn]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStores = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching stores...')
      
      const response = await fetch('/api/stores')
      console.log('Stores API response status:', response.status)
      
      if (response.ok) {
        const storesData = await response.json()
        console.log('Stores data received:', storesData)
        setStores(storesData)
        
        // Set the first store as selected by default
        if (storesData.length > 0) {
          setSelectedStore(storesData[0])
          onStoreChange(storesData[0])
        }
      } else {
        const errorData = await response.json()
        console.error('Stores API error:', errorData)
        setError(errorData.error || `HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('Error fetching stores:', error)
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store)
    onStoreChange(store)
    setIsOpen(false)
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-white">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm">Loading auth...</span>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-white">
        <span className="text-sm text-red-200">Not signed in</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-white">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm">Loading stores...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-white">
        <span className="text-sm text-red-200">Error: {error}</span>
        <button 
          onClick={fetchStores}
          className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30"
        >
          Retry
        </button>
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-white">
        <span className="text-sm">No stores</span>
        <button 
          onClick={() => window.location.href = '/dashboard/stores'}
          className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30"
        >
          Create Store
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
      >
        {selectedStore?.logoUrl ? (
          <Image 
            src={selectedStore.logoUrl} 
            alt={selectedStore.name}
            width={24}
            height={24}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {selectedStore?.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span className="text-sm font-medium">{selectedStore?.name}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => handleStoreSelect(store)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  selectedStore?.id === store.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {store.logoUrl ? (
                  <Image 
                    src={store.logoUrl} 
                    alt={store.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-600">
                      {store.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
            )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{store.name}</div>
                  {store.description && (
                    <div className="text-sm text-gray-500 truncate">{store.description}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
