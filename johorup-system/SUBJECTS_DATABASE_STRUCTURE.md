# 📚 Struktur Database Mata Pelajaran - Sistem JohorUP

## 🎯 Overview

Database structure untuk menguruskan:
1. **Mata Pelajaran** (Subjects) - Core, Elective, Additional
2. **Kurikulum & Syllabus** - KSSM, STPM standards
3. **Subject Assignments** - Teacher-Subject relationships
4. **Subject Performance** - Analytics per subject
5. **Subject Resources** - Materials, references, guidelines

## 🗄️ Database Tables Structure

### 1. **subjects** - Master Mata Pelajaran

```sql
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_code VARCHAR(10) UNIQUE NOT NULL,        -- 'BM', 'BI', 'MAT', 'SEJ', 'SN'
  subject_name_bm VARCHAR(255) NOT NULL,           -- 'Bahasa Melayu'
  subject_name_en VARCHAR(255) NOT NULL,           -- 'Malay Language'
  subject_category VARCHAR(50) NOT NULL,           -- 'CORE', 'ELECTIVE', 'ADDITIONAL', 'VOCATIONAL'
  subject_type VARCHAR(50) NOT NULL,               -- 'ACADEMIC', 'TECHNICAL', 'LANGUAGE', 'SCIENCE', 'ARTS'
  
  -- Academic details
  form_levels TEXT[] NOT NULL,                     -- ['Form 4', 'Form 5'] or ['Form 1', 'Form 2', 'Form 3']
  curriculum_standard VARCHAR(50) NOT NULL,        -- 'KSSM', 'STPM', 'KBSM'
  total_periods_per_week INTEGER DEFAULT 0,       -- Teaching periods per week
  
  -- Exam configuration
  has_practical BOOLEAN DEFAULT false,            -- Has practical component
  paper_count INTEGER DEFAULT 1,                  -- Number of exam papers
  total_exam_marks INTEGER DEFAULT 100,           -- Total marks for exam
  passing_marks INTEGER DEFAULT 40,               -- Minimum passing marks
  
  -- Grading system
  grade_boundaries JSONB,                         -- Standard grade boundaries
  weightage_theory DECIMAL(5,2),                 -- Theory component weightage
  weightage_practical DECIMAL(5,2),              -- Practical component weightage
  weightage_coursework DECIMAL(5,2),             -- Coursework component weightage
  
  -- Subject hierarchy
  parent_subject_id UUID REFERENCES subjects(id), -- For sub-subjects
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  -- Metadata
  description TEXT,
  learning_objectives TEXT[],
  prerequisites TEXT[],
  career_pathways TEXT[],
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. **subject_syllabi** - Sukatan Pelajaran

```sql
CREATE TABLE subject_syllabi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  form_level VARCHAR(10) NOT NULL,               -- 'Form 4', 'Form 5'
  academic_year INTEGER NOT NULL,                -- 2026, 2027
  syllabus_version VARCHAR(20) NOT NULL,         -- 'KSSM 2017', 'KSSM 2022'
  
  -- Syllabus structure
  chapters JSONB NOT NULL,                       -- Chapter breakdown with topics
  learning_standards JSONB,                     -- Learning standards per chapter
  assessment_criteria JSONB,                    -- Assessment rubrics
  
  -- Time allocation
  total_teaching_hours INTEGER,
  chapter_time_allocation JSONB,                -- Hours per chapter
  
  -- Resources
  textbook_references JSONB,                    -- Official textbooks
  supplementary_materials JSONB,               -- Additional resources
  digital_resources JSONB,                     -- Online materials, videos
  
  -- Status
  approval_status VARCHAR(20) DEFAULT 'DRAFT',  -- DRAFT, APPROVED, ARCHIVED
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. **subject_teachers** - Penugasan Guru-Mata Pelajaran

