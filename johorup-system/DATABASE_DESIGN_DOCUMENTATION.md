# 📊 Database Design - Sistem JohorUP

## 🏗️ Arsitektur Database

Sistem JohorUP menggunakan **PostgreSQL** (Neon) dengan design **hierarchical** yang mengikut struktur organisasi pendidikan Malaysia.

## 📋 Struktur Hierarki Organisasi

```
S4PD (Sektor 4 Pendidikan)
├── SPB (Sektor Pengurusan Berstruktur)
├── SPM (Sektor Pengurusan Maklumat)
└── PPD (Pejabat Pendidikan Daerah)
    └── Schools (Sekolah)
        ├── Teachers (Guru)
        └── Students (Murid)
```

## 🗄️ Struktur Tabel Utama

### 1. **PPD Table** - Pejabat Pendidikan Daerah
```sql
CREATE TABLE ppd (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,           -- PPD_JB, PPD_KL
  name VARCHAR(255) NOT NULL,                 -- PPD Johor Bahru
  district VARCHAR(100) NOT NULL,             -- Johor Bahru
  state VARCHAR(50) DEFAULT 'Johor',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Data Contoh:**
- PPD_JB → PPD Johor Bahru
- PPD_KL → PPD Kluang  
- PPD_BP → PPD Batu Pahat
- PPD_MR → PPD Muar
- PPD_SG → PPD Segamat

### 2. **Schools Table** - Sekolah
```sql
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,           -- SMK001, SMK002
  name VARCHAR(255) NOT NULL,                 -- SMK Taman Johor Jaya
  ppd_id UUID REFERENCES ppd(id),            -- Foreign Key ke PPD
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  principal_name VARCHAR(255),                -- Nama Pengetua
  student_count INTEGER DEFAULT 0,
  teacher_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Relationship:** `schools.ppd_id → ppd.id`

### 3. **Students Table** - Murid
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ic_number VARCHAR(20) UNIQUE NOT NULL,      -- No. IC Murid
  name VARCHAR(255) NOT NULL,                 -- Nama Murid
  school_id UUID REFERENCES schools(id),     -- Foreign Key ke School
  class_level VARCHAR(10),                    -- Form 4, Form 5
  class_name VARCHAR(50),                     -- 4 Bestari, 4 Cemerlang
  gender VARCHAR(10),                         -- Male, Female
  race VARCHAR(50),                           -- Malay, Chinese, Indian
  religion VARCHAR(50),
  address TEXT,
  parent_phone VARCHAR(20),
  tuition_status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Relationship:** `students.school_id → schools.id`

### 4. **Users Table** - Pengguna Sistem
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,                 -- Role-based access
  ppd_id UUID REFERENCES ppd(id),            -- Untuk PPD/SISC users
  school_id UUID REFERENCES schools(id),     -- Untuk School/Teacher users
  subject VARCHAR(100),                       -- Subjek untuk SISC+/Teacher
  specialization VARCHAR(100),               -- Kepakaran khusus
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Hierarchical Relationships:**
- `users.ppd_id → ppd.id` (untuk PPD dan SISC+ users)
- `users.school_id → schools.id` (untuk School Admin dan Teachers)

## 👥 Role-Based Access Control

### User Roles dan Akses Data:

| Role | Akses Data | Scope |
|------|------------|-------|
| **super_admin_s4pd** | Semua data | Seluruh sistem |
| **admin_spb** | Data strategik | Semua PPD |
| **admin_spm** | Data maklumat | Semua PPD |
| **tactical_ppd** | Data PPD | PPD mereka sahaja |
| **coaching_sisc** | Data subjek | PPD + subjek mereka |
| **operational_school** | Data sekolah | Sekolah mereka sahaja |
| **operational_teacher** | Data murid | Sekolah + subjek mereka |

## 🔍 Data Filtering Logic

### Contoh Query untuk Different Roles:

**Super Admin** - Semua murid:
```sql
SELECT st.*, s.name as school_name, p.name as ppd_name
FROM students st
LEFT JOIN schools s ON st.school_id = s.id
LEFT JOIN ppd p ON s.ppd_id = p.id;
```

**PPD User** - Murid dalam PPD mereka:
```sql
SELECT st.*, s.name as school_name, p.name as ppd_name
FROM students st
LEFT JOIN schools s ON st.school_id = s.id
LEFT JOIN ppd p ON s.ppd_id = p.id
WHERE s.ppd_id = $user_ppd_id;
```

