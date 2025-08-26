'use client'

import { useEffect, useState } from 'react'

type Config = {
  backupSchedule?: string | null
  dataRetentionDays?: number | null
  lastBackupAt?: string
  // UI customization
  uiThemePrimary?: string | null
  uiLogoLightUrl?: string | null
  uiLayoutDensity?: 'COMFORTABLE' | 'COMPACT' | null
}

type Field = 'backupSchedule' | 'dataRetentionDays' | 'uiThemePrimary' | 'uiLogoLightUrl' | 'uiLayoutDensity'

export default function SystemConfigSummary({ field }: { field: Field }) {
  const [cfg, setCfg] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/settings/system-config', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load config')
        const data = await res.json()
        setCfg(data)
        setError(null)
  } catch {
        setError('Unable to fetch')
      } finally {
        setLoading(false)
      }
    }
    run()
    const handler = () => run()
    if (typeof window !== 'undefined') window.addEventListener('system-config:updated', handler as EventListener)
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('system-config:updated', handler as EventListener)
    }
  }, [])

  if (loading) return <span className="text-xs text-gray-500">Loading…</span>
  if (error) return <span className="text-xs text-red-600">{error}</span>

  if (field === 'backupSchedule') {
    const text = cfg?.backupSchedule || 'Not set'
    return <span className="text-xs text-gray-700">{text}</span>
  }

  if (field === 'dataRetentionDays') {
    const days = cfg?.dataRetentionDays
    const text = typeof days === 'number' ? `${days} days` : 'Not set'
    return <span className="text-xs text-gray-700">{text}</span>
  }
  if (field === 'uiThemePrimary') {
    const color = cfg?.uiThemePrimary || '#1E466A'
    return (
      <span className="inline-flex items-center gap-2">
        <span className="inline-block w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: color }} aria-label="Primary color preview" />
        <span className="text-xs text-gray-700">{color}</span>
      </span>
    )
  }
  if (field === 'uiLogoLightUrl') {
    const url = cfg?.uiLogoLightUrl || '/logo.svg'
    return (
      <span className="inline-flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Logo preview" className="h-5 w-auto max-w-[120px] rounded bg-white border border-gray-200 p-0.5" />
      </span>
    )
  }
  if (field === 'uiLayoutDensity') {
    const density = cfg?.uiLayoutDensity
    const label = density === 'COMPACT' ? 'Compact' : density === 'COMFORTABLE' ? 'Comfortable' : 'Not set'
    return (
      <span className={`text-xs ${density ? 'text-gray-700' : 'text-gray-500'}`}>{label}</span>
    )
  }
  return <span className="text-xs text-gray-500">-</span>
}