```sql
CREATE TABLE subject_teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  
  -- Assignment details
  form_levels TEXT[] NOT NULL,                   -- ['Form 4', 'Form 5']
  classes TEXT[],                               -- ['4 Bestari', '4 Cemerlang']
  academic_year INTEGER NOT NULL,               -- 2026, 2027
  
  -- Teaching load
  periods_per_week INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  
  -- Specialization
  specialization_areas TEXT[],                  -- ['Literature', 'Grammar', 'Oral']
  teaching_experience_years INTEGER DEFAULT 0,
  qualification_level VARCHAR(50),             -- 'DEGREE', 'MASTERS', 'PHD'
  
  -- Performance tracking
  average_student_performance DECIMAL(5,2),
  improvement_rate DECIMAL(5,2),
  
  -- Status
  assignment_type VARCHAR(20) DEFAULT 'PERMANENT', -- PERMANENT, TEMPORARY, RELIEF
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  
  -- Constraints
  UNIQUE(teacher_id, subject_id, school_id, academic_year),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. **subject_performance_analytics** - Analisis Prestasi Mata Pelajaran

```sql
CREATE TABLE subject_performance_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  exam_session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
  
  -- Performance metrics
  total_students INTEGER NOT NULL,
  students_passed INTEGER DEFAULT 0,
  students_failed INTEGER DEFAULT 0,
  pass_rate DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE WHEN total_students > 0 THEN (students_passed::DECIMAL / total_students) * 100 ELSE 0 END
  ) STORED,
  
  -- Grade distribution
  grade_a_plus INTEGER DEFAULT 0,
  grade_a INTEGER DEFAULT 0,
  grade_a_minus INTEGER DEFAULT 0,
  grade_b_plus INTEGER DEFAULT 0,
  grade_b INTEGER DEFAULT 0,
  grade_c_plus INTEGER DEFAULT 0,
  grade_c INTEGER DEFAULT 0,
  grade_d INTEGER DEFAULT 0,
  grade_e INTEGER DEFAULT 0,
  grade_g INTEGER DEFAULT 0,
  
  -- Statistical measures
  average_marks DECIMAL(5,2),
  median_marks DECIMAL(5,2),
  highest_marks DECIMAL(5,2),
  lowest_marks DECIMAL(5,2),
  standard_deviation DECIMAL(5,2),
  
  -- Comparison metrics
  national_average DECIMAL(5,2),
  state_average DECIMAL(5,2),
  ppd_average DECIMAL(5,2),
  performance_index DECIMAL(5,2),              -- Relative to benchmarks
  
  -- Analysis period
  analysis_date DATE DEFAULT CURRENT_DATE,
  academic_year INTEGER NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. **subject_resources** - Sumber Mata Pelajaran

```sql
CREATE TABLE subject_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  resource_title VARCHAR(255) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,           -- 'TEXTBOOK', 'WORKBOOK', 'DIGITAL', 'VIDEO', 'ASSESSMENT'
  
  -- Resource details
  author_publisher VARCHAR(255),
  publication_year INTEGER,
  isbn_code VARCHAR(20),
  language VARCHAR(20) DEFAULT 'BM',            -- 'BM', 'EN', 'BILINGUAL'
  
  -- Applicability
  form_levels TEXT[] NOT NULL,
  curriculum_alignment VARCHAR(50),             -- 'KSSM', 'STPM'
  
  -- Access information
  resource_url TEXT,
  file_path TEXT,
  access_type VARCHAR(20) DEFAULT 'FREE',       -- 'FREE', 'PAID', 'RESTRICTED'
  
  -- Usage tracking
  download_count INTEGER DEFAULT 0,
  usage_rating DECIMAL(3,2) DEFAULT 0.00,
  
  -- Approval
  approval_status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED
  approved_by UUID REFERENCES users(id),
  
  -- Metadata
  description TEXT,
  tags TEXT[],
  file_size_mb DECIMAL(8,2),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. **subject_learning_outcomes** - Hasil Pembelajaran

```sql
CREATE TABLE subject_learning_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  form_level VARCHAR(10) NOT NULL,
  
  -- Learning outcome details
  outcome_code VARCHAR(20) NOT NULL,            -- 'BM.4.1.1', 'MAT.5.2.3'
  outcome_description TEXT NOT NULL,
  cognitive_level VARCHAR(20),                  -- 'KNOWLEDGE', 'COMPREHENSION', 'APPLICATION', 'ANALYSIS'
  
  -- Curriculum mapping
  chapter_reference VARCHAR(100),
  topic_reference VARCHAR(100),
  subtopic_reference VARCHAR(100),
  
  -- Assessment mapping
  assessment_methods TEXT[],                    -- ['WRITTEN', 'ORAL', 'PRACTICAL', 'PROJECT']
  weightage_percentage DECIMAL(5,2),
  
  -- Skills development
  thinking_skills TEXT[],                       -- ['CRITICAL', 'CREATIVE', 'ANALYTICAL']
  values_attitudes TEXT[],                      -- ['PATRIOTISM', 'RESPONSIBILITY', 'EXCELLENCE']
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  academic_year INTEGER NOT NULL,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. **subject_timetables** - Jadual Mata Pelajaran

