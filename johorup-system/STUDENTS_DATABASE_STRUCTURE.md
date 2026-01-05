# 📚 Struktur Database Murid - Sistem JohorUP

## 🗄️ Tabel Students - Struktur Lengkap

### **Definisi Tabel Students**
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ic_number VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  class_level VARCHAR(10),
  class_name VARCHAR(50),
  gender VARCHAR(10),
  race VARCHAR(50),
  religion VARCHAR(50),
  address TEXT,
  parent_phone VARCHAR(20),
  tuition_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📋 Penjelasan Field-by-Field

### **1. Primary Key & Identifiers**
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | UUID | Primary key unik untuk setiap murid | `550e8400-e29b-41d4-a716-446655440000` |
| `ic_number` | VARCHAR(20) | No. IC murid (UNIQUE) | `051234567890` |

### **2. Basic Information**
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | VARCHAR(255) | Nama penuh murid | `Ahmad Bin Abdullah` |
| `gender` | VARCHAR(10) | Jantina murid | `Male`, `Female` |
| `race` | VARCHAR(50) | Kaum murid | `Malay`, `Chinese`, `Indian`, `Others` |
| `religion` | VARCHAR(50) | Agama murid | `Islam`, `Buddha`, `Hindu`, `Kristian` |

### **3. School & Class Information**
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `school_id` | UUID | Foreign Key ke schools table | `550e8400-e29b-41d4-a716-446655440001` |
| `class_level` | VARCHAR(10) | Tingkatan murid | `Form 4`, `Form 5` |
| `class_name` | VARCHAR(50) | Nama kelas | `4 Bestari`, `4 Cemerlang`, `5 Bijak` |

### **4. Contact & Status**
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `address` | TEXT | Alamat rumah murid | `No. 123, Jalan Merdeka, Taman Johor` |
| `parent_phone` | VARCHAR(20) | No. telefon ibu bapa | `012-3456789` |
| `tuition_status` | VARCHAR(50) | Status tuisyen | `active`, `inactive`, `graduated` |

### **5. System Fields**
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `created_at` | TIMESTAMP | Tarikh rekod dicipta | `2026-01-02 10:30:00` |

## 🔗 Relationships & Foreign Keys

### **Hierarchical Structure:**
```
PPD (Pejabat Pendidikan Daerah)
└── Schools (Sekolah)
    └── Students (Murid) ← Current Table
```

### **Foreign Key Relationships:**
```sql
-- Students belongs to Schools
students.school_id → schools.id

-- Schools belongs to PPD  
schools.ppd_id → ppd.id

-- Complete hierarchy chain:
students → schools → ppd
```

## 📊 Sample Data Structure

### **Contoh Data Murid:**
```sql
INSERT INTO students (
  ic_number, name, school_id, class_level, class_name, 
  gender, race, religion, address, parent_phone, tuition_status
) VALUES (
  '051234567890',
  'Ahmad Bin Abdullah', 
  '550e8400-e29b-41d4-a716-446655440001',
  'Form 4',
  '4 Bestari',
  'Male',
  'Malay',
  'Islam',
  'No. 123, Jalan Merdeka, 81200 Johor Bahru',
  '012-3456789',
  'active'
);
```

### **Demo Data yang Ada:**
| IC Number | Name | School | Class | Gender | Race |
|-----------|------|--------|-------|--------|------|
| 051234567890 | Ahmad Bin Abdullah | SMK Taman Johor Jaya | Form 4 4 Bestari | Male | Malay |
| 051234567891 | Siti Nurhaliza Binti Hassan | SMK Taman Johor Jaya | Form 4 4 Bestari | Female | Malay |
| 051234567892 | Lim Wei Ming | SMK Taman Johor Jaya | Form 4 4 Cemerlang | Male | Chinese |
| 051234567893 | Priya A/P Raman | SMK Kluang | Form 4 4 Bijak | Female | Indian |
| 051234567894 | Muhammad Faiz Bin Omar | SMK Kluang | Form 4 4 Bijak | Male | Malay |

## 🔍 Query Examples

### **1. Get All Students with School Info:**
```sql
SELECT 
  s.id,
  s.ic_number,
  s.name,
  s.class_level,
  s.class_name,
  s.gender,
  s.race,
  sch.name as school_name,
  ppd.name as ppd_name,
  ppd.district
FROM students s
LEFT JOIN schools sch ON s.school_id = sch.id
LEFT JOIN ppd ppd ON sch.ppd_id = ppd.id
ORDER BY s.name;
```

### **2. Get Students by School:**
```sql
SELECT s.*, sch.name as school_name
FROM students s
LEFT JOIN schools sch ON s.school_id = sch.id
WHERE s.school_id = $1
ORDER BY s.class_level, s.class_name, s.name;
```

### **3. Get Students by PPD:**
```sql
SELECT s.*, sch.name as school_name, ppd.name as ppd_name
FROM students s
LEFT JOIN schools sch ON s.school_id = sch.id
LEFT JOIN ppd ppd ON sch.ppd_id = ppd.id
WHERE sch.ppd_id = $1
ORDER BY sch.name, s.class_level, s.name;
```

### **4. Get Students by Class Level:**
```sql
SELECT s.*, sch.name as school_name
FROM students s
LEFT JOIN schools sch ON s.school_id = sch.id
WHERE s.class_level = 'Form 4'
ORDER BY s.class_name, s.name;
```

