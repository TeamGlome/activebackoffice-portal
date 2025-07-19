import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function setupAdmin() {
  try {
    // Create default entity
    const defaultEntity = await prisma.entity.upsert({
      where: { id: 'default-entity' },
      update: {},
      create: {
        id: 'default-entity',
        name: 'Active Back Office',
        type: 'enterprise'
      }
    })

    // Hash password
    const hashedPassword = await bcrypt.hash('creadmin123!', 12)

    // Create super admin user
    const superAdmin = await prisma.user.upsert({
      where: { email: 'admin@activebackoffice.com' },
      update: {
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        platformRole: 'PLATFORM_SUPER_ADMIN',
        isActive: true
      },
      create: {
        email: 'admin@activebackoffice.com',
        password: hashedPassword,
        name: 'Super Administrator',
        role: 'SUPER_ADMIN',
        platformRole: 'PLATFORM_SUPER_ADMIN',
        entityId: defaultEntity.id,
        isActive: true
      }
    })

    console.log('✅ Admin setup complete!')
    console.log('📧 Email: admin@activebackoffice.com')
    console.log('🔑 Password: creadmin123!')
    console.log('👤 User ID:', superAdmin.id)
    console.log('🏢 Entity:', defaultEntity.name)

  } catch (error) {
    console.error('❌ Error setting up admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupAdmin()
