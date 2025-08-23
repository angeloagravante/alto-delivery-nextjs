'use client'

export type Order = {
  id: string
  customerName: string
  totalAmount: number
  status: 'new' | 'pending' | 'in_progress' | 'in_transit' | 'completed' | 'delivered' | 'cancelled'
  createdAt?: string
  timestamp?: string
  customerAddress?: string
  paymentMethod?: string
}

type OrdersTableProps = {
  title: string
  orders: Order[]
  pageSize?: number
  onRowClick?: (order: Order) => void
}

export default function OrdersTable({ title, orders, pageSize = 5, onRowClick }: OrdersTableProps) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize))
  const start = (page - 1) * pageSize
  const paginated = orders.slice(start, start + pageSize)

  const canPrev = page > 1
  const canNext = page < totalPages
  const showingStart = orders.length === 0 ? 0 : start + 1
  const showingEnd = Math.min(start + paginated.length, orders.length)

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {/* Desktop table */}
      <div className="hidden md:block border border-slate-200 rounded-lg overflow-hidden shadow">
        <table className="w-full border-collapse text-[0.78rem] leading-5 text-slate-700">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-3 py-2 font-semibold text-[0.7rem] tracking-wide uppercase text-slate-700 border-b border-slate-200">Order ID</th>
              <th className="text-left px-3 py-2 font-semibold text-[0.7rem] tracking-wide uppercase text-slate-700 border-b border-slate-200">Customer</th>
              <th className="text-left px-3 py-2 font-semibold text-[0.7rem] tracking-wide uppercase text-slate-700 border-b border-slate-200">Address</th>
              <th className="text-left px-3 py-2 font-semibold text-[0.7rem] tracking-wide uppercase text-slate-700 border-b border-slate-200">Amount</th>
              <th className="text-left px-3 py-2 font-semibold text-[0.7rem] tracking-wide uppercase text-slate-700 border-b border-slate-200">Status</th>
              <th className="text-left px-3 py-2 font-semibold text-[0.7rem] tracking-wide uppercase text-slate-700 border-b border-slate-200">Payment</th>
              <th className="text-left px-3 py-2 font-semibold text-[0.7rem] tracking-wide uppercase text-slate-700 border-b border-slate-200">Date</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(order => (
              <tr
                key={order.id}
                className={"hover:bg-slate-100 " + (onRowClick ? 'cursor-pointer focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-200' : '')}
                onClick={onRowClick ? () => onRowClick(order) : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={onRowClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(order); } } : undefined}
              >
                <td className="px-3 py-2 font-mono text-gray-900 border-b border-slate-100 align-top">{order.id}</td>
                <td className="px-3 py-2 text-gray-900 border-b border-slate-100 align-top">
                  <div className="font-medium">{order.customerName}</div>
                </td>
                <td className="px-3 py-2 text-gray-900 border-b border-slate-100 align-top max-w-[260px] truncate" title={order.customerAddress}>{order.customerAddress || '-'}</td>
                <td className="px-3 py-2 text-gray-900 border-b border-slate-100 align-top">{formatCurrency(order.totalAmount)}</td>
                <td className="px-3 py-2 border-b border-slate-100 align-top">
                  <span className={getStatusBadgeClass(order.status)}>
                    {formatStatus(order.status)}
                  </span>
                </td>
                <td className="px-3 py-2 text-gray-900 border-b border-slate-100 align-top">{order.paymentMethod || '-'}</td>
                <td className="px-3 py-2 text-gray-900 border-b border-slate-100 align-top">{formatDate(order)}</td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-2 py-6 text-center text-sm text-slate-500 italic">No orders to display</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {paginated.map(order => (
          <div key={order.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
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
              {order.customerAddress && (
                <div className="col-span-2">
                  <p className="text-gray-500">Address</p>
                  <p className="text-gray-900 truncate" title={order.customerAddress}>{order.customerAddress}</p>
                </div>
              )}
              {order.paymentMethod && (
                <div>
                  <p className="text-gray-500">Payment</p>
                  <p className="text-gray-900">{order.paymentMethod}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-gray-500">Created</p>
                <p className="text-gray-900">{formatDate(order)}</p>
              </div>
            </div>
          </div>
        ))}
        {paginated.length === 0 && (
          <p className="text-center text-sm text-gray-500">No orders to display</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-between items-center gap-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="text-[0.65rem] font-medium tracking-wide uppercase text-slate-600">
          Showing {showingStart}-{showingEnd} of {orders.length}
        </div>
        <div className="flex items-center gap-1.5" role="navigation" aria-label="Pagination">
          <button
            className="bg-white border border-slate-300 rounded px-2 py-1 text-[0.65rem] font-medium hover:bg-slate-100 disabled:opacity-50"
            onClick={() => setPage(1)}
            disabled={!canPrev}
          >
            « First
          </button>
          <button
            className="bg-white border border-slate-300 rounded px-2 py-1 text-[0.65rem] font-medium hover:bg-slate-100 disabled:opacity-50"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!canPrev}
          >
            ‹ Prev
          </button>
          <span className="text-[0.65rem] font-semibold text-slate-700 px-1">Page {page} / {totalPages}</span>
          <button
            className="bg-white border border-slate-300 rounded px-2 py-1 text-[0.65rem] font-medium hover:bg-slate-100 disabled:opacity-50"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={!canNext}
          >
            Next ›
          </button>
          <button
            className="bg-white border border-slate-300 rounded px-2 py-1 text-[0.65rem] font-medium hover:bg-slate-100 disabled:opacity-50"
            onClick={() => setPage(totalPages)}
            disabled={!canNext}
          >
            Last »
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
    case 'pending':
      return 'Pending'
    case 'in_progress':
      return 'In Progress'
    case 'in_transit':
      return 'In Transit'
    case 'completed':
      return 'Completed'
    case 'delivered':
      return 'Delivered'
    case 'cancelled':
      return 'Cancelled'
  }
}

function getStatusBadgeClass(status: Order['status']) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-[0.6rem] font-semibold tracking-wide uppercase'
  if (status === 'new') return base + ' bg-violet-50 text-violet-700'
  if (status === 'pending') return base + ' bg-amber-200 text-amber-900'
  if (status === 'in_progress') return base + ' bg-blue-200 text-blue-900'
  if (status === 'in_transit') return base + ' bg-indigo-200 text-indigo-900'
  if (status === 'delivered') return base + ' bg-emerald-200 text-emerald-800'
  if (status === 'cancelled') return base + ' bg-rose-200 text-rose-900'
  return base + ' bg-green-200 text-emerald-700'
}

function formatDate(order: Order) {
  const d = order.timestamp ? new Date(order.timestamp) : (order.createdAt ? new Date(order.createdAt) : null)
  if (!d) return '-'
  return d.toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
}


