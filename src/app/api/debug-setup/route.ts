import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest) {
  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {} as any
  }

  try {
    // 1. Check environment variables
    debug.checks.environmentVariables = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      databaseUrlFormat: process.env.DATABASE_URL?.startsWith('postgres://') || process.env.POSTGRES_PRISMA_URL?.startsWith('postgres://'),
      databaseUrlLength: (process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || '').length
    }

    // 2. Try to create Prisma client
    let prismaClient
    try {
      prismaClient = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL
          }
        }
      })
      debug.checks.prismaClient = 'Created successfully'
    } catch (error) {
      debug.checks.prismaClient = `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      return NextResponse.json(debug)
    }

    // 3. Test database connection
    try {
      await prismaClient.$connect()
      debug.checks.databaseConnection = 'Connected successfully'
    } catch (error) {
      debug.checks.databaseConnection = `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      await prismaClient.$disconnect()
      return NextResponse.json(debug)
    }

    // 4. Check if tables exist by trying simple queries
    try {
      // Try to query each table
      const userCount = await prismaClient.user.count()
      debug.checks.userTable = `Exists (${userCount} records)`
    } catch (error) {
      debug.checks.userTable = `Missing or error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    try {
      const entityCount = await prismaClient.entity.count()
      debug.checks.entityTable = `Exists (${entityCount} records)`
    } catch (error) {
      debug.checks.entityTable = `Missing or error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    // 5. Check for admin user
    try {
      const adminUser = await prismaClient.user.findUnique({
        where: { email: 'admin@activebackoffice.com' }
      })
      debug.checks.adminUser = adminUser ? 'Exists' : 'Not found'
    } catch (error) {
      debug.checks.adminUser = `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }

    // 6. Test basic write operation
    try {
      // Try to create a test record (will rollback)
      await prismaClient.$transaction(async (tx) => {
        await tx.entity.create({
          data: {
            id: 'test-entity-' + Date.now(),
            name: 'Test Entity',
            type: 'PLATFORM',
            isActive: true
          }
        })
        // Rollback by throwing an error
        throw new Error('ROLLBACK_TEST')
      })
    } catch (error) {
      if (error instanceof Error && error.message === 'ROLLBACK_TEST') {
        debug.checks.writePermissions = 'Working (test transaction rolled back)'
      } else {
        debug.checks.writePermissions = `Failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }

    await prismaClient.$disconnect()

    // 7. Database URL analysis (masked for security)
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || ''
    if (dbUrl) {
      const urlParts = dbUrl.split('@')
      if (urlParts.length > 1) {
        debug.checks.databaseHost = urlParts[1].split('/')[0]
        debug.checks.databaseName = urlParts[1].split('/')[1]?.split('?')[0]
      }
    }

    debug.status = 'completed'
    return NextResponse.json(debug)

  } catch (error) {
    debug.checks.criticalError = error instanceof Error ? error.message : 'Unknown critical error'
    debug.status = 'failed'
    return NextResponse.json(debug, { status: 500 })
  }
}
