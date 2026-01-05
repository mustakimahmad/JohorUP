# 📊 Struktur Database Peperiksaan Murid - Sistem JohorUP

## 🎯 Overview

Database structure untuk menguruskan:
1. **Murid yang Disasarkan** (Targeted Students)
2. **Keputusan Peperiksaan** (Exam Results)
3. **Perkembangan Murid** (Student Progress Tracking)
4. **Analisis Prestasi** (Performance Analysis)

## 🗄️ Database Tables Structure

### 1. **targeted_students** - Murid yang Disasarkan

```sql
CREATE TABLE targeted_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  target_grade VARCHAR(5) NOT NULL,              -- A+, A, A-, B+, B, C+, C
  current_grade VARCHAR(5),                      -- Current performance level
  baseline_marks DECIMAL(5,2),                  -- Starting point marks
  target_marks DECIMAL(5,2),                    -- Target marks to achieve
  target_year INTEGER NOT NULL,                 -- 2026, 2027
  target_exam VARCHAR(50) NOT NULL,             -- 'SPM', 'STPM', 'PERCUBAAN_SPM'
  intervention_type VARCHAR(100),               -- 'TUITION', 'REMEDIAL', 'ENRICHMENT'
  assigned_teacher_id UUID REFERENCES users(id),
  assigned_sisc_id UUID REFERENCES users(id),
  priority_level VARCHAR(20) DEFAULT 'MEDIUM',  -- HIGH, MEDIUM, LOW
  status VARCHAR(20) DEFAULT 'ACTIVE',          -- ACTIVE, ACHIEVED, DISCONTINUED
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. **exam_sessions** - Sesi Peperiksaan

```sql
CREATE TABLE exam_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_name VARCHAR(255) NOT NULL,           -- 'Peperiksaan Pertengahan Tahun 2026'
  session_code VARCHAR(50) UNIQUE NOT NULL,     -- 'PTT_2026', 'PERCUBAAN_SPM_2026'
  exam_type VARCHAR(50) NOT NULL,               -- 'PERTENGAHAN_TAHUN', 'PERCUBAAN_SPM', 'AKHIR_TAHUN'
  academic_year INTEGER NOT NULL,               -- 2026, 2027
  form_level VARCHAR(10) NOT NULL,              -- 'Form 4', 'Form 5'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  registration_deadline DATE,
  status VARCHAR(20) DEFAULT 'UPCOMING',        -- UPCOMING, ONGOING, COMPLETED, CANCELLED
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. **exam_subjects** - Subjek Peperiksaan

```sql
CREATE TABLE exam_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
  subject_code VARCHAR(20) NOT NULL,            -- 'BM', 'BI', 'MAT', 'SEJ', 'SN'
  subject_name VARCHAR(255) NOT NULL,           -- 'Bahasa Melayu', 'Mathematics'
  subject_type VARCHAR(50) NOT NULL,            -- 'CORE', 'ELECTIVE', 'ADDITIONAL'
  paper_count INTEGER DEFAULT 1,               -- Number of papers (1, 2, 3)
  total_marks INTEGER NOT NULL,                -- Maximum marks possible
  passing_marks INTEGER,                       -- Minimum marks to pass
  grade_boundaries JSONB,                      -- Grade boundaries for A+, A, B+, etc.
  exam_date DATE,
  exam_time TIME,
  duration_minutes INTEGER,                    -- Exam duration
  is_mandatory BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. **student_exam_results** - Keputusan Peperiksaan Murid

```sql
CREATE TABLE student_exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  session_id UUID REFERENCES exam_sessions(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES exam_subjects(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  
  -- Marks breakdown
  paper_1_marks DECIMAL(5,2),
  paper_2_marks DECIMAL(5,2),
  paper_3_marks DECIMAL(5,2),
  total_marks DECIMAL(5,2) NOT NULL,
  percentage DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN total_marks > 0 THEN (total_marks / (SELECT total_marks FROM exam_subjects WHERE id = subject_id)) * 100
      ELSE 0 
    END
  ) STORED,
  
  -- Grading
  grade VARCHAR(5) NOT NULL,                   -- A+, A, A-, B+, B, C+, C, D, E, G, TH
  grade_point DECIMAL(3,2),                   -- 4.00, 3.67, 3.33, etc.
  
  -- Status and tracking
  status VARCHAR(20) DEFAULT 'SUBMITTED',      -- SUBMITTED, VERIFIED, PUBLISHED
  is_targeted_student BOOLEAN DEFAULT false,
  improvement_from_baseline DECIMAL(5,2),     -- Improvement percentage
  
  -- Metadata
  entered_by UUID REFERENCES users(id),       -- Teacher who entered the result
  verified_by UUID REFERENCES users(id),      -- Admin who verified
  entered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_at TIMESTAMP,
  
  -- Constraints
  UNIQUE(student_id, session_id, subject_id)
);
```

### 5. **student_progress_tracking** - Penjejakan Perkembangan

```sql
CREATE TABLE student_progress_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  targeted_student_id UUID REFERENCES targeted_students(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  
  -- Progress metrics
  baseline_session_id UUID REFERENCES exam_sessions(id),
  current_session_id UUID REFERENCES exam_sessions(id),
  baseline_marks DECIMAL(5,2),
  current_marks DECIMAL(5,2),
  baseline_grade VARCHAR(5),
  current_grade VARCHAR(5),
  
  -- Progress calculations
  marks_improvement DECIMAL(5,2) GENERATED ALWAYS AS (current_marks - baseline_marks) STORED,
  percentage_improvement DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN baseline_marks > 0 THEN ((current_marks - baseline_marks) / baseline_marks) * 100
      ELSE 0 
    END
  ) STORED,
  
  -- Target tracking
  target_marks DECIMAL(5,2),
  target_grade VARCHAR(5),
  progress_to_target DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN target_marks > baseline_marks THEN 
        ((current_marks - baseline_marks) / (target_marks - baseline_marks)) * 100
      ELSE 100 
    END
  ) STORED,
  
  -- Status
  is_on_track BOOLEAN GENERATED ALWAYS AS (current_marks >= target_marks) STORED,
  risk_level VARCHAR(20) GENERATED ALWAYS AS (
    CASE 
      WHEN current_marks >= target_marks THEN 'LOW'
      WHEN current_marks >= (baseline_marks + (target_marks - baseline_marks) * 0.5) THEN 'MEDIUM'
      ELSE 'HIGH'
    END
  ) STORED,
  
  -- Tracking metadata
  tracked_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. **intervention_programs** - Program Intervensi

