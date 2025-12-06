# Panduan Deployment Sistem JohorUP

## 🎯 Pilihan Deployment

Sistem ini boleh di-deploy ke beberapa platform. Berikut adalah panduan lengkap.

---

## 🚀 Option 1: Vercel (PALING MUDAH) ⭐ RECOMMENDED

### Kelebihan:
- ✅ Percuma untuk hobby projects
- ✅ Deploy dalam 5 minit
- ✅ Auto SSL/HTTPS
- ✅ Global CDN
- ✅ Auto deploy bila push ke GitHub
- ✅ Custom domain (.vercel.app)

### Langkah-langkah:

#### Step 1: Buat GitHub Repository (5 minit)

1. **Pergi ke GitHub**
   ```
   https://github.com
   ```

2. **Login atau Sign Up**
   - Jika belum ada account, buat baru (percuma)

3. **Create New Repository**
   - Klik "+" di kanan atas
   - Pilih "New repository"
   - Nama: `johorup-system`
   - Description: `Sistem Pemantauan Program JohorUP`
   - Public atau Private (pilih Private untuk keselamatan)
   - Jangan tick "Initialize with README" (kita dah ada)
   - Klik "Create repository"

4. **Push Code ke GitHub**
   ```bash
   # Di folder johorup-system
   git init
   git add .
   git commit -m "Initial commit - JohorUP System"
   git branch -M main
   git remote add origin https://github.com/[username]/johorup-system.git
   git push -u origin main
   ```

   Ganti `[username]` dengan GitHub username anda.

#### Step 2: Deploy ke Vercel (3 minit)

1. **Pergi ke Vercel**
   ```
   https://vercel.com
   ```

2. **Sign Up dengan GitHub**
   - Klik "Sign Up"
   - Pilih "Continue with GitHub"
   - Authorize Vercel

3. **Import Project**
   - Klik "Add New..." → "Project"
   - Pilih repository `johorup-system`
   - Klik "Import"

4. **Configure Project**
   ```
   Framework Preset: Next.js (auto-detected)
   Root Directory: ./
   Build Command: npm run build (auto)
   Output Directory: .next (auto)
   ```

5. **Environment Variables**
   - Klik "Environment Variables"
   - Tambah:
   ```
   NEXT_PUBLIC_APP_NAME = JohorUP Dashboard
   ```
   - Klik "Add"

6. **Deploy**
   - Klik "Deploy"
   - Tunggu 2-3 minit
   - ✅ Done!

7. **Dapatkan URL**
   ```
   https://johorup-system.vercel.app
   atau
   https://johorup-system-[random].vercel.app
   ```

#### Step 3: Test Deployment

1. Buka URL yang diberi
2. Login dengan: koordinator@jpnj.gov.my / demo123
3. Test semua features

#### Step 4: Custom Domain (Optional)

Jika anda ada domain sendiri (contoh: johorup.jpnj.gov.my):

1. Di Vercel dashboard, pergi ke Settings → Domains
2. Tambah domain anda
3. Update DNS records di domain provider
4. Tunggu propagation (5-30 minit)

---

## 🌐 Option 2: Netlify (Mudah Juga)

### Kelebihan:
- ✅ Percuma
- ✅ Mudah setup
- ✅ Auto SSL
- ✅ Form handling built-in

### Langkah-langkah:

1. **Push ke GitHub** (sama seperti Vercel Step 1)

2. **Pergi ke Netlify**
   ```
   https://netlify.com
   ```

3. **Sign Up dengan GitHub**

4. **Import Project**
   - Klik "Add new site" → "Import an existing project"
   - Pilih GitHub
   - Pilih repository `johorup-system`

5. **Configure Build**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

6. **Deploy**
   - Klik "Deploy site"
   - Tunggu 2-3 minit

7. **URL:**
   ```
   https://johorup-system.netlify.app
   ```

---

## ☁️ Option 3: AWS Amplify (Untuk Production)

### Kelebihan:
- ✅ Scalable
- ✅ Integration dengan AWS services
- ✅ Good for production

### Kos:
- Free tier: 1000 build minutes/month
- Selepas itu: ~$0.01 per build minute

### Langkah-langkah:

1. **Push ke GitHub** (sama seperti atas)

2. **Pergi ke AWS Console**
   ```
   https://console.aws.amazon.com
   ```

3. **Pergi ke AWS Amplify**
   - Search "Amplify" di console
   - Klik "Get Started" under "Amplify Hosting"

4. **Connect Repository**
   - Pilih GitHub
   - Authorize AWS Amplify
   - Pilih repository dan branch

5. **Configure Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

6. **Deploy**
   - Review settings
   - Klik "Save and deploy"
   - Tunggu 5-10 minit

7. **URL:**
   ```
   https://main.[app-id].amplifyapp.com
   ```

---

## 🐳 Option 4: Docker + Any Cloud (Advanced)

### Untuk VPS atau Cloud Server

#### Step 1: Buat Dockerfile

Saya dah sediakan:

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
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

#### Step 2: Build dan Run

```bash
# Build image
docker build -t johorup-system .

# Run container
docker run -p 3000:3000 johorup-system
```

#### Step 3: Deploy ke Cloud

**Digital Ocean:**
```bash
# Push to Docker Hub
docker tag johorup-system username/johorup-system
docker push username/johorup-system

# Deploy to Digital Ocean App Platform
# Use Docker Hub image
```

