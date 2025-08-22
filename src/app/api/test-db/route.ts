import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('Database connection successful')
    
    // Test user count
    const userCount = await prisma.user.count()
    console.log('User count:', userCount)
    
    // Test creating a test user
    const testUser = await prisma.user.create({
      data: {
        clerkId: 'test_user_' + Date.now(),
        email: `test${Date.now()}@example.com`,
        name: 'Test User'
      }
    })
    console.log('Test user created:', testUser)
    
    // Clean up test user
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    console.log('Test user cleaned up')
    
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection and operations working',
      userCount,
      testUserCreated: true
    })
    
  } catch (error) {
    console.error('Database test failed:', error)
    
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
