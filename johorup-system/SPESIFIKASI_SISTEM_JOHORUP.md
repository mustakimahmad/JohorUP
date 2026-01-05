# SPESIFIKASI SISTEM JOHORUP
## Sistem Pengurusan Pendidikan Negeri Johor

---

## 1. OBJEKTIF SISTEM

### 1.1 Objektif Utama
Sistem JohorUP adalah platform digital komprehensif yang direka untuk meningkatkan kualiti pendidikan di Negeri Johor melalui:

- **Pengurusan Data Terpusat**: Mengintegrasikan data murid, guru, sekolah, dan prestasi akademik dalam satu platform
- **Pemantauan Prestasi Real-time**: Membolehkan pemantauan prestasi murid dan sekolah secara berterusan
- **Analisis Strategik**: Menyediakan analisis mendalam untuk membuat keputusan berasaskan data
- **Ketelusan dan Akauntabiliti**: Memastikan ketelusan dalam pengurusan pendidikan melalui audit trail yang komprehensif

### 1.2 Objektif Khusus
1. **Meningkatkan Prestasi Akademik**: Melalui pemantauan berterusan dan intervensi tepat masa
2. **Optimasi Sumber**: Memastikan penggunaan sumber pendidikan yang optimum
3. **Standardisasi Proses**: Menyeragamkan proses pengurusan di semua peringkat
4. **Kemudahan Akses**: Menyediakan akses mudah kepada maklumat pendidikan untuk semua stakeholder

---

## 2. SKOP SISTEM

### 2.1 Cakupan Geografi
- **Negeri Johor** - Kesemua 10 Pejabat Pendidikan Daerah (PPD)
- **247 Pengguna Aktif** merentas 9 peringkat organisasi
- **Integrasi Penuh** dengan struktur pentadbiran pendidikan negeri

### 2.2 Peringkat Organisasi
```
1. Strategic Level (Yayasan/S4PD)
   ├── Super Admin
   └── Strategic Admin

2. Tactical Level (SPB/SPM)
   ├── Admin SPB
   ├── Admin SPM
   └── PPD Users

3. Operational Level
   ├── SISC+ (Subject Specialists)
   ├── School Administrators
   └── Teachers
```

---

## 3. ARKITEKTUR SISTEM

### 3.1 Teknologi Utama
- **Frontend**: Next.js 14 dengan TypeScript
- **Backend**: Netlify Functions (Serverless)
- **Database**: Neon PostgreSQL (Cloud)
- **Deployment**: Netlify dengan CDN global
- **Authentication**: Database-based dengan session management

### 3.2 Struktur Database
```sql
-- Struktur Hierarki Organisasi
├── users (Pengguna sistem)
├── ppd (Pejabat Pendidikan Daerah)
├── schools (Sekolah)
├── students (Murid)
├── teachers (Guru)
├── subjects (Subjek)
├── exam_results (Keputusan Peperiksaan)
└── audit_logs (Jejak Audit)
```

### 3.3 Keselamatan
- **Role-based Access Control (RBAC)**: 9 peringkat akses berbeza
- **Data Isolation**: Setiap pengguna hanya dapat mengakses data dalam skop mereka
- **Audit Trail**: Semua aktiviti direkod untuk ketelusan
- **Session Management**: Pengurusan sesi yang selamat

---

## 4. MODUL UTAMA SISTEM

### 4.1 Modul Pengurusan Pengguna
- **Hierarki Pengguna**: Pengurusan pengguna berdasarkan struktur organisasi
- **Penetapan Peranan**: Sistem peranan yang fleksibel dan terperinci
- **Pengurusan Akses**: Kawalan akses berdasarkan peranan dan skop

### 4.2 Modul Data Murid
- **Profil Murid**: Maklumat lengkap murid termasuk demografi
- **Keputusan Peperiksaan**: Rekod prestasi akademik
- **Pemantauan Kemajuan**: Analisis trend prestasi
- **Laporan Prestasi**: Laporan terperinci mengikut peringkat

### 4.3 Modul Analisis dan Laporan
- **Dashboard Strategik**: Paparan maklumat eksekutif
- **Analisis KPI**: Pemantauan petunjuk prestasi utama
- **Laporan Tuisyen**: Analisis program tuisyen
- **Analisis Impak**: Penilaian keberkesanan program

### 4.4 Modul Kalendar dan Program
- **Kalendar Akademik**: Pengurusan jadual akademik
- **Program Khas**: Pengurusan program pendidikan khas
- **Pemantauan Guru**: Sistem pemantauan prestasi guru

---

## 5. PERANAN DAN AKSES PENGGUNA

### 5.1 Strategic Level
**Super Admin (strategic_super_admin)**
- Akses penuh kepada semua data dan fungsi sistem
- Pengurusan pengguna peringkat tertinggi
- Konfigurasi sistem dan dasar

**Strategic Admin (strategic_admin)**
- Akses kepada data strategik dan laporan eksekutif
- Pemantauan prestasi keseluruhan negeri
- Analisis trend dan pattern

