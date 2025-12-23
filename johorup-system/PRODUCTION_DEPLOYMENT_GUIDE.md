# Panduan Deployment Sistem JohorUP untuk Production

## 🚀 Langkah-langkah Deployment Production

### 1. Persediaan Sistem Production

#### A. Persekitaran Hosting
**Pilihan Platform:**
- **Vercel** (Recommended untuk Next.js)
- **Netlify** (Current demo)
- **AWS Amplify**
- **DigitalOcean App Platform**
- **Server sendiri dengan Docker**

#### B. Domain dan SSL
```bash
# Contoh domain production
https://johorup.jpnj.gov.my
# atau
https://sistem-johorup.edu.my
```

### 2. Konfigurasi Environment Variables

#### A. Buat fail `.env.production`
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:5432/johorup_production"
DATABASE_SSL=true

# Authentication
NEXTAUTH_URL="https://johorup.jpnj.gov.my"
NEXTAUTH_SECRET="your-super-secure-secret-key-here"

# Email Configuration (untuk notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="noreply@jpnj.gov.my"
SMTP_PASS="your-email-password"

# File Upload (AWS S3 atau CloudFlare R2)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="ap-southeast-1"
AWS_BUCKET_NAME="johorup-files"

# Security
ENCRYPTION_KEY="your-32-character-encryption-key"
JWT_SECRET="your-jwt-secret-key"

# Monitoring
SENTRY_DSN="your-sentry-dsn-for-error-tracking"
```

### 3. Database Setup (Production)

#### A. PostgreSQL Database
```sql
-- Buat database production
CREATE DATABASE johorup_production;

-- Buat user khusus
CREATE USER johorup_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE johorup_production TO johorup_user;
```

#### B. Migration Scripts
```bash
# Install database tools
npm install prisma @prisma/client
npm install pg @types/pg

# Setup Prisma schema
npx prisma init
npx prisma migrate deploy
npx prisma generate
```

### 4. Security Enhancements

#### A. Authentication System
```typescript
// lib/auth.ts - Replace mock authentication
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user) return null
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password, 
          user.password
        )
        
        if (!isPasswordValid) return null
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: '/login',
  }
}
```

#### B. Data Validation
```typescript
// lib/validation.ts
import { z } from 'zod'

export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['school', 'ppd', 'sektor_pembelajaran', 'sektor_perancangan', 'yayasan_jcorp'])
})

export const reportSchema = z.object({
  program_id: z.number(),
  date: z.string().datetime(),
  teacher_id: z.number(),
  topics_covered: z.string().min(10),
  // ... other fields
})
```

### 5. File Upload System

#### A. AWS S3 Configuration
```typescript
// lib/s3.ts
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

export async function uploadFile(file: File, key: string) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: file,
    ContentType: file.type,
    ACL: 'private'
  }
  
  return await s3.upload(params).promise()
}
```

### 6. Performance Optimizations

#### A. Next.js Configuration
```typescript
// next.config.ts
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['your-s3-bucket.s3.amazonaws.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  httpAgentOptions: {
    keepAlive: true,
  },
}
```

#### B. Database Optimization
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query'] : [],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 7. Monitoring dan Logging

#### A. Error Tracking
```typescript
// lib/sentry.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

#### B. Analytics
```typescript
// lib/analytics.ts
import { Analytics } from '@vercel/analytics/react'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  )
}
```

### 8. Backup Strategy

#### A. Database Backup
```bash
#!/bin/bash
# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "backup_johorup_$DATE.sql"
aws s3 cp "backup_johorup_$DATE.sql" s3://johorup-backups/
```

#### B. File Backup
```bash
# Automated S3 backup
aws s3 sync s3://johorup-files s3://johorup-backups/files/
```

### 9. Deployment Commands

#### A. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
# ... add all other env vars
```

#### B. Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 10. Security Checklist

#### A. Pre-deployment Security
- [ ] Remove all demo accounts
- [ ] Change all default passwords
- [ ] Enable HTTPS only
- [ ] Set up CORS properly
- [ ] Enable rate limiting
- [ ] Set up CSP headers
- [ ] Enable audit logging

#### B. Post-deployment Security
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Set up intrusion detection
- [ ] Regular penetration testing
- [ ] Backup verification

### 11. User Management Production

#### A. Initial Admin Setup
```sql
-- Create initial admin user
INSERT INTO users (email, name, role, password_hash, created_at) VALUES
('admin@jpnj.gov.my', 'System Administrator', 'sektor_perancangan', '$2a$12$...', NOW());
```

#### B. User Import Script
```typescript
// scripts/import-users.ts
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import csv from 'csv-parser'
import fs from 'fs'

async function importUsers() {
  const users: any[] = []
  
  fs.createReadStream('users.csv')
    .pipe(csv())
    .on('data', (data) => users.push(data))
    .on('end', async () => {
      for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 12)
        
        await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            role: user.role,
            password: hashedPassword,
            school_id: user.school_id || null,
            ppd_id: user.ppd_id || null
          }
        })
      }
    })
}
```

### 12. Go-Live Checklist

#### Pre-Launch (1 minggu sebelum)
- [ ] Complete UAT testing
- [ ] Performance testing
- [ ] Security audit
- [ ] Backup procedures tested
- [ ] Monitoring setup
- [ ] Documentation complete

#### Launch Day
- [ ] Deploy to production
- [ ] DNS cutover
- [ ] SSL certificate active
- [ ] Monitor system health
- [ ] User acceptance testing
- [ ] Support team ready

#### Post-Launch (1 minggu selepas)
- [ ] Monitor performance
- [ ] Collect user feedback
- [ ] Fix any issues
- [ ] Optimize based on usage
- [ ] Plan next iteration

### 13. Support dan Maintenance

#### A. Monitoring Dashboard
- System uptime
- Response times
- Error rates
- User activity
- Database performance

#### B. Maintenance Schedule
- Weekly: Security updates
- Monthly: Performance review
- Quarterly: Feature updates
- Annually: Security audit

---

## 📞 Sokongan Teknikal

Untuk bantuan deployment production, hubungi:
- **Email**: support@jpnj.gov.my
- **Telefon**: +60X-XXX-XXXX
- **Dokumentasi**: https://docs.johorup.jpnj.gov.my

---

*Panduan ini disediakan untuk memastikan deployment yang selamat dan berkesan untuk sistem JohorUP production.*