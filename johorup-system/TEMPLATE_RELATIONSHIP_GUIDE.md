# 🔗 Panduan Relationship Schools ↔ Students

## 📋 **Template 1: Schools.xlsx**

**Sheet Name: "Schools"**

| id | name | code | ppd_id | address | phone | email | principal_name | target_students |
|----|------|------|--------|---------|-------|-------|----------------|-----------------|
| 1 | SMK Taman Johor Jaya | SMKTJJ | 1 | Taman Johor Jaya, 81100 JB | 07-3551234 | smktjj@moe-dl.edu.my | Puan Siti Aminah | 44 |
| 2 | SMK Bandar Baru UDA | SMKBBUDA | 1 | Bandar Baru UDA, 81200 JB | 07-5561234 | smkbbuda@moe-dl.edu.my | Encik Ahmad Rahman | 44 |
| 3 | SMK Taman Universiti | SMKTU | 1 | Taman Universiti, 81300 Skudai | 07-5201234 | smktu@moe-dl.edu.my | Puan Noraini Hassan | 44 |
| 4 | SMK Skudai | SMKSKUDAI | 1 | Skudai, 81300 JB | 07-5511234 | smkskudai@moe-dl.edu.my | Encik Mohd Ali | 44 |
| 5 | SMK Kulai | SMKKULAI | 1 | Kulai, 81000 Kulai | 07-6631234 | smkkulai@moe-dl.edu.my | Puan Fatimah Zahra | 44 |

## 📋 **Template 2: Students.xlsx**

**Sheet Name: "Students"**

| id | name | ic_number | school_id | form_level | class_name | phone | parent_phone | address | is_target_student |
|----|------|-----------|-----------|------------|------------|-------|--------------|---------|-------------------|
| 1 | Ahmad Bin Abdullah | 051234567890 | 1 | 4 | 4 Bestari | 012-3456789 | 019-8765432 | Taman Johor Jaya | TRUE |
| 2 | Siti Nurhaliza | 051234567891 | 1 | 4 | 4 Bestari | 012-3456790 | 019-8765433 | Taman Johor Jaya | TRUE |
| 3 | Muhammad Hakim | 051234567892 | 1 | 4 | 4 Cemerlang | 012-3456791 | 019-8765434 | Taman Johor Jaya | TRUE |
| 4 | Nurul Ain Fatihah | 051234567893 | 2 | 4 | 4 Bestari | 012-3456792 | 019-8765435 | Bandar Baru UDA | TRUE |
| 5 | Mohd Fikri Hakim | 051234567894 | 2 | 4 | 4 Cemerlang | 012-3456793 | 019-8765436 | Bandar Baru UDA | TRUE |

## 🔗 **Cara Relationship Berfungsi:**

### **Foreign Key: school_id**
- **Students.school_id** = **Schools.id**
- Student dengan `school_id = 1` adalah murid SMK Taman Johor Jaya
- Student dengan `school_id = 2` adalah murid SMK Bandar Baru UDA

### **Contoh Relationship:**
```
SMK Taman Johor Jaya (id=1)
├── Ahmad Bin Abdullah (school_id=1)
├── Siti Nurhaliza (school_id=1)  
└── Muhammad Hakim (school_id=1)

SMK Bandar Baru UDA (id=2)
├── Nurul Ain Fatihah (school_id=2)
└── Mohd Fikri Hakim (school_id=2)
```

## 📝 **Langkah-Langkah Setup:**

### **1. Buat Schools Template Dulu**
```csv
id,name,code,ppd_id,address,phone,email,principal_name,target_students
1,SMK Taman Johor Jaya,SMKTJJ,1,"Taman Johor Jaya, 81100 JB",07-3551234,smktjj@moe-dl.edu.my,Puan Siti Aminah,44
2,SMK Bandar Baru UDA,SMKBBUDA,1,"Bandar Baru UDA, 81200 JB",07-5561234,smkbbuda@moe-dl.edu.my,Encik Ahmad Rahman,44
3,SMK Taman Universiti,SMKTU,1,"Taman Universiti, 81300 Skudai",07-5201234,smktu@moe-dl.edu.my,Puan Noraini Hassan,44
```

