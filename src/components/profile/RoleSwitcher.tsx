'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Role = 'CUSTOMER' | 'OWNER' | 'ADMIN'

export default function RoleSwitcher() {
  const router = useRouter()
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/user/role', { cache: 'no-store' })
        const data = await res.json()
        if (!cancelled) setRole(data.role as Role)
      } catch {
        if (!cancelled) setError('Unable to load role')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const switchTo = async (nextRole: Exclude<Role, 'ADMIN'>) => {
    if (role === 'ADMIN') return
    if (role === nextRole) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      })
      if (!res.ok) throw new Error('failed')
      // Route accordingly
      router.replace(nextRole === 'OWNER' ? '/dashboard' : '/customer')
    } catch {
      setError('Unable to save role. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Loading role…</p>
  }

  if (role === 'ADMIN') {
    return <p className="text-sm text-gray-600">Administrator (locked)</p>
  }

  return (
    <div className="space-y-2">
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
      <div className="inline-flex rounded-lg border p-1 bg-gray-50">
        <button
          type="button"
          onClick={() => switchTo('CUSTOMER')}
          disabled={saving}
          className={`px-3 py-1.5 text-sm rounded-md ${role === 'CUSTOMER' ? 'bg-white shadow-sm border' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Customer
        </button>
        <button
          type="button"
          onClick={() => switchTo('OWNER')}
          disabled={saving}
          className={`px-3 py-1.5 text-sm rounded-md ${role === 'OWNER' ? 'bg-white shadow-sm border' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Store owner
        </button>
      </div>
      <p className="text-xs text-gray-500">Switching updates your default landing page.</p>
    </div>
  )
}
