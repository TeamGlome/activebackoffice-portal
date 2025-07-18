import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Testing simple database operations...')

    // Test 1: Basic connection
    await prisma.$connect()
    console.log('✅ Database connected')

    // Test 2: Simple count operations
    try {
      const userCount = await prisma.user.count()
      console.log('✅ User table accessible, count:', userCount)
    } catch (error) {
      console.error('❌ User table error:', error.message)
      return NextResponse.json({ error: `User table: ${error.message}`, step: 'user_count' }, { status: 500 })
    }

    try {
      const entityCount = await prisma.entity.count()
      console.log('✅ Entity table accessible, count:', entityCount)
    } catch (error) {
      console.error('❌ Entity table error:', error.message)
      return NextResponse.json({ error: `Entity table: ${error.message}`, step: 'entity_count' }, { status: 500 })
    }

    // Test 3: Try to create a simple entity with minimal data
    try {
      console.log('🔍 Testing entity creation...')

      const testEntity = await prisma.entity.create({
        data: {
          name: 'Test Entity ' + Date.now(),
          status: 'trial'
        }
      })

      console.log('✅ Test entity created:', testEntity.id)

      // Clean up test entity
      await prisma.entity.delete({
        where: { id: testEntity.id }
      })

      console.log('✅ Test entity cleaned up')

    } catch (error) {
      console.error('❌ Entity creation error:', error.message)
      return NextResponse.json({
        error: `Entity creation failed: ${error.message}`,
        step: 'entity_creation',
        fullError: error.toString()
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'All database operations successful',
      tests: ['connection', 'user_count', 'entity_count', 'entity_creation']
    })

  } catch (error) {
    console.error('❌ Database test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fullError: error.toString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
