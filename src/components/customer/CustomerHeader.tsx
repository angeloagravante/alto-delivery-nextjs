'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, ShoppingCart } from 'lucide-react'
import { useCustomer } from './CustomerContext'
import ProfileDropdown from '@/components/shared/ProfileDropdown'

export default function CustomerHeader() {
  const { location, setLocation, count } = useCustomer()
  return (
  <header className="w-full border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 sticky top-0 z-40 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo (matches Dashboard) */}
        <Link href="/customer" className="flex items-center">
          <Image src="/logo.svg" alt="Alto Delivery" width={120} height={36} priority />
        </Link>

        {/* Location picker (stub) */}
        <button
          className="hidden sm:flex items-center gap-2 text-sm text-gray-800 px-3 py-2 rounded-md hover:bg-gray-50"
          onClick={() => {
            const loc = prompt('Enter delivery location', location ?? '')
            if (loc !== null) setLocation(loc || null)
          }}
        >
          <MapPin className="w-4 h-4" />
          <span>Deliver to: {location ?? 'Select location'}</span>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-3">
          <Link href="/customer/cart" className="relative p-2 rounded-md hover:bg-gray-50" aria-label="Cart">
            <ShoppingCart className="w-5 h-5 text-gray-800" />
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 text-[10px] min-w-4 h-4 leading-4 text-center bg-orange-500 text-white rounded-full px-1"
                aria-live="polite"
              >
                {count}
              </span>
            )}
          </Link>
          <div className="pl-2 border-l border-gray-200">
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </header>
  )
}
