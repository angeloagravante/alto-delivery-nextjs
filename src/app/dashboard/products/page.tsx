'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProductsPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the view page by default
    router.replace('/dashboard/products/view')
  }, [router])

  return (
    <div className="space-y-6 px-4">
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E466A] mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to products...</p>
      </div>
    </div>
  )
}


