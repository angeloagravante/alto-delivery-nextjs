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
  <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-gray-900">
      <section className="mb-6">
    <h1 className="text-2xl font-semibold">Discover Stores</h1>
    <p className="text-gray-700">Browse nearby stores and start your order.</p>
      </section>

      {stores.length === 0 ? (
    <p className="text-gray-700">No stores available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((s) => (
            <div
              key={s.id}
              className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-[16/9] bg-gray-100 rounded-lg mb-3 overflow-hidden">
                {s.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.logoUrl} alt={s.name} className="w-full h-full object-cover" />
                ) : null}
              </div>
              <h3 className="font-medium text-gray-900">{s.name}</h3>
              <p className="text-sm text-gray-700">
                {s.description ?? `${s.storeType}`}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {`${s.village} • Phase ${s.phaseNumber} • Blk ${s.blockNumber} • Lot ${s.lotNumber}`}
              </p>
              <button
                className="mt-3 text-sm text-orange-600 font-medium hover:text-orange-700"
                type="button"
              >
                View menu
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
