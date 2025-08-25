import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { UserCircle, Mail, Calendar, Settings, LogOut, Edit } from 'lucide-react'
import SignOutButton from '@/components/SignOutButton'
import RoleSwitcher from '@/components/profile/RoleSwitcher'

export default async function ProfilePage() {
  // Check if Clerk is properly configured
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
    lastName: "User",
    emailAddresses: [{ emailAddress: "demo@altodelivery.com" }],
    imageUrl: null,
    createdAt: new Date()
  };
  
  const displayUser = user || demoUser;
  const fullName = `${displayUser.firstName || ''} ${displayUser.lastName || ''}`.trim();
  const email = displayUser.emailAddresses?.[0]?.emailAddress || '';
  const joinDate = displayUser.createdAt ? new Date(displayUser.createdAt).toLocaleDateString() : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Alto Delivery" width={100} height={30} priority />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#1E466A] to-[#2D5A7B] px-8 py-12 text-white">
            <div className="flex items-center gap-6">
              <div className="relative">
                {displayUser.imageUrl ? (
                  <Image
                    src={displayUser.imageUrl}
                    alt={fullName}
                    width={96}
                    height={96}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <UserCircle className="w-12 h-12 text-white" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white text-[#1E466A] rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{fullName || 'User'}</h1>
                <p className="text-blue-100 mb-4">{email}</p>
                <div className="flex items-center gap-4 text-sm text-blue-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Member since {joinDate}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Account Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email Address</p>
                      <p className="text-gray-900">{email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <UserCircle className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Full Name</p>
                      <p className="text-gray-900">{fullName || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Settings className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700 mb-1">Account Role</p>
                      <RoleSwitcher />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Edit className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Edit Profile</p>
                      <p className="text-sm text-gray-500">Update your personal information</p>
                    </div>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Settings className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Account Settings</p>
                      <p className="text-sm text-gray-500">Manage your account preferences</p>
                    </div>
                  </button>
                  
                  <Link 
                    href="/dashboard" 
                    className="w-full flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v14M16 5v14" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Go to Dashboard</p>
                      <p className="text-sm text-gray-500">Return to your main dashboard</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <LogOut className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900 mb-2">Sign Out</h4>
                    <p className="text-sm text-red-700 mb-4">
                      This will sign you out of your account and redirect you to the home page.
                    </p>
                    {isClerkConfigured ? (
                      <SignOutButton />
                    ) : (
                      <Link
                        href="/"
                        className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        Exit Demo
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
