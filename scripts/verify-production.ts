import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL
    }
  }
})

async function verifyProduction() {
  console.log('🔍 Verifying Production Setup...')
  console.log('=====================================')

  try {
    // 1. Database Connection
    console.log('📊 Testing Database Connection...')
    await prisma.$connect()
    console.log('✅ Database connected successfully')

    // 2. Check if tables exist
    console.log('\n📋 Checking Database Schema...')
    try {
      const userCount = await prisma.user.count()
      console.log(`✅ Users table exists (${userCount} users)`)
    } catch (error) {
      console.log('❌ Users table missing - Run: bun run deploy:production')
      return
    }

    try {
      const entityCount = await prisma.entity.count()
      console.log(`✅ Entities table exists (${entityCount} entities)`)
    } catch (error) {
      console.log('⚠️  Entities table missing')
    }

    // 3. Verify Admin User
    console.log('\n👤 Checking Admin User...')
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@activebackoffice.com' },
      include: { entity: true }
    })

    if (adminUser) {
      console.log('✅ Admin user exists:')
      console.log(`   📧 Email: ${adminUser.email}`)
      console.log(`   👤 Name: ${adminUser.name}`)
      console.log(`   🔑 Role: ${adminUser.role}`)
      console.log(`   🌐 Platform Role: ${adminUser.platformRole}`)
      console.log(`   🏢 Entity: ${adminUser.entity?.name || 'No entity'}`)
      console.log(`   ✅ Active: ${adminUser.isActive}`)
    } else {
      console.log('❌ Admin user not found - Run: bun run deploy:production')
      return
    }

    // 4. Check Environment Variables
    console.log('\n🔧 Checking Environment Variables...')
    const requiredVars = [
      'NEXTAUTH_URL',
      'NEXTAUTH_SECRET',
      'DATABASE_URL',
      'QUICKBOOKS_CLIENT_ID',
      'QUICKBOOKS_CLIENT_SECRET'
    ]

    let allVarsPresent = true
    requiredVars.forEach(varName => {
      if (process.env[varName]) {
        console.log(`✅ ${varName}: Set`)
      } else {
        console.log(`❌ ${varName}: Missing`)
        allVarsPresent = false
      }
    })

    // 5. Check QuickBooks Configuration
    console.log('\n💼 QuickBooks Configuration...')
    if (process.env.QUICKBOOKS_CLIENT_ID && process.env.QUICKBOOKS_CLIENT_SECRET) {
      console.log('✅ QuickBooks credentials configured')
      console.log(`   Client ID: ${process.env.QUICKBOOKS_CLIENT_ID?.substring(0, 10)}...`)
      console.log(`   Redirect URI: https://app.activebackoffice.com/dashboard/integrations/quickbooks/callback`)
    } else {
      console.log('❌ QuickBooks credentials missing')
    }

    // 6. Test Analytics Table (if exists)
    console.log('\n📈 Checking Analytics Setup...')
    try {
      const analyticsCount = await prisma.analytics.count()
      console.log(`✅ Analytics table exists (${analyticsCount} events)`)
    } catch (error) {
      console.log('⚠️  Analytics table not created yet - Run: bun run deploy:production')
    }

    // 7. Summary
    console.log('\n🎯 Production Status Summary:')
    console.log('=====================================')

    if (adminUser && allVarsPresent) {
      console.log('✅ PRODUCTION READY!')
      console.log('')
      console.log('🔗 Login URL: https://app.activebackoffice.com/login')
      console.log('📧 Admin Email: admin@activebackoffice.com')
      console.log('🔑 Admin Password: creadmin123!')
      console.log('')
      console.log('⚠️  IMPORTANT: Change admin password after first login!')
    } else {
      console.log('❌ SETUP INCOMPLETE')
      console.log('   Run: bun run deploy:production')
    }

  } catch (error) {
    console.error('❌ Verification failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyProduction().catch(console.error)