```sql
CREATE TABLE subject_timetables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Class details
  form_level VARCHAR(10) NOT NULL,
  class_name VARCHAR(50) NOT NULL,
  academic_year INTEGER NOT NULL,
  semester VARCHAR(10) DEFAULT 'FULL_YEAR',     -- 'SEMESTER_1', 'SEMESTER_2', 'FULL_YEAR'
  
  -- Schedule details
  day_of_week INTEGER NOT NULL,                -- 1=Monday, 2=Tuesday, etc.
  period_number INTEGER NOT NULL,              -- 1st period, 2nd period, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  
  -- Location
  classroom VARCHAR(50),
  laboratory VARCHAR(50),
  special_room VARCHAR(50),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  effective_date DATE DEFAULT CURRENT_DATE,
  
  -- Constraints
  UNIQUE(school_id, day_of_week, period_number, classroom, academic_year),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📊 Sample Data Structure

### **Core Subjects (Mata Pelajaran Teras):**
```sql
INSERT INTO subjects (subject_code, subject_name_bm, subject_name_en, subject_category, subject_type, form_levels, curriculum_standard, paper_count, total_exam_marks) VALUES
('BM', 'Bahasa Melayu', 'Malay Language', 'CORE', 'LANGUAGE', '["Form 4", "Form 5"]', 'KSSM', 2, 100),
('BI', 'Bahasa Inggeris', 'English Language', 'CORE', 'LANGUAGE', '["Form 4", "Form 5"]', 'KSSM', 2, 100),
('MAT', 'Matematik', 'Mathematics', 'CORE', 'SCIENCE', '["Form 4", "Form 5"]', 'KSSM', 2, 100),
('SEJ', 'Sejarah', 'History', 'CORE', 'ARTS', '["Form 4", "Form 5"]', 'KSSM', 1, 100),
('SN', 'Sains', 'Science', 'CORE', 'SCIENCE', '["Form 4", "Form 5"]', 'KSSM', 2, 100);
```

### **Elective Subjects (Mata Pelajaran Elektif):**
```sql
INSERT INTO subjects (subject_code, subject_name_bm, subject_name_en, subject_category, subject_type, form_levels, curriculum_standard, paper_count, total_exam_marks) VALUES
('FIZ', 'Fizik', 'Physics', 'ELECTIVE', 'SCIENCE', '["Form 4", "Form 5"]', 'KSSM', 3, 100),
('KIM', 'Kimia', 'Chemistry', 'ELECTIVE', 'SCIENCE', '["Form 4", "Form 5"]', 'KSSM', 3, 100),
('BIO', 'Biologi', 'Biology', 'ELECTIVE', 'SCIENCE', '["Form 4", "Form 5"]', 'KSSM', 3, 100),
('GEO', 'Geografi', 'Geography', 'ELECTIVE', 'ARTS', '["Form 4", "Form 5"]', 'KSSM', 2, 100),
('EKO', 'Ekonomi', 'Economics', 'ELECTIVE', 'ARTS', '["Form 4", "Form 5"]', 'KSSM', 2, 100);
```

### **Additional Subjects (Mata Pelajaran Tambahan):**
```sql
INSERT INTO subjects (subject_code, subject_name_bm, subject_name_en, subject_category, subject_type, form_levels, curriculum_standard, paper_count, total_exam_marks) VALUES
('MATAM', 'Matematik Tambahan', 'Additional Mathematics', 'ADDITIONAL', 'SCIENCE', '["Form 4", "Form 5"]', 'KSSM', 2, 100),
('BC', 'Bahasa Cina', 'Chinese Language', 'ADDITIONAL', 'LANGUAGE', '["Form 4", "Form 5"]', 'KSSM', 2, 100),
('BT', 'Bahasa Tamil', 'Tamil Language', 'ADDITIONAL', 'LANGUAGE', '["Form 4", "Form 5"]', 'KSSM', 2, 100),
('PI', 'Pendidikan Islam', 'Islamic Education', 'ADDITIONAL', 'RELIGIOUS', '["Form 4", "Form 5"]', 'KSSM', 1, 100);
```

## 🔍 Key Queries for Subject Management

### **1. Get All Subjects by Category:**
```sql
SELECT 
  subject_code,
  subject_name_bm,
  subject_name_en,
  subject_category,
  subject_type,
  form_levels,
  paper_count,
  total_exam_marks
