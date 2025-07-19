import { NextRequest, NextResponse } from 'next/server'
import { ApiKey } from '../../../../lib/database-types'
import { randomBytes } from 'crypto'

// Mock database - replace with actual database in production
const apiKeys: ApiKey[] = [
// ... existing code ... <rest of the apiKeys array and all other code in the file>
]
