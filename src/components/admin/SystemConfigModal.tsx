'use client'

import { useEffect, useState } from 'react'

type Config = {
  backupSchedule?: string | null
  dataRetentionDays?: number | null
}

export default function SystemConfigModal({ openEventName }: { openEventName?: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [backupSchedule, setBackupSchedule] = useState('')
  const [dataRetentionDays, setDataRetentionDays] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/settings/system-config', { cache: 'no-store' })
      if (!res.ok) throw new Error('Load failed')
      const data: Config = await res.json()
      setBackupSchedule(data.backupSchedule ?? '')
      setDataRetentionDays(typeof data.dataRetentionDays === 'number' ? String(data.dataRetentionDays) : '')
      setError(null)
    } catch {
      setError('Unable to load configuration')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) load()
  }, [open])

  useEffect(() => {
    if (!openEventName) return
    const handler = () => setOpen(true)
    if (typeof window !== 'undefined') window.addEventListener(openEventName, handler as EventListener)
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener(openEventName, handler as EventListener)
    }
  }, [openEventName])

  const save = async () => {
    try {
      setSaving(true)
      setError(null)
      const payload: Record<string, unknown> = {
        backupSchedule: backupSchedule || null,
        dataRetentionDays: dataRetentionDays ? Number(dataRetentionDays) : null,
      }
      const res = await fetch('/api/admin/settings/system-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Save failed')
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('system-config:updated'))
      setOpen(false)
    } catch {
      setError('Unable to save configuration')
    } finally {
      setSaving(false)
    }
  }

  return (
  <div className="inline">
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20" onClick={() => !saving && setOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Configuration</h3>
            {loading ? (
              <p className="text-sm text-gray-600">Loading…</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Backup schedule</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="e.g. 0 2 * * * (daily at 2am)"
                    value={backupSchedule}
                    onChange={(e) => setBackupSchedule(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Accepts a CRON-like expression or a simple label.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data retention (days)</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="e.g. 30"
                    value={dataRetentionDays}
                    onChange={(e) => setDataRetentionDays(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button className="text-sm px-3 py-2 border border-gray-200 rounded" onClick={() => setOpen(false)} disabled={saving}>
                Cancel
              </button>
              <button className="text-sm px-3 py-2 rounded bg-blue-600 text-white disabled:opacity-60" onClick={save} disabled={saving || loading}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
