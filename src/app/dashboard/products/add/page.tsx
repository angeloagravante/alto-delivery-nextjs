'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductImageUpload } from '@/components/dashboard/products'
import { ProductFormData } from '@/types/product'
import { useStore } from '@/components/dashboard/layout'

const categories = [
  'Coffee & Beverages',
  'Food & Meals',
  'Clothing & Fashion',
  'Fruits & Vegetables',
  'Meat & Poultry',
  'Seafood',
  'Grains & Cereals',
  'Snacks & Treats',
  'Condiments & Sauces',
  'Dairy & Eggs',
  'Bakery & Pastries',
  'Frozen Foods',
  'Canned Goods',
  'Personal Care',
  'Household Items',
  'Electronics',
  'Books & Stationery',
  'Sports & Fitness',
  'Toys & Games',
  'Other'
]

export default function AddProductPage() {
  const router = useRouter()
  const { currentStore } = useStore()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [] as string[]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Price must be greater than 0'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Stock cannot be negative'
    if (formData.images.length === 0) newErrors.images = 'At least one product image is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const productData: ProductFormData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock),
        images: formData.images,
        storeId: currentStore!.id
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        showMessage('success', 'Product created successfully!')
        // Redirect to manage products page after successful creation
        setTimeout(() => {
          router.push('/dashboard/products/view')
        }, 1500)
      } else {
        const error = await response.json()
        showMessage('error', `Failed to create product: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating product:', error)
      showMessage('error', 'Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImagesChange = (images: string[]) => {
    handleChange('images', images)
  }

  if (!currentStore) {
    return (
      <div className="space-y-6 px-4">
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Store Selected</h3>
          <p className="text-gray-600">Please select a store from the dropdown above to add products.</p>
        </div>
      </div>
    )
  }

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
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600">Create a new product for {currentStore.name}</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
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
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
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
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter detailed product description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>

          {/* Pricing & Inventory Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Pricing & Inventory
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (PHP) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₱</span>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    step="0.01"
                    min="0"
                    className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E466A] ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock"
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
          </div>

          {/* Product Images Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Product Images
            </h2>
            
            <ProductImageUpload
              images={formData.images}
              onImagesChange={handleImagesChange}
              maxImages={10}
            />
            {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}
          </div>

          {/* Submit Section */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 bg-[#1E466A] hover:bg-[#1E466A]/90 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating Product...
                </>
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
