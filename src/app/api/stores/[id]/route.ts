import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { UpdateStoreData } from '@/types/store'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body: UpdateStoreData = await request.json()
    const { name, description, logoUrl } = body

    // First find the user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify the store belongs to the user
    const existingStore = await prisma.store.findFirst({
      where: { id, userId: user.id }
    })

    if (!existingStore) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    if (name !== undefined && name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Store name cannot be empty' }, 
        { status: 400 }
      )
    }

    const updatedStore = await prisma.store.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(logoUrl !== undefined && { logoUrl })
      }
    })

    return NextResponse.json(updatedStore)
  } catch (error) {
    console.error('Error updating store:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // First find the user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify the store belongs to the user
    const existingStore = await prisma.store.findFirst({
      where: { id, userId: user.id }
    })

    if (!existingStore) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 })
    }

    // Delete the store (this will also delete associated products due to cascade)
    await prisma.store.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Store deleted successfully' })
  } catch (error) {
    console.error('Error deleting store:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
