'use client'

export type Order = {
  id: string
  customerName: string
  totalAmount: number
  status: 'new' | 'in_progress' | 'completed'
  createdAt: string
}

type OrdersTableProps = {
  title: string
  orders: Order[]
  pageSize?: number
}

export default function OrdersTable({ title, orders, pageSize = 5 }: OrdersTableProps) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize))
  const start = (page - 1) * pageSize
  const paginated = orders.slice(start, start + pageSize)

  const canPrev = page > 1
  const canNext = page < totalPages

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginated.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono text-gray-900">{order.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{order.customerName}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(order.totalAmount)}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-xs">
                  <span className={getStatusBadgeClass(order.status)}>
                    {formatStatus(order.status)}
                  </span>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">No orders to display</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {paginated.map(order => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">Order</p>
              <span className={getStatusBadgeClass(order.status)}>{formatStatus(order.status)}</span>
            </div>
            <p className="mt-1 font-mono text-sm text-gray-900">{order.id}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="text-gray-900">{order.customerName}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Total</p>
                <p className="text-gray-900">{formatCurrency(order.totalAmount)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Created</p>
                <p className="text-gray-900">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
        {paginated.length === 0 && (
          <p className="text-center text-sm text-gray-500">No orders to display</p>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages} • Showing {paginated.length} of {orders.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!canPrev}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={!canNext}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { formatCurrency } from '@/lib/currency'

function formatStatus(status: Order['status']) {
  switch (status) {
    case 'new':
      return 'New'
    case 'in_progress':
      return 'In Progress'
    case 'completed':
      return 'Completed'
  }
}

function getStatusBadgeClass(status: Order['status']) {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  if (status === 'new') return base + ' bg-blue-100 text-blue-800'
  if (status === 'in_progress') return base + ' bg-yellow-100 text-yellow-800'
  return base + ' bg-green-100 text-green-800'
}


