import type { Metadata } from 'next'
import CustomerHeader from '@/components/customer/CustomerHeader'
import { CustomerProvider } from '@/components/customer/CustomerContext'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Customer - Alto Delivery',
}

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  // If a signed-in user is a store owner (has at least one store), redirect to /dashboard
  try {
    const { userId } = await auth()
    if (userId) {
      const user = await prisma.user.findUnique({ where: { clerkId: userId } })
      if (user) {
        const count = await prisma.store.count({ where: { userId: user.id } })
        if (count > 0) {
          redirect('/dashboard')
        }
      }
    }
  } catch {}

  return (
    <CustomerProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <CustomerHeader />
        <main className="flex-1 pt-2">
          {children}
        </main>
      </div>
    </CustomerProvider>
  )
}
