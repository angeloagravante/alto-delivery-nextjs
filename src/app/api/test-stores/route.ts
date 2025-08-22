import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First find the user by clerkId
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    // If user doesn't exist, create them
    if (!user) {
      try {
        user = await prisma.user.create({
          data: {
            clerkId: userId,
            email: `user-${userId}@temp.com`,
            name: 'User',
          }
        })
        console.log('Created user in database:', user)
      } catch (error) {
        console.error('Error creating user:', error)
        return NextResponse.json({ error: 'User not found and could not be created' }, { status: 404 })
      }
    }

    // Get all stores for the user
    const stores = await prisma.store.findMany({
      where: { userId: user.id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            storeId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get all products for the user (across all stores)
    const allProducts = await prisma.product.findMany({
      where: {
        store: {
          userId: user.id
        }
      },
      include: {
        store: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email
      },
      stores: stores.map(store => ({
        id: store.id,
        name: store.name,
        productCount: store.products.length,
        products: store.products
      })),
      allProducts: allProducts.map(product => ({
        id: product.id,
        name: product.name,
        storeId: product.storeId,
        storeName: product.store.name
      }))
    })
  } catch (error) {
    console.error('Error in test-stores:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
