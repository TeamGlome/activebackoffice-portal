// AI-Enhanced CSV Import Engine for Active Back Office
// Specialized for property management data with Yardi support

import { DataType, FieldMapping, ImportTemplate, ValidationRule } from './csv-import'

export type AIConfidenceLevel = 'very_high' | 'high' | 'medium' | 'low' | 'very_low'

export interface AIFieldMapping extends FieldMapping {
  aiConfidence: AIConfidenceLevel
  aiSuggestions: string[]
  alternativeFields: string[]
  detectedPattern: string
  dataQualityScore: number
}

export interface AIDataAnalysis {
  fieldMappings: AIFieldMapping[]
  dataQualityScore: number
  detectedFormat: string
  suggestedTemplate: string
  recommendations: AIRecommendation[]
  yardiDetection: YardiDetection | null
}

export interface AIRecommendation {
  type: 'field_mapping' | 'data_cleaning' | 'validation' | 'format_correction'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  suggestedAction: string
  confidence: AIConfidenceLevel
}

export interface YardiDetection {
  isYardiExport: boolean
  exportType: YardiExportType
  version: string
  schema: YardiSchema
  confidence: AIConfidenceLevel
}

export type YardiExportType =
  | 'tenant_data'
  | 'property_data'
  | 'financial_data'
  | 'maintenance_data'
  | 'reporting_data'
  | 'rent_roll'
  | 'lease_data'
  | 'unit_data'

export interface YardiSchema {
  knownFields: Record<string, string>
  fieldMappings: Record<string, string>
  dataTransformations: Record<string, string>
}

