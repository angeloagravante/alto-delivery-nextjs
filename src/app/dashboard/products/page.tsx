'use client'

import { useState, useEffect, useCallback } from 'react'
import ProductList from '@/components/dashboard/ProductList'
import AddProductModal from '@/components/dashboard/AddProductModal'
import { Product } from '@/types/product'
import { useStore } from '@/components/dashboard/DashboardWrapper'

export default function ProductsPage() {
  const { currentStore } = useStore()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchProducts = useCallback(async () => {
    if (!currentStore) return
    
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
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

  const handleAddProduct = async (newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      })

      if (response.ok) {
        const product = await response.json()
        setProducts([product, ...products])
        setIsAddModalOpen(false)
        showMessage('success', 'Product created successfully!')
      } else {
        const error = await response.json()
        showMessage('error', `Failed to create product: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating product:', error)
      showMessage('error', 'Failed to create product')
    }
  }

  const handleUpdateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      })

      if (response.ok) {
        const updated = await response.json()
        setProducts(products.map(product => 
          product.id === id ? updated : product
        ))
        showMessage('success', 'Product updated successfully!')
      } else {
        const error = await response.json()
        showMessage('error', `Failed to update product: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      showMessage('error', 'Failed to update product')
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE',
        })

              if (response.ok) {
        setProducts(products.filter(product => product.id !== id))
        showMessage('success', 'Product deleted successfully!')
      } else {
        const error = await response.json()
        showMessage('error', `Failed to delete product: ${error.error}`)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      showMessage('error', 'Failed to delete product')
    }
    }
  }

  return (
    <div className="space-y-6">
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
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <button
          onClick={() => currentStore && setIsAddModalOpen(true)}
          disabled={!currentStore}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            currentStore 
              ? 'bg-[#1E466A] hover:bg-[#1E466A]/90 text-white' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {!currentStore ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Store Selected</h3>
          <p className="text-gray-600">Please select a store from the dropdown above to manage products.</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E466A] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      ) : (
        <ProductList 
          products={products}
          onUpdate={handleUpdateProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      <AddProductModal
        isOpen={isAddModalOpen && !!currentStore}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
        storeId={currentStore?.id || ''}
      />
    </div>
  )
}


