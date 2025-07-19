export default function StatusPage() {
  const envStatus = {
    QUICKBOOKS_CLIENT_ID: process.env.QUICKBOOKS_CLIENT_ID ? 'SET ✅' : 'MISSING ❌',
    QUICKBOOKS_CLIENT_SECRET: process.env.QUICKBOOKS_CLIENT_SECRET ? 'SET ✅' : 'MISSING ❌',
    QUICKBOOKS_REDIRECT_URI: process.env.QUICKBOOKS_REDIRECT_URI || 'NOT_SET',
    QUICKBOOKS_SANDBOX: process.env.QUICKBOOKS_SANDBOX || 'NOT_SET',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET'
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#000', color: '#fff' }}>
      <h1>QuickBooks Environment Status</h1>
      <pre style={{ fontSize: '14px', lineHeight: '1.5' }}>
{`Environment Check:
QUICKBOOKS_CLIENT_ID: ${envStatus.QUICKBOOKS_CLIENT_ID}
QUICKBOOKS_CLIENT_SECRET: ${envStatus.QUICKBOOKS_CLIENT_SECRET}
QUICKBOOKS_REDIRECT_URI: ${envStatus.QUICKBOOKS_REDIRECT_URI}
QUICKBOOKS_SANDBOX: ${envStatus.QUICKBOOKS_SANDBOX}
NEXTAUTH_URL: ${envStatus.NEXTAUTH_URL}

Time: ${new Date().toISOString()}

QuickBooks Integration URLs:
- Auth Endpoint: /api/integrations/quickbooks/auth
- Callback Endpoint: /api/integrations/quickbooks/callback
- Sync Endpoint: /api/integrations/quickbooks/sync
- Frontend Page: /dashboard/integrations/quickbooks

Status: ${envStatus.QUICKBOOKS_CLIENT_ID.includes('SET') && envStatus.QUICKBOOKS_CLIENT_SECRET.includes('SET') ? 'READY ✅' : 'NOT CONFIGURED ❌'}
`}
      </pre>
    </div>
  )
}
