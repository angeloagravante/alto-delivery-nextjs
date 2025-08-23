'use client'

import { OverviewCards } from '@/components/dashboard/layout'
import { Dashboard, type DashboardMetrics } from '@/components/dashboard/layout'
import { OrdersTable, Order } from '@/components/dashboard/orders'
import { NewOrdersModal } from '@/components/dashboard/orders'
import { OrderDetailsModal } from '@/components/dashboard/orders'
import { TransactionList } from '@/components/dashboard/transactions'
import { useMemo, useState } from 'react'

export type DetailedOrder = Order & {
  items?: { name: string; quantity: number; price: number }[]
  deliveryFee?: number
}

type DashboardMainProps = {
  newOrders: DetailedOrder[]
  inProgressOrders: DetailedOrder[]
  completedOrders: DetailedOrder[]
  showLegacyOverview?: boolean
}

export default function DashboardMain({ newOrders, inProgressOrders, completedOrders, showLegacyOverview = false }: DashboardMainProps) {
  const [showNewOrders, setShowNewOrders] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<DetailedOrder | null>(null)

  const revenue = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  }, [completedOrders])

  return (
    <div className="py-6 px-6">
      {showLegacyOverview ? (
        <OverviewCards
          revenue={revenue}
          newOrdersCount={newOrders.length}
          inProgressCount={inProgressOrders.length}
          completedCount={completedOrders.length}
          onNewOrdersClick={() => setShowNewOrders(true)}
        />
      ) : (
        <Dashboard
          metrics={{
            totalRevenue: revenue,
            totalOrders: newOrders.length + inProgressOrders.length + completedOrders.length,
            pendingDeliveries: inProgressOrders.length,
            completedDeliveries: completedOrders.length,
          } satisfies DashboardMetrics}
        />
      )}

      <NewOrdersModal open={showNewOrders} onClose={() => setShowNewOrders(false)} orders={newOrders} />
      <OrderDetailsModal open={Boolean(selectedOrder)} onClose={() => setSelectedOrder(null)} order={selectedOrder} />

      <OrdersTable
        title="In Progress Orders"
        orders={inProgressOrders}
        onRowClick={(o) => setSelectedOrder(o as DetailedOrder)}
      />
      <OrdersTable
        title="Completed Orders"
        orders={completedOrders}
        onRowClick={(o) => setSelectedOrder(o as DetailedOrder)}
      />

      <TransactionList title="Recent Transactions" transactions={[...newOrders, ...inProgressOrders, ...completedOrders].slice(0, 6)} />
    </div>
  )
}


