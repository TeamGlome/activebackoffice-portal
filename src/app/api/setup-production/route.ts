import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/auth'
import bcrypt from 'bcryptjs'

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
    try {
      await prisma.$connect()
      console.log('✅ Database connected successfully')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      throw new Error(`Database connection failed: ${error}`)
    }

    // 2. Check if admin user already exists
    let existingAdmin
    try {
      existingAdmin = await prisma.user.findUnique({
        where: { email: 'admin@activebackoffice.com' }
      })
      console.log('✅ User lookup completed, exists:', !!existingAdmin)
    } catch (error) {
      console.error('❌ Admin user lookup failed:', error)
      throw new Error(`Admin user lookup failed: ${error}`)
    }

    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists',
        adminEmail: existingAdmin.email,
        adminName: existingAdmin.name,
        loginUrl: 'https://app.activebackoffice.com/login'
      })
    }

    // 3. Create default entity (matching current schema)
    let entity
    try {
      entity = await prisma.entity.findFirst({
        where: { name: 'Active Back Office' }
      })
      console.log('✅ Entity lookup completed, exists:', !!entity)
    } catch (error) {
      console.error('❌ Entity lookup failed:', error)
      throw new Error(`Entity lookup failed: ${error}`)
    }

    if (!entity) {
      try {
        entity = await prisma.entity.create({
          data: {
            name: 'Active Back Office',
            type: 'Platform',
            status: 'active',
            subscriptionPlan: 'enterprise',
            timezone: 'America/New_York',
            currency: 'USD',
            fiscalYearStart: '01-01',
            monthlyAmount: 0,
            complianceScore: 100.0,
            violationsCount: 0,
            integrations: {}
          }
        })
        console.log('✅ Created default entity:', entity.id)
      } catch (error) {
        console.error('❌ Entity creation failed:', error)
        throw new Error(`Entity creation failed: ${error}`)
      }
    }

    // 4. Create admin user (matching current schema)
    try {
      const hashedPassword = await bcrypt.hash('creadmin123!', 12)
      console.log('✅ Password hashed successfully')

      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@activebackoffice.com',
          name: 'Super Administrator',
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          platformRole: 'PLATFORM_SUPER_ADMIN',
          entityId: entity.id,
          isActive: true,
          emailVerified: new Date()
        }
      })
      console.log('✅ Created admin user:', adminUser.id)
    } catch (error) {
      console.error('❌ Admin user creation failed:', error)
      throw new Error(`Admin user creation failed: ${error}`)
    }

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
      details: error instanceof Error ? error.message : 'Unknown error',
      step: 'Check console logs for detailed error information'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// GET method for status check
export async function GET() {
  try {
    console.log('🔍 Checking database status...')

    await prisma.$connect()
    console.log('✅ Database connection successful')

    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@activebackoffice.com' }
    })
    console.log('✅ Admin check completed, exists:', !!adminExists)

    const entityExists = await prisma.entity.findFirst({
      where: { name: 'Active Back Office' }
    })
    console.log('✅ Entity check completed, exists:', !!entityExists)

    return NextResponse.json({
      status: 'ready',
      databaseConnected: true,
      adminUserExists: !!adminExists,
      entityExists: !!entityExists,
      setupRequired: !adminExists || !entityExists
    })
  } catch (error) {
    console.error('❌ Database status check failed:', error)
    return NextResponse.json({
      status: 'error',
      databaseConnected: false,
      adminUserExists: false,
      entityExists: false,
      setupRequired: true,
      error: error instanceof Error ? error.message : 'Database connection failed'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
