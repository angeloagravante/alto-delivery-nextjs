import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/products - Starting request')
    const { userId } = await auth()
    console.log('GET /api/products - Auth result:', { userId })
    
    if (!userId) {
      console.log('GET /api/products - No userId found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get storeId from query parameters
    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    console.log('GET /api/products - StoreId from query:', storeId)

    if (!storeId) {
      console.log('GET /api/products - No storeId provided')
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 })
    }

    // First find the user by clerkId
    console.log('GET /api/products - Looking up user with clerkId:', userId)
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })
    console.log('GET /api/products - User lookup result:', { user: user ? { id: user.id, email: user.email } : null })

    if (!user) {
      console.log('GET /api/products - User not found')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify the store exists and belongs to the user
    const store = await prisma.store.findFirst({
      where: { 
        id: storeId,
        userId: user.id
      }
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found or access denied' },
        { status: 404 }
      )
    }

    // Get products from the specific store
    const products = await prisma.product.findMany({
      where: {
        storeId: storeId
      },
      include: {
        store: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/products - Starting request')
    const { userId } = await auth()
    console.log('POST /api/products - Auth result:', { userId })
    
    if (!userId) {
      console.log('POST /api/products - No userId found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('POST /api/products - Request body:', body)
    const { name, description, price, category, stock, images, storeId } = body

    // Validation
    if (!name || !description || !price || !category || stock === undefined || !storeId) {
      console.log('POST /api/products - Validation failed:', { name, description, price, category, stock, storeId })
      return NextResponse.json(
        { error: 'Missing required fields (including storeId)' },
        { status: 400 }
      )
    }

    if (price <= 0 || stock < 0) {
      return NextResponse.json(
        { error: 'Invalid price or stock values' },
        { status: 400 }
      )
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one product image is required' },
        { status: 400 }
      )
    }

    // First find the user by clerkId
    console.log('POST /api/products - Looking up user with clerkId:', userId)
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })
    console.log('POST /api/products - User lookup result:', { user: user ? { id: user.id, email: user.email } : null })

    if (!user) {
      console.log('POST /api/products - User not found')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify the store exists and belongs to the user
    console.log('POST /api/products - Verifying store access:', { storeId, userId: user.id })
    const store = await prisma.store.findFirst({
      where: { 
        id: storeId,
        userId: user.id
      }
    })
    console.log('POST /api/products - Store verification result:', { store: store ? { id: store.id, name: store.name } : null })

    if (!store) {
      console.log('POST /api/products - Store not found or access denied')
      return NextResponse.json(
        { error: 'Store not found or access denied' },
        { status: 404 }
      )
    }
    
    console.log('POST /api/products - Creating product with data:', { name, description, price, category, stock, images, storeId })
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category: category.trim(),
        stock: parseInt(stock),
        images: images,
        storeId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
    console.log('POST /api/products - Product created successfully:', { productId: product.id })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    console.log('POST /api/products - Error details:', { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
