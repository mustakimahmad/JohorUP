# 📊 Template Excel untuk Data Sebenar JohorUP

## 📁 Struktur File Excel

Buat folder `data/` dalam project dan sediakan file Excel berikut:

```
johorup-system/
├── data/
│   ├── schools.xlsx      # Data sekolah
│   ├── students.xlsx     # Data murid
│   ├── teachers.xlsx     # Data guru
│   ├── users.xlsx        # Data pengguna sistem
│   └── grades.xlsx       # Data keputusan peperiksaan
```

## 🏫 **1. schools.xlsx**

**Sheet Name: "Schools"**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| name | Text | Nama sekolah | SMK Taman Johor Jaya |
| code | Text | Kod sekolah (unique) | SMKTJJ |
| ppd_id | Number | ID PPD (1=JB, 2=Muar, 3=BP) | 1 |
| address | Text | Alamat sekolah | Taman Johor Jaya, 81100 JB |
| phone | Text | Telefon sekolah | 07-3551234 |
| email | Text | Email sekolah | smktjj@moe-dl.edu.my |
| principal_name | Text | Nama pengetua | Puan Siti Aminah |

**Contoh data:**
```
name,code,ppd_id,address,phone,email,principal_name
SMK Taman Johor Jaya,SMKTJJ,1,"Taman Johor Jaya, 81100 JB",07-3551234,smktjj@moe-dl.edu.my,Puan Siti Aminah
SMK Bandar Baru UDA,SMKBBUDA,1,"Bandar Baru UDA, 81200 JB",07-5561234,smkbbuda@moe-dl.edu.my,Encik Ahmad Rahman
```

## 👨‍🎓 **2. students.xlsx**

**Sheet Name: "Students"**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| ic_number | Text | No. IC murid (12 digit) | 051234567890 |
| name | Text | Nama penuh murid | Ahmad Bin Abdullah |
| school_id | Number | ID sekolah (dari schools table) | 1 |
| form_level | Number | Tingkatan (4 atau 5) | 4 |
| class_name | Text | Nama kelas | 4 Bestari |
| phone | Text | No. telefon murid | 012-3456789 |
| parent_phone | Text | No. telefon ibu bapa | 019-8765432 |
| address | Text | Alamat rumah | Taman Johor Jaya |
| is_target_student | Boolean | Murid sasaran program (TRUE/FALSE) | TRUE |

**Contoh data:**
```
ic_number,name,school_id,form_level,class_name,phone,parent_phone,address,is_target_student
051234567890,Ahmad Bin Abdullah,1,4,4 Bestari,012-3456789,019-8765432,Taman Johor Jaya,TRUE
051234567891,Siti Nurhaliza,1,4,4 Bestari,012-3456790,019-8765433,Taman Johor Jaya,TRUE
```

## 👩‍🏫 **3. teachers.xlsx**

**Sheet Name: "Teachers"**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| name | Text | Nama guru | Cikgu Aminah Binti Ahmad |
| email | Text | Email guru (unique) | aminah.ahmad@moe-dl.edu.my |
| phone | Text | No. telefon | 019-2345678 |
| school_id | Number | ID sekolah | 1 |
| subject_id | Number | ID subjek (1=BM, 2=SEJ, 3=MAT) | 1 |
| position | Text | Jawatan | Guru Bahasa Melayu |
| experience_years | Number | Tahun pengalaman | 8 |

**Contoh data:**
```
name,email,phone,school_id,subject_id,position,experience_years
Cikgu Aminah Binti Ahmad,aminah.ahmad@moe-dl.edu.my,019-2345678,1,1,Guru Bahasa Melayu,8
Cikgu Hassan Bin Omar,hassan.omar@moe-dl.edu.my,019-3456789,1,2,Guru Sejarah,12
```

## 👤 **4. users.xlsx**

**Sheet Name: "Users"**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| email | Text | Email login (unique) | admin@jpnj.gov.my |
| name | Text | Nama pengguna | Admin JPNJ |
| role | Text | Peranan sistem | sektor_perancangan |
| school_id | Number | ID sekolah (jika role=school) | 1 |
| ppd_id | Number | ID PPD (jika role=ppd) | 1 |
| password | Text | Kata laluan | AdminPass123! |

