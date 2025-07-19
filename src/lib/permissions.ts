// Multi-Tenant SaaS Permission System
export type PlatformRole = 'platform_superadmin' | 'platform_manager' | 'platform_staff' | 'platform_support' | 'platform_developer'

export type EntityRole = 'entity_admin' | 'entity_manager' | 'entity_staff' | 'entity_tenant'

export type Permission =
  // Platform-level permissions (Active Back Office company operations)
  // Entity Management
  | 'platform.entities.create' | 'platform.entities.read' | 'platform.entities.update' | 'platform.entities.delete'
  | 'platform.entities.suspend' | 'platform.entities.activate' | 'platform.entities.configure'

  // User & Access Management
  | 'platform.users.create' | 'platform.users.read' | 'platform.users.update' | 'platform.users.delete'
  | 'platform.users.impersonate' | 'platform.users.suspend' | 'platform.users.roles.manage'

  // Billing & Subscriptions
  | 'platform.billing.read' | 'platform.billing.manage' | 'platform.billing.process'
  | 'platform.subscriptions.create' | 'platform.subscriptions.update' | 'platform.subscriptions.cancel'
  | 'platform.payments.read' | 'platform.payments.process' | 'platform.payments.refund'

  // Analytics & Reporting
  | 'platform.analytics.global' | 'platform.analytics.entity' | 'platform.analytics.financial'
  | 'platform.reports.generate' | 'platform.reports.export' | 'platform.metrics.view'

  // System Administration
  | 'platform.system.configure' | 'platform.system.monitor' | 'platform.system.backup'
  | 'platform.logs.read' | 'platform.logs.export' | 'platform.security.manage'

  // API & Integrations
  | 'platform.api.read' | 'platform.api.create' | 'platform.api.update' | 'platform.api.delete'
  | 'platform.api.keys.generate' | 'platform.api.keys.revoke' | 'platform.api.monitor'
  | 'platform.integrations.configure' | 'platform.integrations.manage' | 'platform.webhooks.manage'

  // Development & Technical
  | 'platform.development.access' | 'platform.development.deploy' | 'platform.development.debug'
  | 'platform.database.read' | 'platform.database.write' | 'platform.database.admin'

  // Support & Operations
  | 'platform.support.access' | 'platform.support.tickets' | 'platform.support.escalate'
  | 'platform.operations.monitor' | 'platform.operations.alerts' | 'platform.operations.respond'

  // Entity-level Property Management
  | 'entity.property.create' | 'entity.property.read' | 'entity.property.update' | 'entity.property.delete'
  | 'entity.property.approve' | 'entity.property.financial'

  // Entity-level Tenant Management
  | 'entity.tenant.create' | 'entity.tenant.read' | 'entity.tenant.update' | 'entity.tenant.delete'
  | 'entity.tenant.communicate' | 'entity.tenant.payments'

  // Entity-level Maintenance
  | 'entity.maintenance.create' | 'entity.maintenance.read' | 'entity.maintenance.update' | 'entity.maintenance.delete'
  | 'entity.maintenance.assign' | 'entity.maintenance.approve'

  // Entity-level Financial
  | 'entity.financial.read' | 'entity.financial.process' | 'entity.financial.approve' | 'entity.financial.reports'

  // Entity-level Documents
  | 'entity.document.upload' | 'entity.document.read' | 'entity.document.approve' | 'entity.document.sign'

  // Entity-level AI Analytics
  | 'entity.ai.read' | 'entity.ai.models' | 'entity.ai.export' | 'entity.ai.configure'

  // Entity-level System Management
  | 'entity.users.create' | 'entity.users.read' | 'entity.users.update' | 'entity.users.delete'
  | 'entity.settings.read' | 'entity.settings.update' | 'entity.integrations.manage'

  // Entity-level Integration Management (NEW)
  | 'entity.integrations.quickbooks.connect' | 'entity.integrations.quickbooks.read' | 'entity.integrations.quickbooks.sync'
  | 'entity.integrations.plaid.connect' | 'entity.integrations.plaid.read' | 'entity.integrations.plaid.transactions'
  | 'entity.integrations.storage.connect' | 'entity.integrations.storage.import' | 'entity.integrations.storage.export'
  | 'entity.integrations.sheets.connect' | 'entity.integrations.sheets.read' | 'entity.integrations.sheets.write'
  | 'entity.integrations.excel.connect' | 'entity.integrations.excel.read' | 'entity.integrations.excel.write'
  | 'entity.integrations.skyvia.configure' | 'entity.integrations.skyvia.run'
  | 'entity.integrations.pipedream.configure' | 'entity.integrations.pipedream.run'
  | 'entity.integrations.fiix.connect' | 'entity.integrations.fiix.sync' | 'entity.integrations.fiix.workorders'
  | 'entity.integrations.watchguard.connect' | 'entity.integrations.watchguard.monitor' | 'entity.integrations.watchguard.alerts'
  | 'entity.integrations.webhook.create' | 'entity.integrations.webhook.read' | 'entity.integrations.webhook.update' | 'entity.integrations.webhook.delete'

