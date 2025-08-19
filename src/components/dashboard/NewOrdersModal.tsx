'use client'

import type { Order } from './OrdersTable'
import { formatCurrency } from '@/lib/currency'

type NewOrdersModalProps = {
  open: boolean
  onClose: () => void
  orders: (Order & { items?: { name: string; quantity: number; price: number }[] })[]
}

export default function NewOrdersModal({ open, onClose, orders }: NewOrdersModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">New Orders</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          {orders.length === 0 && (
            <p className="text-sm text-gray-600">No new orders.</p>
          )}
          <ul className="space-y-4">
            {orders.map(order => (
              <li key={order.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Order</p>
                    <p className="text-sm font-mono text-gray-900">{order.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="text-sm text-gray-900">{order.customerName}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">Items</p>
                  <div className="mt-2 border border-gray-100 rounded">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-gray-600">Name</th>
                          <th className="px-3 py-2 text-right text-gray-600">Qty</th>
                          <th className="px-3 py-2 text-right text-gray-600">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(order.items || []).map((item, idx) => (
                          <tr key={idx} className="border-t border-gray-100">
                            <td className="px-3 py-2">{item.name}</td>
                            <td className="px-3 py-2 text-right">{item.quantity}</td>
                            <td className="px-3 py-2 text-right">
                              ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-gray-700">
                    Total: <span className="font-semibold">{formatCurrency(order.totalAmount)}</span>
                  </p>
                  <p className="text-xs text-gray-500">Created {new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="px-6 py-3 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="bg-[#1E466A] text-white px-4 py-2 rounded hover:bg-[#1E466A]/90 transition-colors">Close</button>
        </div>
      </div>
    </div>
  )
}


