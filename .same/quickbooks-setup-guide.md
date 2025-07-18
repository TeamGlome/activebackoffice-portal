# 🚀 QuickBooks Integration - LIVE Credentials Setup Guide

## 🔐 **STEP 1: Add Your QuickBooks Credentials**

### **Where to Add Your Credentials:**

#### **1. Local Development Environment**
**File**: `activeoffice-portal/.env.local`

```bash
# QuickBooks Integration - ADD YOUR LIVE CREDENTIALS HERE
QUICKBOOKS_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID
QUICKBOOKS_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET
QUICKBOOKS_REDIRECT_URI=https://app.activebackoffice.com/dashboard/integrations/quickbooks/callback
```

#### **2. Vercel Production Environment**
**Location**: Vercel Dashboard → Project → Settings → Environment Variables

**Add these variables:**
- `QUICKBOOKS_CLIENT_ID` = Your actual Client ID
- `QUICKBOOKS_CLIENT_SECRET` = Your actual Client Secret
- `QUICKBOOKS_REDIRECT_URI` = `https://app.activebackoffice.com/dashboard/integrations/quickbooks/callback`

---

## 🔧 **STEP 2: QuickBooks Developer App Configuration**

### **In Your QuickBooks Developer Dashboard:**
1. **App Name**: Active Back Office
2. **Redirect URIs**:
   - Production: `https://app.activebackoffice.com/dashboard/integrations/quickbooks/callback`
   - Development: `http://localhost:3000/dashboard/integrations/quickbooks/callback`
3. **Scope**: `com.intuit.quickbooks.accounting`
4. **App Type**: Web App

---

## 🧪 **STEP 3: Test the Integration**

### **Test OAuth Flow:**
1. Update `.env.local` with your credentials
2. Restart development server: `bun dev`
3. Visit: `http://localhost:3000/dashboard/integrations/quickbooks`
4. Click "Connect to QuickBooks"
5. Complete OAuth authorization
6. Verify connection success at callback page

### **Test Data Sync:**
1. After successful connection, click "Sync Now"
2. Check synced data in the integration page
3. Test financial reports by clicking the report buttons
4. Verify API endpoints return live data

---

## 🚀 **STEP 4: Deploy to Production**

### **Update Vercel Environment Variables:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `activebackoffice-portal`
3. Go to Settings → Environment Variables
4. Add/Update these variables:
   - `QUICKBOOKS_CLIENT_ID`
   - `QUICKBOOKS_CLIENT_SECRET`
   - `QUICKBOOKS_REDIRECT_URI`

### **Redeploy:**
```bash
# Push changes and trigger deployment
git add .
git commit -m "Update QuickBooks credentials"
git push origin main
```

---

## 📊 **STEP 5: Verify Production Integration**

### **Test Production OAuth:**
1. Visit: `https://app.activebackoffice.com/dashboard/integrations/quickbooks`
2. Click "Connect to QuickBooks"
3. Complete authorization with your production app
4. Verify callback success

### **Test Financial Reports:**
```bash
# Test API endpoints directly
https://app.activebackoffice.com/api/reports/financial?entity_id=ent_1&report_type=summary
https://app.activebackoffice.com/api/reports/financial?entity_id=ent_1&report_type=balance_sheet
https://app.activebackoffice.com/api/reports/financial?entity_id=ent_1&report_type=profit_loss
https://app.activebackoffice.com/api/reports/financial?entity_id=ent_1&report_type=cash_flow
```

---

## 🔐 **Security Best Practices**

### **Environment Variables Security:**
- ✅ Never commit `.env.local` to git (already in .gitignore)
- ✅ Use Vercel environment variables for production secrets
- ✅ Rotate credentials periodically
- ✅ Use different credentials for development vs production

### **OAuth Security:**
- ✅ Validate state parameter in callbacks
- ✅ Store tokens securely (encrypted in database)
- ✅ Implement token refresh logic
- ✅ Log all authentication attempts

---

## 🐛 **Troubleshooting Guide**

### **Common Issues & Solutions:**

#### **"Redirect URI Mismatch" Error**
- **Problem**: QuickBooks redirect URI doesn't match configured URI
- **Solution**: Ensure exact match in QuickBooks Developer Dashboard
- **Check**: Remove trailing slashes, verify HTTPS vs HTTP

#### **"Invalid Client" Error**
- **Problem**: Client ID or Secret is incorrect
- **Solution**: Double-check credentials in QuickBooks Developer Dashboard
- **Verify**: Copy credentials exactly (no extra spaces)

#### **"Authorization Failed" Error**
- **Problem**: OAuth flow interrupted or invalid
- **Solution**: Clear browser cache, try incognito mode
- **Check**: Ensure QuickBooks app is active and published

#### **"Sync Failed" Error**
- **Problem**: API calls failing after authorization
- **Solution**: Check token expiry, implement refresh logic
- **Debug**: Check browser network tab for API errors

---

## 📋 **Testing Checklist**

### **Local Development Testing:**
- [ ] `.env.local` updated with your credentials
- [ ] OAuth flow completes successfully
- [ ] Callback page shows success message
- [ ] Sync button retrieves data
- [ ] Financial reports generate correctly

### **Production Testing:**
- [ ] Vercel environment variables set
- [ ] Production OAuth flow works
- [ ] Live API endpoints return data
- [ ] Entity management shows integration status
- [ ] No console errors in browser

---

## 🎯 **Success Validation**

### **Integration Working When:**
- ✅ OAuth completes without errors
- ✅ Company information displays correctly
- ✅ Data sync returns account, customer, transaction data
- ✅ Financial reports show live QuickBooks data
- ✅ Entity management page shows "Connected" status
- ✅ No API errors in browser console

---

## 📞 **Need Help?**

### **Debug Information to Collect:**
1. Browser console errors
2. Network tab showing API requests/responses
3. QuickBooks Developer Dashboard settings
4. Environment variable values (hide secrets)
5. Error messages from callback page

### **Next Steps After Setup:**
1. Test with multiple entities
2. Implement token refresh automation
3. Add database persistence for tokens
4. Set up monitoring and alerting
5. Configure automated sync schedules

---

*Updated: January 17, 2025 - Ready for Live QuickBooks Integration* 🚀
