import TransactionGroups from '@/components/dashboard/TransactionGroups'
import type { DetailedOrder } from '@/components/dashboard/DashboardMain'

export default function TransactionsPage() {
  const tx: DetailedOrder[] = [
    { id: 'ORD-2001', customerName: 'Juan Dela Cruz', customerAddress: 'Taguig City', paymentMethod: 'Cash on Delivery', totalAmount: 250, status: 'new', timestamp: new Date().toISOString() },
    { id: 'ORD-2002', customerName: 'Maria Santos', customerAddress: 'Makati City', paymentMethod: 'Credit Card', totalAmount: 520, status: 'in_transit', timestamp: new Date().toISOString() },
    { id: 'ORD-1999', customerName: 'ACME Inc', customerAddress: 'Quezon City', paymentMethod: 'GCash', totalAmount: 899, status: 'delivered', timestamp: new Date().toISOString() },
    { id: 'ORD-1990', customerName: 'Foo Bar', customerAddress: 'Pasig City', paymentMethod: 'Cash', totalAmount: 199, status: 'cancelled', timestamp: new Date().toISOString() },
  ]

  return (
    <div className="px-4 py-6 sm:px-0">
      <TransactionGroups transactions={tx} />
    </div>
  )
}


