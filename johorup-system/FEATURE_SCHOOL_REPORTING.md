# Sistem Laporan Program Sekolah

## Gambaran Keseluruhan
Sistem laporan program telah dibangunkan untuk membolehkan guru di sekolah mengisi pengisian program yang dilaksanakan, menandakan kehadiran murid, dan memuat naik gambar dokumentasi.

## Ciri-ciri Utama

### 1. Pengisian Program oleh Guru
- **Lokasi**: `/dashboard/school/reports`
- **Fungsi**: Guru boleh mengisi pengisian program yang telah dilaksanakan
- **Maklumat yang diperlukan**:
  - Program yang berkaitan
  - Tajuk sesi/program
  - Subjek (Bahasa Melayu, Sejarah, Matematik)
  - Nama guru pelaksana
  - Tempoh sesi (dalam jam)
  - Pengisian program yang dilaksanakan (terperinci)
  - Catatan tambahan

### 2. Penandaan Kehadiran Murid
- **Fungsi**: Tandakan kehadiran untuk setiap murid dalam program
- **Ciri**:
  - Senarai semua murid terlibat dalam program
  - Checkbox untuk menandakan kehadiran
  - Ruang catatan untuk murid yang tidak hadir
  - Simpan rekod kehadiran untuk setiap sesi

### 3. Muat Naik Gambar oleh Guru
- **Keperluan**: 3 gambar wajib untuk setiap program
- **Ciri**:
  - Upload 3 gambar pelaksanaan program
  - Tambah keterangan untuk setiap gambar
  - Dokumentasi visual aktiviti pembelajaran
  - Gambar hendaklah jelas dan menunjukkan aktiviti

### 4. Status Pengisian
- **Draf**: Pengisian yang belum dihantar
- **Dihantar**: Pengisian yang telah dihantar untuk semakan
- **Diluluskan**: Pengisian yang telah diluluskan oleh pihak atasan

## Navigasi Berdasarkan Peranan

### Peranan Sekolah (Dipermudahkan)
Menu yang dipermudahkan untuk sekolah:
- **Dashboard** - Gambaran keseluruhan sekolah
- **Senarai Murid Terlibat** - Senarai murid yang terlibat dalam program
- **Laporan Program** - Pengisian program oleh guru dan muat naik gambar

### Peranan Lain (PPD, Sektor)
Menu penuh:
- Dashboard
- Murid
- Guru
- Program
- Kalendar
- Kewangan
- Laporan

## Struktur Data

### ProgramReport
```typescript
interface ProgramReport {
  id: number;
  program_id: number;
  school_id: number;
  report_date: string;
  session_title: string;
  subject_id: number;
  teacher_name: string;
  duration_hours: number;
  topics_covered: string;
  notes?: string;
  status: 'draft' | 'submitted' | 'approved';
  submitted_by: number;
  submitted_date?: string;
}
```

### StudentAttendance
```typescript
interface StudentAttendance {
  id: number;
  program_report_id: number;
  student_id: number;
  present: boolean;
  notes?: string;
}
```

### ProgramPhoto
```typescript
interface ProgramPhoto {
  id: number;
  program_report_id: number;
  photo_url: string;
  caption?: string;
  uploaded_date: string;
}
```

## Fail-fail yang Ditambah/Diubah

### Fail Baru
1. `app/dashboard/school/reports/page.tsx` - Halaman utama pelaporan tuisyen
2. `app/dashboard/school/page.tsx` - Dashboard khas sekolah
3. `FEATURE_SCHOOL_REPORTING.md` - Dokumentasi ciri ini

### Fail yang Diubah
1. `lib/types.ts` - Tambah interface baru untuk pelaporan
2. `lib/mockData.ts` - Tambah data contoh untuk laporan, kehadiran, dan gambar
3. `components/NavigationBar.tsx` - Navigasi dipermudahkan berdasarkan peranan pengguna
4. `components/MobileNav.tsx` - Navigasi mobile dipermudahkan berdasarkan peranan

