# 🚀 Panduan Cepat: Deploy JohorUP ke Netlify

## ⚡ Setup dalam 15 Minit!

### **Langkah 1: Setup Database (5 minit)**
1. **Pergi ke** https://supabase.com
2. **Sign up** dengan GitHub
3. **Create project**: "johorup-production"
4. **Pilih region**: Singapore
5. **Copy** URL dan keys dari Settings > API

### **Langkah 2: Deploy ke Netlify (5 minit)**
1. **Pergi ke** https://netlify.com
2. **Connect GitHub** repository JohorUP
3. **Set build settings**:
   - Base directory: `johorup-system`
   - Build command: `npm run build`
   - Publish directory: `.next`

### **Langkah 3: Set Environment Variables (3 minit)**
Pergi ke Site settings > Environment variables:

```env
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_KEY=[your-service-key]
NEXTAUTH_URL=https://[your-site].netlify.app
NEXTAUTH_SECRET=[generate-random-32-chars]
JWT_SECRET=[generate-random-32-chars]
ENCRYPTION_KEY=[generate-random-32-chars]
NODE_ENV=production
```

### **Langkah 4: Import Data (2 minit)**
```bash
# Set environment variables
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_KEY="your-service-key"

# Run import
npm run import:supabase
```

## 🎯 **Atau Guna Script Automatik**

```bash
# Satu command sahaja!
npm run deploy:netlify
```

Script ini akan:
- ✅ Install Netlify CLI
- ✅ Setup environment
- ✅ Build dan test
- ✅ Deploy ke Netlify
- ✅ Import data ke Supabase
- ✅ Setup domain (optional)

## 💰 **Kos Bulanan**

### **Free Tier** (Untuk testing)
- Netlify: RM0/bulan
- Supabase: RM0/bulan
- **Total: RM0** 🆓

### **Production** (Recommended)
- Netlify Pro: RM50/bulan
- Supabase Pro: RM100/bulan
- **Total: RM150/bulan** 💎

## 🔑 **Login Credentials**

Selepas import data:
- **Admin**: admin@jpnj.gov.my / AdminPass123!
- **Koordinator**: koordinator@jpnj.gov.my / KoordinatorPass123!
- **Sekolah 1**: sekolah1@jpnj.gov.my / SekolahPass123!
- **Yayasan JCorp**: yayasan@jcorp.com.my / YayasanPass123!

## ✅ **Checklist Deployment**

### **Pre-deployment**
- [ ] Supabase project created
- [ ] Database schema setup
- [ ] Environment variables ready

### **Deployment**
- [ ] GitHub repository connected
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] First deployment successful

### **Post-deployment**
- [ ] Data imported successfully
- [ ] Login system working
- [ ] File upload working
- [ ] All user roles tested
- [ ] Mobile responsive checked

## 🆘 **Troubleshooting**

### **Build Errors**
```bash
# Check build locally
npm run build

# Check type errors
npm run type-check

# Check linting
npm run lint
```

### **Database Connection**
```bash
# Test Supabase connection
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
supabase.from('ppds').select('*').then(console.log);
"
```

### **Environment Variables**
- Pastikan semua variables ada di Netlify dashboard
- Check typos dalam variable names
- Pastikan values tidak ada quotes extra

## 📞 **Support**

### **Netlify Issues**
- Dashboard: https://app.netlify.com
- Docs: https://docs.netlify.com
- Support: support@netlify.com

### **Supabase Issues**
- Dashboard: https://app.supabase.com
- Docs: https://supabase.com/docs
- Support: support@supabase.com

## 🎉 **Selesai!**

Sistem JohorUP anda kini live di Netlify dengan database Supabase yang powerful! 

**URL**: https://[your-site].netlify.app

Selamat menggunakan! 🚀