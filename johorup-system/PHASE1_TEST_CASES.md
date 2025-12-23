# 🧪 Phase 1: Test Cases untuk MOE Domain SSO

## 📋 Test Case Overview

### **Test Categories**
1. **Authentication Tests** - Google OAuth dan manual login
2. **Role Mapping Tests** - Domain-based role assignment
3. **Security Tests** - Unauthorized access prevention
4. **User Experience Tests** - Login flow dan navigation
5. **Database Tests** - User creation dan data integrity

## 🔐 **Category 1: Authentication Tests**

### **TC-AUTH-001: Google OAuth Setup**
```
Objective: Verify Google OAuth configuration
Steps:
1. Navigate to http://localhost:3000/login
2. Click "Masuk dengan Google" button
3. Verify Google consent screen appears
4. Check redirect URI is correct

Expected Result:
✅ Google consent screen loads without errors
✅ Redirect URI matches localhost:3000/api/auth/callback/google
✅ App name shows "JohorUP System (Testing)"

Pass/Fail: ___
Notes: _______________
```

### **TC-AUTH-002: Manual Login Fallback**
```
Objective: Verify manual login works as fallback
Steps:
1. Navigate to http://localhost:3000/login
2. Click "Masuk dengan email/password"
3. Enter: admin@jpnj.gov.my / AdminPass123!
4. Click "Log Masuk"

Expected Result:
✅ Login form appears
✅ Credentials are accepted
✅ Redirect to dashboard occurs
✅ Session is created properly

Pass/Fail: ___
Notes: _______________
```

### **TC-AUTH-003: Logout Functionality**
```
Objective: Verify logout clears session
Steps:
1. Login with any method
2. Navigate to dashboard
3. Click logout button
4. Verify redirect to login page

Expected Result:
✅ Session is cleared
✅ Redirect to login page
✅ Cannot access protected routes
✅ Login page shows correctly

Pass/Fail: ___
Notes: _______________
```

## 🏫 **Category 2: Role Mapping Tests**

### **TC-ROLE-001: Sekolah User - SMK TJJ**
```
Test Account: sekolah.test.smktjj@gmail.com
Objective: Verify sekolah role assignment

Steps:
1. Login with Google using test account
2. Complete OAuth flow
3. Check user creation in database
4. Verify dashboard access

Expected Result:
✅ User auto-created with role: 'school'
✅ school_id: 1 (SMK Taman Johor Jaya)
✅ ppd_id: null
✅ Redirect to school dashboard
✅ Can access school-specific features only

Database Check:
SELECT * FROM users WHERE email = 'sekolah.test.smktjj@gmail.com';
Expected: role='school', school_id=1, ppd_id=null

Pass/Fail: ___
Notes: _______________
```

### **TC-ROLE-002: Sekolah User - SMK BBUDA**
```
Test Account: sekolah.test.smkbbuda@gmail.com
Objective: Verify different school assignment

Steps:
1. Login with Google using test account
2. Complete OAuth flow
3. Check user creation in database
4. Verify correct school assignment

Expected Result:
✅ User auto-created with role: 'school'
✅ school_id: 2 (SMK Bandar Baru UDA)
✅ ppd_id: null
✅ Access to school 2 data only

Database Check:
SELECT * FROM users WHERE email = 'sekolah.test.smkbbuda@gmail.com';
Expected: role='school', school_id=2, ppd_id=null

Pass/Fail: ___
Notes: _______________
```

### **TC-ROLE-003: PPD User - Johor Bahru**
```
Test Account: ppd.test.jb@gmail.com
Objective: Verify PPD role assignment

Steps:
1. Login with Google using test account
2. Complete OAuth flow
3. Check user creation in database
4. Verify PPD dashboard access

Expected Result:
✅ User auto-created with role: 'ppd'
✅ school_id: null
✅ ppd_id: 1 (PPD Johor Bahru)
✅ Redirect to PPD dashboard
✅ Can see schools under PPD JB only

Database Check:
SELECT * FROM users WHERE email = 'ppd.test.jb@gmail.com';
Expected: role='ppd', school_id=null, ppd_id=1

Pass/Fail: ___
Notes: _______________
```

