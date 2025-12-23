# 🌐 Panduan Deployment Netlify + Neon untuk Sistem JohorUP

## 📋 Mengapa Netlify + Neon?

**Neon** adalah database PostgreSQL serverless yang sangat sesuai untuk sistem JohorUP:
- ✅ **Lebih murah** - RM0-50/bulan sahaja (vs Supabase RM100/bulan)
- ✅ **Auto-scaling** - Database scale otomatik mengikut usage
- ✅ **Branching** - Boleh buat database branches untuk testing
- ✅ **Serverless** - Bayar mengikut penggunaan sahaja
- ✅ **PostgreSQL** - Compatible dengan semua SQL queries
- ✅ **Fast setup** - 5 minit sahaja untuk setup

## 💰 Perbandingan Kos

### **Netlify + Neon (Recommended)**
- Netlify Pro: RM50/bulan
- Neon Pro: RM25/bulan
- **Total: RM75/bulan** 🎯 (50% lebih murah!)

### **Netlify + Supabase**
- Netlify Pro: RM50/bulan  
- Supabase Pro: RM100/bulan
- **Total: RM150/bulan**

### **Free Tier (Untuk testing)**
- Netlify: RM0/bulan
- Neon: RM0/bulan
- **Total: RM0/bulan** 🆓

## 🚀 Setup Lengkap: Netlify + Neon

### **Langkah 1: Setup Neon Database**

#### A. Daftar Neon
1. Pergi ke https://neon.tech
2. Sign up dengan GitHub account
3. Create new project: "johorup-production"
4. Pilih region: "AWS Asia Pacific (Singapore)"
5. Pilih PostgreSQL version: 15 (latest)

