import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting test data cleanup...')

    // Get current counts before cleanup
    const beforeCounts = {
      users: await prisma.user.count(),
      entities: await prisma.entity.count()
    }
    console.log('Before cleanup:', beforeCounts)

    // Keep the admin user but remove test users
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'admin@activebackoffice.com' },
          { platformRole: 'PLATFORM_ADMIN' },
          { platformRole: 'PLATFORM_SUPER_ADMIN' }
        ]
      }
    })

    if (!adminUser) {
      return NextResponse.json(
        { error: 'No admin user found - cannot proceed with cleanup', success: false },
        { status: 400 }
      )
    }

    console.log('Admin user found:', adminUser.email)

    // Delete test users (keep admin)
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        NOT: {
          id: adminUser.id
        }
      }
    })
    console.log('Deleted test users:', deletedUsers.count)

    // Delete all test entities
    const deletedEntities = await prisma.entity.deleteMany({})
    console.log('Deleted test entities:', deletedEntities.count)

    // Update admin user to have no entity (will be assigned later)
    await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        entityId: null
      }
    })
    console.log('Admin user entity cleared')

    // Clean up any other test data tables if they exist
    try {
      // Clear analytics data
      const deletedAnalytics = await prisma.analytics.deleteMany({})
      console.log('Deleted analytics records:', deletedAnalytics.count)
    } catch (e) {
      console.log('Analytics cleanup skipped:', e)
    }

    try {
      // Clear error logs
      const deletedErrorLogs = await prisma.errorLog.deleteMany({})
      console.log('Deleted error logs:', deletedErrorLogs.count)
    } catch (e) {
      console.log('Error logs cleanup skipped:', e)
    }

    // Get final counts
    const afterCounts = {
      users: await prisma.user.count(),
      entities: await prisma.entity.count()
    }
    console.log('After cleanup:', afterCounts)

    // Verify admin user still exists
    const verifyAdmin = await prisma.user.findUnique({
      where: { id: adminUser.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Test data cleanup completed successfully',
      cleanup: {
        before: beforeCounts,
        after: afterCounts,
        deleted: {
          users: deletedUsers.count,
          entities: deletedEntities.count
        }
      },
      adminUser: {
        id: verifyAdmin?.id,
        email: verifyAdmin?.email,
        maintained: true
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      {
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