// Platform-level role permissions (Active Back Office company roles)
export const PLATFORM_PERMISSIONS: Record<PlatformRole, Permission[]> = {
  platform_superadmin: [
    // Full platform control - CEO/CTO level access
    'platform.entities.create', 'platform.entities.read', 'platform.entities.update', 'platform.entities.delete',
    'platform.entities.suspend', 'platform.entities.activate', 'platform.entities.configure',
    'platform.users.create', 'platform.users.read', 'platform.users.update', 'platform.users.delete',
    'platform.users.impersonate', 'platform.users.suspend', 'platform.users.roles.manage',
    'platform.billing.read', 'platform.billing.manage', 'platform.billing.process',
    'platform.subscriptions.create', 'platform.subscriptions.update', 'platform.subscriptions.cancel',
    'platform.payments.read', 'platform.payments.process', 'platform.payments.refund',
    'platform.analytics.global', 'platform.analytics.entity', 'platform.analytics.financial',
    'platform.reports.generate', 'platform.reports.export', 'platform.metrics.view',
    'platform.system.configure', 'platform.system.monitor', 'platform.system.backup',
    'platform.logs.read', 'platform.logs.export', 'platform.security.manage',
    'platform.api.read', 'platform.api.create', 'platform.api.update', 'platform.api.delete',
    'platform.api.keys.generate', 'platform.api.keys.revoke', 'platform.api.monitor',
    'platform.integrations.configure', 'platform.integrations.manage', 'platform.webhooks.manage',
    'platform.development.access', 'platform.development.deploy', 'platform.development.debug',
    'platform.database.read', 'platform.database.write', 'platform.database.admin',
    'platform.support.access', 'platform.support.tickets', 'platform.support.escalate',
    'platform.operations.monitor', 'platform.operations.alerts', 'platform.operations.respond'
  ],
  platform_manager: [
    // Operations management - VP/Director level access
    'platform.entities.read', 'platform.entities.update', 'platform.entities.configure',
    'platform.entities.suspend', 'platform.entities.activate',
    'platform.users.read', 'platform.users.update', 'platform.users.suspend',
    'platform.billing.read', 'platform.billing.manage',
    'platform.subscriptions.update', 'platform.subscriptions.cancel',
    'platform.payments.read', 'platform.payments.process',
    'platform.analytics.global', 'platform.analytics.entity', 'platform.analytics.financial',
    'platform.reports.generate', 'platform.reports.export', 'platform.metrics.view',
    'platform.system.monitor', 'platform.logs.read',
    'platform.api.read', 'platform.api.monitor',
    'platform.integrations.manage',
    'platform.support.access', 'platform.support.tickets', 'platform.support.escalate',
    'platform.operations.monitor', 'platform.operations.alerts', 'platform.operations.respond'
  ],
  platform_staff: [
    // Daily operations - Manager/Lead level access
    'platform.entities.read', 'platform.entities.update',
    'platform.users.read', 'platform.users.update',
    'platform.billing.read',
    'platform.payments.read',
    'platform.analytics.global', 'platform.analytics.entity',
    'platform.reports.generate', 'platform.metrics.view',
    'platform.system.monitor', 'platform.logs.read',
    'platform.api.read', 'platform.api.monitor',
    'platform.support.access', 'platform.support.tickets',
    'platform.operations.monitor', 'platform.operations.alerts'
  ],
  platform_support: [
    // Customer support - Support team access
    'platform.entities.read',
    'platform.users.read', 'platform.users.update',
    'platform.billing.read',
    'platform.analytics.entity',
    'platform.reports.generate',
    'platform.logs.read',
    'platform.support.access', 'platform.support.tickets'
  ],
  platform_developer: [
    // Technical development - Developer/Engineer access
    'platform.entities.read',
    'platform.users.read',
    'platform.analytics.global', 'platform.analytics.entity',
    'platform.system.monitor', 'platform.system.backup',
    'platform.logs.read', 'platform.logs.export',
    'platform.api.read', 'platform.api.create', 'platform.api.update', 'platform.api.delete',
    'platform.api.keys.generate', 'platform.api.keys.revoke', 'platform.api.monitor',
    'platform.integrations.configure', 'platform.integrations.manage', 'platform.webhooks.manage',
    'platform.development.access', 'platform.development.deploy', 'platform.development.debug',
    'platform.database.read', 'platform.database.write'
  ]
}

