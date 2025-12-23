# 🌐 Panduan Deployment Netlify untuk Sistem JohorUP

## 📋 Ringkasan Netlify Deployment

Netlify adalah platform yang sangat sesuai untuk sistem JohorUP kerana:
- ✅ **Mudah deploy** - Connect GitHub dan auto-deploy
- ✅ **Cost-effective** - RM50-150/bulan sahaja
- ✅ **Performance tinggi** - Global CDN
- ✅ **SSL automatic** - HTTPS built-in
- ✅ **Custom domain** - Support domain sendiri

## 🗄️ Pilihan Database untuk Netlify

### **Option 1: Supabase (Recommended)**
- **Kos**: RM0-100/bulan
- **Features**: PostgreSQL + Auth + Storage + Real-time
- **Setup**: 5 minit sahaja
- **Pros**: Mudah, lengkap, Malaysian-friendly

### **Option 2: PlanetScale**
- **Kos**: RM0-80/bulan  
- **Features**: MySQL serverless
- **Pros**: Scaling automatic, branching database

### **Option 3: Railway**
- **Kos**: RM20-100/bulan
- **Features**: PostgreSQL + Redis
- **Pros**: Simple setup, good performance

### **Option 4: Neon**
- **Kos**: RM0-50/bulan
- **Features**: PostgreSQL serverless
- **Pros**: Auto-scaling, cost-effective

## 🚀 Setup Lengkap: Netlify + Supabase

### **Langkah 1: Setup Supabase Database**

#### A. Daftar Supabase
1. Pergi ke https://supabase.com
2. Sign up dengan GitHub account
3. Create new project: "johorup-production"
4. Pilih region: "Southeast Asia (Singapore)"
5. Set password yang kuat

#### B. Setup Database Schema
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
    teacher_name VARCHAR(255),
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

CREATE TABLE program_photos (
    id SERIAL PRIMARY KEY,
    program_report_id INTEGER REFERENCES program_reports(id),
    photo_url VARCHAR(500),
    caption TEXT,
    uploaded_date TIMESTAMP DEFAULT NOW()
);

-- 2. Insert initial data
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

-- 3. Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_reports ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies (basic example)
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Schools can view own data" ON schools
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.school_id = schools.id 
            AND users.id::text = auth.uid()::text
        )
    );
```

#### C. Get Database Connection Details
1. Go to Settings > Database
2. Copy connection string
3. Note down:
   - Host
   - Database name
   - Username
   - Password
   - Port

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
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_KEY=[your-service-key]

# Authentication
NEXTAUTH_URL=https://[your-site-name].netlify.app
NEXTAUTH_SECRET=[generate-32-char-secret]
JWT_SECRET=[generate-32-char-secret]

# File Upload (Supabase Storage)
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]

# Email (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@jpnj.gov.my
SMTP_PASS=[app-password]

# Security
ENCRYPTION_KEY=[generate-32-char-key]
ENABLE_MAINTENANCE_MODE=false

# Performance
NODE_ENV=production
```

#### C. Custom Domain (Optional)
1. Go to Domain settings
2. Add custom domain: `johorup.jpnj.gov.my`
3. Update DNS records:
   ```
   Type: CNAME
   Name: johorup
   Value: [your-site-name].netlify.app
   ```

### **Langkah 3: Update Code untuk Supabase**

#### A. Install Supabase Client
```bash
npm install @supabase/supabase-js
```

#### B. Create Supabase Client
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_KEY!
)
```

#### C. Update Authentication
```typescript
// lib/auth.ts
import { supabase } from './supabase'
import bcrypt from 'bcryptjs'

export async function signIn(email: string, password: string) {
  // Get user from database
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
    throw new Error('Invalid credentials')
  }

  // Verify password
  const isValid = await bcrypt.compare(password, user.password_hash)
  
  if (!isValid) {
    throw new Error('Invalid credentials')
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    school_id: user.school_id,
    ppd_id: user.ppd_id
  }
}
```

#### D. Update Data Fetching
```typescript
// lib/data.ts
import { supabase } from './supabase'

export async function getSchools() {
  const { data, error } = await supabase
    .from('schools')
    .select(`
      *,
      ppd:ppds(*)
    `)
    .order('name')

  if (error) throw error
  return data
}

