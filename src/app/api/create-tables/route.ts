import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  try {
    console.log('🔨 Creating database tables...')

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL
        }
      }
    })

    await prisma.$connect()
    console.log('✅ Connected to database')

    // Use Prisma's push command equivalent
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Entity" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "settings" JSONB DEFAULT '{}',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
      );
    `

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "name" TEXT,
        "email" TEXT NOT NULL,
        "emailVerified" TIMESTAMP(3),
        "image" TEXT,
        "password" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'USER',
        "platformRole" TEXT,
        "entityId" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "User_email_key" UNIQUE ("email")
      );
    `

    // Create other essential tables
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Account" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "provider" TEXT NOT NULL,
        "providerAccountId" TEXT NOT NULL,
        "refresh_token" TEXT,
        "access_token" TEXT,
        "expires_at" INTEGER,
        "token_type" TEXT,
        "scope" TEXT,
        "id_token" TEXT,
        "session_state" TEXT,
        CONSTRAINT "Account_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Account_provider_providerAccountId_key" UNIQUE ("provider", "providerAccountId")
      );
    `

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Session" (
        "id" TEXT NOT NULL,
        "sessionToken" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "Session_sessionToken_key" UNIQUE ("sessionToken")
      );
    `

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "VerificationToken" (
        "identifier" TEXT NOT NULL,
        "token" TEXT NOT NULL,
        "expires" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "VerificationToken_token_key" UNIQUE ("token"),
        CONSTRAINT "VerificationToken_identifier_token_key" UNIQUE ("identifier", "token")
      );
    `

    console.log('✅ Essential tables created')
    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'Database tables created successfully!',
      tablesCreated: ['Entity', 'User', 'Account', 'Session', 'VerificationToken'],
      nextStep: 'Visit https://app.activebackoffice.com/api/force-setup to create admin user'
    })

  } catch (error) {
    console.error('❌ Table creation failed:', error)

    return NextResponse.json({
      success: false,
      error: 'Table creation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
