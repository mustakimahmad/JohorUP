# 🧹 Panduan Reset Lengkap JohorUP System

## ⚡ Cara Paling Mudah (Recommended)

```bash
npm run complete:reset
```

**Apa yang berlaku:**
1. ✅ Browser akan buka automatik dengan halaman reset
2. ✅ Semua localStorage/sessionStorage akan dibersihkan
3. ✅ Cache browser akan dibersihkan
4. ✅ Data mockup (guru, laporan, tuisyen, analisis) akan dibuang
5. ✅ Anda akan dialihkan ke dashboard yang bersih

**⚠️ PENTING: Selepas reset, restart development server:**
```bash
# Hentikan server (Ctrl+C) kemudian:
npm run dev
```

## 📋 Login Selepas Reset

- **Email:** admin@jpnj.gov.my
- **Password:** AdminPass123!

**Atau:**
- **Email:** koordinator@jpnj.gov.my
- **Password:** AdminPass123!

## 🔧 Cara Manual (Jika Perlu)

### 1. Reset Data Sahaja
```bash
npm run clear:mockup
```

### 2. Clear Browser Cache
```bash
npm run clear:cache
```

### 3. Restart Server
```bash
# Hentikan server (Ctrl+C) kemudian:
npm run dev
```

## 🚫 Data Yang Dibuang

- ❌ Semua sekolah mockup (20 → 0)
- ❌ Semua murid mockup (880 → 0)  
- ❌ Semua guru mockup (120 → 0)
- ❌ Semua program mockup (3 → 0)
- ❌ Semua laporan tuisyen mockup
- ❌ Semua data KPI guru mockup
- ❌ Semua kehadiran murid mockup
- ❌ Semua foto program mockup
- ❌ User yayasan@jcorp.com.my
- ❌ Halaman yayasan-overview
- ❌ Menu navigasi yayasan

## ✅ Data Yang Dikekalkan

- ✅ PPD (Pejabat Pendidikan Daerah)
- ✅ Subjek (BM, Sejarah, Matematik)
- ✅ 2 admin users sahaja
- ✅ Struktur sistem

## 🆘 Jika Masih Ada Data Lama

### Browser Manual Clear:
1. Tekan **F12** (Developer Tools)
2. Pergi ke **Console** tab
3. Type dan tekan Enter:
```javascript
localStorage.clear(); sessionStorage.clear(); location.reload();
```

### Hard Refresh:
- **Windows:** Ctrl + Shift + R
- **Mac:** Cmd + Shift + R

### Clear Browser Data:
- **Chrome/Edge:** Ctrl + Shift + Delete
- **Firefox:** Ctrl + Shift + Delete

## 📊 Verification

Selepas reset, dashboard sepatutnya menunjukkan:
- **Jumlah Sekolah:** 0
- **Jumlah Murid:** 0
- **Jumlah Guru:** 0
- **Jumlah Program:** 0
- **Budget:** RM 0

## ⚠️ Troubleshooting

### Masalah: Masih nampak data lama
**Penyelesaian:** Jalankan `npm run complete:reset` sekali lagi

### Masalah: Login gagal
**Penyelesaian:** 
- Pastikan password: `AdminPass123!`
- Clear browser cache
- Restart browser

### Masalah: Server tidak respond
**Penyelesaian:**
```bash
# Hentikan server (Ctrl+C)
npm run dev
```

---

**💡 Tip:** Gunakan `npm run complete:reset` untuk reset yang paling lengkap dan mudah!