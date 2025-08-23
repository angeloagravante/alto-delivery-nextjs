'use client'

import { formatCurrency } from '@/lib/currency'
import type { DetailedOrder } from '@/components/dashboard/layout'

type Props = {
  transaction: DetailedOrder
  onClick?: () => void
}

export default function TransactionCard({ transaction, onClick }: Props) {
  return (
    <div
      className="bg-white rounded-xl p-6 shadow border border-slate-200 transition-transform hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-col gap-2">
          <h3 className="m-0 text-base font-semibold text-slate-900">#{transaction.id}</h3>
          <span className={statusPillClass(transaction.status)}>{formatStatus(transaction.status)}</span>
        </div>
        <div className="text-lg font-bold text-emerald-600">{formatCurrency(transaction.totalAmount)}</div>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <h4 className="m-0 mb-2 text-sm font-semibold text-slate-700">{transaction.customerName}</h4>
          {transaction.customerAddress && (
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <MapPinIcon />
              <span className="truncate" title={transaction.customerAddress}>{transaction.customerAddress}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-slate-600 text-sm">
          <div className="flex items-center gap-2">
            <ClockIcon />
            <span>{formatDate(transaction)}</span>
          </div>
          {transaction.paymentMethod && (
            <div className="flex items-center gap-2">
              <PaymentIcon method={transaction.paymentMethod} />
              <span>{transaction.paymentMethod}</span>
            </div>
          )}
          {typeof transaction.deliveryFee === 'number' && (
            <div className="ml-auto font-medium text-slate-700">
              Delivery: {formatCurrency(transaction.deliveryFee)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function statusPillClass(status: DetailedOrder['status']) {
  const base = 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold uppercase'
  switch (status) {
    case 'pending':
      return base + ' bg-amber-100 text-amber-800'
    case 'in_transit':
    case 'in_progress':
      return base + ' bg-blue-100 text-blue-900'
    case 'delivered':
    case 'completed':
      return base + ' bg-emerald-100 text-emerald-700'
    case 'cancelled':
      return base + ' bg-rose-100 text-rose-800'
    case 'new':
    default:
      return base + ' bg-violet-100 text-violet-700'
  }
}

function formatStatus(status: DetailedOrder['status']) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function formatDate(order: DetailedOrder) {
  const d = order.timestamp ? new Date(order.timestamp) : (order.createdAt ? new Date(order.createdAt) : null)
  if (!d) return '-'
  return d.toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' })
}

function MapPinIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

function PaymentIcon({ method }: { method: string }) {
  // simple mapping to distinct icons
  if (method.toLowerCase().includes('cash')) return <BanknoteIcon />
  if (method.toLowerCase().includes('gcash') || method.toLowerCase().includes('wallet')) return <SmartphoneIcon />
  return <CreditCardIcon />
}

function BanknoteIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function CreditCardIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
    </svg>
  )
}

function SmartphoneIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="7" y="2" width="10" height="20" rx="2" /><circle cx="12" cy="18" r="1" />
    </svg>
  )
}


