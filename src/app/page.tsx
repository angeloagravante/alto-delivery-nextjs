import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function Home() {
  // Only check user if Clerk is properly configured
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkPublishableKey && clerkPublishableKey !== 'pk_test_demo_placeholder_for_build';
  
  let user = null;
  if (isClerkConfigured) {
    try {
      user = await currentUser();
    } catch {
      // Handle Clerk errors gracefully - running in demo mode
    }
  }
  
  // If user is signed in, redirect based on role
  if (user) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { clerkId: user.id } })
      const role = (dbUser as { role?: 'ADMIN' | 'OWNER' | 'CUSTOMER' } | null)?.role ?? 'CUSTOMER'
  if (role === 'ADMIN') redirect('/admin')
  if (role === 'OWNER') redirect('/dashboard')
      redirect('/customer')
    } catch {
      redirect('/customer')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-[#1E466A] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Alto Delivery</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/sign-in"
                className="bg-white text-[#1E466A] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Premium Delivery
            <span className="block text-[#1E466A]">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience fast, reliable, and professional delivery services with Alto Delivery. 
            Your trusted partner for all your delivery needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-in"
              className="bg-[#1E466A] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#1E466A]/90 transition-colors"
            >
              Get Started
            </Link>
            <button className="border-2 border-[#1E466A] text-[#1E466A] px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#1E466A] hover:text-white transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-12 h-12 bg-[#1E466A] rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Lightning-fast delivery times to meet your urgent needs.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-12 h-12 bg-[#1E466A] rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliable Service</h3>
            <p className="text-gray-600">Count on us for consistent and dependable delivery services.</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="w-12 h-12 bg-[#1E466A] rounded-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Team</h3>
            <p className="text-gray-600">Our experienced team ensures your packages are in safe hands.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