// Entity-level role permissions (for each property management company)
export const ENTITY_PERMISSIONS: Record<EntityRole, Permission[]> = {
  entity_admin: [
    // Full control within their entity
    'entity.property.create', 'entity.property.read', 'entity.property.update', 'entity.property.delete',
    'entity.property.approve', 'entity.property.financial',
    'entity.tenant.create', 'entity.tenant.read', 'entity.tenant.update', 'entity.tenant.delete',
    'entity.tenant.communicate', 'entity.tenant.payments',
    'entity.maintenance.create', 'entity.maintenance.read', 'entity.maintenance.update', 'entity.maintenance.delete',
    'entity.maintenance.assign', 'entity.maintenance.approve',
    'entity.financial.read', 'entity.financial.process', 'entity.financial.approve', 'entity.financial.reports',
    'entity.document.upload', 'entity.document.read', 'entity.document.approve', 'entity.document.sign',
    'entity.ai.read', 'entity.ai.models', 'entity.ai.export', 'entity.ai.configure',
    'entity.users.create', 'entity.users.read', 'entity.users.update', 'entity.users.delete',
    'entity.settings.read', 'entity.settings.update', 'entity.integrations.manage',
    // Integration-related permissions
    'entity.integrations.quickbooks.connect', 'entity.integrations.quickbooks.read', 'entity.integrations.quickbooks.sync',
    'entity.integrations.plaid.connect', 'entity.integrations.plaid.read', 'entity.integrations.plaid.transactions',
    'entity.integrations.storage.connect', 'entity.integrations.storage.import', 'entity.integrations.storage.export',
    'entity.integrations.sheets.connect', 'entity.integrations.sheets.read', 'entity.integrations.sheets.write',
    'entity.integrations.excel.connect', 'entity.integrations.excel.read', 'entity.integrations.excel.write',
    'entity.integrations.skyvia.configure', 'entity.integrations.skyvia.run',
    'entity.integrations.pipedream.configure', 'entity.integrations.pipedream.run',
    'entity.integrations.fiix.connect', 'entity.integrations.fiix.sync', 'entity.integrations.fiix.workorders',
    'entity.integrations.watchguard.connect', 'entity.integrations.watchguard.monitor', 'entity.integrations.watchguard.alerts',
    'entity.integrations.webhook.create', 'entity.integrations.webhook.read', 'entity.integrations.webhook.update', 'entity.integrations.webhook.delete'
  ],
  entity_manager: [
    // Management oversight within entity
    'entity.property.read', 'entity.property.update', 'entity.property.approve', 'entity.property.financial',
    'entity.tenant.read', 'entity.tenant.update', 'entity.tenant.communicate', 'entity.tenant.payments',
    'entity.maintenance.read', 'entity.maintenance.update', 'entity.maintenance.assign', 'entity.maintenance.approve',
    'entity.financial.read', 'entity.financial.reports',
    'entity.document.upload', 'entity.document.read', 'entity.document.approve',
    'entity.ai.read', 'entity.ai.export',
    'entity.users.read', 'entity.settings.read',
    // Integration-related permissions (read/sync/monitor only)
    'entity.integrations.quickbooks.read', 'entity.integrations.quickbooks.sync',
    'entity.integrations.plaid.read', 'entity.integrations.plaid.transactions',
    'entity.integrations.storage.import', 'entity.integrations.storage.export',
    'entity.integrations.sheets.read',
    'entity.integrations.excel.read',
    'entity.integrations.skyvia.run',
    'entity.integrations.pipedream.run',
    'entity.integrations.fiix.sync', 'entity.integrations.fiix.workorders',
    'entity.integrations.watchguard.monitor', 'entity.integrations.watchguard.alerts',
    'entity.integrations.webhook.read'
  ],
  entity_staff: [
    // Daily operations within entity
    'entity.property.read', 'entity.property.update',
    'entity.tenant.read', 'entity.tenant.communicate',
    'entity.maintenance.create', 'entity.maintenance.read', 'entity.maintenance.update',
    'entity.financial.read',
    'entity.document.upload', 'entity.document.read',
    'entity.ai.read',
    // Integration-related permissions (read only)
    'entity.integrations.quickbooks.read',
    'entity.integrations.plaid.read',
    'entity.integrations.storage.import',
    'entity.integrations.sheets.read',
    'entity.integrations.excel.read',
    'entity.integrations.skyvia.run',
    'entity.integrations.pipedream.run',
    'entity.integrations.fiix.workorders',
    'entity.integrations.watchguard.monitor',
    'entity.integrations.webhook.read'
  ],
  entity_tenant: [
    // Limited tenant access within entity
    'entity.tenant.read', 'entity.tenant.communicate',
    'entity.maintenance.create', 'entity.maintenance.read',
    'entity.document.read'
    // No integration permissions for tenants
  ]
}