// Yardi Field Recognition Patterns
export const YARDI_FIELD_PATTERNS: Record<YardiExportType, Record<string, RegExp[]>> = {
  tenant_data: {
    'tenant_name': [/tenant.*name/i, /resident.*name/i, /lessee/i],
    'unit_number': [/unit.*number/i, /apt.*number/i, /unit.*code/i, /space.*id/i],
    'lease_start': [/lease.*start/i, /move.*in.*date/i, /lease.*from/i],
    'lease_end': [/lease.*end/i, /move.*out.*date/i, /lease.*to/i, /expir/i],
    'rent_amount': [/rent.*amount/i, /monthly.*rent/i, /base.*rent/i],
    'phone': [/phone/i, /mobile/i, /cell/i, /contact.*number/i],
    'email': [/email/i, /e.*mail/i, /electronic.*mail/i],
    'emergency_contact': [/emergency/i, /contact.*person/i, /next.*of.*kin/i]
  },
  property_data: {
    'property_name': [/property.*name/i, /building.*name/i, /complex.*name/i],
    'property_address': [/property.*address/i, /building.*address/i, /site.*address/i],
    'unit_count': [/unit.*count/i, /number.*of.*units/i, /total.*units/i],
    'property_type': [/property.*type/i, /building.*type/i, /asset.*type/i],
    'year_built': [/year.*built/i, /construction.*year/i, /built.*date/i],
    'square_feet': [/sq.*ft/i, /square.*feet/i, /area/i, /size/i],
    'amenities': [/amenities/i, /features/i, /facilities/i]
  },
  financial_data: {
    'account_number': [/account.*number/i, /account.*code/i, /gl.*account/i],
    'transaction_date': [/transaction.*date/i, /post.*date/i, /entry.*date/i],
    'amount': [/amount/i, /total/i, /sum/i, /balance/i],
    'description': [/description/i, /memo/i, /details/i, /reference/i],
    'category': [/category/i, /type/i, /classification/i],
    'property_code': [/property.*code/i, /building.*code/i, /site.*code/i]
  },
  maintenance_data: {
    'work_order_id': [/work.*order/i, /wo.*number/i, /ticket.*number/i, /request.*id/i],
    'request_date': [/request.*date/i, /reported.*date/i, /created.*date/i],
    'completion_date': [/completion.*date/i, /completed.*date/i, /finished.*date/i],
    'description': [/description/i, /issue/i, /problem/i, /request/i],
    'priority': [/priority/i, /urgency/i, /level/i],
    'status': [/status/i, /state/i, /condition/i],
    'vendor': [/vendor/i, /contractor/i, /technician/i, /assigned.*to/i],
    'cost': [/cost/i, /amount/i, /price/i, /total/i]
  },
  reporting_data: {
    'report_date': [/report.*date/i, /as.*of.*date/i, /snapshot.*date/i],
    'metric_name': [/metric/i, /kpi/i, /measure/i, /indicator/i],
    'value': [/value/i, /amount/i, /result/i, /score/i],
    'period': [/period/i, /month/i, /quarter/i, /year/i]
  },
  rent_roll: {
    'unit_number': [/unit/i, /apt/i, /space/i],
    'tenant_name': [/tenant/i, /resident/i, /occupant/i],
    'lease_start': [/lease.*start/i, /move.*in/i],
    'lease_end': [/lease.*end/i, /move.*out/i, /expir/i],
    'current_rent': [/current.*rent/i, /monthly.*rent/i, /rent.*amount/i],
    'security_deposit': [/security.*deposit/i, /deposit/i],
    'occupancy_status': [/occupancy/i, /status/i, /vacant/i, /occupied/i]
  },
  lease_data: {
    'lease_id': [/lease.*id/i, /lease.*number/i, /contract.*number/i],
    'tenant_id': [/tenant.*id/i, /resident.*id/i, /lessee.*id/i],
    'unit_id': [/unit.*id/i, /space.*id/i, /apartment.*id/i],
    'lease_term': [/lease.*term/i, /term.*months/i, /duration/i],
    'rent_amount': [/rent.*amount/i, /base.*rent/i, /monthly.*rent/i],
    'lease_type': [/lease.*type/i, /contract.*type/i, /agreement.*type/i]
  },
  unit_data: {
    'unit_number': [/unit.*number/i, /apt.*number/i, /space.*number/i],
    'building': [/building/i, /property/i, /complex/i],
    'floor': [/floor/i, /level/i],
    'bedrooms': [/bed/i, /br/i, /bedroom/i],
    'bathrooms': [/bath/i, /bathroom/i, /ba/i],
    'square_feet': [/sq.*ft/i, /sqft/i, /square.*feet/i, /area/i],
    'unit_type': [/unit.*type/i, /apartment.*type/i, /layout/i],
    'market_rent': [/market.*rent/i, /asking.*rent/i, /list.*rent/i]
  }
}

// Common property management field patterns (beyond Yardi)
export const GENERIC_FIELD_PATTERNS: Record<string, RegExp[]> = {
  // Property fields
  'property_name': [/property.*name/i, /building.*name/i, /complex.*name/i, /site.*name/i],
  'property_address': [/address/i, /street/i, /location/i],
  'property_type': [/type/i, /category/i, /classification/i],

  // Tenant fields
  'tenant_name': [/tenant/i, /resident/i, /occupant/i, /lessee/i, /renter/i],
  'first_name': [/first.*name/i, /given.*name/i, /fname/i],
  'last_name': [/last.*name/i, /family.*name/i, /surname/i, /lname/i],
  'email': [/email/i, /e.*mail/i, /electronic.*mail/i],
  'phone': [/phone/i, /telephone/i, /mobile/i, /cell/i, /contact/i],

  // Financial fields
  'rent_amount': [/rent/i, /amount/i, /payment/i, /charge/i],
  'security_deposit': [/deposit/i, /security/i],
  'late_fee': [/late.*fee/i, /penalty/i],
  'balance': [/balance/i, /outstanding/i, /due/i, /owed/i],

  // Date fields
  'lease_start': [/start/i, /begin/i, /commence/i, /from/i, /move.*in/i],
  'lease_end': [/end/i, /expir/i, /terminate/i, /to/i, /move.*out/i],
  'payment_date': [/payment.*date/i, /paid.*date/i, /transaction.*date/i],
  'due_date': [/due.*date/i, /payment.*due/i],

  // Unit fields
  'unit_number': [/unit/i, /apt/i, /apartment/i, /space/i, /room/i],
  'bedrooms': [/bed/i, /br/i, /bedroom/i],
  'bathrooms': [/bath/i, /bathroom/i, /ba/i],
  'square_feet': [/sq.*ft/i, /sqft/i, /square.*feet/i, /area/i, /size/i],

  // Maintenance fields
  'work_order': [/work.*order/i, /ticket/i, /request/i, /wo/i],
  'issue_type': [/issue/i, /problem/i, /category/i, /type/i],
  'priority': [/priority/i, /urgency/i, /importance/i],
  'status': [/status/i, /state/i, /condition/i],
  'description': [/description/i, /details/i, /notes/i, /comment/i]
}

