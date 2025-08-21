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
        {/* Mobile overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <DashboardSidebar 
          displayFirstName={displayFirstName} 
          showUserButton={showUserButton}
          onStoreChange={handleStoreChange}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        {/* Mobile menu button */}
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-[#1E466A] text-white rounded-md shadow-lg lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Main Content Area */}
        <div className="ml-0 lg:ml-64 transition-all duration-300 ease-in-out">
          {/* Header */}
          <DashboardHeader 
            displayFirstName={displayFirstName} 
            showUserButton={showUserButton}
          />
          
          {/* Main Content */}
          <main className="py-6 px-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </StoreContext.Provider>
  )
}
