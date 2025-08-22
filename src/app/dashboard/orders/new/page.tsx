export default function NewOrdersPage() {
  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Orders</h1>
        <p className="text-gray-600 mt-2">Create and manage new customer orders</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center py-12">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Order</h3>
          <p className="text-gray-500 mb-6">This page is under development. Coming soon with order creation functionality.</p>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Order form and customer selection</p>
            <p>• Product selection and quantities</p>
            <p>• Order validation and confirmation</p>
            <p>• Payment processing integration</p>
          </div>
        </div>
      </div>
    </div>
  )
}
