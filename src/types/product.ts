export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  storeId: string
  createdAt: Date
  updatedAt: Date
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  storeId: string
}
