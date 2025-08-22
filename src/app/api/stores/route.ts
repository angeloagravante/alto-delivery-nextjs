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
    console.log('POST /api/stores - Auth userId:', userId)
    
    if (!userId) {
      console.log('POST /api/stores - No userId from auth')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First find the user by clerkId
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })
    console.log('POST /api/stores - User lookup result:', user ? 'found' : 'not found')

    // If user doesn't exist, create them (fallback for when webhook isn't configured)
    if (!user) {
      try {
        console.log('POST /api/stores - Creating new user for clerkId:', userId)
        // Create user in database with basic info
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email: `user-${userId}@temp.com`, // Temporary email, will be updated by webhook
            name: 'User', // Temporary name, will be updated by webhook
          }
        })
        console.log('POST /api/stores - Successfully created user:', user.id)
      } catch (error) {
        console.error('POST /api/stores - Error creating user:', error)
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
      console.log('POST /api/stores - User still not found after creation attempt')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user already has 3 stores
    const storeCount = await prisma.store.count({
      where: { userId: user.id }
    })
    console.log('POST /api/stores - Current store count for user:', storeCount)

    if (storeCount >= 3) {
      return NextResponse.json(
        { error: 'Maximum of 3 stores allowed per user' }, 
        { status: 400 }
      )
    }

    const body: CreateStoreData = await request.json()
    const { name, description, logoUrl, storeType, village, phaseNumber, blockNumber, lotNumber } = body

    console.log('POST /api/stores - Received store data:', body)
    console.log('POST /api/stores - Logo URL received:', logoUrl)

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

    console.log('POST /api/stores - Attempting to create store for user:', user.id)
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

    console.log('POST /api/stores - Store created successfully:', store)
    console.log('POST /api/stores - Logo URL saved:', store.logoUrl)

    return NextResponse.json(store, { status: 201 })
  } catch (error) {
    console.error('POST /api/stores - Error creating store:', error)
    
    // Provide more specific error information
    if (error instanceof Error) {
      console.error('POST /api/stores - Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
      
      // Check if it's a MongoDB replica set error
      if (error.message.includes('replica set')) {
        return NextResponse.json({ 
          error: 'Database configuration issue. Please contact support.' 
        }, { status: 500 })
      }
      
      // Check if it's a Prisma validation error
      if (error.message.includes('Invalid')) {
        return NextResponse.json({ 
          error: 'Invalid data provided' 
        }, { status: 400 })
      }
      
      // Check if it's a connection error
      if (error.message.includes('connect') || error.message.includes('timeout')) {
        return NextResponse.json({ 
          error: 'Database connection failed. Please try again.' 
        }, { status: 500 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
