import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function testAuthentication() {
  try {
    console.log('🧪 Testing authentication process...')

    const email = 'admin@activebackoffice.com'
    const password = 'creadmin123!'

    console.log(`📧 Testing login for: ${email}`)
    console.log(`🔑 Testing password: ${password}`)

    // Simulate the NextAuth authorize function
    const user = await prisma.user.findUnique({
      where: { email },
      include: { entity: true }
    })

    if (!user) {
      console.log('❌ User not found!')
      return
    }

    console.log('✅ User found')
    console.log('👤 User details:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      platformRole: user.platformRole,
      isActive: user.isActive,
      entityId: user.entityId,
      entityName: user.entity?.name
    })

    if (!user.isActive) {
      console.log('❌ User is not active!')
      return
    }

    console.log('✅ User is active')

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.log('❌ Password is invalid!')
      console.log('🔍 Stored hash:', user.password.substring(0, 20) + '...')

      // Test hash generation
      const testHash = await bcrypt.hash(password, 12)
      console.log('🧪 Test hash:', testHash.substring(0, 20) + '...')
      const testValid = await bcrypt.compare(password, testHash)
      console.log('🧪 Test hash valid:', testValid)

      return
    }

    console.log('✅ Password is valid!')

    // Simulate successful response
    const authResult = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      platformRole: user.platformRole,
      entityId: user.entityId,
      entity: user.entity
    }

    console.log('🎉 Authentication would succeed!')
    console.log('📋 Auth result:', authResult)

  } catch (error) {
    console.error('❌ Authentication test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAuthentication()
