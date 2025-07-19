import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Security Headers Configuration
const securityHeaders = {
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "media-src 'self' https:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "connect-src 'self' https://api.activebackoffice.com https://*.supabase.co https://vercel.live wss://ws.vercel.live",
    "worker-src 'self' blob:"
  ].join('; '),

  // Strict Transport Security (HTTPS enforcement)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Permissions Policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
    'payment=(self)',
    'usb=()'
  ].join(', ')
}

// Rate Limiting Configuration
const rateLimits = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 1000 // requests per window

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowStart = now - RATE_LIMIT_WINDOW

  // Clean old entries
  for (const [key, value] of rateLimits.entries()) {
    if (value.resetTime < windowStart) {
      rateLimits.delete(key)
    }
  }

  const current = rateLimits.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW }

  if (current.count >= MAX_REQUESTS) {
    return false
  }

  current.count++
  rateLimits.set(ip, current)
  return true
}

// Bot Detection
function detectBot(userAgent: string): boolean {
  const botPatterns = [
    /bot/i, /crawl/i, /slurp/i, /spider/i, /scrape/i
  ]
  return botPatterns.some(pattern => pattern.test(userAgent))
}

// Security Monitoring
function logSecurityEvent(event: string, details: any, request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    console.warn(`[SECURITY] ${event}:`, {
      ...details,
      ip: request.ip,
      userAgent: request.headers.get('user-agent'),
      url: request.url,
      timestamp: new Date().toISOString()
    })
  }
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Get client info
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || ''
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')

  // 1. HTTPS Enforcement
  if (process.env.NODE_ENV === 'production' && request.headers.get('x-forwarded-proto') !== 'https') {
    logSecurityEvent('HTTPS_REDIRECT', { original_url: request.url }, request)
    return NextResponse.redirect(`https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`, 301)
  }

  // 2. Domain Validation
  const allowedHosts = [
    'app.activebackoffice.com',
    'activebackoffice.com',
    'www.activebackoffice.com',
    'localhost:3000' // for development
  ]

  if (process.env.NODE_ENV === 'production' && host && !allowedHosts.includes(host)) {
    logSecurityEvent('INVALID_HOST', { host }, request)
    return new NextResponse('Invalid Host', { status: 400 })
  }

  // 3. Rate Limiting
  if (!checkRateLimit(ip)) {
    logSecurityEvent('RATE_LIMIT_EXCEEDED', { ip, requests_in_window: MAX_REQUESTS }, request)
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'Retry-After': '900' // 15 minutes
      }
    })
  }

  // 4. Bot Detection (allow but log)
  if (detectBot(userAgent)) {
    logSecurityEvent('BOT_DETECTED', { userAgent }, request)
  }

  // 5. API Route Protection
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Check for API key or session for protected routes
    const authHeader = request.headers.get('authorization')
    const sessionCookie = request.cookies.get('next-auth.session-token') ||
                         request.cookies.get('__Secure-next-auth.session-token') ||
                         request.cookies.get('next-auth.session-token.0') ||
                         request.cookies.get('next-auth.session-token.1')

    const protectedApiRoutes = [
      '/api/platform/',
      '/api/integrations/',
      '/api/reports/'
    ]

    const publicApiRoutes = [
      '/api/auth/',
      '/api/setup',
      '/api/force-setup',
      '/api/debug-setup',
      '/api/debug-quickbooks',
      '/api/test-quickbooks',
      '/api/fix-quickbooks-integrations'
    ]

    const isProtectedRoute = protectedApiRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route)
    )

    const isPublicRoute = publicApiRoutes.some(route =>
      request.nextUrl.pathname.startsWith(route)
    )

    // Check if request is from authenticated dashboard user
    const referer = request.headers.get('referer')
    const isDashboardRequest = referer && referer.includes('/dashboard')

    // Temporarily disabled - let API routes handle their own auth
    /*
    if (isProtectedRoute && !isPublicRoute && !authHeader && !sessionCookie && !isDashboardRequest) {
      logSecurityEvent('UNAUTHORIZED_API_ACCESS', {
        path: request.nextUrl.pathname,
        hasAuthHeader: !!authHeader,
        hasSessionCookie: !!sessionCookie,
        referer: referer,
        isDashboardRequest: isDashboardRequest,
        cookies: Object.fromEntries(request.cookies.getAll().map(c => [c.name, '***']))
      }, request)
      return new NextResponse('Unauthorized', { status: 401 })
    }
    */
  }

  // 6. CORS Configuration
  if (origin && request.method === 'OPTIONS') {
    const allowedOrigins = [
      'https://app.activebackoffice.com',
      'https://activebackoffice.com',
      'https://www.activebackoffice.com'
    ]

    if (process.env.NODE_ENV === 'development') {
      allowedOrigins.push('http://localhost:3000')
    }

    if (allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      response.headers.set('Access-Control-Max-Age', '86400')
    }
  }

  // 7. Setup Page Access (Allow without authentication)
  if (request.nextUrl.pathname.startsWith('/setup')) {
    console.log('🔧 Setup page access allowed')
    // Skip all auth checks for setup page
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  // 8. Admin Route Protection
  if (request.nextUrl.pathname.startsWith('/dashboard/platform/')) {
    // Additional logging for admin access
    logSecurityEvent('ADMIN_ACCESS_ATTEMPT', {
      path: request.nextUrl.pathname,
      has_session: !!request.cookies.get('next-auth.session-token')
    }, request)
  }

  // 9. Apply Security Headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // 9. Security Token Headers
  response.headers.set('X-Powered-By', 'Active Back Office')
  response.headers.set('X-Security-Level', 'production')

  // 10. Cache Control for sensitive routes
  if (request.nextUrl.pathname.startsWith('/dashboard/') ||
      request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
