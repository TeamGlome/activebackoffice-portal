# 🔐 Active Back Office - Authentication Setup

## ✅ Real Authentication Implemented

Your Active Back Office portal now has **real authentication** using NextAuth.js with database persistence.

---

## 🚀 **Admin Access Credentials**

### **Super Admin Account**
```
📧 Email: admin@activebackoffice.com
🔑 Password: creadmin123!
👤 Role: SUPER_ADMIN + PLATFORM_SUPER_ADMIN
🏢 Entity: Active Back Office (default-entity)
```

### **Quick Login**
The login page now includes a **"Quick Admin Login"** button that automatically fills in the credentials and logs you in.

---

## 🛠️ **Local Development Setup**

### **Prerequisites**
- Node.js 18+ or Bun
- SQLite (included)
- Git

### **Installation**
```bash
cd activebackoffice-portal
bun install
```

### **Database Setup**
```bash
# Push database schema
bunx prisma db push

# Create admin user (if not already created)
bun run setup:admin
```

### **Development Server**
```bash
bun dev
```

**Access locally:** http://localhost:3000/login

---

## 🌐 **Vercel Deployment Setup**

### **1. Environment Variables for Vercel**

Add these environment variables in your Vercel dashboard:

```bash
# Database (use PostgreSQL for production)
DATABASE_URL="postgresql://username:password@host:5432/activebackoffice"

# NextAuth
NEXTAUTH_URL="https://app.activebackoffice.com"
NEXTAUTH_SECRET="your-super-secure-32-character-secret"

# Optional: QuickBooks Integration
QUICKBOOKS_CLIENT_ID="your_quickbooks_client_id"
QUICKBOOKS_CLIENT_SECRET="your_quickbooks_client_secret"
QUICKBOOKS_REDIRECT_URI="https://app.activebackoffice.com/api/integrations/quickbooks/callback"
```

### **2. Database Setup for Production**

#### **Option A: Vercel Postgres (Recommended)**
```bash
# In Vercel dashboard
1. Go to Storage tab
2. Create new Postgres database
3. Copy DATABASE_URL to environment variables
```

#### **Option B: External PostgreSQL**
```bash
# Use any PostgreSQL provider (Supabase, PlanetScale, etc.)
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

### **3. Deploy to Vercel**
```bash
# Connect to Vercel
vercel link

# Deploy
vercel --prod
```

### **4. Create Admin User in Production**
After deployment, create the admin user:

```bash
# SSH into Vercel function or use Vercel CLI
vercel env pull .env.production
DATABASE_URL="your_production_db_url" bun run setup:admin
```

---

## 🔒 **Authentication Features**

### **Implemented**
- ✅ **NextAuth.js** with credentials provider
- ✅ **Database sessions** with Prisma
- ✅ **Password hashing** with bcryptjs
- ✅ **Multi-tenant support** (entities/organizations)
- ✅ **Role-based permissions** (USER, ADMIN, SUPER_ADMIN)
- ✅ **Platform roles** (PLATFORM_ADMIN, PLATFORM_SUPER_ADMIN)
- ✅ **Session management** with automatic expiry
- ✅ **Protected routes** with authentication guards
- ✅ **Login page** with error handling and loading states

### **User Management**
- **Super Admin**: Full platform and entity control
- **Admin**: Entity-level management
- **User**: Basic access within entity

### **Security Features**
- Password hashing with bcrypt
- Secure session tokens
- CSRF protection
- Environment variable protection
- Database session storage

---

## 📊 **Database Schema**

### **Core Tables**
- **User** - User accounts with roles
- **Session** - Active user sessions
- **Account** - OAuth provider accounts (future)
- **Entity** - Organizations/tenants
- **VerificationToken** - Email verification (future)

### **Relationships**
- Users belong to Entities
- Users have Sessions
- Users can have multiple Accounts (OAuth)

---

## 🚀 **Access Your Dashboard**

### **Production (Vercel)**
1. **Login**: https://app.activebackoffice.com/login
2. **Dashboard**: https://app.activebackoffice.com/dashboard

### **Local Development**
1. **Login**: http://localhost:3000/login
2. **Dashboard**: http://localhost:3000/dashboard

---

## 🔧 **Troubleshooting**

### **Common Issues**

#### **"Environment variable not found: DATABASE_URL"**
```bash
# Make sure .env.local exists with:
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="development-nextauth-secret-32-chars-min"
NEXTAUTH_URL="http://localhost:3000"
```

#### **"Admin user doesn't exist"**
```bash
# Recreate admin user
bun run setup:admin
```

#### **"Invalid credentials"**
- Check email: `admin@activebackoffice.com`
- Check password: `creadmin123!`
- Use "Quick Admin Login" button

#### **Build fails on Vercel**
```bash
# Make sure these are in package.json scripts:
"build": "prisma generate && next build"
"postinstall": "prisma generate"
```

---

## 📞 **Support**

If you encounter any issues:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Ensure database is accessible
4. Check Vercel function logs

**Authentication Status: ✅ READY FOR PRODUCTION**
