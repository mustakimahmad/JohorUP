# 🚀 Deploy Sekarang - Step by Step

## Anda Ada 2 Pilihan:

---

## ✅ Cara 1: Guna Vercel CLI (Command Line) - 3 Minit

### Step 1: Login ke Vercel

```bash
vercel login
```

**Apa yang akan berlaku:**
1. Terminal akan tanya email anda
2. Masukkan email (contoh: nama@jpnj.gov.my)
3. Check email anda
4. Klik link verification dalam email
5. Kembali ke terminal - anda dah login!

### Step 2: Deploy

```bash
# Pastikan anda di folder johorup-system
cd johorup-system

# Deploy!
vercel
```

**Jawab soalan:**
```
? Set up and deploy "johorup-system"? Y
? Which scope? [Pilih account anda]
? Link to existing project? N
? What's your project's name? johorup-system
? In which directory is your code located? ./
? Want to override the settings? N
```

### Step 3: Tunggu 2-3 Minit

Anda akan nampak:
```
⏳ Building...
⏳ Deploying...
✅ Success!
```

### Step 4: Dapatkan URL

Terminal akan show:
```
✅ Production: https://johorup-system-[random].vercel.app
```

**Copy URL itu dan test!**

---

## ✅ Cara 2: Guna Vercel Website (Tanpa Command Line) - 5 Minit

### Step 1: Upload ke GitHub Dulu

**Option A: Guna GitHub Desktop (Mudah)**

1. Download GitHub Desktop: https://desktop.github.com
2. Install dan login
3. File → Add Local Repository
4. Pilih folder `johorup-system`
5. Klik "Publish repository"
6. Name: `johorup-system`
7. ✅ Keep this code private
8. Klik "Publish"

**Option B: Guna Command Line**

```bash
# Di folder johorup-system
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Ganti [username] dengan GitHub username anda
git remote add origin https://github.com/[username]/johorup-system.git
git push -u origin main
```

### Step 2: Deploy di Vercel Website

1. **Pergi ke:** https://vercel.com/signup
2. **Sign up dengan GitHub**
3. **Klik "Add New..." → "Project"**
4. **Import repository `johorup-system`**
5. **Klik "Deploy"**
6. **Tunggu 2-3 minit**
7. **✅ Done! Copy URL**

---

## 🆘 Jika Ada Masalah

### Error: "vercel: command not found"

**Solution:**
```bash
# Install vercel globally
npm install -g vercel

# Atau guna npx
npx vercel
```

### Error: "No GitHub account"

**Solution:**
1. Pergi ke https://github.com/signup
2. Buat account (percuma)
3. Verify email
4. Cuba lagi

### Error: "Build failed"

**Solution:**
```bash
# Test build locally first
npm run build

# Jika success, deploy lagi
vercel
```

### Error: "Authentication failed"

**Solution:**
```bash
# Logout dan login semula
vercel logout
vercel login
```

---

## 📱 Selepas Deploy

### Anda Akan Dapat URL Seperti:

```
https://johorup-system.vercel.app
atau
https://johorup-system-abc123.vercel.app
```

### Test URL:

1. Buka URL dalam browser
2. Login: koordinator@jpnj.gov.my / demo123
3. Test features
4. ✅ Share dengan team!

---

## 🔄 Update Demo (Bila Ada Changes)

### Guna Vercel CLI:

```bash
# Buat changes dalam code
# Then:
vercel --prod
```

### Guna GitHub:

```bash
git add .
git commit -m "Update features"
git push

# Vercel auto deploy!
```

---

## 💡 Tips

1. **Simpan URL anda** - Copy dan save dalam notepad
2. **Test semua features** - Pastikan semua working
3. **Share dengan team** - Guna template dalam DEPLOYMENT_SUMMARY.md
4. **Monitor analytics** - Login to vercel.com untuk lihat stats

---

## 📞 Perlukan Bantuan?

Jika masih ada masalah:

1. Screenshot error message
2. Check build logs di Vercel dashboard
3. Rujuk DEPLOYMENT_GUIDE.md untuk troubleshooting
4. Atau hubungi support

---

**Selamat Deploy! 🚀**

Sistem anda akan online dalam masa 3-5 minit sahaja!
