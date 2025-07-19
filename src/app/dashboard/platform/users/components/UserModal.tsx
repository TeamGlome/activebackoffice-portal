"use client"

import { useState, useEffect } from "react"
import { Button } from "../../../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card"
import { Badge } from "../../../../../components/ui/badge"
import { X, Save, Loader2, Eye, EyeOff } from "lucide-react"

interface UserData {
  id?: string
  name: string
  email: string
  role: string
  platformRole: string
  entityId: string
  entityName?: string
  isActive: boolean
  password?: string
}

interface Entity {
  id: string
  name: string
}

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (user: UserData) => void
  user?: UserData | null
  entities: Entity[]
  mode: 'create' | 'edit'
}

export default function UserModal({ isOpen, onClose, onSave, user, entities, mode }: UserModalProps) {
  const [formData, setFormData] = useState<UserData>({
    name: '',
    email: '',
    role: 'user',
    platformRole: 'user',
    entityId: '',
    isActive: true
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        ...user,
        password: '' // Don't show existing password
      })
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'user',
        platformRole: 'user',
        entityId: entities[0]?.id || '',
        isActive: true,
        password: ''
      })
    }
    setErrors({})
  }, [user, mode, isOpen, entities])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.email.includes('@')) newErrors.email = 'Valid email is required'
    if (!formData.entityId) newErrors.entityId = 'Entity is required'

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Password is required for new users'
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

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
      console.error('Error saving user:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">
              {mode === 'create' ? 'Create New User' : 'Edit User'}
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
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400"
                placeholder="e.g., John Doe"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400"
                placeholder="e.g., john@company.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password {mode === 'create' ? '*' : '(leave blank to keep current)'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password || ''}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 pr-10"
                  placeholder={mode === 'create' ? 'Enter password' : 'Enter new password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Entity *
              </label>
              <select
                value={formData.entityId}
                onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
              >
                <option value="">Select Entity</option>
                {entities.map(entity => (
                  <option key={entity.id} value={entity.id}>{entity.name}</option>
                ))}
              </select>
              {errors.entityId && <p className="text-red-400 text-sm mt-1">{errors.entityId}</p>}
            </div>
          </div>

          {/* Roles & Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Roles & Permissions</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Platform Role
                </label>
                <select
                  value={formData.platformRole}
                  onChange={(e) => setFormData({ ...formData, platformRole: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Status</h3>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-orange-500 bg-slate-700 border-slate-600 rounded focus:ring-orange-500"
              />
              <label htmlFor="isActive" className="text-sm text-slate-300">
                User is active and can log in
              </label>
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
                  {mode === 'create' ? 'Create User' : 'Save Changes'}
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
