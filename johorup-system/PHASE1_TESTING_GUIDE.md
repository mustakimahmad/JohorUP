# 🧪 Phase 1: MOE Domain SSO Testing Guide

## 🎯 Testing Objectives

### **Primary Goals**
- ✅ Verify Google Cloud Project setup
- ✅ Test MOE domain authentication
- ✅ Validate role mapping accuracy
- ✅ Confirm security boundaries
- ✅ Test user experience flow

### **Success Criteria**
- All 3 MOE domains work correctly
- Role assignment is accurate
- Unauthorized domains are rejected
- Manual login fallback works
- Admin approval workflow functions

## 🚀 **Step 1: Google Cloud Project Setup**

### **A. Create Google Cloud Project**
```bash
# 1. Go to https://console.cloud.google.com
# 2. Create new project: "JohorUP-Testing"
# 3. Enable required APIs
```

### **B. Enable Required APIs**
```bash
# In Google Cloud Console:
# 1. Go to "APIs & Services" > "Library"
# 2. Enable these APIs:
#    - Google+ API
#    - People API
#    - Gmail API (optional)
```

### **C. Configure OAuth Consent Screen**
```
App name: JohorUP System (Testing)
User support email: admin@jpnj.gov.my
Developer contact: admin@jpnj.gov.my
App domain: http://localhost:3000
Authorized domains: 
  - localhost
  - netlify.app (for staging)
```

### **D. Create OAuth Credentials**
```
Application type: Web application
Name: JohorUP Testing Client
Authorized redirect URIs:
  - http://localhost:3000/api/auth/callback/google
  - https://your-staging.netlify.app/api/auth/callback/google
```

## 🧪 **Step 2: Local Testing Setup**

### **A. Install Dependencies**
```bash
cd johorup-system
npm install next-auth@beta pg @types/pg bcryptjs @types/bcryptjs
```

### **B. Create Test Environment**
```bash
# Copy environment template
cp .env.neon.example .env.local

# Update with test credentials
nano .env.local
```

### **C. Test Environment Variables**
```env
# .env.local - Testing Configuration
DATABASE_URL="postgresql://test_user:test_pass@localhost:5432/johorup_test"
DATABASE_SSL=false

# Google OAuth (Testing)
GOOGLE_CLIENT_ID="your-test-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-test-client-secret"

# NextAuth
NEXTAUTH_SECRET="test-secret-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"

# Development flags
NODE_ENV=development
DEBUG=true
```

### **D. Setup Test Database**
```sql
-- Create test database (if using local PostgreSQL)
CREATE DATABASE johorup_test;

-- Or use Neon free tier for testing
-- Create new Neon project: "johorup-testing"
```

## 📧 **Step 3: Test Email Accounts**

### **A. Create Test Google Accounts**
Since we can't use real MOE domains for testing, create test accounts:

```
Test Accounts (use Gmail for testing):
1. sekolah.test.smktjj@gmail.com (simulate @moe-dl.edu.my)
2. ppd.test.jb@gmail.com (simulate @moe.gov.my)
3. jabatan.test.koordinator@gmail.com (simulate @moe.gov.my)
4. yayasan.test@gmail.com (simulate @jcorp.com.my)
5. unauthorized.test@yahoo.com (test rejection)
```

### **B. Update Auth Logic for Testing**
```typescript
// lib/auth-test.ts - Testing version
function determineRoleFromEmailTest(email: string) {
  const emailLower = email.toLowerCase()
  
  // TESTING PATTERNS (simulate MOE domains)
  if (emailLower.includes('sekolah.test') || emailLower.includes('smk')) {
    return determineSchoolRole(emailLower)
  }
  
  if (emailLower.includes('ppd.test')) {
    return determineGovRole(emailLower)
  }
  
  if (emailLower.includes('jabatan.test') || emailLower.includes('koordinator')) {
    return {
      role: 'sektor_perancangan',
      school_id: null,
      ppd_id: null
    }
  }
  
  if (emailLower.includes('yayasan.test')) {
    return {
      role: 'yayasan_jcorp',
      school_id: null,
      ppd_id: null
    }
  }
  
  // Unauthorized domain
  return {
    role: 'unauthorized',
    school_id: null,
    ppd_id: null
  }
}
```

## 🧪 **Step 4: Testing Scenarios**

### **Test Case 1: Sekolah User Login**
```
Email: sekolah.test.smktjj@gmail.com
Expected: role: 'school', school_id: 1
Flow:
1. Click "Masuk dengan Google"
2. Select test account
3. Should auto-create user
4. Redirect to school dashboard
5. Verify school_id = 1 in session
```

### **Test Case 2: PPD User Login**
```
Email: ppd.test.jb@gmail.com
Expected: role: 'ppd', ppd_id: 1
Flow:
1. Google login
2. Auto-create with PPD role
3. Redirect to PPD dashboard
4. Verify access to JB schools only
```

### **Test Case 3: Jabatan User Login**
```
Email: jabatan.test.koordinator@gmail.com
Expected: role: 'sektor_perancangan'
Flow:
1. Google login
2. Auto-create with admin role
3. Redirect to admin dashboard
4. Verify full system access
```

### **Test Case 4: Yayasan User Login**
```
Email: yayasan.test@gmail.com
Expected: role: 'yayasan_jcorp'
Flow:
1. Google login
2. Auto-create with yayasan role
3. Redirect to yayasan overview
4. Verify investment tracking access
```

