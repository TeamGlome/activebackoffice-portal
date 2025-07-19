// Comprehensive Integration Management System for Active Back Office

export type IntegrationType =
  | 'quickbooks' | 'plaid' | 'google_drive' | 'onedrive' | 'dropbox' | 'sharepoint'
  | 'google_sheets' | 'excel_online' | 'skyvia' | 'pipedream'
  | 'fiix' | 'watchguard' | 'custom_api'

export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending' | 'syncing'

export type IntegrationCategory =
  | 'accounting' | 'banking' | 'storage' | 'spreadsheet' | 'automation'
  | 'maintenance' | 'security' | 'api'

export interface Integration {
  id: string
  entityId: string
  type: IntegrationType
  category: IntegrationCategory
  name: string
  description: string
  status: IntegrationStatus
  isEnabled: boolean
  lastSync: string | null
  lastError: string | null
  config: IntegrationConfig
  credentials: IntegrationCredentials
  metadata: IntegrationMetadata
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface IntegrationConfig {
  // Common config
  syncInterval?: number // minutes
  autoSync?: boolean
  retryAttempts?: number
  webhookUrl?: string

  // Service-specific config
  [key: string]: unknown
}

export interface IntegrationCredentials {
  // OAuth tokens
  accessToken?: string
  refreshToken?: string
  tokenExpiry?: string

  // API keys
  apiKey?: string
  clientId?: string
  clientSecret?: string

  // Service-specific
  [key: string]: unknown
}

export interface IntegrationMetadata {
  // Sync statistics
  totalSyncs?: number
  successfulSyncs?: number
  failedSyncs?: number
  lastSyncDuration?: number

  // Data counts
  recordsImported?: number
  recordsExported?: number

