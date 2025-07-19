"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Button } from "../../../../components/ui/button"
import { Badge } from "../../../../components/ui/badge"
import {
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  DollarSign,
  BarChart3,
  Users,
  FileText,
  Loader2,
  Building2,
  LinkIcon,
  AlertTriangle,
  Calendar,
  Download
} from "lucide-react"

interface ConnectionStatus {
  connected: boolean
  company_info?: {
    companyName: string
    address: string
    phone: string
    email: string
  }
  last_sync?: string
  error?: string
}

interface SyncResults {
  customers: number
  vendors: number
  items: number
  transactions: number
  last_sync: string
  errors: string[]
}

export default function QuickBooksIntegrationPage() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ connected: false })
  const [syncResults, setSyncResults] = useState<SyncResults | null>(null)

  const checkConnectionStatus = useCallback(async () => {
    if (!session?.user?.entityId) {
      setConnectionStatus({ connected: false, error: 'No entity associated with user' })
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/integrations/quickbooks/sync?entity_id=${session.user.entityId}`)
      const data = await response.json()

      if (data.success && data.connected) {
        setConnectionStatus({
          connected: true,
          company_info: data.company_info,
          last_sync: data.last_sync
        })
        if (data.sync_results) {
          setSyncResults(data.sync_results)
        }
      } else {
        setConnectionStatus({ connected: false, error: data.error || 'Not connected' })
      }
    } catch (error) {
      console.error('Error checking connection:', error)
      setConnectionStatus({ connected: false, error: 'Failed to check connection status' })
    } finally {
      setLoading(false)
    }
  }, [session?.user?.entityId])

  const initiateQuickBooksConnection = async () => {
    if (!session?.user?.entityId) {
      alert('No entity associated with user')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/integrations/quickbooks/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id: session.user.entityId })
      })

      const data = await response.json()

      if (data.success && data.authorization_url) {
        // Open QuickBooks authorization in a popup
        const popup = window.open(
          data.authorization_url,
          'quickbooks-auth',
          'width=800,height=600,scrollbars=yes,resizable=yes'
        )

        // Poll for popup closure and check connection status
        const pollInterval = setInterval(async () => {
          if (popup?.closed) {
            clearInterval(pollInterval)
            // Wait a bit for the callback to process, then check status
            setTimeout(() => {
              checkConnectionStatus()
            }, 2000)
          }
        }, 1000)

        // Stop polling after 10 minutes
        setTimeout(() => {
          clearInterval(pollInterval)
          if (popup && !popup.closed) {
            popup.close()
          }
        }, 600000)
      } else {
        throw new Error(data.error || 'Failed to initiate connection')
      }
    } catch (error) {
      console.error('Error initiating connection:', error)
      alert(`Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const syncData = async () => {
    if (!session?.user?.entityId) {
      alert('No entity associated with user')
      return
    }

    try {
      setSyncLoading(true)
      const response = await fetch('/api/integrations/quickbooks/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entity_id: session.user.entityId,
          sync_type: 'full'
        })
      })

      const data = await response.json()

      if (data.success) {
        setSyncResults(data.sync_results)
        await checkConnectionStatus()
        alert('Data sync completed successfully!')
      } else {
        throw new Error(data.error || 'Sync failed')
      }
    } catch (error) {
      console.error('Error syncing data:', error)
      alert(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setSyncLoading(false)
    }
  }

  const disconnectQuickBooks = async () => {
    if (!confirm('Are you sure you want to disconnect QuickBooks? This will stop all data synchronization.')) {
      return
    }

    if (!session?.user?.entityId) {
      alert('No entity associated with user')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/integrations/quickbooks/auth', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entity_id: session.user.entityId })
      })

      const data = await response.json()

      if (data.success) {
        setConnectionStatus({ connected: false })
        setSyncResults(null)
        alert('QuickBooks disconnected successfully')
      } else {
        throw new Error(data.error || 'Failed to disconnect')
      }
    } catch (error) {
      console.error('Error disconnecting:', error)
      alert(`Failed to disconnect: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.entityId) {
      // Check for OAuth callback parameters
      const urlParams = new URLSearchParams(window.location.search)
      const success = urlParams.get('success')
      const error = urlParams.get('error')

      if (success === 'connected') {
        // Clear URL parameters and show success message
        window.history.replaceState({}, document.title, window.location.pathname)
        alert('QuickBooks connected successfully!')
      } else if (error) {
        // Clear URL parameters and show error
        window.history.replaceState({}, document.title, window.location.pathname)
        alert(`Connection failed: ${error}`)
      }

      checkConnectionStatus()
    }
  }, [checkConnectionStatus, status, session?.user?.entityId])

  // Show loading while session is loading
  if (status === 'loading') {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-6"></div>
          <div className="h-32 bg-slate-700 rounded-lg"></div>
        </div>
      </div>
    )
  }

  // Show error if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="p-6">
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-400 mb-2">Authentication Required</h3>
            <p className="text-red-300">Please log in to access QuickBooks integration.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show error if no entity
  if (!session?.user?.entityId) {
    return (
      <div className="p-6">
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">No Entity Associated</h3>
            <p className="text-yellow-300">Your user account must be associated with an entity to use QuickBooks integration.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">QuickBooks Integration</h1>
          <p className="text-slate-400">Connect and sync your QuickBooks data</p>
        </div>
        <Button
          variant="outline"
          onClick={checkConnectionStatus}
          disabled={loading}
          className="border-slate-600 text-slate-400 hover:text-white"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </div>

      {/* Connection Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {connectionStatus.connected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-400 font-medium">Connected to QuickBooks</span>
              </div>

              {connectionStatus.company_info && (
                <div className="bg-slate-700/50 p-4 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Company Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400">Company Name</p>
                      <p className="text-white">{connectionStatus.company_info.companyName}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Email</p>
                      <p className="text-white">{connectionStatus.company_info.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Phone</p>
                      <p className="text-white">{connectionStatus.company_info.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Address</p>
                      <p className="text-white">{connectionStatus.company_info.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}

              {connectionStatus.last_sync && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-400">Last sync: {new Date(connectionStatus.last_sync).toLocaleString()}</span>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={syncData}
                  disabled={syncLoading}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  {syncLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync Now
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={disconnectQuickBooks}
                  disabled={loading}
                  className="border-red-500/20 text-red-400 hover:text-red-300"
                >
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-400" />
                <span className="text-orange-400 font-medium">Not Connected</span>
              </div>

              {connectionStatus.error && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-red-400 font-medium">Connection Error</span>
                  </div>
                  <p className="text-red-300 text-sm mt-1">{connectionStatus.error}</p>
                </div>
              )}

              <div className="bg-slate-700/50 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">Connect to QuickBooks</h3>
                <p className="text-slate-400 text-sm mb-4">
                  Connect your QuickBooks account to automatically sync customers, vendors, items, and transactions.
                </p>
                <ul className="text-slate-400 text-sm space-y-1 mb-4">
                  <li>• Automatic data synchronization</li>
                  <li>• Real-time financial reporting</li>
                  <li>• Customer and vendor management</li>
                  <li>• Invoice and payment tracking</li>
                </ul>
              </div>

              <Button
                onClick={initiateQuickBooksConnection}
                disabled={loading}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect QuickBooks
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Results */}
      {syncResults && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Last Sync Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-white">{syncResults.customers}</p>
                <p className="text-sm text-slate-400">Customers</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Building2 className="w-6 h-6 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-white">{syncResults.vendors}</p>
                <p className="text-sm text-slate-400">Vendors</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <p className="text-2xl font-bold text-white">{syncResults.items}</p>
                <p className="text-sm text-slate-400">Items</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <DollarSign className="w-6 h-6 text-orange-400" />
                </div>
                <p className="text-2xl font-bold text-white">{syncResults.transactions}</p>
                <p className="text-sm text-slate-400">Transactions</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-slate-400">
                  Synced on {new Date(syncResults.last_sync).toLocaleString()}
                </span>
              </div>

              {syncResults.errors.length > 0 && (
                <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                  {syncResults.errors.length} Warning(s)
                </Badge>
              )}
            </div>

            {syncResults.errors.length > 0 && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                <h4 className="text-red-400 font-medium mb-2">Sync Warnings</h4>
                <ul className="text-red-300 text-sm space-y-1">
                  {syncResults.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Help & Documentation */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Help & Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-white font-medium mb-2">Getting Started</h3>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Ensure you have QuickBooks Desktop or Online</li>
                <li>• Have admin access to your QuickBooks company</li>
                <li>• Make sure your QuickBooks is up to date</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">Troubleshooting</h3>
              <ul className="text-slate-400 text-sm space-y-1">
                <li>• Check your internet connection</li>
                <li>• Verify QuickBooks company access</li>
                <li>• Contact support for connection issues</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="border-slate-600 text-slate-400 hover:text-white">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Documentation
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-400 hover:text-white">
              <Download className="h-4 w-4 mr-2" />
              Download Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