### **2. Buat Students Template dengan school_id**
```csv
id,name,ic_number,school_id,form_level,class_name,phone,parent_phone,address,is_target_student
1,Ahmad Bin Abdullah,051234567890,1,4,4 Bestari,012-3456789,019-8765432,Taman Johor Jaya,TRUE
2,Siti Nurhaliza,051234567891,1,4,4 Bestari,012-3456790,019-8765433,Taman Johor Jaya,TRUE
3,Muhammad Hakim,051234567892,1,4,4 Cemerlang,012-3456791,019-8765434,Taman Johor Jaya,TRUE
4,Nurul Ain Fatihah,051234567893,2,4,4 Bestari,012-3456792,019-8765435,Bandar Baru UDA,TRUE
```

### **3. Import Mengikut Urutan**
```bash
# 1. Import Schools dulu (parent table)
node scripts/import-schools.js

# 2. Baru import Students (child table)  
node scripts/import-students.js
```

## ✅ **Validation Rules:**

### **School ID Must Exist**
- Setiap `school_id` dalam Students mesti wujud dalam Schools table
- Jika `school_id = 5`, mesti ada school dengan `id = 5`

### **Data Consistency**
- Pastikan jumlah students per school sesuai dengan `target_students`
- Example: SMK TJJ target 44 students, pastikan ada 44 records dengan `school_id = 1`

## 🔍 **Query untuk Check Relationship:**

### **Count Students per School**
```sql
SELECT 
    s.name as school_name,
    s.target_students,
    COUNT(st.id) as actual_students,
    (COUNT(st.id) - s.target_students) as difference
FROM schools s
LEFT JOIN students st ON s.id = st.school_id
GROUP BY s.id, s.name, s.target_students
ORDER BY s.name;
```

### **List Students by School**
```sql
SELECT 
    s.name as school_name,
    st.name as student_name,
    st.ic_number,
    st.class_name
FROM schools s
JOIN students st ON s.id = st.school_id
WHERE s.id = 1  -- SMK Taman Johor Jaya
ORDER BY st.name;
```

## 📊 **Template Excel Lengkap (20 Schools + 880 Students)**

### **Schools (20 records)**
- PPD Johor Bahru: School ID 1-8 (8 schools × 44 students = 352)
- PPD Muar: School ID 9-14 (6 schools × 44 students = 264)  
- PPD Batu Pahat: School ID 15-20 (6 schools × 44 students = 264)
- **Total: 880 students**

### **Students (880 records)**
- School ID 1: Students 1-44
- School ID 2: Students 45-88
- School ID 3: Students 89-132
- ...dan seterusnya

## 🛠️ **Tools untuk Generate Template**

### **Excel Formula untuk school_id**
```excel
# Dalam Students template, column school_id:
=INT((ROW()-2)/44)+1

# Explanation:
# ROW()-2: Current row minus header rows
# /44: Divide by students per school  
# INT(): Round down to get school ID
# +1: Start from school ID 1
```

### **Generate IC Numbers**
```excel
# Pattern: 05 + school_id + student_number
="05" & TEXT(school_id,"00") & TEXT(MOD(ROW()-2,44)+1,"00") & "567890"
```

## ⚠️ **Common Mistakes:**

1. **Wrong school_id**: Student dengan school_id yang tidak wujud
2. **Missing schools**: Import students sebelum schools
3. **Inconsistent count**: Jumlah students tidak sama dengan target
4. **Duplicate IDs**: Same student ID atau IC number

## 🎯 **Best Practices:**

1. **Always import Schools first**
2. **Use consistent ID numbering**
3. **Validate data before import**
4. **Test with small dataset first**
5. **Backup before import**

---

**Dengan relationship ini, sistem boleh:**
- Show students by school
- Calculate statistics per school
- Generate school reports
- Track student progress by school
- Manage school-specific data