# 🚀 Deploy Guna GitHub Desktop - Panduan Lengkap

## Cara Paling Mudah Untuk Non-Technical Users!

---

## 📋 Apa Yang Anda Perlukan

- ✅ Sistem JohorUP (dah ada)
- ✅ Email address
- ✅ 10 minit masa
- ❌ TIDAK perlu technical knowledge
- ❌ TIDAK perlu command line

---

## 🎯 Bahagian 1: Setup GitHub (5 minit)

### Step 1.1: Download GitHub Desktop

1. **Pergi ke:** https://desktop.github.com
2. **Klik "Download for Windows"**
3. **Tunggu download selesai** (sekitar 100MB)
4. **Double click file yang di-download**
5. **Install** (klik Next, Next, Install)

### Step 1.2: Buat GitHub Account (Jika Belum Ada)

1. **Pergi ke:** https://github.com/signup
2. **Masukkan:**
   - Email: [email anda]
   - Password: [buat password]
   - Username: [pilih username]
3. **Verify email** (check inbox)
4. **Complete setup**

### Step 1.3: Login GitHub Desktop

1. **Buka GitHub Desktop**
2. **Klik "Sign in to GitHub.com"**
3. **Masukkan email dan password**
4. **Authorize GitHub Desktop**
5. **Configure Git:**
   - Name: [Nama anda]
   - Email: [Email anda]
   - Klik "Continue"

✅ **GitHub Desktop siap!**

---

## 🎯 Bahagian 2: Upload Code ke GitHub (3 minit)

### Step 2.1: Add Repository

1. **Di GitHub Desktop, klik "File" → "Add Local Repository"**
2. **Klik "Choose..."**
3. **Navigate ke folder `johorup-system`**
   - Contoh: `D:\JohorUP\JohorUP\johorup-system`
4. **Klik "Select Folder"**

### Step 2.2: Initialize Repository

Jika muncul error "This directory does not appear to be a Git repository":

1. **Klik "create a repository"**
2. **Atau klik "Cancel" dan pilih "Create New Repository"**
3. **Name:** johorup-system
4. **Local Path:** [path ke folder anda]
5. **✅ JANGAN tick "Initialize with README"** (kita dah ada)
6. **Klik "Create Repository"**

### Step 2.3: Commit Changes

Anda akan nampak list of changes di sebelah kiri:

1. **Di bawah, ada box "Summary"**
2. **Type:** `Initial commit - JohorUP System`
3. **Klik "Commit to main"** (button biru besar)

### Step 2.4: Publish to GitHub

1. **Klik "Publish repository"** (button biru di atas)
2. **Settings:**
   - Name: `johorup-system`
   - Description: `Sistem Pemantauan Program JohorUP`
   - ✅ **TICK "Keep this code private"** (PENTING!)
   - Organization: [Pilih account anda]
3. **Klik "Publish repository"**
4. **Tunggu upload selesai** (1-2 minit)

✅ **Code sudah di GitHub!**

---

## 🎯 Bahagian 3: Deploy ke Vercel (5 minit)

### Step 3.1: Sign Up Vercel

1. **Pergi ke:** https://vercel.com/signup
2. **Klik "Continue with GitHub"**
3. **Authorize Vercel** (klik "Authorize vercel")
4. **Pilih "Hobby" plan** (PERCUMA)
5. **Complete profile** (optional)

### Step 3.2: Import Project

1. **Di Vercel Dashboard, klik "Add New..."**
2. **Pilih "Project"**
3. **Anda akan nampak list repositories**
4. **Cari `johorup-system`**
5. **Klik "Import"**

### Step 3.3: Configure Project

**Framework Preset:**
```
✅ Next.js (auto-detected)
```

**Root Directory:**
```
✅ ./ (default)
```

**Build and Output Settings:**
```
Build Command: npm run build ✅
Output Directory: .next ✅
Install Command: npm install ✅
```

**Environment Variables:** (Optional - skip for now)
```
[Leave empty for demo]
```

### Step 3.4: Deploy!

1. **Klik "Deploy"** (button biru besar)
2. **Tunggu 2-3 minit**
3. **Anda akan nampak:**
   - ⏳ Initializing...
   - ⏳ Building...
   - ⏳ Deploying...
   - 🎉 **Congratulations!**

### Step 3.5: Get Your URL

1. **Selepas deploy success, anda akan nampak:**
   ```
   🎉 Congratulations!
   Your project is live at:
   https://johorup-system-[random].vercel.app
   ```

2. **Klik "Visit"** atau copy URL

3. **Test login:**
   ```
   Email: koordinator@jpnj.gov.my
   Password: demo123
   ```

✅ **SISTEM ANDA DAH ONLINE!** 🎉

---

## 📱 Bahagian 4: Share Demo

### Copy URL Anda

URL format:
```
https://johorup-system.vercel.app
atau
https://johorup-system-abc123xyz.vercel.app
```

### Template WhatsApp/Email

