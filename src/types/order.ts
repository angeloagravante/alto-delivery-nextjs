export type OrderStatus = 'new' | 'accepted' | 'preparing' | 'for_delivery' | 'completed' | 'cancelled' | 'declined'

export type OrderItem = {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  imageUrl?: string
}

export type Order = {
  id: string
  orderNumber: string
  customerName: string
  customerEmail?: string
  customerPhone?: string
  customerAddress: string
  items: OrderItem[]
  totalAmount: number
  status: OrderStatus
  paymentMethod: 'cash' | 'card' | 'online'
  paymentStatus: 'pending' | 'paid' | 'failed'
  notes?: string
  estimatedDeliveryTime?: string
  createdAt: string
  updatedAt: string
  storeId: string
  completedAt?: string
}

export type OrderUpdate = {
  status?: OrderStatus
  estimatedDeliveryTime?: string
  notes?: string
}
