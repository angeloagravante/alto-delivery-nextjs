'use client'

import { useState, createContext, useContext } from 'react'
import { Store } from '@/types/store'
import DashboardSidebar from './DashboardSidebar'
import DashboardHeader from './DashboardHeader'

interface StoreContextType {
  currentStore: Store | null
  setCurrentStore: (store: Store | null) => void
  refreshStores: () => void
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleStoreChange = (store: Store | null) => {
    setCurrentStore(store)
    // You can add additional logic here like updating context, localStorage, etc.
    if (currentStore !== store) {
      console.log('Current store changed to:', store?.name || 'None')
      console.log('Store ID:', store?.id || 'None')
    }
  }

  const refreshStores = () => {
    // This will trigger a refresh in components that use the store context
    console.log('Refreshing stores...')
    // Force a re-render by updating the current store
    setCurrentStore(prev => prev ? { ...prev } : null)
  }

  return (
    <StoreContext.Provider value={{ currentStore, setCurrentStore, refreshStores }}>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile overlay - transparent for content visibility */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <DashboardSidebar 
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        {/* Main Content Area */}
        <div className="ml-0 lg:ml-64 transition-all duration-300 ease-in-out">
          {/* Header */}
          <DashboardHeader 
            displayFirstName={displayFirstName} 
            showUserButton={showUserButton}
            onStoreChange={handleStoreChange}
            onBurgerClick={() => setIsSidebarOpen(true)}
          />
          
          {/* Main Content */}
          <main className="relative z-0">
            <div>
              {children}
            </div>
          </main>
        </div>
      </div>
    </StoreContext.Provider>
  )
}
