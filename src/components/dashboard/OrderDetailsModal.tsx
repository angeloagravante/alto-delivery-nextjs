'use client'

import type { DetailedOrder } from './DashboardMain'
import { formatCurrency } from '@/lib/currency'

type OrderDetailsModalProps = {
  open: boolean
  onClose: () => void
  order: DetailedOrder | null
}

export default function OrderDetailsModal({ open, onClose, order }: OrderDetailsModalProps) {
  if (!open || !order) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700" aria-label="Close">✕</button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Detail label="Order ID" value={<span className="font-mono">{order.id}</span>} />
            <Detail label="Status" value={<StatusBadge status={order.status} />} />
            <Detail label="Customer" value={order.customerName} />
            <Detail label="Payment" value={order.paymentMethod || '-'} />
            <Detail label="Amount" value={formatCurrency(order.totalAmount)} />
            <Detail label="Date" value={formatDate(order)} />
            {order.customerAddress && (
              <Detail className="sm:col-span-2" label="Address" value={<span title={order.customerAddress}>{order.customerAddress}</span>} />
            )}
          </div>

          {order.items && order.items.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Items</p>
              <div className="border border-gray-100 rounded">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-600">Name</th>
                      <th className="px-3 py-2 text-right text-gray-600">Qty</th>
                      <th className="px-3 py-2 text-right text-gray-600">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-100">
                        <td className="px-3 py-2">{item.name}</td>
                        <td className="px-3 py-2 text-right">{item.quantity}</td>
                        <td className="px-3 py-2 text-right">{formatCurrency(item.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="bg-[#1E466A] text-white px-4 py-2 rounded hover:bg-[#1E466A]/90 transition-colors">Close</button>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="text-xs uppercase tracking-wide text-gray-500 font-medium">{label}</p>
      <p className="mt-1 text-sm text-gray-900">{value}</p>
    </div>
  )
}

function StatusBadge({ status }: { status: DetailedOrder['status'] }) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-[0.6rem] font-semibold tracking-wide uppercase'
  const map: Record<string, string> = {
    new: base + ' bg-violet-50 text-violet-700',
    pending: base + ' bg-amber-200 text-amber-900',
    in_progress: base + ' bg-blue-200 text-blue-900',
    in_transit: base + ' bg-indigo-200 text-indigo-900',
    completed: base + ' bg-green-200 text-emerald-700',
    delivered: base + ' bg-emerald-200 text-emerald-800',
    cancelled: base + ' bg-rose-200 text-rose-900',
  }
  return <span className={map[status] || base}>{formatStatus(status)}</span>
}

function formatStatus(status: DetailedOrder['status']) {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function formatDate(order: DetailedOrder) {
  const d = order.timestamp ? new Date(order.timestamp) : (order.createdAt ? new Date(order.createdAt) : null)
  if (!d) return '-'
  return d.toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
}


