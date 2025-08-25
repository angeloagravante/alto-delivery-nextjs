export default function AdminIndex() {
  return (
    <div className="p-6 text-gray-900">
      <h1 className="text-2xl font-semibold mb-2">Admin overview</h1>
      <p className="text-gray-700 mb-6">Welcome. Pick a section from the sidebar.</p>
      <div className="grid gap-4 md:grid-cols-3">
        <a href="/admin/stores" className="rounded-xl border bg-white p-4 hover:shadow-sm transition">
          <h2 className="font-medium mb-1 text-gray-900">Stores</h2>
          <p className="text-sm text-gray-700">Manage application-wide stores.</p>
        </a>
        <a href="/admin/users" className="rounded-xl border bg-white p-4 hover:shadow-sm transition">
          <h2 className="font-medium mb-1 text-gray-900">Users</h2>
          <p className="text-sm text-gray-700">Manage users and roles.</p>
        </a>
        <a href="/admin/settings" className="rounded-xl border bg-white p-4 hover:shadow-sm transition">
          <h2 className="font-medium mb-1 text-gray-900">Settings</h2>
          <p className="text-sm text-gray-700">Configure global settings.</p>
        </a>
      </div>
    </div>
  )
}
