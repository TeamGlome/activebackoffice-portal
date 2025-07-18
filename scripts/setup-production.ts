import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL
    }
  }
})

async function setupProduction() {
  try {
    console.log('🔄 Setting up production database...')

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: 'admin@activebackoffice.com'
      }
    })

    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      return
    }

    // Create default entity
    let entity = await prisma.entity.findFirst({
      where: {
        name: 'Active Back Office'
      }
    })

    if (!entity) {
      entity = await prisma.entity.create({
        data: {
          id: 'abo-main',
          name: 'Active Back Office',
          type: 'PLATFORM',
          isActive: true
        }
      })
      console.log('✅ Created default entity')
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('creadmin123!', 12)

    const adminUser = await prisma.user.create({
      data: {
        id: 'admin-super',
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

    console.log('✅ Production setup complete!')
    console.log('📧 Admin Email:', adminUser.email)
    console.log('🔑 Admin Password: creadmin123!')
    console.log('⚠️  Change the password after first login!')

  } catch (error) {
    console.error('❌ Production setup failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

setupProduction().catch((error) => {
  console.error(error)
  process.exit(1)
})
