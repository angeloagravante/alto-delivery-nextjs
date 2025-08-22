'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useUser } from '@clerk/nextjs'
import { Store } from '@/types/store'
import { useStore } from './DashboardWrapper'

interface StoreMenuProps {
  onStoreChange: (store: Store | null) => void
}

export default function StoreMenu({ onStoreChange }: StoreMenuProps) {
  const { isLoaded, isSignedIn } = useUser()
  const { currentStore } = useStore()
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStores = useCallback(async () => {
    if (!isSignedIn) return

    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/stores')
      
      if (response.ok) {
        const data = await response.json()
        setStores(data.stores || [])
        
        // If no store is selected and we have stores, select the first one
        if (!selectedStore && data.stores && data.stores.length > 0) {
          const firstStore = data.stores[0]
          setSelectedStore(firstStore)
          onStoreChange(firstStore)
        }
        
        // If we have a current store from context, try to find it in the stores list
        if (currentStore && data.stores) {
          const contextStore = data.stores.find((store: Store) => store.id === currentStore.id)
          if (contextStore) {
            setSelectedStore(contextStore)
            onStoreChange(contextStore)
          }
        }
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch stores')
      }
    } catch (err) {
      console.error('Error fetching stores:', err)
      setError('Failed to fetch stores')
    } finally {
      setLoading(false)
    }
  }, [isSignedIn, selectedStore, currentStore, onStoreChange])

  // Initial load
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchStores()
    } else if (isLoaded && !isSignedIn) {
      setLoading(false)
      setError('Not authenticated')
    }
  }, [isLoaded, isSignedIn, fetchStores])

  const handleStoreSelect = (store: Store) => {
    console.log('Store selected:', store.name, 'ID:', store.id)
    setSelectedStore(store)
    onStoreChange(store)
    setIsOpen(false)
  }

  // Check if selected store still exists in the stores list
  useEffect(() => {
    if (selectedStore && stores.length > 0) {
      const storeExists = stores.find(store => store.id === selectedStore.id)
      if (!storeExists) {
        console.log('Selected store no longer exists, refreshing...')
        // If selected store was deleted, refresh and select first available store
        fetchStores()
      }
    }
  }, [stores, selectedStore, fetchStores])

  // Listen for store context changes and refresh stores list
  useEffect(() => {
    if (currentStore !== selectedStore) {
      console.log('Store context changed, refreshing stores...')
      fetchStores()
    }
  }, [currentStore, selectedStore, fetchStores])

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
        className="flex items-center gap-2 px-3 py-2 text-black hover:bg-white/10 rounded-md transition-colors"
        title={selectedStore?.name}
      >
        {selectedStore?.logoUrl ? (
          <Image 
            src={selectedStore.logoUrl} 
            alt={`${selectedStore.name} logo`}
            width={24}
            height={24}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
        <span className="text-sm font-medium max-w-[120px] truncate">
          {selectedStore?.name || 'Select Store'}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide px-3 py-2">
              Your Stores
            </div>
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => handleStoreSelect(store)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                  selectedStore?.id === store.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                {store.logoUrl ? (
                  <Image 
                    src={store.logoUrl} 
                    alt={`${store.name} logo`}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{store.name}</div>
                  <div className="text-xs text-gray-500 truncate">{store.storeType}</div>
                </div>
                {selectedStore?.id === store.id && (
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 p-2">
            <button
              onClick={() => {
                setIsOpen(false)
                window.location.href = '/dashboard/stores/add'
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Store
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