## Cara Penggunaan

### Untuk Guru di Sekolah
1. Log masuk dengan akaun sekolah
2. Pergi ke "Laporan Program" dalam menu
3. Klik "Pengisian Baru" untuk mengisi program yang dilaksanakan
4. Isi maklumat program secara terperinci
5. Tandakan kehadiran murid terlibat
6. Muat naik 3 gambar dokumentasi program
7. Hantar pengisian untuk kelulusan

### Untuk Pentadbir/PPD
1. Akses laporan sekolah melalui sistem sedia ada
2. Semak dan luluskan pengisian yang dihantar
3. Pantau statistik kehadiran dan pelaksanaan program

## Statistik Dashboard Sekolah
- Jumlah murid terlibat dalam program
- Bilangan pengisian program (total, dihantar, diluluskan)
- Kadar kehadiran keseluruhan
- Bilangan gambar yang telah dimuat naik
- Status pengisian (draf, dihantar, diluluskan)
- Senarai program aktif
- Pengisian program terkini

## Keselamatan dan Validasi
- Hanya sekolah boleh akses halaman pengisian mereka
- Validasi data input (tempoh sesi, subjek, dll.)
- Keperluan wajib 3 gambar per pengisian
- Status pengisian dikawal dengan ketat

## Integrasi dengan Sistem Sedia Ada
- Menggunakan data murid, program, dan subjek sedia ada
- Navigasi disesuaikan berdasarkan peranan pengguna (3 menu sahaja untuk sekolah)
- Dashboard utama menunjukkan statistik berkaitan
- Sistem kebenaran berdasarkan peranan pengguna

## Fokus Utama untuk Sekolah
Sistem ini direka khusus untuk memudahkan guru di sekolah:
1. **Pengisian Program** - Guru mengisi secara terperinci program yang telah dilaksanakan
2. **Dokumentasi Visual** - Muat naik gambar yang menunjukkan pelaksanaan program
3. **Pengurusan Kehadiran** - Rekod kehadiran murid yang terlibat dalam program
4. **Interface Mudah** - Hanya 3 menu utama untuk fokus yang jelas

## Halaman Analisis Perkembangan

### Lokasi
`/dashboard/school/progress`

### Ciri-ciri Utama
1. **Statistik Keseluruhan**
   - Jumlah murid sekolah
   - Kadar kelulusan keseluruhan
   - Bilangan murid cemerlang (lulus semua subjek)
   - Bilangan murid perlu bimbingan

2. **Prestasi Mengikut Subjek**
   - Kadar kelulusan untuk setiap subjek (BM, Sejarah, Matematik)
   - Graf bar menunjukkan prestasi relatif
   - Bilangan murid lulus vs jumlah murid

3. **Taburan Gred**
   - Paparan visual taburan gred (A+ hingga TH)
   - Kod warna untuk setiap gred
   - Bilangan murid untuk setiap gred

4. **Jadual Prestasi Individu**
   - Senarai semua murid dengan gred setiap subjek
   - Status keseluruhan (Lulus Semua, Lulus Sebahagian, Tidak Lulus)
   - Penapis mengikut subjek

5. **Cadangan Tindakan**
   - Cadangan untuk murid cemerlang
   - Cadangan untuk murid perlu bimbingan
   - Strategi pengayaan dan pemulihan

### Analisis yang Disediakan
- Kadar kelulusan keseluruhan dan mengikut subjek
- Identifikasi murid cemerlang dan yang perlu bimbingan
- Taburan gred untuk analisis prestasi
- Cadangan tindakan berdasarkan prestasi

### Manfaat untuk Sekolah
- Pemantauan prestasi murid secara menyeluruh
- Identifikasi awal murid yang perlu bantuan
- Data untuk merancang program pemulihan
- Laporan prestasi untuk pihak pengurusan