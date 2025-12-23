import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/johorup_demo',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
})

// Helper function to determine role from email pattern with MOE domains
function determineRoleFromEmail(email: string) {
  const emailLower = email.toLowerCase()
  const domain = emailLower.split('@')[1]
  
  // 1. SEKOLAH DOMAIN (@moe-dl.edu.my) - All users are school users
  if (domain === 'moe-dl.edu.my') {
    return determineSchoolRole(emailLower)
  }
  
  // 2. PPD & JABATAN DOMAIN (@moe.gov.my) - Government users
  if (domain === 'moe.gov.my') {
    return determineGovRole(emailLower)
  }
  
  // 3. YAYASAN JCORP DOMAIN (@jcorp.com.my)
  if (domain === 'jcorp.com.my') {
    return {
      role: 'yayasan_jcorp',
      school_id: null,
      ppd_id: null
    }
  }
  
  // 4. UNAUTHORIZED DOMAIN
  return {
    role: 'unauthorized',
    school_id: null,
    ppd_id: null
  }
}

function determineSchoolRole(email: string) {
  // All @moe-dl.edu.my users are school users
  let schoolId = null
  
  // Extract school identifier from email
  if (email.includes('smktjj') || email.includes('taman.johor.jaya')) {
    schoolId = 1 // SMK Taman Johor Jaya
  } else if (email.includes('smkbbuda') || email.includes('bandar.baru.uda')) {
    schoolId = 2 // SMK Bandar Baru UDA
  } else if (email.includes('smktu') || email.includes('taman.universiti')) {
    schoolId = 3 // SMK Taman Universiti
  } else if (email.includes('smkskudai') || email.includes('skudai')) {
    schoolId = 4 // SMK Skudai
  } else if (email.includes('smkkulai') || email.includes('kulai')) {
    schoolId = 5 // SMK Kulai
  } else if (email.includes('smksenai') || email.includes('senai')) {
    schoolId = 6 // SMK Senai
  } else if (email.includes('smkgp') || email.includes('gelang.patah')) {
    schoolId = 7 // SMK Gelang Patah
  } else if (email.includes('smknusajaya') || email.includes('nusajaya')) {
    schoolId = 8 // SMK Nusajaya
  } else if (email.includes('smkmuar') || email.includes('muar')) {
    schoolId = 9 // SMK Muar
  } else if (email.includes('smktangkak') || email.includes('tangkak')) {
    schoolId = 10 // SMK Tangkak
  } else if (email.includes('smksegamat') || email.includes('segamat')) {
    schoolId = 11 // SMK Segamat
  } else if (email.includes('smkpagoh') || email.includes('pagoh')) {
    schoolId = 12 // SMK Pagoh
  } else if (email.includes('smkbg') || email.includes('bukit.gambir')) {
    schoolId = 13 // SMK Bukit Gambir
  } else if (email.includes('smkledang') || email.includes('ledang')) {
    schoolId = 14 // SMK Ledang
  } else if (email.includes('smkbp') || email.includes('batu.pahat')) {
    schoolId = 15 // SMK Batu Pahat
  } else if (email.includes('smkyp') || email.includes('yong.peng')) {
    schoolId = 16 // SMK Yong Peng
  } else if (email.includes('smkah') || email.includes('ayer.hitam')) {
    schoolId = 17 // SMK Ayer Hitam
  } else if (email.includes('smksenggarang') || email.includes('senggarang')) {
    schoolId = 18 // SMK Senggarang
  } else if (email.includes('smkrengit') || email.includes('rengit')) {
    schoolId = 19 // SMK Rengit
  } else if (email.includes('smkpr') || email.includes('parit.raja')) {
    schoolId = 20 // SMK Parit Raja
  } else {
    // Try to extract numeric school ID
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
    school_id: schoolId || 1, // Default to first school if can't determine
    ppd_id: null
  }
}

