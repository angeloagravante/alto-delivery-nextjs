"use client"

import { Settings, Database, Shield, Globe, Palette, Zap } from 'lucide-react'
import DbConnectionStatus from '@/components/admin/DbConnectionStatus'
import SystemConfigSummary from '@/components/admin/SystemConfigSummary'
import SystemConfigModal from '@/components/admin/SystemConfigModal'
import ConfigModal, { FieldDef } from '@/components/admin/ConfigModal'

export default function AdminSettingsPage() {
  // Fields definition for the UI Customization modal (single hidden instance below)
  const uiFields: FieldDef[] = [
    { name: 'uiBrandName', label: 'Brand name', type: 'text', placeholder: 'Alto Delivery' },
    { name: 'uiThemeMode', label: 'Theme mode', type: 'select', options: [
      { label: 'System', value: 'SYSTEM' },
      { label: 'Light', value: 'LIGHT' },
      { label: 'Dark', value: 'DARK' },
    ] },
    { name: 'uiThemePrimary', label: 'Primary color', type: 'color' },
    { name: 'uiThemeAccent', label: 'Accent color', type: 'color' },
  { name: 'uiLogoLightUrl', label: 'Logo (light)', type: 'image', placeholder: '/logo.svg' },
  { name: 'uiLogoDarkUrl', label: 'Logo (dark)', type: 'image', placeholder: '/logo-white.svg' },
  { name: 'uiFaviconUrl', label: 'Favicon', type: 'image', placeholder: '/favicon.ico' },
    { name: 'uiLayoutDensity', label: 'Layout density', type: 'select', options: [
      { label: 'Comfortable', value: 'COMFORTABLE' },
      { label: 'Compact', value: 'COMPACT' },
    ] },
    { name: 'uiCustomCssEnabled', label: 'Custom CSS', type: 'toggle' },
    { name: 'uiCustomCss', label: 'Custom CSS content', type: 'textarea', placeholder: '/* .btn { border-radius: 8px } */', helpText: 'Be cautious—invalid CSS can affect layout.' },
  ]

  const settingSections = [
    {
      title: 'Platform Settings',
      description: 'Configure global platform settings and preferences.',
      icon: Settings,
      color: 'bg-blue-50 text-blue-700',
      iconBg: 'bg-blue-100',
      items: ['Application name', 'Default timezone', 'Currency settings', 'Language preferences']
    },
    {
      title: 'Database Configuration',
      description: 'Manage database connections and data retention policies.',
      icon: Database,
      color: 'bg-green-50 text-green-700',
      iconBg: 'bg-green-100',
  items: ['Connection status', 'Backup schedules', 'Data retention']
    },
    {
      title: 'Security Settings',
      description: 'Configure authentication, authorization, and security policies.',
      icon: Shield,
      color: 'bg-red-50 text-red-700',
      iconBg: 'bg-red-100',
      items: ['User permissions', 'API keys', 'Session management', 'Audit logs']
    },
    {
      title: 'API Configuration',
      description: 'Manage external API integrations and webhooks.',
      icon: Globe,
      color: 'bg-purple-50 text-purple-700',
      iconBg: 'bg-purple-100',
      items: ['Payment gateways', 'Email services', 'SMS providers', 'Webhook endpoints']
    },
    {
      title: 'UI Customization',
      description: 'Customize the look and feel of the application.',
      icon: Palette,
      color: 'bg-orange-50 text-orange-700',
      iconBg: 'bg-orange-100',
      items: ['Theme colors', 'Logo settings', 'Layout preferences', 'Custom CSS']
    },
    {
      title: 'Performance',
      description: 'Monitor and optimize application performance.',
      icon: Zap,
      color: 'bg-yellow-50 text-yellow-700',
      iconBg: 'bg-yellow-100',
      items: ['Cache settings', 'CDN configuration', 'Performance metrics', 'Optimization tools']
    }
  ]

  return (
    <div className="py-6 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
        <p className="text-gray-600">Configure global settings and manage system-wide preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingSections.map((section) => (
          <div key={section.title} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${section.iconBg}`}>
                <section.icon className={`w-6 h-6 ${section.color.split(' ')[1]}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{section.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {section.items.map((item, index) => {
                const isDbSection = section.title === 'Database Configuration'
                const isUiSection = section.title === 'UI Customization'
                const clickable = (isDbSection && item !== 'Connection status') || isUiSection
                const handleClick = () => {
                  if (isDbSection && item !== 'Connection status') {
                    if (typeof window !== 'undefined') window.dispatchEvent(new Event('open:db-configuration'))
                  } else if (isUiSection) {
                    if (typeof window !== 'undefined') window.dispatchEvent(new Event('open:ui-customization'))
                  }
                }
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg ${clickable ? 'bg-gray-50 hover:bg-gray-100 cursor-pointer' : 'bg-gray-50'}`}
                    onClick={clickable ? handleClick : undefined}
                  >
                    <span className="text-sm text-gray-700">{item}</span>
                    {isDbSection ? (
                      <div className="flex items-center gap-3">
                        {item === 'Connection status' && <DbConnectionStatus />}
                        {item === 'Backup schedules' && <SystemConfigSummary field="backupSchedule" />}
                        {item === 'Data retention' && <SystemConfigSummary field="dataRetentionDays" />}
                      </div>
                    ) : isUiSection ? (
                      <div className="flex items-center gap-3">
                        {item === 'Theme colors' && <SystemConfigSummary field="uiThemePrimary" />}
                        {item === 'Logo settings' && <SystemConfigSummary field="uiLogoLightUrl" />}
                        {item === 'Layout preferences' && <SystemConfigSummary field="uiLayoutDensity" />}
                        {item === 'Custom CSS' && <span className="text-xs text-gray-500">—</span>}
                      </div>
                    ) : (
                      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">Configure</button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Modals mounted once and opened via CustomEvent from row clicks */}
      <SystemConfigModal openEventName="open:db-configuration" />
      <ConfigModal
        title="UI Customization"
        description="Update theme, branding, and layout preferences."
        getUrl="/api/admin/settings/system-config"
        patchUrl="/api/admin/settings/system-config"
        eventName="settings:updated"
        fields={uiFields}
        openEventName="open:ui-customization"
        renderTrigger={false}
      />

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-sm transition-shadow">
            <h3 className="font-medium text-gray-900 mb-1">Backup Database</h3>
            <p className="text-sm text-gray-600">Create a manual backup of the database</p>
          </button>
          <button className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-sm transition-shadow">
            <h3 className="font-medium text-gray-900 mb-1">Clear Cache</h3>
            <p className="text-sm text-gray-600">Clear all application caches</p>
          </button>
          <button className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:shadow-sm transition-shadow">
            <h3 className="font-medium text-gray-900 mb-1">System Health Check</h3>
            <p className="text-sm text-gray-600">Run a comprehensive system health check</p>
          </button>
        </div>
      </div>
    </div>
  )
}
