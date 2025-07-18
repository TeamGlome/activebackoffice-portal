"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import { useAuth } from "../../../../../contexts/AuthContext"
import {
  CheckCircle,
  XCircle,
  Loader2,
  FileSpreadsheet,
  AlertTriangle
} from "lucide-react"

type CallbackStatus = 'processing' | 'success' | 'error'

export default function GoogleSheetsCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentEntity } = useAuth()
  const [status, setStatus] = useState<CallbackStatus>('processing')
  const [error, setError] = useState<string | null>(null)
  const [accountInfo, setAccountInfo] = useState<{
    email: string
    name: string
    sheetsCount: number
  } | null>(null)

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')

        if (error) {
          setError(`Authorization failed: ${error}`)
          setStatus('error')
          return
        }

        if (!code) {
          setError('Missing authorization code')
          setStatus('error')
          return
        }

        // Verify state parameter
        const expectedState = `entity_${currentEntity?.id}`
        if (state !== expectedState) {
          setError('Invalid state parameter')
          setStatus('error')
          return
        }

        // Mock token exchange - replace with real Google Sheets API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Mock account info retrieval
        const mockAccountInfo = {
          email: currentEntity?.name?.toLowerCase().replace(/\s+/g, '') + '@example.com' || 'unknown@example.com',
          name: currentEntity?.name + ' Admin' || 'Unknown User',
          sheetsCount: 4
        }

        setAccountInfo(mockAccountInfo)
        setStatus('success')

        // Redirect to Google Sheets integration page after success
        setTimeout(() => {
          router.push('/dashboard/integrations/google-sheets')
        }, 3000)

      } catch (err) {
        setError('Failed to complete Google Sheets integration')
        setStatus('error')
      }
    }

    processCallback()
  }, [searchParams, currentEntity, router])

  const handleRetry = () => {
    router.push('/dashboard/integrations/google-sheets')
  }

  const handleGoToIntegrations = () => {
    router.push('/dashboard/integrations')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className="bg-slate-800/50 border-slate-700 w-full max-w-md">
        <CardContent className="p-8 text-center">
          {status === 'processing' && (
            <>
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Connecting to Google Sheets</h2>
              <p className="text-slate-400 mb-6">
                Please wait while we complete your Google Sheets integration...
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Exchanging authorization code
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                  Retrieving Google account information
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                  Discovering available spreadsheets
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                  Configuring integration settings
                </div>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Google Sheets Connected!</h2>
              <p className="text-slate-400 mb-6">
                Successfully connected to your Google account. Your spreadsheets are now available for real-time synchronization.
              </p>

              {accountInfo && (
                <div className="bg-slate-700/50 rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Google Account:</span>
                    <span className="text-white font-medium">{accountInfo.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">User Name:</span>
                    <span className="text-white font-medium">{accountInfo.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Available Sheets:</span>
                    <span className="text-white font-medium">{accountInfo.sheetsCount}</span>
                  </div>
                </div>
              )}

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span className="font-medium">Integration Features Enabled:</span>
                </div>
                <ul className="text-sm text-green-300 space-y-1 text-left">
                  <li>• Real-time bidirectional data synchronization</li>
                  <li>• Access to existing spreadsheets and templates</li>
                  <li>• Team collaboration and shared editing</li>
                  <li>• Automated property management workflows</li>
                </ul>
              </div>

              <p className="text-sm text-slate-500 mb-4">
                Redirecting to Google Sheets integration page...
              </p>

              <Button
                onClick={() => router.push('/dashboard/integrations/google-sheets')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Go to Google Sheets Integration
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Connection Failed</h2>
              <p className="text-slate-400 mb-6">
                {error || 'An unexpected error occurred while connecting to Google Sheets.'}
              </p>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Troubleshooting Tips:</span>
                </div>
                <ul className="text-sm text-red-300 mt-2 space-y-1 text-left">
                  <li>• Make sure you have access to Google Sheets</li>
                  <li>• Check that your Google account is active</li>
                  <li>• Ensure you granted the necessary permissions</li>
                  <li>• Try clearing your browser cache and cookies</li>
                  <li>• Disable popup blockers for this site</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleRetry}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Try Again
                </Button>
                <Button
                  onClick={handleGoToIntegrations}
                  variant="outline"
                  className="border-slate-600 text-slate-400"
                >
                  Back to Integrations
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
