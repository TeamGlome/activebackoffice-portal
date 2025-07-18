'use client'

import { useState } from 'react'

export default function SetupPage() {
  const [setupStatus, setSetupStatus] = useState<'idle' | 'checking' | 'running' | 'success' | 'error'>('idle')
  const [setupResult, setSetupResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [qbMigrationStatus, setQbMigrationStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [qbMigrationResult, setQbMigrationResult] = useState<any>(null)

  const checkStatus = async () => {
    setSetupStatus('checking')
    try {
      const response = await fetch('/api/setup-production')
      const data = await response.json()
      setSetupResult(data)

      if (data.setupRequired) {
        setSetupStatus('idle')
      } else {
        setSetupStatus('success')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check status')
      setSetupStatus('error')
    }
  }

  const runSetup = async () => {
    setSetupStatus('running')
    setError(null)

    try {
      const response = await fetch('/api/setup-production', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer abo-setup-2025',
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      setSetupResult(data)

      if (data.success) {
        setSetupStatus('success')
      } else {
        setError(data.error || 'Setup failed')
        setSetupStatus('error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed')
      setSetupStatus('error')
    }
  }

  const runQuickBooksMigration = async () => {
    setQbMigrationStatus('running')

    try {
      const response = await fetch('/api/migrate-quickbooks-schema')
      const data = await response.json()
      setQbMigrationResult(data)

      if (data.success) {
        setQbMigrationStatus('success')
      } else {
        setQbMigrationStatus('error')
      }
    } catch (err) {
      setQbMigrationStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-lg">
              ABO
            </div>
            <h1 className="text-3xl font-bold text-white">Active Back Office</h1>
          </div>
          <p className="text-slate-400 text-lg">Production Database Setup</p>
        </div>

        {/* Setup Cards */}
        <div className="grid gap-6 mb-8">
          {/* Status Check Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg">
            <div className="p-6">
              <h2 className="text-white text-xl font-semibold mb-2 flex items-center gap-2">
                <span>📊</span> Database Status
              </h2>
              <p className="text-slate-400 mb-4">Check the current state of your production database</p>

              <button
                onClick={checkStatus}
                disabled={setupStatus === 'checking'}
                className="w-full mb-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded border border-slate-600 disabled:opacity-50"
              >
                {setupStatus === 'checking' ? 'Checking...' : 'Check Database Status'}
              </button>

              {setupResult && (
                <div className="p-4 bg-slate-700 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={setupResult.databaseConnected ? '✅' : '❌'}></span>
                      <span className="text-slate-300">Database Connected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={setupResult.adminUserExists ? '✅' : '⚠️'}></span>
                      <span className="text-slate-300">Admin User</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={setupResult.entityExists ? '✅' : '⚠️'}></span>
                      <span className="text-slate-300">Entity Setup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={!setupResult.setupRequired ? '✅' : '⚠️'}></span>
                      <span className="text-slate-300">Setup Complete</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Setup Action Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg">
            <div className="p-6">
              <h2 className="text-white text-xl font-semibold mb-2 flex items-center gap-2">
                <span>🛡️</span> Initialize Production Database
              </h2>
              <p className="text-slate-400 mb-4">Set up the database schema and create the admin user</p>

              <button
                onClick={runSetup}
                disabled={setupStatus === 'running' || setupStatus === 'success'}
                className="w-full mb-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded disabled:opacity-50"
              >
                {setupStatus === 'running' ? 'Setting up...' : setupStatus === 'success' ? 'Setup Complete!' : 'Run Database Setup'}
              </button>

              {setupStatus === 'success' && setupResult && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span>✅</span>
                    <h3 className="font-semibold text-green-400">Setup Successful!</h3>
                  </div>
                  <div className="space-y-2 text-sm text-green-300">
                    <p><strong>Admin Email:</strong> {setupResult.adminEmail}</p>
                    <p><strong>Admin Password:</strong> {setupResult.adminPassword}</p>
                    <p><strong>Login URL:</strong> <a href={setupResult.loginUrl} className="underline hover:text-green-200">{setupResult.loginUrl}</a></p>
                  </div>
                  <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-400 text-xs">
                    ⚠️ {setupResult.warning}
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span>❌</span>
                    <h3 className="font-semibold text-red-400">Setup Failed</h3>
                  </div>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* QuickBooks Integration Migration Card */}
          <div className="bg-slate-800 border border-slate-700 rounded-lg">
            <div className="p-6">
              <h2 className="text-white text-xl font-semibold mb-2 flex items-center gap-2">
                <span>🏢</span> QuickBooks Integration Schema
              </h2>
              <p className="text-slate-400 mb-4">Create database schema for QuickBooks integration and OAuth flow</p>

              <button
                onClick={runQuickBooksMigration}
                disabled={qbMigrationStatus === 'running' || qbMigrationStatus === 'success'}
                className="w-full mb-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded disabled:opacity-50"
              >
                {qbMigrationStatus === 'running' ? 'Setting up...' : qbMigrationStatus === 'success' ? 'QuickBooks Schema Ready!' : 'Setup QuickBooks Integration'}
              </button>

              {qbMigrationStatus === 'success' && qbMigrationResult && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span>✅</span>
                    <h3 className="font-semibold text-green-400">QuickBooks Schema Ready!</h3>
                  </div>
                  <div className="space-y-2 text-sm text-green-300">
                    <p><strong>Status:</strong> {qbMigrationResult.message}</p>
                    <p><strong>Integrations:</strong> {qbMigrationResult.counts?.integrations || 0}</p>
                    <p><strong>Entities:</strong> {qbMigrationResult.counts?.entities || 0}</p>
                    <p><strong>Timestamp:</strong> {qbMigrationResult.timestamp}</p>
                  </div>
                </div>
              )}

              {qbMigrationStatus === 'error' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span>❌</span>
                    <h3 className="font-semibold text-red-400">Migration Failed</h3>
                  </div>
                  <p className="text-sm text-red-300">
                    {qbMigrationResult?.details || 'QuickBooks migration failed - check server logs'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg">
          <div className="p-6">
            <h2 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
              <span>👥</span> Next Steps After Setup
            </h2>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">1</div>
                <div>
                  <strong className="text-white">Login & Change Password</strong>
                  <p>Use the admin credentials to login and immediately change the password</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">2</div>
                <div>
                  <strong className="text-white">Connect QuickBooks</strong>
                  <p>Navigate to Integrations → QuickBooks and connect your account</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">3</div>
                <div>
                  <strong className="text-white">Create Users</strong>
                  <p>Go to Platform → Users to add team members with appropriate roles</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5">4</div>
                <div>
                  <strong className="text-white">Review Security</strong>
                  <p>Check Platform → Security settings and configure monitoring alerts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