**School Admin** - Murid dalam sekolah mereka:
```sql
SELECT st.*, s.name as school_name
FROM students st
LEFT JOIN schools s ON st.school_id = s.id
WHERE st.school_id = $user_school_id;
```

**Teacher** - Murid dalam sekolah dan subjek mereka:
```sql
SELECT st.*, s.name as school_name
FROM students st
LEFT JOIN schools s ON st.school_id = s.id
WHERE st.school_id = $user_school_id
-- Additional filtering by subject in application layer
```

## 📊 Audit Trail System

### 5. **Audit Logs Table** - Jejak Audit
```sql
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  user_role VARCHAR(100),
  action VARCHAR(100) NOT NULL,               -- LOGIN, CREATE, UPDATE, DELETE
  table_name VARCHAR(100),                    -- students, schools, users
  record_id INTEGER,                          -- ID record yang diubah
  old_values JSONB,                          -- Data lama (untuk UPDATE)
  new_values JSONB,                          -- Data baru (untuk CREATE/UPDATE)
  ip_address INET,
  user_agent TEXT,
  session_id VARCHAR(255),
  timestamp TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'SUCCESS'
);
```

### 6. **Login Attempts Table** - Percubaan Login
```sql
CREATE TABLE login_attempts (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  ip_address INET,
  success BOOLEAN NOT NULL,
  failure_reason VARCHAR(255),
  timestamp TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Security Features

### Password Hashing
- Menggunakan **bcrypt** untuk hash password
- Salt rounds: 12 (high security)

### Session Management
- Session data disimpan dalam **sessionStorage** (client-side)
- Session timeout: 8 jam
- Auto-logout pada inactivity

### IP Address Tracking
- Semua login attempts direkod dengan IP address
- Audit trail termasuk IP address untuk setiap action

## 📈 Performance Optimizations

### Indexes
```sql
-- Performance indexes
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_schools_ppd_id ON schools(ppd_id);
CREATE INDEX idx_users_ppd_id ON users(ppd_id);
CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_audit_logs_user_email ON audit_logs(user_email);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
```

### Query Optimization
- Menggunakan **LEFT JOIN** untuk optional relationships
- **LIMIT** dan **OFFSET** untuk pagination
- **WHERE** clauses untuk role-based filtering

## 🚀 Database Setup Process

### 1. Initial Setup
```javascript
// Create basic tables
await client.query(`CREATE TABLE users (...)`);
await client.query(`CREATE TABLE audit_logs (...)`);
```

### 2. Hierarchical Setup
```javascript
// Create hierarchical structure
await client.query(`CREATE TABLE ppd (...)`);
await client.query(`CREATE TABLE schools (...)`);
await client.query(`CREATE TABLE students (...)`);
```

### 3. Demo Data Population
```javascript
// Insert demo PPD, schools, students
// Update users with hierarchical assignments
```

## 📊 Data Statistics

### Current Demo Data:
- **PPD**: 5 daerah (Johor Bahru, Kluang, Batu Pahat, Muar, Segamat)
- **Schools**: 5 sekolah dengan principal dan student counts
- **Students**: 5 murid contoh dengan complete profiles
- **Users**: 9 demo users across all roles

## 🔄 Data Flow

### User Login → Data Access:
1. User login dengan email/password
2. System verify credentials dan get user role
3. System determine user's hierarchical scope (PPD/School)
4. API calls filtered berdasarkan user scope
5. Frontend display data sesuai dengan role permissions

### Data Modification Flow:
1. User action (create/update/delete)
2. Verify user permissions
3. Execute database operation
4. Log audit trail
5. Return success/error response

## 🛠️ Environment Configuration

### Database Connection:
- **Production**: Neon PostgreSQL
- **Connection String**: `NETLIFY_DATABASE_URL`
- **SSL**: Required (`rejectUnauthorized: false`)

### Connection Pool:
```javascript
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});
```

## 📝 Best Practices

### 1. Data Integrity
- Menggunakan **UUID** untuk primary keys
- **Foreign key constraints** untuk referential integrity
- **NOT NULL** constraints untuk required fields

### 2. Security
- **Role-based access control** di database level
- **Audit logging** untuk semua data changes
- **IP tracking** untuk security monitoring

### 3. Scalability
- **Indexed** columns untuk fast queries
- **Connection pooling** untuk efficient database usage
- **Hierarchical filtering** untuk reduced data transfer

Database design ini memastikan sistem JohorUP dapat handle struktur organisasi pendidikan Malaysia dengan security, performance, dan audit compliance yang tinggi. 🎯