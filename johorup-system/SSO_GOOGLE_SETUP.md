# 🔐 Setup Google SSO untuk Sistem JohorUP

## 📋 Mengapa Google SSO?

### **Kelebihan Google SSO**
- ✅ **Mudah untuk users** - Login dengan Google account
- ✅ **Secure** - Google handle authentication
- ✅ **No password management** - Kurang masalah password
- ✅ **Audit trail** - Google provides login logs
- ✅ **Mobile friendly** - Works seamlessly di mobile
- ✅ **Free** - Google OAuth adalah percuma

### **Perfect untuk Government**
- ✅ **JPNJ staff** sudah ada Google Workspace
- ✅ **Teachers** kebanyakan guna Gmail
- ✅ **Centralized control** - Admin boleh manage access
- ✅ **Compliance** - Memenuhi security requirements

## 🚀 Setup Google OAuth

### **Langkah 1: Setup Google Cloud Project**

#### A. Create Google Cloud Project
1. Pergi ke https://console.cloud.google.com
2. Click "New Project"
3. Project name: "JohorUP System"
4. Organization: "JPNJ" (if available)
5. Click "Create"

#### B. Enable Google OAuth API
1. Go to "APIs & Services" > "Library"
2. Search "Google+ API" dan enable
3. Search "People API" dan enable
4. Search "Gmail API" dan enable (optional)

#### C. Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" (unless you have Google Workspace)
3. Fill in details:
   ```
   App name: Sistem JohorUP
   User support email: admin@jpnj.gov.my
   Developer contact: admin@jpnj.gov.my
   App domain: https://johorup.jpnj.gov.my
   Authorized domains: jpnj.gov.my
   ```

#### D. Create OAuth Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Application type: "Web application"
4. Name: "JohorUP Web Client"
5. Authorized redirect URIs:
   ```
   https://johorup.jpnj.gov.my/api/auth/callback/google
   https://your-site.netlify.app/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google (for development)
   ```
6. Save dan copy Client ID & Client Secret

### **Langkah 2: Install NextAuth.js dengan Google Provider**

#### A. Install Dependencies
```bash
npm install next-auth @next-auth/prisma-adapter
npm install @auth/pg-adapter  # For PostgreSQL (Neon)
```

#### B. Create NextAuth Configuration
```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PostgresAdapter } from '@auth/pg-adapter'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(pool),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          hd: 'jpnj.gov.my' // Restrict to JPNJ domain only (optional)
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Check if user email is allowed
      const allowedDomains = ['jpnj.gov.my', 'jcorp.com.my', 'gmail.com']
      const emailDomain = user.email?.split('@')[1]
      
      if (!allowedDomains.includes(emailDomain || '')) {
        return false // Reject login
      }
      
      // Check if user exists in our database
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [user.email]
      )
      
      if (existingUser.rows.length === 0) {
        // Auto-create user for JPNJ domain
        if (emailDomain === 'jpnj.gov.my') {
          await pool.query(`
            INSERT INTO users (email, name, role, created_at)
            VALUES ($1, $2, $3, NOW())
          `, [user.email, user.name, 'school']) // Default role
        } else {
          return false // Reject if not JPNJ and not in database
        }
      }
      
      return true
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        // Get user role from database
        const dbUser = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [user.email]
        )
        
        if (dbUser.rows.length > 0) {
          token.role = dbUser.rows[0].role
          token.school_id = dbUser.rows[0].school_id
          token.ppd_id = dbUser.rows[0].ppd_id
          token.user_id = dbUser.rows[0].id
        }
      }
      return token
    },
    
    async session({ session, token }) {
      // Add custom fields to session
      session.user.role = token.role as string
      session.user.school_id = token.school_id as number
      session.user.ppd_id = token.ppd_id as number
      session.user.user_id = token.user_id as number
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt'
  }
})
```

### **Langkah 3: Create Database Tables untuk NextAuth**

```sql
-- Add to your Neon database
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Add indexes
CREATE INDEX idx_accounts_user_id ON accounts("userId");
CREATE INDEX idx_sessions_user_id ON sessions("userId");
CREATE INDEX idx_sessions_session_token ON sessions("sessionToken");

-- Add foreign keys
ALTER TABLE accounts ADD CONSTRAINT fk_accounts_user_id 
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
  
ALTER TABLE sessions ADD CONSTRAINT fk_sessions_user_id 
  FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;
```

