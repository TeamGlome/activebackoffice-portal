"use client"

import { useState, useEffect } from "react"
import { Button } from "../../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Badge } from "../../../../../components/ui/badge"
import { X, Save, Loader2 } from "lucide-react"

interface EntityData {
  id?: string
  name: string
  type: string
  category: string
  status: string
  subscription_plan: string
  settings: {
    timezone: string
    currency: string
    fiscal_year_start: string
  }
  billing: {
    monthly_amount: number
  }
}

interface EntityModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (entity: EntityData) => void
  entity?: EntityData | null
  mode: 'create' | 'edit'
}

export default function EntityModal({ isOpen, onClose, onSave, entity, mode }: EntityModalProps) {
  const [formData, setFormData] = useState<EntityData>({
    name: '',
    type: '',
    category: '',
    status: 'trial',
    subscription_plan: 'starter',
    settings: {
      timezone: 'America/New_York',
      currency: 'USD',
      fiscal_year_start: '01-01'
    },
    billing: {
      monthly_amount: 8500
    }
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [categories, setCategories] = useState<Record<string, string[]>>({})
  const [loadingCategories, setLoadingCategories] = useState(false)

  // Entity types
  const entityTypes = [
    'Real Estate',
    'Property Management',
    'Construction',
    'Facilities Management',
    'Other'
  ]

  useEffect(() => {
    if (entity && mode === 'edit') {
      setFormData(entity)
    } else {
      setFormData({
        name: '',
        type: '',
        category: '',
        status: 'trial',
        subscription_plan: 'starter',
        settings: {
          timezone: 'America/New_York',
          currency: 'USD',
          fiscal_year_start: '01-01'
        },
        billing: {
          monthly_amount: 8500
        }
      })
    }
    setErrors({})
  }, [entity, mode, isOpen])

  // Load categories when component mounts
  useEffect(() => {
    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  // Reset category when type changes
  useEffect(() => {
    if (formData.type) {
      setFormData(prev => ({ ...prev, category: '' }))
    }
  }, [formData.type])

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await fetch('/api/platform/categories')
      const data = await response.json()

      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.type.trim()) newErrors.type = 'Type is required'
    if (!formData.category.trim()) newErrors.category = 'Category is required'
    if (formData.billing.monthly_amount < 0) newErrors.monthly_amount = 'Amount must be positive'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving entity:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const availableCategories = formData.type ? (categories[formData.type] || []) : []

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">
              {mode === 'create' ? 'Create New Entity' : 'Edit Entity'}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="border-slate-600 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Entity Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400"
                placeholder="e.g., Manhattan Properties LLC"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Entity Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="">Select Type</option>
                  {entityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={!formData.type || loadingCategories}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white disabled:opacity-50"
                >
                  <option value="">
                    {!formData.type ? 'Select type first' :
                     loadingCategories ? 'Loading...' :
                     'Select Category'}
                  </option>
                  {availableCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="trial">Trial</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Subscription Plan
                </label>
                <select
                  value={formData.subscription_plan}
                  onChange={(e) => setFormData({ ...formData, subscription_plan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="starter">Starter</option>
                  <option value="professional">Professional</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Settings</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Timezone
                </label>
                <select
                  value={formData.settings.timezone}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, timezone: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Currency
                </label>
                <select
                  value={formData.settings.currency}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, currency: e.target.value }
                  })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="USD">USD</option>
                  <option value="CAD">CAD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Fiscal Year Start
              </label>
              <input
                type="text"
                value={formData.settings.fiscal_year_start}
                onChange={(e) => setFormData({
                  ...formData,
                  settings: { ...formData.settings, fiscal_year_start: e.target.value }
                })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                placeholder="MM-DD (e.g., 01-01)"
              />
            </div>
          </div>

          {/* Billing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Billing</h3>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Monthly Amount (cents)
              </label>
              <input
                type="number"
                value={formData.billing.monthly_amount}
                onChange={(e) => setFormData({
                  ...formData,
                  billing: { ...formData.billing, monthly_amount: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                placeholder="8500"
              />
              {errors.monthly_amount && <p className="text-red-400 text-sm mt-1">{errors.monthly_amount}</p>}
              <p className="text-slate-400 text-sm mt-1">
                ${(formData.billing.monthly_amount / 100).toLocaleString()} per month
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Create Entity' : 'Save Changes'}
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-slate-600 text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
