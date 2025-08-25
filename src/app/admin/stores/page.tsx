export const dynamic = 'force-dynamic'
import { cookies } from 'next/headers'
import AdminStoreActions from '@/components/admin/AdminStoreActions'

function getBaseUrl() {
  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return base.replace(/\/$/, '')
}

async function fetchStores() {
  const base = getBaseUrl()
  const cookieHeader = cookies().toString()
  const res = await fetch(`${base}/api/admin/stores`, { cache: 'no-store', headers: { cookie: cookieHeader } })
  if (!res.ok) throw new Error('Failed to load stores')
  return res.json() as Promise<Array<{ id: string; name: string; isActive?: boolean; isApproved?: boolean; user?: { id: string; name?: string | null; email: string } }>>
}

export default async function AdminStoresPage() {
  const stores = await fetchStores()
  return (
    <div className="p-6 text-gray-900">
      <h1 className="text-2xl font-semibold mb-2">Store management</h1>
      <p className="text-gray-700 mb-6">System-wide configuration for stores.</p>
      <div className="rounded-xl border bg-white p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-700">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Owner</th>
                <th className="py-2 pr-4">Approved</th>
                <th className="py-2 pr-4">Active</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(s => (
                <tr className="border-t text-gray-900" key={s.id}>
                  <td className="py-2 pr-4">{s.name}</td>
                  <td className="py-2 pr-4">{s.user?.name ?? s.user?.email ?? '—'}</td>
                  <td className="py-2 pr-4">{s.isApproved ? 'Yes' : 'No'}</td>
                  <td className="py-2 pr-4">{s.isActive ? 'Yes' : 'No'}</td>
                  <td className="py-2 pr-4"><AdminStoreActions storeId={s.id} isApproved={!!s.isApproved} isActive={!!s.isActive} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
