"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import {
  ChevronDown,
  Building2,
  Check,
  Crown,
  Shield,
  Users,
  User
} from "lucide-react"

export function EntitySwitcher() {
  const { user, currentEntity, availableEntities, switchEntity, isPlatformAdmin } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user || availableEntities.length <= 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-lg border border-slate-700">
        <Building2 className="w-4 h-4 text-slate-400" />
        <div className="text-sm">
          <p className="text-white font-medium">{currentEntity?.name || 'No Entity'}</p>
          <p className="text-slate-400 text-xs">{getSubscriptionLabel(currentEntity?.subscription)}</p>
        </div>
      </div>
    )
  }

  const handleEntitySwitch = async (entityId: string) => {
    await switchEntity(entityId)
    setIsOpen(false)
  }

  function getSubscriptionLabel(subscription?: string) {
    switch (subscription) {
      case 'enterprise': return 'Enterprise'
      case 'professional': return 'Professional'
      case 'basic': return 'Basic'
      case 'trial': return 'Trial'
      default: return 'Unknown'
    }
  }

  function getSubscriptionColor(subscription?: string) {
    switch (subscription) {
      case 'enterprise': return 'text-purple-400'
      case 'professional': return 'text-blue-400'
      case 'basic': return 'text-green-400'
      case 'trial': return 'text-yellow-400'
      default: return 'text-slate-400'
    }
  }

  function getRoleIcon(entityId: string) {
    if (!user) return <User className="w-3 h-3" />

    const membership = user.entityMemberships.find(m => m.entityId === entityId)
    switch (membership?.entityRole) {
      case 'entity_admin': return <Crown className="w-3 h-3 text-yellow-400" />
      case 'entity_manager': return <Shield className="w-3 h-3 text-blue-400" />
      case 'entity_staff': return <Users className="w-3 h-3 text-green-400" />
      case 'entity_tenant': return <User className="w-3 h-3 text-slate-400" />
      default: return <User className="w-3 h-3" />
    }
  }

  function getRoleLabel(entityId: string) {
    if (!user) return 'Unknown'

    const membership = user.entityMemberships.find(m => m.entityId === entityId)
    switch (membership?.entityRole) {
      case 'entity_admin': return 'Admin'
      case 'entity_manager': return 'Manager'
      case 'entity_staff': return 'Staff'
      case 'entity_tenant': return 'Tenant'
      default: return 'Unknown'
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1 h-auto bg-slate-800/50 hover:bg-slate-800/70 rounded-lg border border-slate-700"
      >
        <Building2 className="w-4 h-4 text-slate-400" />
        <div className="text-left">
          <div className="flex items-center gap-2">
            <p className="text-white font-medium text-sm">{currentEntity?.name}</p>
            {isPlatformAdmin && (
              <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
                Platform
              </Badge>
            )}
          </div>
          <p className={`text-xs ${getSubscriptionColor(currentEntity?.subscription)}`}>
            {getSubscriptionLabel(currentEntity?.subscription)} • {getRoleLabel(currentEntity?.id || '')}
          </p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
            <div className="p-3 border-b border-slate-700">
              <h3 className="text-sm font-medium text-white mb-1">Switch Entity</h3>
              <p className="text-xs text-slate-400">Select a property management company</p>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {availableEntities.map((entity) => {
                const isCurrentEntity = entity.id === currentEntity?.id

                return (
                  <button
                    key={entity.id}
                    onClick={() => handleEntitySwitch(entity.id)}
                    className={`w-full p-3 text-left hover:bg-slate-700/50 transition-colors ${
                      isCurrentEntity ? 'bg-slate-700/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium text-sm">{entity.name}</p>
                            {isCurrentEntity && (
                              <Check className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs ${getSubscriptionColor(entity.subscription)}`}>
                              {getSubscriptionLabel(entity.subscription)}
                            </span>
                            <span className="text-slate-500">•</span>
                            <div className="flex items-center gap-1">
                              {getRoleIcon(entity.id)}
                              <span className="text-xs text-slate-400">
                                {getRoleLabel(entity.id)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {isPlatformAdmin && (
              <div className="p-3 border-t border-slate-700">
                <div className="flex items-center gap-2 text-xs text-purple-400">
                  <Crown className="w-3 h-3" />
                  <span>Platform Admin Access</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