```
Assalamualaikum,

Demo Sistem JohorUP sudah online!

🌐 URL: [PASTE URL ANDA DI SINI]

👤 Login:
Koordinator: koordinator@jpnj.gov.my / demo123
Sekolah: sekolah1@moe.gov.my / demo123
PPD: ppd.jb@moe.gov.my / demo123

Sila test dan beri feedback.

Terima kasih!
```

---

## 🔄 Bahagian 5: Update Demo (Bila Ada Changes)

### Bila Anda Buat Changes Dalam Code:

1. **Buka GitHub Desktop**
2. **Anda akan nampak changes di sebelah kiri**
3. **Type summary:** `Update features`
4. **Klik "Commit to main"**
5. **Klik "Push origin"** (button di atas)
6. **Vercel auto deploy!** (2-3 minit)
7. **Refresh URL anda** - changes dah live!

---

## 🎨 Bonus: Custom Domain (Optional)

Jika anda nak URL sendiri (contoh: johorup.jpnj.gov.my):

### Di Vercel:

1. **Login to Vercel**
2. **Klik project `johorup-system`**
3. **Pergi ke "Settings"**
4. **Klik "Domains"**
5. **Add domain:** `johorup.jpnj.gov.my`
6. **Follow instructions untuk update DNS**

---

## 📊 Monitor Demo

### View Analytics:

1. **Login to Vercel**
2. **Klik project**
3. **Pergi ke "Analytics" tab**
4. **Anda boleh lihat:**
   - 📈 Pageviews
   - 👥 Visitors
   - 📄 Popular pages
   - ⚡ Performance

---

## 🆘 Troubleshooting

### Problem 1: GitHub Desktop Tak Nampak Changes

**Solution:**
1. Pastikan anda di repository yang betul
2. Check "Current Repository" di atas
3. Refresh: View → Refresh

### Problem 2: Publish Button Disabled

**Solution:**
1. Pastikan anda dah commit changes
2. Check internet connection
3. Restart GitHub Desktop

### Problem 3: Vercel Build Failed

**Solution:**
1. Check build logs di Vercel
2. Test locally: `npm run build`
3. Check for errors
4. Fix errors dan push lagi

### Problem 4: URL Not Loading

**Solution:**
1. Wait 5 minutes (DNS propagation)
2. Try incognito mode
3. Clear browser cache
4. Check Vercel deployment status

### Problem 5: Repository Not Showing in Vercel

**Solution:**
1. Refresh Vercel page
2. Check repository is public or Vercel has access
3. Go to GitHub → Settings → Applications → Vercel
4. Grant access to repository

---

## ✅ Checklist Success

Selepas deploy, verify:

- [ ] URL accessible
- [ ] Login page loads
- [ ] Can login with demo accounts
- [ ] Dashboard shows correctly
- [ ] Lulus program works
- [ ] Turunkan geran works
- [ ] Graf displays
- [ ] Mobile responsive
- [ ] HTTPS enabled (padlock icon)
- [ ] Fast loading

---

## 📸 Screenshots Guide

### GitHub Desktop:

**Step 1: Add Repository**
```
File → Add Local Repository → Choose folder
```

**Step 2: Commit**
```
[Changes list]
Summary: [Type message]
[Commit to main button]
```

**Step 3: Publish**
```
[Publish repository button]
Name: johorup-system
✅ Keep this code private
[Publish button]
```

### Vercel:

**Step 1: Import**
```
Add New → Project → Import from GitHub
```

**Step 2: Configure**
```
Framework: Next.js ✅
Root: ./ ✅
[Deploy button]
```

**Step 3: Success**
```
🎉 Congratulations!
[Visit button]
```

---

## 💡 Tips

1. **Simpan URL** - Copy dan save dalam notepad
2. **Bookmark Vercel** - Untuk easy access
3. **Enable notifications** - Untuk deployment updates
4. **Test thoroughly** - Sebelum share dengan team
5. **Monitor analytics** - Untuk track usage

---

## 🎓 Video Tutorial (Recommended)

Jika anda prefer video tutorial:

**GitHub Desktop:**
- https://www.youtube.com/watch?v=8Dd7KRpKeaE

**Vercel Deployment:**
- https://www.youtube.com/watch?v=2HBIzEx6IZA

---

## 📞 Support

Jika masih ada masalah:

**GitHub Desktop:**
- Help → Show Logs
- Help → Report Issue

**Vercel:**
- Help → Contact Support
- Docs: https://vercel.com/docs

**Email:**
- support@jpnj.gov.my

---

## 🎉 Tahniah!

Anda berjaya deploy sistem tanpa guna command line!

**Sistem anda kini:**
- ✅ Online 24/7
- ✅ Accessible dari mana-mana
- ✅ Auto HTTPS
- ✅ Global CDN (pantas)
- ✅ Auto deploy bila update

**Share URL dengan:**
- Pengurusan
- Penaja
- Team
- Stakeholders

---

**Selamat Berdemo! 🚀**

Sistem JohorUP anda kini boleh diakses dari seluruh dunia!

---

*Panduan ini dibuat khusus untuk non-technical users*  
*Jika ada masalah, rujuk troubleshooting section atau hubungi support*
