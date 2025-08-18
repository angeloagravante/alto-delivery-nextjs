export default async function DashboardPage() {
  // Note: In production, this would use real Clerk authentication
  const demoUser = {
    firstName: "Demo",
    emailAddresses: [{ emailAddress: "demo@altodelivery.com" }]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-[#1E466A] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Alto Delivery</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {demoUser.firstName || demoUser.emailAddresses[0].emailAddress}</span>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[#1E466A] font-bold">
                {demoUser.firstName?.charAt(0) || "D"}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Dashboard
              </h2>
              <p className="text-gray-600 mb-8">
                Welcome to your Alto Delivery dashboard. Here you can manage your orders and deliveries.
              </p>
              
              {/* Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-[#1E466A] mb-2">
                    Active Orders
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Currently processing
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-[#1E466A] mb-2">
                    Completed Orders
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Successfully delivered
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <h3 className="text-lg font-semibold text-[#1E466A] mb-2">
                    Total Revenue
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">$0.00</p>
                  <p className="text-sm text-gray-600 mt-2">
                    This month
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-[#1E466A] text-white px-6 py-3 rounded-lg hover:bg-[#1E466A]/90 transition-colors">
                    Create New Order
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                    View All Orders
                  </button>
                  <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors">
                    Manage Profile
                  </button>
                </div>
              </div>
              
              <div className="mt-8 text-center text-xs text-gray-500">
                <p>
                  Note: This is a demo dashboard. In production, this would integrate with real user authentication and data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}