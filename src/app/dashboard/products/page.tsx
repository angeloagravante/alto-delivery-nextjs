export default function ProductsPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Products</h2>
        <p className="text-gray-600 mb-6">Manage your product catalog here.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="h-32 bg-gray-100 rounded mb-3" />
              <div className="font-semibold text-gray-900">Sample Product {i}</div>
              <div className="text-sm text-gray-500">Short description goes here.</div>
              <div className="mt-3 flex items-center gap-2">
                <button className="px-3 py-1 rounded bg-[#1E466A] text-white text-sm">Edit</button>
                <button className="px-3 py-1 rounded border border-gray-300 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


