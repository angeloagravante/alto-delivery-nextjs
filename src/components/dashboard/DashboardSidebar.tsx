'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  MessageCircle, 
  ClipboardList, 
  Users, 
  Building2, 
  Settings,
  ChevronDown,
  X
} from 'lucide-react'

type DashboardSidebarProps = {
  isOpen?: boolean
  onToggle?: () => void
  onClose?: () => void
}

export default function DashboardSidebar({ isOpen = false, onToggle, onClose }: DashboardSidebarProps) {
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
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    { 
      name: 'Manage', 
      href: '/dashboard/manage', 
      icon: <MessageCircle className="w-5 h-5" />
    },
    { 
      name: 'Orders', 
      href: '/dashboard/orders', 
      icon: <ClipboardList className="w-5 h-5" />,
      hasDropdown: true,
      subItems: [
        { name: 'View Orders', href: '/dashboard/orders' },
        { name: 'New Orders', href: '/dashboard/orders/new' }
      ]
    },
    { 
      name: 'Customers', 
      href: '/dashboard/customers', 
      icon: <Users className="w-5 h-5" />,
      hasDropdown: true,
      subItems: [
        { name: 'View Customers', href: '/dashboard/customers' },
        { name: 'Add Customer', href: '/dashboard/customers/add' }
      ]
    },
    { 
      name: 'Stores', 
      href: '/dashboard/stores', 
      icon: <Building2 className="w-5 h-5" />,
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
            <X className="w-5 h-5" />
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
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedItems.includes(item.name) ? 'rotate-180' : ''
                      }`} 
                    />
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
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
      </div>
      </div>
    </div>
  )
}
