import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { storeId } = await request.json()
    
    if (!storeId) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 })
    }

    // Create sample orders for testing
    const sampleOrders = [
      {
        orderNumber: 'ORD-TEST-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '+1-555-0123',
        customerAddress: '123 Main St, City, State 12345',
        totalAmount: 25.50,
        status: 'new',
        paymentMethod: 'card',
        paymentStatus: 'paid',
        estimatedDeliveryTime: '30 mins',
        storeId: storeId,
        userId: userId
      },
      {
        orderNumber: 'ORD-TEST-002',
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        customerPhone: '+1-555-0124',
        customerAddress: '456 Oak Ave, City, State 12345',
        totalAmount: 18.99,
        status: 'accepted',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        estimatedDeliveryTime: '25 mins',
        storeId: storeId,
        userId: userId
      },
      {
        orderNumber: 'ORD-TEST-003',
        customerName: 'Bob Wilson',
        customerEmail: 'bob@example.com',
        customerPhone: '+1-555-0125',
        customerAddress: '789 Pine St, City, State 12345',
        totalAmount: 31.47,
        status: 'completed',
        paymentMethod: 'online',
        paymentStatus: 'paid',
        estimatedDeliveryTime: '20 mins',
        completedAt: new Date(),
        storeId: storeId,
        userId: userId
      }
    ]

    // Create orders one by one and then create their items
    const createdOrders = []
    
    for (let i = 0; i < sampleOrders.length; i++) {
      const orderData = sampleOrders[i]
      
      // Create the order first
      const order = await prisma.order.create({
        data: orderData
      })
      
      // Create the order items
      const itemsData = [
        ...(i === 0 ? [
          {
            orderId: order.id,
            productId: 'test-product-1',
            productName: 'Test Burger',
            quantity: 2,
            price: 12.99
          },
          {
            orderId: order.id,
            productId: 'test-product-2', 
            productName: 'Test Fries',
            quantity: 1,
            price: 4.99
          }
        ] : []),
        ...(i === 1 ? [
          {
            orderId: order.id,
            productId: 'test-product-3',
            productName: 'Test Pizza',
            quantity: 1,
            price: 18.99
          }
        ] : []),
        ...(i === 2 ? [
          {
            orderId: order.id,
            productId: 'test-product-4',
            productName: 'Test Sandwich',
            quantity: 1,
            price: 15.99
          },
          {
            orderId: order.id,
            productId: 'test-product-5',
            productName: 'Test Salad',
            quantity: 1,
            price: 12.49
          },
          {
            orderId: order.id,
            productId: 'test-product-6',
            productName: 'Test Drink',
            quantity: 1,
            price: 2.99
          }
        ] : [])
      ]
      
      for (const itemData of itemsData) {
        await prisma.orderItem.create({
          data: itemData
        })
      }
      
      // Fetch the complete order with items
      const completeOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: { items: true }
      })
      
      createdOrders.push(completeOrder)
    }

    return NextResponse.json({ 
      message: 'Test orders created successfully',
      orders: createdOrders,
      count: createdOrders.length
    })

  } catch (error) {
    console.error('Error creating test orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete all test orders (orders with orderNumber starting with 'ORD-TEST-')
    await prisma.orderItem.deleteMany({
      where: {
        order: {
          orderNumber: {
            startsWith: 'ORD-TEST-'
          }
        }
      }
    })

    const deletedOrders = await prisma.order.deleteMany({
      where: {
        orderNumber: {
          startsWith: 'ORD-TEST-'
        }
      }
    })

    return NextResponse.json({ 
      message: 'Test orders deleted successfully',
      deletedCount: deletedOrders.count
    })

  } catch (error) {
    console.error('Error deleting test orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
