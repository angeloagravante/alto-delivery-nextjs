export const dynamic = 'force-dynamic'

function getBaseUrl() {
  const base = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return base.replace(/\/$/, '')
}

async function fetchUsers() {
  const base = getBaseUrl()
  const { cookies } = await import('next/headers')
  const cookieHeader = cookies().toString()
  const res = await fetch(`${base}/api/admin/users`, { cache: 'no-store', headers: { cookie: cookieHeader } })
  if (!res.ok) throw new Error('Failed to load users')
  return res.json() as Promise<Array<{ id: string; name?: string; email: string; role?: 'ADMIN'|'OWNER'|'CUSTOMER'; onboarded?: boolean }>>
}

export default async function AdminUsersPage() {
  const users = await fetchUsers()
  return (
    <div className="p-6 text-gray-900">
      <h1 className="text-2xl font-semibold mb-2">User management</h1>
      <p className="text-gray-700 mb-6">Manage users and roles.</p>
      <div className="rounded-xl border bg-white p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-700">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr className="border-t text-gray-900" key={u.id}>
                  <td className="py-2 pr-4">{u.name ?? '—'}</td>
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">{u.role ?? 'CUSTOMER'}</td>
                  <td className="py-2 pr-4">
                    <AdminUserActions userId={u.id} role={u.role ?? 'CUSTOMER'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
import AdminUserActions from '@/components/admin/AdminUserActions'
