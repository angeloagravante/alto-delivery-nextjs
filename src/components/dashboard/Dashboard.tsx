'use client'

import { formatCurrency } from '@/lib/currency'
import type { ReactNode } from 'react'

export type DashboardMetrics = {
  totalRevenue: number
  totalOrders: number
  pendingDeliveries: number
  completedDeliveries: number
}

type DashboardProps = {
  metrics: DashboardMetrics
}

export default function Dashboard({ metrics }: DashboardProps) {
  const metricCards: Array<{
    title: string
    value: string
    color: 'green' | 'blue' | 'orange' | 'purple'
    icon: ReactNode
  }> = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      color: 'green',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 1v22" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      ),
    },
    {
      title: 'Total Orders',
      value: metrics.totalOrders.toString(),
      color: 'blue',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M3 7l9-4 9 4-9 4-9-4z" />
          <path d="M21 10l-9 4-9-4" />
          <path d="M21 14l-9 4-9-4" />
        </svg>
      ),
    },
    {
      title: 'Pending Deliveries',
      value: metrics.pendingDeliveries.toString(),
      color: 'orange',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
    },
    {
      title: 'Completed Deliveries',
      value: metrics.completedDeliveries.toString(),
      color: 'purple',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ),
    },
  ]

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, idx) => (
          <div
            key={idx}
            className={
              'rounded-lg shadow-sm p-4 border flex flex-col gap-3 ' +
              colorClass(card.color)
            }
          >
            <div className="flex items-center gap-2">
              <div className="shrink-0 w-9 h-9 rounded-md bg-white/20 flex items-center justify-center text-white">
                {card.icon}
              </div>
              <span className="text-white/90 text-sm font-medium">{card.title}</span>
            </div>
            <div className="text-white text-2xl font-bold">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function colorClass(color: 'green' | 'blue' | 'orange' | 'purple') {
  switch (color) {
    case 'green':
      return 'bg-emerald-600 border-emerald-700'
    case 'blue':
      return 'bg-sky-600 border-sky-700'
    case 'orange':
      return 'bg-amber-600 border-amber-700'
    case 'purple':
      return 'bg-violet-600 border-violet-700'
  }
}


