import { headers } from 'next/headers'

type Store = {
  id: string
  name: string
  description: string | null
  logoUrl: string | null
  storeType: string
  village: string
  phaseNumber: string
  blockNumber: string
  lotNumber: string
}

async function getBaseUrlFromHeaders() {
  // In SSR, always provide an absolute base URL for fetch
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'http'
  if (host) return `${proto}://${host}`
  return process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
}

async function getStores(): Promise<Store[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL.trim().length > 0
    ? process.env.NEXT_PUBLIC_BASE_URL
    : await getBaseUrlFromHeaders()
  const res = await fetch(`${base}/api/stores?public=1`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export default async function CustomerHomePage() {
  const stores = await getStores()
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#1E466A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Discover Local Stores
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Browse through our collection of local businesses and get your favorite items delivered fast
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for stores, food, or items..."
                  className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-colors"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/80">{stores.length} stores available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/80">15-30 min delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-white/80">Free delivery available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stores Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {stores.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No stores available</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              We&apos;re working hard to bring local stores to your area. Check back soon!
            </p>
            <button className="bg-[#1E466A] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1E466A]/90 transition-colors">
              Get notified when stores arrive
            </button>
          </div>
        ) : (
          <>
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Available Stores</h2>
                <p className="text-gray-600">{stores.length} store{stores.length !== 1 ? 's' : ''} in your area</p>
              </div>
              <div className="flex items-center gap-3">
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A]">
                  <option>All Categories</option>
                  <option>Food & Beverages</option>
                  <option>Grocery</option>
                  <option>Pharmacy</option>
                </select>
                <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E466A] focus:border-[#1E466A]">
                  <option>Sort by</option>
                  <option>Nearest</option>
                  <option>Rating</option>
                  <option>Delivery time</option>
                </select>
              </div>
            </div>

            {/* Store Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
                >
                  <div className="aspect-[16/9] bg-gray-100 overflow-hidden relative">
                    {s.logoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={s.logoUrl} 
                        alt={s.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <div className="w-12 h-12 bg-[#1E466A]/10 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-[#1E466A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Open
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#1E466A] transition-colors">
                        {s.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-600">4.8</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">
                      {s.description ?? `Quality ${s.storeType.toLowerCase()} with fast delivery`}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>
                        {`${s.village}, Phase ${s.phaseNumber}, Block ${s.blockNumber}`}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        15-30 min
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 1v22" />
                          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                        </svg>
                        ₱0 delivery
                      </span>
                    </div>
                    
                    <button
                      className="w-full bg-[#1E466A] hover:bg-[#1E466A]/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                      type="button"
                    >
                      Browse Menu
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
