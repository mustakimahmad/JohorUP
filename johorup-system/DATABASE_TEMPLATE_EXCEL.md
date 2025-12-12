# Template Database Excel untuk JohorUP System

## Ringkasan
Template Excel ini disediakan untuk anda masukkan data sebenar yang akan diimport ke dalam sistem JohorUP.

## 📋 Template Files Yang Perlu Disediakan

### 1. **PPD.xlsx**
| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | Number | ID unik PPD | 1 |
| name | Text | Nama PPD | PPD Johor Bahru |
| code | Text | Kod PPD | JB |

**Sample Data:**
```
1, PPD Johor Bahru, JB
2, PPD Muar, MR
3, PPD Batu Pahat, BP
4, PPD Kluang, KL
5, PPD Pontian, PT
```

### 2. **Schools.xlsx**
| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | Number | ID unik sekolah | 1 |
| name | Text | Nama sekolah | SMK Taman Johor Jaya |
| code | Text | Kod sekolah | JBA001 |
| ppd_id | Number | ID PPD (rujuk PPD.xlsx) | 1 |
| target_students | Number | Sasaran bilangan murid | 50 |

**Sample Data:**
```
1, SMK Taman Johor Jaya, JBA001, 1, 50
2, SMK Bandar Baru Uda, JBA002, 1, 45
3, SMK Tanjung Agas, MRA001, 2, 60
```

### 3. **Students.xlsx**
| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | Number | ID unik murid | 1 |
| name | Text | Nama murid | Ahmad Bin Ali |
| ic_number | Text | No. IC murid | 051234-56-7890 |
| school_id | Number | ID sekolah (rujuk Schools.xlsx) | 1 |
| class | Text | Kelas murid | 5A |

**Sample Data:**
```
1, Ahmad Bin Ali, 051234-56-7890, 1, 5A
2, Siti Fatimah, 060987-65-4321, 1, 5A
3, Muhammad Hafiz, 050555-44-3333, 2, 5B
```

### 4. **Subjects.xlsx**
| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | Number | ID unik subjek | 1 |
| name | Text | Nama subjek | Bahasa Melayu |
| code | Text | Kod subjek | BM |

**Fixed Data (Jangan ubah):**
```
1, Bahasa Melayu, BM
2, Sejarah, SEJ
3, Matematik, MAT
```

### 5. **StudentGrades.xlsx**
| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | Number | ID unik grade | 1 |
| student_id | Number | ID murid (rujuk Students.xlsx) | 1 |
| subject_id | Number | ID subjek (rujuk Subjects.xlsx) | 1 |
| exam_type | Text | Jenis peperiksaan | akhir_tingkatan_4 |
| grade | Text | Gred | C+ |
| year | Number | Tahun peperiksaan | 2025 |

**Exam Types (Pilih salah satu):**
- `akhir_tingkatan_4` - Peperiksaan Akhir Tingkatan 4
- `pertengahan_tahun` - Peperiksaan Pertengahan Tahun
- `percubaan` - Peperiksaan Percubaan SPM
- `spm` - SPM Sebenar

**Grades (Pilih salah satu):**
- `A+`, `A`, `A-`, `B+`, `B`, `C+`, `C`, `D`, `E`, `G`, `TH`

**Sample Data:**
```
1, 1, 1, akhir_tingkatan_4, C+, 2025
2, 1, 2, akhir_tingkatan_4, D, 2025
3, 1, 3, akhir_tingkatan_4, C, 2025
4, 1, 1, pertengahan_tahun, B, 2026
5, 1, 2, pertengahan_tahun, C+, 2026
```

### 6. **Users.xlsx**
| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | Number | ID unik user | 1 |
| email | Text | Email login | sekolah1@moe.gov.my |
| name | Text | Nama pengguna | Guru Besar SMK TJJ |
| role | Text | Peranan | school |
| school_id | Number | ID sekolah (jika role=school) | 1 |
| ppd_id | Number | ID PPD (jika role=ppd) | 1 |

**Roles (Pilih salah satu):**
- `school` - Sekolah
- `ppd` - PPD
- `sektor_pembelajaran` - Sektor Pembelajaran
- `sektor_perancangan` - Sektor Perancangan

