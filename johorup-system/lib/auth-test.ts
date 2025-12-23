import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
})

// Testing version - Helper function to determine role from email pattern with test domains
function determineRoleFromEmailTest(email: string) {
  const emailLower = email.toLowerCase()
  
  console.log(`🧪 Testing role detection for: ${emailLower}`)
  
  // TESTING PATTERNS (simulate MOE domains with Gmail accounts)
  
  // 1. SEKOLAH SIMULATION (@gmail.com with sekolah.test pattern)
  if (emailLower.includes('sekolah.test') || emailLower.includes('smk.test')) {
    return determineSchoolRoleTest(emailLower)
  }
  
  // 2. PPD SIMULATION (@gmail.com with ppd.test pattern)
  if (emailLower.includes('ppd.test')) {
    return determineGovRoleTest(emailLower)
  }
  
  // 3. JABATAN SIMULATION (@gmail.com with jabatan.test pattern)
  if (emailLower.includes('jabatan.test') || emailLower.includes('koordinator.test')) {
    return {
      role: 'sektor_perancangan',
      school_id: null,
      ppd_id: null
    }
  }
  
  if (emailLower.includes('pembelajaran.test')) {
    return {
      role: 'sektor_pembelajaran',
      school_id: null,
      ppd_id: null
    }
  }
  
  // 4. YAYASAN SIMULATION (@gmail.com with yayasan.test pattern)
  if (emailLower.includes('yayasan.test')) {
    return {
      role: 'yayasan_jcorp',
      school_id: null,
      ppd_id: null
    }
  }
  
  // 5. PRODUCTION MOE DOMAINS (for future real testing)
  const domain = emailLower.split('@')[1]
  
  if (domain === 'moe-dl.edu.my') {
    return determineSchoolRole(emailLower)
  }
  
  if (domain === 'moe.gov.my') {
    return determineGovRole(emailLower)
  }
  
  if (domain === 'jcorp.com.my') {
    return {
      role: 'yayasan_jcorp',
      school_id: null,
      ppd_id: null
    }
  }
  
  // 6. UNAUTHORIZED DOMAIN
  console.log(`🚫 Unauthorized domain detected: ${domain}`)
  return {
    role: 'unauthorized',
    school_id: null,
    ppd_id: null
  }
}

function determineSchoolRoleTest(email: string) {
  console.log(`🏫 Determining school role for: ${email}`)
  
  let schoolId = null
  
  // Test patterns
  if (email.includes('smktjj') || email.includes('taman.johor.jaya')) {
    schoolId = 1 // SMK Taman Johor Jaya
  } else if (email.includes('smkbbuda') || email.includes('bandar.baru.uda')) {
    schoolId = 2 // SMK Bandar Baru UDA
  } else if (email.includes('smktu') || email.includes('taman.universiti')) {
    schoolId = 3 // SMK Taman Universiti
  } else {
    // Default for testing
    schoolId = 1
  }
  
  console.log(`✅ School role assigned: school_id = ${schoolId}`)
  
  return {
    role: 'school',
    school_id: schoolId,
    ppd_id: null
  }
}

function determineGovRoleTest(email: string) {
  console.log(`🏛️ Determining government role for: ${email}`)
  
  let ppdId = null
  
  // Test patterns
  if (email.includes('jb') || email.includes('johor.bahru')) {
    ppdId = 1 // PPD Johor Bahru
  } else if (email.includes('muar')) {
    ppdId = 2 // PPD Muar
  } else if (email.includes('bp') || email.includes('batu.pahat')) {
    ppdId = 3 // PPD Batu Pahat
  } else {
    // Default for testing
    ppdId = 1
  }
  
  console.log(`✅ PPD role assigned: ppd_id = ${ppdId}`)
  
  return {
    role: 'ppd',
    school_id: null,
    ppd_id: ppdId
  }
}

