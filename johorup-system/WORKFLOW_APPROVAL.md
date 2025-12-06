# Workflow Kelulusan Program dan Pengeluaran Geran

## Overview

Sistem JohorUP menggunakan workflow approval untuk memastikan peruntukan kewangan diurus dengan teliti dan terkawal.

## Aliran Kerja (Workflow)

```
1. Sektor Pembelajaran/Pembangunan Murid
   ↓ (Kemukakan Program + Anggaran Kos)
   
2. Sektor Perancangan & Pengurusan PPD
   ↓ (Semak & Lulus/Tolak)
   
3. Program Diluluskan
   ↓ (Turunkan Geran)
   
4. Pelaksanaan Program
   ↓ (Update Status Perbelanjaan)
   
5. Laporan & Audit
```

## Peranan dan Tanggungjawab

### 1. Sektor Pembelajaran & Pembangunan Murid

**Tanggungjawab:**
- Merancang program bimbingan berdasarkan keperluan murid
- Menganggarkan kos program
- Mengemukakan permohonan program dengan justifikasi
- Melaksanakan program yang diluluskan
- Melaporkan keberkesanan program

**Cara Kemukakan Program:**
1. Log masuk ke sistem
2. Pergi ke menu "Program"
3. Klik "Tambah Program"
4. Isi maklumat:
   - Tajuk program
   - Jenis program (Bimbingan/Kem/Kelas Tambahan)
   - Subjek sasaran
   - Tarikh mula dan tamat
   - Anggaran kos
   - Penerangan lengkap
5. Klik "Simpan Program"
6. Status: **Menunggu Kelulusan**

### 2. Sektor Perancangan & Pengurusan PPD (Koordinator)

**Tanggungjawab:**
- Menyemak semua permohonan program
- Menilai kesesuaian dan keperluan program
- Memastikan peruntukan mencukupi
- Meluluskan atau menolak program
- Menurunkan geran untuk program yang diluluskan
- Memantau penggunaan bajet
- Menjana laporan kewangan

**Cara Lulus Program:**
1. Log masuk ke dashboard koordinator
2. Lihat senarai "Program Menunggu Kelulusan"
3. Semak butiran program:
   - Tajuk dan penerangan
   - Anggaran kos
   - Justifikasi
   - Baki peruntukan
4. Buat keputusan:
   - **Lulus**: Klik butang "Lulus"
   - **Tolak**: Klik butang "Tolak" (dengan sebab)
5. Program yang diluluskan akan muncul dalam senarai "Sedia Untuk Pengeluaran Geran"

**Cara Turunkan Geran:**
1. Pergi ke senarai "Program Diluluskan"
2. Klik "Turunkan Geran" untuk program yang dipilih
3. Semak maklumat:
   - Nama program
   - Jumlah geran
   - Penerangan
4. Pastikan dokumen sokongan lengkap
5. Klik "Sahkan Pengeluaran"
6. Sistem akan rekod:
   - Tarikh pengeluaran
   - Jumlah
   - Pegawai yang meluluskan

## Status Program dan Bajet

### Status Program
- **Dirancang** - Program baru dibuat, belum dikemukakan
- **Menunggu Kelulusan** - Dikemukakan, menunggu keputusan koordinator
- **Diluluskan** - Diluluskan oleh koordinator, sedia untuk pengeluaran geran
- **Ditolak** - Tidak diluluskan
- **Aktif** - Geran telah diturunkan, program sedang berjalan
- **Selesai** - Program telah tamat

### Status Bajet
- **Planned** - Anggaran awal
- **Pending Approval** - Menunggu kelulusan
- **Approved** - Diluluskan, belum dikeluarkan
- **Disbursed** - Geran telah diturunkan
- **Spent** - Telah dibelanjakan

## Kriteria Kelulusan Program

Koordinator perlu menilai berdasarkan:

### 1. Keperluan Program
- Adakah program ini diperlukan?
- Adakah ia menangani masalah sebenar murid?
- Adakah subjek sasaran memerlukan intervensi?

