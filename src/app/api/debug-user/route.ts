import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ 
        error: 'No user found', 
        clerkUser: null,
        dbUser: null 
      })
    }

    const dbUser = await prisma.user.findUnique({ 
      where: { clerkId: user.id } 
    })

    return NextResponse.json({
      clerkUser: {
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      },
      dbUser: dbUser ? {
        id: dbUser.id,
        clerkId: dbUser.clerkId,
        email: dbUser.email,
        role: (dbUser as unknown as { role: string }).role,
        onboarded: (dbUser as unknown as { onboarded: boolean }).onboarded,
        createdAt: dbUser.createdAt
      } : null,
      adminEmail: process.env.ADMIN_EMAIL
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to fetch user data', 
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