### **TC-ROLE-004: PPD User - Muar**
```
Test Account: ppd.test.muar@gmail.com
Objective: Verify different PPD assignment

Steps:
1. Login with Google using test account
2. Complete OAuth flow
3. Check user creation in database
4. Verify correct PPD assignment

Expected Result:
✅ User auto-created with role: 'ppd'
✅ school_id: null
✅ ppd_id: 2 (PPD Muar)
✅ Access to Muar schools only

Database Check:
SELECT * FROM users WHERE email = 'ppd.test.muar@gmail.com';
Expected: role='ppd', school_id=null, ppd_id=2

Pass/Fail: ___
Notes: _______________
```

### **TC-ROLE-005: Jabatan User - Koordinator**
```
Test Account: jabatan.test.koordinator@gmail.com
Objective: Verify jabatan koordinator role

Steps:
1. Login with Google using test account
2. Complete OAuth flow
3. Check user creation in database
4. Verify admin dashboard access

Expected Result:
✅ User auto-created with role: 'sektor_perancangan'
✅ school_id: null
✅ ppd_id: null
✅ Redirect to admin dashboard
✅ Full system access available

Database Check:
SELECT * FROM users WHERE email = 'jabatan.test.koordinator@gmail.com';
Expected: role='sektor_perancangan', school_id=null, ppd_id=null

Pass/Fail: ___
Notes: _______________
```

### **TC-ROLE-006: Jabatan User - Pembelajaran**
```
Test Account: pembelajaran.test.jpnj@gmail.com
Objective: Verify jabatan pembelajaran role

Steps:
1. Login with Google using test account
2. Complete OAuth flow
3. Check user creation in database
4. Verify academic dashboard access

Expected Result:
✅ User auto-created with role: 'sektor_pembelajaran'
✅ school_id: null
✅ ppd_id: null
✅ Access to academic features

Database Check:
SELECT * FROM users WHERE email = 'pembelajaran.test.jpnj@gmail.com';
Expected: role='sektor_pembelajaran', school_id=null, ppd_id=null

Pass/Fail: ___
Notes: _______________
```

### **TC-ROLE-007: Yayasan JCorp User**
```
Test Account: yayasan.test@gmail.com
Objective: Verify yayasan role assignment

Steps:
1. Login with Google using test account
2. Complete OAuth flow
3. Check user creation in database
4. Verify yayasan dashboard access

Expected Result:
✅ User auto-created with role: 'yayasan_jcorp'
✅ school_id: null
✅ ppd_id: null
✅ Redirect to yayasan overview
✅ Investment tracking access

Database Check:
SELECT * FROM users WHERE email = 'yayasan.test@gmail.com';
Expected: role='yayasan_jcorp', school_id=null, ppd_id=null

Pass/Fail: ___
Notes: _______________
```

## 🚫 **Category 3: Security Tests**

### **TC-SEC-001: Unauthorized Domain Rejection**
```
Test Account: unauthorized.test@yahoo.com
Objective: Verify unauthorized domains are rejected

Steps:
1. Login with Google using unauthorized account
2. Complete OAuth flow
3. Check system response
4. Verify no access granted

Expected Result:
✅ Login is rejected OR redirected to pending approval
✅ No user created with active role
✅ Clear error message shown
✅ Cannot access any protected routes

Database Check:
SELECT * FROM users WHERE email = 'unauthorized.test@yahoo.com';
Expected: role='pending_approval' OR no record

Pass/Fail: ___
Notes: _______________
```

### **TC-SEC-002: Route Protection - School User**
```
Test Account: sekolah.test.smktjj@gmail.com
Objective: Verify school users cannot access admin routes

Steps:
1. Login as school user
2. Try to access /dashboard/admin
3. Try to access /dashboard/ppd
4. Try to access /dashboard/yayasan-overview

Expected Result:
✅ Redirect to appropriate dashboard
✅ Cannot access admin routes
✅ Cannot access PPD routes
✅ Cannot access yayasan routes
✅ Can access school routes only

Pass/Fail: ___
Notes: _______________
```

### **TC-SEC-003: Route Protection - PPD User**
```
Test Account: ppd.test.jb@gmail.com
Objective: Verify PPD users have correct access

Steps:
1. Login as PPD user
2. Try to access /dashboard/admin
3. Try to access /dashboard/school
4. Verify access to PPD features

Expected Result:
✅ Cannot access admin routes
✅ Cannot access school-specific routes
✅ Can access PPD dashboard
✅ Can see schools under their PPD only

Pass/Fail: ___
Notes: _______________
```

