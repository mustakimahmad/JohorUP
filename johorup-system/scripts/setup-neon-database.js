#!/usr/bin/env node

/**
 * Neon Database Setup Script
 * Sets up the production database schema and initial data
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function setupDatabase() {
  console.log('🚀 Setting up Neon database...');
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '../database/production_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Connect to database
    const client = await pool.connect();
    
    console.log('📊 Creating database schema...');
    await client.query(schema);
    
    console.log('👤 Setting up initial users...');
    
    // Insert all user roles with demo credentials
    const users = [
      {
        name: 'Super Admin S4PD',
        email: 'admin@s4pd.gov.my',
        password: 'admin123',
        role: 'super_admin_s4pd',
        level: 'Super Admin',
        sector: 'S4PD'
      },
      {
        name: 'Admin SPB',
        email: 'spb.admin@jpnj.gov.my',
        password: 'spb123',
        role: 'admin_spb',
        level: 'Admin',
        sector: 'SPB'
      },
      {
        name: 'Admin SPM',
        email: 'spm.admin@jpnj.gov.my',
        password: 'spm123',
        role: 'admin_spm',
        level: 'Admin',
        sector: 'SPM'
      },
      {
        name: 'Strategic JCorp',
        email: 'strategic@jcorp.com.my',
        password: 'jcorp123',
        role: 'strategic_jcorp',
        level: 'Strategic Viewer',
        sector: 'JCORP'
      },
      {
        name: 'Strategic Hasanah',
        email: 'strategic@hasanah.com.my',
        password: 'hasanah123',
        role: 'strategic_hasanah',
        level: 'Strategic Viewer',
        sector: 'HASANAH'
      },
      {
        name: 'PPD Johor Bahru',
        email: 'ppd.jb@jpnj.gov.my',
        password: 'ppd123',
        role: 'tactical_ppd',
        level: 'Tactical User',
        sector: 'PPD'
      },
      {
        name: 'Sekolah Menengah Demo',
        email: 'school.demo@jpnj.gov.my',
        password: 'school123',
        role: 'operational_school',
        level: 'Operational User',
        sector: 'SCHOOL'
      },
      {
        name: 'Guru Matematik',
        email: 'teacher.math@jpnj.gov.my',
        password: 'teacher123',
        role: 'operational_teacher',
        level: 'Operational User',
        sector: 'TEACHER'
      },
      {
        name: 'SISC+ Matematik',
        email: 'sisc.math@jpnj.gov.my',
        password: 'sisc123',
        role: 'coaching_sisc',
        level: 'Coaching User',
        sector: 'SISC'
      }
    ];
    
    for (const user of users) {
      await client.query(
        `INSERT INTO users (name, email, password, role, level, sector) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         role = EXCLUDED.role,
         level = EXCLUDED.level,
         sector = EXCLUDED.sector`,
        [user.name, user.email, user.password, user.role, user.level, user.sector]
      );
    }
    
    console.log('📚 Setting up subjects...');
    const subjects = [
      { name: 'Bahasa Melayu', code: 'BM', category: 'Wajib' },
      { name: 'Sejarah', code: 'SEJ', category: 'Wajib' },
      { name: 'Matematik', code: 'MAT', category: 'Wajib' },
      { name: 'Sains', code: 'SCI', category: 'Wajib' },
      { name: 'Bahasa Inggeris', code: 'BI', category: 'Wajib' },
      { name: 'Fizik', code: 'PHY', category: 'Pilihan' },
      { name: 'Kimia', code: 'CHE', category: 'Pilihan' },
      { name: 'Biologi', code: 'BIO', category: 'Pilihan' },
      { name: 'Matematik Tambahan', code: 'AMT', category: 'Pilihan' },
      { name: 'Ekonomi', code: 'ECO', category: 'Pilihan' }
    ];
    
    for (const subject of subjects) {
      await client.query(
        `INSERT INTO subjects (name, code, category) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (code) DO NOTHING`,
        [subject.name, subject.code, subject.category]
      );
    }
    
    console.log('📝 Creating initial audit log...');
    await client.query(
      `INSERT INTO audit_logs (user_id, action, resource, details) 
       VALUES ((SELECT id FROM users WHERE email = 'admin@s4pd.gov.my'), 
               'SYSTEM_SETUP', 'DATABASE', 
               '{"message": "Database initialized successfully", "timestamp": "${new Date().toISOString()}"}')`,
    );
    
    client.release();
    
    console.log('✅ Database setup completed successfully!');
    console.log('\n📋 Demo Login Credentials:');
    console.log('Super Admin: admin@s4pd.gov.my / admin123');
    console.log('SPB Admin: spb.admin@jpnj.gov.my / spb123');
    console.log('SPM Admin: spm.admin@jpnj.gov.my / spm123');
    console.log('Yayasan JCorp: strategic@jcorp.com.my / jcorp123');
    console.log('Yayasan Hasanah: strategic@hasanah.com.my / hasanah123');
    console.log('\n🌐 Ready for production deployment!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Check if DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.log('💡 Usage: DATABASE_URL="your-neon-connection-string" node scripts/setup-neon-database.js');
  process.exit(1);
}

setupDatabase();