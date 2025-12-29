-- Import Demo Data for JohorUP System
-- Run this after setup-neon-database.sql

-- Insert Schools (20 schools across 3 PPDs)
INSERT INTO schools (name, code, ppd_id, address, phone, email, principal_name) VALUES 
-- PPD Johor Bahru (8 schools)
('SMK Taman Johor Jaya', 'SMKTJJ', 1, 'Taman Johor Jaya, 81100 Johor Bahru', '07-3551234', 'smktjj@moe-dl.edu.my', 'Puan Siti Aminah'),
('SMK Bandar Baru UDA', 'SMKBBUDA', 1, 'Bandar Baru UDA, 81200 Johor Bahru', '07-5561234', 'smkbbuda@moe-dl.edu.my', 'Encik Ahmad Rahman'),
('SMK Taman Universiti', 'SMKTU', 1, 'Taman Universiti, 81300 Skudai', '07-5201234', 'smktu@moe-dl.edu.my', 'Puan Noraini Hassan'),
('SMK Skudai', 'SMKSKUDAI', 1, 'Skudai, 81300 Johor Bahru', '07-5511234', 'smkskudai@moe-dl.edu.my', 'Encik Mohd Ali'),
('SMK Kulai', 'SMKKULAI', 1, 'Kulai, 81000 Kulai', '07-6631234', 'smkkulai@moe-dl.edu.my', 'Puan Fatimah Zahra'),
('SMK Senai', 'SMKSENAI', 1, 'Senai, 81400 Senai', '07-5991234', 'smksenai@moe-dl.edu.my', 'Encik Ibrahim Ismail'),
('SMK Gelang Patah', 'SMKGP', 1, 'Gelang Patah, 81550 Gelang Patah', '07-2871234', 'smkgp@moe-dl.edu.my', 'Puan Rozita Ahmad'),
('SMK Nusajaya', 'SMKNUSAJAYA', 1, 'Nusajaya, 79150 Nusajaya', '07-2331234', 'smknusajaya@moe-dl.edu.my', 'Encik Hassan Abdullah'),

-- PPD Muar (6 schools)
('SMK Muar', 'SMKMUAR', 2, 'Muar, 84000 Muar', '06-9521234', 'smkmuar@moe-dl.edu.my', 'Puan Zainab Mohd'),
('SMK Tangkak', 'SMKTANGKAK', 2, 'Tangkak, 84900 Tangkak', '06-9781234', 'smktangkak@moe-dl.edu.my', 'Encik Roslan Yusof'),
('SMK Segamat', 'SMKSEGAMAT', 2, 'Segamat, 85000 Segamat', '07-9311234', 'smksegamat@moe-dl.edu.my', 'Puan Mariam Salleh'),
('SMK Pagoh', 'SMKPAGOH', 2, 'Pagoh, 84600 Pagoh', '06-9741234', 'smkpagoh@moe-dl.edu.my', 'Encik Azman Hashim'),
('SMK Bukit Gambir', 'SMKBG', 2, 'Bukit Gambir, 84800 Bukit Gambir', '06-9661234', 'smkbg@moe-dl.edu.my', 'Puan Khadijah Omar'),
('SMK Ledang', 'SMKLEDANG', 2, 'Ledang, 84900 Ledang', '06-9881234', 'smkledang@moe-dl.edu.my', 'Encik Sulaiman Mat'),

-- PPD Batu Pahat (6 schools)
('SMK Batu Pahat', 'SMKBP', 3, 'Batu Pahat, 83000 Batu Pahat', '07-4341234', 'smkbp@moe-dl.edu.my', 'Puan Rohani Daud'),
('SMK Yong Peng', 'SMKYP', 3, 'Yong Peng, 83700 Yong Peng', '07-4671234', 'smkyp@moe-dl.edu.my', 'Encik Kamal Ariffin'),
('SMK Ayer Hitam', 'SMKAH', 3, 'Ayer Hitam, 86100 Ayer Hitam', '07-7571234', 'smkah@moe-dl.edu.my', 'Puan Norsiah Jamil'),
('SMK Senggarang', 'SMKSENGGARANG', 3, 'Senggarang, 83200 Senggarang', '07-4551234', 'smksenggarang@moe-dl.edu.my', 'Encik Razak Mahmud'),
('SMK Rengit', 'SMKRENGIT', 3, 'Rengit, 83300 Rengit', '07-4881234', 'smkrengit@moe-dl.edu.my', 'Puan Salina Kassim'),
('SMK Parit Raja', 'SMKPR', 3, 'Parit Raja, 86400 Parit Raja', '07-4531234', 'smkpr@moe-dl.edu.my', 'Encik Hafiz Rahman');

