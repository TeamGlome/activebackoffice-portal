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

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Starting simple production setup...')

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
        message: 'Admin user already exists - you can now login!',
        adminEmail: 'admin@activebackoffice.com',
        adminPassword: 'creadmin123!',
        loginUrl: 'https://app.activebackoffice.com/login'
      })
    }

    // 3. Create default entity if not exists
    let entity
    try {
      entity = await prisma.entity.findFirst({
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
    } catch (entityError) {
      console.log('⚠️  Entity creation skipped - table may not exist yet')
      // Create a minimal entity for now
      entity = {
        id: 'abo-main-entity',
        name: 'Active Back Office'
      }
    }

    // 4. Create admin user with simplified approach
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
        emailVerified: new Date()
      }
    })

    console.log('🎉 Simple setup completed successfully!')

    return NextResponse.json({
      success: true,
      message: 'Production setup completed! You can now login.',
      adminEmail: 'admin@activebackoffice.com',
      adminPassword: 'creadmin123!',
      loginUrl: 'https://app.activebackoffice.com/login',
      adminName: adminUser.name,
      warning: 'IMPORTANT: Change the admin password after first login!'
    })

  } catch (error) {
    console.error('❌ Simple setup failed:', error)

    return NextResponse.json({
      success: false,
      error: 'Setup failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      suggestion: 'Try visiting https://app.activebackoffice.com/setup for the full setup page'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
