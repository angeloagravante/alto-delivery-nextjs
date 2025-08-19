import { SignIn } from '@clerk/nextjs'
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
              Welcome to Alto Delivery
            </h1>
            <p className="text-gray-600">
              Demo Mode - Clerk authentication not configured
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                To enable authentication, configure your Clerk environment variables:
              </p>
              <ul className="text-sm text-gray-500 text-left space-y-1">
                <li>• NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</li>
                <li>• CLERK_SECRET_KEY</li>
                <li>• NEXT_PUBLIC_CLERK_SIGN_IN_URL</li>
                <li>• NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL</li>
              </ul>
              <div className="mt-6">
                <Link 
                  href="/dashboard"
                  className="bg-[#1E466A] text-white px-6 py-2 rounded-lg hover:bg-[#1E466A]/90 transition-colors"
                >
                  Continue to Demo Dashboard
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
            Welcome to Alto Delivery
          </h1>
          <p className="text-gray-600">
            Sign in to access your delivery dashboard
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <SignIn 
            routing="path"
            path="/sign-in"
            afterSignInUrl="/dashboard"
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