function determineGovRole(email: string) {
  // PPD DETECTION
  if (email.includes('ppd')) {
    let ppdId = null
    
    if (email.includes('jb') || email.includes('johor.bahru') || email.includes('johorbahru')) {
      ppdId = 1 // PPD Johor Bahru
    } else if (email.includes('muar')) {
      ppdId = 2 // PPD Muar
    } else if (email.includes('bp') || email.includes('batu.pahat') || email.includes('batupahat')) {
      ppdId = 3 // PPD Batu Pahat
    }
    
    return {
      role: 'ppd',
      school_id: null,
      ppd_id: ppdId || 1 // Default to first PPD if can't determine
    }
  }
  
  // JABATAN DETECTION
  if (email.includes('jpnj') || email.includes('jabatan')) {
    // Determine specific role within Jabatan
    if (email.includes('koordinator') || email.includes('coordinator') || 
        email.includes('admin') || email.includes('pentadbir')) {
      return {
        role: 'sektor_perancangan',
        school_id: null,
        ppd_id: null
      }
    }
    
    if (email.includes('pembelajaran') || email.includes('academic') || 
        email.includes('kurikulum') || email.includes('curriculum')) {
      return {
        role: 'sektor_pembelajaran',
        school_id: null,
        ppd_id: null
      }
    }
    
    // Default jabatan role
    return {
      role: 'sektor_perancangan',
      school_id: null,
      ppd_id: null
    }
  }
  
  // If @moe.gov.my but not clearly PPD or Jabatan, default to PPD
  return {
    role: 'ppd',
    school_id: null,
    ppd_id: 1 // Default to first PPD
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
    // Check if pending user already exists
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

// Main role determination function with MOE domain support
async function determineUserRole(email: string, name: string, profile?: any) {
  // Step 1: Check if user already exists in database
  const existingUser = await getUserRoleFromDatabase(email)
  if (existingUser) {
    console.log(`👤 Found existing user: ${email} with role: ${existingUser.role}`)
    return existingUser
  }
  
  // Step 2: Validate domain first
  const domain = email.toLowerCase().split('@')[1]
  const allowedDomains = ['moe-dl.edu.my', 'moe.gov.my', 'jcorp.com.my']
  
  if (!allowedDomains.includes(domain)) {
    console.log(`🚫 Unauthorized domain: ${domain}`)
    await createPendingUser(email, name)
    return { 
      role: 'unauthorized', 
      school_id: null, 
      ppd_id: null, 
      exists: false 
    }
  }
  
  // Step 3: MOE domain-based role detection
  const emailRole = determineRoleFromEmail(email)
  
  if (emailRole.role === 'unauthorized') {
    console.log(`⏳ Unauthorized domain, requires manual approval: ${email}`)
    await createPendingUser(email, name)
    return { 
      role: 'pending_approval', 
      school_id: null, 
      ppd_id: null, 
      exists: false 
    }
  }
  
  // Step 4: Auto-approve for official MOE domains
  if (domain === 'moe-dl.edu.my' || domain === 'moe.gov.my' || domain === 'jcorp.com.my') {
    if (emailRole.role !== 'unknown') {
      await createUserWithRole(email, name, emailRole)
      console.log(`✅ Auto-approved ${domain} user: ${email} with role: ${emailRole.role}`)
      return { ...emailRole, exists: false }
    }
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
    // Google SSO - only enable if environment variables are set
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            scope: 'openid email profile',
          }
        }
      })
    ] : []),
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
              credentials.password as string,
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
          // Determine user role using hybrid strategy
          const roleData = await determineUserRole(
            user.email!,
            user.name!,
            profile
          )
          
          // Reject if pending approval
          if (roleData.role === 'pending_approval') {
            console.log(`🚫 Login rejected - pending approval: ${user.email}`)
            return '/auth/pending-approval'
          }
          
          // Allow login for approved roles
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
      if (token && session.user) {
        (session.user as any).role = token.role as string
        ;(session.user as any).school_id = token.school_id as number
        ;(session.user as any).ppd_id = token.ppd_id as number
        ;(session.user as any).user_id = token.user_id as number
        ;(session.user as any).school_name = token.school_name as string
        ;(session.user as any).ppd_name = token.ppd_name as string
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
  secret: process.env.NEXTAUTH_SECRET || 'demo-secret-key-for-development-only',
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
  if (!allowedRoles.includes((user as any).role)) {
    throw new Error('Insufficient permissions')
  }
  return user
}

// Admin function to approve pending users
export async function approveUser(email: string, roleData: { role: string, school_id?: number, ppd_id?: number }) {
  try {
    const result = await pool.query(`
      UPDATE users 
      SET role = $1, school_id = $2, ppd_id = $3, updated_at = NOW()
      WHERE email = $4 AND role = 'pending_approval'
      RETURNING *
    `, [roleData.role, roleData.school_id, roleData.ppd_id, email])
    
    if (result.rows.length > 0) {
      console.log(`✅ Approved user: ${email} with role: ${roleData.role}`)
      return result.rows[0]
    }
    
    throw new Error('User not found or already approved')
  } catch (error) {
    console.error('Error approving user:', error)
    throw error
  }
}