"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { Button } from "../../../../components/ui/button"
import { PermissionGuard } from "../../../../components/PermissionGuard"
import { useAuth } from "../../../../contexts/AuthContext"
import {
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  Eye,
  Download,
  Upload,
  Calendar,
  Building2,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  ExternalLink,
  Plus,
  Trash2,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react"

// Mock Plaid data - replace with real API integration
const mockPlaidData = {
  accounts: [
    {
      accountId: 'acc_1',
      name: 'Operating Checking',
      officialName: 'Business Operating Account',
      type: 'depository',
      subtype: 'checking',
      balances: {
        available: 245670.50,
        current: 245670.50,
        limit: null
      },
      mask: '4532',
      institution: 'Chase Bank'
    },
    {
      accountId: 'acc_2',
      name: 'Security Deposits',
      officialName: 'Security Deposit Savings',
      type: 'depository',
      subtype: 'savings',
      balances: {
        available: 125430.00,
        current: 125430.00,
        limit: null
      },
      mask: '7890',
      institution: 'Chase Bank'
    },
    {
      accountId: 'acc_3',
      name: 'Business Credit',
      officialName: 'Business Credit Card',
      type: 'credit',
      subtype: 'credit card',
      balances: {
        available: 47650.00,
        current: -2350.00,
        limit: 50000.00
      },
      mask: '1234',
      institution: 'Chase Bank'
    }
  ],
  transactions: [
    {
      transactionId: 'txn_1',
      accountId: 'acc_1',
      amount: -2400.00,
      date: '2024-07-16',
      name: 'RENT PAYMENT - UNIT A102',
      merchantName: 'Tenant Payment',
      category: ['Payment', 'Rent'],
      pending: false,
      accountName: 'Operating Checking'
    },
    {
      transactionId: 'txn_2',
      accountId: 'acc_1',
      amount: 450.75,
      date: '2024-07-15',
      name: 'MAINTENANCE - HVAC REPAIR',
      merchantName: 'ABC HVAC Services',
      category: ['Service', 'Professional Services'],
      pending: false,
      accountName: 'Operating Checking'
    },
    {
      transactionId: 'txn_3',
      accountId: 'acc_1',
      amount: -2200.00,
      date: '2024-07-15',
      name: 'RENT PAYMENT - UNIT B205',
      merchantName: 'Tenant Payment',
      category: ['Payment', 'Rent'],
      pending: false,
      accountName: 'Operating Checking'
    },
    {
      transactionId: 'txn_4',
      accountId: 'acc_3',
      amount: 125.00,
      date: '2024-07-14',
      name: 'HOME DEPOT',
      merchantName: 'Home Depot',
      category: ['Shops', 'Home Improvement'],
      pending: false,
      accountName: 'Business Credit'
    },
    {
      transactionId: 'txn_5',
      accountId: 'acc_1',
      amount: 75.50,
      date: '2024-07-14',
      name: 'INSURANCE PREMIUM',
      merchantName: 'Property Insurance Co',
      category: ['Service', 'Insurance'],
      pending: true,
      accountName: 'Operating Checking'
    }
  ],
  syncStatus: {
    lastSync: '2024-07-16 14:15:00',
    status: 'connected',
    accountsConnected: 3,
    transactionsImported: 89,
    errors: 0
  }
}

export default function PlaidIntegration() {
  const { currentEntity } = useAuth()
  const [isConnected, setIsConnected] = useState(true) // Mock connected state
  const [isSyncing, setIsSyncing] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [selectedAccount, setSelectedAccount] = useState<string>('all')

  const handleConnect = async () => {
    // Mock Plaid Link flow - replace with real Plaid Link
    const linkToken = 'mock_link_token'

    // In real implementation, you would:
    // 1. Get link_token from your backend
    // 2. Initialize Plaid Link
    // 3. Handle onSuccess callback

    console.log('Opening Plaid Link...', linkToken)
    setIsConnected(true)
  }

  const handleSync = async () => {
    setIsSyncing(true)
    // Mock sync process
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsSyncing(false)
  }

  const handleDisconnect = async () => {
    setIsConnected(false)
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'accounts', name: 'Accounts', icon: Building2 },
    { id: 'transactions', name: 'Transactions', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount))
  }

  const getAccountTypeColor = (type: string, subtype: string) => {
    if (type === 'credit') return 'text-orange-400'
    if (subtype === 'checking') return 'text-blue-400'
    if (subtype === 'savings') return 'text-green-400'
    return 'text-slate-400'
  }

  const getTransactionIcon = (amount: number) => {
    return amount < 0 ? (
      <ArrowDownLeft className="w-4 h-4 text-green-400" />
    ) : (
      <ArrowUpRight className="w-4 h-4 text-red-400" />
    )
  }

  const filteredTransactions = selectedAccount === 'all'
    ? mockPlaidData.transactions
    : mockPlaidData.transactions.filter(t => t.accountId === selectedAccount)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/integrations">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <Link href="/dashboard/integrations" className="hover:text-white transition-colors">
                Integrations
              </Link>
              <span>/</span>
              <span className="text-white">Plaid Banking</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Plaid Banking</h1>
                <p className="text-slate-400">Bank account and transaction management</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isConnected && (
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              {mockPlaidData.syncStatus.accountsConnected} Accounts Connected
            </Badge>
          )}

          <PermissionGuard permission="entity.integrations.plaid.transactions">
            {isConnected ? (
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Transactions
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Connect Bank Account
              </Button>
            )}
          </PermissionGuard>
        </div>
      </div>

      {!isConnected ? (
        /* Connection Setup */
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Connect Your Bank Accounts</h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Securely connect your business bank accounts to track property income, expenses, and financial performance
              for {currentEntity?.name}.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Building2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Account Balances</p>
                <p className="text-xs text-slate-400">Real-time balance tracking</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Transaction History</p>
                <p className="text-xs text-slate-400">Automated categorization</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <DollarSign className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Payment Verification</p>
                <p className="text-xs text-slate-400">Rent payment tracking</p>
              </div>
              <div className="p-4 bg-slate-700/50 rounded-lg">
                <Download className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">Financial Reports</p>
                <p className="text-xs text-slate-400">Automated reporting</p>
              </div>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white font-medium">Bank-level Security</span>
              </div>
              <p className="text-xs text-slate-400">
                Plaid uses 256-bit SSL encryption and is trusted by major financial institutions.
                We never store your banking credentials.
              </p>
            </div>

            <PermissionGuard permission="entity.integrations.plaid.connect">
              <Button
                onClick={handleConnect}
                size="lg"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Connect Bank Account
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </PermissionGuard>
          </CardContent>
        </Card>
      ) : (
        /* Connected Dashboard */
        <>
          {/* Tab Navigation */}
          <div className="border-b border-slate-700">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      selectedTab === tab.id
                        ? 'border-orange-500 text-orange-400'
                        : 'border-transparent text-slate-400 hover:text-white hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Sync Status */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Banking Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                      <div>
                        <p className="text-white font-medium">Last Sync</p>
                        <p className="text-sm text-slate-400">
                          {new Date(mockPlaidData.syncStatus.lastSync).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="w-8 h-8 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">Connected Accounts</p>
                        <p className="text-sm text-slate-400">
                          {mockPlaidData.syncStatus.accountsConnected}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Upload className="w-8 h-8 text-purple-400" />
                      <div>
                        <p className="text-white font-medium">Transactions</p>
                        <p className="text-sm text-slate-400">{mockPlaidData.syncStatus.transactionsImported}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Balances */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {mockPlaidData.accounts.map((account) => (
                  <Card key={account.accountId} className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{account.name}</h4>
                            <p className="text-sm text-slate-400">••••{account.mask}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Available</span>
                          <span className="text-white font-medium">
                            {formatCurrency(account.balances.available || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-sm">Current</span>
                          <span className="text-white font-medium">
                            {formatCurrency(account.balances.current || 0)}
                          </span>
                        </div>
                        {account.balances.limit && (
                          <div className="flex justify-between">
                            <span className="text-slate-400 text-sm">Limit</span>
                            <span className="text-slate-400">
                              {formatCurrency(account.balances.limit)}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'accounts' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Connected Accounts</CardTitle>
                  <PermissionGuard permission="entity.integrations.plaid.connect">
                    <Button className="bg-green-500 hover:bg-green-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Account
                    </Button>
                  </PermissionGuard>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPlaidData.accounts.map((account) => (
                    <div key={account.accountId} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{account.officialName}</h4>
                            <p className="text-sm text-slate-400">{account.institution} ••••{account.mask}</p>
                            <p className={`text-sm capitalize ${getAccountTypeColor(account.type, account.subtype)}`}>
                              {account.subtype} account
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-lg">
                            {formatCurrency(account.balances.current || 0)}
                          </p>
                          <p className="text-sm text-slate-400">
                            Available: {formatCurrency(account.balances.available || 0)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <PermissionGuard permission="entity.integrations.plaid.connect">
                              <Button variant="outline" size="sm" className="border-red-600 text-red-400">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </PermissionGuard>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'transactions' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Recent Transactions</CardTitle>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedAccount}
                      onChange={(e) => setSelectedAccount(e.target.value)}
                      className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 text-white text-sm"
                    >
                      <option value="all">All Accounts</option>
                      {mockPlaidData.accounts.map((account) => (
                        <option key={account.accountId} value={account.accountId}>
                          {account.name}
                        </option>
                      ))}
                    </select>
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                      <Download className="w-3 h-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.transactionId} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-600/50 rounded-lg flex items-center justify-center">
                            {getTransactionIcon(transaction.amount)}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">{transaction.name}</h4>
                            <p className="text-sm text-slate-400">{transaction.accountName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                                {transaction.category[0]}
                              </Badge>
                              {transaction.pending && (
                                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">
                                  Pending
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${transaction.amount < 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {transaction.amount < 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-sm text-slate-400">{transaction.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTab === 'settings' && (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Banking Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Auto Sync</h4>
                      <p className="text-sm text-slate-400">Automatically sync transactions daily</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Transaction Categorization</h4>
                      <p className="text-sm text-slate-400">Automatically categorize property-related transactions</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Payment Notifications</h4>
                      <p className="text-sm text-slate-400">Get notified when rent payments are received</p>
                    </div>
                    <Button variant="outline" className="border-slate-600 text-slate-400">
                      Enabled
                    </Button>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6">
                  <PermissionGuard permission="entity.integrations.plaid.connect">
                    <Button
                      onClick={handleDisconnect}
                      variant="outline"
                      className="border-red-600 text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Disconnect All Accounts
                    </Button>
                  </PermissionGuard>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