FROM subjects 
WHERE subject_category = 'CORE' AND is_active = true
ORDER BY display_order, subject_name_bm;
```

### **2. Get Teacher Subject Assignments:**
```sql
SELECT 
  u.name as teacher_name,
  s.subject_name_bm,
  st.form_levels,
  st.classes,
  st.periods_per_week,
  st.total_students,
  sch.name as school_name
FROM subject_teachers st
JOIN users u ON st.teacher_id = u.id
JOIN subjects s ON st.subject_id = s.id
JOIN schools sch ON st.school_id = sch.id
WHERE st.academic_year = 2026 AND st.is_active = true
ORDER BY sch.name, u.name, s.subject_name_bm;
```

### **3. Subject Performance Analysis:**
```sql
SELECT 
  s.subject_name_bm,
  spa.total_students,
  spa.pass_rate,
  spa.average_marks,
  spa.grade_a_plus + spa.grade_a + spa.grade_a_minus as grade_a_total,
  spa.performance_index,
  sch.name as school_name
FROM subject_performance_analytics spa
JOIN subjects s ON spa.subject_id = s.id
JOIN schools sch ON spa.school_id = sch.id
WHERE spa.academic_year = 2026
ORDER BY spa.pass_rate DESC, spa.average_marks DESC;
```

### **4. Subject Resource Inventory:**
```sql
SELECT 
  s.subject_name_bm,
  sr.resource_title,
  sr.resource_type,
  sr.author_publisher,
  sr.form_levels,
  sr.access_type,
  sr.usage_rating
FROM subject_resources sr
JOIN subjects s ON sr.subject_id = s.id
WHERE sr.approval_status = 'APPROVED'
ORDER BY s.subject_name_bm, sr.resource_type, sr.usage_rating DESC;
```

### **5. Weekly Timetable by Subject:**
```sql
SELECT 
  s.subject_name_bm,
  st.form_level,
  st.class_name,
  st.day_of_week,
  st.period_number,
  st.start_time,
  st.end_time,
  st.classroom,
  u.name as teacher_name
FROM subject_timetables st
JOIN subjects s ON st.subject_id = s.id
JOIN users u ON st.teacher_id = u.id
WHERE st.school_id = $1 AND st.academic_year = 2026 AND st.is_active = true
ORDER BY st.day_of_week, st.period_number, s.subject_name_bm;
```

## 📈 Performance Indexes

```sql
-- Subjects indexes
CREATE INDEX idx_subjects_code ON subjects(subject_code);
CREATE INDEX idx_subjects_category ON subjects(subject_category);
CREATE INDEX idx_subjects_type ON subjects(subject_type);
CREATE INDEX idx_subjects_active ON subjects(is_active);

-- Subject teachers indexes
CREATE INDEX idx_subject_teachers_teacher_id ON subject_teachers(teacher_id);
CREATE INDEX idx_subject_teachers_subject_id ON subject_teachers(subject_id);
CREATE INDEX idx_subject_teachers_school_id ON subject_teachers(school_id);
CREATE INDEX idx_subject_teachers_academic_year ON subject_teachers(academic_year);
CREATE INDEX idx_subject_teachers_active ON subject_teachers(is_active);

-- Performance analytics indexes
CREATE INDEX idx_performance_analytics_subject_id ON subject_performance_analytics(subject_id);
CREATE INDEX idx_performance_analytics_school_id ON subject_performance_analytics(school_id);
CREATE INDEX idx_performance_analytics_session_id ON subject_performance_analytics(exam_session_id);
CREATE INDEX idx_performance_analytics_year ON subject_performance_analytics(academic_year);

-- Resources indexes
CREATE INDEX idx_subject_resources_subject_id ON subject_resources(subject_id);
CREATE INDEX idx_subject_resources_type ON subject_resources(resource_type);
CREATE INDEX idx_subject_resources_approval ON subject_resources(approval_status);

-- Timetables indexes
CREATE INDEX idx_subject_timetables_school_id ON subject_timetables(school_id);
CREATE INDEX idx_subject_timetables_subject_id ON subject_timetables(subject_id);
CREATE INDEX idx_subject_timetables_teacher_id ON subject_timetables(teacher_id);
CREATE INDEX idx_subject_timetables_schedule ON subject_timetables(day_of_week, period_number);

