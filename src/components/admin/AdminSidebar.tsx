'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Store, Users, Settings, Shield, Home, type LucideIcon } from 'lucide-react'

interface AdminSidebarProps {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  
  const link = (href: string, label: string, Icon: LucideIcon) => {
    const active = pathname === href || pathname?.startsWith(href + '/')
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
          active 
            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500 shadow-sm' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
      </Link>
    )
  }

  return (
    <>
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
            <Image src="/logo.svg" alt="Alto Delivery" width={100} height={30} priority />
          </Link>
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full ml-auto">
            <Shield className="w-3 h-3 text-blue-700" />
            <span className="text-xs font-medium text-blue-700">Admin</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {link('/admin', 'Overview', Home)}
          {link('/admin/stores', 'Store Management', Store)}
          {link('/admin/users', 'User Management', Users)}
          {link('/admin/settings', 'Settings', Settings)}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            Admin Panel v1.0
          </div>
        </div>
      </aside>
    </>
  )
}
