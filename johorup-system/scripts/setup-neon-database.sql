-- JohorUP System Database Schema for Neon
-- Run this in Neon SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PPDs (Pejabat Pendidikan Daerah)
CREATE TABLE ppds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Schools
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    ppd_id INTEGER REFERENCES ppds(id),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    principal_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subjects
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('sektor_perancangan', 'sektor_pembelajaran', 'ppd', 'school', 'yayasan_jcorp', 'pending_approval')),
    school_id INTEGER REFERENCES schools(id),
    ppd_id INTEGER REFERENCES ppds(id),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Students
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    ic_number VARCHAR(12) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    school_id INTEGER REFERENCES schools(id),
    form_level INTEGER CHECK (form_level IN (4, 5)),
    class_name VARCHAR(50),
    kodkaum VARCHAR(1) CHECK (kodkaum IN ('M', 'C', 'I', 'L')), -- M=Melayu, C=Cina, I=India, L=Lain-lain
    jantina VARCHAR(1) CHECK (jantina IN ('L', 'P')), -- L=Lelaki, P=Perempuan
    phone VARCHAR(20),
    parent_phone VARCHAR(20),
    address TEXT,
    is_target_student BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Teachers
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    school_id INTEGER REFERENCES schools(id),
    subject_id INTEGER REFERENCES subjects(id),
    position VARCHAR(100),
    experience_years INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Teacher KPIs
CREATE TABLE teacher_kpis (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id),
    assessment_date DATE NOT NULL,
    pdp_score INTEGER CHECK (pdp_score >= 0 AND pdp_score <= 100),
    notes TEXT,
    assessed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Programs
CREATE TABLE programs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    program_type VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    target_students INTEGER,
    budget DECIMAL(12,2),
    status VARCHAR(50) DEFAULT 'active',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Student Grades
CREATE TABLE student_grades (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    subject_id INTEGER REFERENCES subjects(id),
    exam_type VARCHAR(100),
    exam_date DATE,
    grade VARCHAR(5),
    marks INTEGER,
    total_marks INTEGER,
    percentage DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tuition Reports
CREATE TABLE tuition_reports (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES programs(id),
    school_id INTEGER REFERENCES schools(id),
    teacher_id INTEGER REFERENCES teachers(id),
    subject_id INTEGER REFERENCES subjects(id),
    report_date DATE NOT NULL,
    session_title VARCHAR(255),
    time_start TIME,
    time_end TIME,
    topics_covered TEXT,
    teaching_methods TEXT,
    student_response TEXT,
    challenges TEXT,
    recommendations TEXT,
    notes TEXT,
    report_file_url VARCHAR(500),
    submitted_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Student Attendance
CREATE TABLE student_attendance (
    id SERIAL PRIMARY KEY,
    tuition_report_id INTEGER REFERENCES tuition_reports(id),
    student_id INTEGER REFERENCES students(id),
    is_present BOOLEAN DEFAULT true,
    absence_reason VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tuition Photos
CREATE TABLE tuition_photos (
    id SERIAL PRIMARY KEY,
    tuition_report_id INTEGER REFERENCES tuition_reports(id),
    photo_url VARCHAR(500) NOT NULL,
    caption TEXT,
    photo_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Budget Allocations
CREATE TABLE budget_allocations (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES programs(id),
    amount DECIMAL(12,2) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    status VARCHAR(50) DEFAULT 'planned',
    allocated_date DATE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- System Settings
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_students_school ON students(school_id);
CREATE INDEX idx_students_ic ON students(ic_number);
CREATE INDEX idx_teachers_school ON teachers(school_id);
CREATE INDEX idx_tuition_reports_school ON tuition_reports(school_id);
CREATE INDEX idx_tuition_reports_date ON tuition_reports(report_date);
CREATE INDEX idx_student_attendance_report ON student_attendance(tuition_report_id);
CREATE INDEX idx_student_grades_student ON student_grades(student_id);

-- Insert initial data
INSERT INTO ppds (name, code) VALUES 
('PPD Johor Bahru', 'JB'),
('PPD Muar', 'MR'),
('PPD Batu Pahat', 'BP');

INSERT INTO subjects (name, code) VALUES 
('Bahasa Melayu', 'BM'),
('Sejarah', 'SEJ'),
('Matematik', 'MAT');

-- Insert system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES 
('maintenance_mode', 'false', 'System maintenance mode'),
('maintenance_message', 'Sistem sedang dalam penyelenggaraan', 'Maintenance message'),
('app_version', '1.0.0', 'Application version'),
('max_file_size', '10485760', 'Maximum file upload size in bytes (10MB)'),
('allowed_file_types', 'jpg,jpeg,png,pdf,doc,docx', 'Allowed file upload types');

COMMIT;