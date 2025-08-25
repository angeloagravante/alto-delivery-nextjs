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
  // If a signed-in user is a store owner/admin, redirect to /dashboard; if not onboarded, go to onboarding
  try {
    const { userId } = await auth()
    if (userId) {
      const user = await prisma.user.findUnique({ where: { clerkId: userId } }) as (| { id: string; role?: 'ADMIN'|'OWNER'|'CUSTOMER'; onboarded?: boolean } | null)
  // TEMPORARILY DISABLED: if (user?.onboarded === false) redirect('/onboarding/role')
  if (user?.role === 'ADMIN') redirect('/admin')
  if (user?.role === 'OWNER') redirect('/dashboard')
    }
  } catch {}

  return (
    <CustomerProvider>
  <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
        <CustomerHeader />
        <main className="flex-1 pt-2">
          {children}
        </main>
      </div>
    </CustomerProvider>
  )
}