#### B. Get Database Connection
1. Go to Dashboard > Connection Details
2. Copy connection string:
   ```
   postgresql://username:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
3. Note down individual components:
   - Host: `ep-xxx.ap-southeast-1.aws.neon.tech`
   - Database: `neondb`
   - Username: `username`
   - Password: `password`

#### C. Create Database Schema
1. Go to SQL Editor in Neon dashboard
2. Run the following SQL:

```sql
-- 1. Create tables
CREATE TABLE ppds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    ppd_id INTEGER REFERENCES ppds(id),
    target_students INTEGER DEFAULT 44,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('school', 'ppd', 'sektor_pembelajaran', 'sektor_perancangan', 'yayasan_jcorp')),
    password_hash VARCHAR(255) NOT NULL,
    school_id INTEGER REFERENCES schools(id),
    ppd_id INTEGER REFERENCES ppds(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ic_number VARCHAR(20) NOT NULL UNIQUE,
    school_id INTEGER REFERENCES schools(id),
    subject_id INTEGER REFERENCES subjects(id),
    email VARCHAR(255),
    phone VARCHAR(20),
    years_experience INTEGER DEFAULT 0,
    qualification VARCHAR(255),
    kpi_score INTEGER DEFAULT 0 CHECK (kpi_score >= 0 AND kpi_score <= 100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ic_number VARCHAR(20) NOT NULL UNIQUE,
    school_id INTEGER REFERENCES schools(id),
    class VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE programs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    program_type VARCHAR(50),
    target_subject_id INTEGER REFERENCES subjects(id),
    start_date DATE,
    end_date DATE,
    created_by INTEGER REFERENCES users(id),
    target_students INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE program_reports (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES programs(id),
    school_id INTEGER REFERENCES schools(id),
    report_date DATE NOT NULL,
    session_title VARCHAR(255),
    subject_id INTEGER REFERENCES subjects(id),
    teacher_id INTEGER REFERENCES teachers(id),
    duration_hours DECIMAL(3,1),
    topics_covered TEXT,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved')),
    submitted_by INTEGER REFERENCES users(id),
    submitted_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE student_attendance (
    id SERIAL PRIMARY KEY,
    program_report_id INTEGER REFERENCES program_reports(id),
    student_id INTEGER REFERENCES students(id),
    present BOOLEAN DEFAULT false,
    absence_reason VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE program_files (
    id SERIAL PRIMARY KEY,
    program_report_id INTEGER REFERENCES program_reports(id),
    file_name VARCHAR(255),
    file_url VARCHAR(500),
    file_type VARCHAR(50),
    file_size INTEGER,
    uploaded_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE program_photos (
    id SERIAL PRIMARY KEY,
    program_report_id INTEGER REFERENCES program_reports(id),
    photo_url VARCHAR(500),
    caption TEXT,
    uploaded_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE maintenance_mode (
    id SERIAL PRIMARY KEY,
    is_active BOOLEAN DEFAULT false,
    message TEXT,
    activated_by INTEGER REFERENCES users(id),
    activated_at TIMESTAMP,
    deactivated_at TIMESTAMP
);

-- 2. Create indexes for better performance
CREATE INDEX idx_schools_ppd_id ON schools(ppd_id);
CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_teachers_school_id ON teachers(school_id);
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_program_reports_school_id ON program_reports(school_id);
CREATE INDEX idx_program_reports_date ON program_reports(report_date);
CREATE INDEX idx_student_attendance_report_id ON student_attendance(program_report_id);

-- 3. Insert initial data
INSERT INTO ppds (name, code) VALUES 
('PPD Johor Bahru', 'JB'),
('PPD Muar', 'MR'),
('PPD Batu Pahat', 'BP');

INSERT INTO subjects (name, code) VALUES 
('Bahasa Melayu', 'BM'),
('Sejarah', 'SEJ'),
('Matematik', 'MAT'),
('Sains', 'SN'),
('Bahasa Inggeris', 'BI');

-- 4. Insert maintenance mode record
INSERT INTO maintenance_mode (is_active, message) VALUES (false, 'Sistem sedang diselenggara. Sila cuba lagi kemudian.');
```

### **Langkah 2: Setup Netlify Hosting**

#### A. Connect GitHub Repository
1. Login ke https://netlify.com
2. Click "New site from Git"
3. Choose GitHub
4. Select repository: "JohorUP"
5. Set build settings:
   - **Base directory**: `johorup-system`
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

#### B. Configure Environment Variables
Go to Site settings > Environment variables dan tambah:

```env
# Database (Neon)
DATABASE_URL=postgresql://username:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
DATABASE_SSL=true

# Authentication
NEXTAUTH_URL=https://[your-site-name].netlify.app
NEXTAUTH_SECRET=[generate-32-char-secret]
JWT_SECRET=[generate-32-char-secret]

# File Upload (Cloudinary - Free tier)
CLOUDINARY_CLOUD_NAME=[your-cloud-name]
CLOUDINARY_API_KEY=[your-api-key]
CLOUDINARY_API_SECRET=[your-api-secret]

# Security
ENCRYPTION_KEY=[generate-32-char-key]
ENABLE_MAINTENANCE_MODE=false

# Performance
NODE_ENV=production
```

### **Langkah 3: Setup File Storage dengan Cloudinary**

Kerana Neon hanya database, kita perlu file storage berasingan. **Cloudinary** adalah pilihan terbaik:

#### A. Setup Cloudinary (Free)
1. Daftar di https://cloudinary.com
2. Free plan: 25GB storage, 25GB bandwidth/bulan
3. Copy credentials dari Dashboard

#### B. Install Cloudinary
```bash
npm install cloudinary multer
```

#### C. Create Upload Function
```typescript
// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFile(file: Buffer, fileName: string, folder: string = 'johorup') {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: folder,
        public_id: fileName,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(file);
  });
}

export async function uploadReportFiles(reportId: number, files: File[], photos: File[]) {
  const uploadPromises = [];

  // Upload report files
  for (let i = 0; i < files.length; i++) {
    const buffer = Buffer.from(await files[i].arrayBuffer());
    const fileName = `report-${reportId}-file-${i}-${files[i].name}`;
    uploadPromises.push(uploadFile(buffer, fileName, 'reports/files'));
  }

  // Upload photos
  for (let i = 0; i < photos.length; i++) {
    const buffer = Buffer.from(await photos[i].arrayBuffer());
    const fileName = `report-${reportId}-photo-${i}-${photos[i].name}`;
    uploadPromises.push(uploadFile(buffer, fileName, 'reports/photos'));
  }

  return await Promise.all(uploadPromises);
}
```

### **Langkah 4: Update Code untuk Neon**

#### A. Install Database Client
```bash
npm install pg @types/pg
```

#### B. Create Database Client
```typescript
// lib/database.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function getClient() {
  return await pool.connect();
}

export default pool;
```

#### C. Update Data Functions
```typescript
// lib/data.ts
import { query } from './database';
import bcrypt from 'bcryptjs';

export async function getSchools() {
  const result = await query(`
    SELECT s.*, p.name as ppd_name, p.code as ppd_code
    FROM schools s
    LEFT JOIN ppds p ON s.ppd_id = p.id
    ORDER BY s.name
  `);
  return result.rows;
}

export async function getTeachers(schoolId?: number) {
  let sql = `
    SELECT t.*, s.name as school_name, sub.name as subject_name
    FROM teachers t
    LEFT JOIN schools s ON t.school_id = s.id
    LEFT JOIN subjects sub ON t.subject_id = sub.id
  `;
  
  const params = [];
  if (schoolId) {
    sql += ' WHERE t.school_id = $1';
    params.push(schoolId);
  }
  
  sql += ' ORDER BY t.name';
  
  const result = await query(sql, params);
  return result.rows;
}

export async function createUser(userData: any) {
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  
  const result = await query(`
    INSERT INTO users (email, name, role, password_hash, school_id, ppd_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, email, name, role, school_id, ppd_id
  `, [
    userData.email,
    userData.name,
    userData.role,
    hashedPassword,
    userData.school_id,
    userData.ppd_id
  ]);
  
  return result.rows[0];
}

export async function createReport(reportData: any) {
  const result = await query(`
    INSERT INTO program_reports (
      program_id, school_id, report_date, session_title, 
      subject_id, teacher_id, duration_hours, topics_covered, 
      notes, submitted_by
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `, [
    reportData.program_id,
    reportData.school_id,
    reportData.report_date,
    reportData.session_title,
    reportData.subject_id,
    reportData.teacher_id,
    reportData.duration_hours,
    reportData.topics_covered,
    reportData.notes,
    reportData.submitted_by
  ]);
  
  return result.rows[0];
}
```

### **Langkah 5: Create Neon Import Script**

```typescript
// scripts/import-neon-data.js
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function importData() {
  console.log('🚀 Starting Neon data import...');
  
  try {
    // Import schools
    console.log('📚 Importing schools...');
    const schools = [];
    for (let i = 1; i <= 20; i++) {
      const ppdId = i <= 8 ? 1 : (i <= 14 ? 2 : 3);
      schools.push([i, `SMK ${i}`, `SMK${i}`, ppdId, 44]);
    }
    
    for (const school of schools) {
      await pool.query(`
        INSERT INTO schools (id, name, code, ppd_id, target_students)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        code = EXCLUDED.code,
        ppd_id = EXCLUDED.ppd_id,
        target_students = EXCLUDED.target_students
      `, school);
    }
    
    // Import users
    console.log('👥 Importing users...');
    const users = [
      [1, 'admin@jpnj.gov.my', 'System Administrator', 'sektor_perancangan', await bcrypt.hash('AdminPass123!', 12), null, null],
      [2, 'koordinator@jpnj.gov.my', 'Koordinator Program', 'sektor_perancangan', await bcrypt.hash('KoordinatorPass123!', 12), null, null],
      [7, 'yayasan@jcorp.com.my', 'Pegawai Yayasan JCorp', 'yayasan_jcorp', await bcrypt.hash('YayasanPass123!', 12), null, null]
    ];
    
    // Add school users
    for (let i = 1; i <= 20; i++) {
      users.push([
        7 + i,
        `sekolah${i}@jpnj.gov.my`,
        `Pentadbir SMK ${i}`,
        'school',
        await bcrypt.hash('SekolahPass123!', 12),
        i,
        null
      ]);
    }
    
    for (const user of users) {
      await pool.query(`
        INSERT INTO users (id, email, name, role, password_hash, school_id, ppd_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        password_hash = EXCLUDED.password_hash,
        school_id = EXCLUDED.school_id,
        ppd_id = EXCLUDED.ppd_id
      `, user);
    }
    
    // Import teachers (120 total - 6 per school)
    console.log('👨‍🏫 Importing teachers...');
    let teacherId = 1;
    for (let schoolId = 1; schoolId <= 20; schoolId++) {
      for (let teacherNum = 1; teacherNum <= 6; teacherNum++) {
        const subjectId = ((teacherNum - 1) % 5) + 1;
        await pool.query(`
          INSERT INTO teachers (id, name, ic_number, school_id, subject_id, email, phone, years_experience, qualification, kpi_score)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          school_id = EXCLUDED.school_id,
          subject_id = EXCLUDED.subject_id,
          kpi_score = EXCLUDED.kpi_score
        `, [
          teacherId++,
          `Guru ${teacherNum} Sekolah ${schoolId}`,
          `${String(schoolId).padStart(2, '0')}${String(teacherNum).padStart(2, '0')}${Math.floor(Math.random() * 900000) + 100000}`,
          schoolId,
          subjectId,
          `guru${teacherNum}.sekolah${schoolId}@jpnj.gov.my`,
          `01${Math.floor(Math.random() * 90000000) + 10000000}`,
          Math.floor(Math.random() * 20) + 5,
          Math.random() > 0.5 ? 'Sarjana Pendidikan' : 'Ijazah Sarjana Muda',
          Math.floor(Math.random() * 41) + 60 // KPI score 60-100
        ]);
      }
    }
    
    // Import students (880 total - 44 per school)
    console.log('👨‍🎓 Importing students...');
    let studentId = 1;
    for (let schoolId = 1; schoolId <= 20; schoolId++) {
      for (let studentNum = 1; studentNum <= 44; studentNum++) {
        const classNum = Math.ceil(studentNum / 11);
        await pool.query(`
          INSERT INTO students (id, name, ic_number, school_id, class)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          school_id = EXCLUDED.school_id,
          class = EXCLUDED.class
        `, [
          studentId++,
          `Murid ${studentNum} Sekolah ${schoolId}`,
          `${String(schoolId).padStart(2, '0')}${String(studentNum).padStart(2, '0')}${Math.floor(Math.random() * 900000) + 100000}`,
          schoolId,
          `4 Bestari ${classNum}`
        ]);
      }
    }
    
    console.log('✅ Data import completed successfully!');
    console.log('📊 Summary:');
    console.log('- 3 PPDs');
    console.log('- 5 subjects');
    console.log('- 20 schools');
    console.log('- 23 users (3 admin + 20 schools)');
    console.log('- 120 teachers (6 per school)');
    console.log('- 880 students (44 per school)');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  importData();
}
```

### **Langkah 6: Deploy dan Test**

#### A. Deploy ke Netlify
```bash
# 1. Commit changes
git add .
git commit -m "Add Neon database integration"
git push origin main

# 2. Netlify will auto-deploy
```

#### B. Import Data ke Neon
```bash
# Set environment variables
export DATABASE_URL="postgresql://username:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# Run import
node scripts/import-neon-data.js
```

## ✅ Kelebihan Netlify + Neon

### **Cost Benefits**
- ✅ **50% lebih murah** dari Supabase
- ✅ **Pay-per-use** - Bayar mengikut penggunaan
- ✅ **Free tier** tersedia untuk testing

### **Technical Benefits**
- ✅ **Auto-scaling** - Database scale otomatik
- ✅ **Branching** - Buat database branches untuk testing
- ✅ **Fast queries** - PostgreSQL performance tinggi
- ✅ **Connection pooling** - Efficient database connections

### **Developer Benefits**
- ✅ **Standard PostgreSQL** - Semua SQL queries compatible
- ✅ **Easy migration** - Boleh migrate ke mana-mana PostgreSQL
- ✅ **Great dashboard** - User-friendly interface
- ✅ **Backup automatic** - Point-in-time recovery

## 🎯 Kesimpulan

**Netlify + Neon** adalah kombinasi terbaik untuk sistem JohorUP:
- **Lebih murah**: RM75/bulan vs RM150/bulan
- **Sama powerful**: PostgreSQL penuh dengan auto-scaling
- **Mudah maintain**: Managed services
- **Future-proof**: Boleh scale dan migrate dengan mudah

Total setup time: **~20 minit** untuk go-live! 🚀