// Production functions (same as main auth.ts)
function determineSchoolRole(email: string) {
  let schoolId = null
  
  if (email.includes('smktjj') || email.includes('taman.johor.jaya')) {
    schoolId = 1
  } else if (email.includes('smkbbuda') || email.includes('bandar.baru.uda')) {
    schoolId = 2
  } else if (email.includes('smktu') || email.includes('taman.universiti')) {
    schoolId = 3
  } else if (email.includes('smkskudai') || email.includes('skudai')) {
    schoolId = 4
  } else if (email.includes('smkkulai') || email.includes('kulai')) {
    schoolId = 5
  } else {
    const schoolMatch = email.match(/smk(\d+)|sekolah(\d+)/)
    if (schoolMatch) {
      const extractedId = parseInt(schoolMatch[1] || schoolMatch[2])
      if (extractedId >= 1 && extractedId <= 20) {
        schoolId = extractedId
      }
    }
  }
  
  return {
    role: 'school',
    school_id: schoolId || 1,
    ppd_id: null
  }
}

function determineGovRole(email: string) {
  if (email.includes('ppd')) {
    let ppdId = null
    
    if (email.includes('jb') || email.includes('johor.bahru')) {
      ppdId = 1
    } else if (email.includes('muar')) {
      ppdId = 2
    } else if (email.includes('bp') || email.includes('batu.pahat')) {
      ppdId = 3
    }
    
    return {
      role: 'ppd',
      school_id: null,
      ppd_id: ppdId || 1
    }
  }
  
  if (email.includes('jpnj') || email.includes('jabatan')) {
    if (email.includes('koordinator') || email.includes('admin')) {
      return {
        role: 'sektor_perancangan',
        school_id: null,
        ppd_id: null
      }
    }
    
    if (email.includes('pembelajaran') || email.includes('kurikulum')) {
      return {
        role: 'sektor_pembelajaran',
        school_id: null,
        ppd_id: null
      }
    }
    
    return {
      role: 'sektor_perancangan',
      school_id: null,
      ppd_id: null
    }
  }
  
  return {
    role: 'ppd',
    school_id: null,
    ppd_id: 1
  }
}

// Helper function to check pre-registered users
async function getUserRoleFromDatabase(email: string) {
  try {
    const result = await pool.query(`
      SELECT role, school_id, ppd_id 
      FROM users 
      WHERE email = $1
    `, [email])
    
    if (result.rows.length > 0) {
      const user = result.rows[0]
      console.log(`👤 Found existing user: ${email} with role: ${user.role}`)
      return {
        role: user.role,
        school_id: user.school_id,
        ppd_id: user.ppd_id,
        exists: true
      }
    }
    
    return null
  } catch (error) {
    console.error('Database lookup error:', error)
    return null
  }
}

