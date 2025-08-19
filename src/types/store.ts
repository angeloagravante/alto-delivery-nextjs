export interface Store {
  id: string
  name: string
  description?: string
  logoUrl?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateStoreData {
  name: string
  description?: string
  logoUrl?: string
}

export interface UpdateStoreData {
  name?: string
  description?: string
  logoUrl?: string
}
