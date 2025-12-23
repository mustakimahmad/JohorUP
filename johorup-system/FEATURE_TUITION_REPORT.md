# Sistem Laporan Tuisyen Sekolah

## Gambaran Keseluruhan
Halaman laporan tuisyen khusus untuk guru di sekolah melaporkan pelaksanaan tuisyen dengan bukti laporan dan gambar yang lengkap.

## Lokasi Halaman
`/dashboard/school/tuition-report`

## Ciri-ciri Utama

### 1. Laporan Tuisyen Lengkap
**Maklumat Asas:**
- Program yang dilaksanakan
- Tarikh pelaksanaan
- Masa mula dan tamat
- Subjek (Bahasa Melayu, Sejarah, Matematik)
- **Guru pelaksana (dropdown dari senarai guru sekolah)**
- **Kehadiran murid (tickbox dari senarai murid disasarkan)**

**Kandungan Laporan:**
- Topik yang diajar (wajib)
- Kaedah pengajaran yang digunakan
- Respons dan penglibatan murid
- Cabaran yang dihadapi
- Cadangan penambahbaikan
- Catatan tambahan

### 2. Pemilihan Guru dan Murid
**Dropdown Guru:**
- Senarai guru sekolah yang berkaitan
- Menunjukkan nama guru dan subjek yang diajar
- Pilihan wajib untuk setiap laporan

**Tickbox Murid:**
- Senarai murid yang disasarkan dalam program
- Checkbox untuk setiap murid (hadir/tidak hadir)
- **Dropdown alasan ketidakhadiran untuk murid yang tidak hadir:**
  - Cuti sakit
  - Terlibat program sekolah
  - Mewakili sekolah ke pertandingan
  - Tidak hadir tanpa kenyataan
- Butang "Pilih Semua" dan "Nyahpilih Semua"
- Sekurang-kurangnya 1 murid mesti dipilih
- Paparan bilangan murid dipilih vs jumlah murid
- Statistik alasan ketidakhadiran

### 2. Muat Naik Bukti (WAJIB)
**Fail Laporan:**
- Format: PDF atau Word
- Kandungan: Laporan lengkap pelaksanaan tuisyen
- Status: WAJIB untuk setiap laporan

**Gambar Tuisyen:**
- Bilangan: 3 gambar wajib
- Format: Semua format gambar diterima
- Keterangan: Setiap gambar mesti ada keterangan
- Kandungan: Gambar pelaksanaan tuisyen sebenar

### 3. Statistik dan Pemantauan
**Dashboard Statistik:**
- Jumlah laporan yang telah dibuat
- Bilangan laporan yang telah dihantar
- Laporan dengan bukti fail
- Laporan dengan gambar lengkap

**Status Laporan:**
- **Draf**: Laporan belum lengkap/dihantar
- **Dihantar**: Laporan lengkap telah dihantar
- **Diluluskan**: Laporan telah disemak dan diluluskan

### 4. Senarai Laporan
**Paparan Jadual:**
- Tarikh pelaksanaan
- Program yang dilaksanakan
- Nama guru pelaksana
- Subjek yang diajar
- Kehadiran murid (hadir/jumlah)
- Status bukti (laporan + gambar)
- Status kelulusan

## Navigasi Sistem

### Peranan Sekolah (3 Modul Sahaja)
1. **Senarai Nama Murid** - Senarai murid sekolah
2. **Analisis Perkembangan Murid** - Prestasi dan kemajuan murid
3. **Laporan** - Laporan tuisyen dengan bukti dan gambar

## Keperluan Wajib

### Untuk Setiap Laporan:
✅ **Maklumat Lengkap** - Semua medan wajib diisi
✅ **Pilih Guru** - Dropdown dari senarai guru sekolah
✅ **Tandakan Murid Hadir** - Tickbox dari murid disasarkan (min 1 murid)
✅ **Fail Laporan** - PDF/Word dengan kandungan lengkap
✅ **3 Gambar** - Gambar pelaksanaan tuisyen dengan keterangan
✅ **Validasi** - Sistem akan periksa kelengkapan sebelum hantar

### Arahan untuk Guru:
1. Isi maklumat asas pelaksanaan tuisyen
2. Pilih guru pelaksana dari dropdown
3. Tandakan murid yang hadir menggunakan tickbox
4. **Pilih alasan ketidakhadiran untuk murid yang tidak hadir**
5. Tulis laporan terperinci dalam fail PDF/Word
6. Ambil 3 gambar semasa pelaksanaan tuisyen
7. Muat naik fail laporan dan gambar
8. Tambah keterangan untuk setiap gambar
9. Hantar laporan untuk semakan

## Faedah Sistem

### Untuk Sekolah:
- Dokumentasi lengkap pelaksanaan tuisyen
- Bukti visual aktiviti pembelajaran
- Pemantauan kehadiran murid
- Laporan terstruktur dan mudah diakses

### Untuk Pentadbir:
- Semakan laporan dengan bukti lengkap
- Pemantauan kualiti pelaksanaan program
- Dokumentasi untuk audit dan penilaian
- Statistik pelaksanaan program

## Keselamatan dan Validasi

### Validasi Input:
- Semua medan wajib mesti diisi
- Fail laporan mesti dalam format PDF/Word
- 3 gambar wajib untuk setiap laporan
- Keterangan gambar disyorkan

### Kawalan Akses:
- Hanya sekolah boleh akses halaman ini
- Setiap sekolah hanya nampak laporan mereka
- Guru hanya boleh buat laporan untuk sekolah mereka

## Integrasi dengan Sistem

### Data yang Digunakan:
- Senarai program aktif
- Maklumat subjek (BM, Sejarah, Matematik)
- Data murid sekolah
- Maklumat sekolah dan guru

### Aliran Kerja:
1. Guru log masuk dengan akaun sekolah
2. Pilih "Laporan Tuisyen" dari menu
3. Klik "Laporan Baru" untuk buat laporan
4. Isi maklumat dan muat naik bukti
5. Hantar untuk semakan pihak atasan
6. Pantau status kelulusan laporan

## Ciri Khas

### Interface Mesra Pengguna:
- Borang yang mudah difahami
- Arahan jelas untuk setiap bahagian
- Validasi real-time
- Mesej ralat yang membantu

### Pemantauan Prestasi:
- Statistik visual di dashboard
- Status laporan yang jelas
- Penanda bukti lengkap/tidak lengkap
- Senarai laporan yang teratur

Sistem ini memastikan setiap laporan tuisyen mempunyai bukti lengkap dan dokumentasi yang sempurna untuk pemantauan kualiti program.