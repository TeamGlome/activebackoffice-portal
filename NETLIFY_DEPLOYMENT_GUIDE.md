# Netlify Deployment Guide

This guide covers deploying the ActiveBackoffice Portal to Netlify.

## Prerequisites

- Node.js 18+
- Bun package manager
- Netlify account
- Environment variables configured

## Deployment Configuration

### 1. Build Settings

The app is configured for Netlify deployment with:

- **Build Command**: `bun run build`
- **Publish Directory**: `.next`
- **Node Version**: 18

### 2. Netlify Configuration

The `netlify.toml` file contains all necessary configuration:

```toml
[build]
  command = "bun run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--production=false"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 3. Next.js Configuration

The `next.config.js` is optimized for Netlify:

```javascript
const nextConfig = {
  images: {
    unoptimized: true  // Required for static hosting
  },
  trailingSlash: false,
  // No output: 'standalone' for Netlify
}
```

## Environment Variables

Configure these environment variables in Netlify:

### Required
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `NEXTAUTH_URL` - Your site URL (e.g., https://yoursite.netlify.app)
- `DATABASE_URL` - Your database connection string

### Optional
- `QUICKBOOKS_CLIENT_ID` - QuickBooks integration
- `QUICKBOOKS_CLIENT_SECRET` - QuickBooks integration
- Other API keys as needed

## Deployment Steps

### 1. Automated Deployment (Recommended)

1. Connect your GitHub repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `.next`
4. Configure environment variables
5. Deploy

### 2. Manual Deployment

```bash
# Build locally
bun install
bun run build

# Test deployment config
node scripts/test-netlify-deployment.js

# Deploy using Netlify CLI
netlify deploy --prod --dir=.next
```

## Troubleshooting

### Common Issues

1. **"Deploy directory 'dist' does not exist"**
   - Check `netlify.toml` has `publish = ".next"`
   - Ensure no Vercel configuration files exist
   - Verify build completed successfully

2. **Build fails with dependency errors**
   - Check Node version is 18+
   - Ensure all dependencies are in package.json
   - Clear build cache in Netlify

3. **API routes not working**
   - Verify `@netlify/plugin-nextjs` is installed
   - Check function redirects in `netlify.toml`
   - Ensure environment variables are set

4. **Images not loading**
   - Confirm `images: { unoptimized: true }` in next.config.js
   - Check image paths are correct
   - Verify static files are in public directory

### Build Logs

Check Netlify build logs for:
- Successful `bun run build` execution
- `.next` directory creation
- No missing dependencies
- Environment variable loading

### Testing Deployment

```bash
# Test locally
bun run build
bun run start

# Test Netlify config
node scripts/test-netlify-deployment.js
```

## Database Considerations

### Development vs Production

- Development: Local SQLite database
- Production: PostgreSQL (Neon, Supabase, etc.)

### Migration

```bash
# Generate Prisma client
bunx prisma generate

# Push schema to production database
bunx prisma db push
```

## Performance Optimization

### Caching

The configuration includes optimized caching headers:
- Static files: 1 year cache
- Build assets: Immutable cache
- Security headers applied

### Build Optimization

- Images unoptimized for static hosting
- Source maps disabled in production
- Bundle size optimized

## Security

### Headers

Security headers are configured in `netlify.toml`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: enabled

### Environment Variables

- Never commit secrets to repository
- Use Netlify environment variables
- Rotate secrets regularly

## Monitoring

### Error Tracking

Consider adding:
- Sentry for error tracking
- Analytics for usage monitoring
- Uptime monitoring

### Logs

- Build logs in Netlify dashboard
- Function logs for API routes
- Error logs in application

## Support

For deployment issues:
1. Check build logs in Netlify dashboard
2. Verify environment variables
3. Test locally with production build
4. Review this guide for common issues

## Changelog

- v1.0: Initial Netlify deployment configuration
- v1.1: Fixed Next.js 15 compatibility
- v1.2: Updated routing configuration
