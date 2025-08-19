'use client'

import { useMemo, useState } from 'react'
import type { DetailedOrder } from './DashboardMain'
import TransactionCard from './TransactionCard'
import OrdersTable from './OrdersTable'
import OrderDetailsModal from './OrderDetailsModal'

type Props = {
  transactions: DetailedOrder[]
}

export default function TransactionGroups({ transactions }: Props) {
  const [pageInProgress, setPageInProgress] = useState(1)
  const [pageDelivered, setPageDelivered] = useState(1)
  const [selected, setSelected] = useState<DetailedOrder | null>(null)

  const groups = useMemo(() => {
    const pending = transactions.filter(t => t.status === 'new' || t.status === 'pending')
    const inTransit = transactions.filter(t => t.status === 'in_transit' || t.status === 'in_progress')
    const delivered = transactions.filter(t => t.status === 'delivered' || t.status === 'completed')
    const cancelled = transactions.filter(t => t.status === 'cancelled')

    const pendingSorted = [...pending].sort((a,b) => getTime(b) - getTime(a))
    const inProgress = [...inTransit].sort((a,b) => getTime(a) - getTime(b))
    const deliveredSorted = [...delivered].sort((a,b) => getTime(b) - getTime(a))
    const cancelledSorted = [...cancelled].sort((a,b) => getTime(b) - getTime(a))
    return { pendingSorted, inProgress, deliveredSorted, cancelledSorted }
  }, [transactions])

  return (
    <div className="mt-8 flex flex-col gap-10 relative">
      {/* New Pending */}
      <section>
        <h2 className="text-xl font-semibold text-slate-900 mb-3">New Pending Orders</h2>
        {groups.pendingSorted.length === 0 ? (
          <div className="p-4 border border-dashed border-slate-300 bg-slate-50 text-slate-500 rounded-lg">No new pending orders.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.pendingSorted.map(t => (
              <TransactionCard key={t.id} transaction={t} onClick={() => setSelected(t)} />
            ))}
          </div>
        )}
      </section>

      {/* In Progress */}
      <section>
        <h2 className="text-xl font-semibold text-slate-900 mb-3">In Progress <span className="text-xs uppercase tracking-wide text-slate-500">(pending + in_transit)</span></h2>
        {groups.inProgress.length === 0 ? (
          <div className="p-4 border border-dashed border-slate-300 bg-slate-50 text-slate-500 rounded-lg">No in-progress orders.</div>
        ) : (
          <OrdersTable title="" orders={groups.inProgress} pageSize={10} onRowClick={(o) => setSelected(o as DetailedOrder)} />
        )}
      </section>

      {/* Delivered */}
      <section>
        <h2 className="text-xl font-semibold text-slate-900 mb-3">Recently Delivered</h2>
        <OrdersTable title="" orders={groups.deliveredSorted} pageSize={10} onRowClick={(o) => setSelected(o as DetailedOrder)} />
      </section>

      {/* Cancelled */}
      {groups.cancelledSorted.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Cancelled</h2>
          <OrdersTable title="" orders={groups.cancelledSorted} pageSize={10} />
        </section>
      )}

      <OrderDetailsModal open={Boolean(selected)} onClose={() => setSelected(null)} order={selected} />
    </div>
  )
}

function getTime(o: DetailedOrder) {
  const d = o.timestamp ? new Date(o.timestamp) : (o.createdAt ? new Date(o.createdAt) : null)
  return d ? d.getTime() : 0
}


