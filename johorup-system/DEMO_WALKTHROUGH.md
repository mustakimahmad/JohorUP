# Demo Walkthrough - Sistem JohorUP

## 🎬 Panduan Demo Untuk Koordinator

Ikut langkah-langkah ini untuk demo sistem kepada pihak pengurusan atau penaja.

---

## Bahagian 1: Login (2 minit)

### Langkah 1: Buka Sistem
```
1. Buka browser (Chrome/Edge recommended)
2. Pergi ke: http://localhost:3000
3. Anda akan auto redirect ke /login
```

### Langkah 2: Login Sebagai Koordinator
```
Email: koordinator@jpnj.gov.my
Password: demo123
Klik: "Log Masuk"
```

### Langkah 3: Verify Redirect
```
✅ Anda akan terus ke: /dashboard/coordinator
✅ Header menunjukkan: "Dashboard Koordinator"
✅ Subheader: "Sektor Perancangan & Pengurusan PPD"
```

**Talking Points:**
> "Ini adalah dashboard khusus untuk Sektor Perancangan. Kami mempunyai akses penuh untuk mengurus peruntukan RM450,000 dari JCorp dan Yayasan Hasanah."

---

## Bahagian 2: Overview Kewangan (3 minit)

### Kad Statistik (Dari kiri ke kanan)

#### Kad 1: Jumlah Peruntukan
```
RM 450,000
```
**Explain:**
> "Ini adalah jumlah peruntukan penuh untuk program JohorUP. Dana ini dari JCorp dan Yayasan Hasanah untuk membantu 1,550 murid."

#### Kad 2: Diluluskan
```
RM 270,000 (60%)
```
**Explain:**
> "Setakat ini, kami telah meluluskan RM270,000 untuk 3 program. Ini adalah 60% dari jumlah peruntukan."

#### Kad 3: Dibelanjakan
```
RM 0 (0%)
```
**Explain:**
> "Belum ada perbelanjaan lagi kerana program baru akan bermula. Geran akan diturunkan selepas ini."

#### Kad 4: Menunggu Kelulusan
```
RM 130,000 (2 program)
```
**Explain:**
> "Kami ada 2 program menunggu kelulusan dengan jumlah RM130,000. Ini yang perlu kami proses hari ini."

#### Kad 5: Baki
```
RM 180,000 (40%)
```
**Explain:**
> "Masih ada RM180,000 untuk program-program akan datang. Ini cukup untuk 2-3 program lagi."

**Talking Points:**
> "Dashboard ini memberi kita overview pantas tentang kesihatan kewangan program. Kami boleh lihat dengan cepat berapa yang telah diluluskan, dibelanjakan, dan masih ada."

---

## Bahagian 3: Alert Pending Approvals (1 minit)

### Yellow Alert Box
```
⚠️ Anda mempunyai 2 program yang menunggu kelulusan 
    dengan jumlah RM 130,000
```

**Explain:**
> "Sistem memberi alert jika ada program menunggu keputusan kami. Ini memastikan tiada permohonan tertinggal."

---

## Bahagian 4: Meluluskan Program (5 minit)

### Table: Program Menunggu Kelulusan

#### Program 1: Kem Sejarah
```
Program: Kem Motivasi Sejarah
Penerangan: Kem Sejarah - Penginapan, makan, aktiviti
Jumlah: RM 80,000
Dikemukakan: Sektor Pembelajaran
```

**Demo Steps:**
1. **Point ke program**
   > "Ini adalah permohonan untuk Kem Sejarah. Mari kita semak butiran."

2. **Explain justifikasi**
   > "Subjek Sejarah mempunyai kadar kelulusan paling rendah - 38.7%. Kem ini diperlukan untuk motivasi murid."

3. **Semak kos**
   > "RM80,000 untuk kem 3 hari, 500 murid. Ini munasabah - RM160 per murid."

4. **Semak baki**
   > "Baki kami RM180,000. Selepas lulus ini, masih ada RM100,000."

5. **Klik "Lulus"**
   > "Saya akan luluskan program ini."
   
6. **Alert muncul**
   > "Program telah diluluskan!"

7. **Program hilang dari table**
   > "Lihat, program sudah hilang dari senarai pending. Ia akan muncul di bawah untuk pengeluaran geran."

#### Program 2: Tambahan Bahan
```
Program: Tambahan bahan dan transport
Penerangan: Tambahan bahan dan transport
Jumlah: RM 50,000
Dikemukakan: Sektor Pembelajaran
```

**Demo Steps:**
1. **Point ke program**
   > "Program kedua adalah tambahan untuk program sedia ada."

2. **Explain**
   > "Ini adalah sokongan tambahan untuk Program Intensif BM yang sudah berjalan."

3. **Klik "Lulus"**
   > "Saya luluskan juga."

4. **Table kosong**
   > "Sekarang tiada lagi program menunggu kelulusan. Semua telah diproses."

