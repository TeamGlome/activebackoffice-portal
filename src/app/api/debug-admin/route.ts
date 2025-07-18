import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log('🔍 Testing admin credentials for:', email)

    // Find the admin user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { entity: true }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        email: email
      })
    }

    console.log('✅ Admin user found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      platformRole: user.platformRole,
      isActive: user.isActive,
      entityId: user.entityId
    })

    // Test password
    const passwordValid = await bcrypt.compare(password, user.password)

    console.log('🔐 Password test result:', passwordValid)

    return NextResponse.json({
      success: true,
      userFound: true,
      passwordValid: passwordValid,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        platformRole: user.platformRole,
        isActive: user.isActive,
        entityId: user.entityId,
        entityName: user.entity?.name
      },
      nextStep: passwordValid ? 'Credentials are correct - login system issue' : 'Password mismatch'
    })

  } catch (error) {
    console.error('❌ Admin debug failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