export async function getTeachers(schoolId?: number) {
  let query = supabase
    .from('teachers')
    .select(`
      *,
      school:schools(*),
      subject:subjects(*)
    `)

  if (schoolId) {
    query = query.eq('school_id', schoolId)
  }

  const { data, error } = await query.order('name')
  
  if (error) throw error
  return data
}

export async function createReport(reportData: any) {
  const { data, error } = await supabase
    .from('program_reports')
    .insert(reportData)
    .select()
    .single()

  if (error) throw error
  return data
}
```

### **Langkah 4: File Upload dengan Supabase Storage**

#### A. Setup Storage Bucket
1. Go to Supabase Dashboard > Storage
2. Create bucket: "johorup-files"
3. Set as public bucket
4. Configure RLS policies

#### B. Upload Function
```typescript
// lib/upload.ts
import { supabase } from './supabase'

export async function uploadFile(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from('johorup-files')
    .upload(path, file)

  if (error) throw error

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('johorup-files')
    .getPublicUrl(path)

  return publicUrl
}

export async function uploadReportFiles(
  reportId: number, 
  files: File[], 
  photos: File[]
) {
  const uploadPromises = []

  // Upload report files
  for (let i = 0; i < files.length; i++) {
    const path = `reports/${reportId}/files/${files[i].name}`
    uploadPromises.push(uploadFile(files[i], path))
  }

  // Upload photos
  for (let i = 0; i < photos.length; i++) {
    const path = `reports/${reportId}/photos/${photos[i].name}`
    uploadPromises.push(uploadFile(photos[i], path))
  }

  return await Promise.all(uploadPromises)
}
```

### **Langkah 5: Deploy dan Test**

#### A. Deploy ke Netlify
```bash
# 1. Commit changes
git add .
git commit -m "Add Supabase integration for production"
git push origin main

# 2. Netlify will auto-deploy from GitHub
# 3. Check deployment status di Netlify dashboard
```

#### B. Import Production Data
```bash
# Run data import script
node scripts/import-supabase-data.js
```

#### C. Test System
1. **Login Test**: Cuba semua user roles
2. **CRUD Test**: Create, read, update reports
3. **File Upload**: Test upload gambar dan dokumen
4. **Performance**: Check page load times
5. **Mobile**: Test responsive design

## 💰 Anggaran Kos Netlify + Supabase

### **Starter Plan (Untuk testing)**
- Netlify Starter: RM0/bulan (100GB bandwidth)
- Supabase Free: RM0/bulan (500MB database, 1GB storage)
- **Total: RM0/bulan** ⭐

### **Production Plan (Recommended)**
- Netlify Pro: RM50/bulan (1TB bandwidth, custom domain)
- Supabase Pro: RM100/bulan (8GB database, 100GB storage)
- **Total: RM150/bulan** 🎯

### **Enterprise Plan (High usage)**
- Netlify Business: RM200/bulan (unlimited bandwidth)
- Supabase Team: RM200/bulan (unlimited database)
- **Total: RM400/bulan**

## ✅ Kelebihan Netlify + Supabase

### **Technical Benefits**
- ✅ **Auto-scaling**: Handle traffic spikes
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **SSL automatic**: HTTPS built-in
- ✅ **Git integration**: Deploy on push
- ✅ **Preview deployments**: Test before live

### **Business Benefits**
- ✅ **Cost-effective**: Start from RM0
- ✅ **Low maintenance**: Managed services
- ✅ **High reliability**: 99.9% uptime
- ✅ **Easy scaling**: Grow as needed
- ✅ **Malaysian-friendly**: Good latency

### **Developer Benefits**
- ✅ **Easy setup**: 30 minutes to deploy
- ✅ **Real-time data**: Live updates
- ✅ **Built-in auth**: User management
- ✅ **File storage**: Images and documents
- ✅ **API automatic**: REST + GraphQL

## 🚨 Langkah Seterusnya

### **Untuk Deploy Segera**
1. **Setup Supabase**: 10 minit
2. **Connect Netlify**: 5 minit  
3. **Configure env vars**: 5 minit
4. **Deploy**: Automatic
5. **Test**: 15 minit

### **Total Time**: ~35 minit untuk go-live! 🚀

### **Support Available**
- 📖 Documentation lengkap
- 🎥 Video tutorials (Supabase/Netlify)
- 💬 Community support
- 📧 Email support (Pro plans)

---

**Kesimpulan**: Netlify + Supabase adalah kombinasi terbaik untuk sistem JohorUP - mudah, murah, dan powerful! 🎯