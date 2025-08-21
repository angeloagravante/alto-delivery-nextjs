'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import StoreMenu from './StoreMenu'
import { Store } from '@/types/store'

type DashboardSidebarProps = {
  displayFirstName: string
  showUserButton: boolean
  onStoreChange?: (store: Store | null) => void
  isOpen?: boolean
  onToggle?: () => void
}

export default function DashboardSidebar({ displayFirstName, showUserButton, onStoreChange, isOpen = false, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname()

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    { 
      name: 'Manage', 
      href: '/dashboard/manage', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    { 
      name: 'Orders', 
      href: '/dashboard/orders', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      hasDropdown: true
    },
    { 
      name: 'Customers', 
      href: '/dashboard/customers', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      hasDropdown: true
    },
    { 
      name: 'Stores', 
      href: '/dashboard/stores', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      hasDropdown: true
    },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className={`fixed left-0 top-0 h-full bg-[#1E466A] text-white transition-all duration-300 ease-in-out z-50 w-64 ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      {/* Logo Section */}
      <div className="flex sticky top-0 items-center justify-center h-16 px-4 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo-white.svg" alt="Alto Delivery" width={160} height={48} priority />
        </Link>
        
        {/* Mobile close button */}
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-white/10 transition-colors lg:hidden"
            title="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="mt-6 px-3">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                title={item.name}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.hasDropdown && (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Store Menu */}
      {onStoreChange && (
        <div className="mt-6 px-3">
          <div className="px-3">
            <StoreMenu onStoreChange={onStoreChange} />
          </div>
        </div>
      )}

    </div>
  )
}
