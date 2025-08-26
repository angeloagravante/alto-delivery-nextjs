'use client'

import { useEffect, useState } from 'react'
import { RotateCw } from 'lucide-react'

type HealthResponse = {
  ok: boolean
  usersCount?: number
  error?: string
}

export default function DbConnectionStatus() {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')

  const check = async () => {
    try {
      setStatus('loading')
      const res = await fetch('/api/db/health', { cache: 'no-store' })
      const data: HealthResponse = await res.json()
  if (res.ok && data.ok) {
        setStatus('ok')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    check()
  }, [])

  const dotClass =
    status === 'loading'
      ? 'bg-gray-300'
      : status === 'ok'
      ? 'bg-green-500'
      : 'bg-red-500'

  const textClass =
    status === 'loading'
      ? 'text-gray-600'
      : status === 'ok'
      ? 'text-green-700'
      : 'text-red-700'

  const label = status === 'loading' ? 'Checking…' : status === 'ok' ? 'Connected' : 'Disconnected'

  return (
    <div className="flex items-center gap-3">
      <div className={`w-2.5 h-2.5 rounded-full ${dotClass}`} aria-hidden />
      <div className="flex flex-col items-end">
        {status !== 'loading' && (
            <span className={`text-xs font-medium ${textClass}`}>{label}</span>
        )}
      </div>
      <button
        onClick={check}
        className="ml-2 p-1.5 rounded border border-gray-100 hover:border-gray-300 text-gray-600 hover:text-gray-800 bg-white disabled:opacity-60"
        aria-label="Retry database connection check"
        title="Retry"
        disabled={status === 'loading'}
      >
        <RotateCw className={`w-4 h-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
      </button>
    </div>
  )
}
