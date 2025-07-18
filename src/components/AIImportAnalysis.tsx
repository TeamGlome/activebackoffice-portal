"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { AICSVImportEngine, type AIDataAnalysis, type AIFieldMapping, type AIConfidenceLevel } from "../lib/ai-csv-import"
import {
  Brain,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Settings,
  Eye,
  Download,
  Upload,
  Lightbulb,
  Target,
  TrendingUp,
  Zap,
  FileText,
  Users,
  Building2,
  DollarSign,
  Wrench,
  BarChart3,
  ArrowRight,
  MapPin,
  Sparkles,
  Bot
} from "lucide-react"

interface AIImportAnalysisProps {
  fileName: string
  headers: string[]
  sampleData: string[][]
  onFieldMappingChange: (mappings: AIFieldMapping[]) => void
  onTemplateSelect: (templateId: string) => void
  onImportStart: () => void
}

export default function AIImportAnalysis({
  fileName,
  headers,
  sampleData,
  onFieldMappingChange,
  onTemplateSelect,
  onImportStart
}: AIImportAnalysisProps) {
  const [analysis, setAnalysis] = useState<AIDataAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [editingField, setEditingField] = useState<string | null>(null)

  const aiEngine = new AICSVImportEngine()

  useEffect(() => {
    performAIAnalysis()
  }, [headers, sampleData, performAIAnalysis])

  const performAIAnalysis = async () => {
    setIsAnalyzing(true)
    try {
      const result = await aiEngine.analyzeCSV(headers, sampleData)
      setAnalysis(result)
      onFieldMappingChange(result.fieldMappings)
      onTemplateSelect(result.suggestedTemplate)
    } catch (error) {
      console.error('AI analysis failed:', error)
    }
    setIsAnalyzing(false)
  }

  const getConfidenceColor = (confidence: AIConfidenceLevel) => {
    switch (confidence) {
      case 'very_high':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'high':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'low':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
      case 'very_low':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
    }
  }

  const getConfidenceIcon = (confidence: AIConfidenceLevel) => {
    switch (confidence) {
      case 'very_high':
      case 'high':
        return <CheckCircle className="w-3 h-3" />
      case 'medium':
        return <AlertTriangle className="w-3 h-3" />
      case 'low':
      case 'very_low':
        return <XCircle className="w-3 h-3" />
    }
  }

  const getDataQualityColor = (score: number) => {
    if (score >= 0.8) return 'text-green-400'
    if (score >= 0.6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'field_mapping':
        return <Target className="w-4 h-4" />
      case 'data_cleaning':
        return <Sparkles className="w-4 h-4" />
      case 'validation':
        return <CheckCircle className="w-4 h-4" />
      case 'format_correction':
        return <Settings className="w-4 h-4" />
      default:
        return <Lightbulb className="w-4 h-4" />
    }
  }

  const updateFieldMapping = (sourceField: string, newTargetField: string) => {
    if (!analysis) return

    const updatedMappings = analysis.fieldMappings.map(mapping =>
      mapping.sourceField === sourceField
        ? { ...mapping, targetField: newTargetField }
        : mapping
    )

    setAnalysis({ ...analysis, fieldMappings: updatedMappings })
    onFieldMappingChange(updatedMappings)
    setEditingField(null)
  }

  const tabs = [
    { id: 'overview', name: 'AI Analysis', icon: Brain },
    { id: 'mappings', name: 'Field Mappings', icon: Target },
    { id: 'recommendations', name: 'Recommendations', icon: Lightbulb },
    { id: 'preview', name: 'Data Preview', icon: Eye }
  ]

  if (isAnalyzing) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bot className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">AI Analysis in Progress</h3>
          <p className="text-slate-400 mb-6">
            Our AI is analyzing your CSV data for optimal field mapping and data quality assessment...
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-400 justify-center">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
              Detecting data patterns and field types
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400 justify-center">
              <Building2 className="w-4 h-4 text-slate-500" />
              Checking for Yardi property management exports
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400 justify-center">
              <Target className="w-4 h-4 text-slate-500" />
              Generating intelligent field mappings
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400 justify-center">
              <Sparkles className="w-4 h-4 text-slate-500" />
              Calculating data quality scores
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Analysis Failed</h3>
          <p className="text-slate-400 mb-6">
            Unable to analyze the CSV data. Please check the file format and try again.
          </p>
          <Button onClick={performAIAnalysis} className="bg-blue-500 hover:bg-blue-600 text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Analysis
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Analysis Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                AI Analysis Complete
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Smart Import Ready
                </Badge>
              </CardTitle>
              <p className="text-slate-400">Intelligent analysis of {fileName}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getDataQualityColor(analysis.dataQualityScore)}`}>
                {Math.round(analysis.dataQualityScore * 100)}%
              </div>
              <div className="text-sm text-slate-400">Data Quality Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{analysis.fieldMappings.length}</div>
              <div className="text-sm text-slate-400">Fields Mapped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{analysis.detectedFormat}</div>
              <div className="text-sm text-slate-400">Detected Format</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {analysis.recommendations.filter(r => r.priority === 'high').length}
              </div>
              <div className="text-sm text-slate-400">High Priority Items</div>
            </div>
          </div>

          {/* Yardi Detection */}
          {analysis.yardiDetection && (
            <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5 text-orange-400" />
                <span className="font-medium text-white">Yardi Export Detected</span>
                <Badge className={getConfidenceColor(analysis.yardiDetection.confidence)}>
                  {getConfidenceIcon(analysis.yardiDetection.confidence)}
                  <span className="ml-1">{analysis.yardiDetection.confidence.replace('_', ' ')}</span>
                </Badge>
              </div>
              <p className="text-sm text-orange-300">
                This appears to be a <strong>{analysis.yardiDetection.exportType.replace('_', ' ')}</strong> export
                from Yardi property management system. Optimized field mappings have been applied.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Suggested Template */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Suggested Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    {analysis.suggestedTemplate === 'properties' && <Building2 className="w-5 h-5 text-blue-400" />}
                    {analysis.suggestedTemplate === 'tenants' && <Users className="w-5 h-5 text-green-400" />}
                    {analysis.suggestedTemplate === 'financial' && <DollarSign className="w-5 h-5 text-yellow-400" />}
                    {analysis.suggestedTemplate === 'maintenance' && <Wrench className="w-5 h-5 text-orange-400" />}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold capitalize">{analysis.suggestedTemplate} Template</h4>
                    <p className="text-sm text-slate-400">Best match for your data</p>
                  </div>
                </div>
                <Button
                  onClick={() => onTemplateSelect(analysis.suggestedTemplate)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Apply Template
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Field Confidence Summary */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Mapping Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['very_high', 'high', 'medium', 'low', 'very_low'].map((confidence) => {
                  const count = analysis.fieldMappings.filter(m => m.aiConfidence === confidence).length
                  const percentage = Math.round((count / analysis.fieldMappings.length) * 100)

                  return (
                    <div key={confidence} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getConfidenceColor(confidence as AIConfidenceLevel)}>
                          {getConfidenceIcon(confidence as AIConfidenceLevel)}
                          <span className="ml-1 capitalize">{confidence.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              confidence === 'very_high' || confidence === 'high' ? 'bg-green-500' :
                              confidence === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-white w-8">{count}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedTab === 'mappings' && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">AI Field Mappings</CardTitle>
            <p className="text-slate-400 text-sm">Review and adjust the AI-generated field mappings</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.fieldMappings.map((mapping, index) => (
                <div key={index} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{mapping.sourceField}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        {editingField === mapping.sourceField ? (
                          <input
                            type="text"
                            value={mapping.targetField}
                            onChange={(e) => updateFieldMapping(mapping.sourceField, e.target.value)}
                            onBlur={() => setEditingField(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                            className="bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm"
                            autoFocus
                          />
                        ) : (
                          <button
                            onClick={() => setEditingField(mapping.sourceField)}
                            className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            {mapping.targetField}
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge className={getConfidenceColor(mapping.aiConfidence)}>
                          {getConfidenceIcon(mapping.aiConfidence)}
                          <span className="ml-1">{mapping.aiConfidence.replace('_', ' ')}</span>
                        </Badge>
                        <Badge variant="outline" className="border-slate-600 text-slate-400">
                          {mapping.dataType}
                        </Badge>
                        <span className={`${getDataQualityColor(mapping.dataQualityScore)} text-xs`}>
                          Quality: {Math.round(mapping.dataQualityScore * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {mapping.aiSuggestions.length > 0 && (
                    <div className="mt-3 p-3 bg-slate-600/50 rounded-lg">
                      <p className="text-xs text-slate-400 mb-2">AI Suggestions:</p>
                      <ul className="text-xs text-slate-300 space-y-1">
                        {mapping.aiSuggestions.slice(0, 2).map((suggestion, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Lightbulb className="w-3 h-3 text-yellow-400" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {mapping.alternativeFields.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-400 mb-1">Alternative mappings:</p>
                      <div className="flex gap-1">
                        {mapping.alternativeFields.map((alt, i) => (
                          <button
                            key={i}
                            onClick={() => updateFieldMapping(mapping.sourceField, alt)}
                            className="text-xs bg-slate-600 hover:bg-slate-500 text-slate-300 px-2 py-1 rounded transition-colors"
                          >
                            {alt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTab === 'recommendations' && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">AI Recommendations</CardTitle>
            <p className="text-slate-400 text-sm">Smart suggestions to improve your data import</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  rec.priority === 'high' ? 'bg-red-500/10 border-red-500/20' :
                  rec.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/20' :
                  'bg-blue-500/10 border-blue-500/20'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      rec.priority === 'high' ? 'bg-red-500/20' :
                      rec.priority === 'medium' ? 'bg-yellow-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      {getRecommendationIcon(rec.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white">{rec.title}</h4>
                        <Badge className={`text-xs ${
                          rec.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          rec.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {rec.priority}
                        </Badge>
                        <Badge className={getConfidenceColor(rec.confidence)}>
                          {rec.confidence.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">{rec.description}</p>
                      <p className="text-sm text-slate-300">
                        <strong>Suggested Action:</strong> {rec.suggestedAction}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {analysis.recommendations.length === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <h4 className="text-white font-medium mb-2">No Issues Found</h4>
                  <p className="text-slate-400">Your data looks great! No AI recommendations at this time.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTab === 'preview' && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Data Preview</CardTitle>
            <p className="text-slate-400 text-sm">Preview of your data with AI mappings applied</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-600">
                    {analysis.fieldMappings.slice(0, 6).map((mapping, i) => (
                      <th key={i} className="text-left p-3 text-slate-300">
                        <div className="space-y-1">
                          <div className="font-medium">{mapping.targetField}</div>
                          <div className="text-xs text-slate-400">({mapping.sourceField})</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleData.slice(0, 5).map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-slate-700">
                      {row.slice(0, 6).map((cell, cellIndex) => (
                        <td key={cellIndex} className="p-3 text-slate-300">
                          {cell || <span className="text-slate-500 italic">empty</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sampleData.length > 5 && (
              <div className="text-center mt-4 text-sm text-slate-400">
                Showing 5 of {sampleData.length} rows
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Import Action */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold mb-1">Ready to Import</h3>
              <p className="text-slate-400 text-sm">
                AI analysis complete. Click import to proceed with the optimized field mappings.
              </p>
            </div>
            <Button
              onClick={onImportStart}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Start AI Import
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
