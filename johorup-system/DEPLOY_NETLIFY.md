# 🚀 Deploy ke Netlify - Panduan Lengkap

## Kenapa Netlify?
- ✅ **PERCUMA** untuk demo
- ✅ Deploy dalam **5 MINIT**
- ✅ Mudah seperti Vercel
- ✅ Auto HTTPS
- ✅ Global CDN
- ✅ Drag & Drop deployment

---

## 📋 Apa Yang Anda Perlukan

- ✅ Sistem JohorUP (dah ada)
- ✅ GitHub account (jika dah ada dari tadi)
- ✅ 5 minit masa

---

## 🎯 Method 1: Deploy Dari GitHub (RECOMMENDED)

### Step 1: Pastikan Code Di GitHub

**Jika anda dah follow panduan GitHub Desktop tadi:**
- ✅ Code dah di GitHub
- ✅ Skip ke Step 2

**Jika belum:**
1. Follow `DEPLOY_GITHUB_DESKTOP.md` Step 1-5
2. Pastikan code dah di-publish ke GitHub

### Step 2: Sign Up Netlify

1. **Pergi ke:** https://app.netlify.com/signup
2. **Klik "Sign up with GitHub"**
3. **Authorize Netlify**
4. **Complete profile** (optional)

### Step 3: Import Project

1. **Di Netlify Dashboard, klik "Add new site"**
2. **Pilih "Import an existing project"**
3. **Klik "Deploy with GitHub"**
4. **Authorize Netlify** (jika diminta)
5. **Pilih repository `johorup-system`**

### Step 4: Configure Build Settings

**Basic build settings:**
```
Branch to deploy: main
Base directory: (leave empty)
Build command: npm run build
Publish directory: .next
```

**Advanced settings (klik "Show advanced"):**
```
Environment variables: (skip for now)
```

### Step 5: Deploy!

1. **Klik "Deploy [your-site-name]"** (button biru)
2. **Tunggu 3-5 minit**
3. **Anda akan nampak:**
   - ⏳ Site deploy in progress...
   - ⏳ Building...
   - 🎉 **Published!**

### Step 6: Get Your URL

**URL format:**
```
https://[random-name].netlify.app
```

**Contoh:**
```
https://johorup-system-abc123.netlify.app
```

**Copy URL dan test login:**
```
Email: koordinator@jpnj.gov.my
Password: demo123
```

✅ **SISTEM DAH ONLINE!** 🎉

---

## 🎯 Method 2: Deploy Guna Netlify CLI (Command Line)

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login

```bash
netlify login
```

Browser akan terbuka untuk authorize.

### Step 3: Deploy

```bash
# Di folder johorup-system
cd johorup-system

# Build first
npm run build

# Deploy
netlify deploy
```

**Jawab soalan:**
```
? What would you like to do? Create & configure a new site
? Team: [Your team]
? Site name: johorup-system
? Publish directory: .next
```

### Step 4: Deploy to Production

```bash
netlify deploy --prod
```

✅ **Done!**

---

## 🎯 Method 3: Drag & Drop (Paling Mudah!)

### Step 1: Build Locally

```bash
# Di folder johorup-system
npm run build
```

### Step 2: Prepare Files

1. **Copy folder `.next`** ke tempat lain
2. **Rename ke `out`** (optional)

### Step 3: Drag & Drop

1. **Pergi ke:** https://app.netlify.com/drop
2. **Drag folder `.next`** ke browser
3. **Tunggu upload selesai**
4. **✅ Site live!**

**Nota:** Method ini untuk quick test sahaja. Untuk production, guna Method 1.

---

## 🎨 Custom Domain (Optional)

### Change Site Name:

1. **Di Netlify Dashboard**
2. **Klik site anda**
3. **Site settings → Domain management**
4. **Options → Edit site name**
5. **Change to:** `johorup-system`
6. **Save**

**New URL:**
```
https://johorup-system.netlify.app
```

### Add Custom Domain:

1. **Domain management → Add custom domain**
2. **Enter:** `johorup.jpnj.gov.my`
3. **Follow DNS instructions**
4. **Wait for DNS propagation** (5-30 minit)

---

## 🔄 Update Demo (Auto Deploy)

Bila anda push changes ke GitHub:

```bash
# Di GitHub Desktop:
1. Commit changes
2. Push origin

# Netlify auto deploy! (3-5 minit)
```

---

## 📊 Monitor Demo

### Netlify Analytics:

