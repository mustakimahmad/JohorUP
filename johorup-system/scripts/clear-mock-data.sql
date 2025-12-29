-- Script untuk kosongkan semua data mock/demo
-- AMARAN: Script ini akan padam SEMUA data dalam database!
-- Pastikan anda backup data penting sebelum run script ini

-- Disable foreign key checks temporarily
SET session_replication_role = replica;

-- Clear all data tables (keep structure)
TRUNCATE TABLE tuition_photos CASCADE;
TRUNCATE TABLE student_attendance CASCADE;
TRUNCATE TABLE tuition_reports CASCADE;
TRUNCATE TABLE budget_allocations CASCADE;
TRUNCATE TABLE student_grades CASCADE;
TRUNCATE TABLE teacher_kpis CASCADE;
TRUNCATE TABLE teachers CASCADE;
TRUNCATE TABLE students CASCADE;
TRUNCATE TABLE programs CASCADE;
TRUNCATE TABLE users CASCADE;
TRUNCATE TABLE schools CASCADE;
TRUNCATE TABLE subjects CASCADE;
TRUNCATE TABLE ppds CASCADE;

-- Reset sequences to start from 1
ALTER SEQUENCE ppds_id_seq RESTART WITH 1;
ALTER SEQUENCE schools_id_seq RESTART WITH 1;
ALTER SEQUENCE subjects_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE students_id_seq RESTART WITH 1;
ALTER SEQUENCE teachers_id_seq RESTART WITH 1;
ALTER SEQUENCE teacher_kpis_id_seq RESTART WITH 1;
ALTER SEQUENCE programs_id_seq RESTART WITH 1;
ALTER SEQUENCE student_grades_id_seq RESTART WITH 1;
ALTER SEQUENCE tuition_reports_id_seq RESTART WITH 1;
ALTER SEQUENCE student_attendance_id_seq RESTART WITH 1;
ALTER SEQUENCE tuition_photos_id_seq RESTART WITH 1;
ALTER SEQUENCE budget_allocations_id_seq RESTART WITH 1;

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Keep system settings (don't clear these)
-- Keep maintenance mode and other system configurations

-- Insert basic required data
INSERT INTO subjects (name, code) VALUES 
('Bahasa Melayu', 'BM'),
('Sejarah', 'SEJ'),
('Matematik', 'MAT');

-- Insert PPDs (real data - update as needed)
INSERT INTO ppds (name, code) VALUES 
('PPD Johor Bahru', 'JB'),
('PPD Muar', 'MR'),
('PPD Batu Pahat', 'BP');

-- Insert admin user (keep this for system access)
INSERT INTO users (email, name, role, school_id, ppd_id, password_hash) VALUES 
('admin@jpnj.gov.my', 'Admin JPNJ', 'sektor_perancangan', NULL, NULL, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAVyRl.'),
('koordinator@jpnj.gov.my', 'Koordinator Program', 'sektor_perancangan', NULL, NULL, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAVyRl.');

COMMIT;

-- Verify data cleared
SELECT 'PPDs' as table_name, COUNT(*) as record_count FROM ppds
UNION ALL
SELECT 'Schools', COUNT(*) FROM schools
UNION ALL
SELECT 'Users', COUNT(*) FROM users
UNION ALL
SELECT 'Students', COUNT(*) FROM students
UNION ALL
SELECT 'Teachers', COUNT(*) FROM teachers
UNION ALL
SELECT 'Programs', COUNT(*) FROM programs;