'use client'

import { useState, createContext, useContext } from 'react'
import { Store } from '@/types/store'
import DashboardHeader from './DashboardHeader'

interface StoreContextType {
  currentStore: Store | null
  setCurrentStore: (store: Store | null) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export const useStore = () => {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within a DashboardWrapper')
  }
  return context
}

interface DashboardWrapperProps {
  children: React.ReactNode
  displayFirstName: string
  showUserButton: boolean
}

export default function DashboardWrapper({ children, displayFirstName, showUserButton }: DashboardWrapperProps) {
  const [currentStore, setCurrentStore] = useState<Store | null>(null)

  const handleStoreChange = (store: Store | null) => {
    setCurrentStore(store)
    // You can add additional logic here like updating context, localStorage, etc.
    if (currentStore !== store) {
      console.log('Current store changed to:', store?.name || 'None')
    }
  }

  return (
    <StoreContext.Provider value={{ currentStore, setCurrentStore }}>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader 
          displayFirstName={displayFirstName} 
          showUserButton={showUserButton}
          onStoreChange={handleStoreChange}
        />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </StoreContext.Provider>
  )
}