export interface Entity {
  id: string
  name: string
  slug: string
  subscription: 'trial' | 'basic' | 'professional' | 'enterprise'
  status: 'active' | 'suspended' | 'inactive'
  createdAt: string
  settings: {
    timezone: string
    currency: string
    features: string[]
  }
}

export interface MultiTenantUser {
  id: string
  email: string
  name: string
  avatar?: string
  platformRole?: PlatformRole // For super admins, platform support
  entityMemberships: {
    entityId: string
    entityRole: EntityRole
    status: 'active' | 'pending' | 'suspended'
    joinedAt: string
  }[]
  currentEntityId?: string // Which entity they're currently viewing
}

export function hasPermission(
  user: MultiTenantUser | null,
  permission: Permission,
  entityId?: string
): boolean {
  if (!user) return false

  // Check platform-level permissions
  if (permission.startsWith('platform.') && user.platformRole) {
    return PLATFORM_PERMISSIONS[user.platformRole]?.includes(permission) || false
  }

  // Check entity-level permissions
  if (permission.startsWith('entity.')) {
    const targetEntityId = entityId || user.currentEntityId
    if (!targetEntityId) return false

    const membership = user.entityMemberships.find(
      m => m.entityId === targetEntityId && m.status === 'active'
    )

    if (!membership) return false

    return ENTITY_PERMISSIONS[membership.entityRole]?.includes(permission) || false
  }

  return false
}

export function hasAnyPermission(
  user: MultiTenantUser | null,
  permissions: Permission[],
  entityId?: string
): boolean {
  return permissions.some(permission => hasPermission(user, permission, entityId))
}

export function hasAllPermissions(
  user: MultiTenantUser | null,
  permissions: Permission[],
  entityId?: string
): boolean {
  return permissions.every(permission => hasPermission(user, permission, entityId))
}

export function getUserEntities(user: MultiTenantUser | null): Entity['id'][] {
  if (!user) return []
  return user.entityMemberships
    .filter(m => m.status === 'active')
    .map(m => m.entityId)
}

export function getCurrentEntityRole(user: MultiTenantUser | null, entityId?: string): EntityRole | null {
  if (!user) return null

  const targetEntityId = entityId || user.currentEntityId
  if (!targetEntityId) return null

  const membership = user.entityMemberships.find(
    m => m.entityId === targetEntityId && m.status === 'active'
  )

  return membership?.entityRole || null
}

export function isPlatformAdmin(user: MultiTenantUser | null): boolean {
  return user?.platformRole === 'platform_superadmin'
}

export function hasPlatformRole(user: MultiTenantUser | null, role: PlatformRole): boolean {
  return user?.platformRole === role
}

