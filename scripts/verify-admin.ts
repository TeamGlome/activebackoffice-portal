import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function verifyAdmin() {
  try {
    console.log('🔍 Checking admin user...')

    const user = await prisma.user.findUnique({
      where: { email: 'admin@activebackoffice.com' },
      include: { entity: true }
    })

    if (!user) {
      console.log('❌ Admin user not found!')
      return
    }

    console.log('✅ Admin user found:')
    console.log('📧 Email:', user.email)
    console.log('👤 Name:', user.name)
    console.log('🔑 Role:', user.role)
    console.log('🌐 Platform Role:', user.platformRole)
    console.log('🏢 Entity:', user.entity?.name)
    console.log('✅ Active:', user.isActive)

    // Test password
    const isPasswordValid = await bcrypt.compare('creadmin123!', user.password)
    console.log('🔐 Password valid:', isPasswordValid ? '✅ YES' : '❌ NO')

    if (!isPasswordValid) {
      console.log('🔧 Fixing password...')
      const hashedPassword = await bcrypt.hash('creadmin123!', 12)
      await prisma.user.update({
        where: { email: 'admin@activebackoffice.com' },
        data: { password: hashedPassword }
      })
      console.log('✅ Password fixed!')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyAdmin()
