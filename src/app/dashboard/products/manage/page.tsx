'use client'

import { useState, useEffect, useCallback } from 'react'

import { ProductQuickActions, ProductOverview } from '@/components/dashboard/products'
import { Product } from '@/types/product'
import { useStore } from '@/components/dashboard/layout'

export default function BulkActionsPage() {

  const { currentStore } = useStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const fetchProducts = useCallback(async () => {
    if (!currentStore) return
    
    try {
      setLoading(true)
      console.log('Fetching products for store:', currentStore.name, 'ID:', currentStore.id)
      const response = await fetch(`/api/products?storeId=${currentStore.id}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Products received:', data)
        setProducts(data)
      } else {
        console.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [currentStore])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  // Fetch products from database
  useEffect(() => {
    if (currentStore) {
      fetchProducts()
    }
  }, [currentStore, fetchProducts])

  // Bulk operations
  const handleBulkUpdate = async (productIds: string[], updates: Partial<Product>) => {
    try {
      const updatePromises = productIds.map(id => 
        fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        })
      )

      const responses = await Promise.all(updatePromises)
      const allSuccessful = responses.every(response => response.ok)

      if (allSuccessful) {
        setProducts(products.map(product => 
          productIds.includes(product.id) 
            ? { ...product, ...updates, updatedAt: new Date() }
            : product
        ))
        showMessage('success', `Successfully updated ${productIds.length} products!`)
      } else {
        showMessage('error', 'Some products failed to update')
      }
    } catch (error) {
      console.error('Error in bulk update:', error)
      showMessage('error', 'Failed to update products')
    }
  }

  const handleBulkDelete = async (productIds: string[]) => {
    if (confirm(`Are you sure you want to delete ${productIds.length} products?`)) {
      try {
        const deletePromises = productIds.map(id => 
          fetch(`/api/products/${id}`, { method: 'DELETE' })
        )

        const responses = await Promise.all(deletePromises)
        const allSuccessful = responses.every(response => response.ok)

        if (allSuccessful) {
          setProducts(products.filter(product => !productIds.includes(product.id)))
          showMessage('success', `Successfully deleted ${productIds.length} products!`)
        } else {
          showMessage('error', 'Some products failed to delete')
        }
      } catch (error) {
        console.error('Error in bulk delete:', error)
        showMessage('error', 'Failed to delete products')
      }
    }
  }

  // Get unique categories from products
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category))).sort()]
  
  // Filter products by selected category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory)

  return (
    <div className="space-y-6 px-4">
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Actions</h1>
          <p className="text-gray-600">Perform bulk operations on your products</p>
        </div>
      </div>

      {!currentStore ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Store Selected</h3>
          <p className="text-gray-600">Please select a store from the dropdown above to perform bulk actions.</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E466A] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : (
        <>
          {/* Category Filter */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#1E466A] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category === 'all' ? 'All Categories' : category}
                </button>
              ))}
            </div>
          </div>

          {/* Product Overview */}
          <ProductOverview products={filteredProducts} />

          {/* Bulk Actions Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-800">Bulk Operations Guide</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p className="mb-2">Use the checkboxes below to select multiple products, then choose from these bulk actions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Update Stock:</strong> Set the same stock level for all selected products</li>
                    <li><strong>Update Category:</strong> Change the category for all selected products</li>
                    <li><strong>Delete Selected:</strong> Remove all selected products (use with caution)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <ProductQuickActions 
            products={filteredProducts}
            onBulkUpdate={handleBulkUpdate}
            onBulkDelete={handleBulkDelete}
          />

          {/* No Products Message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {selectedCategory === 'all' 
                  ? 'Get started by creating your first product.' 
                  : `No products found in the "${selectedCategory}" category.`
                }
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
