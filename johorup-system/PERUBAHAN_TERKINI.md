# Perubahan Terkini - Sistem JohorUP

## Tarikh: 6 Disember 2025

### 🎯 Perubahan Utama

Sistem telah dikemaskini mengikut keperluan baru:

## 1. Dashboard Sekolah (Khusus untuk Peranan Sekolah)

### URL: `/dashboard/school`

**Perubahan:**
- ✅ Sekolah hanya dapat akses dashboard murid mereka sahaja
- ✅ **TIADA paparan kewangan** untuk pengguna sekolah
- ✅ Fokus kepada analisis perkembangan murid
- ✅ Graf perkembangan dari Tingkatan 4 hingga Percubaan SPM

**Features:**
1. **Statistik Sekolah**
   - Jumlah murid sasaran
   - Purata markah Tingkatan 4
   - Purata markah Percubaan SPM
   - Peratusan peningkatan

2. **Graf Perkembangan**
   - Bar chart menunjukkan progress dari:
     - Tingkatan 4 (Nov 2025)
     - Pertengahan Tahun (Mei 2026)
     - Percubaan SPM (Sep 2026)
   - Paparan peratusan peningkatan untuk setiap peringkat

3. **Kategori Pencapaian Murid**
   - Cemerlang (80-100): Murid berprestasi tinggi
   - Baik (65-79): Murid prestasi baik
   - Sederhana (50-64): Murid sederhana
   - Perlu Perhatian (<50): Murid berisiko

4. **Pencapaian Mengikut Subjek**
   - Bahasa Melayu dengan % peningkatan
   - Sejarah dengan % peningkatan
   - Matematik dengan % peningkatan

5. **Senarai Murid Berpencapaian Tertinggi**
   - Top 10 murid dengan peningkatan terbaik
   - Perbandingan markah Tingkatan 4 vs Percubaan

**Login:**
- Email: sekolah1@moe.gov.my
- Password: demo123
- Auto redirect ke: `/dashboard/school`

---

## 2. Dashboard Koordinator (Sektor Perancangan & Pengurusan PPD)

### URL: `/dashboard/coordinator`

**Perubahan:**
- ✅ Fungsi semak baki kewangan
- ✅ Fungsi lulus/tolak program
- ✅ Fungsi turunkan geran kewangan
- ✅ Paparan program menunggu kelulusan

**Features:**

### A. Overview Kewangan
5 kad statistik:
1. **Jumlah Peruntukan**: RM 450,000
2. **Diluluskan**: Jumlah program yang telah diluluskan
3. **Dibelanjakan**: Jumlah yang telah digunakan
4. **Menunggu Kelulusan**: Program pending approval
5. **Baki**: Peruntukan yang masih ada

### B. Program Menunggu Kelulusan
Table dengan:
- Nama program
- Penerangan
- Jumlah permohonan (RM)
- Dikemukakan oleh (Sektor Pembelajaran)
- **Tindakan:**
  - Butang "Lulus" (hijau)
  - Butang "Tolak" (merah)

### C. Program Diluluskan - Sedia Untuk Pengeluaran Geran
Table dengan:
- Nama program
- Jumlah (RM)
- Status: Diluluskan
- Tarikh diluluskan
- **Tindakan:**
  - Butang "Turunkan Geran" (biru)

### D. Modal Pengesahan Pengeluaran Geran
Apabila klik "Turunkan Geran":
- Paparan maklumat program
- Jumlah geran
- Penerangan
- Amaran: Pastikan dokumen lengkap
- Butang "Sahkan Pengeluaran"
- Butang "Batal"

**Login:**
- Email: perancangan@jpnj.gov.my
- Password: demo123
- Auto redirect ke: `/dashboard/coordinator`

---

## 3. Dashboard Utama (Untuk PPD & Sektor Pembelajaran)

### URL: `/dashboard`

**Perubahan:**
- ✅ Tambah graf trend perkembangan murid
- ✅ Visualisasi yang lebih baik

**Graf Baru:**

### Trend Perkembangan Murid
Bar chart horizontal menunjukkan:
1. **Tingkatan 4 (Nov 2025)**: 42.0% - Orange
2. **Pertengahan Tahun (Mei 2026)**: 52.5% (+10.5%) - Yellow
3. **Percubaan SPM (Sep 2026)**: 61.8% (+19.8%) - Green
4. **Target SPM 2026**: 67.0% - Blue

Setiap bar menunjukkan:
- Peratusan pencapaian
- Peningkatan dari baseline
- Warna berbeza untuk setiap peringkat

**Login:**
- PPD: ppd.jb@moe.gov.my
- Sektor: pembelajaran@jpnj.gov.my
- Password: demo123

---

## 4. Workflow Approval System

### Status Bajet Baru:
- `planned` - Dirancang
- `pending_approval` - Menunggu kelulusan ⭐ BARU
- `approved` - Diluluskan
- `spent` - Dibelanjakan

