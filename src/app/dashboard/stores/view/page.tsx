'use client'

import StoreManagement from '@/components/dashboard/StoreManagement'
import { useStore } from '@/components/dashboard/DashboardWrapper'

export default function ViewStoresPage() {
  const { setCurrentStore, refreshStores } = useStore()

  const handleStoreChange = () => {
    // Force refresh of store context when stores change
    setCurrentStore(null)
    refreshStores() // Notify other components to refresh
  }

  return (
    <div className="p-6">
      <StoreManagement onStoreChange={handleStoreChange} initialMode="view" />
    </div>
  )
}
