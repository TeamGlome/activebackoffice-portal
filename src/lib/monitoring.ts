// Production Monitoring & Analytics System

export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  timestamp?: Date
}

export interface ErrorEvent {
  error: Error
  context?: Record<string, any>
  userId?: string
  url?: string
  userAgent?: string
}

export interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp?: Date
  metadata?: Record<string, any>
}

class MonitoringService {
  private isProduction = process.env.NODE_ENV === 'production'
  private apiEndpoint = '/api/monitoring'

  // Analytics Tracking
  async trackEvent(event: AnalyticsEvent) {
    if (!this.isProduction && !process.env.ENABLE_ANALYTICS_DEBUG) {
      console.log('📊 Analytics Event:', event)
      return
    }

    try {
      await fetch(`${this.apiEndpoint}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          timestamp: event.timestamp || new Date(),
          source: 'web'
        })
      })
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }

  // Error Tracking
  async trackError(errorEvent: ErrorEvent) {
    const errorData = {
      message: errorEvent.error.message,
      stack: errorEvent.error.stack,
      name: errorEvent.error.name,
      context: errorEvent.context,
      userId: errorEvent.userId,
      url: errorEvent.url || (typeof window !== 'undefined' ? window.location.href : ''),
      userAgent: errorEvent.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : ''),
      timestamp: new Date()
    }

    if (!this.isProduction) {
      console.error('🚨 Error Tracked:', errorData)
      return
    }

    try {
      await fetch(`${this.apiEndpoint}/errors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      })
    } catch (error) {
      console.error('Failed to track error:', error)
    }
  }

  // Performance Monitoring
  async trackPerformance(metric: PerformanceMetric) {
    if (!this.isProduction && !process.env.ENABLE_PERFORMANCE_DEBUG) {
      console.log('⚡ Performance Metric:', metric)
      return
    }

    try {
      await fetch(`${this.apiEndpoint}/performance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...metric,
          timestamp: metric.timestamp || new Date()
        })
      })
    } catch (error) {
      console.error('Failed to track performance:', error)
    }
  }

  // User Activity Tracking
  async trackUserActivity(activity: string, metadata?: Record<string, any>) {
    await this.trackEvent({
      event: 'user_activity',
      properties: {
        activity,
        ...metadata
      }
    })
  }

  // Feature Usage Tracking
  async trackFeatureUsage(feature: string, action: string, metadata?: Record<string, any>) {
    await this.trackEvent({
      event: 'feature_usage',
      properties: {
        feature,
        action,
        ...metadata
      }
    })
  }

  // Integration Tracking
  async trackIntegration(integration: string, action: string, success: boolean, metadata?: Record<string, any>) {
    await this.trackEvent({
      event: 'integration_activity',
      properties: {
        integration,
        action,
        success,
        ...metadata
      }
    })
  }

  // System Health Metrics
  async trackSystemHealth() {
    if (typeof window === 'undefined') return

    const performanceEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
    const navigation = performanceEntries[0]

    if (navigation) {
      await this.trackPerformance({
        name: 'page_load_time',
        value: navigation.loadEventEnd - navigation.fetchStart,
        unit: 'ms',
        metadata: {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          firstContentfulPaint: this.getFirstContentfulPaint()
        }
      })
    }

    // Memory usage (if available)
    if ('memory' in performance) {
      const memory = (performance as any).memory
      await this.trackPerformance({
        name: 'memory_usage',
        value: memory.usedJSHeapSize,
        unit: 'bytes',
        metadata: {
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        }
      })
    }
  }

  private getFirstContentfulPaint(): number | null {
    const perfEntries = performance.getEntriesByType('paint')
    const fcp = perfEntries.find(entry => entry.name === 'first-contentful-paint')
    return fcp ? fcp.startTime : null
  }

  // Dashboard Analytics
  async trackDashboardView(page: string, loadTime?: number) {
    await this.trackEvent({
      event: 'dashboard_view',
      properties: {
        page,
        loadTime
      }
    })
  }

  // API Performance Tracking
  async trackApiCall(endpoint: string, method: string, duration: number, status: number) {
    await this.trackPerformance({
      name: 'api_response_time',
      value: duration,
      unit: 'ms',
      metadata: {
        endpoint,
        method,
        status,
        success: status >= 200 && status < 300
      }
    })
  }
}

// Global Error Handler
export function setupGlobalErrorHandling(monitoring: MonitoringService) {
  if (typeof window === 'undefined') return

  // Unhandled Promise Rejections
  window.addEventListener('unhandledrejection', (event) => {
    monitoring.trackError({
      error: new Error(event.reason?.message || 'Unhandled Promise Rejection'),
      context: {
        type: 'unhandled_promise_rejection',
        reason: event.reason
      }
    })
  })

  // JavaScript Errors
  window.addEventListener('error', (event) => {
    monitoring.trackError({
      error: event.error || new Error(event.message),
      context: {
        type: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    })
  })

  // Resource Loading Errors
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      monitoring.trackError({
        error: new Error('Resource loading failed'),
        context: {
          type: 'resource_error',
          element: (event.target as any)?.tagName,
          source: (event.target as any)?.src || (event.target as any)?.href
        }
      })
    }
  }, true)
}

// Create singleton instance
export const monitoring = new MonitoringService()

// React Hook for Analytics
export function useAnalytics() {
  return {
    trackEvent: monitoring.trackEvent.bind(monitoring),
    trackError: monitoring.trackError.bind(monitoring),
    trackFeature: monitoring.trackFeatureUsage.bind(monitoring),
    trackActivity: monitoring.trackUserActivity.bind(monitoring)
  }
}

// High-level tracking functions
export const analytics = {
  // User actions
  login: (method: string) => monitoring.trackEvent({ event: 'user_login', properties: { method } }),
  logout: () => monitoring.trackEvent({ event: 'user_logout' }),
  signup: (method: string) => monitoring.trackEvent({ event: 'user_signup', properties: { method } }),

  // Feature usage
  dashboardView: (page: string) => monitoring.trackDashboardView(page),
  integrationConnect: (service: string) => monitoring.trackIntegration(service, 'connect', true),
  integrationDisconnect: (service: string) => monitoring.trackIntegration(service, 'disconnect', true),
  reportGenerated: (type: string) => monitoring.trackFeatureUsage('reports', 'generate', { type }),

  // System events
  pageLoad: () => monitoring.trackSystemHealth(),
  apiCall: (endpoint: string, method: string, duration: number, status: number) =>
    monitoring.trackApiCall(endpoint, method, duration, status)
}
