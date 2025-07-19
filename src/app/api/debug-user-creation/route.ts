import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    console.log('=== DEBUG USER CREATION ===')

    // Test with minimal required data
    const testUser = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      password: 'testpass123',
      role: 'USER', // Use direct enum value
      platformRole: null, // Optional
      entityId: null, // Optional
      isActive: true
    }

    console.log('Test user data:', testUser)

    // Hash password
    const hashedPassword = await bcrypt.hash(testUser.password, 12)
    console.log('Password hashed successfully')

    // Test database connection
    console.log('Testing database connection...')
    const userCount = await prisma.user.count()
    console.log('Current user count:', userCount)

    // Create test user
    console.log('Creating test user...')
    const newUser = await prisma.user.create({
      data: {
        name: testUser.name,
        email: testUser.email,
        password: hashedPassword,
        role: testUser.role as any,
        platformRole: testUser.platformRole as any,
        entityId: testUser.entityId,
        isActive: testUser.isActive
      }
    })

    console.log('Test user created successfully:', newUser.id)

    return NextResponse.json({
      success: true,
      message: 'Test user created successfully',
      userId: newUser.id,
      email: newUser.email
    })

  } catch (error) {
    console.error('Debug user creation error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : 'No stack trace',
        success: false
      },
      { status: 500 }
    )
  }
}
