"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { PermissionGuard } from "../../../components/PermissionGuard"
import {
  Zap,
  Brain,
  TrendingUp,
  Target,
  MessageSquare,
  Search,
  Send,
  BarChart3,
  AlertTriangle,
  DollarSign,
  Calendar,
  Users,
  Building2,
  Activity,
  RefreshCw
} from "lucide-react"

const aiInsights = [
  {
    id: 1,
    type: "prediction",
    title: "Rent Collection Forecast",
    insight: "94.2% collection rate predicted for next month based on historical patterns",
    confidence: 94,
    impact: "High",
    category: "Financial",
    action: "Monitor late payment trends in Units A-203, B-104"
  },
  {
    id: 2,
    type: "maintenance",
    title: "HVAC Maintenance Alert",
    insight: "Unit C-301 HVAC system shows 89% probability of failure within 30 days",
    confidence: 89,
    impact: "Medium",
    category: "Maintenance",
    action: "Schedule preventive maintenance for Unit C-301"
  },
  {
    id: 3,
    type: "risk",
    title: "Tenant Risk Assessment",
    insight: "New applicant for Unit B-205 shows 12% risk score - Recommend approval",
    confidence: 88,
    impact: "Low",
    category: "Risk Management",
    action: "Process application with standard lease terms"
  },
  {
    id: 4,
    type: "optimization",
    title: "Energy Efficiency Opportunity",
    insight: "Sunset Apartments can reduce energy costs by 23% with smart thermostat installation",
    confidence: 91,
    impact: "High",
    category: "Optimization",
    action: "Request quote for smart thermostat installation"
  }
]

const nlQueries = [
  "Show me overdue rent for this month",
  "Which properties have the highest maintenance costs?",
  "Predict next quarter's vacancy rate",
  "Find tenants with lease expiring in 60 days",
  "Calculate ROI for energy efficiency upgrades"
]

export default function AIAnalytics() {
  const [nlQuery, setNlQuery] = useState("")
  const [queryResults, setQueryResults] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleNLQuery = async () => {
    if (!nlQuery.trim()) return

    setIsProcessing(true)
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock AI response
    const mockResponses: { [key: string]: string } = {
      "overdue rent": "Found 8 tenants with overdue rent totaling $12,450. Sunset Apartments (3 tenants), Oak Grove (3 tenants), Downtown Lofts (2 tenants).",
      "maintenance costs": "Oak Grove Complex has highest maintenance costs at $4,200/month (18% above average). Main issues: HVAC repairs and plumbing.",
      "vacancy rate": "Predicted vacancy rate for Q4 2024: 7.2% (industry average: 8.1%). Confidence: 89%",
      "lease expiring": "12 leases expiring in next 60 days. 8 tenants likely to renew (high confidence), 4 require retention efforts.",
      "energy efficiency": "Smart thermostat ROI: 23% energy savings, 18-month payback period, $18,400 annual savings across all properties."
    }

    const response = Object.keys(mockResponses).find(key =>
      nlQuery.toLowerCase().includes(key)
    )

    setQueryResults(response ? mockResponses[response] : "I found some relevant insights. Let me analyze this data for you...")
    setIsProcessing(false)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "Medium":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
      case "Low":
        return "bg-green-500/10 text-green-400 border-green-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Financial":
        return <DollarSign className="w-4 h-4" />
      case "Maintenance":
        return <Activity className="w-4 h-4" />
      case "Risk Management":
        return <AlertTriangle className="w-4 h-4" />
      case "Optimization":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Analytics</h1>
          <p className="text-slate-400">Predictive insights and intelligent automation</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
            <Activity className="w-3 h-3 mr-1" />
            AI Models Active
          </Badge>
          <PermissionGuard permission="entity.ai.models">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retrain Models
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* AI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Active Predictions</p>
                <p className="text-2xl font-bold text-white">247</p>
                <p className="text-xs text-green-400">+12 this week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Model Accuracy</p>
                <p className="text-2xl font-bold text-white">94.2%</p>
                <p className="text-xs text-green-400">+2.1% improved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Time Saved</p>
                <p className="text-2xl font-bold text-white">127 hrs</p>
                <p className="text-xs text-blue-400">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Cost Savings</p>
                <p className="text-2xl font-bold text-white">$47K</p>
                <p className="text-xs text-orange-400">Projected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Natural Language Query Interface */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Ask AI Assistant
            </CardTitle>
            <p className="text-sm text-slate-400">Ask questions about your properties in plain English</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                placeholder="Ask about your properties..."
                className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onKeyPress={(e) => e.key === 'Enter' && handleNLQuery()}
              />
              <Button
                onClick={handleNLQuery}
                disabled={isProcessing || !nlQuery.trim()}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {queryResults && (
              <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="flex items-start gap-2">
                  <Brain className="w-5 h-5 text-purple-400 mt-0.5" />
                  <div>
                    <p className="text-white text-sm">{queryResults}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs text-slate-500">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {nlQueries.map((query) => (
                  <button
                    key={query}
                    onClick={() => setNlQuery(query)}
                    className="text-xs px-2 py-1 bg-slate-700/30 text-slate-400 rounded border border-slate-600 hover:bg-slate-700/50 transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Predictive Models Status */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Active AI Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Rent Prediction</p>
                    <p className="text-xs text-slate-400">Next-gen forecasting</p>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                  96% Accuracy
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Maintenance Predictor</p>
                    <p className="text-xs text-slate-400">Preventive insights</p>
                  </div>
                </div>
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                  91% Accuracy
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">Risk Assessment</p>
                    <p className="text-xs text-slate-400">Tenant screening</p>
                  </div>
                </div>
                <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                  89% Accuracy
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-white font-medium">Optimization Engine</p>
                    <p className="text-xs text-slate-400">Cost reduction</p>
                  </div>
                </div>
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                  93% Accuracy
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Feed */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Latest AI Insights
          </CardTitle>
          <p className="text-sm text-slate-400">Real-time predictions and recommendations</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      {getCategoryIcon(insight.category)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{insight.title}</h4>
                      <p className="text-xs text-slate-400">{insight.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact} Impact
                    </Badge>
                    <Badge className="bg-slate-700 text-slate-300 border-slate-600">
                      {insight.confidence}% Confidence
                    </Badge>
                  </div>
                </div>

                <p className="text-slate-300 mb-3">{insight.insight}</p>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-orange-400 font-medium">
                    Recommended Action: {insight.action}
                  </p>
                  <PermissionGuard permission="entity.ai.models">
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-400">
                      Take Action
                    </Button>
                  </PermissionGuard>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