// Data type detection patterns
export const DATA_TYPE_PATTERNS: Record<DataType, RegExp[]> = {
  email: [/@.*\./],
  phone: [/^\+?[\d\s\-\(\)]{10,}$/, /^\d{3}-\d{3}-\d{4}$/, /^\(\d{3}\)\s?\d{3}-\d{4}$/],
  currency: [/^\$?\d{1,3}(,\d{3})*(\.\d{2})?$/, /^\d+\.\d{2}$/],
  date: [/^\d{4}-\d{2}-\d{2}$/, /^\d{1,2}\/\d{1,2}\/\d{4}$/, /^\d{1,2}-\d{1,2}-\d{4}$/],
  number: [/^\d+$/, /^\d+\.\d+$/],
  boolean: [/^(true|false|yes|no|y|n|1|0)$/i],
  address: [/\d+.*\w+.*(st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ln|lane|ct|court)/i],
  string: [/.*/] // fallback
}

export class AICSVImportEngine {
  private confidenceThreshold = 0.7
  private learningData: Record<string, number> = {}

  // Main AI analysis function
  async analyzeCSV(headers: string[], sampleData: string[][]): Promise<AIDataAnalysis> {
    // Step 1: Detect if this is a Yardi export
    const yardiDetection = this.detectYardiExport(headers, sampleData)

    // Step 2: Analyze field mappings with AI
    const fieldMappings = await this.generateAIFieldMappings(headers, sampleData, yardiDetection)

    // Step 3: Calculate overall data quality score
    const dataQualityScore = this.calculateDataQualityScore(headers, sampleData, fieldMappings)

    // Step 4: Detect data format
    const detectedFormat = this.detectDataFormat(headers, sampleData)

    // Step 5: Suggest best template
    const suggestedTemplate = this.suggestTemplate(fieldMappings, yardiDetection)

    // Step 6: Generate AI recommendations
    const recommendations = this.generateRecommendations(fieldMappings, sampleData, yardiDetection)

    return {
      fieldMappings,
      dataQualityScore,
      detectedFormat,
      suggestedTemplate,
      recommendations,
      yardiDetection
    }
  }