```sql
CREATE TABLE intervention_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name VARCHAR(255) NOT NULL,
  program_type VARCHAR(50) NOT NULL,           -- 'TUITION', 'REMEDIAL', 'ENRICHMENT', 'MENTORING'
  target_subjects TEXT[],                      -- Array of subjects
  target_grades TEXT[],                        -- Array of target grades
  description TEXT,
  
  -- Program details
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  session_frequency VARCHAR(50),              -- 'WEEKLY', 'BI_WEEKLY', 'DAILY'
  session_duration INTEGER,                   -- Duration in minutes
  max_participants INTEGER,
  
  -- Assignment
  assigned_schools UUID[],                    -- Array of school IDs
  assigned_teachers UUID[],                   -- Array of teacher IDs
  assigned_sisc UUID[],                       -- Array of SISC+ IDs
  
  -- Status
  status VARCHAR(20) DEFAULT 'PLANNED',       -- PLANNED, ACTIVE, COMPLETED, CANCELLED
  budget_allocated DECIMAL(10,2),
  budget_used DECIMAL(10,2),
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 7. **student_interventions** - Intervensi Murid

```sql
CREATE TABLE student_interventions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  targeted_student_id UUID REFERENCES targeted_students(id) ON DELETE CASCADE,
  program_id UUID REFERENCES intervention_programs(id) ON DELETE CASCADE,
  
  -- Participation details
  enrollment_date DATE DEFAULT CURRENT_DATE,
  completion_date DATE,
  attendance_rate DECIMAL(5,2),
  participation_status VARCHAR(20) DEFAULT 'ENROLLED', -- ENROLLED, ACTIVE, COMPLETED, DROPPED
  
  -- Progress tracking
  pre_intervention_marks DECIMAL(5,2),
  post_intervention_marks DECIMAL(5,2),
  improvement DECIMAL(5,2) GENERATED ALWAYS AS (post_intervention_marks - pre_intervention_marks) STORED,
  
  -- Feedback
  teacher_feedback TEXT,
  student_feedback TEXT,
  parent_feedback TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📊 Sample Data Structure

### **Targeted Students Example:**
```sql
INSERT INTO targeted_students (
  student_id, school_id, subject, target_grade, current_grade,
  baseline_marks, target_marks, target_year, target_exam,
  intervention_type, priority_level
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',  -- Ahmad Bin Abdullah
  '550e8400-e29b-41d4-a716-446655440002',  -- SMK Taman Johor Jaya
  'Bahasa Melayu',
  'B+',
  'C+',
  65.5,
  75.0,
  2026,
  'SPM',
  'TUITION',
  'HIGH'
);
```

