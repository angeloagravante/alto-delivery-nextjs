'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Bell, Shield } from 'lucide-react'

type AdminHeaderProps = {
  displayFirstName: string
  onBurgerClick?: () => void
}

export default function AdminHeader({ displayFirstName, onBurgerClick }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 px-6 h-16 flex items-center z-20">
      <div className="flex items-center justify-between w-full">
        {/* Mobile Layout */}
        <div className="flex items-center gap-4 lg:hidden">
          {/* Burger Button */}
          {onBurgerClick && (
            <button
              onClick={onBurgerClick}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          {/* Logo with Admin Badge */}
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Alto Delivery" width={120} height={36} priority />
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
              <Shield className="w-3 h-3 text-blue-700" />
              <span className="text-xs font-medium text-blue-700">Admin</span>
            </div>
          </Link>
        </div>

        {/* Desktop Layout - Search Input */}
        <div className="hidden lg:block flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users, stores, settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Right Side - Icons and User Profile */}
        <div className="flex items-center gap-4">
          {/* Search Icon - Mobile Only */}
          <button className="lg:hidden w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notifications Icon with Badge */}
          <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              3
            </span>
          </button>

          {/* Admin Badge - Desktop Only */}
          <div className="hidden lg:flex items-center gap-1 px-3 py-1.5 bg-blue-100 rounded-full">
            <Shield className="w-4 h-4 text-blue-700" />
            <span className="text-sm font-medium text-blue-700">Admin Panel</span>
          </div>

          {/* User Profile Section */}
          <Link href="/profile" className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-gray-50 rounded-lg transition-colors p-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-blue-700">
                  {displayFirstName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {displayFirstName}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