  // Service-specific metadata
  [key: string]: unknown
}

// QuickBooks Integration Types
export interface QuickBooksConfig extends IntegrationConfig {
  companyId: string
  baseUrl: string
  sandboxMode: boolean
  syncAccounts: boolean
  syncCustomers: boolean
  syncInvoices: boolean
  syncPayments: boolean
  syncItems: boolean
}

export interface QuickBooksData {
  companyInfo: {
    id: string
    name: string
    country: string
    fiscalYearStart: string
  }
  accounts: QuickBooksAccount[]
  customers: QuickBooksCustomer[]
  invoices: QuickBooksInvoice[]
  payments: QuickBooksPayment[]
  items: QuickBooksItem[]
}

export interface QuickBooksAccount {
  id: string
  name: string
  accountType: string
  accountSubType: string
  currentBalance: number
  active: boolean
}

export interface QuickBooksCustomer {
  id: string
  name: string
  displayName: string
  companyName?: string
  primaryEmail?: string
  primaryPhone?: string
  billAddr?: QuickBooksAddress
  balance: number
  active: boolean
}

export interface QuickBooksInvoice {
  id: string
  docNumber: string
  customerId: string
  customerName: string
  totalAmt: number
  balance: number
  dueDate: string
  txnDate: string
  emailStatus: string
  printStatus: string
  line: QuickBooksInvoiceLine[]
}

export interface QuickBooksInvoiceLine {
  id: string
  lineNum: number
  description: string
  amount: number
  detailType: string
  itemId?: string
  itemName?: string
}

export interface QuickBooksPayment {
  id: string
  customerRef: string
  totalAmt: number
  txnDate: string
  paymentMethodRef?: string
  line: QuickBooksPaymentLine[]
}

export interface QuickBooksPaymentLine {
  amount: number
  linkedTxn: {
    txnId: string
    txnType: string
  }[]
}

export interface QuickBooksItem {
  id: string
  name: string
  description?: string
  type: string
  unitPrice?: number
  taxable: boolean
  active: boolean
}

export interface QuickBooksAddress {
  line1?: string
  line2?: string
  city?: string
  countrySubDivisionCode?: string
  postalCode?: string
  country?: string
}

// Plaid Integration Types
export interface PlaidConfig extends IntegrationConfig {
  environment: 'sandbox' | 'development' | 'production'
  clientName: string
  language: string
  countryCodes: string[]
  products: string[]
}

export interface PlaidData {
  accounts: PlaidAccount[]
  transactions: PlaidTransaction[]
  balances: PlaidBalance[]
  institutions: PlaidInstitution[]
}

export interface PlaidAccount {
  accountId: string
  balances: {
    available: number | null
    current: number | null
    limit: number | null
  }
  mask: string
  name: string
  officialName: string | null
  type: string
  subtype: string | null
}

export interface PlaidTransaction {
  accountId: string
  amount: number
  isoCurrencyCode: string
  unofficialCurrencyCode: string | null
  category: string[]
  categoryId: string
  checkNumber: string | null
  date: string
  datetime: string | null
  authorizedDate: string | null
  location: {
    address: string | null
    city: string | null
    region: string | null
    postalCode: string | null
    country: string | null
    lat: number | null
    lon: number | null
    storeNumber: string | null
  }
  name: string
  merchantName: string | null
  originalDescription: string | null
  paymentChannel: string
  paymentMeta: {
    byOrderOf: string | null
    payee: string | null
    payer: string | null
    paymentMethod: string | null
    paymentProcessor: string | null
    ppdId: string | null
    reason: string | null
    referenceNumber: string | null
  }
  pending: boolean
  pendingTransactionId: string | null
  accountOwner: string | null
  transactionId: string
  transactionType: string
}

export interface PlaidBalance {
  accountId: string
  available: number | null
  current: number | null
  limit: number | null
  isoCurrencyCode: string
  unofficialCurrencyCode: string | null
  lastUpdatedDatetime: string | null
}

export interface PlaidInstitution {
  institutionId: string
  name: string
  products: string[]
  countryCodes: string[]
  url: string | null
  primaryColor: string | null
  logo: string | null
  routingNumbers: string[]
  oauth: boolean
  status: {
    itemLogins: {
      status: string
      lastStatusChange: string
    }
    transactionsUpdates: {
      status: string
      lastStatusChange: string
    }
    auth: {
      status: string
      lastStatusChange: string
    }
    identity: {
      status: string
      lastStatusChange: string
    }
    investmentsUpdates: {
      status: string
      lastStatusChange: string
    }
    liabilitiesUpdates: {
      status: string
      lastStatusChange: string
    }
    liabilities: {
      status: string
      lastStatusChange: string
    }
    investments: {
      status: string
      lastStatusChange: string
    }
  }
}

// Cloud Storage Integration Types
export interface CloudStorageConfig extends IntegrationConfig {
  provider: 'google_drive' | 'onedrive' | 'dropbox' | 'sharepoint'
  rootFolder?: string
  allowedFileTypes: string[]
  maxFileSize: number // MB
  autoImport: boolean
  importSchedule?: string // cron expression
}

export interface CloudStorageFile {
  id: string
  name: string
  mimeType: string
  size: number
  modifiedTime: string
  createdTime: string
  parents?: string[]
  webViewLink?: string
  downloadUrl?: string
  thumbnailLink?: string
}

// Spreadsheet Integration Types
export interface SpreadsheetConfig extends IntegrationConfig {
  provider: 'google_sheets' | 'excel_online'
  spreadsheetId: string
  worksheetName?: string
  headerRow: number
  dataStartRow: number
  mapping: FieldMapping[]
  syncDirection: 'import' | 'export' | 'bidirectional'
}

export interface FieldMapping {
  sourceField: string
  targetField: string
  dataType: 'string' | 'number' | 'date' | 'boolean'
  transform?: string // transformation function name
  required: boolean
}

// Automation Platform Types
export interface AutomationConfig extends IntegrationConfig {
  provider: 'skyvia' | 'pipedream'
  workflowId?: string
  triggers: AutomationTrigger[]
  actions: AutomationAction[]
}

export interface AutomationTrigger {
  id: string
  type: string
  conditions: Record<string, unknown>
  schedule?: string
}

export interface AutomationAction {
  id: string
  type: string
  parameters: Record<string, unknown>
  retryPolicy?: {
    maxRetries: number
    backoffType: 'fixed' | 'exponential'
    delay: number
  }
}

// Fiix Software Integration Types
export interface FiixConfig extends IntegrationConfig {
  baseUrl: string
  version: string
  syncWorkOrders: boolean
  syncAssets: boolean
  syncTechnicians: boolean
  syncParts: boolean
}

export interface FiixWorkOrder {
  id: number
  code: string
  description: string
  priority: number
  assetId?: number
  assetCode?: string
  maintenanceType: string
  requestedByUserId?: number
  assignedUserId?: number
  supervisorUserId?: number
  statusId: number
  status: string
  createdDate: string
  updatedDate: string
  completedDate?: string
  estimatedHours?: number
  actualHours?: number
  tasks: FiixTask[]
}

export interface FiixTask {
  id: number
  workOrderId: number
  description: string
  estimatedHours?: number
  actualHours?: number
  completedDate?: string
  assignedUserId?: number
}

export interface FiixAsset {
  id: number
  code: string
  name: string
  description?: string
  categoryId?: number
  category?: string
  locationId?: number
  location?: string
  isActive: boolean
  createdDate: string
  updatedDate: string
}

// WatchGuard Integration Types
export interface WatchGuardConfig extends IntegrationConfig {
  serverUrl: string
  apiVersion: string
  pollingInterval: number // minutes
  alertTypes: string[]
  deviceFilters: string[]
}

export interface WatchGuardAlert {
  id: string
  deviceId: string
  deviceName: string
  alertType: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: string
  acknowledged: boolean
  resolvedTimestamp?: string
  metadata: Record<string, unknown>
}

export interface WatchGuardDevice {
  id: string
  name: string
  model: string
  serialNumber: string
  firmwareVersion: string
  status: 'online' | 'offline' | 'maintenance'
  lastSeen: string
  location?: string
  ipAddress: string
  metadata: Record<string, unknown>
}



// Integration Service Registry
export const INTEGRATION_REGISTRY: Record<IntegrationType, {
  name: string
  description: string
  category: IntegrationCategory
  icon: string
  color: string
  features: string[]
  requiredPermissions: string[]
  configSchema: Record<string, unknown>
}> = {
  quickbooks: {
    name: 'QuickBooks Online',
    description: 'Sync accounting data, invoices, and payments',
    category: 'accounting',
    icon: 'DollarSign',
    color: 'blue',
    features: ['Chart of Accounts', 'Customer Management', 'Invoice Tracking', 'Payment Processing'],
    requiredPermissions: ['entity.integrations.quickbooks.connect'],
    configSchema: {} // JSON schema for validation
  },
  plaid: {
    name: 'Plaid Banking',
    description: 'Connect bank accounts and sync transactions',
    category: 'banking',
    icon: 'CreditCard',
    color: 'green',
    features: ['Bank Account Connection', 'Transaction History', 'Balance Monitoring', 'Payment Verification'],
    requiredPermissions: ['entity.integrations.plaid.connect'],
    configSchema: {}
  },
  google_drive: {
    name: 'Google Drive',
    description: 'Import property data from Google Drive files',
    category: 'storage',
    icon: 'Cloud',
    color: 'blue',
    features: ['CSV Import', 'File Sync', 'Automated Upload', 'Folder Monitoring'],
    requiredPermissions: ['entity.integrations.storage.connect'],
    configSchema: {}
  },
  onedrive: {
    name: 'OneDrive',
    description: 'Microsoft OneDrive file integration',
    category: 'storage',
    icon: 'Cloud',
    color: 'blue',
    features: ['File Import', 'Document Sync', 'SharePoint Integration'],
    requiredPermissions: ['entity.integrations.storage.connect'],
    configSchema: {}
  },
  dropbox: {
    name: 'Dropbox',
    description: 'Dropbox file storage integration',
    category: 'storage',
    icon: 'Cloud',
    color: 'blue',
    features: ['File Import', 'Automated Sync', 'Team Folders'],
    requiredPermissions: ['entity.integrations.storage.connect'],
    configSchema: {}
  },
  sharepoint: {
    name: 'SharePoint',
    description: 'Microsoft SharePoint document management',
    category: 'storage',
    icon: 'Database',
    color: 'blue',
    features: ['Document Libraries', 'Team Sites', 'Enterprise Integration'],
    requiredPermissions: ['entity.integrations.storage.connect'],
    configSchema: {}
  },
  google_sheets: {
    name: 'Google Sheets',
    description: 'Real-time spreadsheet synchronization',
    category: 'spreadsheet',
    icon: 'FileSpreadsheet',
    color: 'green',
    features: ['Live Data Sync', 'Automated Reports', 'Bidirectional Sync'],
    requiredPermissions: ['entity.integrations.sheets.connect'],
    configSchema: {}
  },
  excel_online: {
    name: 'Excel Online',
    description: 'Advanced Excel workbooks with charts, pivot tables, and formulas',
    category: 'spreadsheet',
    icon: 'FileSpreadsheet',
    color: 'green',
    features: ['Charts & Graphs', 'Pivot Tables', 'Advanced Formulas', 'AI Data Analysis'],
    requiredPermissions: ['entity.integrations.excel.connect'],
    configSchema: {}
  },
  skyvia: {
    name: 'Skyvia',
    description: 'No-code data integration platform',
    category: 'automation',
    icon: 'Zap',
    color: 'purple',
    features: ['Data Transformation', 'Scheduled Sync', 'Multi-source Integration'],
    requiredPermissions: ['entity.integrations.skyvia.configure'],
    configSchema: {}
  },
  pipedream: {
    name: 'Pipedream',
    description: 'Workflow automation and integration',
    category: 'automation',
    icon: 'Workflow',
    color: 'purple',
    features: ['Custom Workflows', 'Event-driven Automation', 'API Orchestration'],
    requiredPermissions: ['entity.integrations.pipedream.configure'],
    configSchema: {}
  },
  fiix: {
    name: 'Fiix Software',
    description: 'Maintenance management system integration',
    category: 'maintenance',
    icon: 'Wrench',
    color: 'orange',
    features: ['Work Order Sync', 'Asset Management', 'Technician Scheduling'],
    requiredPermissions: ['entity.integrations.fiix.connect'],
    configSchema: {}
  },
  watchguard: {
    name: 'WatchGuard',
    description: 'Security monitoring, threat detection, and device management',
    category: 'security',
    icon: 'Shield',
    color: 'red',
    features: ['Real-time Monitoring', 'Threat Detection', 'Security Policies', 'Device Management'],
    requiredPermissions: ['entity.integrations.watchguard.connect'],
    configSchema: {}
  },

  custom_api: {
    name: 'Custom API',
    description: 'Custom REST API integration',
    category: 'api',
    icon: 'Code',
    color: 'gray',
    features: ['REST API', 'Custom Endpoints', 'Webhook Support'],
    requiredPermissions: ['entity.integrations.webhook.create'],
    configSchema: {}
  }
}

// Integration Management Functions
export class IntegrationManager {
  private entityId: string