-- Insert Demo Users
INSERT INTO users (email, name, role, school_id, ppd_id, password_hash) VALUES 
-- Admin & Koordinator
('admin@jpnj.gov.my', 'Admin JPNJ', 'sektor_perancangan', NULL, NULL, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAVyRl.'),
('koordinator@jpnj.gov.my', 'Koordinator Program', 'sektor_perancangan', NULL, NULL, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAVyRl.'),

-- PPD Users
('ppd.jb@moe.gov.my', 'PPD Johor Bahru', 'ppd', NULL, 1, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAVyRl.'),
('ppd.muar@moe.gov.my', 'PPD Muar', 'ppd', NULL, 2, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAVyRl.'),
('ppd.bp@moe.gov.my', 'PPD Batu Pahat', 'ppd', NULL, 3, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAVyRl.'),

-- School Users (sample for first few schools)
('sekolah@moe-dl.edu.my', 'SMK Taman Johor Jaya', 'school', 1, NULL, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAVyRl.'),
('smkbbuda@moe-dl.edu.my', 'SMK Bandar Baru UDA', 'school', 2, NULL, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAVyRl.'),
('smktu@moe-dl.edu.my', 'SMK Taman Universiti', 'school', 3, NULL, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAVyRl.'),

-- Yayasan JCorp
('yayasan@jcorp.com.my', 'Yayasan JCorp', 'yayasan_jcorp', NULL, NULL, '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAVyRl.');

-- Insert Teachers (6 per school = 120 total)
-- Sample for first school
INSERT INTO teachers (name, email, phone, school_id, subject_id, position, experience_years) VALUES 
-- SMK Taman Johor Jaya (School ID 1)
('Cikgu Aminah Binti Ahmad', 'aminah.ahmad@moe-dl.edu.my', '019-2345678', 1, 1, 'Guru Bahasa Melayu', 8),
('Cikgu Hassan Bin Omar', 'hassan.omar@moe-dl.edu.my', '019-3456789', 1, 2, 'Guru Sejarah', 12),
('Cikgu Siti Fatimah', 'siti.fatimah@moe-dl.edu.my', '019-4567890', 1, 3, 'Guru Matematik', 6),
('Cikgu Rahman Bin Ali', 'rahman.ali@moe-dl.edu.my', '019-5678901', 1, 1, 'Guru Bahasa Melayu', 10),
('Cikgu Noraini Kassim', 'noraini.kassim@moe-dl.edu.my', '019-6789012', 1, 2, 'Guru Sejarah', 7),
('Cikgu Ahmad Zaki', 'ahmad.zaki@moe-dl.edu.my', '019-7890123', 1, 3, 'Guru Matematik', 9);

-- Insert Students (44 per school = 880 total)
-- Sample for first school
INSERT INTO students (ic_number, name, school_id, form_level, class_name, kodkaum, jantina, phone, parent_phone, address, is_target_student) VALUES 
-- SMK Taman Johor Jaya Form 4 students
('051234567890', 'Ahmad Bin Abdullah', 1, 4, '4 Bestari', 'M', 'L', '012-3456789', '019-8765432', 'Taman Johor Jaya', true),
('051234567891', 'Siti Nurhaliza', 1, 4, '4 Bestari', 'M', 'P', '012-3456790', '019-8765433', 'Taman Johor Jaya', true),
('051234567892', 'Muhammad Hakim', 1, 4, '4 Bestari', 'M', 'L', '012-3456791', '019-8765434', 'Taman Johor Jaya', true),
('051234567893', 'Nurul Ain Fatihah', 1, 4, '4 Cemerlang', 'M', 'P', '012-3456792', '019-8765435', 'Taman Johor Jaya', true),
('051234567894', 'Mohd Fikri Hakim', 1, 4, '4 Cemerlang', 'M', 'L', '012-3456793', '019-8765436', 'Taman Johor Jaya', true),
('051234567895', 'Raj Kumar A/L Suresh', 1, 4, '4 Cemerlang', 'I', 'L', '012-3456794', '019-8765437', 'Taman Johor Jaya', true),
('051234567896', 'Priya A/P Raman', 1, 4, '4 Bestari', 'I', 'P', '012-3456795', '019-8765438', 'Taman Johor Jaya', true),
('051234567897', 'Lim Wei Ming', 1, 4, '4 Bestari', 'C', 'L', '012-3456796', '019-8765439', 'Taman Johor Jaya', true),
-- Add more students as needed...
('051234567898', 'Aishah Binti Yusof', 1, 5, '5 Bestari', 'M', 'P', '012-3456797', '019-8765440', 'Taman Johor Jaya', true),
('051234567899', 'Hafiz Bin Rahman', 1, 5, '5 Bestari', 'M', 'L', '012-3456798', '019-8765441', 'Taman Johor Jaya', true),
('051234567800', 'Zarina Binti Hassan', 1, 5, '5 Cemerlang', 'M', 'P', '012-3456799', '019-8765442', 'Taman Johor Jaya', true),
('051234567801', 'Tan Mei Ling', 1, 5, '5 Cemerlang', 'C', 'P', '012-3456800', '019-8765443', 'Taman Johor Jaya', true);

-- Insert Programs
INSERT INTO programs (title, description, program_type, start_date, end_date, target_students, budget, status, created_by) VALUES 
('Program Tuisyen SPM 2026 - Fasa 1', 'Program tuisyen intensif untuk mata pelajaran teras SPM', 'Tuisyen Akademik', '2026-01-15', '2026-04-30', 880, 150000.00, 'active', 1),
('Program Latihan Guru - Fasa 1', 'Latihan pedagogi dan kaedah pengajaran berkesan', 'Pembangunan Profesional', '2026-01-01', '2026-03-31', 120, 100000.00, 'active', 1),
('Program Pemantauan dan Penilaian', 'Sistem pemantauan kemajuan pelajar secara berterusan', 'Pemantauan', '2026-02-01', '2027-04-30', 880, 80000.00, 'active', 1);

-- Insert Sample Grades
INSERT INTO student_grades (student_id, subject_id, exam_type, exam_date, grade, marks, total_marks, percentage) VALUES 
(1, 1, 'Ujian Akhir Tingkatan 4', '2025-11-15', 'C+', 65, 100, 65.0),
(1, 2, 'Ujian Akhir Tingkatan 4', '2025-11-18', 'B-', 70, 100, 70.0),
(1, 3, 'Ujian Akhir Tingkatan 4', '2025-11-20', 'C', 60, 100, 60.0),
(2, 1, 'Ujian Akhir Tingkatan 4', '2025-11-15', 'B', 75, 100, 75.0),
(2, 2, 'Ujian Akhir Tingkatan 4', '2025-11-18', 'B+', 78, 100, 78.0),
(2, 3, 'Ujian Akhir Tingkatan 4', '2025-11-20', 'C+', 68, 100, 68.0);

-- Insert Teacher KPIs
INSERT INTO teacher_kpis (teacher_id, assessment_date, pdp_score, notes, assessed_by) VALUES 
(1, '2026-01-15', 85, 'Pencerapan PdP sangat baik, kaedah pengajaran berkesan', 1),
(2, '2026-01-15', 78, 'Pencerapan PdP baik, perlu penambahbaikan dalam penggunaan teknologi', 1),
(3, '2026-01-15', 92, 'Pencerapan PdP cemerlang, inovatif dalam kaedah pengajaran', 1),
(4, '2026-01-15', 73, 'Pencerapan PdP sederhana, perlu latihan lanjutan', 1),
(5, '2026-01-15', 88, 'Pencerapan PdP sangat baik, interaksi pelajar aktif', 1),
(6, '2026-01-15', 81, 'Pencerapan PdP baik, pengurusan kelas berkesan', 1);

-- Insert Budget Allocations
INSERT INTO budget_allocations (program_id, amount, category, description, status, allocated_date, created_by) VALUES 
(1, 150000.00, 'Program Tuisyen', 'Kos pelaksanaan program tuisyen untuk 880 pelajar', 'approved', '2026-01-01', 1),
(2, 100000.00, 'Latihan Guru', 'Kos latihan dan pembangunan profesional 120 guru', 'approved', '2026-01-01', 1),
(3, 80000.00, 'Pemantauan', 'Kos sistem pemantauan dan penilaian', 'approved', '2026-01-01', 1),
(1, 120000.00, 'Infrastruktur', 'Kos peralatan dan bahan pembelajaran', 'planned', '2026-02-01', 1);

COMMIT;