  // Detect if CSV is from Yardi export
  private detectYardiExport(headers: string[], sampleData: string[][]): YardiDetection | null {
    let yardiScore = 0
    let detectedType: YardiExportType = 'tenant_data'
    let maxTypeScore = 0

    // Check each Yardi export type
    for (const [exportType, patterns] of Object.entries(YARDI_FIELD_PATTERNS)) {
      let typeScore = 0
      const matchedFields: Record<string, string> = {}

      for (const header of headers) {
        for (const [fieldName, regexPatterns] of Object.entries(patterns)) {
          for (const pattern of regexPatterns) {
            if (pattern.test(header)) {
              typeScore += 1
              matchedFields[header] = fieldName
              break
            }
          }
        }
      }

      if (typeScore > maxTypeScore) {
        maxTypeScore = typeScore
        detectedType = exportType as YardiExportType
      }
      yardiScore = Math.max(yardiScore, typeScore)
    }

    // Check for Yardi-specific indicators
    const yardiIndicators = [
      /yardi/i,
      /voyager/i,
      /property.*management.*system/i,
      /pms.*export/i
    ]

    let indicatorMatches = 0
    for (const header of headers) {
      for (const indicator of yardiIndicators) {
        if (indicator.test(header)) {
          indicatorMatches += 1
          yardiScore += 2
        }
      }
    }

    // Additional context clues from data
    if (sampleData.length > 0) {
      const firstRow = sampleData[0]
      for (let i = 0; i < headers.length && i < firstRow.length; i++) {
        const value = firstRow[i]

        // Look for Yardi-specific data patterns
        if (/^[A-Z]{2,3}\d{3,6}$/.test(value)) { // Yardi property codes
          yardiScore += 1
        }
        if (/^\d{6,8}$/.test(value) && headers[i].toLowerCase().includes('tenant')) { // Yardi tenant IDs
          yardiScore += 1
        }
      }
    }

    const totalPossibleScore = headers.length + 4 // headers + indicators
    const confidence = this.calculateConfidence(yardiScore / totalPossibleScore)

    if (yardiScore >= 3 && confidence !== 'very_low') {
      return {
        isYardiExport: true,
        exportType: detectedType,
        version: 'Unknown', // Could be enhanced to detect version
        schema: {
          knownFields: {},
          fieldMappings: {},
          dataTransformations: {}
        },
        confidence
      }
    }

    return null
  }

  // Generate AI-powered field mappings
  private async generateAIFieldMappings(
    headers: string[],
    sampleData: string[][],
    yardiDetection: YardiDetection | null
  ): Promise<AIFieldMapping[]> {
    const mappings: AIFieldMapping[] = []

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]
      const columnData = sampleData.map(row => row[i]).filter(Boolean)

