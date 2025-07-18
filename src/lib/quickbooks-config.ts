export const QB_CONFIG = {
  CLIENT_ID: process.env.QUICKBOOKS_CLIENT_ID || '',
  CLIENT_SECRET: process.env.QUICKBOOKS_CLIENT_SECRET || '',
  REDIRECT_URI: process.env.QUICKBOOKS_REDIRECT_URI || `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/integrations/quickbooks/callback',
  BASE_URL: process.env.QUICKBOOKS_SANDBOX === 'true'
    ? 'https://sandbox-quickbooks.api.intuit.com'
    : 'https://quickbooks.api.intuit.com',
  SCOPE: 'com.intuit.quickbooks.accounting',
  DISCOVERY_DOCUMENT_URL: process.env.QUICKBOOKS_SANDBOX === 'true'
    ? 'https://oauth.platform.intuit.com/op/v1/openid_connect/discovery'
    : 'https://oauth.platform.intuit.com/op/v1/openid_connect/discovery'
}

// Validate required environment variables
export function validateQuickBooksConfig() {
  const required = ['QUICKBOOKS_CLIENT_ID', 'QUICKBOOKS_CLIENT_SECRET']
  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    console.warn(`Missing QuickBooks environment variables: ${missing.join(', ')}`)
    return false
  }

  return true
}

export const isQuickBooksConfigured = validateQuickBooksConfig()