**Talking Points:**
> "Proses approval sangat mudah dan pantas. Kami boleh buat keputusan dengan cepat berdasarkan data yang ada. Jika perlu tolak, ada butang 'Tolak' juga."

---

## Bahagian 5: Menurunkan Geran (5 minit)

### Table: Program Diluluskan - Sedia Untuk Pengeluaran Geran

#### Program: Program Intensif Bahasa Melayu
```
Program: Program Intensif Bahasa Melayu
Jumlah: RM 120,000
Status: Diluluskan (badge hijau)
Tarikh Lulus: 05/01/2026
```

**Demo Steps:**

1. **Point ke table**
   > "Ini adalah senarai program yang telah diluluskan dan sedia untuk pengeluaran geran."

2. **Explain status**
   > "Program ini telah diluluskan pada 5 Januari. Sekarang kami perlu turunkan geran supaya program boleh bermula."

3. **Klik "Turunkan Geran"**
   > "Mari kita turunkan geran untuk program ini."

4. **Modal muncul**
   ```
   ┌─────────────────────────────────────┐
   │ Pengesahan Pengeluaran Geran        │
   ├─────────────────────────────────────┤
   │ Program: Program Intensif BM        │
   │ Jumlah Geran: RM 120,000           │
   │ Penerangan: Bimbingan BM - Gaji    │
   │             tutor, bahan            │
   │                                     │
   │ ⚠️ Pastikan semua dokumen sokongan │
   │    telah lengkap                    │
   │                                     │
   │ [Sahkan Pengeluaran]  [Batal]      │
   └─────────────────────────────────────┘
   ```

5. **Explain modal**
   > "Modal ini menunjukkan maklumat lengkap program dan jumlah geran."

6. **Explain dokumen**
   > "Sebelum sahkan, kami perlu pastikan semua dokumen sokongan lengkap - proposal, breakdown kos, surat sokongan PPD."

7. **Klik "Sahkan Pengeluaran"**
   > "Dokumen lengkap, saya sahkan pengeluaran."

8. **Alert confirmation**
   > "Geran RM120,000 telah diturunkan untuk Program Intensif Bahasa Melayu"

9. **Modal tutup**
   > "Sekarang program boleh bermula. Sektor Pembelajaran akan terima notifikasi."

**Talking Points:**
> "Proses pengeluaran geran juga sangat terkawal. Kami ada double confirmation untuk pastikan tiada kesilapan. Setiap pengeluaran direkod dengan tarikh dan pegawai yang meluluskan."

---

## Bahagian 6: Navigation ke Dashboard Utama (3 minit)

### Klik "Laporan Penuh" di menu

**Demo Steps:**

1. **Klik menu "Laporan Penuh"**
   > "Mari kita lihat dashboard utama untuk overview keseluruhan program."

2. **Dashboard Utama**
   ```
   Statistik:
   - Jumlah Murid: 1,550
   - Jumlah Sekolah: 22
   - Bajet Program: RM 450,000
   - Program Aktif: 12
   ```

3. **Graf Trend Perkembangan**
   > "Ini adalah graf penting yang menunjukkan perkembangan murid dari Tingkatan 4 hingga target SPM."

   ```
   Tingkatan 4 (Nov 2025):        42.0% ████████
   Pertengahan Tahun (Mei 2026):  52.5% ██████████ (+10.5%)
   Percubaan SPM (Sep 2026):      61.8% ████████████ (+19.8%)
   Target SPM 2026:               67.0% █████████████
   ```

4. **Explain trend**
   > "Murid menunjukkan peningkatan konsisten. Dari 42% di Tingkatan 4, naik ke 61.8% di percubaan. Kita hampir capai target 67%."

5. **Kadar Kelulusan Mengikut Subjek**
   ```
   Bahasa Melayu: 45.2% ████████
   Sejarah:       38.7% ███████
   Matematik:     42.1% ████████
   ```

6. **Explain subjek**
   > "Sejarah adalah subjek paling lemah dengan 38.7%. Itulah sebabnya kami luluskan Kem Sejarah tadi."

**Talking Points:**
> "Dashboard ini memberi kita big picture. Kami boleh lihat sama ada program yang kami luluskan memberi impak kepada pencapaian murid."

---

## Bahagian 7: View Senarai Murid (2 minit)

### Klik "Murid" di menu

**Demo Steps:**

1. **Table murid**
   > "Ini adalah senarai 1,550 murid sasaran program."

2. **Filter sekolah**
   > "Kami boleh filter mengikut sekolah untuk lihat data spesifik."

3. **Gred murid**
   ```
   Nama: Murid 1
   Sekolah: SMK Taman Johor Jaya
   BM: C    Sejarah: D    Matematik: C
   ```

4. **Explain gred**
   > "Ini adalah gred Tingkatan 4 mereka. Murid dengan gred C dan D adalah sasaran utama program."

