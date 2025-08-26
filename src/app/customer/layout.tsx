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
      if (user?.onboarded === false && user?.role !== 'ADMIN') redirect('/onboarding/role')
      if (user?.role === 'OWNER') redirect('/dashboard')
    }
  } catch {}

  // Load UI theme colors from SystemConfig (server-side) with sensible defaults
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const config = await (prisma as any).systemConfig?.findUnique?.({ where: { id: 'system' } }).catch(() => null)
  const primary = (config?.uiThemePrimary as string | undefined) || '#1E466A'
  const accent = (config?.uiThemeAccent as string | undefined) || '#F97316'

  return (
    <CustomerProvider>
      <div
        className="min-h-screen flex flex-col bg-gray-50 text-gray-900"
        style={{
          // Expose CSS variables for theme-able colors
          ['--color-primary' as unknown as string]: primary,
          ['--color-accent' as unknown as string]: accent,
        }}
      >
        <CustomerHeader />
        <main className="flex-1 pt-2">
          {children}
        </main>
      </div>
    </CustomerProvider>
  )
}