// Helper function to create user with role
async function createUserWithRole(email: string, name: string, roleData: any) {
  try {
    const result = await pool.query(`
      INSERT INTO users (email, name, role, school_id, ppd_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, email, name, role, school_id, ppd_id
    `, [
      email,
      name,
      roleData.role,
      roleData.school_id,
      roleData.ppd_id
    ])
    
    console.log(`✅ Auto-created user: ${email} with role: ${roleData.role}`)
    return result.rows[0]
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

// Helper function to create pending user
async function createPendingUser(email: string, name: string) {
  try {
    const existing = await pool.query(`
      SELECT id FROM users WHERE email = $1 AND role = 'pending_approval'
    `, [email])
    
    if (existing.rows.length === 0) {
      await pool.query(`
        INSERT INTO users (email, name, role, created_at, updated_at)
        VALUES ($1, $2, 'pending_approval', NOW(), NOW())
      `, [email, name])
      
      console.log(`📋 Created pending user: ${email}`)
    }
  } catch (error) {
    console.error('Error creating pending user:', error)
  }
}

// Main role determination function for testing
async function determineUserRoleTest(email: string, name: string, profile?: any) {
  console.log(`🧪 Starting role determination for: ${email}`)
  
  // Step 1: Check if user already exists in database
  const existingUser = await getUserRoleFromDatabase(email)
  if (existingUser) {
    return existingUser
  }
  
  // Step 2: Testing domain validation
  const domain = email.toLowerCase().split('@')[1]
  const allowedTestDomains = ['gmail.com', 'moe-dl.edu.my', 'moe.gov.my', 'jcorp.com.my']
  
  // For testing, allow Gmail with specific patterns
  if (domain === 'gmail.com') {
    const hasTestPattern = email.includes('.test') || 
                          email.includes('sekolah.') || 
                          email.includes('ppd.') || 
                          email.includes('jabatan.') || 
                          email.includes('yayasan.')
    
    if (!hasTestPattern) {
      console.log(`🚫 Gmail account without test pattern: ${email}`)
      await createPendingUser(email, name)
      return { 
        role: 'unauthorized', 
        school_id: null, 
        ppd_id: null, 
        exists: false 
      }
    }
  } else if (!allowedTestDomains.includes(domain)) {
    console.log(`🚫 Unauthorized domain: ${domain}`)
    await createPendingUser(email, name)
    return { 
      role: 'unauthorized', 
      school_id: null, 
      ppd_id: null, 
      exists: false 
    }
  }
  
  // Step 3: Role detection
  const emailRole = determineRoleFromEmailTest(email)
  
  if (emailRole.role === 'unauthorized') {
    console.log(`⏳ Unauthorized, requires manual approval: ${email}`)
    await createPendingUser(email, name)
    return { 
      role: 'pending_approval', 
      school_id: null, 
      ppd_id: null, 
      exists: false 
    }
  }
  
  // Step 4: Auto-approve for valid patterns
  if (emailRole.role !== 'unknown') {
    await createUserWithRole(email, name, emailRole)
    console.log(`✅ Auto-approved user: ${email} with role: ${emailRole.role}`)
    return { ...emailRole, exists: false }
  }
  
  // Step 5: Manual approval for unclear patterns
  await createPendingUser(email, name)
  console.log(`⏳ User requires manual approval: ${email}`)
  return { 
    role: 'pending_approval', 
    school_id: null, 
    ppd_id: null, 
    exists: false 
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
        }
      }
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [credentials.email]
          )

          const user = result.rows[0]
          if (!user) {
            return null
          }

          // Check if user has password_hash (for manual accounts)
          if (user.password_hash) {
            const isValidPassword = await bcrypt.compare(
              credentials.password,
              user.password_hash
            )

            if (!isValidPassword) {
              return null
            }
          } else {
            // For demo purposes, accept AdminPass123! for any user without password_hash
            if (credentials.password !== 'AdminPass123!') {
              return null
            }
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            school_id: user.school_id,
            ppd_id: user.ppd_id
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          console.log(`🧪 Testing Google sign-in for: ${user.email}`)
          
          // Use testing role determination
          const roleData = await determineUserRoleTest(
            user.email!,
            user.name!,
            profile
          )
          
          // Reject if unauthorized
          if (roleData.role === 'unauthorized') {
            console.log(`🚫 Login rejected - unauthorized: ${user.email}`)
            return false
          }
          
          // Redirect to pending approval if needed
          if (roleData.role === 'pending_approval') {
            console.log(`⏳ Login redirected - pending approval: ${user.email}`)
            return '/auth/pending-approval'
          }
          
          // Allow login for approved roles
          console.log(`✅ Login approved for: ${user.email} with role: ${roleData.role}`)
          return true
          
        } catch (error) {
          console.error('Sign in error:', error)
          return false
        }
      }
      
      return true
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        try {
          // Get fresh user details from database
          const dbUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [user.email]
          )
          
          if (dbUser.rows.length > 0) {
            const userData = dbUser.rows[0]
            token.role = userData.role
            token.school_id = userData.school_id
            token.ppd_id = userData.ppd_id
            token.user_id = userData.id
            
            // Add school and PPD names for convenience
            if (userData.school_id) {
              const schoolResult = await pool.query(
                'SELECT name FROM schools WHERE id = $1',
                [userData.school_id]
              )
              token.school_name = schoolResult.rows[0]?.name
            }
            
            if (userData.ppd_id) {
              const ppdResult = await pool.query(
                'SELECT name FROM ppds WHERE id = $1',
                [userData.ppd_id]
              )
              token.ppd_name = ppdResult.rows[0]?.name
            }
          }
        } catch (error) {
          console.error('JWT callback error:', error)
        }
      }
      return token
    },
    
    async session({ session, token }) {
      // Add custom fields to session
      if (token) {
        session.user.role = token.role as string
        session.user.school_id = token.school_id as number
        session.user.ppd_id = token.ppd_id as number
        session.user.user_id = token.user_id as number
        session.user.school_name = token.school_name as string
        session.user.ppd_name = token.ppd_name as string
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  debug: process.env.NODE_ENV === 'development'
})

// Helper functions for external use
export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Authentication required')
  }
  return session.user
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth()
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Insufficient permissions')
  }
  return user
}