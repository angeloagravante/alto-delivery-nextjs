import { currentUser } from '@clerk/nextjs/server'
import DashboardWrapper from '@/components/dashboard/DashboardWrapper'

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

  const displayFirstName = (user as { firstName?: string } | null)?.firstName || 'User';

  return (
    <DashboardWrapper displayFirstName={displayFirstName} showUserButton={Boolean(user)}>
      {children}
    </DashboardWrapper>
  )
}


