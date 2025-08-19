'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Store } from '@/types/store'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface StoreMenuProps {
  onStoreChange: (store: Store | null) => void
}

export default function StoreMenu({ onStoreChange }: StoreMenuProps) {
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStores()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores')
      if (response.ok) {
        const storesData = await response.json()
        setStores(storesData)
        
        // Set the first store as selected by default
        if (storesData.length > 0) {
          setSelectedStore(storesData[0])
          onStoreChange(storesData[0])
        }
      }
    } catch (error) {
      console.error('Error fetching stores:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store)
    onStoreChange(store)
    setIsOpen(false)
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-white">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm">Loading...</span>
      </div>
    )
  }

  if (stores.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-white">
        <span className="text-sm">No stores</span>
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
