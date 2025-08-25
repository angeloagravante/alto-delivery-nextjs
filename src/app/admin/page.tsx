import Link from 'next/link'
import { Store, Users, Settings, BarChart3, Shield, ArrowRight } from 'lucide-react'

export default function AdminIndex() {
  const quickActions = [
    {
      title: 'Store Management',
      description: 'Manage application-wide stores, locations, and configurations.',
      href: '/admin/stores',
      icon: Store,
      color: 'bg-blue-50 text-blue-700',
      iconBg: 'bg-blue-100',
      stats: '12 Active Stores'
    },
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions across the platform.',
      href: '/admin/users',
      icon: Users,
      color: 'bg-green-50 text-green-700',
      iconBg: 'bg-green-100',
      stats: '248 Total Users'
    },
    {
      title: 'System Settings',
      description: 'Configure global settings and application preferences.',
      href: '/admin/settings',
      icon: Settings,
      color: 'bg-purple-50 text-purple-700',
      iconBg: 'bg-purple-100',
      stats: '15 Configurations'
    }
  ]

  const metrics = [
    {
      title: 'Total Revenue',
      value: '₱124,580',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: BarChart3
    },
    {
      title: 'Active Stores',
      value: '12',
      change: '+2',
      changeType: 'positive' as const,
      icon: Store
    },
    {
      title: 'Total Users',
      value: '248',
      change: '+8',
      changeType: 'positive' as const,
      icon: Users
    },
    {
      title: 'System Health',
      value: '99.8%',
      change: '+0.2%',
      changeType: 'positive' as const,
      icon: Shield
    }
  ]

  return (
    <div className="py-6 px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-6 h-6 text-blue-700" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <p className="text-gray-600">
          Welcome to the admin panel. Monitor system performance and manage platform-wide settings.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric) => (
          <div key={metric.title} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <metric.icon className="w-6 h-6 text-gray-600" />
              </div>
              <span className={`text-sm font-medium ${
                metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
            <p className="text-sm text-gray-600">{metric.title}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.iconBg}`}>
                  <action.icon className={`w-6 h-6 ${action.color.split(' ')[1]}`} />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                {action.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                {action.description}
              </p>
              <div className="text-xs text-gray-500 font-medium">
                {action.stats}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'New store created', details: 'Makati Branch - Store ID: ST-012', time: '2 hours ago', type: 'store' },
            { action: 'User role updated', details: 'john.doe@example.com promoted to Owner', time: '4 hours ago', type: 'user' },
            { action: 'System backup completed', details: 'Daily backup completed successfully', time: '6 hours ago', type: 'system' },
            { action: 'Settings updated', details: 'Payment gateway configuration modified', time: '1 day ago', type: 'settings' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                activity.type === 'store' ? 'bg-blue-100' :
                activity.type === 'user' ? 'bg-green-100' :
                activity.type === 'system' ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                {activity.type === 'store' && <Store className="w-5 h-5 text-blue-600" />}
                {activity.type === 'user' && <Users className="w-5 h-5 text-green-600" />}
                {activity.type === 'system' && <Shield className="w-5 h-5 text-purple-600" />}
                {activity.type === 'settings' && <Settings className="w-5 h-5 text-gray-600" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
