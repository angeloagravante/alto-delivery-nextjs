export interface Store {
  id: string
  name: string
  description?: string
  logoUrl?: string
  storeType: string
  village: string
  phaseNumber: string
  blockNumber: string
  lotNumber: string
  isActive: boolean
  isApproved: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateStoreData {
  name: string
  description?: string
  logoUrl?: string
  storeType: string
  village: string
  phaseNumber: string
  blockNumber: string
  lotNumber: string
}

export interface UpdateStoreData {
  name?: string
  description?: string
  logoUrl?: string
  storeType?: string
  village?: string
  phaseNumber?: string
  blockNumber?: string
  lotNumber?: string
}
