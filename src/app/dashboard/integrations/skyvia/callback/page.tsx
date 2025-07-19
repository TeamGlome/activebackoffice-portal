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
  Zap,
  AlertTriangle,
  Workflow,
  Database,
  GitBranch
} from "lucide-react"

type CallbackStatus = 'processing' | 'success' | 'error'

export default function SkyviaCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentEntity } = useAuth()
  const [status, setStatus] = useState<CallbackStatus>('processing')
  const [error, setError] = useState<string | null>(null)
  const [accountInfo, setAccountInfo] = useState<{
    name: string
    plan: string
    connectors: number
    hasETLFeatures: boolean
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

        // Mock token exchange - replace with real Skyvia API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Mock account info retrieval
        const mockAccountInfo = {
          name: currentEntity?.name || 'Unknown Organization',
          plan: 'Professional',
          connectors: 4,
          hasETLFeatures: true
        }

        setAccountInfo(mockAccountInfo)
        setStatus('success')

        // Redirect to Skyvia integration page after success
        setTimeout(() => {
          router.push('/dashboard/integrations/skyvia')
        }, 3000)

      } catch (err) {
        setError('Failed to complete Skyvia integration')
        setStatus('error')
      }
    }

    processCallback()
  }, [searchParams, currentEntity, router])

  const handleRetry = () => {
    router.push('/dashboard/integrations/skyvia')
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
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Connecting to Skyvia</h2>
              <p className="text-slate-400 mb-6">
                Please wait while we complete your Skyvia integration...
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  Exchanging authorization code
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                  Retrieving Skyvia account information
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                  Discovering available data connectors
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                  Setting up ETL workflow templates
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                  Configuring data transformation pipelines
                </div>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Skyvia Connected!</h2>
              <p className="text-slate-400 mb-6">
                Successfully connected to your Skyvia account. You can now build powerful no-code
                data integration workflows for your property management operations.
              </p>

              {accountInfo && (
                <div className="bg-slate-700/50 rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Organization:</span>
                    <span className="text-white font-medium">{accountInfo.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Plan:</span>
                    <span className="text-white font-medium">{accountInfo.plan}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Available Connectors:</span>
                    <span className="text-white font-medium">{accountInfo.connectors}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">ETL Features:</span>
                    <span className="text-green-400 font-medium">
                      {accountInfo.hasETLFeatures ? 'Enabled' : 'Basic'}
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">Skyvia Features Enabled:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-green-300">
                  <div className="flex items-center gap-1">
                    <Workflow className="w-3 h-3" />
                    <span>ETL Workflows</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    <span>Data Connectors</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    <span>Transformations</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Scheduled Sync</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-4">
                Redirecting to Skyvia integration page...
              </p>

              <Button
                onClick={() => router.push('/dashboard/integrations/skyvia')}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                <Zap className="w-4 h-4 mr-2" />
                Go to Skyvia Integration
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
                {error || 'An unexpected error occurred while connecting to Skyvia.'}
              </p>

              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-red-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Troubleshooting Tips:</span>
                </div>
                <ul className="text-sm text-red-300 mt-2 space-y-1 text-left">
                  <li>• Make sure you have a valid Skyvia account</li>
                  <li>• Check that your Skyvia plan supports API access</li>
                  <li>• Ensure you granted the necessary permissions</li>
                  <li>• Verify your API key is active and not expired</li>
                  <li>• Try clearing your browser cache and cookies</li>
                  <li>• Disable popup blockers for this site</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleRetry}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
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
