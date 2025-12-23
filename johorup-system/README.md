# JohorUP - Sistem Pemantauan Program SPM 2026

Sistem dashboard untuk memantau program bimbingan murid Tingkatan 5 yang akan menduduki SPM 2026 di Negeri Johor.

## 📋 Tentang Sistem

Program JohorUP ditaja oleh JCorp dan Yayasan Hasanah dengan peruntukan RM450,000. Sistem ini melibatkan:
- **880 murid** dari 20 sekolah di seluruh Johor
- **3 subjek kritikal**: Bahasa Melayu, Sejarah, dan Matematik
- **4 peranan pengguna**: Sekolah, PPD, Sektor Pembelajaran, dan Sektor Perancangan

## 🚀 Cara Menjalankan Sistem

### Prasyarat
- Node.js 18+ 
- npm atau yarn

### Langkah-langkah

1. **Install dependencies**
```bash
cd johorup-system
npm install
```

2. **Jalankan development server**
```bash
npm run dev
```

3. **Buka browser**
```
http://localhost:3000
```

## 👥 Demo Accounts

Untuk login, gunakan mana-mana email di bawah dengan password: `demo123`

| Peranan | Email | Akses | Dashboard |
|---------|-------|-------|-----------|
| 🏫 Sekolah | sekolah1@moe.gov.my | Data murid sekolah sendiri sahaja | /dashboard/school |
| 🏢 PPD | ppd.jb@moe.gov.my | Sekolah dalam daerah | /dashboard |
| 📚 Sektor Pembelajaran | pembelajaran@jpnj.gov.my | Semua data + program | /dashboard |
| ⭐ **Koordinator (ANDA)** | **koordinator@jpnj.gov.my** | **Full access + approval + geran** | **/dashboard/coordinator** |

**Nota:** Account koordinator adalah untuk Sektor Perancangan & Pengurusan PPD dengan akses penuh untuk meluluskan program dan menurunkan geran.

## 📊 Features

### 1. Dashboard Utama
- Statistik keseluruhan (murid, sekolah, bajet)
- Kadar kelulusan semasa untuk 3 subjek
- Peruntukan bajet mengikut program
- Senarai program terkini

### 2. Pengurusan Murid
- Senarai 880 murid sasaran
- Data gred untuk BM, Sejarah, Matematik
- Filter mengikut sekolah
- Carian murid

### 3. Pengurusan Program
- Tambah program bimbingan
- Jadual program
- Tracking peserta
- Anggaran kos

### 4. Pengurusan Kewangan
- Peruntukan RM450,000
- Tracking perbelanjaan
- Status approval
- Laporan kewangan

### 5. Laporan & Analytics
- Trend pencapaian murid
- Perbandingan sekolah
- Keberkesanan program
- Export laporan

## 🗄️ Database Schema

Sistem menggunakan PostgreSQL dengan tables:
- `users` - Authentication & roles
- `ppd` - Pejabat Pendidikan Daerah
- `schools` - 20 sekolah
- `students` - 880 murid
- `subjects` - BM, Sejarah, Matematik
- `grades` - Gred murid (Tingkatan 4, Mid-year, Trial, SPM)
- `programs` - Program bimbingan
- `budget` - Peruntukan kewangan
- `program_participants` - Peserta program

SQL schema tersedia di: `lib/db/schema.sql`

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (untuk production)
- **Authentication**: JWT (untuk production)
- **Mock Data**: Untuk prototype demo

## 📁 Struktur Projek

```
johorup-system/
├── app/
│   ├── page.tsx              # Redirect ke login
│   ├── login/                # Login page
│   └── dashboard/            # Dashboard pages
│       ├── page.tsx          # Main dashboard
│       ├── students/         # Pengurusan murid
│       ├── programs/         # Pengurusan program
│       └── budget/           # Pengurusan kewangan
├── lib/
│   ├── types.ts              # TypeScript types
│   ├── mockData.ts           # Demo data
│   ├── auth.ts               # Authentication helpers
│   └── db/
│       └── schema.sql        # Database schema
└── README.md
```

## 🔐 Role-Based Access Control

| Feature | Sekolah | PPD | Sektor Pembelajaran | Sektor Perancangan |
|---------|---------|-----|---------------------|-------------------|
| View dashboard | ✅ (sekolah sahaja) | ✅ | ✅ | ✅ |
| Analisis perkembangan murid | ✅ | ✅ | ✅ | ✅ |
| Input data murid | ✅ | ❌ | ❌ | ❌ |
| View semua sekolah | ❌ | ✅ (daerah) | ✅ | ✅ |
| Tambah program | ❌ | ✅ | ✅ | ✅ |
| View kewangan | ❌ | ❌ | ✅ | ✅ |
| Lulus program | ❌ | ❌ | ❌ | ✅ |
| Turunkan geran | ❌ | ❌ | ❌ | ✅ |
| Full reports | ❌ | ❌ | ❌ | ✅ |

## 📈 Roadmap

### Phase 1 (Prototype) ✅
- Basic dashboard
- Mock data
- Login system
- Student listing
- Program management

### Phase 2 (Production)
- [ ] PostgreSQL integration
- [ ] Real authentication (JWT)
- [ ] File upload (import Excel)
- [ ] Advanced reporting
- [ ] Email notifications

### Phase 3 (Enhancement)
- [ ] Mobile app
- [ ] Real-time updates
- [ ] Analytics dashboard
- [ ] Export to PDF
- [ ] Integration dengan EMIS

## 🤝 Support

Untuk sokongan teknikal atau pertanyaan, hubungi:
- Sektor Perancangan dan Pengurusan PPD
- Jabatan Pendidikan Negeri Johor

## 📝 License

Sistem ini adalah hak milik Jabatan Pendidikan Negeri Johor.
