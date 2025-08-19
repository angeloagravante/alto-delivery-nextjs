import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkPublishableKey && clerkPublishableKey !== 'pk_test_demo_placeholder_for_build';

  let user: any = null;
  if (isClerkConfigured) {
    try {
      user = await currentUser();
    } catch {
      // Ignore Clerk errors in demo mode
    }
  }

  const displayFirstName = user?.firstName || 'User';

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader displayFirstName={displayFirstName} showUserButton={Boolean(user)} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}


