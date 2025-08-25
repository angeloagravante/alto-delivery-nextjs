'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/currency'
import type { Order } from '@/types/order'
import { useOrders } from '@/hooks/useOrders'
import { useStore } from '@/components/dashboard/layout/DashboardWrapper'
import { 
  Clock, 
  Package, 
  CheckCircle, 
  XCircle, 
  Eye,
  Phone,
  MapPin,
  User,
  CreditCard,
  AlertCircle,
  Loader
} from 'lucide-react'

export default function OrdersPage() {
  const { currentStore } = useStore()
  const { orders, loading, error, updateOrderStatus } = useOrders(currentStore?.id || null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)

  // Filter orders by status
  const newOrders = orders.filter(order => order.status === 'new')
  const inProgressOrders = orders.filter(order => 
    ['accepted', 'preparing', 'for_delivery'].includes(order.status)
  )

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'accepted')
    } catch (error) {
      console.error('Failed to accept order:', error)
    }
  }

  const handleDeclineOrder = async (orderId: string) => {
    if (confirm('Are you sure you want to decline this order?')) {
      try {
        await updateOrderStatus(orderId, 'declined')
      } catch (error) {
        console.error('Failed to decline order:', error)
      }
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus(orderId, newStatus)
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'preparing': return 'bg-yellow-100 text-yellow-800'
      case 'for_delivery': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'declined': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const OrderDetailsModal = ({ order, onClose }: { order: Order; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-medium">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Customer Information</p>
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span>{order.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{order.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{order.customerAddress}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Order Items</p>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>

            {order.notes && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Notes</p>
                <p className="bg-yellow-50 p-3 rounded-lg text-sm">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-2">Manage incoming orders and track order progress</p>
        {!currentStore && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">Please select a store from the header to view orders.</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Error loading orders: {error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading orders...</span>
        </div>
      ) : (
        <>
          {/* New Orders Section - Card View */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900">New Orders ({newOrders.length})</h2>
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                Priority
              </span>
            </div>
        
        {newOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No new orders at the moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {newOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{order.customerAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4" />
                    <span>{order.paymentMethod.toUpperCase()} - {order.paymentStatus}</span>
                  </div>
                </div>

                <div className="border-t pt-3 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Items: {order.items.length}</span>
                    <span className="font-semibold text-lg">{formatCurrency(order.totalAmount)}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.items.map(item => `${item.quantity}x ${item.productName}`).join(', ')}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptOrder(order.id)}
                    className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineOrder(order.id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    Decline
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(order)
                      setShowOrderModal(true)
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* In Progress Orders Section - Table View */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-gray-900">In Progress Orders ({inProgressOrders.length})</h2>
        </div>

        {inProgressOrders.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No orders in progress</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ETA</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inProgressOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                          <div className="text-sm text-gray-500">{formatTime(order.createdAt)}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.customerPhone}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900">{order.items.length} items</div>
                        <div className="text-sm text-gray-500 max-w-48 truncate">
                          {order.items.map(item => `${item.quantity}x ${item.productName}`).join(', ')}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</div>
                        <div className="text-sm text-gray-500">{order.paymentMethod}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value as Order['status'])}
                          className={`text-xs font-medium rounded-full px-2 py-1 border-none outline-none cursor-pointer ${getStatusColor(order.status)}`}
                        >
                          <option value="accepted">ACCEPTED</option>
                          <option value="preparing">PREPARING</option>
                          <option value="for_delivery">FOR DELIVERY</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.estimatedDeliveryTime || 'Not set'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order)
                              setShowOrderModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
            <OrderDetailsModal
              order={selectedOrder}
              onClose={() => {
                setShowOrderModal(false)
                setSelectedOrder(null)
              }}
            />
          )}
        </>
      )}
    </div>
  )
}