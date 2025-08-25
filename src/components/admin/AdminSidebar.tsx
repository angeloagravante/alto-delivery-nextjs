'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Store, Users, Settings, Shield, type LucideIcon } from 'lucide-react'

export default function AdminSidebar() {
  const pathname = usePathname()
  const link = (href: string, label: string, Icon: LucideIcon) => {
    const active = pathname === href || pathname?.startsWith(href + '/')
    return (
    <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
      active ? 'bg-blue-50 text-blue-700' : 'text-gray-800 hover:bg-gray-50'
        }`}
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{label}</span>
      </Link>
    )
  }

  return (
  <aside className="w-64 shrink-0 border-r bg-white h-screen sticky top-0 text-gray-900">
      <div className="h-16 flex items-center gap-2 px-4 border-b">
        <Shield className="w-5 h-5 text-blue-700" />
    <span className="font-semibold text-gray-900">Admin</span>
      </div>
      <nav className="p-3 space-y-1">
        {link('/admin/stores', 'Store management', Store)}
        {link('/admin/users', 'User management', Users)}
  {link('/admin/settings', 'Settings', Settings)}
      </nav>
  <div className="mt-auto p-3 border-t text-xs text-gray-600 px-1">Admin</div>
    </aside>
  )
}
