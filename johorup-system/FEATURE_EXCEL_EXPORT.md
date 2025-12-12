# Feature: Excel Export untuk Semua Data

## Ringkasan
Feature baru yang membolehkan semua peranan download data dalam format Excel (.xlsx) untuk analisis dan laporan.

## Fungsi Export Yang Tersedia

### 1. Export Senarai Murid
**Function:** `exportStudentsToExcel(schoolId?)`

**Data yang diexport:**
- Bil, Nama, No. IC, Sekolah, Kelas
- Markah: Bahasa Melayu, Sejarah, Matematik
- Purata markah dan Status (Cemerlang/Baik/Sederhana/Perlu Perhatian)

**Lokasi Button:**
- Dashboard utama: Header (button "Murid")
- `/dashboard/students`: Header (button "Download Excel")
- `/dashboard/school/students`: Search section (button "Download Excel")
- `/dashboard/coordinator`: Header (button "Murid")

**File Output:**
- Semua murid: `Senarai_Murid_Semua_YYYY-MM-DD.xlsx`
- Sekolah tertentu: `Senarai_Murid_[Nama_Sekolah]_YYYY-MM-DD.xlsx`

### 2. Export Analisis Perkembangan
**Function:** `exportProgressToExcel(schoolId?)`

**Data yang diexport:**
- Bil, Nama, No. IC, Sekolah, Kelas
- Markah: Tingkatan 4 (%), Pertengahan Tahun (%), Percubaan SPM (%)
- Peningkatan (%) dan Status

**Lokasi Button:**
- Dashboard utama: Header (button "Analisis")
- `/dashboard/school/progress`: Filter section (button "Download Excel")
- `/dashboard/coordinator`: Header (button "Analisis")

**File Output:**
- Semua murid: `Analisis_Perkembangan_Semua_YYYY-MM-DD.xlsx`
- Sekolah tertentu: `Analisis_Perkembangan_[Nama_Sekolah]_YYYY-MM-DD.xlsx`

### 3. Export Ringkasan Program
**Function:** `exportProgramSummaryToExcel()`

**Data yang diexport:**
- Bil, Nama Program, Jenis Program, Subjek
- Tarikh Mula, Tarikh Tamat
- Murid Disasarkan, Penerangan

**Lokasi Button:**
- Dashboard utama: Header (button "Program")
- `/dashboard/programs`: Header (button "Download Excel")
- `/dashboard/coordinator`: Header (button "Program")

**File Output:**
- `Ringkasan_Program_YYYY-MM-DD.xlsx`

## Akses Mengikut Peranan

### 🏫 Sekolah
**Dapat download:**
- ✅ Senarai murid sekolah sendiri
- ✅ Analisis perkembangan sekolah sendiri
- ❌ Data sekolah lain

### 👥 PPD / Koordinator / Sektor Pembelajaran
**Dapat download:**
- ✅ Senarai murid semua sekolah
- ✅ Analisis perkembangan semua sekolah
- ✅ Ringkasan program semua

### 📊 Sektor Perancangan
**Dapat download:**
- ✅ Semua data (murid, analisis, program)

## Teknologi

**Library:** `xlsx` (SheetJS)
**Format:** Excel 2007+ (.xlsx)
**Browser Support:** Modern browsers dengan download capability

## Contoh Penggunaan

```typescript
// Download semua murid
exportStudentsToExcel();

// Download murid sekolah tertentu
exportStudentsToExcel(1); // schoolId = 1

// Download analisis perkembangan
exportProgressToExcel();

// Download ringkasan program
exportProgramSummaryToExcel();
```

## File Structure Excel

### Sheet "Senarai Murid"
| Bil | Nama | No. IC | Sekolah | Kelas | Bahasa Melayu | Sejarah | Matematik | Purata | Status |
|-----|------|--------|---------|-------|---------------|---------|-----------|---------|---------|
| 1 | Ahmad | 051234-56-7890 | SMK TJJ | 5A | C+ | D | C | 65.0 | Baik |

### Sheet "Analisis Perkembangan"
| Bil | Nama | No. IC | Sekolah | Kelas | Tingkatan 4 (%) | Pertengahan Tahun (%) | Percubaan SPM (%) | Peningkatan (%) | Status |
|-----|------|--------|---------|-------|------------------|----------------------|-------------------|-----------------|---------|
| 1 | Ahmad | 051234-56-7890 | SMK TJJ | 5A | 45.0 | 58.5 | 67.2 | 22.2 | Baik |

### Sheet "Ringkasan Program"
| Bil | Nama Program | Jenis Program | Subjek | Tarikh Mula | Tarikh Tamat | Murid Disasarkan | Penerangan |
|-----|--------------|---------------|--------|-------------|--------------|------------------|------------|
| 1 | Program Intensif BM | Bimbingan | Bahasa Melayu | 15/01/2026 | 30/03/2026 | 45 | Program bimbingan... |

## Benefits

1. **Analisis Offline** - Data boleh dianalisis menggunakan Excel/Google Sheets
2. **Laporan Rasmi** - Format standard untuk laporan kepada pihak atasan
3. **Backup Data** - Simpan data untuk rujukan masa depan
4. **Sharing** - Mudah dikongsi dengan stakeholders
5. **Pivot Tables** - Boleh buat analisis mendalam dengan Excel pivot tables

## Future Enhancements

- Export dengan filter (by subject, by date range, by performance level)
- Multiple sheets dalam satu file
- Charts dan graphs dalam Excel
- PDF export option
- Scheduled exports (email reports)
- Custom column selection