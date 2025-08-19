'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types/product'

interface EditProductModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: string, product: Partial<Product>) => void
}

const categories = [
  'Beverages',
  'Bakery',
  'Dairy',
  'Fruits',
  'Vegetables',
  'Meat',
  'Seafood',
  'Grains',
  'Snacks',
  'Condiments',
  'Other'
]

export default function EditProductModal({ product, isOpen, onClose, onUpdate }: EditProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        imageUrl: product.imageUrl
      })
    }
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Stock cannot be negative'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const updatedProduct: Partial<Product> = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock),
      imageUrl: formData.imageUrl.trim()
    }

    onUpdate(product.id, updatedProduct)
    onClose()
  }

  const handleClose = () => {
    setErrors({})
    onClose()
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Edit Product</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="edit-name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product description"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (PHP) *
              </label>
              <input
                type="number"
                id="edit-price"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="edit-stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                id="edit-stock"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                min="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="edit-category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="edit-imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              id="edit-imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A]"
              placeholder="https://example.com/image.jpg"
            />
            <p className="mt-1 text-xs text-gray-500">Leave empty to use a placeholder image</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-[#1E466A] hover:bg-[#1E466A]/90 text-white rounded-md transition-colors"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
