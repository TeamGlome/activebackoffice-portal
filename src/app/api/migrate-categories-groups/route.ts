import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/auth'

export async function GET(request: NextRequest) {
  return runCategoriesGroupsMigration()
}

export async function POST(request: NextRequest) {
  return runCategoriesGroupsMigration()
}

async function runCategoriesGroupsMigration() {
  try {
    console.log('Starting Categories and Groups schema migration...')

    // Add category column to Entity table if it doesn't exist
    try {
      await prisma.$executeRaw`ALTER TABLE "Entity" ADD COLUMN IF NOT EXISTS "category" TEXT;`
      console.log('Entity category column added/verified')
    } catch (e) {
      console.log('Entity category column may already exist:', e)
    }

    // Add userGroup column to User table if it doesn't exist
    try {
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "userGroup" TEXT;`
      console.log('User userGroup column added/verified')
    } catch (e) {
      console.log('User userGroup column may already exist:', e)
    }

    // Create EntityCategory table if it doesn't exist
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "EntityCategory" (
          "id" TEXT NOT NULL,
          "entityId" TEXT,
          "type" TEXT NOT NULL,
          "category" TEXT NOT NULL,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,

          CONSTRAINT "EntityCategory_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "EntityCategory_entityId_type_category_key" UNIQUE ("entityId", "type", "category")
        );
      `
      console.log('EntityCategory table created/verified')

      // Add foreign key constraint if it doesn't exist
      await prisma.$executeRaw`
        DO $$ BEGIN
          ALTER TABLE "EntityCategory" ADD CONSTRAINT "EntityCategory_entityId_fkey"
          FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `
    } catch (e) {
      console.log('EntityCategory table creation note:', e)
    }

    // Create UserGroup table if it doesn't exist
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "UserGroup" (
          "id" TEXT NOT NULL,
          "entityId" TEXT,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "permissions" JSONB NOT NULL DEFAULT '{}',
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,

          CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "UserGroup_entityId_name_key" UNIQUE ("entityId", "name")
        );
      `
      console.log('UserGroup table created/verified')

      // Add foreign key constraint if it doesn't exist
      await prisma.$executeRaw`
        DO $$ BEGIN
          ALTER TABLE "UserGroup" ADD CONSTRAINT "UserGroup_entityId_fkey"
          FOREIGN KEY ("entityId") REFERENCES "Entity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `
    } catch (e) {
      console.log('UserGroup table creation note:', e)
    }

    // Insert default entity categories (platform-wide)
    const defaultCategories = [
      { type: 'Real Estate', category: 'Building' },
      { type: 'Real Estate', category: 'Parking' },
      { type: 'Real Estate', category: 'Townhouse' },
      { type: 'Real Estate', category: 'Apartment Complex' },
      { type: 'Real Estate', category: 'Commercial' },
      { type: 'Real Estate', category: 'Industrial' },
      { type: 'Property Management', category: 'Residential' },
      { type: 'Property Management', category: 'Commercial' },
      { type: 'Property Management', category: 'Mixed Use' },
      { type: 'Construction', category: 'New Construction' },
      { type: 'Construction', category: 'Renovation' },
      { type: 'Construction', category: 'Maintenance' },
      { type: 'Facilities Management', category: 'Office Buildings' },
      { type: 'Facilities Management', category: 'Retail Spaces' },
      { type: 'Facilities Management', category: 'Warehouses' }
    ]

    for (const cat of defaultCategories) {
      try {
        await prisma.entityCategory.upsert({
          where: {
            entityId_type_category: {
              entityId: null,
              type: cat.type,
              category: cat.category
            }
          },
          update: {},
          create: {
            entityId: null,
            type: cat.type,
            category: cat.category,
            isActive: true
          }
        })
      } catch (e) {
        console.log(`Category ${cat.type}/${cat.category} already exists or error:`, e)
      }
    }

    // Insert default user groups (platform-wide)
    const defaultGroups = [
      { name: 'Administrators', description: 'Full administrative access' },
      { name: 'Managers', description: 'Management level access' },
      { name: 'Supervisors', description: 'Supervisory access' },
      { name: 'Technicians', description: 'Technical staff access' },
      { name: 'Accountants', description: 'Financial and accounting access' },
      { name: 'Maintenance', description: 'Maintenance and facilities access' },
      { name: 'Sales', description: 'Sales and customer access' },
      { name: 'Support', description: 'Customer support access' },
      { name: 'Viewers', description: 'Read-only access' }
    ]

    for (const group of defaultGroups) {
      try {
        await prisma.userGroup.upsert({
          where: {
            entityId_name: {
              entityId: null,
              name: group.name
            }
          },
          update: {},
          create: {
            entityId: null,
            name: group.name,
            description: group.description,
            permissions: {},
            isActive: true
          }
        })
      } catch (e) {
        console.log(`Group ${group.name} already exists or error:`, e)
      }
    }

    // Get final counts
    const categoriesCount = await prisma.entityCategory.count()
    const groupsCount = await prisma.userGroup.count()
    const entitiesCount = await prisma.entity.count()
    const usersCount = await prisma.user.count()

    console.log(`Migration completed. Categories: ${categoriesCount}, Groups: ${groupsCount}`)

    return NextResponse.json({
      success: true,
      message: 'Categories and Groups migration completed successfully',
      counts: {
        categories: categoriesCount,
        groups: groupsCount,
        entities: entitiesCount,
        users: usersCount
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Categories/Groups migration error:', error)
    return NextResponse.json(
      {
        error: 'Categories/Groups migration failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        success: false,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