### **Exam Sessions Example:**
```sql
INSERT INTO exam_sessions (
  session_name, session_code, exam_type, academic_year, form_level,
  start_date, end_date, status
) VALUES (
  'Peperiksaan Pertengahan Tahun 2026',
  'PTT_2026',
  'PERTENGAHAN_TAHUN',
  2026,
  'Form 4',
  '2026-06-15',
  '2026-06-30',
  'UPCOMING'
);
```

### **Student Results Example:**
```sql
INSERT INTO student_exam_results (
  student_id, session_id, subject_id, school_id,
  paper_1_marks, paper_2_marks, total_marks, grade,
  is_targeted_student
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440002',
  45.5,
  32.0,
  77.5,
  'B+',
  true
);
```

## 🔍 Key Queries for Analysis

### **1. Get Targeted Students Progress:**
```sql
SELECT 
  s.name as student_name,
  ts.subject,
  ts.baseline_marks,
  ts.target_marks,
  pt.current_marks,
  pt.marks_improvement,
  pt.percentage_improvement,
  pt.progress_to_target,
  pt.risk_level,
  sch.name as school_name
FROM targeted_students ts
JOIN students s ON ts.student_id = s.id
JOIN schools sch ON ts.school_id = sch.id
LEFT JOIN student_progress_tracking pt ON ts.id = pt.targeted_student_id
WHERE ts.status = 'ACTIVE'
ORDER BY pt.risk_level DESC, pt.progress_to_target ASC;
```

### **2. Exam Results Analysis by School:**
```sql
SELECT 
  sch.name as school_name,
  es.session_name,
  subj.subject_name,
  COUNT(ser.id) as total_students,
  AVG(ser.total_marks) as average_marks,
  AVG(ser.percentage) as average_percentage,
  COUNT(CASE WHEN ser.grade IN ('A+', 'A', 'A-') THEN 1 END) as grade_a_count,
  COUNT(CASE WHEN ser.grade IN ('B+', 'B') THEN 1 END) as grade_b_count,
  COUNT(CASE WHEN ser.is_targeted_student = true THEN 1 END) as targeted_students_count
FROM student_exam_results ser
JOIN schools sch ON ser.school_id = sch.id
JOIN exam_sessions es ON ser.session_id = es.id
JOIN exam_subjects subj ON ser.subject_id = subj.id
GROUP BY sch.id, sch.name, es.id, es.session_name, subj.id, subj.subject_name
ORDER BY sch.name, subj.subject_name;
```

### **3. Progress Tracking for Targeted Students:**
```sql
SELECT 
  s.name as student_name,
  s.ic_number,
  ts.subject,
  ts.target_grade,
  pt.baseline_marks,
  pt.current_marks,
  pt.target_marks,
  pt.marks_improvement,
  pt.percentage_improvement,
  pt.progress_to_target,
  pt.is_on_track,
  pt.risk_level,
  CASE 
    WHEN pt.risk_level = 'HIGH' THEN 'Perlu perhatian segera'
    WHEN pt.risk_level = 'MEDIUM' THEN 'Perlu pemantauan'
    ELSE 'Prestasi baik'
  END as recommendation
FROM student_progress_tracking pt
JOIN targeted_students ts ON pt.targeted_student_id = ts.id
JOIN students s ON pt.student_id = s.id
WHERE ts.status = 'ACTIVE'
ORDER BY pt.risk_level DESC, pt.progress_to_target ASC;
```

### **4. Intervention Effectiveness Analysis:**
```sql
SELECT 
  ip.program_name,
  ip.program_type,
  COUNT(si.id) as total_participants,
  AVG(si.attendance_rate) as average_attendance,
  AVG(si.improvement) as average_improvement,
  COUNT(CASE WHEN si.improvement > 0 THEN 1 END) as improved_students,
  COUNT(CASE WHEN si.participation_status = 'COMPLETED' THEN 1 END) as completed_students
FROM intervention_programs ip
LEFT JOIN student_interventions si ON ip.id = si.program_id
WHERE ip.status IN ('ACTIVE', 'COMPLETED')
GROUP BY ip.id, ip.program_name, ip.program_type
ORDER BY average_improvement DESC;
```

## 📈 Performance Indexes