**Talking Points:**
> "Dengan data terperinci ini, kami boleh track setiap murid dan pastikan program sampai kepada mereka yang paling memerlukannya."

---

## Bahagian 8: Demo Login Sekolah (3 minit)

### Log keluar dan login sebagai sekolah

**Demo Steps:**

1. **Klik "Log Keluar"**

2. **Login semula**
   ```
   Email: sekolah1@moe.gov.my
   Password: demo123
   ```

3. **Redirect ke /dashboard/school**
   > "Sekolah mempunyai dashboard yang berbeza. Mereka hanya nampak data murid mereka sahaja."

4. **Dashboard Sekolah**
   ```
   Jumlah Murid: 50
   Purata Tingkatan 4: 65.3
   Purata Percubaan: 72.1
   Peningkatan: +10.4%
   ```

5. **Graf Perkembangan**
   > "Sekolah boleh lihat graf perkembangan murid mereka dari Tingkatan 4 hingga Percubaan."

6. **Kategori Pencapaian**
   ```
   Cemerlang: 8 murid
   Baik: 15 murid
   Sederhana: 18 murid
   Perlu Perhatian: 9 murid
   ```

7. **Explain**
   > "Sekolah boleh identify murid yang perlu perhatian khas dan fokus kepada mereka."

8. **PENTING: Tiada menu kewangan**
   > "Perhatikan, sekolah TIDAK nampak menu kewangan. Mereka fokus kepada murid sahaja."

**Talking Points:**
> "Setiap peranan ada dashboard yang sesuai dengan tanggungjawab mereka. Sekolah fokus kepada murid, kami fokus kepada kewangan dan approval."

---

## Bahagian 9: Kesimpulan (2 minit)

### Key Takeaways

**Point 1: Sistem Terkawal**
> "Sistem ini memastikan setiap ringgit digunakan dengan bijak melalui proses approval yang ketat."

**Point 2: Transparency**
> "Semua stakeholder boleh lihat data yang relevan kepada mereka. Tiada maklumat tersembunyi."

**Point 3: Data-Driven**
> "Keputusan dibuat berdasarkan data pencapaian murid, bukan andaian."

**Point 4: Accountability**
> "Setiap approval dan pengeluaran geran direkod dengan tarikh dan pegawai. Ada audit trail."

**Point 5: Impact Tracking**
> "Kami boleh track impak program melalui graf perkembangan murid."

---

## Bahagian 10: Q&A (5 minit)

### Soalan Lazim

**Q: Berapa lama proses approval?**
> "Dalam sistem, ia instant. Dalam praktik sebenar, kami target 3 hari bekerja untuk semak dokumen dengan teliti."

**Q: Boleh batalkan approval?**
> "Ya, sebelum geran diturunkan. Selepas geran turun, perlu proses lain."

**Q: Bagaimana jika program gagal?**
> "Kami ada mekanisme untuk hentikan pengeluaran geran seterusnya dan review program."

**Q: Siapa boleh akses sistem?**
> "4 peranan: Sekolah (22), PPD (11), Sektor Pembelajaran, dan Sektor Perancangan (kami)."

**Q: Adakah data real-time?**
> "Dalam prototype ini, data adalah mock. Dalam production, semua real-time dari database."

**Q: Boleh export laporan?**
> "Ya, kami boleh export ke PDF dan Excel untuk mesyuarat atau pembentangan."

---

## 📋 Checklist Demo

Sebelum demo, pastikan:
- [ ] Sistem running di http://localhost:3000
- [ ] Browser updated (Chrome/Edge)
- [ ] Screen resolution OK untuk projector
- [ ] Internet connection stable (jika perlu)
- [ ] Backup slides (jika sistem down)
- [ ] Print handouts (QUICK_REFERENCE_KOORDINATOR.md)
- [ ] Prepare Q&A answers
- [ ] Test all features sebelum demo

---

## 🎯 Tips Demo Yang Berkesan

1. **Slow Down** - Jangan terlalu cepat, bagi masa audience absorb
2. **Explain Why** - Bukan sahaja show, tapi explain kenapa feature tu penting
3. **Use Real Scenarios** - Guna contoh sebenar dari kerja harian
4. **Engage Audience** - Tanya soalan, minta feedback
5. **Handle Errors Gracefully** - Jika ada error, stay calm dan explain
6. **End Strong** - Kesimpulan yang kuat dengan call-to-action

---

## 📞 Emergency Contacts

Jika ada masalah teknikal semasa demo:
- IT Support: [number]
- Developer: [number]
- Backup presenter: [name]

---

**Selamat Berdemo!**

Ingat: Anda bukan sahaja demo sistem, anda demo bagaimana sistem ini akan membantu 1,550 murid mencapai impian mereka dalam SPM 2026.

**Good luck! 🎓**
