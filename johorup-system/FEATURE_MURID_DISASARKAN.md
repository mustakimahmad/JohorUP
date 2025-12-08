# Feature: Bilangan Murid Disasarkan

## Ringkasan
Feature baru yang membolehkan Sektor Pembelajaran merekod bilangan murid yang disasarkan untuk setiap program.

## Fungsi Utama

### 1. Field Baru dalam Program
- Tambah field `target_students` (optional) dalam Program type
- Diisi oleh **Sektor Pembelajaran** semasa review/approval program
- Tidak wajib (optional field)

### 2. Panel Sektor Pembelajaran
**URL:** `/dashboard/coordinator`

**Fungsi:**
- Sektor Pembelajaran boleh semak semua program
- Boleh key in bilangan murid disasarkan untuk setiap program
- Contoh: 50 murid, 60 murid, dll.
- Boleh approve/reject program

**Cara Guna:**
1. Pergi ke `/dashboard/coordinator`
2. Klik butang "Semak" pada program
3. Masukkan bilangan murid dalam field "Bilangan Murid yang Disasarkan"
4. Klik "Simpan"
5. Boleh proceed dengan approve/reject program

### 3. Dashboard Summary
**Lokasi:** Dashboard utama (`/dashboard`)

**Display:**
- Card baru: "Murid Disasarkan"
- Menunjukkan jumlah keseluruhan murid disasarkan dari semua program
- Contoh: Jika Program A = 45 murid, Program B = 60 murid, Program C = 50 murid
  - Total = 155 murid disasarkan

### 4. Program Details
**Lokasi:** `/dashboard/programs`

**Display:**
- Setiap program card akan show bilangan murid disasarkan (jika ada)
- Icon kumpulan orang dengan text "X murid disasarkan"

## Perubahan Teknikal

### Files Modified:
1. `lib/types.ts` - Tambah field `target_students?: number` dalam Program interface
2. `lib/mockData.ts` - Tambah sample data untuk target_students
3. `app/dashboard/page.tsx` - Tambah card "Murid Disasarkan" dalam dashboard
4. `app/dashboard/programs/page.tsx` - Display target_students dalam program cards
5. `app/dashboard/coordinator/page.tsx` - **NEW** Panel untuk Sektor Pembelajaran

## Workflow

```
1. Sekolah submit program
   ↓
2. Sektor Pembelajaran review program di /dashboard/coordinator
   ↓
3. Sektor Pembelajaran key in bilangan murid disasarkan (optional)
   ↓
4. Sektor Pembelajaran approve/reject program
   ↓
5. Data murid disasarkan tersimpan dan display di:
   - Dashboard summary (total)
   - Program details
   - Reports
```

## Contoh Data

```typescript
{
  id: 1,
  title: 'Program Intensif Bahasa Melayu',
  description: '...',
  program_type: 'Bimbingan',
  target_subject_id: 1,
  start_date: '2026-01-15',
  end_date: '2026-03-30',
  created_by: 1,
  target_students: 45  // ← Field baru
}
```

## Benefits

1. **Tracking Impact** - Tahu berapa ramai murid yang akan benefit
2. **Resource Planning** - Bantu plan resources based on student numbers
3. **Reporting** - Boleh generate report tentang reach program
4. **Accountability** - Clear target untuk setiap program

## Future Enhancements

- Tambah actual vs target comparison (berapa ramai yang actually join)
- Breakdown by school
- Trend analysis
- Export reports dengan data murid disasarkan