export function isPlatformStaff(user: MultiTenantUser | null): boolean {
  return user?.platformRole !== undefined // Any platform role = Active Back Office staff
}

export function isEntityAdmin(user: MultiTenantUser | null, entityId?: string): boolean {
  const role = getCurrentEntityRole(user, entityId)
  return role === 'entity_admin'
}

// Permission groups for easier UI checks
export const PERMISSION_GROUPS = {
  // Platform-level groups
  PLATFORM_MANAGEMENT: ['platform.entities.create', 'platform.entities.read', 'platform.entities.update'] as Permission[],
  PLATFORM_ADMIN: ['platform.users.manage', 'platform.billing.manage', 'platform.analytics.global'] as Permission[],

  // Entity-level groups
  ENTITY_PROPERTY_MANAGEMENT: ['entity.property.create', 'entity.property.read', 'entity.property.update'] as Permission[],
  ENTITY_PROPERTY_ADMIN: ['entity.property.approve', 'entity.property.financial'] as Permission[],
  ENTITY_TENANT_MANAGEMENT: ['entity.tenant.create', 'entity.tenant.read', 'entity.tenant.update'] as Permission[],
  ENTITY_MAINTENANCE_BASIC: ['entity.maintenance.create', 'entity.maintenance.read', 'entity.maintenance.update'] as Permission[],
  ENTITY_MAINTENANCE_ADMIN: ['entity.maintenance.assign', 'entity.maintenance.approve'] as Permission[],
  ENTITY_FINANCIAL_READ: ['entity.financial.read'] as Permission[],
  ENTITY_FINANCIAL_ADMIN: ['entity.financial.process', 'entity.financial.approve', 'entity.financial.reports'] as Permission[],
  ENTITY_AI_ANALYTICS: ['entity.ai.read', 'entity.ai.models', 'entity.ai.export'] as Permission[],
  ENTITY_USER_ADMIN: ['entity.users.create', 'entity.users.read', 'entity.users.update', 'entity.users.delete'] as Permission[],
  // Integration-related groups
  ENTITY_INTEGRATIONS_QUICKBOOKS: [
    'entity.integrations.quickbooks.connect',
    'entity.integrations.quickbooks.read',
    'entity.integrations.quickbooks.sync'
  ] as Permission[],
  ENTITY_INTEGRATIONS_PLAID: [
    'entity.integrations.plaid.connect',
    'entity.integrations.plaid.read',
    'entity.integrations.plaid.transactions'
  ] as Permission[],
  ENTITY_INTEGRATIONS_STORAGE: [
    'entity.integrations.storage.connect',
    'entity.integrations.storage.import',
    'entity.integrations.storage.export'
  ] as Permission[],
  ENTITY_INTEGRATIONS_SHEETS: [
    'entity.integrations.sheets.connect',
    'entity.integrations.sheets.read',
    'entity.integrations.sheets.write'
  ] as Permission[],
  ENTITY_INTEGRATIONS_EXCEL: [
    'entity.integrations.excel.connect',
    'entity.integrations.excel.read',
    'entity.integrations.excel.write'
  ] as Permission[],
  ENTITY_INTEGRATIONS_SKYVIA: [
    'entity.integrations.skyvia.configure',
    'entity.integrations.skyvia.run'
  ] as Permission[],
  ENTITY_INTEGRATIONS_PIPEDREAM: [
    'entity.integrations.pipedream.configure',
    'entity.integrations.pipedream.run'
  ] as Permission[],
  ENTITY_INTEGRATIONS_FIIX: [
    'entity.integrations.fiix.connect',
    'entity.integrations.fiix.sync',
    'entity.integrations.fiix.workorders'
  ] as Permission[],
  ENTITY_INTEGRATIONS_WATCHGUARD: [
    'entity.integrations.watchguard.connect',
    'entity.integrations.watchguard.monitor',
    'entity.integrations.watchguard.alerts'
  ] as Permission[],
  ENTITY_INTEGRATIONS_WEBHOOK: [
    'entity.integrations.webhook.create',
    'entity.integrations.webhook.read',
    'entity.integrations.webhook.update',
    'entity.integrations.webhook.delete'
  ] as Permission[]
}