### 5.2 Tactical Level
**Admin SPB (tactical_spb)**
- Pengurusan data peringkat SPB
- Pemantauan sekolah dalam bidang kuasa
- Laporan prestasi daerah

**Admin SPM (tactical_spm)**
- Fokus kepada data SPM dan prestasi tingkatan 5
- Analisis keputusan peperiksaan awam
- Strategi peningkatan prestasi

**PPD User (tactical_ppd)**
- Pengurusan data dalam PPD masing-masing
- Pemantauan sekolah dalam daerah
- Koordinasi program daerah

### 5.3 Operational Level
**SISC+ (coaching_sisc)**
- Fokus kepada subjek khusus
- Pemantauan prestasi subjek
- Sokongan teknikal kepada guru

**School Admin (operational_school)**
- Pengurusan data sekolah
- Pemantauan prestasi murid sekolah
- Koordinasi aktiviti sekolah

**Teacher (operational_teacher)**
- Akses kepada data murid dalam kelas
- Input keputusan peperiksaan
- Pemantauan kemajuan murid

---

## 6. CIRI-CIRI KHUSUS

### 6.1 Sistem Dwibahasa
- **Bahasa Melayu**: Bahasa utama sistem
- **Bahasa Inggeris**: Sokongan untuk istilah teknikal
- **Interface Adaptif**: Menyesuaikan dengan keutamaan pengguna

### 6.2 Tempoh Pertukaran Data
- **Tempoh Aktif**: 15 Januari - 15 Mac (Pertukaran data dibenarkan)
- **Tempoh Terhad**: Mac - Januari (Hanya paparan data)
- **Kawalan Automatik**: Sistem mengawal akses berdasarkan tempoh

### 6.3 Audit Trail Komprehensif
- **Rekod Aktiviti**: Semua tindakan pengguna direkod
- **Jejak Perubahan**: Perubahan data dengan timestamp
- **Laporan Audit**: Laporan aktiviti untuk ketelusan

### 6.4 Export dan Import Data
- **Format Excel**: Sokongan import/export Excel
- **Template Standard**: Template yang diseragamkan
- **Validasi Data**: Pengesahan data semasa import

---

## 7. INTEGRASI DAN API

### 7.1 API Endpoints
```
/api/auth/login          - Pengesahan pengguna
/api/user-hierarchy      - Data hierarki pengguna
/api/admin-users         - Pengurusan pengguna admin
/api/get-user-data       - Data berdasarkan peranan
/api/setup-hierarchy     - Setup struktur organisasi
```

### 7.2 Integrasi Eksternal
- **MOE Systems**: Integrasi dengan sistem KPM (dirancang)
- **Third-party Tools**: API terbuka untuk integrasi masa depan

---

## 8. KESELAMATAN DAN PRIVASI

### 8.1 Perlindungan Data
- **Encryption**: Data sensitif dienkripsi
- **Access Control**: Kawalan akses berlapis
- **Data Masking**: Penyembunyian data sensitif
- **Backup**: Sandaran data automatik

### 8.2 Compliance
- **PDPA Compliance**: Mematuhi Akta Perlindungan Data Peribadi
- **Government Standards**: Mengikut piawaian kerajaan
- **Security Audit**: Audit keselamatan berkala

---

## 9. DEPLOYMENT DAN INFRASTRUKTUR

### 9.1 Production Environment
- **URL**: https://johorup.netlify.app
- **CDN**: Netlify Global CDN
- **Database**: Neon PostgreSQL (Cloud)
- **Monitoring**: Real-time monitoring dan alerting

### 9.2 Development Environment
- **Local Development**: http://localhost:3000
- **Testing**: Automated testing pipeline
- **Staging**: Pre-production testing environment

---

## 10. ROADMAP DAN PEMBANGUNAN MASA DEPAN

### 10.1 Fasa 1 (Selesai)
- ✅ Sistem pengurusan pengguna hierarki
- ✅ Database authentication
- ✅ Role-based access control
- ✅ Audit trail implementation
- ✅ Production deployment

### 10.2 Fasa 2 (Dalam Pembangunan)
- 🔄 Hierarchical data filtering
- 🔄 Advanced reporting system
- 🔄 Mobile responsive optimization
- 🔄 Performance optimization

### 10.3 Fasa 3 (Dirancang)
- 📋 Advanced analytics dan AI
- 📋 Mobile application
- 📋 Integration dengan sistem KPM

---

## 11. SOKONGAN DAN PENYELENGGARAAN

### 11.1 Sokongan Teknikal
- **24/7 Monitoring**: Pemantauan sistem berterusan
- **Help Desk**: Sokongan pengguna
- **Documentation**: Dokumentasi lengkap
- **Training**: Latihan pengguna

### 11.2 Penyelenggaraan
- **Regular Updates**: Kemaskini berkala
- **Security Patches**: Patch keselamatan
- **Performance Tuning**: Optimasi prestasi
- **Backup Management**: Pengurusan sandaran

---

**Dokumen ini adalah spesifikasi rasmi Sistem JohorUP dan akan dikemaskini mengikut perkembangan sistem.**

*Tarikh Kemaskini: 2 Januari 2026*
*Versi: 2.0*