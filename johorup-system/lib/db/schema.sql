-- JohorUP Database Schema

-- Users table (untuk authentication dan roles)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('school', 'ppd', 'sektor_pembelajaran', 'sektor_perancangan')),
    school_id INTEGER,
    ppd_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PPD (Pejabat Pendidikan Daerah)
CREATE TABLE ppd (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schools table
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    ppd_id INTEGER REFERENCES ppd(id),
    target_students INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ic_number VARCHAR(20) UNIQUE NOT NULL,
    school_id INTEGER REFERENCES schools(id),
    class VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL
);

-- Grades (untuk track gred across different exams)
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    subject_id INTEGER REFERENCES subjects(id),
    exam_type VARCHAR(50) NOT NULL CHECK (exam_type IN ('akhir_tingkatan_4', 'pertengahan_tahun', 'percubaan', 'spm')),
    grade VARCHAR(5),
    year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_id, exam_type, year)
);

-- Programs
CREATE TABLE programs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    program_type VARCHAR(100),
    target_subject_id INTEGER REFERENCES subjects(id),
    start_date DATE,
    end_date DATE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budget allocation
CREATE TABLE budget (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES programs(id),
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'planned' CHECK (status IN ('planned', 'approved', 'spent')),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Program participants
CREATE TABLE program_participants (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES programs(id),
    student_id INTEGER REFERENCES students(id),
    attendance_status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(program_id, student_id)
);

-- Insert default subjects
INSERT INTO subjects (name, code) VALUES 
    ('Bahasa Melayu', 'BM'),
    ('Sejarah', 'SEJ'),
    ('Matematik', 'MAT');

-- Insert sample PPD
INSERT INTO ppd (name, code) VALUES 
    ('PPD Johor Bahru', 'JB'),
    ('PPD Muar', 'MR'),
    ('PPD Batu Pahat', 'BP'),
    ('PPD Kluang', 'KL'),
    ('PPD Pontian', 'PT'),
    ('PPD Kulai', 'KU'),
    ('PPD Kota Tinggi', 'KT'),
    ('PPD Mersing', 'MS'),
    ('PPD Segamat', 'SG'),
    ('PPD Tangkak', 'TK'),
    ('PPD Pasir Gudang', 'PG');
