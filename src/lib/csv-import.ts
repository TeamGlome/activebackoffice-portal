// Comprehensive CSV Import Engine for Active Back Office

export type DataType = 'string' | 'number' | 'date' | 'boolean' | 'email' | 'phone' | 'currency' | 'address'

export type ImportStatus = 'pending' | 'validating' | 'processing' | 'completed' | 'error' | 'cancelled'

export interface FieldMapping {
  sourceField: string
  targetField: string
  dataType: DataType
  isRequired: boolean
  defaultValue?: string | number | boolean
  transform?: string // Transformation function name
  validation?: ValidationRule[]
}

export interface ValidationRule {
  type: 'required' | 'format' | 'range' | 'custom'
  message: string
  config?: {
    pattern?: RegExp
    options?: string[]
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    excludeZero?: boolean
    dateFormat?: string[]
    [key: string]: unknown
  }
}

export interface ImportTemplate {
  id: string
  name: string
  description: string
  category: 'property' | 'tenant' | 'maintenance' | 'financial' | 'document' | 'custom'
  fieldMappings: FieldMapping[]
  requiredFields: string[]
  optionalFields: string[]
  sampleData: Record<string, unknown>[]
  validationRules: ValidationRule[]
  transformations: Record<string, (...args: unknown[]) => unknown>
}

export interface ImportJob {
  id: string
  entityId: string
  templateId: string
  fileName: string
  fileSize: number
  fileUrl: string
  sourceIntegration: string
  status: ImportStatus
  progress: number
  totalRows: number
  processedRows: number
  validRows: number
  errorRows: number
  warnings: ImportWarning[]
  errors: ImportError[]
  fieldMappings: FieldMapping[]
  createdAt: string
  startedAt?: string
  completedAt?: string
  createdBy: string
}

export interface ImportWarning {
  row: number
  field: string
  message: string
  value: unknown
  suggestion?: string
}

export interface ImportError {
  row: number
  field?: string
  message: string
  value?: unknown
  severity: 'warning' | 'error' | 'critical'
}

export interface ImportResult {
  jobId: string
  status: ImportStatus
  totalRows: number
  successfulRows: number
  errorRows: number
  warnings: ImportWarning[]
  errors: ImportError[]
  importedData: Record<string, unknown>[]
  duration: number
}

