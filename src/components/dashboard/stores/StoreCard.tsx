'use client'

import Image from 'next/image'
import { Store } from '@/types/store'

interface StoreCardProps {
  store: Store
  onViewDetails: (store: Store) => void
}

export default function StoreCard({ store, onViewDetails }: StoreCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col min-h-[320px]">
      {/* Header Section */}
      <div className="text-center mb-6">
        {/* Logo/Icon */}
        {store.logoUrl ? (
          <div className="w-16 h-16 mx-auto mb-3">
            <Image 
              src={store.logoUrl} 
              alt={`${store.name} logo`}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover mx-auto"
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement
                // hide image container if it errors; fallback to default avatar below
                target.style.display = 'none'
              }}
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        )}
        
        {/* Business Name */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">{store.name}</h3>
        
        {/* Owner Name - Using store type as placeholder since we don't have owner */}
        <p className="text-sm text-gray-600">{store.storeType}</p>
      </div>

      {/* Statistics Section */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex-1 text-center border-r border-gray-200">
          <div className="text-2xl font-bold text-[#1E466A]">0</div>
          <div className="text-sm text-gray-600">Total Product</div>
        </div>
        <div className="flex-1 text-center">
          <div className="text-2xl font-bold text-[#1E466A]">0</div>
          <div className="text-sm text-gray-600">Total Sales</div>
        </div>
      </div>

      {/* Address Information - Flexible height */}
      <div className="mb-6 flex-1">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="leading-relaxed line-clamp-3">
            {store.village}
            {store.phaseNumber && `, Phase ${store.phaseNumber}`}
            {store.blockNumber && `, Block ${store.blockNumber}`}
            {store.lotNumber && `, Lot ${store.lotNumber}`}
          </span>
        </div>
      </div>

      {/* Action Button - Always at bottom */}
      <div className="text-center">
        <button
          onClick={() => onViewDetails(store)}
          className="px-4 py-2 bg-[#1E466A] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors w-full"
        >
          View Details
        </button>
      </div>
    </div>
  )
}
