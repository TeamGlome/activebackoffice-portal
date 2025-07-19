import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/auth'

export async function GET(request: NextRequest) {
  return runMigration()
}

export async function POST(request: NextRequest) {
  return runMigration()
}

async function runMigration() {
  try {
    // Check if Entity table exists and has the correct structure
    console.log('Starting Entity schema migration...')

    // Try to create the Entity table with the correct schema
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Entity" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "type" TEXT,
        "status" TEXT NOT NULL DEFAULT 'trial',
        "subscriptionPlan" TEXT,
        "timezone" TEXT,
        "currency" TEXT,
        "fiscalYearStart" TEXT,
        "monthlyAmount" INTEGER,
        "complianceScore" DOUBLE PRECISION,
        "lastAssessment" TIMESTAMP(3),
        "violationsCount" INTEGER,
        "integrations" JSONB NOT NULL DEFAULT '{}',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,

        CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
      );
    `

    // Update existing Entity table if it exists but has wrong columns
    try {
      // Add missing columns if they don't exist
      await prisma.$executeRaw`ALTER TABLE "Entity" ADD COLUMN IF NOT EXISTS "type" TEXT;`
      await prisma.$executeRaw`ALTER TABLE "Entity" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'trial';`
      await prisma.$executeRaw`ALTER TABLE "Entity" ADD COLUMN IF NOT EXISTS "subscriptionPlan" TEXT;`
      await prisma.$executeRaw`ALTER TABLE "Entity" ADD COLUMN IF NOT EXISTS "timezone" TEXT;`
      await prisma.$executeRaw`ALTER TABLE "Entity" ADD COLUMN IF NOT EXISTS "currency" TEXT;`
      await prisma.$executeRaw`ALTER TABLE "Entity" ADD COLUMN IF NOT EXISTS "fiscalYearStart" TEXT;`
      await prisma.$executeRaw`ALTER TABLE "Entity" ADD COLUMN IF NOT EXISTS "monthlyAmount" INTEGER;`
      await prisma.$executeRaw`ALTER TABLE "Entity" ADD COLUMN IF NOT EXISTS "complianceScore" DOUBLE PRECISION;`
      await prisma.$executeRaw`ALTER TABLE "Entity" ADD COLUMN IF NOT EXISTS "lastAssessment" TIMESTAMP(3);`
      await prisma.$executeRaw`ALTER TABLE "Entity" ADD COLUMN IF NOT EXISTS "violationsCount" INTEGER;`
      await prisma.$executeRaw`ALTER TABLE "Entity" ADD COLUMN IF NOT EXISTS "integrations" JSONB NOT NULL DEFAULT '{}';`
    } catch (e) {
      console.log('Some columns may already exist, continuing...')
    }

    // Update User table to add lastLogin if missing
    try {
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastLogin" TIMESTAMP(3);`
    } catch (e) {
      console.log('lastLogin column may already exist')
    }

    // Test the Entity table by trying to fetch entities
    const entities = await prisma.entity.findMany()
    console.log(`Entity table working, found ${entities.length} entities`)

    return NextResponse.json({
      success: true,
      message: 'Entity schema migration completed successfully',
      entitiesCount: entities.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Migration error:', error)
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
