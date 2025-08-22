import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ 
        message: 'User not found in database',
        clerkId: userId,
        suggestion: 'User needs to be created in database'
      })
    }

    return NextResponse.json({ 
      message: 'User found in database',
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Error checking user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      // Create user
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `user-${userId}@temp.com`,
          name: 'User',
        }
      })
      
      return NextResponse.json({ 
        message: 'User created in database',
        user: {
          id: user.id,
          clerkId: user.clerkId,
          email: user.email,
          name: user.name
        }
      })
    }

    return NextResponse.json({ 
      message: 'User already exists in database',
      user: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
