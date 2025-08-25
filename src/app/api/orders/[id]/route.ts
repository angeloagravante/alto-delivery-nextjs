import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    // Map Clerk user to DB user
    let dbUser = await prisma.user.findUnique({ where: { clerkId: clerkUserId } })
    if (!dbUser) {
      try {
        dbUser = await prisma.user.upsert({
          where: { clerkId: clerkUserId },
          update: {},
          create: { clerkId: clerkUserId, email: `user-${clerkUserId}@temp.com`, name: 'User' }
        })
      } catch (e) {
        console.error('GET /api/orders/[id] - user upsert failed:', e)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
    }
    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        userId: dbUser.id
      },
      include: {
        items: true
      }
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)

  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    let dbUser = await prisma.user.findUnique({ where: { clerkId: clerkUserId } })
    if (!dbUser) {
      try {
        dbUser = await prisma.user.upsert({
          where: { clerkId: clerkUserId },
          update: {},
          create: { clerkId: clerkUserId, email: `user-${clerkUserId}@temp.com`, name: 'User' }
        })
      } catch (e) {
        console.error('PATCH /api/orders/[id] - user upsert failed:', e)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
    }
    const { status, estimatedDeliveryTime, notes } = await request.json()

    // Verify order exists and belongs to user
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: params.id,
  userId: dbUser.id
      }
    })

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 })
    }

    // Update the order
    interface UpdateData {
      updatedAt: Date
      status?: string
      completedAt?: Date
      estimatedDeliveryTime?: string
      notes?: string
    }
    
    const updateData: UpdateData = {
      updatedAt: new Date()
    }

    if (status) {
      updateData.status = status
      
      // If status is completed, set completedAt
      if (status === 'completed') {
        updateData.completedAt = new Date()
      }
    }

    if (estimatedDeliveryTime) {
      updateData.estimatedDeliveryTime = estimatedDeliveryTime
    }

    if (notes) {
      updateData.notes = notes
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: updateData,
      include: {
        items: true
      }
    })

    return NextResponse.json(updatedOrder)

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: clerkUserId } = await auth()
    
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    let dbUser = await prisma.user.findUnique({ where: { clerkId: clerkUserId } })
    if (!dbUser) {
      try {
        dbUser = await prisma.user.upsert({
          where: { clerkId: clerkUserId },
          update: {},
          create: { clerkId: clerkUserId, email: `user-${clerkUserId}@temp.com`, name: 'User' }
        })
      } catch (e) {
        console.error('DELETE /api/orders/[id] - user upsert failed:', e)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
    }

    // Verify order exists and belongs to user
    const existingOrder = await prisma.order.findFirst({
      where: {
        id: params.id,
        userId: dbUser.id
      }
    })

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found or access denied' }, { status: 404 })
    }

    // Delete order items first
    await prisma.orderItem.deleteMany({
      where: {
        orderId: params.id
      }
    })

    // Delete the order
    await prisma.order.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Order deleted successfully' })

  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}