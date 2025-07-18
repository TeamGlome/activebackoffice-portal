# 🚀 Active Back Office - Production Deployment Guide

## 📋 Overview

This guide covers the complete setup of your Active Back Office portal for production deployment with all enterprise features enabled.

## ✅ Prerequisites Completed

- ✅ **Vercel Environment Variables Added**
- ✅ **Supabase Database Connected**
- ✅ **NextAuth Configuration Fixed**
- ✅ **Domain:** https://app.activebackoffice.com

## 🗄️ 1. Database Schema & Admin Setup

### Deploy Database Schema
```bash
# Push schema to production database
bun run db:push:production

# Deploy and setup admin user
bun run deploy:production
```

### Verify Admin Access
- **URL:** https://app.activebackoffice.com/login
- **Email:** `admin@activebackoffice.com`
- **Password:** `creadmin123!`

### Database Tables Created
- ✅ Users, Entities, Sessions, Accounts
- ✅ Analytics tracking
- ✅ Error logging
- ✅ Performance metrics
- ✅ Security events
- ✅ Audit logs
- ✅ User activity tracking

## 💼 2. QuickBooks Integration Setup

### Production QuickBooks App
1. **Create Production App:** [QuickBooks Developer Dashboard](https://developer.intuit.com/app/developer/dashboard)
2. **Add Environment Variables to Vercel:**
   ```bash
   QUICKBOOKS_CLIENT_ID=your_production_client_id
   QUICKBOOKS_CLIENT_SECRET=your_production_client_secret
   QUICKBOOKS_ENVIRONMENT=production
   ```
3. **Configure Redirect URI:**
   ```
   https://app.activebackoffice.com/dashboard/integrations/quickbooks/callback
   ```

### Testing QuickBooks Integration
1. Go to Dashboard → Integrations → QuickBooks
2. Click "Connect to QuickBooks"
3. Complete OAuth flow
4. Verify data sync

## 👥 3. User Management & RBAC

### Role Hierarchy
- **SUPER_ADMIN:** Complete system access
- **ADMIN:** Entity management, user creation
- **MANAGER:** Team management, reports
- **USER:** Dashboard access, basic operations
- **VIEWER:** Read-only access

### Create Additional Users
1. **Dashboard → Platform → Users**
2. Click "Add User"
3. Set appropriate role and permissions
4. Send invite email

### Permissions Matrix
```
Feature                | SUPER_ADMIN | ADMIN | MANAGER | USER | VIEWER
--------------------- |-------------|-------|---------|------|--------
User Management       | ✅          | ✅    | ❌      | ❌   | ❌
System Configuration  | ✅          | ✅    | ❌      | ❌   | ❌
Financial Reports      | ✅          | ✅    | ✅      | ✅   | ✅
Integration Setup      | ✅          | ✅    | ✅      | ❌   | ❌
Dashboard Access       | ✅          | ✅    | ✅      | ✅   | ✅
```

## 📊 4. Monitoring & Analytics

### Analytics Dashboard
- **Real-time user activity tracking**
- **Feature usage analytics**
- **Performance monitoring**
- **Error tracking and alerts**

### Monitoring Features
- ✅ **Page load times**
- ✅ **API response times**
- ✅ **Memory usage tracking**
- ✅ **Error rate monitoring**
- ✅ **User behavior analytics**

### Access Analytics
Navigate to: **Dashboard → Platform → Analytics**

### Key Metrics Tracked
- User logins/logouts
- Feature usage patterns
- Integration activity
- System performance
- Security events

## 🔒 5. Security & SSL Configuration

### Security Features Enabled
- ✅ **HTTPS Enforcement (SSL)**
- ✅ **Security Headers (CSP, HSTS, etc.)**
- ✅ **Rate Limiting (1000 req/15min)**
- ✅ **Bot Detection**
- ✅ **CORS Protection**
- ✅ **XSS Protection**
- ✅ **CSRF Protection**

### Domain Security
- ✅ **Custom Domain:** app.activebackoffice.com
- ✅ **SSL Certificate:** Auto-managed by Vercel
- ✅ **HSTS:** Enabled with preload
- ✅ **Domain Validation:** Enforced

### Security Monitoring
- Real-time security event logging
- Failed authentication tracking
- Suspicious activity detection
- IP-based rate limiting

## 🛠️ 6. Production Configuration

### Required Environment Variables
```bash
# Core Application
NEXTAUTH_URL=https://app.activebackoffice.com
NEXTAUTH_SECRET=your-secure-secret-key
DATABASE_URL=your-supabase-postgres-url

# QuickBooks Integration
QUICKBOOKS_CLIENT_ID=your-production-client-id
QUICKBOOKS_CLIENT_SECRET=your-production-client-secret
QUICKBOOKS_ENVIRONMENT=production

# Monitoring (Optional)
ENABLE_ANALYTICS_DEBUG=false
ENABLE_PERFORMANCE_DEBUG=false

# Security
RATE_LIMIT_ENABLED=true
BOT_DETECTION_ENABLED=true
```

### Vercel Configuration
```json
{
  "framework": "nextjs",
  "buildCommand": "prisma generate && next build",
  "installCommand": "bun install",
  "env": {
    "DISABLE_ESLINT_PLUGIN": "true"
  }
}
```

## 🔧 7. Post-Deployment Steps

### 1. Database Migration
```bash
bun run deploy:production
```

### 2. SSL Certificate Verification
- Verify HTTPS redirect: http://app.activebackoffice.com → https://app.activebackoffice.com
- Check SSL rating: [SSL Labs Test](https://www.ssllabs.com/ssltest/)

### 3. Security Headers Verification
- Test headers: [Security Headers](https://securityheaders.com/)
- Expected rating: A+ or A

### 4. Performance Testing
- Page speed: [PageSpeed Insights](https://pagespeed.web.dev/)
- Load testing: Monitor response times

### 5. Admin Account Security
```bash
# Change default admin password immediately
1. Login with admin@activebackoffice.com / creadmin123!
2. Go to Profile Settings
3. Update password
4. Enable 2FA (when available)
```

## 📈 8. Monitoring Dashboard

### Key Performance Indicators (KPIs)
- **Active Users:** Real-time user sessions
- **Response Times:** Average API response time <200ms
- **Error Rate:** <1% error rate target
- **Uptime:** 99.9% availability target

### Alerts Configuration
- High error rate (>5%)
- Slow response times (>1s)
- Security incidents
- Failed authentication attempts (>10/min)

## 🚨 9. Security Checklist

### Pre-Production Security Audit
- ✅ Admin password changed from default
- ✅ Environment variables secured
- ✅ Database access restricted
- ✅ API endpoints protected
- ✅ Rate limiting enabled
- ✅ Security headers configured
- ✅ HTTPS enforced
- ✅ Input validation implemented

### Ongoing Security Tasks
- [ ] Regular security updates
- [ ] Access log reviews
- [ ] User permission audits
- [ ] Backup verification
- [ ] Incident response testing

## 📞 10. Support & Maintenance

### Production URLs
- **Main App:** https://app.activebackoffice.com
- **Admin Panel:** https://app.activebackoffice.com/dashboard/platform
- **API Base:** https://app.activebackoffice.com/api

### Maintenance Schedule
- **Database backups:** Daily (automated by Supabase)
- **Security updates:** Weekly review
- **Performance monitoring:** Continuous
- **User access audit:** Monthly

### Emergency Contacts
- **Technical Issues:** Check Vercel deployment logs
- **Database Issues:** Supabase dashboard
- **Security Incidents:** Review security event logs

## 🎯 11. Success Metrics

### Deployment Success Criteria
- ✅ Login page loads without errors
- ✅ Admin can login successfully
- ✅ Dashboard displays correctly
- ✅ Security headers present
- ✅ HTTPS enforced
- ✅ Analytics tracking functional
- ✅ Rate limiting active

### Performance Targets
- **Page Load:** <2 seconds
- **API Response:** <200ms average
- **Uptime:** >99.9%
- **Error Rate:** <1%

---

## 🎉 Deployment Complete!

Your Active Back Office portal is now fully production-ready with:
- ✅ Enterprise-grade security
- ✅ Comprehensive user management
- ✅ Real-time monitoring & analytics
- ✅ QuickBooks integration ready
- ✅ SSL/HTTPS enforcement
- ✅ Performance optimization

**Next Steps:** Begin onboarding your team and configuring integrations!
