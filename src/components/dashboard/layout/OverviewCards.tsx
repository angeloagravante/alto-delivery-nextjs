'use client'

type OverviewCardsProps = {
  revenue: number
  newOrdersCount: number
  inProgressCount: number
  completedCount: number
  onNewOrdersClick: () => void
}

export default function OverviewCards({
  revenue,
  newOrdersCount,
  inProgressCount,
  completedCount,
  onNewOrdersClick,
}: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(revenue)}</p>
      </div>

      <button
        type="button"
        onClick={onNewOrdersClick}
        className="text-left bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:border-[#1E466A] transition-colors"
      >
        <h3 className="text-sm font-medium text-gray-500">New Orders</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">{newOrdersCount}</p>
        <p className="text-xs text-gray-500 mt-1">Click to view details</p>
      </button>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">{inProgressCount}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500">Completed</h3>
        <p className="mt-2 text-3xl font-bold text-gray-900">{completedCount}</p>
      </div>
    </div>
  )
}

import { formatCurrency } from '@/lib/currency'


