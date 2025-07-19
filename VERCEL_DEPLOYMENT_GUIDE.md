# 🚀 Vercel Deployment Fix Guide

## Current Issue
- **URL:** https://app.activebackoffice.com/login?error=Configuration
- **Cause:** Missing NextAuth environment variables

## ✅ IMMEDIATE FIX - Add Missing Environment Variables

### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your `activebackoffice-portal` project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add These 3 Critical Variables

```bash
# Variable 1: NextAuth URL
NEXTAUTH_URL
Value: https://app.activebackoffice.com

# Variable 2: NextAuth Secret
NEXTAUTH_SECRET
Value: 5BkB2Z9a7B4JdPrdzJ/fqZsVJryRVNqVZGXzwehc9v51JXYk5H99keR+ENlc9Bt0

# Variable 3: Database URL
DATABASE_URL
Value: postgres://postgres.adxfdjvtklyubpdgfbsv:V8W0J2sd6QUIwbRf@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true
```

### Step 3: Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Wait for build to complete

## 🔧 After Environment Variables Are Set

### Initialize Database Schema
Run this command to set up the database:
```bash
bun run setup:production
```

## ✅ Expected Result
- ✅ https://app.activebackoffice.com/login loads without errors
- ✅ Admin login works with:
  - **Email:** admin@activebackoffice.com
  - **Password:** creadmin123!

## 🎯 Current Environment Summary

**✅ Already Set (Supabase):**
- POSTGRES_URL, POSTGRES_PRISMA_URL, SUPABASE_* variables

**❌ Missing (Required for NextAuth):**
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- DATABASE_URL

## 🔒 Security Notes
- Change admin password after first login
- NEXTAUTH_SECRET is using your Supabase JWT secret for convenience
- All database connections are using SSL

## 📞 Support
If issues persist after adding environment variables:
1. Check Vercel Function Logs
2. Verify database connection in Supabase dashboard
3. Ensure all environment variables are saved with correct values
