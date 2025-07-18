"use client"

import { ReactNode } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Permission, hasPermission, hasAnyPermission, hasAllPermissions } from "../lib/permissions"

interface PermissionGuardProps {
  permission?: Permission
  permissions?: Permission[]
  requireAll?: boolean
  entityId?: string
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGuard({
  permission,
  permissions,
  requireAll = false,
  entityId,
  fallback = null,
  children
}: PermissionGuardProps) {
  const { user, currentEntity } = useAuth()

  let hasAccess = false
  const targetEntityId = entityId || currentEntity?.id

  if (permission) {
    hasAccess = hasPermission(user, permission, targetEntityId)
  } else if (permissions) {
    hasAccess = requireAll
      ? hasAllPermissions(user, permissions, targetEntityId)
      : hasAnyPermission(user, permissions, targetEntityId)
  } else {
    hasAccess = true // No permissions specified, allow access
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}

// Convenient permission check hooks for multi-tenant system
export function usePermissions() {
  const { user, currentEntity, isPlatformAdmin, currentEntityRole } = useAuth()

  return {
    // Core permission checks
    hasPermission: (permission: Permission, entityId?: string) =>
      hasPermission(user, permission, entityId || currentEntity?.id),
    hasAnyPermission: (permissions: Permission[], entityId?: string) =>
      hasAnyPermission(user, permissions, entityId || currentEntity?.id),
    hasAllPermissions: (permissions: Permission[], entityId?: string) =>
      hasAllPermissions(user, permissions, entityId || currentEntity?.id),

    // Platform-level checks
    isPlatformAdmin: () => isPlatformAdmin,
    canManagePlatform: () => hasPermission(user, 'platform.entities.create'),
    canManageGlobalUsers: () => hasPermission(user, 'platform.users.read'),

    // Entity-level business logic checks
    canManageProperties: (entityId?: string) =>
      hasPermission(user, 'entity.property.approve', entityId || currentEntity?.id),
    canProcessPayments: (entityId?: string) =>
      hasPermission(user, 'entity.financial.process', entityId || currentEntity?.id),
    canManageEntityUsers: (entityId?: string) =>
      hasPermission(user, 'entity.users.create', entityId || currentEntity?.id),
    canUseAI: (entityId?: string) =>
      hasAnyPermission(user, ['entity.ai.read', 'entity.ai.models'], entityId || currentEntity?.id),
    canApproveDocuments: (entityId?: string) =>
      hasPermission(user, 'entity.document.approve', entityId || currentEntity?.id),

    // Role checks for current entity
    isEntityAdmin: (entityId?: string) => {
      const targetEntityId = entityId || currentEntity?.id
      if (!targetEntityId || !user) return false
      const membership = user.entityMemberships.find(
        m => m.entityId === targetEntityId && m.status === 'active'
      )
      return membership?.entityRole === 'entity_admin'
    },
    isEntityManager: (entityId?: string) => {
      const targetEntityId = entityId || currentEntity?.id
      if (!targetEntityId || !user) return false
      const membership = user.entityMemberships.find(
        m => m.entityId === targetEntityId && m.status === 'active'
      )
      return membership?.entityRole === 'entity_manager'
    },
    isEntityStaff: (entityId?: string) => {
      const targetEntityId = entityId || currentEntity?.id
      if (!targetEntityId || !user) return false
      const membership = user.entityMemberships.find(
        m => m.entityId === targetEntityId && m.status === 'active'
      )
      return membership?.entityRole === 'entity_staff'
    },

    // Current context
    currentEntityRole,
    currentEntity,
    hasMultipleEntities: () => (user?.entityMemberships?.length || 0) > 1
  }
}
