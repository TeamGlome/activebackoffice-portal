import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL
    }
  }
})

async function deployProduction() {
  try {
    console.log('🚀 Starting production deployment...')

    // 1. Test database connection
    console.log('🔗 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    // 2. Apply database schema (equivalent to prisma db push)
    console.log('📊 Applying database schema...')
    // This will be handled by Vercel build process with "prisma generate && prisma db push"

    // 3. Check if admin user exists
    console.log('👤 Checking for existing admin user...')
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@activebackoffice.com' }
    })

    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      console.log(`📧 Email: ${existingAdmin.email}`)
      console.log(`👤 Name: ${existingAdmin.name}`)
      console.log(`🔑 Role: ${existingAdmin.role}`)
      return
    }

    // 4. Create default entity if not exists
    console.log('🏢 Setting up default entity...')
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
      console.log('✅ Created default entity:', entity.name)
    }

    // 5. Create admin user
    console.log('🔐 Creating admin user...')
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

    // 6. Create sample data for testing
    console.log('📝 Creating sample data...')

    // Create API key for admin
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

    console.log('🎉 Production deployment completed successfully!')
    console.log('')
    console.log('📋 ADMIN CREDENTIALS:')
    console.log('📧 Email: admin@activebackoffice.com')
    console.log('🔑 Password: creadmin123!')
    console.log('')
    console.log('⚠️  IMPORTANT: Change the admin password after first login!')
    console.log('🔗 Login URL: https://app.activebackoffice.com/login')

  } catch (error) {
    console.error('❌ Production deployment failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

deployProduction().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
