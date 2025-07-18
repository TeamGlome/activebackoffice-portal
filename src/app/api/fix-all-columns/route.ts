import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Adding all missing columns to match Prisma schema...')

    const fixes = []

    // Fix User table - add userGroup column
    try {
      await prisma.$executeRaw`
        ALTER TABLE "User"
        ADD COLUMN IF NOT EXISTS "userGroup" TEXT;
      `
      fixes.push('User.userGroup added')
      console.log('✅ User.userGroup column added')
    } catch (error) {
      console.log('User.userGroup already exists or error:', error.message)
    }

    // Fix Entity table - add category column
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Entity"
        ADD COLUMN IF NOT EXISTS "category" TEXT;
      `
      fixes.push('Entity.category added')
      console.log('✅ Entity.category column added')
    } catch (error) {
      console.log('Entity.category already exists or error:', error.message)
    }

    // Test that User table works now
    const userCount = await prisma.user.count()
    console.log('✅ User table accessible, count:', userCount)

    // Test that Entity table works now
    const entityCount = await prisma.entity.count()
    console.log('✅ Entity table accessible, count:', entityCount)

    // Find admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@activebackoffice.com' },
      include: { entity: true }
    })

    return NextResponse.json({
      success: true,
      message: 'All missing columns added successfully',
      fixes: fixes,
      userCount: userCount,
      entityCount: entityCount,
      adminUserExists: !!adminUser,
      adminUser: adminUser ? {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        platformRole: adminUser.platformRole
      } : null
    })

  } catch (error) {
    console.error('❌ Schema fix failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Schema fix failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
