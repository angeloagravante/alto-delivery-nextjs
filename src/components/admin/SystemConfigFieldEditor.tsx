'use client'

import { useEffect, useMemo, useState } from 'react'

type Field = 'backupSchedule' | 'dataRetentionDays' | 'migrationStatus'

export default function SystemConfigFieldEditor({ field }: { field: Field }) {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [value, setValue] = useState<string>('')

  // sensible placeholders per field
  const placeholder = useMemo(() => {
    if (field === 'backupSchedule') return 'e.g. 0 2 * * * (daily at 2am)'
    if (field === 'dataRetentionDays') return 'e.g. 30'
    return ''
  }, [field])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/admin/settings/system-config', { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (cancelled) return
        if (field === 'backupSchedule') setValue(data?.backupSchedule ?? '')
        else if (field === 'dataRetentionDays') setValue(typeof data?.dataRetentionDays === 'number' ? String(data.dataRetentionDays) : '')
        else if (field === 'migrationStatus') setValue(data?.migrationStatus ?? 'IDLE')
      } catch {
        // no-op initial load
      }
    }
    if (open) load()
    return () => { cancelled = true }
  }, [open, field])

  const save = async () => {
    try {
      setSaving(true)
      setError(null)
      const payload: Record<string, unknown> = {}
      if (field === 'backupSchedule') payload.backupSchedule = value || null
      else if (field === 'dataRetentionDays') payload.dataRetentionDays = value ? Number(value) : null
      else if (field === 'migrationStatus') payload.migrationStatus = value || 'IDLE'

      const res = await fetch('/api/admin/settings/system-config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Save failed')
      // Notify other components to refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('system-config:updated'))
      }
      setOpen(false)
  } catch {
      setError('Unable to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      {!open && (
        <button
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          onClick={() => setOpen(true)}
        >
          Edit
        </button>
      )}
      {open && (
        <div className="flex items-center gap-2">
          {field === 'migrationStatus' ? (
            <select
              className="text-xs border border-gray-300 rounded px-2 py-1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            >
              <option value="IDLE">IDLE</option>
              <option value="RUNNING">RUNNING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="FAILED">FAILED</option>
            </select>
          ) : (
            <input
              type={field === 'dataRetentionDays' ? 'number' : 'text'}
              min={0}
              className="text-xs border border-gray-300 rounded px-2 py-1 w-40"
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          )}
          <button
            className="text-xs px-2 py-1 rounded bg-blue-600 text-white disabled:opacity-60"
            onClick={save}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            className="text-xs px-2 py-1 rounded border border-gray-200"
            onClick={() => setOpen(false)}
            disabled={saving}
          >
            Cancel
          </button>
          {error && <span className="text-[11px] text-red-600">{error}</span>}
        </div>
      )}
    </div>
  )
}