  constructor(entityId: string) {
    this.entityId = entityId
  }

  async getIntegrations(): Promise<Integration[]> {
    // Mock data for now - replace with API call
    return []
  }

  async getIntegration(id: string): Promise<Integration | null> {
    // Mock implementation
    return null
  }

  async createIntegration(type: IntegrationType, config: IntegrationConfig): Promise<Integration> {
    // Mock implementation
    throw new Error('Not implemented')
  }

  async updateIntegration(id: string, updates: Partial<Integration>): Promise<Integration> {
    // Mock implementation
    throw new Error('Not implemented')
  }

  async deleteIntegration(id: string): Promise<boolean> {
    // Mock implementation
    return false
  }

  async syncIntegration(id: string): Promise<boolean> {
    // Mock implementation
    return false
  }

  async testConnection(type: IntegrationType, credentials: IntegrationCredentials): Promise<boolean> {
    // Mock implementation
    return false
  }

  async getIntegrationData(id: string): Promise<unknown> {
    // Mock implementation
    return null
  }
}

// OAuth Helper Functions
export const OAuthHelpers = {
  generateAuthUrl: (provider: IntegrationType, redirectUri: string, state: string): string => {
    // Mock implementation - replace with actual OAuth URLs
    const baseUrls: Record<string, string> = {
      quickbooks: 'https://appcenter.intuit.com/connect/oauth2',
      google_drive: 'https://accounts.google.com/o/oauth2/v2/auth',
      google_sheets: 'https://accounts.google.com/o/oauth2/v2/auth',
      onedrive: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      excel_online: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      dropbox: 'https://www.dropbox.com/oauth2/authorize'
    }

    return baseUrls[provider] || '#'
  },

  exchangeCodeForTokens: async (provider: IntegrationType, code: string, redirectUri: string): Promise<IntegrationCredentials> => {
    // Mock implementation - replace with actual token exchange
    throw new Error('Not implemented')
  },

  refreshAccessToken: async (provider: IntegrationType, refreshToken: string): Promise<IntegrationCredentials> => {
    // Mock implementation - replace with actual token refresh
    throw new Error('Not implemented')
  }
}