### **Test Case 5: Unauthorized Domain**
```
Email: unauthorized.test@yahoo.com
Expected: Redirect to pending approval
Flow:
1. Google login
2. Domain validation fails
3. Create pending user
4. Redirect to pending approval page
5. Admin sees in user management
```

### **Test Case 6: Manual Login Fallback**
```
Credentials: admin@jpnj.gov.my / AdminPass123!
Expected: Successful login
Flow:
1. Click "Masuk dengan email/password"
2. Enter credentials
3. Successful authentication
4. Redirect to dashboard
```

## 🔧 **Step 5: Testing Commands**

### **A. Start Development Server**
```bash
# Terminal 1: Start Next.js
npm run dev

# Terminal 2: Watch logs
tail -f .next/trace
```

### **B. Test Database Connection**
```bash
# Test database connectivity
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()').then(console.log).catch(console.error);
"
```

### **C. Test Google OAuth**
```bash
# Verify environment variables
echo $GOOGLE_CLIENT_ID
echo $NEXTAUTH_URL

# Test OAuth endpoint
curl http://localhost:3000/api/auth/providers
```

## 📊 **Step 6: Testing Checklist**

### **Authentication Tests**
- [ ] Google OAuth consent screen loads
- [ ] Test accounts can authenticate
- [ ] JWT tokens are generated correctly
- [ ] Session data includes role information
- [ ] Logout functionality works

### **Role Mapping Tests**
- [ ] Sekolah emails → school role + correct school_id
- [ ] PPD emails → ppd role + correct ppd_id
- [ ] Jabatan emails → correct sektor role
- [ ] Yayasan emails → yayasan_jcorp role
- [ ] Unauthorized domains → pending approval

### **Security Tests**
- [ ] Unauthorized domains are rejected
- [ ] Role-based route protection works
- [ ] Session hijacking prevention
- [ ] CSRF protection enabled
- [ ] Secure cookie settings

### **User Experience Tests**
- [ ] Login page loads correctly
- [ ] Google button works
- [ ] Manual login fallback works
- [ ] Error messages are clear
- [ ] Mobile responsive design
- [ ] Loading states work

### **Database Tests**
- [ ] User creation works
- [ ] Role assignment is correct
- [ ] School/PPD associations work
- [ ] Pending users are created
- [ ] Admin approval workflow

## 🐛 **Step 7: Common Issues & Solutions**

### **Issue 1: OAuth Consent Screen Error**
```
Error: "This app isn't verified"
Solution: 
1. Add test users to OAuth consent screen
2. Use "Internal" app type if possible
3. Add localhost to authorized domains
```

### **Issue 2: Database Connection Failed**
```
Error: "Connection refused"
Solution:
1. Check DATABASE_URL format
2. Verify database is running
3. Check SSL settings (false for local)
```

### **Issue 3: Role Mapping Not Working**
```
Error: Users get wrong roles
Solution:
1. Check email pattern matching
2. Verify determineRoleFromEmail logic
3. Add console.log for debugging
```

### **Issue 4: Redirect URI Mismatch**
```
Error: "redirect_uri_mismatch"
Solution:
1. Check Google Cloud Console URIs
2. Verify NEXTAUTH_URL setting
3. Ensure exact URL match
```

## 📈 **Step 8: Testing Metrics**

### **Performance Metrics**
- Login time: < 3 seconds
- Role detection: < 1 second
- Database queries: < 500ms
- Page load: < 2 seconds

### **Success Metrics**
- Authentication success rate: > 95%
- Role mapping accuracy: 100%
- Security rejection rate: 100% for unauthorized
- User experience rating: Positive feedback

## 📋 **Step 9: Test Report Template**

```markdown
# Phase 1 Testing Report

## Test Environment
- Date: [Date]
- Tester: [Name]
- Environment: Local/Staging
- Browser: [Browser version]

## Test Results
### Authentication (Pass/Fail)
- [ ] Google OAuth setup
- [ ] Test account login
- [ ] Manual login fallback
- [ ] Logout functionality

### Role Mapping (Pass/Fail)
- [ ] Sekolah role assignment
- [ ] PPD role assignment  
- [ ] Jabatan role assignment
- [ ] Yayasan role assignment
- [ ] Unauthorized rejection

### Security (Pass/Fail)
- [ ] Domain validation
- [ ] Route protection
- [ ] Session security
- [ ] CSRF protection

### User Experience (Pass/Fail)
- [ ] Login flow
- [ ] Error handling
- [ ] Mobile responsive
- [ ] Loading states

## Issues Found
1. [Issue description]
   - Severity: High/Medium/Low
   - Steps to reproduce
   - Expected vs actual behavior

## Recommendations
1. [Recommendation]
2. [Recommendation]

## Overall Status: ✅ Ready for Phase 2 / ❌ Needs fixes
```

## 🚀 **Next Steps After Phase 1**

### **If Tests Pass**
1. Document successful configurations
2. Prepare staging environment
3. Coordinate with MOE IT for real domains
4. Plan Phase 2 implementation

### **If Tests Fail**
1. Fix identified issues
2. Re-run failed test cases
3. Update documentation
4. Schedule re-testing

---

**Ready to start Phase 1 testing? Let's get the Google Cloud Project setup first!** 🧪