### **Langkah 4: Update Login Page**

```typescript
// app/login/page.tsx
'use client'

import { signIn, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if already logged in
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: true 
      })
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
    }
  }

  const handleManualLogin = () => {
    router.push('/login/manual') // Fallback manual login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">J</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sistem JohorUP</h1>
          <p className="text-gray-600 mt-2">Program Tuisyen Intensif SPM 2026</p>
        </div>

        {/* Google SSO Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors mb-4"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          ) : (
            <>
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Masuk dengan Google
            </>
          )}
        </button>

        {/* Manual Login Option */}
        <div className="text-center">
          <button
            onClick={handleManualLogin}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Atau masuk dengan email/password
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Untuk Staff JPNJ:</strong> Guna Google account JPNJ anda
          </p>
          <p className="text-sm text-blue-600 mt-1">
            <strong>Untuk Sekolah:</strong> Hubungi admin untuk setup account
          </p>
        </div>
      </div>
    </div>
  )
}
```

### **Langkah 5: Create API Routes**

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
```

### **Langkah 6: Update Environment Variables**

```env
# Add to .env.production
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://johorup.jpnj.gov.my"

# Optional: Restrict to specific domain
GOOGLE_HD="jpnj.gov.my"  # Only allow JPNJ emails
```

### **Langkah 7: Create Session Provider**

```typescript
// app/providers.tsx
'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

```typescript
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ms">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

### **Langkah 8: Protect Routes dengan Middleware**

```typescript
// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  
  // Public routes
  if (pathname === '/' || pathname === '/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }
  
  // Protected routes
  if (pathname.startsWith('/dashboard')) {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
```

## 🎯 **User Management Strategy**

### **Auto-Registration untuk JPNJ Staff**
```typescript
// Dalam signIn callback
if (emailDomain === 'jpnj.gov.my') {
  // Auto-create dengan role default
  const role = email.includes('admin') ? 'sektor_perancangan' : 'school'
  await createUser(email, name, role)
}
```

### **Manual Approval untuk Others**
```typescript
// Untuk non-JPNJ emails
if (emailDomain !== 'jpnj.gov.my') {
  // Create pending user
  await createPendingUser(email, name)
  // Send notification to admin
  await notifyAdmin(email, name)
  return '/auth/pending-approval'
}
```

## 🔐 **Security Best Practices**

### **Domain Restriction**
```typescript
// Restrict to specific domains
const allowedDomains = [
  'jpnj.gov.my',      // JPNJ staff
  'jcorp.com.my',     // Yayasan JCorp
  'gmail.com'         // Teachers (with manual approval)
]
```

### **Role-based Access**
```typescript
// Check user role in each protected route
export async function checkAccess(email: string, requiredRole: string) {
  const user = await getUserByEmail(email)
  return user?.role === requiredRole || user?.role === 'admin'
}
```

## 📱 **Mobile Experience**

Google SSO works seamlessly di mobile:
- ✅ Native Google app integration
- ✅ Biometric authentication (if enabled)
- ✅ Single tap login
- ✅ Automatic session management

## 🎉 **Benefits untuk JohorUP**

### **For Users**
- ✅ **No password to remember**
- ✅ **Fast login** (1 click)
- ✅ **Secure** (Google security)
- ✅ **Mobile friendly**

### **For Admins**
- ✅ **Centralized user management**
- ✅ **Audit logs** dari Google
- ✅ **Easy onboarding** untuk JPNJ staff
- ✅ **Reduced support** (no password resets)

### **For IT Department**
- ✅ **No password policy management**
- ✅ **SSO compliance**
- ✅ **Integration dengan Google Workspace**
- ✅ **Reduced security risks**

## 🚀 **Implementation Steps**

1. **Setup Google Cloud Project** (10 minit)
2. **Install NextAuth dependencies** (5 minit)
3. **Update database schema** (5 minit)
4. **Configure authentication** (15 minit)
5. **Update login page** (10 minit)
6. **Test SSO flow** (5 minit)

**Total time**: ~50 minit untuk complete SSO setup!

Adakah anda nak saya implement Google SSO untuk sistem JohorUP? 🚀