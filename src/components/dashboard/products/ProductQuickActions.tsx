'use client'

import { useState } from 'react'
import { Product } from '@/types/product'

interface ProductQuickActionsProps {
  products: Product[]
  onBulkUpdate: (productIds: string[], updates: Partial<Product>) => void
  onBulkDelete: (productIds: string[]) => void
}

export default function ProductQuickActions({ products, onBulkUpdate, onBulkDelete }: ProductQuickActionsProps) {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)

  const handleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(products.map(p => p.id)))
    }
  }

  const handleSelectProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    setSelectedProducts(newSelected)
  }

  const handleBulkUpdateStock = () => {
    const newStock = prompt('Enter new stock quantity for selected products:')
    if (newStock && !isNaN(Number(newStock))) {
      onBulkUpdate(Array.from(selectedProducts), { stock: parseInt(newStock) })
      setSelectedProducts(new Set())
      setShowBulkActions(false)
    }
  }

  const handleBulkUpdateCategory = () => {
    const newCategory = prompt('Enter new category for selected products:')
    if (newCategory && newCategory.trim()) {
      onBulkUpdate(Array.from(selectedProducts), { category: newCategory.trim() })
      setSelectedProducts(new Set())
      setShowBulkActions(false)
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedProducts.size} selected products?`)) {
      onBulkDelete(Array.from(selectedProducts))
      setSelectedProducts(new Set())
      setShowBulkActions(false)
    }
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedProducts.size === products.length}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-[#1E466A] focus:ring-[#1E466A]"
            />
            <span className="text-sm font-medium text-gray-700">
              {selectedProducts.size === 0 
                ? 'Select All' 
                : `${selectedProducts.size} of ${products.length} selected`
              }
            </span>
          </div>
        </div>

        {selectedProducts.size > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className="px-3 py-1.5 bg-[#1E466A] text-white rounded-md text-sm font-medium hover:bg-[#1E466A]/90 transition-colors"
            >
              Bulk Actions
            </button>
          </div>
        )}
      </div>

      {/* Bulk Actions Menu */}
      {showBulkActions && selectedProducts.size > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Bulk Actions for {selectedProducts.size} products</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleBulkUpdateStock}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Update Stock
            </button>
            <button
              onClick={handleBulkUpdateCategory}
              className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Update Category
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Product Selection Checkboxes */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
            <input
              type="checkbox"
              checked={selectedProducts.has(product.id)}
              onChange={() => handleSelectProduct(product.id)}
              className="rounded border-gray-300 text-[#1E466A] focus:ring-[#1E466A]"
            />
            <span className="text-sm text-gray-700 truncate">{product.name}</span>
            <span className="text-xs text-gray-500 ml-auto">({product.stock})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
