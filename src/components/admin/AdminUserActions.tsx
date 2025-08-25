'use client'

export default function AdminUserActions({ userId, role }: { userId: string; role: 'CUSTOMER'|'OWNER'|'ADMIN' }) {
  const change = async (next: 'CUSTOMER'|'OWNER') => {
    const res = await fetch('/api/admin/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, role: next }) })
    if (!res.ok) alert('Failed to update role')
    else location.reload()
  }
  const disabled = role === 'ADMIN'
  return (
    <div className="flex gap-2">
      <button className="px-2 py-1 rounded border hover:bg-gray-50" disabled={disabled || role==='CUSTOMER'} onClick={() => change('CUSTOMER')}>Set CUSTOMER</button>
      <button className="px-2 py-1 rounded border hover:bg-gray-50" disabled={disabled || role==='OWNER'} onClick={() => change('OWNER')}>Set OWNER</button>
    </div>
  )
}