      // Get AI mapping for this field
      const aiMapping = await this.getAIFieldMapping(header, columnData, yardiDetection)
      mappings.push(aiMapping)
    }

    return mappings
  }

  // Get AI mapping for a single field
  private async getAIFieldMapping(
    header: string,
    columnData: string[],
    yardiDetection: YardiDetection | null
  ): Promise<AIFieldMapping> {
    // Step 1: Try Yardi-specific patterns first
    let bestMatch = this.findYardiFieldMatch(header, yardiDetection)

    // Step 2: Fall back to generic patterns
    if (!bestMatch.field) {
      bestMatch = this.findGenericFieldMatch(header)
    }

    // Step 3: Analyze data content for data type detection
    const detectedDataType = this.detectDataType(columnData)

    // Step 4: Calculate confidence based on multiple factors
    const confidence = this.calculateFieldConfidence(header, bestMatch.field, columnData, detectedDataType)

    // Step 5: Generate suggestions and alternatives
    const suggestions = this.generateFieldSuggestions(header, columnData, detectedDataType)
    const alternatives = this.findAlternativeFields(header, bestMatch.field)

    // Step 6: Calculate data quality for this field
    const dataQualityScore = this.calculateFieldDataQuality(columnData, detectedDataType)

    return {
      sourceField: header,
      targetField: bestMatch.field || this.sanitizeFieldName(header),
      dataType: detectedDataType,
      isRequired: this.isFieldRequired(bestMatch.field),
      aiConfidence: confidence,
      aiSuggestions: suggestions,
      alternativeFields: alternatives,
      detectedPattern: bestMatch.pattern || '',
      dataQualityScore,
      validation: this.generateValidationRules(bestMatch.field, detectedDataType)
    }
  }

  // Find Yardi-specific field matches
  private findYardiFieldMatch(header: string, yardiDetection: YardiDetection | null): { field: string; pattern: string } {
    if (!yardiDetection) {
      return { field: '', pattern: '' }
    }

    const patterns = YARDI_FIELD_PATTERNS[yardiDetection.exportType]

    for (const [fieldName, regexPatterns] of Object.entries(patterns)) {
      for (const pattern of regexPatterns) {
        if (pattern.test(header)) {
          return { field: fieldName, pattern: pattern.source }
        }
      }
    }

    return { field: '', pattern: '' }
  }

  // Find generic field matches
  private findGenericFieldMatch(header: string): { field: string; pattern: string } {
    for (const [fieldName, regexPatterns] of Object.entries(GENERIC_FIELD_PATTERNS)) {
      for (const pattern of regexPatterns) {
        if (pattern.test(header)) {
          return { field: fieldName, pattern: pattern.source }
        }
      }
    }

    return { field: '', pattern: '' }
  }

  // Detect data type from column content
  private detectDataType(columnData: string[]): DataType {
    if (columnData.length === 0) return 'string'

    const sampleSize = Math.min(columnData.length, 20)
    const sample = columnData.slice(0, sampleSize)

    // Test each data type pattern
    for (const [dataType, patterns] of Object.entries(DATA_TYPE_PATTERNS)) {
      if (dataType === 'string') continue // Skip string as it's the fallback

      let matches = 0
      for (const value of sample) {
        if (value && patterns.some(pattern => pattern.test(value.trim()))) {
          matches++
        }
      }

      // If most values match the pattern, classify as that type
      if (matches / sample.length >= 0.8) {
        return dataType as DataType
      }
    }

    return 'string' // Default fallback
  }

  // Calculate confidence level
  private calculateConfidence(score: number): AIConfidenceLevel {
    if (score >= 0.9) return 'very_high'
    if (score >= 0.75) return 'high'
    if (score >= 0.5) return 'medium'
    if (score >= 0.25) return 'low'
    return 'very_low'
  }

  // Calculate field mapping confidence
  private calculateFieldConfidence(
    header: string,
    mappedField: string,
    columnData: string[],
    dataType: DataType
  ): AIConfidenceLevel {
    let score = 0

    // Header name similarity
    if (mappedField && header.toLowerCase().includes(mappedField.toLowerCase())) {
      score += 0.4
    }

    // Data consistency
    const dataConsistency = this.calculateDataConsistency(columnData, dataType)
    score += dataConsistency * 0.3

    // Data completeness (non-empty values)
    const completeness = columnData.filter(v => v && v.trim()).length / columnData.length
    score += completeness * 0.2

    // Pattern matching strength
    if (mappedField) {
      score += 0.1
    }

    return this.calculateConfidence(score)
  }

  // Calculate data consistency for a field
  private calculateDataConsistency(columnData: string[], expectedDataType: DataType): number {
    if (columnData.length === 0) return 0

    const patterns = DATA_TYPE_PATTERNS[expectedDataType] || []
    if (patterns.length === 0) return 1

    let matches = 0
    for (const value of columnData) {
      if (!value || !value.trim()) continue

      if (patterns.some(pattern => pattern.test(value.trim()))) {
        matches++
      }
    }

    return matches / columnData.filter(v => v && v.trim()).length
  }

  // Generate field suggestions
  private generateFieldSuggestions(header: string, columnData: string[], dataType: DataType): string[] {
    const suggestions: string[] = []

    // Suggest based on data type
    switch (dataType) {
      case 'email':
        suggestions.push('Consider validating email format', 'Check for duplicate email addresses')
        break
      case 'phone':
        suggestions.push('Standardize phone number format', 'Remove non-digit characters')
        break
      case 'currency':
        suggestions.push('Ensure consistent currency format', 'Check for negative values')
        break
      case 'date':
        suggestions.push('Standardize date format to YYYY-MM-DD', 'Validate date ranges')
        break
    }

    // Data quality suggestions
    const emptyCount = columnData.filter(v => !v || !v.trim()).length
    if (emptyCount > 0) {
      suggestions.push(`${emptyCount} empty values found - consider data cleanup`)
    }

    return suggestions
  }

  // Find alternative field mappings
  private findAlternativeFields(header: string, primaryField: string): string[] {
    const alternatives: string[] = []

    // Find other fields that might match
    for (const [fieldName] of Object.entries(GENERIC_FIELD_PATTERNS)) {
      if (fieldName !== primaryField && fieldName.includes(header.toLowerCase().split('_')[0])) {
        alternatives.push(fieldName)
      }
    }

    return alternatives.slice(0, 3) // Limit to top 3 alternatives
  }

  // Calculate overall data quality score
  private calculateDataQualityScore(
    headers: string[],
    sampleData: string[][],
    fieldMappings: AIFieldMapping[]
  ): number {
    let totalScore = 0

    // Factor 1: Field mapping confidence (40%)
    const avgConfidence = fieldMappings.reduce((sum, mapping) => {
      const confidenceValue = this.confidenceToNumber(mapping.aiConfidence)
      return sum + confidenceValue
    }, 0) / fieldMappings.length
    totalScore += avgConfidence * 0.4

    // Factor 2: Data completeness (30%)
    const totalCells = headers.length * sampleData.length
    const emptyCells = sampleData.reduce((count, row) => {
      return count + row.filter(cell => !cell || !cell.trim()).length
    }, 0)
    const completeness = (totalCells - emptyCells) / totalCells
    totalScore += completeness * 0.3

    // Factor 3: Data consistency (20%)
    const avgDataQuality = fieldMappings.reduce((sum, mapping) => sum + mapping.dataQualityScore, 0) / fieldMappings.length
    totalScore += avgDataQuality * 0.2

    // Factor 4: Header quality (10%)
    const headerQuality = headers.filter(h => h && h.trim() && h.length > 1).length / headers.length
    totalScore += headerQuality * 0.1

    return Math.round(totalScore * 100) / 100
  }

  // Convert confidence level to numeric value
  private confidenceToNumber(confidence: AIConfidenceLevel): number {
    switch (confidence) {
      case 'very_high': return 1.0
      case 'high': return 0.8
      case 'medium': return 0.6
      case 'low': return 0.4
      case 'very_low': return 0.2
    }
  }

  // Calculate data quality for individual field
  private calculateFieldDataQuality(columnData: string[], dataType: DataType): number {
    const consistency = this.calculateDataConsistency(columnData, dataType)
    const completeness = columnData.filter(v => v && v.trim()).length / columnData.length

    return (consistency * 0.7) + (completeness * 0.3)
  }

  // Detect overall data format
  private detectDataFormat(headers: string[], sampleData: string[][]): string {
    // Check for common export formats
    if (headers.some(h => h.includes('Report Generated') || h.includes('Export Date'))) {
      return 'System Export'
    }

    if (headers.length > 10 && sampleData.length > 100) {
      return 'Bulk Data Export'
    }

    if (headers.some(h => h.toLowerCase().includes('tenant') || h.toLowerCase().includes('resident'))) {
      return 'Tenant Data'
    }

    if (headers.some(h => h.toLowerCase().includes('property') || h.toLowerCase().includes('unit'))) {
      return 'Property Data'
    }

    return 'Standard CSV'
  }

  // Suggest best template based on analysis
  private suggestTemplate(fieldMappings: AIFieldMapping[], yardiDetection: YardiDetection | null): string {
    if (yardiDetection) {
      switch (yardiDetection.exportType) {
        case 'tenant_data':
        case 'lease_data':
          return 'tenants'
        case 'property_data':
        case 'unit_data':
          return 'properties'
        case 'financial_data':
        case 'rent_roll':
          return 'financial'
        case 'maintenance_data':
          return 'maintenance'
        default:
          return 'properties'
      }
    }

    // Analyze field mappings to suggest template
    const fieldCounts = {
      property: 0,
      tenant: 0,
      financial: 0,
      maintenance: 0
    }

    for (const mapping of fieldMappings) {
      const field = mapping.targetField.toLowerCase()

      if (field.includes('property') || field.includes('unit') || field.includes('building')) {
        fieldCounts.property++
      }
      if (field.includes('tenant') || field.includes('resident') || field.includes('lease')) {
        fieldCounts.tenant++
      }
      if (field.includes('rent') || field.includes('payment') || field.includes('amount') || field.includes('financial')) {
        fieldCounts.financial++
      }
      if (field.includes('maintenance') || field.includes('work') || field.includes('repair')) {
        fieldCounts.maintenance++
      }
    }

    // Return template with highest field count
    const maxCategory = Object.entries(fieldCounts).reduce((a, b) =>
      fieldCounts[a[0] as keyof typeof fieldCounts] > fieldCounts[b[0] as keyof typeof fieldCounts] ? a : b
    )

    switch (maxCategory[0]) {
      case 'property': return 'properties'
      case 'tenant': return 'tenants'
      case 'financial': return 'financial'
      case 'maintenance': return 'maintenance'
      default: return 'properties'
    }
  }

  // Generate AI recommendations
  private generateRecommendations(
    fieldMappings: AIFieldMapping[],
    sampleData: string[][],
    yardiDetection: YardiDetection | null
  ): AIRecommendation[] {
    const recommendations: AIRecommendation[] = []

    // Yardi-specific recommendations
    if (yardiDetection && yardiDetection.confidence !== 'very_low') {
      recommendations.push({
        type: 'field_mapping',
        priority: 'high',
        title: 'Yardi Export Detected',
        description: `This appears to be a ${yardiDetection.exportType.replace('_', ' ')} export from Yardi`,
        suggestedAction: 'Use Yardi-optimized field mappings for best results',
        confidence: yardiDetection.confidence
      })
    }

    // Low confidence mappings
    const lowConfidenceMappings = fieldMappings.filter(m =>
      m.aiConfidence === 'low' || m.aiConfidence === 'very_low'
    )

    if (lowConfidenceMappings.length > 0) {
      recommendations.push({
        type: 'field_mapping',
        priority: 'medium',
        title: 'Review Field Mappings',
        description: `${lowConfidenceMappings.length} fields have low confidence mappings`,
        suggestedAction: 'Review and manually adjust field mappings before import',
        confidence: 'medium'
      })
    }

    // Data quality issues
    const poorQualityFields = fieldMappings.filter(m => m.dataQualityScore < 0.7)
    if (poorQualityFields.length > 0) {
      recommendations.push({
        type: 'data_cleaning',
        priority: 'medium',
        title: 'Data Quality Issues',
        description: `${poorQualityFields.length} fields have data quality issues`,
        suggestedAction: 'Clean data before import to ensure accuracy',
        confidence: 'high'
      })
    }

    // Missing required fields
    const requiredFields = ['property_name', 'tenant_name', 'unit_number']
    const mappedFields = fieldMappings.map(m => m.targetField)
    const missingRequired = requiredFields.filter(field => !mappedFields.includes(field))

    if (missingRequired.length > 0) {
      recommendations.push({
        type: 'validation',
        priority: 'high',
        title: 'Missing Required Fields',
        description: `Required fields not found: ${missingRequired.join(', ')}`,
        suggestedAction: 'Map these fields manually or add them to your data',
        confidence: 'very_high'
      })
    }

    return recommendations
  }

  // Helper methods
  private sanitizeFieldName(header: string): string {
    return header.toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
  }

  private isFieldRequired(fieldName: string): boolean {
    const requiredFields = [
      'property_name', 'tenant_name', 'unit_number',
      'lease_start', 'rent_amount', 'email'
    ]
    return requiredFields.includes(fieldName)
  }

  private generateValidationRules(fieldName: string, dataType: DataType): ValidationRule[] {
    const rules: ValidationRule[] = []

    if (this.isFieldRequired(fieldName)) {
      rules.push({
        type: 'required',
        message: `${fieldName} is required`,
        config: {}
      })
    }

    switch (dataType) {
      case 'email':
        rules.push({
          type: 'format',
          message: 'Must be a valid email address',
          config: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
        })
        break
      case 'phone':
        rules.push({
          type: 'format',
          message: 'Must be a valid phone number',
          config: { pattern: /^\+?[\d\s\-\(\)]{10,}$/ }
        })
        break
      case 'currency':
        rules.push({
          type: 'range',
          message: 'Amount must be positive',
          config: { min: 0 }
        })
        break
    }

    return rules
  }
}

