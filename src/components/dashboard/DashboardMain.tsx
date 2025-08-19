'use client'

import OverviewCards from './OverviewCards'
import Dashboard, { type DashboardMetrics } from './Dashboard'
import OrdersTable, { Order } from './OrdersTable'
import NewOrdersModal from './NewOrdersModal'
import { useMemo, useState } from 'react'

export type DetailedOrder = Order & {
  items?: { name: string; quantity: number; price: number }[]
}

type DashboardMainProps = {
  newOrders: DetailedOrder[]
  inProgressOrders: DetailedOrder[]
  completedOrders: DetailedOrder[]
  showLegacyOverview?: boolean
}

export default function DashboardMain({ newOrders, inProgressOrders, completedOrders, showLegacyOverview = false }: DashboardMainProps) {
  const [showNewOrders, setShowNewOrders] = useState(false)

  const revenue = useMemo(() => {
    return completedOrders.reduce((sum, o) => sum + o.totalAmount, 0)
  }, [completedOrders])

  return (
    <div>
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

      <OrdersTable title="In Progress Orders" orders={inProgressOrders} />
      <OrdersTable title="Completed Orders" orders={completedOrders} />
    </div>
  )
}


