'use client'

import TransactionCard from './TransactionCard'
import type { DetailedOrder } from '@/components/dashboard/layout'

type Props = {
  transactions: DetailedOrder[]
  title?: string
}

export default function TransactionList({ transactions, title = 'Recent Transactions' }: Props) {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
          {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center p-12 text-slate-500 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          No transactions found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {transactions.map((t) => (
            <TransactionCard key={t.id} transaction={t} />
          ))}
        </div>
      )}
    </div>
  )
}


