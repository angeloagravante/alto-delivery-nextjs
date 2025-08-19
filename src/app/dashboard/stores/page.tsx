'use client'

import StoreManagement from '@/components/dashboard/StoreManagement'

export default function StoresPage() {
  return (
    <div className="p-6">
      <StoreManagement onStoreChange={() => {}} />
    </div>
  )
}
