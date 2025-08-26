'use client'

import { useEffect, useState } from 'react'

type Config = {
  backupSchedule?: string | null
  dataRetentionDays?: number | null
  lastBackupAt?: string
}

export default function SystemConfigSummary({ field }: { field: 'backupSchedule' | 'dataRetentionDays' }) {
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
  return <span className="text-xs text-gray-500">-</span>
}
