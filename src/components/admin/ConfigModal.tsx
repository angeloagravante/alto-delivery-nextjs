'use client'

import { useEffect, useMemo, useState } from 'react'
import { uploadFiles } from '@/lib/uploadthing'

export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'toggle' | 'color' | 'image'

export type FieldOption = { label: string; value: string | number }

export type FieldDef = {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
  options?: FieldOption[] // for select
  helpText?: string
}

type Props = {
  title: string
  description?: string
  getUrl: string
  patchUrl: string
  fields: FieldDef[]
  triggerLabel?: string
  triggerClassName?: string
  eventName?: string // CustomEvent name to dispatch on save (e.g., 'settings:updated')
  eventDetail?: unknown // Optional detail to include with CustomEvent
  onSaved?: () => void
  openEventName?: string // If provided, modal opens when this CustomEvent is dispatched
  renderTrigger?: boolean // If false, do not render the trigger button
}

export default function ConfigModal({
  title,
  description,
  getUrl,
  patchUrl,
  fields,
  triggerLabel = 'Configure',
  triggerClassName = 'text-xs text-blue-600 hover:text-blue-800 font-medium',
  eventName = 'settings:updated',
  eventDetail,
  onSaved,
  openEventName,
  renderTrigger = true,
}: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadingField, setUploadingField] = useState<string | null>(null)

  // internal form state as a string map (we'll parse on save by field type)
  const [form, setForm] = useState<Record<string, string>>({})

  const placeholders = useMemo(
    () => Object.fromEntries(fields.map(f => [f.name, f.placeholder ?? ''])),
    [fields]
  )

  const load = async () => {
    try {
      setLoading(true)
      const res = await fetch(getUrl, { cache: 'no-store' })
      if (!res.ok) throw new Error('Load failed')
      const data = await res.json()
      const next: Record<string, string> = {}
      fields.forEach(f => {
        const v = data?.[f.name]
        if (v === null || v === undefined) {
          next[f.name] = ''
        } else if (typeof v === 'boolean') {
          next[f.name] = v ? 'true' : 'false'
        } else {
          next[f.name] = String(v)
        }
      })
      setForm(next)
      setError(null)
    } catch {
      setError('Unable to load settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      load()
      // lock background scroll
      const prevOverflow = document.documentElement.style.overflow
      document.documentElement.style.overflow = 'hidden'
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false)
      }
      window.addEventListener('keydown', onKey)
      return () => {
        document.documentElement.style.overflow = prevOverflow
        window.removeEventListener('keydown', onKey)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Support external open via CustomEvent
  useEffect(() => {
    if (!openEventName) return
    const handler = () => setOpen(true)
    if (typeof window !== 'undefined') window.addEventListener(openEventName, handler as EventListener)
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener(openEventName, handler as EventListener)
    }
  }, [openEventName])

  const setField = (name: string, value: string) => setForm(prev => ({ ...prev, [name]: value }))

  const parseForType = (type: FieldType, raw: string) => {
    if (raw === '') return null
    switch (type) {
      case 'number':
        return Number(raw)
      case 'toggle':
        return raw === 'true'
      default:
        return raw
    }
  }

  const save = async () => {
    try {
      setSaving(true)
      setError(null)
      const payload: Record<string, unknown> = {}
      for (const f of fields) {
        payload[f.name] = parseForType(f.type, form[f.name] ?? '')
      }
      const res = await fetch(patchUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Save failed')
      if (typeof window !== 'undefined' && eventName) {
        window.dispatchEvent(new CustomEvent(eventName, { detail: eventDetail }))
      }
      onSaved?.()
      setOpen(false)
    } catch {
      setError('Unable to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (fieldName: string, file: File) => {
    try {
      setUploadingField(fieldName)
      const res = await uploadFiles('storeLogo', { files: [file] })
      const url = res?.[0]?.ufsUrl || res?.[0]?.url
      if (url) setField(fieldName, url)
    } catch {
      setError('Upload failed')
    } finally {
      setUploadingField(null)
    }
  }

  return (
    <div className="inline">
      {renderTrigger && (
        <button type="button" className={triggerClassName} onClick={() => setOpen(true)}>
          {triggerLabel}
        </button>
      )}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" onClick={() => !saving && setOpen(false)} />
          {/* Dialog */}
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-[101] bg-white rounded-xl shadow-lg border border-gray-200 w-full max-w-2xl p-6 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">
              {loading ? (
                <p className="text-sm text-gray-600">Loading…</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fields.map((f) => (
                    <div key={f.name} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {f.label}
                      </label>
                      {f.type === 'text' && (
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          placeholder={placeholders[f.name]}
                          value={form[f.name] ?? ''}
                          onChange={(e) => setField(f.name, e.target.value)}
                        />
                      )}
                      {f.type === 'image' && (
                        <div className="space-y-2">
                          {form[f.name] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={form[f.name]} alt={f.label} className="h-12 w-auto rounded border border-gray-200 bg-white" />
                          ) : (
                            <div className="h-12 w-full max-w-[200px] flex items-center justify-center rounded border border-dashed border-gray-300 text-xs text-gray-500">
                              No image selected
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                              placeholder={placeholders[f.name]}
                              value={form[f.name] ?? ''}
                              onChange={(e) => setField(f.name, e.target.value)}
                            />
                            <label className="inline-flex items-center">
                              <span className="px-3 py-2 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50 cursor-pointer disabled:opacity-60">
                                {uploadingField === f.name ? 'Uploading…' : 'Upload'}
                              </span>
                              <input
                                type="file"
                                accept="image/*,.ico"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) void handleUpload(f.name, file)
                                  // reset input so same file can be selected again if needed
                                  e.currentTarget.value = ''
                                }}
                                disabled={!!uploadingField}
                              />
                            </label>
                          </div>
                        </div>
                      )}
                      {f.type === 'textarea' && (
                        <textarea
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          placeholder={placeholders[f.name]}
                          value={form[f.name] ?? ''}
                          onChange={(e) => setField(f.name, e.target.value)}
                          rows={6}
                        />
                      )}
                      {f.type === 'number' && (
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          placeholder={placeholders[f.name]}
                          value={form[f.name] ?? ''}
                          onChange={(e) => setField(f.name, e.target.value)}
                          min={f.min}
                          max={f.max}
                          step={f.step}
                        />
                      )}
                      {f.type === 'select' && (
                        <select
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          value={form[f.name] ?? ''}
                          onChange={(e) => setField(f.name, e.target.value)}
                        >
                          <option value="">Select…</option>
                          {(f.options ?? []).map((opt) => (
                            <option key={String(opt.value)} value={String(opt.value)}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {f.type === 'toggle' && (
                        <label className="inline-flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={(form[f.name] ?? 'false') === 'true'}
                            onChange={(e) => setField(f.name, e.target.checked ? 'true' : 'false')}
                          />
                          <span>Enabled</span>
                        </label>
                      )}
                      {f.type === 'color' && (
                        <input
                          type="color"
                          className="h-9 w-16 border border-gray-300 rounded"
                          value={form[f.name] || '#000000'}
                          onChange={(e) => setField(f.name, e.target.value)}
                          aria-label={`${f.label} color`}
                        />
                      )}
                      {f.helpText && <p className="text-xs text-gray-500 mt-1">{f.helpText}</p>}
                    </div>
                  ))}
                </div>
              )}
              {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
            </div>
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
