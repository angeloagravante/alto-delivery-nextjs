import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function Page() {
  // Check if Clerk is properly configured
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkPublishableKey && clerkPublishableKey !== 'pk_test_demo_placeholder_for_build';

  if (!isClerkConfigured) {
    // Fallback for demo mode
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join Alto Delivery
            </h1>
            <p className="text-gray-600">
              Demo Mode - Clerk authentication not configured
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                To enable user registration, configure your Clerk environment variables.
              </p>
              <div className="mt-6">
                <Link 
                  href="/sign-in"
                  className="bg-[#1E466A] text-white px-6 py-2 rounded-lg hover:bg-[#1E466A]/90 transition-colors"
                >
                  Go to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Alto Delivery
          </h1>
          <p className="text-gray-600">
            Create your account to start using our delivery services
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <SignUp 
            routing="path"
            afterSignUpUrl="/dashboard"
            redirectUrl="/dashboard"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-[#1E466A] hover:bg-[#1E466A]/90',
                footerActionLink: 'text-[#1E466A] hover:text-[#1E466A]/90'
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}


