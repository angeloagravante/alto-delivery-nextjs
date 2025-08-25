import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const status = searchParams.get('status')
    const limit = searchParams.get('limit')

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 })
    }

    // Verify user owns the store
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId: userId
      }
    })

    if (!store) {
      return NextResponse.json({ error: 'Store not found or access denied' }, { status: 404 })
    }

    // Build where clause
    interface WhereClause {
      storeId: string
      status?: { in: string[] } | string
    }
    
    const whereClause: WhereClause = {
      storeId: storeId
    }

    if (status) {
      if (status === 'new') {
        whereClause.status = 'new'
      } else if (status === 'in_progress') {
        whereClause.status = {
          in: ['accepted', 'preparing', 'for_delivery']
        }
      } else if (status === 'completed') {
        whereClause.status = 'completed'
      } else {
        whereClause.status = status
      }
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit ? parseInt(limit) : undefined
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      storeId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      paymentMethod,
      paymentStatus,
      totalAmount,
      notes,
      estimatedDeliveryTime,
      items
    } = body

    // Verify user owns the store
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        userId: userId
      }
    })

    if (!store) {
      return NextResponse.json({ error: 'Store not found or access denied' }, { status: 404 })
    }

    // Create order first, then create items separately
    const order = await prisma.order.create({
      data: {
        userId,
        storeId,
        customerName,
        customerEmail: customerEmail || undefined,
        customerPhone: customerPhone || undefined,
        customerAddress,
        paymentMethod,
        paymentStatus: paymentStatus || 'pending',
        totalAmount,
        notes: notes || undefined,
        estimatedDeliveryTime: estimatedDeliveryTime || undefined,
        status: 'new'
      }
    })

    // Create order items separately
    await Promise.all(
      items.map((item: {
        productId: string
        productName: string
        quantity: number
        price: number
        imageUrl?: string
      }) =>
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId ?? undefined,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            imageUrl: item.imageUrl
          }
        })
      )
    )

    // Return the complete order with items
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: { 
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(completeOrder, { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
