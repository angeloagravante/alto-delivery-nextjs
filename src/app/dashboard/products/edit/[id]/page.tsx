'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProductGalleryUpload from '@/components/dashboard/products/ProductGalleryUpload'
import { useStore } from '@/components/dashboard/layout'
import { Product } from '@/types/product'

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

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
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
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  // Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!currentStore || !productId) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/products?storeId=${currentStore.id}`)
        if (response.ok) {
          const products: Product[] = await response.json()
          const product = products.find((p: Product) => p.id === productId)
          
          if (product) {
            setFormData({
              name: product.name,
              description: product.description,
              price: product.price.toString(),
              category: product.category,
              stock: product.stock.toString(),
              images: product.images || []
            })
          } else {
            showMessage('error', 'Product not found')
            router.push('/dashboard/products/view')
          }
        } else {
          showMessage('error', 'Failed to fetch product')
          router.push('/dashboard/products/view')
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        showMessage('error', 'Failed to fetch product')
        router.push('/dashboard/products/view')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [currentStore, productId, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Valid price is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.stock || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required'
    }

    if (formData.images.length === 0) {
      newErrors.images = 'At least one product image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !currentStore) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          category: formData.category,
          stock: parseInt(formData.stock),
          images: formData.images,
          storeId: currentStore.id
        }),
      })

      if (response.ok) {
        showMessage('success', 'Product updated successfully!')
        setTimeout(() => {
          router.push('/dashboard/products/view')
        }, 1500)
      } else {
        const errorData = await response.json()
        showMessage('error', errorData.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      showMessage('error', 'Failed to update product')
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E466A] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
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
          <p className="text-gray-600">Please select a store from the dropdown above to edit products.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-2">Update product for {currentStore.name}</p>
          </div>
        </div>
      </div>

      {/* Flexbox Layout - Fixed Width Gallery + Flexible Form */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Section - Upload Gallery (Fixed Width) */}
        <div className="lg:w-96 lg:flex-shrink-0 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Images</h2>
          <ProductGalleryUpload
            images={formData.images}
            onImagesChange={handleImagesChange}
            maxImages={10}
          />
          {errors.images && <p className="mt-4 text-sm text-red-600">{errors.images}</p>}
        </div>

        {/* Right Section - Product Details Form (Flexible Width) */}
        <div className="lg:flex-1 bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors ${
                  formData.name ? 'text-gray-900' : 'text-gray-500'
                } ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors resize-none ${
                  formData.description ? 'text-gray-900' : 'text-gray-500'
                } ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter product description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Price and Stock Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors ${
                    formData.price ? 'text-gray-900' : 'text-gray-500'
                  } ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="0.00"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
              </div>

              {/* Stock */}
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors ${
                    formData.stock ? 'text-gray-900' : 'text-gray-500'
                  } ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="0"
                />
                {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A] transition-colors ${
                  formData.category ? 'text-gray-900' : 'text-gray-500'
                } ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-[#1E466A] text-white rounded-lg hover:bg-[#1E466A]/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
