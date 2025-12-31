# Folder Data

## 📁 Tujuan Folder
Folder ini digunakan untuk menyimpan file Excel dan CSV yang akan diimport ke dalam sistem JohorUP.

## 📋 Format File Yang Disokong
- **Excel (.xlsx)** - Format utama untuk import data
- **CSV (.csv)** - Format alternatif untuk import data

## 📊 Jenis Data Yang Boleh Diimport

### 1. Schools (Sekolah)
- **Format:** schools.xlsx atau schools.csv
- **Columns:** id, name, code, ppd_id, target_students
- **Contoh:** SMK Taman Johor Jaya, JBA001, 1, 44

### 2. Students (Murid)
- **Format:** students.xlsx atau students.csv  
- **Columns:** id, name, ic_number, school_id, class
- **Contoh:** Ahmad bin Ali, 051234-56-7890, 1, 5A

### 3. Teachers (Guru)
- **Format:** teachers.xlsx atau teachers.csv
- **Columns:** id, name, ic_number, school_id, subject_id, years_experience, qualification, phone, email
- **Contoh:** Cikgu Siti, 801234-56-7890, 1, 1, 10, Sarjana Muda Pendidikan, 0123456789, siti@moe.gov.my

### 4. Users (Pengguna)
- **Format:** users.xlsx atau users.csv
- **Columns:** id, email, name, role, school_id, ppd_id, password_hash
- **Contoh:** admin@jpnj.gov.my, Admin JPNJ, sektor_perancangan, null, null, $2a$12$...

## 🚀 Cara Import Data

### 1. Melalui Dashboard
1. Login sebagai admin
2. Pergi ke halaman import data
3. Pilih file Excel/CSV
4. Klik "Import"

### 2. Melalui Script
```bash
# Import schools
npm run import:schools

# Import students  
npm run import:students

# Import teachers
npm run import:teachers

# Import users
npm run import:users
```

## ⚠️ Nota Penting

### Format Data
- Pastikan format column header betul
- Gunakan encoding UTF-8 untuk sokongan Bahasa Melayu
- Tarikh dalam format YYYY-MM-DD
- IC number dalam format 123456-12-1234

### Validation
- Email mesti unique
- IC number mesti unique
- School code mesti unique
- PPD code mesti unique

### Error Handling
- File yang gagal import akan log error
- Data yang sudah ada akan di-skip atau update
- Backup data sebelum import besar

## 📝 Template Excel

Untuk mendapatkan template Excel yang betul:
1. Pergi ke dashboard admin
2. Klik "Download Template"
3. Isi data mengikut format
4. Upload semula ke sistem

## 🔒 Security

- Jangan commit file data sebenar ke Git
- File dalam folder ini di-ignore oleh .gitignore
- Pastikan data sensitif (password, IC) dilindungi

---

**Dicipta:** Disember 2025  
**Sistem:** JohorUP Dashboard  
**Status:** Production Ready (Tiada Data Mockup)