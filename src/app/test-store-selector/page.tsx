'use client'

import { useState } from 'react'
import { Store } from '@/types/store'

export default function TestStoreSelector() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

  const testFetchStores = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/stores')
      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Response data:', data)
        
        // Handle both array and object with stores property
        const storesData = Array.isArray(data) ? data : (data.stores || [])
        setStores(storesData)
        
        if (storesData.length > 0) {
          setSelectedStore(storesData[0])
        }
      } else {
        const errorData = await response.json()
        console.error('API error:', errorData)
        setError(errorData.error || 'Failed to fetch stores')
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError('Failed to fetch stores')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Store Selector Test</h1>
      
      <div className="mb-6">
        <button
          onClick={testFetchStores}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Test Fetch Stores'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">API Response</h2>
          <div className="bg-gray-100 p-4 rounded">
            <pre className="text-sm overflow-auto">
              {JSON.stringify({ stores, selectedStore, loading, error }, null, 2)}
            </pre>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Store Selector</h2>
          <div className="border rounded-lg p-4">
            {stores.length === 0 ? (
              <p className="text-gray-500">No stores available</p>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Store:
                </label>
                <select
                  value={selectedStore?.id || ''}
                  onChange={(e) => {
                    const store = stores.find(s => s.id === e.target.value)
                    setSelectedStore(store || null)
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Choose a store...</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>
                      {store.name} ({store.storeType})
                    </option>
                  ))}
                </select>
                
                {selectedStore && (
                  <div className="mt-4 p-3 bg-blue-50 rounded">
                    <h3 className="font-medium">Selected Store:</h3>
                    <p><strong>Name:</strong> {selectedStore.name}</p>
                    <p><strong>Type:</strong> {selectedStore.storeType}</p>
                    <p><strong>Village:</strong> {selectedStore.village}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