// Pre-defined Import Templates
export const IMPORT_TEMPLATES: Record<string, ImportTemplate> = {
  // Property Listings Template
  properties: {
    id: 'properties',
    name: 'Property Listings',
    description: 'Import property information including addresses, specifications, and details',
    category: 'property',
    fieldMappings: [
      {
        sourceField: 'name',
        targetField: 'property_name',
        dataType: 'string',
        isRequired: true,
        validation: [
          { type: 'required', message: 'Property name is required' },
          { type: 'format', message: 'Property name must be at least 2 characters', config: { minLength: 2 } }
        ]
      },
      {
        sourceField: 'address',
        targetField: 'street_address',
        dataType: 'address',
        isRequired: true,
        validation: [
          { type: 'required', message: 'Property address is required' }
        ]
      },
      {
        sourceField: 'type',
        targetField: 'property_type',
        dataType: 'string',
        isRequired: true,
        validation: [
          { type: 'format', message: 'Must be one of: Apartment, House, Condo, Commercial',
            config: { options: ['Apartment', 'House', 'Condo', 'Commercial', 'Mixed Use'] } }
        ]
      },
      {
        sourceField: 'units',
        targetField: 'total_units',
        dataType: 'number',
        isRequired: true,
        validation: [
          { type: 'range', message: 'Units must be between 1 and 1000', config: { min: 1, max: 1000 } }
        ]
      },
      {
        sourceField: 'square_feet',
        targetField: 'square_footage',
        dataType: 'number',
        isRequired: false,
        validation: [
          { type: 'range', message: 'Square footage must be positive', config: { min: 1 } }
        ]
      },
      {
        sourceField: 'year_built',
        targetField: 'construction_year',
        dataType: 'number',
        isRequired: false,
        validation: [
          { type: 'range', message: 'Year built must be between 1800 and current year',
            config: { min: 1800, max: new Date().getFullYear() } }
        ]
      },
      {
        sourceField: 'rent',
        targetField: 'base_rent',
        dataType: 'currency',
        isRequired: false,
        validation: [
          { type: 'range', message: 'Rent must be positive', config: { min: 0 } }
        ]
      }
    ],
    requiredFields: ['name', 'address', 'type', 'units'],
    optionalFields: ['description', 'amenities', 'year_built', 'square_feet', 'rent', 'parking', 'pets_allowed'],
    sampleData: [
      {
        name: 'Sunset Apartments',
        address: '123 Main St, Anytown, ST 12345',
        type: 'Apartment',
        units: 24,
        square_feet: 850,
        year_built: 1995,
        rent: 1200
      },
      {
        name: 'Oak Grove Complex',
        address: '456 Oak Ave, Anytown, ST 12345',
        type: 'Apartment',
        units: 36,
        square_feet: 950,
        year_built: 2005,
        rent: 1350
      }
    ],
    validationRules: [],
    transformations: {}
  },

  // Tenant Information Template
  tenants: {
    id: 'tenants',
    name: 'Tenant Information',
    description: 'Import tenant contact details, lease information, and payment data',
    category: 'tenant',
    fieldMappings: [
      {
        sourceField: 'name',
        targetField: 'full_name',
        dataType: 'string',
        isRequired: true,
        validation: [
          { type: 'required', message: 'Tenant name is required' },
          { type: 'format', message: 'Name must contain both first and last name', config: { pattern: /^[A-Za-z\s]{2,}$/ } }
        ]
      },
      {
        sourceField: 'email',
        targetField: 'email_address',
        dataType: 'email',
        isRequired: true,
        validation: [
          { type: 'required', message: 'Email address is required' },
          { type: 'format', message: 'Must be a valid email address', config: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ } }
        ]
      },
      {
        sourceField: 'phone',
        targetField: 'phone_number',
        dataType: 'phone',
        isRequired: false,
        validation: [
          { type: 'format', message: 'Must be a valid phone number', config: { pattern: /^\+?[\d\s\-\(\)]{10,}$/ } }
        ]
      },
      {
        sourceField: 'unit',
        targetField: 'unit_number',
        dataType: 'string',
        isRequired: true,
        validation: [
          { type: 'required', message: 'Unit number is required' }
        ]
      },
      {
        sourceField: 'lease_start',
        targetField: 'lease_start_date',
        dataType: 'date',
        isRequired: true,
        validation: [
          { type: 'required', message: 'Lease start date is required' },
          { type: 'format', message: 'Must be a valid date (YYYY-MM-DD or MM/DD/YYYY)', config: { dateFormat: ['YYYY-MM-DD', 'MM/DD/YYYY'] } }
        ]
      },
      {
        sourceField: 'lease_end',
        targetField: 'lease_end_date',
        dataType: 'date',
        isRequired: false,
        validation: [
          { type: 'format', message: 'Must be a valid date', config: { dateFormat: ['YYYY-MM-DD', 'MM/DD/YYYY'] } }
        ]
      },
      {
        sourceField: 'rent_amount',
        targetField: 'monthly_rent',
        dataType: 'currency',
        isRequired: false,
        validation: [
          { type: 'range', message: 'Rent amount must be positive', config: { min: 0 } }
        ]
      }
    ],
    requiredFields: ['name', 'email', 'unit', 'lease_start'],
    optionalFields: ['phone', 'emergency_contact', 'lease_end', 'rent_amount', 'security_deposit', 'notes'],
    sampleData: [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        unit: 'A-102',
        lease_start: '2024-01-15',
        lease_end: '2024-12-31',
        rent_amount: 1200
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '(555) 987-6543',
        unit: 'B-205',
        lease_start: '2024-03-01',
        lease_end: '2025-02-28',
        rent_amount: 1350
      }
    ],
    validationRules: [],
    transformations: {}
  },

  // Maintenance Records Template
  maintenance: {
    id: 'maintenance',
    name: 'Maintenance Records',
    description: 'Import maintenance requests, work orders, and service history',
    category: 'maintenance',
    fieldMappings: [
      {
        sourceField: 'property',
        targetField: 'property_name',
        dataType: 'string',
        isRequired: true,
        validation: [
          { type: 'required', message: 'Property name is required' }
        ]
      },
      {
        sourceField: 'unit',
        targetField: 'unit_number',
        dataType: 'string',
        isRequired: false
      },
      {
        sourceField: 'issue',
        targetField: 'description',
        dataType: 'string',
        isRequired: true,
        validation: [
          { type: 'required', message: 'Issue description is required' },
          { type: 'format', message: 'Description must be at least 10 characters', config: { minLength: 10 } }
        ]
      },
      {
        sourceField: 'date_reported',
        targetField: 'reported_date',
        dataType: 'date',
        isRequired: true,
        validation: [
          { type: 'required', message: 'Date reported is required' },
          { type: 'format', message: 'Must be a valid date', config: { dateFormat: ['YYYY-MM-DD', 'MM/DD/YYYY'] } }
        ]
      },
      {
        sourceField: 'priority',
        targetField: 'priority_level',
        dataType: 'string',
        isRequired: false,
        defaultValue: 'Medium',
        validation: [
          { type: 'format', message: 'Priority must be Low, Medium, High, or Critical',
            config: { options: ['Low', 'Medium', 'High', 'Critical'] } }
        ]
      },
      {
        sourceField: 'status',
        targetField: 'current_status',
        dataType: 'string',
        isRequired: false,
        defaultValue: 'Pending',
        validation: [
          { type: 'format', message: 'Status must be Pending, In Progress, Completed, or Cancelled',
            config: { options: ['Pending', 'In Progress', 'Completed', 'Cancelled'] } }
        ]
      },
      {
        sourceField: 'assigned_to',
        targetField: 'assigned_technician',
        dataType: 'string',
        isRequired: false
      },
      {
        sourceField: 'completion_date',
        targetField: 'completed_date',
        dataType: 'date',
        isRequired: false,
        validation: [
          { type: 'format', message: 'Must be a valid date', config: { dateFormat: ['YYYY-MM-DD', 'MM/DD/YYYY'] } }
        ]
      },
      {
        sourceField: 'cost',
        targetField: 'total_cost',
        dataType: 'currency',
        isRequired: false,
        validation: [
          { type: 'range', message: 'Cost must be positive', config: { min: 0 } }
        ]
      }
    ],
    requiredFields: ['property', 'issue', 'date_reported'],
    optionalFields: ['unit', 'priority', 'assigned_to', 'status', 'completion_date', 'cost', 'notes'],
    sampleData: [
      {
        property: 'Sunset Apartments',
        unit: 'A-105',
        issue: 'Leaking faucet in kitchen sink',
        date_reported: '2024-07-15',
        priority: 'Medium',
        status: 'In Progress',
        assigned_to: 'Tom Wilson',
        cost: 150
      },
      {
        property: 'Oak Grove Complex',
        unit: 'B-103',
        issue: 'Air conditioning not working properly',
        date_reported: '2024-07-16',
        priority: 'High',
        status: 'Pending',
        assigned_to: 'Lisa Chen'
      }
    ],
    validationRules: [],
    transformations: {}
  },

  // Financial Records Template
  financial: {
    id: 'financial',
    name: 'Financial Records',
    description: 'Import financial transactions, rent payments, and expense records',
    category: 'financial',
    fieldMappings: [
      {
        sourceField: 'date',
        targetField: 'transaction_date',
        dataType: 'date',
        isRequired: true,
        validation: [
          { type: 'required', message: 'Transaction date is required' },
          { type: 'format', message: 'Must be a valid date', config: { dateFormat: ['YYYY-MM-DD', 'MM/DD/YYYY'] } }
        ]
      },
      {
        sourceField: 'description',
        targetField: 'transaction_description',
        dataType: 'string',
        isRequired: true,
        validation: [
          { type: 'required', message: 'Transaction description is required' }
        ]
      },
      {
        sourceField: 'amount',
        targetField: 'transaction_amount',
        dataType: 'currency',
        isRequired: true,
        validation: [
          { type: 'required', message: 'Transaction amount is required' },
          { type: 'range', message: 'Amount must be non-zero', config: { min: -999999, max: 999999, excludeZero: true } }
        ]
      },
      {
        sourceField: 'type',
        targetField: 'transaction_type',
        dataType: 'string',
        isRequired: true,
        validation: [
          { type: 'required', message: 'Transaction type is required' },
          { type: 'format', message: 'Type must be Income or Expense', config: { options: ['Income', 'Expense'] } }
        ]
      },
      {
        sourceField: 'category',
        targetField: 'expense_category',
        dataType: 'string',
        isRequired: false,
        validation: [
          { type: 'format', message: 'Invalid category',
            config: { options: ['Rent', 'Maintenance', 'Utilities', 'Insurance', 'Marketing', 'Legal', 'Other'] } }
        ]
      },
      {
        sourceField: 'property',
        targetField: 'property_name',
        dataType: 'string',
        isRequired: false
      },
      {
        sourceField: 'tenant',
        targetField: 'tenant_name',
        dataType: 'string',
        isRequired: false
      }
    ],
    requiredFields: ['date', 'description', 'amount', 'type'],
    optionalFields: ['category', 'property', 'tenant', 'reference', 'notes'],
    sampleData: [
      {
        date: '2024-07-01',
        description: 'Rent payment - Unit A-102',
        amount: 1200,
        type: 'Income',
        category: 'Rent',
        property: 'Sunset Apartments',
        tenant: 'John Smith'
      },
      {
        date: '2024-07-15',
        description: 'HVAC repair service',
        amount: -450,
        type: 'Expense',
        category: 'Maintenance',
        property: 'Oak Grove Complex'
      }
    ],
    validationRules: [],
    transformations: {}
  }
}

