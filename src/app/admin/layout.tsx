import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AdminWrapper from '@/components/admin/AdminWrapper'

export const metadata = { title: 'Admin - Alto Delivery' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const isClerkConfigured = clerkPublishableKey && clerkPublishableKey !== 'pk_test_demo_placeholder_for_build'

  let user = null
  // no-op: profile dropdown pulls details client-side

  if (isClerkConfigured) {
    try {
      user = await currentUser()
      if (!user) redirect('/sign-in')
      
      const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } }) as (| { role?: 'ADMIN'|'OWNER'|'CUSTOMER' } | null)
      if (dbUser?.role !== 'ADMIN') {
        // Owners should go to dashboard, customers to customer area
        if (dbUser?.role === 'OWNER') redirect('/dashboard')
        redirect('/customer')
      }
      
  // values used only client-side in shared dropdown
    } catch {
      redirect('/sign-in')
    }
  }

  return (
    <AdminWrapper>
      {children}
    </AdminWrapper>
  )
}