### Aliran Kerja:
```
Sektor Pembelajaran
    ↓ (Kemukakan Program)
    
Status: pending_approval
    ↓
    
Sektor Perancangan (Koordinator)
    ↓ (Semak & Lulus/Tolak)
    
Status: approved
    ↓
    
Sektor Perancangan (Koordinator)
    ↓ (Turunkan Geran)
    
Status: disbursed
    ↓
    
Pelaksanaan Program
```

---

## 5. Struktur File Baru

```
johorup-system/
├── app/
│   ├── dashboard/
│   │   ├── school/              ⭐ BARU - Dashboard sekolah
│   │   │   └── page.tsx
│   │   ├── coordinator/         ⭐ BARU - Dashboard koordinator
│   │   │   └── page.tsx
│   │   ├── page.tsx            (Updated - Graf baru)
│   │   ├── students/
│   │   ├── programs/
│   │   ├── budget/
│   │   └── reports/
│   └── login/
│       └── page.tsx            (Updated - Role-based redirect)
├── lib/
│   ├── types.ts                (Updated - Budget & Grant types)
│   └── mockData.ts             (Updated - Status baru)
└── docs/
    ├── WORKFLOW_APPROVAL.md    ⭐ BARU - Panduan workflow
    └── PERUBAHAN_TERKINI.md    ⭐ BARU - Dokumen ini
```

---

## 6. Role-Based Access Control (Updated)

| Feature | Sekolah | PPD | Sektor Pembelajaran | Sektor Perancangan |
|---------|---------|-----|---------------------|-------------------|
| Dashboard | Sekolah sahaja | Semua | Semua | Semua |
| Analisis perkembangan | ✅ | ✅ | ✅ | ✅ |
| Graf perkembangan | ✅ | ✅ | ✅ | ✅ |
| Data murid | Sekolah sahaja | Daerah | Semua | Semua |
| View kewangan | ❌ | ❌ | ✅ | ✅ |
| Kemukakan program | ❌ | ✅ | ✅ | ❌ |
| **Lulus program** | ❌ | ❌ | ❌ | ✅ ⭐ |
| **Turunkan geran** | ❌ | ❌ | ❌ | ✅ ⭐ |
| **Semak baki** | ❌ | ❌ | ❌ | ✅ ⭐ |

---

## 7. Testing

### Test Scenario 1: Login Sebagai Sekolah
1. Login: sekolah1@moe.gov.my / demo123
2. Redirect ke: `/dashboard/school`
3. Verify: Tiada menu kewangan
4. Verify: Ada graf perkembangan murid
5. Verify: Ada analisis peningkatan %

### Test Scenario 2: Login Sebagai Koordinator
1. Login: perancangan@jpnj.gov.my / demo123
2. Redirect ke: `/dashboard/coordinator`
3. Verify: Ada senarai program pending approval
4. Klik "Lulus" pada program
5. Verify: Program hilang dari pending list
6. Verify: Program muncul di "Sedia Untuk Pengeluaran Geran"
7. Klik "Turunkan Geran"
8. Verify: Modal muncul dengan maklumat
9. Klik "Sahkan Pengeluaran"
10. Verify: Alert confirmation

### Test Scenario 3: Graf Perkembangan
1. Login: ppd.jb@moe.gov.my / demo123
2. Pergi ke dashboard utama
3. Verify: Ada graf "Trend Perkembangan Murid"
4. Verify: 4 bar dengan warna berbeza
5. Verify: Peratusan peningkatan ditunjukkan

---

## 8. Dependencies Baru

```json
{
  "recharts": "^2.x.x"  // Untuk graf (optional, belum digunakan sepenuhnya)
}
```

---

## 9. Next Steps (Cadangan)

### Untuk Production:
1. ✅ Integrate dengan PostgreSQL database
2. ✅ Implement real authentication (JWT)
3. ✅ Add email notifications untuk approval
4. ✅ Add audit trail untuk semua approval
5. ✅ Add document upload untuk program proposal
6. ✅ Add real-time notifications
7. ✅ Add export to Excel/PDF
8. ✅ Add more detailed analytics

### Untuk Enhancement:
1. ✅ Add program evaluation form
2. ✅ Add student attendance tracking
3. ✅ Add program effectiveness metrics
4. ✅ Add budget forecasting
5. ✅ Add mobile responsive improvements
6. ✅ Add dark mode
7. ✅ Add multi-language support

---

## 10. Dokumentasi

Semua dokumentasi telah dikemaskini:
- ✅ README.md - Overview sistem
- ✅ SETUP.md - Panduan setup
- ✅ PANDUAN_PENGGUNA.md - Manual pengguna
- ✅ API_DOCUMENTATION.md - API reference
- ✅ WORKFLOW_APPROVAL.md - Panduan workflow approval ⭐ BARU
- ✅ PERUBAHAN_TERKINI.md - Dokumen ini ⭐ BARU

---

## 📞 Sokongan

Untuk pertanyaan atau masalah:
- Email: support@jpnj.gov.my
- Tel: 07-XXX XXXX

---

**Sistem JohorUP v1.1**  
**Dikemaskini:** 6 Disember 2025  
**Status:** Ready for Demo/Testing
