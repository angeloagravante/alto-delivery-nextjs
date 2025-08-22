export default function CustomersPage() {
  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-2">Manage customer information and relationships</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Management</h3>
          <p className="text-gray-500 mb-6">This page is under development. Coming soon with comprehensive customer management.</p>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• View customer profiles</p>
            <p>• Customer order history</p>
            <p>• Customer analytics</p>
            <p>• Customer support tools</p>
          </div>
        </div>
      </div>
    </div>
  )
}
