"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import {
  DollarSign,
  Calculator,
  TrendingUp,
  BarChart3,
  FileText,
  CreditCard,
  Building2,
  Users,
  CheckCircle,
  ArrowRight,
  Zap,
  Clock,
  Target
} from "lucide-react"

export default function FinancialBackOfficePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                ABO
              </div>
              <h1 className="text-xl font-semibold text-white">Active Back Office</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              Back to Home
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Financial Back Office Solutions</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Streamlined
              <span className="text-green-400"> Financial Operations</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Automate your property management finances with integrated accounting, automated billing,
              and real-time financial reporting. Save $245K+ annually through intelligent automation.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Automated Accounting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Seamless QuickBooks integration with automated transaction categorization and reconciliation.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Real-time Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Live financial dashboards with P&L statements, cash flow analysis, and performance metrics.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Automated Billing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Intelligent rent collection, late fee calculation, and tenant payment processing automation.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Financial Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Complete Financial Management Suite
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-green-400" />
                    Financial Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Real-time P&L statements</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Cash flow forecasting</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Budget vs actual analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Property performance metrics</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-400" />
                    Automated Workflows
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Automated rent collection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Expense categorization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Invoice processing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Financial reporting</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ROI Benefits */}
          <div className="bg-slate-800/30 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Proven Financial Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">$245K+ Annual Savings</h3>
                <p className="text-slate-400">
                  Average cost savings through automated processes and compliance optimization
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">85% Time Reduction</h3>
                <p className="text-slate-400">
                  Reduce manual financial tasks with intelligent automation and workflows
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Real-time Insights</h3>
                <p className="text-slate-400">
                  Instant financial visibility across all properties and portfolio performance
                </p>
              </div>
            </div>
          </div>

          {/* Integration Showcase */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Seamless Financial Integrations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 text-center p-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-medium">QuickBooks</h3>
                <p className="text-xs text-slate-400 mt-1">Accounting Integration</p>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 text-center p-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-white font-medium">Plaid Banking</h3>
                <p className="text-xs text-slate-400 mt-1">Bank Connections</p>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 text-center p-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white font-medium">Document AI</h3>
                <p className="text-xs text-slate-400 mt-1">Invoice Processing</p>
              </Card>
              <Card className="bg-slate-800/50 border-slate-700 text-center p-6">
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-white font-medium">Tenant Portal</h3>
                <p className="text-xs text-slate-400 mt-1">Payment Processing</p>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Transform Your Financial Operations Today
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Streamline your property management finances with automated workflows,
              real-time reporting, and intelligent cost optimization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Start Financial Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                View ROI Calculator
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
