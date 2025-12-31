# 🗄️ Setup Database Neon untuk Production

## ✅ Status Deployment
- **Site URL**: https://johorup.netlify.app
- **Build Status**: ✅ Berjaya
- **Authentication**: ✅ Updated ke API-based

## 🚀 Langkah Setup Database

### 1. Buat Neon Database
1. Pergi ke [console.neon.tech](https://console.neon.tech)
2. Login dengan akaun GitHub/Google
3. Klik "Create Project"
4. Nama project: **johorup-production**
5. Pilih region: **Asia Pacific (Singapore)**
6. Klik "Create Project"

### 2. Dapatkan Connection String
Selepas project dibuat, copy connection string:
```
postgresql://username:password@host/database?sslmode=require
```

### 3. Set Environment Variables di Netlify
1. Pergi ke [Netlify Dashboard](https://app.netlify.com/projects/johorup)
2. Klik "Site Settings"
3. Klik "Environment Variables"
4. Tambah variables berikut:

```bash
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://johorup.netlify.app
NEXTAUTH_SECRET=generate-32-character-secret
JWT_SECRET=generate-32-character-secret
ENCRYPTION_KEY=generate-32-character-key
SESSION_SECRET=generate-32-character-secret
```

### 4. Generate Secure Keys
Jalankan command ini untuk generate keys:
```bash
node -e "console.log('NEXTAUTH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Initialize Database
Selepas set DATABASE_URL, jalankan:
```bash
# Set connection string
export DATABASE_URL="your-neon-connection-string"

# Initialize database
cd johorup-system
node scripts/setup-neon-database.js
```

### 6. Redeploy Site
Selepas set environment variables:
```bash
netlify deploy --prod
```

## 🧪 Test Production System

### Demo Login Credentials
Selepas database setup, cuba login dengan:

**Super Admin:**
- Email: `admin@s4pd.gov.my`
- Password: `admin123`

**SPB Admin:**
- Email: `spb.admin@jpnj.gov.my`
- Password: `spb123`

**SPM Admin:**
- Email: `spm.admin@jpnj.gov.my`
- Password: `spm123`

**Yayasan JCorp (Bilingual):**
- Email: `strategic@jcorp.com.my`
- Password: `jcorp123`

**Yayasan Hasanah (Bilingual):**
- Email: `strategic@hasanah.com.my`
- Password: `hasanah123`

**PPD User:**
- Email: `ppd.jb@jpnj.gov.my`
- Password: `ppd123`

**School Admin:**
- Email: `school.demo@jpnj.gov.my`
- Password: `school123`

**Teacher:**
- Email: `teacher.math@jpnj.gov.my`
- Password: `teacher123`

**SISC+:**
- Email: `sisc.math@jpnj.gov.my`
- Password: `sisc123`

## 🔍 Troubleshooting

### Jika Login Tidak Berfungsi
1. Check Netlify Function logs
2. Pastikan DATABASE_URL betul
3. Pastikan database sudah di-initialize
4. Test API endpoint: `/api/auth`

### Jika Database Connection Error
1. Check connection string format
2. Pastikan SSL enabled di Neon
3. Test connection locally dulu

## 📊 Status Semasa

### ✅ Completed
- [x] Authentication system updated ke API-based
- [x] Login page updated dengan credentials betul
- [x] Dashboard updated untuk sessionStorage
- [x] NavigationBar updated
- [x] Build dan deploy berjaya

### ⏳ Pending
- [ ] Setup Neon database
- [ ] Set environment variables
- [ ] Initialize database schema
- [ ] Test all user roles

**Next Action**: Setup Neon database dan environment variables untuk activate full functionality!