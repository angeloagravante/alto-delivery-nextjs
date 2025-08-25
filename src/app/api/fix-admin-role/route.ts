import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'No user found' }, { status: 401 })
    }

    // Get admin email from environment
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
    const userEmail = user.emailAddresses?.[0]?.emailAddress?.toLowerCase()

    if (!adminEmail) {
      return NextResponse.json({ 
        error: 'ADMIN_EMAIL environment variable not set' 
      }, { status: 400 })
    }

    if (userEmail !== adminEmail) {
      return NextResponse.json({ 
        error: 'Your email does not match the configured admin email' 
      }, { status: 403 })
    }

    // Update user role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { clerkId: user.id },
      data: { role: 'ADMIN' }
    })

    return NextResponse.json({
      success: true,
      message: 'User role updated to ADMIN',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: (updatedUser as unknown as { role: string }).role
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to update user role', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