1. **Login to Netlify**
2. **Klik site**
3. **Pergi ke "Analytics" tab**
4. **View:**
   - Pageviews
   - Unique visitors
   - Top pages
   - Bandwidth usage

---

## ⚙️ Environment Variables

Jika perlu set environment variables:

1. **Site settings → Environment variables**
2. **Add variable:**
   ```
   Key: NEXT_PUBLIC_APP_NAME
   Value: JohorUP Dashboard
   ```
3. **Save**
4. **Redeploy site**

---

## 🆘 Troubleshooting

### Problem 1: Build Failed

**Error: "Build script returned non-zero exit code"**

**Solution:**
```bash
# Test build locally
npm run build

# Check for errors
# Fix errors
# Push to GitHub
```

### Problem 2: Site Not Loading

**Error: "Page not found"**

**Solution:**
1. Check build settings
2. Publish directory should be `.next`
3. Check build logs for errors

### Problem 3: Slow Build

**Solution:**
1. Enable build cache
2. Site settings → Build & deploy → Build settings
3. Enable "Cache node_modules"

### Problem 4: Deploy Timeout

**Solution:**
1. Check build logs
2. Optimize build process
3. Remove large files
4. Contact Netlify support

---

## 🔒 Keselamatan

### Password Protection:

Untuk add password protection:

1. **Site settings → Access control**
2. **Enable password protection**
3. **Set password**
4. **Save**

### Environment Variables:

Jangan commit sensitive data:
- ✅ Use environment variables
- ✅ Add to .gitignore
- ❌ Don't hardcode secrets

---

## 💰 Kos

### Netlify Free (Starter):
```
✅ 100 GB bandwidth/month
✅ 300 build minutes/month
✅ Unlimited sites
✅ Auto SSL
✅ Global CDN
✅ Form handling
✅ Identity service

Kos: RM 0 / FREE
```

### Netlify Pro (Jika Perlu):
```
1 TB bandwidth/month
25,000 build minutes/month
Advanced analytics
Team collaboration

Kos: RM 80/month (~$19)
```

---

## 📱 Netlify vs Vercel

| Feature | Netlify | Vercel |
|---------|---------|--------|
| Kos | Percuma | Percuma |
| Bandwidth | 100 GB | Unlimited |
| Build time | 300 min | 6000 min |
| Setup | Mudah | Mudah |
| Next.js | ✅ | ✅ Optimized |
| Forms | ✅ Built-in | ❌ |
| Functions | ✅ | ✅ |

**Recommendation:**
- **Netlify:** Good for general sites, forms
- **Vercel:** Better for Next.js (optimized)

---

## 🔄 Migrate From Vercel to Netlify

Jika anda dah deploy di Vercel dan nak migrate:

1. **Netlify akan auto-detect settings**
2. **Import dari GitHub** (sama je)
3. **Deploy**
4. **Update DNS** (jika ada custom domain)

---

## 📞 Support

**Netlify Support:**
- Docs: https://docs.netlify.com
- Community: https://answers.netlify.com
- Twitter: @netlify

**Email:**
- support@jpnj.gov.my

---

## ✅ Checklist Success

Selepas deploy:

- [ ] Site accessible
- [ ] Login working
- [ ] Dashboard loads
- [ ] All features working
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] Fast loading
- [ ] No console errors

---

## 🎉 Tahniah!

Sistem anda kini online di Netlify!

**URL Demo:**
```
https://johorup-system.netlify.app
```

**Share dengan:**
- ✅ Pengurusan
- ✅ Penaja
- ✅ Team
- ✅ Stakeholders

---

## 📋 Quick Commands

```bash
# Install CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod

# Open site
netlify open:site

# View logs
netlify logs

# Link to existing site
netlify link
```

---

## 💡 Tips

1. **Enable build notifications** - Get email when deploy done
2. **Use deploy previews** - Test before production
3. **Enable analytics** - Track usage
4. **Setup redirects** - For better SEO
5. **Use forms** - Netlify has built-in form handling

---

## 🚀 Advanced Features

### Deploy Previews:

Setiap pull request dapat preview URL:
```
https://deploy-preview-[number]--johorup-system.netlify.app
```

### Split Testing:

Test different versions:
1. Site settings → Split testing
2. Create branch
3. Deploy both versions
4. Split traffic 50/50

### Functions:

Add serverless functions:
```javascript
// netlify/functions/hello.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" })
  };
};
```

---

**Selamat Berdemo di Netlify! 🚀**

Sistem JohorUP anda kini accessible dari seluruh dunia!

---

*Deploy with ❤️ on Netlify*
