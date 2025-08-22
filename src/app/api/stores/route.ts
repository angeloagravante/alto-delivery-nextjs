import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { CreateStoreData } from '@/types/store'

export async function GET() {
  try {
    const { userId } = await auth()
    console.log('GET /api/stores - Auth userId:', userId)
    
    if (!userId) {
      console.log('GET /api/stores - No userId from auth')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First find the user by clerkId
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })
    console.log('GET /api/stores - User lookup result:', user ? 'found' : 'not found')

    // If user doesn't exist, create them (fallback for when webhook isn't configured)
    if (!user) {
      try {
        console.log('GET /api/stores - Creating new user for clerkId:', userId)
        // Create user in database with basic info
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email: `user-${userId}@temp.com`, // Temporary email, will be updated by webhook
            name: 'User', // Temporary name, will be updated by webhook
          }
        })
        console.log('GET /api/stores - Successfully created user:', user.id)
      } catch (error) {
        console.error('GET /api/stores - Error creating user:', error)
        // Check if it's a MongoDB replica set error
        if (error instanceof Error && error.message.includes('replica set')) {
          return NextResponse.json({ 
            error: 'Database configuration issue. Please contact support.' 
          }, { status: 500 })
        }
        return NextResponse.json({ error: 'User not found and could not be created' }, { status: 404 })
      }
    }

    if (!user) {
      console.log('GET /api/stores - User still not found after creation attempt')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('GET /api/stores - Fetching stores for user:', user.id)
    const stores = await prisma.store.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })
    console.log('GET /api/stores - Found stores:', stores.length)
    console.log('GET /api/stores - Store details:', stores.map(store => ({
      id: store.id,
      name: store.name,
      logoUrl: store.logoUrl,
      hasLogoUrl: !!store.logoUrl
    })))

    return NextResponse.json(stores)
  } catch (error) {
    console.error('GET /api/stores - Error fetching stores:', error)
    // Check if it's a MongoDB replica set error
    if (error instanceof Error && error.message.includes('replica set')) {
      return NextResponse.json({ 
        error: 'Database configuration issue. Please contact support.' 
      }, { status: 500 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First find the user by clerkId
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    // If user doesn't exist, create them (fallback for when webhook isn't configured)
    if (!user) {
      try {
        // Create user in database with basic info
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email: `user-${userId}@temp.com`, // Temporary email, will be updated by webhook
            name: 'User', // Temporary name, will be updated by webhook
          }
        })
        console.log('Created user in database:', user)
      } catch (error) {
        console.error('Error creating user:', error)
        // Check if it's a MongoDB replica set error
        if (error instanceof Error && error.message.includes('replica set')) {
          return NextResponse.json({ 
            error: 'Database configuration issue. Please contact support.' 
          }, { status: 500 })
        }
        return NextResponse.json({ error: 'User not found and could not be created' }, { status: 404 })
      }
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user already has 3 stores
    const storeCount = await prisma.store.count({
      where: { userId: user.id }
    })

    if (storeCount >= 3) {
      return NextResponse.json(
        { error: 'Maximum of 3 stores allowed per user' }, 
        { status: 400 }
      )
    }

    const body: CreateStoreData = await request.json()
    const { name, description, logoUrl, storeType, village, phaseNumber, blockNumber, lotNumber } = body

    console.log('Received store data:', body)
    console.log('Logo URL received:', logoUrl)

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Store name is required' }, 
        { status: 400 }
      )
    }

    if (!storeType || storeType.trim().length === 0) {
      return NextResponse.json(
        { error: 'Store type is required' }, 
        { status: 400 }
      )
    }

    if (!village || village.trim().length === 0) {
      return NextResponse.json(
        { error: 'Village is required' }, 
        { status: 400 }
      )
    }

    const store = await prisma.store.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        logoUrl,
        storeType: storeType.trim(),
        village: village.trim(),
        phaseNumber: phaseNumber?.trim() || '',
        blockNumber: blockNumber?.trim() || '',
        lotNumber: lotNumber?.trim() || '',
        userId: user.id
      }
    })

    console.log('Store created successfully:', store)
    console.log('Logo URL saved:', store.logoUrl)

    return NextResponse.json(store, { status: 201 })
  } catch (error) {
    console.error('Error creating store:', error)
    // Check if it's a MongoDB replica set error
    if (error instanceof Error && error.message.includes('replica set')) {
      return NextResponse.json({ 
        error: 'Database configuration issue. Please contact support.' 
      }, { status: 500 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