// Yardi-specific CSV Import Templates
export const YARDI_IMPORT_TEMPLATES: Record<YardiExportType, ImportTemplate> = {
  tenant_data: {
    id: 'yardi_tenant_data',
    name: 'Yardi Tenant Data Import',
    description: 'Import tenant information from Yardi tenant data export',
    category: 'tenant',
    fieldMappings: [], // Will be populated by AI
    requiredFields: ['tenant_name', 'unit_number', 'lease_start'],
    optionalFields: ['phone', 'email', 'lease_end', 'rent_amount', 'emergency_contact'],
    sampleData: [],
    validationRules: [],
    transformations: {}
  },
  property_data: {
    id: 'yardi_property_data',
    name: 'Yardi Property Data Import',
    description: 'Import property information from Yardi property data export',
    category: 'property',
    fieldMappings: [],
    requiredFields: ['property_name', 'property_address', 'unit_count'],
    optionalFields: ['property_type', 'year_built', 'square_feet', 'amenities'],
    sampleData: [],
    validationRules: [],
    transformations: {}
  },
  financial_data: {
    id: 'yardi_financial_data',
    name: 'Yardi Financial Data Import',
    description: 'Import financial transactions from Yardi financial export',
    category: 'financial',
    fieldMappings: [],
    requiredFields: ['transaction_date', 'amount', 'description'],
    optionalFields: ['account_number', 'category', 'property_code'],
    sampleData: [],
    validationRules: [],
    transformations: {}
  },
  maintenance_data: {
    id: 'yardi_maintenance_data',
    name: 'Yardi Maintenance Data Import',
    description: 'Import maintenance work orders from Yardi maintenance export',
    category: 'maintenance',
    fieldMappings: [],
    requiredFields: ['work_order_id', 'request_date', 'description'],
    optionalFields: ['completion_date', 'priority', 'status', 'vendor', 'cost'],
    sampleData: [],
    validationRules: [],
    transformations: {}
  },
  reporting_data: {
    id: 'yardi_reporting_data',
    name: 'Yardi Reporting Data Import',
    description: 'Import reporting metrics from Yardi custom reports',
    category: 'custom',
    fieldMappings: [],
    requiredFields: ['report_date', 'metric_name', 'value'],
    optionalFields: ['period'],
    sampleData: [],
    validationRules: [],
    transformations: {}
  },
  rent_roll: {
    id: 'yardi_rent_roll',
    name: 'Yardi Rent Roll Import',
    description: 'Import rent roll data from Yardi rent roll export',
    category: 'financial',
    fieldMappings: [],
    requiredFields: ['unit_number', 'current_rent'],
    optionalFields: ['tenant_name', 'lease_start', 'lease_end', 'security_deposit', 'occupancy_status'],
    sampleData: [],
    validationRules: [],
    transformations: {}
  },
  lease_data: {
    id: 'yardi_lease_data',
    name: 'Yardi Lease Data Import',
    description: 'Import lease information from Yardi lease export',
    category: 'tenant',
    fieldMappings: [],
    requiredFields: ['lease_id', 'tenant_id', 'unit_id', 'rent_amount'],
    optionalFields: ['lease_term', 'lease_type'],
    sampleData: [],
    validationRules: [],
    transformations: {}
  },
  unit_data: {
    id: 'yardi_unit_data',
    name: 'Yardi Unit Data Import',
    description: 'Import unit information from Yardi unit data export',
    category: 'property',
    fieldMappings: [],
    requiredFields: ['unit_number', 'building'],
    optionalFields: ['floor', 'bedrooms', 'bathrooms', 'square_feet', 'unit_type', 'market_rent'],
    sampleData: [],
    validationRules: [],
    transformations: {}
  }
}
