"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "../../../../../components/ui/card"
import { Button } from "../../../../../components/ui/button"
import {
  CheckCircle,
  XCircle,
  Loader2,
  DollarSign,
  AlertTriangle
} from "lucide-react"

type CallbackStatus = 'processing' | 'success' | 'error'

export default function QuickBooksCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<CallbackStatus>('processing')
  const [error, setError] = useState<string | null>(null)
  const [companyInfo, setCompanyInfo] = useState<any>(null)

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const realmId = searchParams.get('realmId')
        const error = searchParams.get('error')

        if (error) {
          setError(`Authorization failed: ${error}`)
          setStatus('error')
          return
        }

        if (!code || !realmId) {
          setError('Missing authorization code or company ID')
          setStatus('error')
          return
        }

        // Call our live API endpoint to exchange the code for tokens
        const response = await fetch('/api/integrations/quickbooks/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            state,
            realmId
          })
        })

        const data = await response.json()

        if (data.success) {
          setCompanyInfo(data.integration.company_info)
          setStatus('success')

          // Redirect to QuickBooks integration page after 3 seconds
          setTimeout(() => {
            router.push('/dashboard/integrations/quickbooks')
          }, 3000)
        } else {
          setError(data.error || 'Failed to complete integration')
          setStatus('error')
        }
      } catch (err) {
        console.error('Callback processing error:', err)
        setError('An unexpected error occurred')
        setStatus('error')
      }
    }

    processCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
        <CardContent className="p-8 text-center">
          {status === 'processing' && (
            <>
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">
                Connecting to QuickBooks
              </h2>
              <p className="text-slate-400">
                Please wait while we complete your QuickBooks integration...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">
                Successfully Connected!
              </h2>
              {companyInfo && (
                <div className="mb-4 p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-slate-300 font-medium">{companyInfo.CompanyName}</p>
                  <p className="text-sm text-slate-400">QuickBooks Company</p>
                </div>
              )}
              <p className="text-slate-400 mb-6">
                Your QuickBooks account has been successfully connected. You can now sync your financial data.
              </p>
              <div className="text-sm text-slate-500">
                Redirecting to QuickBooks integration page...
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">
                Connection Failed
              </h2>
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-300 text-left">{error}</p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/dashboard/integrations/quickbooks')}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