### **TC-SEC-004: Session Security**
```
Objective: Verify session handling is secure

Steps:
1. Login with any account
2. Check browser cookies
3. Verify JWT token structure
4. Test session expiration

Expected Result:
✅ Secure cookies are set
✅ JWT contains correct user data
✅ Session expires after 24 hours
✅ No sensitive data in client-side storage

Pass/Fail: ___
Notes: _______________
```

## 👤 **Category 4: User Experience Tests**

### **TC-UX-001: Login Page Design**
```
Objective: Verify login page user experience

Steps:
1. Navigate to /login
2. Check page layout and design
3. Test responsive design
4. Verify all elements work

Expected Result:
✅ Professional government-appropriate design
✅ Google SSO button is prominent
✅ Manual login option available
✅ Clear domain information shown
✅ Mobile responsive layout

Pass/Fail: ___
Notes: _______________
```

### **TC-UX-002: Dashboard Navigation**
```
Objective: Verify role-based navigation

Steps:
1. Login as different user types
2. Check navigation menus
3. Verify role-appropriate options
4. Test menu functionality

Expected Result:
✅ School users see school menu only
✅ PPD users see PPD menu options
✅ Admin users see full menu
✅ Yayasan users see investment menu
✅ Navigation is intuitive

Pass/Fail: ___
Notes: _______________
```

### **TC-UX-003: Error Handling**
```
Objective: Verify error messages are user-friendly

Steps:
1. Try invalid login credentials
2. Try accessing unauthorized routes
3. Test network error scenarios
4. Check error message clarity

Expected Result:
✅ Clear, helpful error messages
✅ No technical jargon exposed
✅ Appropriate error pages
✅ Recovery options provided

Pass/Fail: ___
Notes: _______________
```

## 🗄️ **Category 5: Database Tests**

### **TC-DB-001: User Creation**
```
Objective: Verify users are created correctly

Steps:
1. Login with new test account
2. Check database record
3. Verify all fields are populated
4. Check timestamps

Expected Result:
✅ User record created in users table
✅ All required fields populated
✅ Correct role assignment
✅ created_at and updated_at set
✅ No duplicate records

SQL Check:
SELECT * FROM users WHERE email = '[test-email]';

Pass/Fail: ___
Notes: _______________
```

### **TC-DB-002: Role Relationships**
```
Objective: Verify school/PPD relationships work

Steps:
1. Login as school user
2. Check school_id assignment
3. Verify school exists in schools table
4. Check PPD relationship

Expected Result:
✅ school_id references valid school
✅ School record exists
✅ PPD relationship is correct
✅ Foreign key constraints work

SQL Check:
SELECT u.*, s.name as school_name, p.name as ppd_name 
FROM users u 
LEFT JOIN schools s ON u.school_id = s.id 
LEFT JOIN ppds p ON s.ppd_id = p.id 
WHERE u.email = '[test-email]';

Pass/Fail: ___
Notes: _______________
```

### **TC-DB-003: Pending Users**
```
Objective: Verify pending approval system

Steps:
1. Login with unauthorized domain
2. Check pending user creation
3. Verify admin can see pending users
4. Test approval workflow

Expected Result:
✅ Pending user created with role 'pending_approval'
✅ Admin can see in user management
✅ Approval changes role correctly
✅ User can login after approval

Pass/Fail: ___
Notes: _______________
```

## 📊 **Test Execution Summary**

### **Test Results Overview**
```
Authentication Tests:    ___/3 passed
Role Mapping Tests:      ___/7 passed
Security Tests:          ___/4 passed
User Experience Tests:   ___/3 passed
Database Tests:          ___/3 passed

Total:                   ___/20 passed
Success Rate:            ___%
```

### **Critical Issues Found**
```
1. [Issue Description]
   Severity: High/Medium/Low
   Impact: [Description]
   Steps to Reproduce: [Steps]

2. [Issue Description]
   Severity: High/Medium/Low
   Impact: [Description]
   Steps to Reproduce: [Steps]
```

### **Recommendations**
```
1. [Recommendation for improvement]
2. [Recommendation for next phase]
3. [Recommendation for production readiness]
```

### **Phase 1 Status**
```
□ All critical tests passed
□ Security tests passed
□ Role mapping accurate
□ User experience acceptable
□ Database integrity confirmed

Overall Status: ✅ Ready for Phase 2 / ❌ Needs fixes / ⚠️ Needs minor adjustments
```

---

**Next Steps**: Based on test results, proceed to Phase 2 (staging deployment) or fix identified issues and re-test.