**Roles yang boleh:**
- `sektor_perancangan` - Admin/Koordinator JPNJ
- `sektor_pembelajaran` - Sektor Pembelajaran JPNJ  
- `ppd` - Pegawai PPD
- `school` - Pengguna sekolah
- `yayasan_jcorp` - Yayasan JCorp

**Contoh data:**
```
email,name,role,school_id,ppd_id,password
admin@jpnj.gov.my,Admin JPNJ,sektor_perancangan,,,AdminPass123!
ppd.jb@moe.gov.my,PPD Johor Bahru,ppd,,1,PPDPass123!
smktjj@moe-dl.edu.my,SMK Taman Johor Jaya,school,1,,SchoolPass123!
```

## 📊 **5. grades.xlsx**

**Sheet Name: "Grades"**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| student_id | Number | ID murid (dari students table) | 1 |
| subject_id | Number | ID subjek (1=BM, 2=SEJ, 3=MAT) | 1 |
| exam_type | Text | Jenis peperiksaan | Ujian Akhir Tingkatan 4 |
| exam_date | Date | Tarikh peperiksaan | 2025-11-15 |
| grade | Text | Gred (A+, A, B+, B, C+, C, D, E) | B |
| marks | Number | Markah yang diperolehi | 75 |
| total_marks | Number | Jumlah markah | 100 |
| percentage | Number | Peratus | 75.0 |

**Contoh data:**
```
student_id,subject_id,exam_type,exam_date,grade,marks,total_marks,percentage
1,1,Ujian Akhir Tingkatan 4,2025-11-15,B,75,100,75.0
1,2,Ujian Akhir Tingkatan 4,2025-11-18,B+,78,100,78.0
1,3,Ujian Akhir Tingkatan 4,2025-11-20,C+,68,100,68.0
```

## 🚀 **Cara Import Data**

### **Langkah 1: Kosongkan Data Mock**
```sql
-- Run di Neon SQL Editor
-- File: scripts/clear-mock-data.sql
```

### **Langkah 2: Sediakan File Excel**
1. Buat folder `data/` dalam project
2. Buat file Excel mengikut template di atas
3. Pastikan column names betul-betul sama
4. Isi data sebenar sekolah/murid/guru

### **Langkah 3: Import Data**
```bash
# Set database connection
export DATABASE_URL="your-neon-connection-string"

# Install dependencies
npm install xlsx bcryptjs

# Run import script
node scripts/import-real-data.js
```

### **Langkah 4: Verify Data**
```sql
-- Check imported data
SELECT 'Schools' as table_name, COUNT(*) as count FROM schools
UNION ALL
SELECT 'Students', COUNT(*) FROM students
UNION ALL
SELECT 'Teachers', COUNT(*) FROM teachers
UNION ALL
SELECT 'Users', COUNT(*) FROM users;
```

## ⚠️ **Penting!**

1. **Backup Data**: Selalu backup database sebelum import
2. **Test Environment**: Test import di development environment dulu
3. **Data Validation**: Pastikan data dalam Excel betul dan lengkap
4. **Foreign Keys**: Import mengikut urutan (Schools → Students → Teachers → Users → Grades)
5. **Unique Constraints**: Pastikan email, IC number, school code unique

## 🆘 **Troubleshooting**

### **Error: File not found**
```bash
# Pastikan file Excel ada dalam folder data/
ls -la data/
```

### **Error: Column not found**
- Pastikan nama column dalam Excel betul-betul sama dengan template
- Pastikan sheet name betul ("Schools", "Students", etc.)

### **Error: Foreign key constraint**
- Import schools dulu, baru students/teachers
- Pastikan school_id, ppd_id, subject_id wujud dalam database

### **Error: Duplicate key**
- Pastikan IC number, email, school code unique
- Gunakan ON CONFLICT clause dalam script

## 📞 **Support**

Jika ada masalah dengan import data, check:
1. Format Excel file betul
2. Database connection string betul  
3. Semua required columns ada
4. Data types betul (Number vs Text)
5. Foreign key references valid

**Selamat menggunakan sistem dengan data sebenar!** 🎉