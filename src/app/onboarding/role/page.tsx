'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Role = 'CUSTOMER' | 'OWNER' | 'ADMIN'

export default function RoleOnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<Role | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/user/role', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load role')
        const data = await res.json()
        if (cancelled) return
        setRole(data.role)
        // If already onboarded, route immediately and skip showing page
        if (data.onboarded) {
          if (data.role === 'ADMIN') router.replace('/admin')
          if (data.role === 'OWNER') router.replace('/dashboard')
          else router.replace('/customer')
          return
        }
  } catch {
        setError('Unable to load your profile. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [router])

  const save = async (nextRole: Exclude<Role, 'ADMIN'>) => {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: nextRole }),
      })
      if (!res.ok) throw new Error('Failed to save')
      if (nextRole === 'OWNER') router.replace('/dashboard')
      else router.replace('/customer')
  } catch {
      setError('Unable to save your role. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="text-gray-600">Loading…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white border rounded-2xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-2">Tell us who you are</h1>
        <p className="text-gray-600 mb-6">Choose how you want to use Alto. You can change this later.</p>
        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">{error}</div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => save('CUSTOMER')}
            disabled={saving}
            className="rounded-xl border p-5 text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
          >
            <div className="font-semibold mb-1">Customer</div>
            <div className="text-sm text-gray-600">Order from nearby stores and track your deliveries.</div>
          </button>
          <button
            onClick={() => save('OWNER')}
            disabled={saving}
            className="rounded-xl border p-5 text-left hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
          >
            <div className="font-semibold mb-1">Store owner</div>
            <div className="text-sm text-gray-600">Manage products, orders, and your storefront.</div>
          </button>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          Current: <span className="font-medium">{role ?? 'Unknown'}</span>
        </div>
      </div>
    </div>
  )
}
