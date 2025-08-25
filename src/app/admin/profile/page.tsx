import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { UserCircle, Mail, Calendar, Settings, LogOut, Edit, Shield, Clock, Activity } from 'lucide-react'
import SignOutButton from '@/components/SignOutButton'
import { prisma } from '@/lib/prisma'

export const metadata = { title: 'Profile - Admin Panel' }

export default async function AdminProfilePage() {
  // Check if Clerk is properly configured
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured = clerkPublishableKey && clerkPublishableKey !== 'pk_test_demo_placeholder_for_build';
  
  let user = null;
  let dbUser = null;
  
  if (isClerkConfigured) {
    try {
      user = await currentUser();
    } catch {
      // Handle Clerk errors gracefully
      redirect('/sign-in');
    }
    
    // If Clerk is configured but no user, redirect to sign-in
    if (!user) {
      redirect('/sign-in');
    }

    // Get user data from database
    try {
      dbUser = await prisma.user.findUnique({ 
        where: { clerkId: user.id },
        include: {
          _count: {
            select: {
              stores: true
            }
          }
        }
      }) as any;
      
      // Verify admin role
      if (dbUser?.role !== 'ADMIN') {
        redirect('/dashboard');
      }
    } catch {
      // Handle database errors gracefully
      redirect('/admin');
    }
  }
  
  // Demo user for when Clerk is not configured
  const demoUser = {
    firstName: "Admin",
    lastName: "User",
    emailAddresses: [{ emailAddress: "admin@altodelivery.com" }],
    imageUrl: null,
    createdAt: new Date()
  };
  
  const displayUser = user || demoUser;
  const fullName = `${displayUser.firstName || ''} ${displayUser.lastName || ''}`.trim();
  const email = displayUser.emailAddresses?.[0]?.emailAddress || '';
  const joinDate = displayUser.createdAt ? new Date(displayUser.createdAt).toLocaleDateString() : 'N/A';
  const lastSignIn = user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleDateString() : 'N/A';

  // Get admin stats
  const totalUsers = await prisma.user.count().catch(() => 0);
  const totalStores = await prisma.store.count().catch(() => 0);
  const totalOrders = await prisma.order.count().catch(() => 0);

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administrator Profile</h1>
          <p className="text-gray-600">Manage your admin account and view system overview</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium">
          <Shield className="w-4 h-4" />
          Administrator
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-8 text-white">
            <div className="flex items-center gap-4">
              <div className="relative">
                {displayUser.imageUrl ? (
                  <Image
                    src={displayUser.imageUrl}
                    alt={fullName}
                    width={80}
                    height={80}
                    className="rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                    <UserCircle className="w-10 h-10 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white text-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <Shield className="w-3 h-3" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{fullName || 'Administrator'}</h2>
                <p className="text-red-100 mb-2">{email}</p>
                <div className="flex items-center gap-4 text-sm text-red-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {joinDate}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Last login {lastSignIn}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Account Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                    <Shield className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-red-700">Account Role</p>
                      <p className="text-red-900 font-semibold">Administrator</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Activity className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Account Status</p>
                      <p className="text-green-600 font-semibold">Active</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button className="flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Edit className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Edit Profile</p>
                      <p className="text-sm text-gray-500">Update personal information</p>
                    </div>
                  </button>
                  
                  <Link 
                    href="/admin/settings" 
                    className="flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">System Settings</p>
                      <p className="text-sm text-gray-500">Configure system preferences</p>
                    </div>
                  </Link>
                  
                  <Link 
                    href="/admin/users" 
                    className="flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <UserCircle className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Manage Users</p>
                      <p className="text-sm text-gray-500">View and manage user accounts</p>
                    </div>
                  </Link>
                  
                  <Link 
                    href="/admin" 
                    className="flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Activity className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">View Dashboard</p>
                      <p className="text-sm text-gray-500">Return to admin overview</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Overview & Actions */}
        <div className="space-y-6">
          {/* System Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Total Users</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{totalUsers}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-sm font-medium text-green-900">Total Stores</span>
                </div>
                <span className="text-lg font-bold text-green-600">{totalStores}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span className="text-sm font-medium text-purple-900">Total Orders</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{totalOrders}</span>
              </div>
            </div>
          </div>

          {/* Admin Tools */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Tools</h3>
            <div className="space-y-3">
              <Link 
                href="/admin/users" 
                className="block p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">User Management</span>
                </div>
              </Link>
              
              <Link 
                href="/admin/stores" 
                className="block p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Store Management</span>
                </div>
              </Link>
              
              <Link 
                href="/admin/settings" 
                className="block p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">System Settings</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Account Actions</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <LogOut className="w-5 h-5 text-red-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900 mb-1">Sign Out</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Sign out of your administrator account
                  </p>
                  {isClerkConfigured ? (
                    <SignOutButton />
                  ) : (
                    <Link
                      href="/"
                      className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
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
  );
}
