import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/auth'

export async function GET(request: NextRequest) {
  return runQuickBooksMigration()
}

export async function POST(request: NextRequest) {
  return runQuickBooksMigration()
}

async function runQuickBooksMigration() {
  try {
    console.log('Starting QuickBooks integration schema migration...')

    // Create IntegrationStatus enum if it doesn't exist
    try {
      await prisma.$executeRaw`
        DO $$ BEGIN
          CREATE TYPE "IntegrationStatus" AS ENUM ('DISCONNECTED', 'CONNECTING', 'CONNECTED', 'ERROR', 'EXPIRED');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `
      console.log('IntegrationStatus enum created/verified')
    } catch (e) {
      console.log('IntegrationStatus enum may already exist:', e)
    }

    // Create QuickBooksIntegration table if it doesn't exist
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "QuickBooksIntegration" (
          "id" TEXT NOT NULL,
          "entityId" TEXT NOT NULL,
          "status" "IntegrationStatus" NOT NULL DEFAULT 'DISCONNECTED',
          "companyId" TEXT,
          "accessToken" TEXT,
          "refreshToken" TEXT,
          "tokenExpiresAt" TIMESTAMP(3),
          "companyInfo" JSONB,
          "lastSyncAt" TIMESTAMP(3),
          "lastSyncStatus" TEXT,
          "syncErrors" JSONB NOT NULL DEFAULT '[]',
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,

          CONSTRAINT "QuickBooksIntegration_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "QuickBooksIntegration_entityId_key" UNIQUE ("entityId")
        );
      `
      console.log('QuickBooksIntegration table created/verified')

      // Add foreign key constraint if it doesn't exist
      await prisma.$executeRaw`
        DO $$ BEGIN
          ALTER TABLE "QuickBooksIntegration" ADD CONSTRAINT "QuickBooksIntegration_entityId_fkey"
          FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `

      // Add indexes if they don't exist
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "QuickBooksIntegration_status_idx" ON "QuickBooksIntegration"("status");
      `
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "QuickBooksIntegration_lastSyncAt_idx" ON "QuickBooksIntegration"("lastSyncAt");
      `
    } catch (e) {
      console.log('QuickBooksIntegration table creation note:', e)
    }

    // Test the QuickBooksIntegration table by trying to count records
    const integrationsCount = await prisma.quickBooksIntegration.count()
    console.log(`QuickBooksIntegration table working, found ${integrationsCount} integrations`)

    // Get related counts
    const entitiesCount = await prisma.entity.count()
    const usersCount = await prisma.user.count()

    console.log(`Migration completed. Integrations: ${integrationsCount}, Entities: ${entitiesCount}, Users: ${usersCount}`)

    return NextResponse.json({
      success: true,
      message: 'QuickBooks integration schema migration completed successfully',
      counts: {
        integrations: integrationsCount,
        entities: entitiesCount,
        users: usersCount
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('QuickBooks migration error:', error)
    return NextResponse.json(
      {
        error: 'QuickBooks migration failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
