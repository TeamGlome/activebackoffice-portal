import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Adding missing userGroup column to User table...')

    // Add the missing userGroup column
    await prisma.$executeRaw`
      ALTER TABLE "User"
      ADD COLUMN IF NOT EXISTS "userGroup" TEXT;
    `

    console.log('✅ userGroup column added successfully')

    // Test that it works now
    const userCount = await prisma.user.count()
    console.log('✅ User table now accessible, count:', userCount)

    return NextResponse.json({
      success: true,
      message: 'Missing userGroup column added successfully',
      userCount: userCount
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
