import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DashboardMain, DetailedOrder } from '@/components/dashboard/layout'

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
  
  // Use displayUser for potential future features (currently used in demo mode)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const displayUser = user || demoUser;
  // Note: displayUser reserved for future dashboard personalization features

  // Demo data for now; replace with real data source later
  const newOrders: DetailedOrder[] = [
    {
      id: 'ORD-1001',
      customerName: 'John Doe',
      customerAddress: '123 Main St, Makati, Metro Manila',
      paymentMethod: 'Cash on Delivery',
      totalAmount: 125.5,
      status: 'new',
      timestamp: new Date().toISOString(),
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
      customerAddress: '456 EDSA Ave, Quezon City, Metro Manila',
      paymentMethod: 'GCash',
      totalAmount: 89.99,
      status: 'in_progress',
      timestamp: new Date().toISOString(),
    },
  ]
  const completedOrders: DetailedOrder[] = [
    {
      id: 'ORD-0999',
      customerName: 'Acme Corp',
      customerAddress: '789 Ayala Ave, Makati, Metro Manila',
      paymentMethod: 'Credit Card',
      totalAmount: 349.0,
      status: 'completed',
      timestamp: new Date().toISOString(),
    },
  ]

  return <DashboardMain newOrders={newOrders} inProgressOrders={inProgressOrders} completedOrders={completedOrders} />
}