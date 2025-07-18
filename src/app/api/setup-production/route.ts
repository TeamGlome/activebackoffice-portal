import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL
    }
  }
})

export async function POST(request: NextRequest) {
  try {
    // Security check - only allow in production with proper auth
    const authHeader = request.headers.get('authorization')
    const setupKey = process.env.SETUP_SECRET_KEY || 'abo-setup-2025'

    if (authHeader !== `Bearer ${setupKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🚀 Starting production database setup...')

    // 1. Test database connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    // 2. Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@activebackoffice.com' }
    })

    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists',
        adminEmail: existingAdmin.email,
        adminName: existingAdmin.name
      })
    }

    // 3. Create default entity
    let entity = await prisma.entity.findFirst({
      where: { name: 'Active Back Office' }
    })

    if (!entity) {
      entity = await prisma.entity.create({
        data: {
          id: 'abo-main-entity',
          name: 'Active Back Office',
          type: 'PLATFORM',
          isActive: true,
          settings: {
            timezone: 'America/New_York',
            currency: 'USD',
            features: ['DASHBOARD', 'INTEGRATIONS', 'REPORTS', 'USER_MANAGEMENT']
          }
        }
      })
      console.log('✅ Created default entity')
    }

    // 4. Create admin user
    const hashedPassword = await bcrypt.hash('creadmin123!', 12)

    const adminUser = await prisma.user.create({
      data: {
        id: 'admin-super-user',
        email: 'admin@activebackoffice.com',
        name: 'Super Administrator',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        platformRole: 'PLATFORM_SUPER_ADMIN',
        entityId: entity.id,
        isActive: true,
        emailVerified: new Date(),
        settings: {
          theme: 'dark',
          notifications: true,
          twoFactorEnabled: false
        }
      }
    })

    // 5. Create API key for admin
    await prisma.apiKey.create({
      data: {
        id: 'admin-api-key',
        name: 'Admin Development Key',
        key: 'abo_' + Math.random().toString(36).substring(2, 15),
        entityId: entity.id,
        permissions: ['READ', 'WRITE', 'DELETE'],
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      }
    })

    console.log('🎉 Production setup completed successfully!')

    return NextResponse.json({
      success: true,
      message: 'Production setup completed successfully!',
      adminEmail: 'admin@activebackoffice.com',
      adminPassword: 'creadmin123!',
      loginUrl: 'https://app.activebackoffice.com/login',
      entityName: entity.name,
      warning: 'IMPORTANT: Change the admin password after first login!'
    })

  } catch (error) {
    console.error('❌ Production setup failed:', error)

    return NextResponse.json({
      success: false,
      error: 'Production setup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// GET method for status check
export async function GET() {
  try {
    await prisma.$connect()

    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@activebackoffice.com' }
    })

    const entityExists = await prisma.entity.findFirst({
      where: { name: 'Active Back Office' }
    })

    return NextResponse.json({
      status: 'ready',
      databaseConnected: true,
      adminUserExists: !!adminExists,
      entityExists: !!entityExists,
      setupRequired: !adminExists || !entityExists
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      databaseConnected: false,
      error: error instanceof Error ? error.message : 'Database connection failed'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
