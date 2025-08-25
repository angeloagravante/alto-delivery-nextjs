import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { DashboardWrapper } from '@/components/dashboard/layout'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkPublishableKey && clerkPublishableKey !== 'pk_test_demo_placeholder_for_build';

  let user: unknown = null;
  if (isClerkConfigured) {
    try {
      user = await currentUser();
    } catch {
      // Ignore Clerk errors in demo mode
    }
  }

  // If signed in, enforce role routing
  if (user) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { clerkId: (user as { id: string }).id } }) as (| { role?: 'ADMIN'|'OWNER'|'CUSTOMER'; onboarded?: boolean } | null)
      if (dbUser?.onboarded === false && dbUser?.role !== 'ADMIN') redirect('/onboarding/role')
      if (dbUser?.role === 'ADMIN') redirect('/admin')
      if (dbUser?.role === 'CUSTOMER') redirect('/customer')
    } catch {}
  }

  const displayFirstName = (user as { firstName?: string } | null)?.firstName || 'User';

  return (
    <DashboardWrapper displayFirstName={displayFirstName} showUserButton={Boolean(user)}>
      {children}
    </DashboardWrapper>
  )
}


