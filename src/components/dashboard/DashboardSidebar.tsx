'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import { Store } from '@/types/store'

type DashboardSidebarProps = {
  displayFirstName: string
  showUserButton: boolean
  onStoreChange?: (store: Store | null) => void
  isOpen?: boolean
  onToggle?: () => void
  onClose?: () => void
}

export default function DashboardSidebar({ displayFirstName, showUserButton, onStoreChange, isOpen = false, onToggle, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleDropdown = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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
      hasDropdown: true,
      subItems: [
        { name: 'View Orders', href: '/dashboard/orders' },
        { name: 'New Orders', href: '/dashboard/orders/new' }
      ]
    },
    { 
      name: 'Customers', 
      href: '/dashboard/customers', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      hasDropdown: true,
      subItems: [
        { name: 'View Customers', href: '/dashboard/customers' },
        { name: 'Add Customer', href: '/dashboard/customers/add' }
      ]
    },
    { 
      name: 'Stores', 
      href: '/dashboard/stores', 
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      hasDropdown: true,
      subItems: [
        { name: 'Add Store', href: '/dashboard/stores/add' },
        { name: 'View your Stores', href: '/dashboard/stores/view' }
      ]
    },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    // Only highlight main menu if it's the exact path, not when sub-items are active
          // For stores, only highlight when on the exact stores page, not sub-pages
      if (href === '/dashboard/stores') {
        return pathname === '/dashboard/stores' && !pathname.includes('/add') && !pathname.includes('/view')
      }
    return pathname === href
  }

  const isSubItemActive = (href: string) => {
    return pathname === href
  }

  return (
    <div className={`fixed left-0 top-0 h-full transition-all duration-300 ease-in-out z-50 w-64 ${
      isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      {/* Sidebar Panel with Blue Background */}
      <div className="h-full bg-[#1E466A] text-white lg:rounded-none rounded-r-3xl">
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
              <div className="space-y-1">
                                  {/* Main Navigation Item */}
                  <div
                    className={`flex items-center justify-between px-3 py-3 rounded-r-3xl rounded-lg transition-colors cursor-pointer text-white/70 hover:bg-white/10 hover:text-white ${
                      isActive(item.href) ? 'bg-white/20 text-white' : ''
                    }`}
                    onClick={() => {
                      if (item.hasDropdown) {
                        toggleDropdown(item.name)
                      } else {
                        // Close sidebar when non-dropdown item is clicked (mobile only)
                        if (onClose && isMobile) {
                          onClose()
                        }
                      }
                    }}
                  >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {item.hasDropdown && (
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedItems.includes(item.name) ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
                
                {/* Dropdown Sub-items */}
                {item.hasDropdown && expandedItems.includes(item.name) && (
                  <div className="ml-6 space-y-1">
                    {item.subItems?.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isSubItemActive(subItem.href)
                            ? 'bg-white/20 text-white'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                        onClick={() => {
                          // Close sidebar when sub-item is clicked (mobile only)
                          if (onClose && isMobile) {
                            onClose()
                          }
                        }}
                      >
                        <span className="text-sm font-medium">{subItem.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Settings Section - Bottom of Sidebar */}
      <div className="mt-auto px-3 pb-6">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-white/70 hover:bg-white/10 hover:text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium">Settings</span>
        </button>
      </div>
      </div>
    </div>
  )
}
