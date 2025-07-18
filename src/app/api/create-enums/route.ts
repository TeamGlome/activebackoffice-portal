import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  try {
    console.log('🔨 Creating PostgreSQL enum types...')

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL
        }
      }
    })

    await prisma.$connect()
    console.log('✅ Connected to database')

    // Create UserRole enum
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN', 'MANAGER', 'VIEWER');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

    // Create PlatformRole enum
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "PlatformRole" AS ENUM ('PLATFORM_USER', 'PLATFORM_ADMIN', 'PLATFORM_SUPER_ADMIN');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

    // Create EntityType enum
    await prisma.$executeRaw`
      DO $$ BEGIN
        CREATE TYPE "EntityType" AS ENUM ('PLATFORM', 'ORGANIZATION', 'DEPARTMENT', 'TEAM');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `

    console.log('✅ Enum types created')
    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'PostgreSQL enum types created successfully!',
      enumsCreated: ['UserRole', 'PlatformRole', 'EntityType'],
      nextStep: 'Visit https://app.activebackoffice.com/api/force-setup to create admin user'
    })

  } catch (error) {
    console.error('❌ Enum creation failed:', error)

    return NextResponse.json({
      success: false,
      error: 'Enum creation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
