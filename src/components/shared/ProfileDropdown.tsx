'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useClerk, useUser } from '@clerk/nextjs'
import { UserCircle, LogOut } from 'lucide-react'

type Role = 'ADMIN' | 'OWNER' | 'CUSTOMER'

export default function ProfileDropdown() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState<Role | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true
    fetch('/api/user/role', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (isMounted) setRole(data?.role as Role) })
      .catch(() => { /* ignore */ })
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fullName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.firstName || 'User'
  const email = user?.emailAddresses?.[0]?.emailAddress
  const initials = user?.firstName?.charAt(0).toUpperCase() || 'U'

  const roleLabel = role === 'ADMIN' ? 'Administrator' : role === 'OWNER' ? 'Store Owner' : 'Customer'
  const primaryLink = role === 'ADMIN' ? { href: '/admin', label: 'Admin Panel' }
    : role === 'OWNER' ? { href: '/dashboard', label: 'Dashboard' }
    : { href: '/customer', label: 'Browse' }

  const handleSignOut = () => signOut({ redirectUrl: '/' })

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(v => !v)} className="flex items-center gap-3 p-1 rounded-lg hover:bg-gray-50 transition-colors">
        {user?.imageUrl ? (
          <Image src={user.imageUrl} alt={fullName} width={40} height={40} className="rounded-full" />
        ) : (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-gray-600">{initials}</span>
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900">{fullName}</p>
          <p className="text-xs text-gray-500">{roleLabel}</p>
        </div>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {user?.imageUrl ? (
                <Image src={user.imageUrl} alt={fullName} width={32} height={32} className="rounded-full" />
              ) : (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-gray-500" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{fullName}</p>
                {email && <p className="text-sm text-gray-500">{email}</p>}
              </div>
            </div>
          </div>

          {/* Menu */}
          <div className="py-2">
            <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
              <UserCircle className="w-4 h-4" />
              View Profile
            </Link>
            <Link href={primaryLink.href} className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setIsOpen(false)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5v14M16 5v14" />
              </svg>
              {primaryLink.label}
            </Link>
          </div>

          <div className="border-t border-gray-100 py-2">
            <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
