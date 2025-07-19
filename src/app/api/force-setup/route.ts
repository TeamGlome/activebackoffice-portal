import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Add CORS headers
function addCorsHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return response
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 200 }))
}

export async function GET(request: NextRequest) {
  return POST(request)
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 Starting FORCE setup...')

    // Create Prisma client with direct database URL
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL
        }
      }
    })

    console.log('📊 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Database connected')

    // Check if we need to create tables manually
    console.log('🔍 Checking for existing tables...')

    let tablesExist = false
    try {
      await prisma.user.count()
      tablesExist = true
      console.log('✅ Tables already exist')
    } catch (error) {
      console.log('⚠️  Tables do not exist, will create minimal setup')
    }

    if (!tablesExist) {
      // If tables don't exist, we'll use raw SQL to create a minimal user
      console.log('🔨 Creating tables with raw SQL...')

      try {
        // Create User table with minimal schema
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "User" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "email" TEXT NOT NULL UNIQUE,
            "name" TEXT,
            "password" TEXT NOT NULL,
            "role" TEXT NOT NULL DEFAULT 'USER',
            "platformRole" TEXT,
            "entityId" TEXT,
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "emailVerified" TIMESTAMP,
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `

        // Create Entity table
        await prisma.$executeRaw`
          CREATE TABLE IF NOT EXISTS "Entity" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "name" TEXT NOT NULL,
            "type" TEXT NOT NULL,
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "settings" TEXT DEFAULT '{}',
            "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `

        console.log('✅ Basic tables created')
      } catch (sqlError) {
        console.log('⚠️  SQL creation failed, proceeding with Prisma...')
      }
    }

    // Create default entity
    console.log('🏢 Creating/finding default entity...')
    let entityId = 'abo-main-entity'

    try {
      let entity = await prisma.entity.findFirst({
        where: { name: 'Active Back Office' }
      })

      if (!entity) {
        await prisma.$executeRaw`
          INSERT INTO "Entity" (
            "id", "name", "type", "isActive", "settings", "createdAt", "updatedAt"
          ) VALUES (
            ${entityId},
            'Active Back Office',
            'PLATFORM'::text,
            true,
            '{"timezone":"America/New_York","currency":"USD"}',
            ${new Date()},
            ${new Date()}
          )
          ON CONFLICT ("id") DO NOTHING
        `
        console.log('✅ Created entity: Active Back Office')
      } else {
        entityId = entity.id
        console.log('✅ Found existing entity:', entity.name)
      }
    } catch (error) {
      console.log('⚠️  Entity creation failed, using default ID')
    }

    // Check for existing admin
    console.log('👤 Checking for admin user...')
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@activebackoffice.com' }
    })

    if (existingAdmin) {
      console.log('✅ Admin user already exists')
      await prisma.$disconnect()
      return addCorsHeaders(NextResponse.json({
        success: true,
        message: 'Admin user already exists - you can login now!',
        adminEmail: 'admin@activebackoffice.com',
        adminPassword: 'creadmin123!',
        userId: existingAdmin.id,
        userName: existingAdmin.name
      }))
    }

    // Create admin user
    console.log('🔐 Creating admin user...')
    const hashedPassword = await bcrypt.hash('creadmin123!', 12)

    const adminUser = await prisma.$executeRaw`
      INSERT INTO "User" (
        "id", "email", "name", "password", "role", "platformRole",
        "entityId", "isActive", "emailVerified", "createdAt", "updatedAt"
      ) VALUES (
        'admin-super-user',
        'admin@activebackoffice.com',
        'Super Administrator',
        ${hashedPassword},
        'SUPER_ADMIN'::text,
        'PLATFORM_SUPER_ADMIN'::text,
        ${entityId},
        true,
        ${new Date()},
        ${new Date()},
        ${new Date()}
      )
      ON CONFLICT ("email") DO NOTHING
    `

    // Get the created user for response
    const createdAdminUser = await prisma.user.findUnique({
      where: { email: 'admin@activebackoffice.com' }
    })

    if (!createdAdminUser) {
      throw new Error('Failed to create admin user')
    }

    console.log('🎉 FORCE setup completed!')
    await prisma.$disconnect()

    return addCorsHeaders(NextResponse.json({
      success: true,
      message: 'FORCE setup completed successfully!',
      adminEmail: 'admin@activebackoffice.com',
      adminPassword: 'creadmin123!',
      loginUrl: 'https://app.activebackoffice.com/login',
      adminId: createdAdminUser.id,
      adminName: createdAdminUser.name,
      entityId: entityId,
      warning: 'IMPORTANT: Change the admin password after first login!'
    }))

  } catch (error) {
    console.error('❌ FORCE setup failed:', error)

    return addCorsHeaders(NextResponse.json({
      success: false,
      error: 'FORCE setup failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      suggestion: 'Check database connection and permissions'
    }, { status: 500 }))
  }
}
