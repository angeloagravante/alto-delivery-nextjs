import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import DashboardMain, { DetailedOrder } from '@/components/dashboard/DashboardMain'

export default async function DashboardPage() {
  // Only check user if Clerk is properly configured
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkPublishableKey && clerkPublishableKey !== 'pk_test_demo_placeholder_for_build';
  
  let user = null;
  if (isClerkConfigured) {
    try {
      user = await currentUser();
    } catch {
      // Handle Clerk errors gracefully
    }
    
    // If Clerk is configured but no user, redirect to sign-in
    if (!user) {
      redirect('/sign-in');
    }
  }
  
  // Demo user for when Clerk is not configured
  const demoUser = {
    firstName: "Demo",
    emailAddresses: [{ emailAddress: "demo@altodelivery.com" }]
  };
  
  const displayUser = user || demoUser;

  // Demo data for now; replace with real data source later
  const newOrders: DetailedOrder[] = [
    {
      id: 'ORD-1001',
      customerName: 'John Doe',
      totalAmount: 125.5,
      status: 'new',
      createdAt: new Date().toISOString(),
      items: [
        { name: 'Box A', quantity: 1, price: 50 },
        { name: 'Box B', quantity: 2, price: 37.75 },
      ],
    },
  ]
  const inProgressOrders: DetailedOrder[] = [
    {
      id: 'ORD-1002',
      customerName: 'Jane Smith',
      totalAmount: 89.99,
      status: 'in_progress',
      createdAt: new Date().toISOString(),
    },
  ]
  const completedOrders: DetailedOrder[] = [
    {
      id: 'ORD-0999',
      customerName: 'Acme Corp',
      totalAmount: 349.0,
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
  ]

  return <DashboardMain newOrders={newOrders} inProgressOrders={inProgressOrders} completedOrders={completedOrders} />
}