**Sample Data:**
```
1, sekolah1@moe.gov.my, Guru Besar SMK TJJ, school, 1, 
2, ppd.jb@moe.gov.my, Pegawai PPD JB, ppd, , 1
3, pembelajaran@jpnj.gov.my, Ketua Sektor Pembelajaran, sektor_pembelajaran, , 
```

### 7. **Programs.xlsx**
| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | Number | ID unik program | 1 |
| title | Text | Tajuk program | Program Intensif Bahasa Melayu |
| description | Text | Penerangan program | Program bimbingan intensif untuk subjek BM |
| program_type | Text | Jenis program | Bimbingan |
| target_subject_id | Number | ID subjek sasaran | 1 |
| start_date | Date | Tarikh mula (YYYY-MM-DD) | 2026-01-15 |
| end_date | Date | Tarikh tamat (YYYY-MM-DD) | 2026-03-30 |
| created_by | Number | ID user yang create | 1 |
| target_students | Number | Bilangan murid disasarkan | 45 |

**Program Types:**
- `Bimbingan`, `Kem`, `Kelas Tambahan`, `Workshop`, `Seminar`

**Sample Data:**
```
1, Program Intensif Bahasa Melayu, Program bimbingan intensif untuk subjek BM, Bimbingan, 1, 2026-01-15, 2026-03-30, 1, 45
2, Kem Motivasi Sejarah, Kem motivasi dan pembelajaran Sejarah, Kem, 2, 2026-02-10, 2026-02-12, 1, 60
```

### 8. **Budget.xlsx**
| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | Number | ID unik budget | 1 |
| program_id | Number | ID program (rujuk Programs.xlsx) | 1 |
| amount | Number | Jumlah (RM) | 120000 |
| description | Text | Penerangan perbelanjaan | Gaji tutor, bahan pembelajaran |
| status | Text | Status budget | approved |
| approved_by | Number | ID user yang approve | 4 |
| approved_date | Date | Tarikh approve (YYYY-MM-DD) | 2026-01-05 |

**Status (Pilih salah satu):**
- `planned` - Dirancang
- `approved` - Diluluskan
- `spent` - Dibelanjakan
- `pending_approval` - Menunggu kelulusan

**Sample Data:**
```
1, 1, 120000, Gaji tutor dan bahan pembelajaran, approved, 4, 2026-01-05
2, 2, 80000, Penginapan dan makan peserta kem, pending_approval, , 
```

## 📝 **Panduan Pengisian Data**

### ✅ **Do's:**
1. **Gunakan format yang betul** untuk setiap column
2. **Pastikan ID unik** untuk setiap table
3. **Rujuk ID yang betul** untuk foreign keys
4. **Gunakan format tarikh YYYY-MM-DD**
5. **Isi semua column yang required**

### ❌ **Don'ts:**
1. **Jangan tinggalkan ID kosong**
2. **Jangan guna special characters** dalam nama
3. **Jangan ubah struktur column**
4. **Jangan duplicate IC numbers**
5. **Jangan guna tarikh format lain**

## 🔄 **Import Process**

Setelah anda siapkan semua Excel files:

1. **Hantar semua 8 files Excel** kepada saya
2. Saya akan **validate data** dan check for errors
3. Saya akan **convert ke format sistem** (TypeScript/JSON)
4. Saya akan **update mockData.ts** dengan data sebenar anda
5. **Test dan deploy** sistem dengan data baru

## 📊 **Estimated Data Size**

Untuk sistem penuh, anggaran data:
- **PPDs:** 10-15 entries
- **Schools:** 50-100 entries  
- **Students:** 1000-5000 entries
- **Users:** 20-50 entries
- **Programs:** 10-30 entries
- **StudentGrades:** 3000-15000 entries (students × subjects × exam_types)
- **Budget:** 20-60 entries

## 📞 **Support**

Jika ada soalan tentang template ini:
1. Rujuk documentation dalam sistem
2. Check sample data yang disediakan
3. Tanya saya jika ada kekeliruan

**Ready untuk terima Excel files anda!** 🚀