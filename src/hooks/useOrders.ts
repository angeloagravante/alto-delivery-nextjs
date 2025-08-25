import { useState, useEffect, useCallback } from 'react'
import type { Order } from '@/types/order'

export function useOrders(storeId: string | null, status?: string) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!storeId) {
        setOrders([])
        return
      }
      
      const params = new URLSearchParams({ storeId })
      if (status) {
        params.append('status', status)
      }
      
      const response = await fetch(`/api/orders?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`)
      }
      
      const data = await response.json()
      setOrders(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [storeId, status])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update order: ${response.statusText}`)
      }

      const updatedOrder = await response.json()
      
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      )

      return updatedOrder
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order')
      throw err
    }
  }

  const refetch = () => {
    if (storeId) {
      fetchOrders()
    }
  }

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    refetch,
    setOrders
  }
}
