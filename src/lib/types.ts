export interface QuickBooksIntegration {
  entity_id: string
  type: 'quickbooks'
  status: 'connected' | 'disconnected' | 'error'
  company_id: string
  access_token: string
  refresh_token: string
  expires_at: string
  company_info: QuickBooksCompanyInfo | null
  connected_at: string
  last_sync: string | null
}

export interface QuickBooksCompanyInfo {
  CompanyName: string
  Country: string
  CompanyType: string
}

export interface SyncResults {
  entity_id: string
  sync_started_at: string
  sync_completed_at?: string
  data: SyncData
  errors: string[]
  success: boolean
  message?: string
}

export interface SyncData {
  accounts?: QuickBooksAccount[]
  items?: QuickBooksItem[]
  customers?: QuickBooksCustomer[]
  transactions?: Record<string, QuickBooksTransaction[]>
}

export interface QuickBooksAccount {
  Id: string
  Name: string
  AccountType: string
  CurrentBalance: number
}

export interface QuickBooksItem {
  Id: string
  Name: string
  Type: string
  UnitPrice?: number
}

export interface QuickBooksCustomer {
  Id: string
  Name: string
  CompanyName?: string
  PrimaryEmailAddr?: {
    Address: string
  }
}

export interface QuickBooksTransaction {
  Id: string
  TotalAmt: number
  TxnDate: string
  Line: TransactionLine[]
}

export interface TransactionLine {
  Amount: number
  DetailType: string
}

export interface FinancialReportData {
  entity_id: string
  report_type: string
  period: string
  generated_at: string
  last_sync: string
  data: Record<string, unknown>
}

export interface ConnectionStatus {
  connected: boolean
  company_info?: QuickBooksCompanyInfo
  last_sync?: string
  error?: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

export interface StateData {
  entity_id: string
  user_id: string
  timestamp: number
}
