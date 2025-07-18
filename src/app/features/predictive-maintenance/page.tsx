"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import {
  Settings,
  Wrench,
  Brain,
  TrendingUp,
  Clock,
  AlertTriangle,
  Shield,
  Activity,
  CheckCircle,
  ArrowRight,
  Zap,
  Calendar,
  DollarSign
} from "lucide-react"

export default function PredictiveMaintenancePage() {
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
              Back to Features
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Start Free Trial
            </Button>
          </div>
        </div>
      </header>

      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
              <Settings className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Predictive Maintenance</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              AI-Powered
              <span className="text-green-400"> Predictive Maintenance</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Transform reactive maintenance into proactive efficiency. Our AI algorithms predict
              equipment failures before they happen, reducing downtime by 75% and maintenance costs by 40%.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-white">AI Failure Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Machine learning algorithms analyze equipment data to predict failures 30-90 days in advance.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Automated maintenance scheduling based on equipment condition and usage patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Performance Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Continuous monitoring of equipment health with real-time performance analytics.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Predictive Capabilities */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Advanced Prediction Capabilities
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Wrench className="w-6 h-6 text-green-400" />
                    Equipment Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">HVAC system monitoring</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Elevator performance tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Plumbing system analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Electrical system health</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    Predictive Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Failure probability scoring</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Optimal maintenance timing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Parts replacement planning</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Cost optimization recommendations</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ROI Benefits */}
          <div className="bg-slate-800/30 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Proven ROI Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">40% Cost Reduction</h3>
                <p className="text-slate-400">
                  Reduce maintenance costs through optimized scheduling and prevented failures
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">75% Less Downtime</h3>
                <p className="text-slate-400">
                  Minimize unexpected equipment failures and service interruptions
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">3x Equipment Lifespan</h3>
                <p className="text-slate-400">
                  Extend equipment life through optimized maintenance strategies
                </p>
              </div>
            </div>
          </div>

          {/* Maintenance Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Intelligent Maintenance Workflow
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Data Collection</h3>
                  <p className="text-sm text-slate-400">
                    IoT sensors continuously monitor equipment performance and conditions
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2">AI Analysis</h3>
                  <p className="text-sm text-slate-400">
                    Machine learning algorithms analyze patterns and predict failures
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Early Warning</h3>
                  <p className="text-sm text-slate-400">
                    Automated alerts notify teams of potential issues before they occur
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Wrench className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Proactive Action</h3>
                  <p className="text-sm text-slate-400">
                    Scheduled maintenance prevents failures and optimizes performance
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Integration with Fiix */}
          <div className="mb-16">
            <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Fiix Software Integration
                    </h2>
                    <p className="text-slate-300 mb-4">
                      Seamlessly connect with Fiix Software for complete maintenance management.
                      Our predictive insights automatically create work orders and schedule maintenance tasks.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Automated work orders</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Inventory management</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Vendor coordination</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Revolutionize Your Maintenance Strategy
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Stop reacting to equipment failures. Start preventing them with AI-powered
              predictive maintenance that saves time, money, and reduces downtime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Start Predictive Maintenance
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                Calculate ROI
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