**AWS ECS/Fargate:**
```bash
# Push to ECR
aws ecr create-repository --repository-name johorup-system
docker tag johorup-system [account].dkr.ecr.[region].amazonaws.com/johorup-system
docker push [account].dkr.ecr.[region].amazonaws.com/johorup-system

# Deploy to ECS
```

---

## 📊 Perbandingan Platform

| Platform | Kos | Kesukaran | Masa Setup | Best For |
|----------|-----|-----------|------------|----------|
| **Vercel** | Percuma | ⭐ Mudah | 5 min | Demo/Production |
| **Netlify** | Percuma | ⭐ Mudah | 5 min | Demo/Production |
| **AWS Amplify** | Free tier | ⭐⭐ Sederhana | 10 min | Production |
| **Docker + VPS** | $5-20/month | ⭐⭐⭐ Susah | 30 min | Full Control |

---

## 🎯 Recommendation Untuk Demo

### Untuk Demo Kepada Pengurusan:
**Gunakan: Vercel** ⭐

**Kenapa:**
- Paling cepat setup (5 minit)
- Percuma
- URL cantik: johorup-system.vercel.app
- Auto SSL (HTTPS)
- Boleh share link terus

### Untuk Production (Data Sebenar):
**Gunakan: AWS Amplify atau VPS**

**Kenapa:**
- Lebih control
- Boleh integrate dengan database
- Boleh setup custom domain
- Better security options

---

## 🔒 Keselamatan Untuk Demo

### Perkara Yang Perlu Buat:

1. **Set Repository ke Private**
   - Di GitHub, Settings → Danger Zone → Change visibility

2. **Jangan Commit Sensitive Data**
   - .env.local sudah dalam .gitignore
   - Jangan commit password sebenar

3. **Guna Environment Variables**
   - Set di Vercel/Netlify dashboard
   - Jangan hardcode dalam code

4. **Add Basic Auth (Optional)**
   ```javascript
   // middleware.ts
   import { NextResponse } from 'next/server';
   import type { NextRequest } from 'next/server';

   export function middleware(request: NextRequest) {
     const basicAuth = request.headers.get('authorization');

     if (basicAuth) {
       const authValue = basicAuth.split(' ')[1];
       const [user, pwd] = atob(authValue).split(':');

       if (user === 'demo' && pwd === 'johorup2026') {
         return NextResponse.next();
       }
     }

     return new NextResponse('Authentication required', {
       status: 401,
       headers: {
         'WWW-Authenticate': 'Basic realm="Secure Area"',
       },
     });
   }

   export const config = {
     matcher: '/dashboard/:path*',
   };
   ```

---

## 📱 Share Demo Link

Selepas deploy, anda boleh share:

```
Demo URL: https://johorup-system.vercel.app

Login Credentials:
- Koordinator: koordinator@jpnj.gov.my / demo123
- Sekolah: sekolah1@moe.gov.my / demo123
- PPD: ppd.jb@moe.gov.my / demo123
- Sektor: pembelajaran@jpnj.gov.my / demo123

Dokumentasi:
https://johorup-system.vercel.app/PANDUAN_KOORDINATOR.md
```

---

## 🔄 Update Demo

Bila anda update code:

### Dengan Vercel/Netlify:
```bash
# Commit changes
git add .
git commit -m "Update features"
git push

# Auto deploy! (2-3 minit)
```

### Manual:
```bash
# Re-deploy di platform dashboard
```

---

## 📊 Monitor Demo

### Vercel Analytics (Percuma):
- Pageviews
- Unique visitors
- Top pages
- Performance metrics

### Setup:
1. Di Vercel dashboard
2. Pergi ke Analytics tab
3. Enable analytics
4. View real-time data

---

## 🆘 Troubleshooting

### Build Failed:
```bash
# Check build logs di platform
# Common issues:
- Missing dependencies: npm install
- TypeScript errors: npm run build locally first
- Environment variables: Check settings
```

### Site Not Loading:
```bash
# Check:
- Build completed successfully
- No errors in Function logs
- Environment variables set correctly
```

### Slow Performance:
```bash
# Optimize:
- Enable caching
- Optimize images
- Use CDN
- Check bundle size
```

---

## 💰 Kos Estimation

### Demo (Vercel Free):
```
Users: < 100
Bandwidth: Unlimited
Build time: 6000 minutes/month
Cost: RM 0
```

### Production (Vercel Pro):
```
Users: Unlimited
Bandwidth: 1TB
Build time: Unlimited
Cost: RM 80/month (~$20)
```

### Production (AWS):
```
EC2 t3.small: RM 60/month
RDS PostgreSQL: RM 50/month
Total: RM 110/month
```

---

## 📞 Support

Jika ada masalah deployment:

**Vercel:**
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

**Netlify:**
- Docs: https://docs.netlify.com
- Support: https://www.netlify.com/support

**AWS:**
- Docs: https://docs.aws.amazon.com
- Support: AWS Support Center

---

## ✅ Checklist Deployment

Sebelum deploy:
- [ ] Test locally: npm run build && npm start
- [ ] Check all features working
- [ ] Remove console.logs
- [ ] Update README with demo URL
- [ ] Prepare demo credentials
- [ ] Test on mobile
- [ ] Check performance
- [ ] Setup analytics

Selepas deploy:
- [ ] Test demo URL
- [ ] Test all login accounts
- [ ] Test all features
- [ ] Check mobile responsive
- [ ] Share with team
- [ ] Document any issues
- [ ] Setup monitoring

---

**Selamat Deploy! 🚀**

Jika ada masalah, hubungi support atau rujuk dokumentasi platform.