// CSV Import Engine Class
export class CSVImportEngine {
  private entityId: string
  private jobs: Map<string, ImportJob> = new Map()

  constructor(entityId: string) {
    this.entityId = entityId
  }

  // Parse CSV content
  async parseCSV(content: string): Promise<Record<string, unknown>[]> {
    const lines = content.split('\n').filter(line => line.trim())
    if (lines.length < 2) {
      throw new Error('CSV must contain at least a header row and one data row')
    }

    const headers = this.parseCSVLine(lines[0])
    const data: Record<string, unknown>[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i])
      if (values.length !== headers.length) {
        continue // Skip malformed rows
      }

      const row: Record<string, unknown> = {}
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() || ''
      })
      data.push(row)
    }

    return data
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    let i = 0

    while (i < line.length) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i += 2
          continue
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
      i++
    }

    result.push(current)
    return result
  }

  // Create import job
  async createImportJob(
    fileName: string,
    fileSize: number,
    fileUrl: string,
    templateId: string,
    sourceIntegration: string,
    createdBy: string,
    customMappings?: FieldMapping[]
  ): Promise<ImportJob> {
    const template = IMPORT_TEMPLATES[templateId]
    if (!template) {
      throw new Error(`Template ${templateId} not found`)
    }

    const job: ImportJob = {
      id: `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      entityId: this.entityId,
      templateId,
      fileName,
      fileSize,
      fileUrl,
      sourceIntegration,
      status: 'pending',
      progress: 0,
      totalRows: 0,
      processedRows: 0,
      validRows: 0,
      errorRows: 0,
      warnings: [],
      errors: [],
      fieldMappings: customMappings || template.fieldMappings,
      createdAt: new Date().toISOString(),
      createdBy
    }

    this.jobs.set(job.id, job)
    return job
  }

  // Validate data against template
  async validateData(jobId: string, data: Record<string, unknown>[]): Promise<void> {
    const job = this.jobs.get(jobId)
    if (!job) {
      throw new Error(`Job ${jobId} not found`)
    }

    job.status = 'validating'
    job.totalRows = data.length
    job.warnings = []
    job.errors = []

    const template = IMPORT_TEMPLATES[job.templateId]
    if (!template) {
      throw new Error(`Template ${job.templateId} not found`)
    }

    // Validate each row
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex]

      // Check required fields
      for (const mapping of job.fieldMappings.filter(m => m.isRequired)) {
        const value = row[mapping.sourceField]
        if (value === undefined || value === null || value === '') {
          job.errors.push({
            row: rowIndex + 1,
            field: mapping.sourceField,
            message: `Required field '${mapping.sourceField}' is missing or empty`,
            value,
            severity: 'error'
          })
        }
      }

      // Validate field formats and types
      for (const mapping of job.fieldMappings) {
        const value = row[mapping.sourceField]
        if (value !== undefined && value !== null && value !== '') {
          const validationErrors = this.validateField(value, mapping, rowIndex + 1)
          job.errors.push(...validationErrors)
        }
      }

      // Update progress
      job.progress = Math.round(((rowIndex + 1) / data.length) * 50) // 50% for validation
    }

    job.validRows = data.length - job.errors.filter(e => e.severity === 'error').length
    job.errorRows = job.errors.filter(e => e.severity === 'error').length

    this.jobs.set(jobId, job)
  }

  // Validate individual field
  private validateField(value: unknown, mapping: FieldMapping, row: number): ImportError[] {
    const errors: ImportError[] = []

    // Type validation
    switch (mapping.dataType) {
      case 'email':
        if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push({
            row,
            field: mapping.sourceField,
            message: `Invalid email format: ${value}`,
            value,
            severity: 'error'
          })
        }
        break

      case 'phone':
        if (typeof value === 'string' && !/^\+?[\d\s\-\(\)]{10,}$/.test(value)) {
          errors.push({
            row,
            field: mapping.sourceField,
            message: `Invalid phone number format: ${value}`,
            value,
            severity: 'warning'
          })
        }
        break

      case 'number':
        if (isNaN(Number(value))) {
          errors.push({
            row,
            field: mapping.sourceField,
            message: `Invalid number: ${value}`,
            value,
            severity: 'error'
          })
        }
        break

      case 'currency':
        const numValue = typeof value === 'string' ? parseFloat(value.replace(/[$,]/g, '')) : Number(value)
        if (isNaN(numValue)) {
          errors.push({
            row,
            field: mapping.sourceField,
            message: `Invalid currency amount: ${value}`,
            value,
            severity: 'error'
          })
        }
        break

      case 'date':
        const dateValue = new Date(value as string | number | Date)
        if (isNaN(dateValue.getTime())) {
          errors.push({
            row,
            field: mapping.sourceField,
            message: `Invalid date format: ${value}`,
            value,
            severity: 'error'
          })
        }
        break

      case 'boolean':
        const boolStr = String(value).toLowerCase()
        if (!['true', 'false', '1', '0', 'yes', 'no'].includes(boolStr)) {
          errors.push({
            row,
            field: mapping.sourceField,
            message: `Invalid boolean value: ${value}`,
            value,
            severity: 'error'
          })
        }
        break
    }

    // Custom validation rules
    if (mapping.validation) {
      for (const rule of mapping.validation) {
        const ruleErrors = this.validateRule(value, rule, mapping.sourceField, row)
        errors.push(...ruleErrors)
      }
    }

    return errors
  }

  // Validate against custom rules
  private validateRule(value: unknown, rule: ValidationRule, field: string, row: number): ImportError[] {
    const errors: ImportError[] = []

    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '') {
          errors.push({
            row,
            field,
            message: rule.message,
            value,
            severity: 'error'
          })
        }
        break

      case 'format':
        if (rule.config?.pattern && typeof value === 'string' && !rule.config.pattern.test(value)) {
          errors.push({
            row,
            field,
            message: rule.message,
            value,
            severity: 'error'
          })
        }
        if (rule.config?.options && !rule.config.options.includes(String(value))) {
          errors.push({
            row,
            field,
            message: rule.message,
            value,
            severity: 'error'
          })
        }
        if (rule.config?.minLength && typeof value === 'string' && value.length < rule.config.minLength) {
          errors.push({
            row,
            field,
            message: rule.message,
            value,
            severity: 'error'
          })
        }
        break

      case 'range':
        const numValue = Number(value)
        if (!isNaN(numValue)) {
          if (typeof rule.config?.min === 'number' && numValue < rule.config.min) {
            errors.push({
              row,
              field,
              message: rule.message,
              value,
              severity: 'error'
            })
          }
          if (typeof rule.config?.max === 'number' && numValue > rule.config.max) {
            errors.push({
              row,
              field,
              message: rule.message,
              value,
              severity: 'error'
            })
          }
          if (rule.config?.excludeZero && numValue === 0) {
            errors.push({
              row,
              field,
              message: rule.message,
              value,
              severity: 'error'
            })
          }
        }
        break
    }

    return errors
  }

  // Transform data according to mappings
  async transformData(jobId: string, data: Record<string, unknown>[]): Promise<Record<string, unknown>[]> {
    const job = this.jobs.get(jobId)
    if (!job) {
      throw new Error(`Job ${jobId} not found`)
    }

    job.status = 'processing'
    const transformedData: Record<string, unknown>[] = []

    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex]
      const transformedRow: Record<string, unknown> = {}

      // Apply field mappings
      for (const mapping of job.fieldMappings) {
        let value = row[mapping.sourceField]

        // Apply default value if empty
        if ((value === undefined || value === null || value === '') && mapping.defaultValue !== undefined) {
          value = mapping.defaultValue
        }

        // Transform value based on data type
        if (value !== undefined && value !== null && value !== '') {
          value = this.transformValue(value, mapping.dataType)
        }

        transformedRow[mapping.targetField] = value
      }

      // Add metadata
      transformedRow._importJobId = jobId
      transformedRow._importRow = rowIndex + 1
      transformedRow._importedAt = new Date().toISOString()

      transformedData.push(transformedRow)

      // Update progress
      job.progress = 50 + Math.round(((rowIndex + 1) / data.length) * 50) // 50% for processing
      job.processedRows = rowIndex + 1
    }

    job.status = 'completed'
    job.completedAt = new Date().toISOString()
    this.jobs.set(jobId, job)

    return transformedData
  }

  // Transform value based on data type
  private transformValue(value: unknown, dataType: DataType): unknown {
    switch (dataType) {
      case 'number':
        return Number(value)

      case 'currency':
        return parseFloat(typeof value === 'string' ? value.replace(/[$,]/g, '') : String(value))

      case 'boolean':
        const boolStr = String(value).toLowerCase()
        return ['true', '1', 'yes'].includes(boolStr)

      case 'date':
        return new Date(value as string | number | Date).toISOString().split('T')[0] // Return YYYY-MM-DD format

      case 'email':
        return String(value).toLowerCase().trim()

      case 'phone':
        return String(value).replace(/\D/g, '') // Remove non-digits

      case 'string':
      case 'address':
      default:
        return String(value).trim()
    }
  }

  // Get import job status
  getJob(jobId: string): ImportJob | undefined {
    return this.jobs.get(jobId)
  }

  // Get all jobs for entity
  getAllJobs(): ImportJob[] {
    return Array.from(this.jobs.values()).filter(job => job.entityId === this.entityId)
  }

  // Cancel import job
  cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId)
    if (job && ['pending', 'validating', 'processing'].includes(job.status)) {
      job.status = 'cancelled'
      this.jobs.set(jobId, job)
      return true
    }
    return false
  }
}

// Utility functions for CSV import
export const CSVImportUtils = {
  // Detect field mappings from CSV headers
  detectFieldMappings: (headers: string[], templateId: string): FieldMapping[] => {
    const template = IMPORT_TEMPLATES[templateId]
    if (!template) return []

    const mappings: FieldMapping[] = []
    const templateMappings = template.fieldMappings

    for (const header of headers) {
      const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '_')

      // Find best matching template field
      const match = templateMappings.find(mapping =>
        mapping.sourceField.toLowerCase().replace(/[^a-z0-9]/g, '_') === normalizedHeader ||
        mapping.targetField.toLowerCase().replace(/[^a-z0-9]/g, '_') === normalizedHeader
      )

      if (match) {
        mappings.push({
          ...match,
          sourceField: header // Use actual CSV header
        })
      }
    }

    return mappings
  },

  // Generate sample CSV for template
  generateSampleCSV: (templateId: string): string => {
    const template = IMPORT_TEMPLATES[templateId]
    if (!template) return ''

    const headers = template.fieldMappings.map(m => m.sourceField)
    const rows = template.sampleData.map(row =>
      headers.map(header => {
        const value = (row as Record<string, unknown>)[header] || ''
        // Escape values containing commas or quotes
        return typeof value === 'string' && (value.includes(',') || value.includes('"'))
          ? `"${value.replace(/"/g, '""')}"`
          : value
      }).join(',')
    )

    return [headers.join(','), ...rows].join('\n')
  },

  // Estimate import time based on file size and row count
  estimateImportTime: (fileSize: number, rowCount: number): number => {
    // Base time per row in milliseconds
    const baseTimePerRow = 50
    const fileSizeMultiplier = Math.max(1, Math.log10(fileSize / 1024)) // Factor in file size

    return Math.round(rowCount * baseTimePerRow * fileSizeMultiplier / 1000) // Return in seconds
  }
}
