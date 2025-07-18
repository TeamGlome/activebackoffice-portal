// Database models and types
export interface Entity {
  id: string
  name: string
  type: string
  status: 'active' | 'trial' | 'suspended' | 'inactive'
  subscription_plan: 'starter' | 'professional' | 'enterprise'
  created_at: string
  updated_at: string
  settings: {
    timezone: string
    currency: string
    fiscal_year_start: string
  }
  billing: {
    subscription_id?: string
    current_period_start?: string
    current_period_end?: string
    monthly_amount: number
  }
  compliance: {
    score: number
    last_assessment: string
    violations_count: number
  }
  integrations: {
    quickbooks?: {
      connected: boolean
      company_id?: string
      access_token_expires?: string
      last_sync?: string
    }
    fiix?: {
      connected: boolean
      tenant_id?: string
      last_sync?: string
    }
    nyc_compliance?: {
      connected: boolean
      api_key?: string
      last_sync?: string
    }
  }
}

export interface User {
  id: string
  email: string
  name: string
  entity_id: string
  role: 'platform_admin' | 'entity_admin' | 'property_manager' | 'compliance_officer' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
  created_at: string
  last_login?: string
  permissions: string[]
  profile: {
    phone?: string
    department?: string
    title?: string
  }
}

export interface ApiKey {
  id: string
  entity_id: string
  name: string
  key_prefix: string
  permissions: string[]
  created_by: string
  created_at: string
  last_used?: string
  expires_at?: string
  status: 'active' | 'revoked'
}

export interface Integration {
  id: string
  entity_id: string
  type: 'quickbooks' | 'fiix' | 'nyc_compliance' | 'plaid' | 'google_drive'
  status: 'connected' | 'disconnected' | 'error' | 'syncing'
  credentials: Record<string, any>
  settings: Record<string, any>
  last_sync: string
  sync_frequency: 'realtime' | 'hourly' | 'daily' | 'weekly'
  created_at: string
  updated_at: string
}