```sql
-- Targeted students indexes
CREATE INDEX idx_targeted_students_student_id ON targeted_students(student_id);
CREATE INDEX idx_targeted_students_school_id ON targeted_students(school_id);
CREATE INDEX idx_targeted_students_subject ON targeted_students(subject);
CREATE INDEX idx_targeted_students_status ON targeted_students(status);
CREATE INDEX idx_targeted_students_priority ON targeted_students(priority_level);

-- Exam results indexes
CREATE INDEX idx_exam_results_student_id ON student_exam_results(student_id);
CREATE INDEX idx_exam_results_session_id ON student_exam_results(session_id);
CREATE INDEX idx_exam_results_subject_id ON student_exam_results(subject_id);
CREATE INDEX idx_exam_results_school_id ON student_exam_results(school_id);
CREATE INDEX idx_exam_results_grade ON student_exam_results(grade);
CREATE INDEX idx_exam_results_targeted ON student_exam_results(is_targeted_student);

-- Progress tracking indexes
CREATE INDEX idx_progress_tracking_student_id ON student_progress_tracking(student_id);
CREATE INDEX idx_progress_tracking_targeted_id ON student_progress_tracking(targeted_student_id);
CREATE INDEX idx_progress_tracking_subject ON student_progress_tracking(subject);
CREATE INDEX idx_progress_tracking_risk ON student_progress_tracking(risk_level);

-- Composite indexes for common queries
CREATE INDEX idx_exam_results_composite ON student_exam_results(school_id, session_id, subject_id);
CREATE INDEX idx_targeted_students_composite ON targeted_students(school_id, subject, status);
```

## 🎯 Business Rules & Validations

### **Grade Boundaries (Standard SPM):**
```sql
-- Grade boundaries for different subjects
UPDATE exam_subjects SET grade_boundaries = '{
  "A+": {"min": 90, "max": 100},
  "A": {"min": 80, "max": 89},
  "A-": {"min": 75, "max": 79},
  "B+": {"min": 70, "max": 74},
  "B": {"min": 65, "max": 69},
  "C+": {"min": 60, "max": 64},
  "C": {"min": 50, "max": 59},
  "D": {"min": 40, "max": 49},
  "E": {"min": 30, "max": 39},
  "G": {"min": 0, "max": 29}
}'::jsonb WHERE subject_code IN ('BM', 'BI', 'MAT', 'SEJ');
```

### **Validation Rules:**
1. **Targeted Students:** Cannot have duplicate entries for same student-subject-year
2. **Exam Results:** Total marks cannot exceed subject maximum marks
3. **Progress Tracking:** Current marks must be from a later session than baseline
4. **Interventions:** Student must be a targeted student to enroll in intervention

## 🔐 Role-Based Access Control

### **Data Access by Role:**

| Role | Targeted Students | Exam Results | Progress Tracking | Interventions |
|------|------------------|--------------|-------------------|---------------|
| **Super Admin** | All data | All results | All progress | All programs |
| **PPD User** | PPD schools only | PPD results | PPD progress | PPD programs |
| **SISC+** | Subject + PPD | Subject results | Subject progress | Subject programs |
| **School Admin** | School students | School results | School progress | School programs |
| **Teacher** | Assigned students | Class results | Assigned progress | Assigned programs |

## 📊 Reporting & Analytics

### **Key Performance Indicators (KPIs):**

1. **Targeted Student Success Rate:** % of targeted students achieving target grade
2. **Average Improvement:** Average marks improvement for targeted students
3. **Intervention Effectiveness:** % improvement after intervention programs
4. **Risk Distribution:** Distribution of students by risk level
5. **Subject Performance:** Average performance by subject across schools

### **Dashboard Metrics:**
- Total targeted students by school/PPD
- Progress distribution (On Track, At Risk, Critical)
- Exam results trends over time
- Intervention program participation rates
- Teacher workload distribution

## 🚀 Future Enhancements

### **Potential Additional Features:**
```sql
-- Predictive analytics
ALTER TABLE student_progress_tracking ADD COLUMN predicted_final_grade VARCHAR(5);
ALTER TABLE student_progress_tracking ADD COLUMN confidence_score DECIMAL(5,2);

-- Parent engagement tracking
CREATE TABLE parent_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id),
  engagement_type VARCHAR(50), -- 'MEETING', 'CALL', 'EMAIL', 'SMS'
  engagement_date DATE,
  notes TEXT,
  follow_up_required BOOLEAN DEFAULT false
);

-- Attendance correlation
ALTER TABLE student_exam_results ADD COLUMN attendance_rate DECIMAL(5,2);
ALTER TABLE student_exam_results ADD COLUMN attendance_correlation DECIMAL(5,2);
```

Database structure ini membolehkan tracking yang komprehensif untuk murid yang disasarkan dan perkembangan mereka dalam peperiksaan pertengahan tahun dan percubaan SPM. 🎓