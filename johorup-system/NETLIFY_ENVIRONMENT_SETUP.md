# 🔧 Netlify Environment Variables Setup

## ✅ Deployment Status
- **Site URL**: https://johorup.netlify.app
- **Build Status**: ✅ Successful
- **API Routes**: ✅ Configured
- **Functions**: ✅ Deployed

## 🗄️ Next Step: Database Configuration

### 1. Create Neon Database
1. Go to [console.neon.tech](https://console.neon.tech)
2. Create new project: "johorup-production"
3. Select region: **Asia Pacific (Singapore)**
4. Copy the connection string (format: `postgresql://username:password@host/database?sslmode=require`)

### 2. Set Environment Variables in Netlify
Go to [Netlify Dashboard](https://app.netlify.com/projects/johorup) → Site Settings → Environment Variables

**Required Variables:**
```bash
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://johorup.netlify.app
NEXTAUTH_SECRET=your-32-character-secret-key-here
JWT_SECRET=your-jwt-secret-key-minimum-32-characters
ENCRYPTION_KEY=your-32-character-encryption-key-here
SESSION_SECRET=your-session-secret-key-here
```

**Generate Secure Keys:**
```bash
# Generate 32-character secrets (run these commands)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Initialize Database
After setting the DATABASE_URL in Netlify:

```bash
# Set your Neon connection string
export DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# Run database setup
cd johorup-system
node scripts/setup-neon-database.js
```

### 4. Redeploy Site
After setting environment variables:
```bash
netlify deploy --prod
```

## 🧪 Testing Production System

### Test Authentication
1. Go to https://johorup.netlify.app/login
2. Try these demo credentials:

**Super Admin:**
- Email: `admin@s4pd.gov.my`
- Password: `admin123`

**SPB Admin:**
- Email: `spb.admin@jpnj.gov.my`
- Password: `spb123`

**Yayasan JCorp (Bilingual):**
- Email: `strategic@jcorp.com.my`
- Password: `jcorp123`

### Test Database Features
1. **User Management**: `/dashboard/admin/user-management`
2. **Audit Trail**: `/dashboard/admin/audit-trail`
3. **Role-Based Access**: Test different user roles
4. **Bilingual Support**: Test language toggle for Yayasan roles

## 🔍 Monitoring & Debugging

### Check Deployment Logs
- **Build Logs**: https://app.netlify.com/projects/johorup/deploys
- **Function Logs**: https://app.netlify.com/projects/johorup/logs/functions
- **Edge Function Logs**: https://app.netlify.com/projects/johorup/logs/edge-functions

### Common Issues & Solutions

#### Database Connection Errors
```bash
# Test connection locally
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()', (err, res) => {
  console.log(err ? err : res.rows[0]);
  pool.end();
});
"
```

#### Environment Variable Issues
1. Check all variables are set in Netlify dashboard
2. Verify no typos in variable names
3. Ensure secrets are properly generated (32 characters)
4. Redeploy after setting variables

#### API Route Issues
1. Check function logs in Netlify dashboard
2. Verify database connection string format
3. Test API endpoints directly: `/api/auth`, `/api/users`

## 📊 Production Readiness Checklist

### ✅ Completed
- [x] Code deployed successfully
- [x] Build completed without errors
- [x] API routes configured
- [x] Functions deployed
- [x] Static pages generated (46/46)
- [x] Edge functions configured

### ⏳ Pending (Next Steps)
- [ ] Database connection configured
- [ ] Environment variables set
- [ ] Database schema initialized
- [ ] Demo users created
- [ ] Authentication tested
- [ ] All user roles verified

## 🚀 Final Steps Summary

1. **Create Neon Database** → Get connection string
2. **Set Environment Variables** → In Netlify dashboard
3. **Initialize Database** → Run setup script
4. **Redeploy Site** → `netlify deploy --prod`
5. **Test System** → Login and verify features

**Current Status**: 🟡 Deployed, awaiting database configuration  
**Next Action**: Set up Neon database and environment variables