### **5. Count Students by School:**
```sql
SELECT 
  sch.name as school_name,
  COUNT(s.id) as student_count,
  COUNT(CASE WHEN s.gender = 'Male' THEN 1 END) as male_count,
  COUNT(CASE WHEN s.gender = 'Female' THEN 1 END) as female_count
FROM schools sch
LEFT JOIN students s ON sch.id = s.school_id
GROUP BY sch.id, sch.name
ORDER BY student_count DESC;
```

## 🎯 Role-Based Data Access

### **Super Admin:**
```sql
-- Can see ALL students
SELECT s.*, sch.name as school_name, ppd.name as ppd_name
FROM students s
LEFT JOIN schools sch ON s.school_id = sch.id
LEFT JOIN ppd ppd ON sch.ppd_id = ppd.id;
```

### **PPD User:**
```sql
-- Can see students in their PPD only
SELECT s.*, sch.name as school_name
FROM students s
LEFT JOIN schools sch ON s.school_id = sch.id
WHERE sch.ppd_id = $user_ppd_id;
```

### **SISC+ User:**
```sql
-- Can see students in their PPD and subject area
SELECT s.*, sch.name as school_name
FROM students s
LEFT JOIN schools sch ON s.school_id = sch.id
WHERE sch.ppd_id = $user_ppd_id
-- Additional filtering by subject in application layer
```

### **School Admin:**
```sql
-- Can see students in their school only
SELECT s.*, sch.name as school_name
FROM students s
LEFT JOIN schools sch ON s.school_id = sch.id
WHERE s.school_id = $user_school_id;
```

### **Teacher:**
```sql
-- Can see students in their school (filtered by subject in app)
SELECT s.*, sch.name as school_name
FROM students s
LEFT JOIN schools sch ON s.school_id = sch.id
WHERE s.school_id = $user_school_id;
```

## 📈 Performance Indexes

### **Recommended Indexes:**
```sql
-- Primary performance indexes
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_class_level ON students(class_level);
CREATE INDEX idx_students_ic_number ON students(ic_number);
CREATE INDEX idx_students_name ON students(name);
CREATE INDEX idx_students_tuition_status ON students(tuition_status);

-- Composite indexes for common queries
CREATE INDEX idx_students_school_class ON students(school_id, class_level, class_name);
CREATE INDEX idx_students_gender_race ON students(gender, race);
```

## 🔄 Data Validation Rules

### **Business Rules:**
1. **IC Number**: Must be unique across all students
2. **School ID**: Must reference valid school
3. **Class Level**: Must be valid form (Form 4, Form 5)
4. **Gender**: Must be 'Male' or 'Female'
5. **Tuition Status**: Must be 'active', 'inactive', or 'graduated'

### **Validation Examples:**
```sql
-- Check for duplicate IC numbers
SELECT ic_number, COUNT(*) 
FROM students 
GROUP BY ic_number 
HAVING COUNT(*) > 1;

-- Check for invalid school references
SELECT s.* 
FROM students s 
LEFT JOIN schools sch ON s.school_id = sch.id 
WHERE sch.id IS NULL;

-- Check for invalid class levels
SELECT * 
FROM students 
WHERE class_level NOT IN ('Form 4', 'Form 5');
```

## 📊 Statistics & Reporting

### **Common Statistics Queries:**
```sql
-- Total students by PPD
SELECT 
  ppd.name as ppd_name,
  COUNT(s.id) as total_students
FROM ppd ppd
LEFT JOIN schools sch ON ppd.id = sch.ppd_id
LEFT JOIN students s ON sch.id = s.school_id
GROUP BY ppd.id, ppd.name;

-- Students by gender and race
SELECT 
  gender,
  race,
  COUNT(*) as count
FROM students
GROUP BY gender, race
ORDER BY count DESC;

-- Students by class level
SELECT 
  class_level,
  COUNT(*) as count
FROM students
GROUP BY class_level
ORDER BY class_level;
```

## 🔐 Security & Audit

### **Audit Trail Integration:**
```sql
-- All student data changes are logged in audit_logs table
-- CREATE, UPDATE, DELETE operations are tracked
-- Old and new values are stored for comparison
```

### **Data Privacy:**
- IC numbers are sensitive data - access controlled by role
- Parent contact information restricted to school admin and above
- Address information limited to authorized personnel

## 🚀 Future Enhancements

### **Potential Additional Fields:**
```sql
-- Academic performance tracking
exam_results JSONB,
attendance_rate DECIMAL(5,2),
behavior_score INTEGER,

-- Additional demographics
date_of_birth DATE,
nationality VARCHAR(50),
special_needs TEXT,

-- Parent/Guardian information
guardian_name VARCHAR(255),
guardian_ic VARCHAR(20),
guardian_occupation VARCHAR(100),

-- Academic tracking
enrollment_date DATE,
graduation_date DATE,
previous_school VARCHAR(255)
```

## 📝 Best Practices

### **1. Data Integrity:**
- Always use UUID for primary keys
- Maintain foreign key constraints
- Validate data before insertion

### **2. Performance:**
- Use appropriate indexes for common queries
- Limit result sets with pagination
- Use JOIN efficiently for hierarchical data

### **3. Security:**
- Implement role-based access control
- Log all data modifications
- Protect sensitive information (IC, phone numbers)

### **4. Maintenance:**
- Regular data cleanup for graduated students
- Archive old records instead of deletion
- Monitor database performance and optimize queries

Struktur database murid ini direka untuk memenuhi keperluan sistem pendidikan Malaysia dengan security, performance, dan scalability yang tinggi. 🎓