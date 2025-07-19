"use client"

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Plus,
  MoreVertical,
  GripVertical,
  X,
  Edit3,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  BarChart3,
  PieChart,
  TrendingUp,
  Building2,
  DollarSign,
  Scale,
  Brain,
  Activity,
  Users,
  Clock,
  Target,
  Zap
} from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

// Widget types and configurations
interface DashboardWidget {
  id: string
  type: 'metric' | 'chart' | 'list' | 'progress' | 'custom'
  title: string
  size: 'small' | 'medium' | 'large'
  position: { x: number; y: number }
  visible: boolean
  config: {
    dataSource?: string
    chartType?: 'line' | 'bar' | 'pie' | 'doughnut'
    metric?: string
    color?: string
    icon?: React.ComponentType<any>
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
}

// Available widget templates
const widgetTemplates: Omit<DashboardWidget, 'id' | 'position'>[] = [
  {
    type: 'metric',
    title: 'Total Revenue',
    size: 'small',
    visible: true,
    config: {
      metric: 'revenue',
      color: 'green',
      icon: DollarSign
    },
    data: { value: '$2.45M', change: '+12.5%', trend: 'up' }
  },
  {
    type: 'metric',
    title: 'Properties Managed',
    size: 'small',
    visible: true,
    config: {
      metric: 'properties',
      color: 'blue',
      icon: Building2
    },
    data: { value: '24', change: 'Stable', trend: 'stable' }
  },
  {
    type: 'metric',
    title: 'Compliance Score',
    size: 'small',
    visible: true,
    config: {
      metric: 'compliance',
      color: 'indigo',
      icon: Scale
    },
    data: { value: '94.2%', change: '+2.1%', trend: 'up' }
  },
  {
    type: 'metric',
    title: 'AI Savings',
    size: 'small',
    visible: true,
    config: {
      metric: 'ai_savings',
      color: 'purple',
      icon: Brain
    },
    data: { value: '$245K', change: '+18%', trend: 'up' }
  },
  {
    type: 'chart',
    title: 'Revenue Trends',
    size: 'large',
    visible: true,
    config: {
      chartType: 'line',
      dataSource: 'revenue'
    },
    data: { chartType: 'revenue' }
  },
  {
    type: 'chart',
    title: 'Compliance Distribution',
    size: 'medium',
    visible: true,
    config: {
      chartType: 'doughnut',
      dataSource: 'compliance'
    },
    data: { chartType: 'compliance' }
  },
  {
    type: 'list',
    title: 'Recent Activity',
    size: 'medium',
    visible: true,
    config: {
      dataSource: 'activity'
    },
    data: {
      items: [
        { id: 1, title: 'NYC Compliance sync completed', time: '2 min ago', type: 'success' },
        { id: 2, title: 'AI identified cost savings', time: '15 min ago', type: 'info' },
        { id: 3, title: 'QuickBooks integration updated', time: '1 hour ago', type: 'success' }
      ]
    }
  },
  {
    type: 'progress',
    title: 'Monthly Targets',
    size: 'medium',
    visible: true,
    config: {
      dataSource: 'targets'
    },
    data: {
      targets: [
        { name: 'Revenue Goal', progress: 78, target: '$3M', current: '$2.34M' },
        { name: 'Compliance Score', progress: 94, target: '95%', current: '94.2%' },
        { name: 'Cost Reduction', progress: 65, target: '$500K', current: '$325K' }
      ]
    }
  }
]

interface CustomizableDashboardProps {
  onClose?: () => void
}

export function CustomizableDashboard({ onClose }: CustomizableDashboardProps) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(
    widgetTemplates.map((template, index) => ({
      ...template,
      id: `widget_${index + 1}`,
      position: { x: (index % 3) * 400, y: Math.floor(index / 3) * 300 }
    }))
  )
  const [isEditMode, setIsEditMode] = useState(false)
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false)
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)

  const handleAddWidget = (template: Omit<DashboardWidget, 'id' | 'position'>) => {
    const newWidget: DashboardWidget = {
      ...template,
      id: `widget_${Date.now()}`,
      position: { x: 0, y: 0 }
    }
    setWidgets(prev => [...prev, newWidget])
    setShowWidgetLibrary(false)
  }

  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(w => w.id !== widgetId))
  }

  const handleToggleWidgetVisibility = (widgetId: string) => {
    setWidgets(prev => prev.map(w =>
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    ))
  }

  const handleDuplicateWidget = (widgetId: string) => {
    const widget = widgets.find(w => w.id === widgetId)
    if (widget) {
      const duplicatedWidget: DashboardWidget = {
        ...widget,
        id: `widget_${Date.now()}`,
        title: `${widget.title} (Copy)`,
        position: { x: widget.position.x + 20, y: widget.position.y + 20 }
      }
      setWidgets(prev => [...prev, duplicatedWidget])
    }
  }

  const renderWidget = (widget: DashboardWidget) => {
    if (!widget.visible && !isEditMode) return null

    const sizeClasses = {
      small: 'w-80 h-40',
      medium: 'w-80 h-60',
      large: 'w-96 h-80'
    }

    const colorClasses = {
      green: 'text-green-400 bg-green-500/10',
      blue: 'text-blue-400 bg-blue-500/10',
      indigo: 'text-indigo-400 bg-indigo-500/10',
      purple: 'text-purple-400 bg-purple-500/10',
      orange: 'text-orange-400 bg-orange-500/10',
      red: 'text-red-400 bg-red-500/10'
    }

    return (
      <motion.div
        key={widget.id}
        className={`absolute ${sizeClasses[widget.size]} ${!widget.visible ? 'opacity-50' : ''}`}
        style={{
          left: widget.position.x,
          top: widget.position.y
        }}
        drag={isEditMode}
        dragMomentum={false}
        onDragStart={() => setDraggedWidget(widget.id)}
        onDragEnd={(_, info) => {
          setWidgets(prev => prev.map(w =>
            w.id === widget.id
              ? { ...w, position: { x: w.position.x + info.offset.x, y: w.position.y + info.offset.y } }
              : w
          ))
          setDraggedWidget(null)
        }}
        whileDrag={{ scale: 1.05, zIndex: 1000 }}
      >
        <Card className={`bg-slate-800/50 border-slate-700 h-full ${isEditMode ? 'border-orange-500/50' : ''}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                {isEditMode && <GripVertical className="w-4 h-4 text-slate-400 cursor-move" />}
                {widget.config.icon && <widget.config.icon className="w-4 h-4" />}
                {widget.title}
              </CardTitle>
              {isEditMode && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleWidgetVisibility(widget.id)}
                    className="w-6 h-6 text-slate-400 hover:text-white"
                  >
                    {widget.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  </Button>
                  <div className="relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 text-slate-400 hover:text-white"
                    >
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                    <div className="absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="p-1 min-w-32">
                        <button
                          onClick={() => handleDuplicateWidget(widget.id)}
                          className="w-full flex items-center gap-2 px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-700 rounded"
                        >
                          <Copy className="w-3 h-3" />
                          Duplicate
                        </button>
                        <button
                          onClick={() => handleRemoveWidget(widget.id)}
                          className="w-full flex items-center gap-2 px-2 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-slate-700 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {renderWidgetContent(widget)}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const renderWidgetContent = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'metric':
        const colorClass = widget.config.color ? colorClasses[widget.config.color as keyof typeof colorClasses] : 'text-slate-400 bg-slate-500/10'
        return (
          <div className="space-y-3">
            <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center`}>
              {widget.config.icon && <widget.config.icon className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{widget.data?.value}</p>
              <div className="flex items-center gap-2 mt-1">
                <TrendingUp className={`w-3 h-3 ${widget.data?.trend === 'up' ? 'text-green-400' : widget.data?.trend === 'down' ? 'text-red-400 rotate-180' : 'text-slate-400'}`} />
                <span className="text-xs text-slate-400">{widget.data?.change}</span>
              </div>
            </div>
          </div>
        )

      case 'chart':
        return (
          <div className="h-full flex items-center justify-center bg-slate-700/30 rounded-lg">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-400">Chart: {widget.config.chartType}</p>
            </div>
          </div>
        )

      case 'list':
        return (
          <div className="space-y-2">
            {widget.data?.items?.slice(0, 3).map((item: any) => (
              <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-700/30 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  item.type === 'success' ? 'bg-green-400' :
                  item.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        )

      case 'progress':
        return (
          <div className="space-y-3">
            {widget.data?.targets?.slice(0, 2).map((target: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">{target.name}</span>
                  <span className="text-slate-400">{target.current} / {target.target}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${target.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="h-full flex items-center justify-center text-slate-400">
            <p>Custom widget content</p>
          </div>
        )
    }
  }

  const colorClasses = {
    green: 'text-green-400 bg-green-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    indigo: 'text-indigo-400 bg-indigo-500/10',
    purple: 'text-purple-400 bg-purple-500/10',
    orange: 'text-orange-400 bg-orange-500/10',
    red: 'text-red-400 bg-red-500/10'
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-white">Customizable Dashboard</h1>
        <div className="flex items-center gap-3">
          <Badge className={isEditMode ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}>
            {isEditMode ? 'Edit Mode' : 'View Mode'}
          </Badge>
          <Button
            onClick={() => setIsEditMode(!isEditMode)}
            variant={isEditMode ? "default" : "outline"}
            className={isEditMode ? "bg-orange-500 hover:bg-orange-600 text-white" : "border-slate-600 text-slate-400"}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditMode ? 'Exit Edit' : 'Edit Layout'}
          </Button>
          {isEditMode && (
            <Button
              onClick={() => setShowWidgetLibrary(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Widget
            </Button>
          )}
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Dashboard Canvas */}
      <div className="relative p-6 h-full overflow-auto">
        <div className="min-h-full min-w-full relative">
          {widgets.map(renderWidget)}
        </div>
      </div>

      {/* Widget Library Modal */}
      {showWidgetLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-white">Widget Library</h2>
              <Button
                onClick={() => setShowWidgetLibrary(false)}
                variant="ghost"
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {widgetTemplates.map((template, index) => (
                  <div key={index} className="border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      {template.config.icon && <template.config.icon className="w-5 h-5 text-slate-400" />}
                      <h3 className="font-medium text-white">{template.title}</h3>
                    </div>
                    <p className="text-sm text-slate-400 mb-4">
                      {template.type === 'metric' && 'Display key performance metrics'}
                      {template.type === 'chart' && 'Visualize data with interactive charts'}
                      {template.type === 'list' && 'Show recent activity and updates'}
                      {template.type === 'progress' && 'Track progress towards goals'}
                    </p>
                    <Button
                      onClick={() => handleAddWidget(template)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Widget
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
