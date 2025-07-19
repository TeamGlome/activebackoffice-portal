# 🔐 QuickBooks Credentials Setup - Ready for Your Credentials!

## 🎯 **YOUR NEXT STEPS**

Hi! I've prepared everything for your QuickBooks integration. Here's exactly what you need to do to add your credentials and get the live integration working:

---

## 📋 **STEP 1: Add Your Credentials Locally**

### **Edit this file:** `activeoffice-portal/.env.local`

**Replace these placeholder values with your actual QuickBooks credentials:**

```bash
# QuickBooks Integration - ADD YOUR LIVE CREDENTIALS HERE
QUICKBOOKS_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_FROM_QUICKBOOKS
QUICKBOOKS_CLIENT_SECRET=YOUR_ACTUAL_CLIENT_SECRET_FROM_QUICKBOOKS
QUICKBOOKS_REDIRECT_URI=https://app.activebackoffice.com/dashboard/integrations/quickbooks/callback
```

**Example:**
```bash
# QuickBooks Integration - ADD YOUR LIVE CREDENTIALS HERE
QUICKBOOKS_CLIENT_ID=ABkMcCHjM7TI1xiDWBoHRysEoMYw9J0LuTHSUyKbHDkPMqg6uc
QUICKBOOKS_CLIENT_SECRET=senxuegI5rVrfkzJOPgxnAS15MOVL6PCLpW759eL
QUICKBOOKS_REDIRECT_URI=https://app.activebackoffice.com/dashboard/integrations/quickbooks/callback
```

---

## 🚀 **STEP 2: Add Credentials to Vercel**

### **Go to Vercel Dashboard:**
1. Visit: https://vercel.com/dashboard
2. Find your project: `activebackoffice-portal`
3. Go to: **Settings** → **Environment Variables**

### **Add these 3 environment variables:**

| Variable Name | Value |
|---------------|-------|
| `QUICKBOOKS_CLIENT_ID` | Your actual Client ID |
| `QUICKBOOKS_CLIENT_SECRET` | Your actual Client Secret |
| `QUICKBOOKS_REDIRECT_URI` | `https://app.activebackoffice.com/dashboard/integrations/quickbooks/callback` |

---

## 🧪 **STEP 3: Test the Integration**

### **Local Testing:**
1. **Update `.env.local`** with your credentials (see Step 1)
2. **Restart development server:**
   ```bash
   cd activeoffice-portal
   bun dev
   ```
3. **Visit:** http://localhost:3000/dashboard/integrations/quickbooks
4. **Click:** "Connect to QuickBooks"
5. **Complete:** OAuth authorization in QuickBooks
6. **Verify:** You see success message and company info

### **Production Testing:**
1. **Update Vercel environment variables** (see Step 2)
2. **Wait for auto-deployment** (or trigger manually)
3. **Visit:** https://app.activebackoffice.com/dashboard/integrations/quickbooks
4. **Test:** Same OAuth flow as local testing

---

## ✅ **STEP 4: Verify Everything Works**

### **What Should Happen:**
1. ✅ **OAuth Flow**: Redirects to QuickBooks, then back to callback page
2. ✅ **Success Message**: Shows "Successfully Connected!" with company name
3. ✅ **Data Sync**: "Sync Now" button retrieves accounts, customers, transactions
4. ✅ **Financial Reports**: Report buttons show live QuickBooks data
5. ✅ **Entity Management**: Shows QuickBooks as "Connected" integration

### **Test These URLs After Setup:**
- **Integration Page**: https://app.activebackoffice.com/dashboard/integrations/quickbooks
- **Entity Management**: https://app.activebackoffice.com/dashboard/platform/entities
- **Financial Reports**: Click the report buttons on the integration page

---

## 🔧 **QuickBooks Developer App Configuration**

### **Make sure your QuickBooks app has:**
- **App Name**: Active Back Office (or your preference)
- **Redirect URIs**:
  - `https://app.activebackoffice.com/dashboard/integrations/quickbooks/callback`
  - `http://localhost:3000/dashboard/integrations/quickbooks/callback` (for local dev)
- **Scope**: `com.intuit.quickbooks.accounting`
- **Status**: Published/Active

---

## 🐛 **Common Issues & Solutions**

### **"Redirect URI Mismatch"**
- **Fix**: Ensure exact URI match in QuickBooks Developer Dashboard
- **Check**: No trailing slashes, correct HTTPS vs HTTP

### **"Invalid Client" Error**
- **Fix**: Double-check Client ID and Secret (no extra spaces)
- **Verify**: Copy-paste directly from QuickBooks Developer Dashboard

### **Environment Variables Not Working**
- **Local**: Restart dev server after updating `.env.local`
- **Vercel**: Wait 1-2 minutes after updating environment variables

---

## 📞 **Need Help?**

### **Send me these details if you have issues:**
1. **Error messages** from browser console
2. **Screenshots** of any error pages
3. **Confirmation** that you've updated both local and Vercel credentials
4. **Your QuickBooks app configuration** (hide the secret)

---

## 🎉 **After Successful Setup**

Once everything is working, you'll have:
- ✅ **Live QuickBooks OAuth** integration
- ✅ **Real-time data syncing** from your QuickBooks company
- ✅ **Financial reports** with live data (P&L, Balance Sheet, Cash Flow)
- ✅ **Entity management** showing integration status
- ✅ **Production-ready** QuickBooks integration

---

## 📋 **Quick Checklist**

- [ ] Updated `activeoffice-portal/.env.local` with my credentials
- [ ] Added environment variables to Vercel dashboard
- [ ] Configured QuickBooks app with correct redirect URIs
- [ ] Tested local OAuth flow successfully
- [ ] Tested production OAuth flow successfully
- [ ] Verified data sync retrieves live QuickBooks data
- [ ] Confirmed financial reports show live data
- [ ] Entity management shows "Connected" status

---

**🚀 Ready to go live with QuickBooks integration!**

*Just add your credentials and test - everything else is already built and deployed!*
