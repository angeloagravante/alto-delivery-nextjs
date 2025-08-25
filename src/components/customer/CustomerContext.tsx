'use client'

import { createContext, useContext, useMemo, useState } from 'react'

type CartItem = {
  id: string
  name: string
  price: number
  qty: number
}

type CustomerState = {
  location: string | null
  setLocation: (loc: string | null) => void
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  count: number
}

const Ctx = createContext<CustomerState | null>(null)

export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])

  const value = useMemo<CustomerState>(() => ({
    location,
    setLocation,
    cart,
    addToCart: (item) => setCart(prev => {
      const existing = prev.find(p => p.id === item.id)
      if (existing) {
        return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + item.qty } : p)
      }
      return [...prev, item]
    }),
    removeFromCart: (id) => setCart(prev => prev.filter(p => p.id !== id)),
    count: cart.reduce((n, it) => n + it.qty, 0)
  }), [location, cart])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCustomer() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCustomer must be used within CustomerProvider')
  return ctx
}
