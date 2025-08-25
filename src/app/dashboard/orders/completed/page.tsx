'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/currency'
import type { Order } from '@/types/order'
import { useOrders } from '@/hooks/useOrders'
import { useStore } from '@/components/dashboard/layout/DashboardWrapper'
import { 
  CheckCircle, 
  Package, 
  Calendar,
  Search,
  Eye,
  User,
  Phone,
  MapPin,
  CreditCard,
  XCircle,
  Clock,
  Loader
} from 'lucide-react'

export default function CompletedOrdersPage() {
  const { currentStore } = useStore()
  const { orders: allOrders, loading, error } = useOrders(currentStore?.id || null)
  
  // Filter only completed orders
  const orders = allOrders.filter(order => order.status === 'completed')
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all') // all, today, week, month
  const [paymentFilter, setPaymentFilter] = useState('all') // all, card, cash, online

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerPhone && order.customerPhone.includes(searchTerm))

    // Date filter
    let matchesDate = true
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.completedAt || order.updatedAt)
      const today = new Date()
      
      switch (dateFilter) {
        case 'today':
          matchesDate = orderDate.toDateString() === today.toDateString()
          break
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = orderDate >= weekAgo
          break
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = orderDate >= monthAgo
          break
      }
    }

    // Payment filter
    const matchesPayment = paymentFilter === 'all' || order.paymentMethod === paymentFilter

    return matchesSearch && matchesDate && matchesPayment
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const calculateStats = () => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0)
    const averageOrderValue = filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0
    const totalOrders = filteredOrders.length

    return { totalRevenue, averageOrderValue, totalOrders }
  }

  const stats = calculateStats()

  const OrderDetailsModal = ({ order, onClose }: { order: Order; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Completed Order Details</h3>
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
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  COMPLETED
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Completed At</p>
                <p className="font-medium">{formatDate(order.completedAt || order.updatedAt)} at {formatTime(order.completedAt || order.updatedAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Duration</p>
                <p className="font-medium">
                  {Math.round((new Date(order.completedAt || order.updatedAt).getTime() - new Date(order.createdAt).getTime()) / (1000 * 60))} min
                </p>
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
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                  <span>{order.paymentMethod.toUpperCase()} - {order.paymentStatus.toUpperCase()}</span>
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
                      <p className="text-sm text-gray-600">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Paid</span>
                <span className="text-lg font-semibold text-green-600">{formatCurrency(order.totalAmount)}</span>
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
        <h1 className="text-3xl font-bold text-gray-900">Completed Orders</h1>
        <p className="text-gray-600 mt-2">View and analyze completed order history</p>
        {!currentStore && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">Please select a store from the header to view completed orders.</p>
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
          <span className="ml-2 text-gray-500">Loading completed orders...</span>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageOrderValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by order number, customer name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Payments</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No completed orders found for the selected filters</p>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map(order => {
                  const duration = Math.round((new Date(order.completedAt || order.updatedAt).getTime() - new Date(order.createdAt).getTime()) / (1000 * 60))
                  
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                          <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
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
                        <div className="text-sm font-medium text-green-600">{formatCurrency(order.totalAmount)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.paymentMethod.toUpperCase()}</div>
                        <div className="text-sm text-green-600 font-medium">{order.paymentStatus.toUpperCase()}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(order.completedAt || order.updatedAt)}</div>
                        <div className="text-sm text-gray-500">{formatTime(order.completedAt || order.updatedAt)}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {duration} min
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
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
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
