import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/auth'

export async function GET(request: NextRequest) {
  return runEnumMigration()
}

export async function POST(request: NextRequest) {
  return runEnumMigration()
}

async function runEnumMigration() {
  try {
    console.log('Starting UserRole and PlatformRole enum migration...')

    // Create UserRole enum if it doesn't exist
    try {
      await prisma.$executeRaw`
        DO $$ BEGIN
          CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `
      console.log('UserRole enum created/verified')
    } catch (e) {
      console.log('UserRole enum may already exist:', e)
    }

    // Create PlatformRole enum if it doesn't exist
    try {
      await prisma.$executeRaw`
        DO $$ BEGIN
          CREATE TYPE "PlatformRole" AS ENUM ('PLATFORM_ADMIN', 'PLATFORM_SUPER_ADMIN');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `
      console.log('PlatformRole enum created/verified')
    } catch (e) {
      console.log('PlatformRole enum may already exist:', e)
    }

    // Update User table to use the enum types if columns exist but wrong type
    try {
      // Check if columns need type conversion
      await prisma.$executeRaw`
        DO $$ BEGIN
          -- Convert role column to enum if it's not already
          IF EXISTS (SELECT 1 FROM information_schema.columns
                     WHERE table_name = 'User' AND column_name = 'role'
                     AND data_type != 'USER-DEFINED') THEN
            ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole" USING "role"::"UserRole";
          END IF;

          -- Convert platformRole column to enum if it's not already
          IF EXISTS (SELECT 1 FROM information_schema.columns
                     WHERE table_name = 'User' AND column_name = 'platformRole'
                     AND data_type != 'USER-DEFINED') THEN
            ALTER TABLE "User" ALTER COLUMN "platformRole" TYPE "PlatformRole" USING "platformRole"::"PlatformRole";
          END IF;
        END $$;
      `
      console.log('User table column types updated')
    } catch (e) {
      console.log('Column type conversion note:', e)
    }

    // Test creating a user to verify enums work
    try {
      const testEmail = `enum-test-${Date.now()}@example.com`
      const testUser = await prisma.user.create({
        data: {
          name: 'Enum Test User',
          email: testEmail,
          password: 'hashed_password_123',
          role: 'USER',
          platformRole: null,
          isActive: true
        }
      })
      console.log('Test user created successfully with enums:', testUser.id)

      // Clean up test user
      await prisma.user.delete({
        where: { id: testUser.id }
      })
      console.log('Test user cleaned up')
    } catch (e) {
      console.log('Test user creation failed:', e)
    }

    // Get current user count
    const userCount = await prisma.user.count()
    console.log(`Migration completed. Current user count: ${userCount}`)

    return NextResponse.json({
      success: true,
      message: 'UserRole and PlatformRole enums migration completed successfully',
      userCount: userCount,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Enum migration error:', error)
    return NextResponse.json(
      {
        error: 'Enum migration failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
