# Sistem Analisis Laporan Kelas Tambahan

## Gambaran Keseluruhan
Halaman analisis laporan kelas tambahan khusus untuk peranan PPD dan Jabatan (Sektor Pembelajaran & Sektor Perancangan) untuk memantau dan menganalisis prestasi tuisyen di semua sekolah.

## Lokasi Halaman
`/dashboard/tuition-analysis`

## Akses Peranan
- ✅ **PPD** - Boleh akses dan lihat analisis
- ✅ **Sektor Pembelajaran** - Boleh akses dan lihat analisis  
- ✅ **Sektor Perancangan** - Boleh akses dan lihat analisis
- ❌ **Sekolah** - Tidak boleh akses (akan redirect ke dashboard sekolah)

## Ciri-ciri Utama

### 1. Penapis Analisis
**Penapis Tersedia:**
- **PPD** - Pilih PPD tertentu atau semua PPD
- **Sekolah** - Pilih sekolah tertentu atau semua sekolah
- **Subjek** - Pilih subjek tertentu (BM, Sejarah, Matematik) atau semua
- **Tempoh** - Pilih tempoh analisis (bulan ini, 3 bulan lepas, tahun ini, atau semua)

**Fungsi Penapis:**
- Penapis bersifat dinamik dan saling berkaitan
- Pilihan sekolah akan berubah berdasarkan PPD yang dipilih
- Data akan dikemas kini secara automatik berdasarkan penapis

### 2. Statistik Keseluruhan
**4 Kad Statistik Utama:**
- **Jumlah Laporan** - Bilangan total laporan tuisyen yang dihantar
- **Jumlah Sesi** - Bilangan total sesi tuisyen yang dilaksanakan
- **Murid Terlibat** - Jumlah murid yang terlibat dalam program
- **Purata Kehadiran** - Kadar kehadiran keseluruhan (dalam peratusan)

### 3. Analisis Trend dan Prestasi

#### **Trend Bulanan**
- Graf trend laporan dan kehadiran mengikut bulan
- Menunjukkan bilangan laporan dan peratusan kehadiran
- Visualisasi bar chart untuk mudah difahami

#### **Analisis Mengikut Subjek**
- Prestasi setiap subjek (Bahasa Melayu, Sejarah, Matematik)
- Bilangan laporan, guru aktif, dan sekolah yang terlibat
- Kadar kehadiran purata untuk setiap subjek

### 4. Jadual Prestasi Sekolah
**Maklumat yang Dipaparkan:**
- Nama sekolah dan PPD
- Bilangan laporan dan sesi yang dilaksanakan
- Bilangan guru aktif yang terlibat
- Kadar kehadiran purata
- Status prestasi (Cemerlang/Baik/Perlu Perhatian)

**Kod Warna Status:**
- 🟢 **Cemerlang** (≥90%) - Hijau
- 🟡 **Baik** (80-89%) - Kuning  
- 🔴 **Perlu Perhatian** (<80%) - Merah

### 5. Jadual Prestasi Guru
**Maklumat yang Dipaparkan:**
- Nama guru, sekolah, dan subjek yang diajar
- Bilangan laporan dan sesi yang dilaksanakan
- Kadar kehadiran purata murid
- Status prestasi guru

**Ciri Khas:**
- Menunjukkan 20 guru teratas berdasarkan penapis
- Boleh ditapis mengikut PPD, sekolah, dan subjek
- Status prestasi dengan kod warna yang sama

### 6. Analisis Alasan Ketidakhadiran
**4 Kategori Alasan:**
- **Cuti sakit** - Murid sakit atau cuti medis
- **Terlibat program sekolah** - Aktiviti sekolah lain
- **Mewakili sekolah ke pertandingan** - Pertandingan atau aktiviti luar
- **Tidak hadir tanpa kenyataan** - Tanpa alasan yang jelas

**Paparan Data:**
- Bilangan murid untuk setiap kategori
- Peratusan daripada jumlah ketidakhadiran
- Graf bar untuk visualisasi
- Analisis trend alasan ketidakhadiran

## Navigasi Sistem

### Menu untuk PPD dan Jabatan (8 Menu)
1. **Dashboard** - Gambaran keseluruhan
2. **Murid** - Data murid
3. **Guru** - Data guru dan KPI
4. **Program** - Program yang dilaksanakan
5. **Kalendar** - Kalendar program
6. **🆕 Analisis Tuisyen** - Analisis laporan kelas tambahan
7. **Kewangan** - Pengurusan bajet
8. **Laporan** - Laporan keseluruhan

### Menu untuk Sekolah (3 Menu)
1. **Dashboard** - Gambaran sekolah
2. **Senarai Nama Murid** - Murid sekolah
3. **Analisis Perkembangan Murid** - Prestasi murid
4. **Laporan** - Laporan tuisyen sekolah

## Manfaat Sistem

### Untuk PPD:
- Pemantauan prestasi sekolah dalam kawasan PPD
- Identifikasi sekolah yang perlu sokongan tambahan
- Analisis trend kehadiran dan pelaksanaan program
- Laporan prestasi guru untuk penilaian

### Untuk Sektor Pembelajaran:
- Analisis prestasi mengikut subjek
- Pemantauan kualiti pelaksanaan program
- Identifikasi best practices dan cabaran
- Data untuk penambahbaikan program

### Untuk Sektor Perancangan:
- Data untuk perancangan program akan datang
- Analisis ROI dan keberkesanan program
- Pemantauan pencapaian target
- Laporan untuk pihak atasan

## Ciri Teknikal

### Data dan Visualisasi:
- Data real-time berdasarkan laporan sekolah
- Graf dan chart yang interaktif
- Penapis dinamik dengan update automatik
- Export data untuk analisis lanjut

### Keselamatan:
- Akses berdasarkan peranan pengguna
- Sekolah tidak boleh akses halaman ini
- Data dipaparkan berdasarkan kawasan tanggungjawab

### Prestasi:
- Loading data yang optimized
- Penapis yang responsive
- Paparan data yang cepat dan tepat

## Cara Penggunaan

### Untuk PPD:
1. Login dengan akaun PPD
2. Pergi ke menu "Analisis Tuisyen"
3. Pilih penapis (PPD, sekolah, subjek, tempoh)
4. Lihat statistik dan analisis
5. Semak prestasi sekolah dalam kawasan
6. Identifikasi sekolah yang perlu bantuan

### Untuk Sektor Pembelajaran/Perancangan:
1. Login dengan akaun sektor
2. Akses "Analisis Tuisyen"
3. Gunakan penapis untuk analisis khusus
4. Lihat trend dan prestasi keseluruhan
5. Analisis alasan ketidakhadiran
6. Buat keputusan berdasarkan data

Sistem ini menyediakan pandangan menyeluruh tentang pelaksanaan program tuisyen di seluruh negeri Johor untuk membantu dalam pemantauan, penilaian, dan penambahbaikan program.