### 2. Kesesuaian Kos
- Adakah anggaran kos munasabah?
- Adakah breakdown kos jelas?
- Adakah ada alternatif lebih jimat?

### 3. Ketersediaan Bajet
- Adakah peruntukan mencukupi?
- Adakah program lain lebih kritikal?
- Berapa baki selepas kelulusan?

### 4. Keberkesanan
- Adakah program serupa pernah berjaya?
- Berapa ramai murid akan mendapat manfaat?
- Adakah ada KPI yang jelas?

### 5. Masa Pelaksanaan
- Adakah jadual realistik?
- Adakah bertindih dengan program lain?
- Adakah cukup masa untuk persiapan?

## Laporan dan Audit

### Laporan Bulanan
Koordinator perlu menjana laporan bulanan:
- Jumlah program diluluskan
- Jumlah geran diturunkan
- Baki peruntukan
- Program aktif
- Pencapaian murid

### Laporan Kepada Penaja
Setiap 3 bulan, laporan kepada JCorp dan Yayasan Hasanah:
- Penggunaan dana
- Pencapaian program
- Impak kepada murid
- Cadangan penambahbaikan

### Audit Trail
Sistem merekod:
- Siapa meluluskan program
- Bila diluluskan
- Jumlah yang diluluskan
- Perubahan status
- Pengeluaran geran

## Contoh Scenario

### Scenario 1: Program Diluluskan

**Sektor Pembelajaran:**
- Kemukakan "Program Intensif Bahasa Melayu"
- Anggaran: RM 120,000
- Tempoh: 3 bulan
- Sasaran: 500 murid

**Sektor Perancangan:**
- Semak permohonan
- Nilai: Program diperlukan, kos munasabah, bajet mencukupi
- Keputusan: **LULUS**
- Turunkan geran: RM 120,000

**Hasil:**
- Program bermula
- Murid mendapat bimbingan
- Pencapaian dipantau

### Scenario 2: Program Ditolak

**Sektor Pembelajaran:**
- Kemukakan "Lawatan Sambil Belajar"
- Anggaran: RM 80,000
- Tempoh: 3 hari

**Sektor Perancangan:**
- Semak permohonan
- Nilai: Kos terlalu tinggi, impak tidak jelas, ada program lebih kritikal
- Keputusan: **TOLAK**
- Sebab: "Kos tidak berpatutan. Cadangkan program alternatif yang lebih fokus kepada pembelajaran."

**Tindakan Susulan:**
- Sektor Pembelajaran kemukakan semula dengan kos lebih rendah
- Atau fokus kepada program lain

## Best Practices

### Untuk Sektor Pembelajaran:
1. Buat justifikasi yang kukuh
2. Anggaran kos yang realistik dan terperinci
3. Tunjukkan impak kepada murid
4. Rujuk data pencapaian murid
5. Kemukakan awal untuk elak kelewatan

### Untuk Sektor Perancangan:
1. Semak permohonan dengan teliti
2. Buat keputusan berdasarkan data
3. Komunikasi jelas jika tolak
4. Pantau penggunaan geran
5. Minta laporan kemajuan berkala

## Soalan Lazim

**Q: Berapa lama proses kelulusan?**
A: Biasanya 3-5 hari bekerja. Permohonan yang lengkap akan diproses lebih cepat.

**Q: Bolehkah tambah bajet selepas diluluskan?**
A: Ya, tetapi perlu kemukakan permohonan tambahan dengan justifikasi.

**Q: Apa jadi jika program ditolak?**
A: Boleh kemukakan semula dengan penambahbaikan atau program alternatif.

**Q: Bila geran akan diturunkan?**
A: Selepas program diluluskan, koordinator akan turunkan geran dalam 1-2 minggu.

**Q: Bolehkah guna geran untuk tujuan lain?**
A: Tidak. Geran hanya boleh digunakan untuk tujuan yang diluluskan.

## Hubungi

Untuk pertanyaan berkaitan kelulusan program:
- Email: perancangan@jpnj.gov.my
- Tel: 07-XXX XXXX (Sektor Perancangan)

---

**Dokumen ini adalah panduan untuk workflow approval dalam Sistem JohorUP**
