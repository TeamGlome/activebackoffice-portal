"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import {
  Shield,
  AlertTriangle,
  Target,
  TrendingUp,
  Eye,
  Brain,
  Scale,
  FileText,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Gauge,
  Clock
} from "lucide-react"

export default function RiskAssessmentPage() {
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
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
              <Shield className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Risk Assessment</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Comprehensive
              <span className="text-red-400"> Risk Assessment</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Identify, analyze, and mitigate risks across your property portfolio with AI-powered assessment tools.
              Achieve 97% compliance violation prevention and reduce liability exposure by 85%.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <CardTitle className="text-white">Risk Identification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  AI-powered analysis identifies potential risks across safety, compliance, financial, and operational areas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-yellow-400" />
                </div>
                <CardTitle className="text-white">Risk Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Automated risk scoring and prioritization based on severity, likelihood, and potential impact.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Scale className="w-6 h-6 text-green-400" />
                </div>
                <CardTitle className="text-white">Mitigation Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  Automated action plans and recommendations for risk mitigation and compliance maintenance.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Risk Categories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Comprehensive Risk Analysis
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Shield className="w-6 h-6 text-red-400" />
                    Safety & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">NYC Local Law compliance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Fire safety assessments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Building code violations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Environmental hazards</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                    Financial & Operational
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Market volatility exposure</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Cash flow vulnerabilities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Tenant credit risks</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-slate-300">Maintenance cost overruns</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Risk Assessment Process */}
          <div className="bg-slate-800/30 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              AI-Powered Assessment Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Data Collection</h3>
                <p className="text-slate-400">
                  Automated gathering of property data, compliance records, and performance metrics
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI Analysis</h3>
                <p className="text-slate-400">
                  Machine learning algorithms identify patterns and potential risk factors
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gauge className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Risk Scoring</h3>
                <p className="text-slate-400">
                  Automated prioritization based on impact probability and severity levels
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Action Plans</h3>
                <p className="text-slate-400">
                  Automated recommendations and mitigation strategies for identified risks
                </p>
              </div>
            </div>
          </div>

          {/* Risk Dashboard */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Risk Assessment Dashboard
            </h2>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <h3 className="text-white font-medium">High Risk</h3>
                    <p className="text-2xl font-bold text-red-400">3</p>
                    <p className="text-xs text-slate-400">Critical Issues</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <Target className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <h3 className="text-white font-medium">Medium Risk</h3>
                    <p className="text-2xl font-bold text-yellow-400">8</p>
                    <p className="text-xs text-slate-400">Monitoring</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <h3 className="text-white font-medium">Low Risk</h3>
                    <p className="text-2xl font-bold text-green-400">15</p>
                    <p className="text-xs text-slate-400">Acceptable</p>
                  </div>
                  <div className="text-center p-4 bg-slate-700/30 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <h3 className="text-white font-medium">Risk Score</h3>
                    <p className="text-2xl font-bold text-blue-400">7.2</p>
                    <p className="text-xs text-slate-400">Portfolio Average</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Risk Management Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">97% Violation Prevention</h3>
                      <p className="text-slate-400">
                        Proactive identification and mitigation of compliance risks before violations occur.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Early Warning System</h3>
                      <p className="text-slate-400">
                        Get alerts 30-90 days before potential issues become critical problems.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">85% Liability Reduction</h3>
                      <p className="text-slate-400">
                        Minimize legal exposure through proactive risk management and documentation.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Data-Driven Decisions</h3>
                      <p className="text-slate-400">
                        Make informed decisions with comprehensive risk analytics and scoring.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Compliance Integration */}
          <div className="mb-16">
            <Card className="bg-gradient-to-r from-red-500/10 to-purple-500/10 border-red-500/20">
              <CardContent className="p-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <Scale className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      NYC Compliance Integration
                    </h2>
                    <p className="text-slate-300 mb-4">
                      Specialized risk assessment for NYC Local Laws with automated compliance tracking.
                      Our system monitors 47+ local laws and prevents violations before they occur.
                    </p>
                    <div className="flex items-center gap-6 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Local Law 97 (Climate)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>Local Law 11 (Facade)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>47+ Local Laws</span>
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
              Protect Your Properties with Smart Risk Assessment
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Don't wait for problems to occur. Identify and mitigate risks proactively
              with our AI-powered risk assessment platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                Start Risk Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
                View Risk Report Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
