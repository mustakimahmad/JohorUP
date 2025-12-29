import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // Simple authentication
    if (password !== 'AdminPass123!') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });
    
    console.log('🏗️ Setting up database...');
    
    // Setup basic tables and data
    await pool.query(`
      -- PPDs
      CREATE TABLE IF NOT EXISTS ppds (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          code VARCHAR(10) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Schools  
      CREATE TABLE IF NOT EXISTS schools (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          code VARCHAR(20) UNIQUE NOT NULL,
          ppd_id VARCHAR(10),
          address TEXT,
          phone VARCHAR(20),
          email VARCHAR(255),
          principal_name VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Students
      CREATE TABLE IF NOT EXISTS students (
          id SERIAL PRIMARY KEY,
          ic_number VARCHAR(20) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          school_id INTEGER,
          form_level INTEGER,
          class_name VARCHAR(50),
          kodkaum VARCHAR(1),
          jantina VARCHAR(1),
          is_target_student BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Users
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          password_hash VARCHAR(255),
          role VARCHAR(50) NOT NULL,
          school_id INTEGER,
          ppd_id VARCHAR(10),
          is_active BOOLEAN DEFAULT true,
          last_login TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Subjects
      CREATE TABLE IF NOT EXISTS subjects (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          code VARCHAR(10) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Insert PPDs
    await pool.query(`
      INSERT INTO ppds (name, code) VALUES 
      ('PPD J010', 'J010'),
      ('PPD J020', 'J020'),
      ('PPD J030', 'J030'),
      ('PPD J040', 'J040'),
      ('PPD J050', 'J050'),
      ('PPD J060', 'J060'),
      ('PPD J070', 'J070'),
      ('PPD J080', 'J080'),
      ('PPD J090', 'J090'),
      ('PPD J100', 'J100'),
      ('PPD J110', 'J110')
      ON CONFLICT (code) DO NOTHING
    `);
    
    // Insert subjects
    await pool.query(`
      INSERT INTO subjects (name, code) VALUES 
      ('Bahasa Melayu', 'BM'),
      ('Sejarah', 'SEJ'),
      ('Matematik', 'MAT')
      ON CONFLICT (code) DO NOTHING
    `);
    
    // Create admin users
    const hashedPassword = await bcrypt.hash('AdminPass123!', 12);
    
    await pool.query(`
      INSERT INTO users (email, name, role, password_hash) VALUES 
      ('admin@jpnj.gov.my', 'Admin JPNJ', 'sektor_perancangan', $1),
      ('koordinator@jpnj.gov.my', 'Koordinator Program', 'sektor_perancangan', $1),
      ('yayasan@jcorp.com.my', 'Yayasan JCorp', 'yayasan_jcorp', $1)
      ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash
    `, [hashedPassword]);
    
    // Create PPD users
    for (let i = 10; i <= 110; i += 10) {
      const ppdCode = `J${String(i).padStart(3, '0')}`;
      await pool.query(`
        INSERT INTO users (email, name, role, ppd_id, password_hash)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        ppd_id = EXCLUDED.ppd_id,
        password_hash = EXCLUDED.password_hash
      `, [
        `ppd.${ppdCode.toLowerCase()}@moe.gov.my`,
        `PPD ${ppdCode}`,
        'ppd',
        ppdCode,
        hashedPassword
      ]);
    }
    
    // Get summary
    const schoolsResult = await pool.query('SELECT COUNT(*) FROM schools');
    const studentsResult = await pool.query('SELECT COUNT(*) FROM students');
    const usersResult = await pool.query('SELECT COUNT(*) FROM users');
    const ppdsResult = await pool.query('SELECT COUNT(*) FROM ppds');
    
    await pool.end();
    
    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      data: {
        ppds: ppdsResult.rows[0].count,
        schools: schoolsResult.rows[0].count,
        students: studentsResult.rows[0].count,
        users: usersResult.rows[0].count
      }
    });
    
  } catch (error) {
    console.error('Database setup error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to import data',
    usage: 'POST /api/import-data with { "password": "AdminPass123!" }'
  });
}