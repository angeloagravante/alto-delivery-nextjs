'use client'

export default function AdminStoreActions({ storeId, isApproved, isActive }: { storeId: string; isApproved: boolean; isActive: boolean }) {
  const act = async (action: 'approve'|'disable'|'enable') => {
    const res = await fetch('/api/admin/stores', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ storeId, action }) })
    if (!res.ok) alert('Action failed')
    else location.reload()
  }
  return (
    <div className="flex gap-2">
      <button className="px-2 py-1 rounded border hover:bg-gray-50" disabled={isApproved} onClick={() => act('approve')}>Approve</button>
      {isActive ? (
        <button className="px-2 py-1 rounded border hover:bg-gray-50" onClick={() => act('disable')}>Disable</button>
      ) : (
        <button className="px-2 py-1 rounded border hover:bg-gray-50" onClick={() => act('enable')}>Enable</button>
      )}
    </div>
  )
}
