'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { StoreMenu } from '@/components/dashboard/stores'
import CustomUserButton from './CustomUserButton'
import { Store } from '@/types/store'
import { Search, Bell } from 'lucide-react'

type DashboardHeaderProps = {
  displayFirstName: string
  showUserButton: boolean
  onStoreChange?: (store: Store | null) => void
  onBurgerClick?: () => void
}

export default function DashboardHeader({ displayFirstName, showUserButton, onStoreChange, onBurgerClick }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()

  // Hide store selector on store-related pages
  const shouldShowStoreSelector = onStoreChange && !pathname.includes('/stores')
  


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
          
          {/* Logo Button */}
          <Link href="/dashboard" className="flex items-center">
            <Image src="/logo.svg" alt="Alto Delivery" width={120} height={36} priority />
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
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Right Side - Icons and User Profile */}
        <div className="flex items-center gap-4">

          {/* Store Selector - Desktop Only, Hidden on Store Pages */}
          {shouldShowStoreSelector && (
            <div className="hidden lg:block relative">
              <StoreMenu onStoreChange={onStoreChange} />
            </div>
          )}

          {/* Search Icon - Always Visible */}
          <button className="hidden lg:hidden w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notifications Icon with Badge - Always Visible */}
          <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-white text-xs rounded-full flex items-center justify-center font-medium">
              2
            </span>
          </button>

          {/* User Profile Section */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <CustomUserButton 
              displayFirstName={displayFirstName}
              showUserButton={showUserButton}
            />
          </div>
        </div>
      </div>
    </header>
  )
}


