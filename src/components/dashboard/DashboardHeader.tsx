'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import StoreMenu from './StoreMenu'
import { Store } from '@/types/store'

type DashboardHeaderProps = {
  displayFirstName: string
  showUserButton: boolean
  onStoreChange?: (store: Store | null) => void
}

export default function DashboardHeader({ displayFirstName, showUserButton, onStoreChange }: DashboardHeaderProps) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-[#1E466A] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src="/logo-white.svg" alt="Alto Delivery" width={120} height={36} priority />
            </Link>
          </div>

          {/* Desktop center links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-gray-200 transition-colors">Dashboard</Link>
            <Link href="/dashboard/products" className="hover:text-gray-200 transition-colors">Products</Link>
            <Link href="/dashboard/transactions" className="hover:text-gray-200 transition-colors">Transactions</Link>
            <Link href="/dashboard/stores" className="hover:text-gray-200 transition-colors">Stores</Link>
          </div>

          {/* Right: Store Menu + Welcome + User icon (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {onStoreChange && <StoreMenu onStoreChange={onStoreChange} />}
            <span className="text-sm">Welcome, {displayFirstName}</span>
            {showUserButton ? (
              <UserButton />
            ) : (
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1E466A] font-bold">
                {displayFirstName.charAt(0)}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setOpen(v => !v)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10 focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden border-t border-white/10">
          <div className="px-4 py-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Welcome, {displayFirstName}</span>
              {showUserButton ? (
                <UserButton />
              ) : (
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1E466A] font-bold">
                  {displayFirstName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Link onClick={() => setOpen(false)} href="/dashboard" className="py-2">Dashboard</Link>
              <Link onClick={() => setOpen(false)} href="/dashboard/products" className="py-2">Products</Link>
              <Link onClick={() => setOpen(false)} href="/dashboard/transactions" className="py-2">Transactions</Link>
              <Link onClick={() => setOpen(false)} href="/dashboard/stores" className="py-2">Stores</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}