-- Composite indexes for common queries
CREATE INDEX idx_subject_teachers_composite ON subject_teachers(school_id, academic_year, is_active);
CREATE INDEX idx_timetables_composite ON subject_timetables(school_id, academic_year, day_of_week);
```

## 🎯 Business Rules & Validations

### **Subject Categories:**
- **CORE:** Wajib untuk semua murid (BM, BI, MAT, SEJ, SN)
- **ELECTIVE:** Pilihan mengikut stream (FIZ, KIM, BIO, GEO, EKO)
- **ADDITIONAL:** Tambahan untuk keperluan khusus (MATAM, BC, BT, PI)
- **VOCATIONAL:** Teknikal dan vokasional

### **Grade Boundaries (Standard SPM):**
```sql
UPDATE subjects SET grade_boundaries = '{
  "A+": {"min": 90, "max": 100, "points": 4.00},
  "A": {"min": 80, "max": 89, "points": 4.00},
  "A-": {"min": 75, "max": 79, "points": 3.67},
  "B+": {"min": 70, "max": 74, "points": 3.33},
  "B": {"min": 65, "max": 69, "points": 3.00},
  "C+": {"min": 60, "max": 64, "points": 2.67},
  "C": {"min": 50, "max": 59, "points": 2.00},
  "D": {"min": 40, "max": 49, "points": 1.00},
  "E": {"min": 30, "max": 39, "points": 0.00},
  "G": {"min": 0, "max": 29, "points": 0.00}
}'::jsonb WHERE subject_category IN ('CORE', 'ELECTIVE', 'ADDITIONAL');
```

### **Validation Rules:**
1. **Subject Code:** Must be unique and follow MOE standards
2. **Teacher Assignment:** One teacher can teach multiple subjects, multiple classes
3. **Timetable:** No conflicts in same classroom/teacher at same time
4. **Performance Analytics:** Must have valid exam session reference

## 🔐 Role-Based Access Control

### **Data Access by Role:**

| Role | Subjects | Teacher Assignments | Performance | Resources | Timetables |
|------|----------|-------------------|-------------|-----------|------------|
| **Super Admin** | All subjects | All assignments | All analytics | All resources | All timetables |
| **PPD User** | All subjects | PPD schools | PPD analytics | Approved resources | PPD timetables |
| **SISC+** | Subject area | Subject teachers | Subject analytics | Subject resources | Subject schedules |
| **School Admin** | School subjects | School teachers | School analytics | School resources | School timetables |
| **Teacher** | Assigned subjects | Own assignments | Own performance | Subject resources | Own schedule |

## 📊 Reporting & Analytics

### **Key Performance Indicators (KPIs):**

1. **Subject Performance Index:** Average performance vs national benchmark
2. **Teacher Workload Distribution:** Periods per teacher per subject
3. **Resource Utilization Rate:** Usage of digital and physical resources
4. **Pass Rate Trends:** Subject performance over time
5. **Grade Distribution Analysis:** A-G grade patterns per subject

### **Dashboard Metrics:**
- Total subjects offered by school/PPD
- Teacher-subject assignment coverage
- Subject performance rankings
- Resource availability and usage
- Timetable optimization metrics

## 🚀 Integration with Other Systems

### **Links to Existing Tables:**
```sql
-- Integration with exam system
ALTER TABLE exam_subjects ADD COLUMN master_subject_id UUID REFERENCES subjects(id);

-- Integration with targeted students
ALTER TABLE targeted_students ADD COLUMN master_subject_id UUID REFERENCES subjects(id);

-- Integration with users (teachers)
ALTER TABLE users ADD COLUMN primary_subjects UUID[];
ALTER TABLE users ADD COLUMN secondary_subjects UUID[];
```

## 🎓 Malaysian Education Standards Compliance

### **KSSM (Kurikulum Standard Sekolah Menengah) Alignment:**
- Subject codes follow MOE standards
- Learning outcomes mapped to curriculum
- Assessment criteria aligned with national standards
- Resource approval process for quality assurance

### **SPM Preparation Integration:**
- Grade boundaries match SPM standards
- Paper structure reflects actual exam format
- Performance analytics support SPM readiness
- Targeted student system focuses on SPM subjects

Database structure ini membolehkan **comprehensive subject management** dengan integration kepada sistem peperiksaan, pengurusan guru, dan analisis prestasi yang menyeluruh! 📚