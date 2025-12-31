// Netlify Function to import real data to Neon database
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  // Simple authentication check
  const { password } = JSON.parse(event.body || '{}');
  if (password !== 'AdminPass123!') {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }
  
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    // Test connection
    await pool.query('SELECT NOW()');
    
    // Setup database schema
    await pool.query(`
      -- Drop existing tables to reset
      DROP TABLE IF EXISTS students CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS schools CASCADE;
      DROP TABLE IF EXISTS subjects CASCADE;
      DROP TABLE IF EXISTS ppds CASCADE;
      
      -- PPDs
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
          ppd_id VARCHAR(10),
          address TEXT,
          phone VARCHAR(20),
          email VARCHAR(255),
          principal_name VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
      
      -- Students
      CREATE TABLE students (
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
      CREATE TABLE users (
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
      CREATE TABLE subjects (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          code VARCHAR(10) UNIQUE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    
    // Setup PPDs
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
    `);
    
    // Setup schools with correct PPD mapping
    const schoolsData = [
      { name: 'SMK Demo 1', code: 'SMKDEMO1', ppd_id: 'J010', address: 'Alamat Sekolah 1', phone: '07-0011234', email: 'smkdemo1@moe-dl.edu.my', principal_name: 'Pengetua 1' },
      { name: 'SMK Demo 2', code: 'SMKDEMO2', ppd_id: 'J010', address: 'Alamat Sekolah 2', phone: '07-0021234', email: 'smkdemo2@moe-dl.edu.my', principal_name: 'Pengetua 2' },
      { name: 'SMK Demo 3', code: 'SMKDEMO3', ppd_id: 'J010', address: 'Alamat Sekolah 3', phone: '07-0031234', email: 'smkdemo3@moe-dl.edu.my', principal_name: 'Pengetua 3' },
      { name: 'SMK Demo 4', code: 'SMKDEMO4', ppd_id: 'J010', address: 'Alamat Sekolah 4', phone: '07-0041234', email: 'smkdemo4@moe-dl.edu.my', principal_name: 'Pengetua 4' },
      { name: 'SMK Demo 5', code: 'SMKDEMO5', ppd_id: 'J010', address: 'Alamat Sekolah 5', phone: '07-0051234', email: 'smkdemo5@moe-dl.edu.my', principal_name: 'Pengetua 5' },
      { name: 'SMK Demo 6', code: 'SMKDEMO6', ppd_id: 'J010', address: 'Alamat Sekolah 6', phone: '07-0061234', email: 'smkdemo6@moe-dl.edu.my', principal_name: 'Pengetua 6' },
      { name: 'SMK Demo 7', code: 'SMKDEMO7', ppd_id: 'J010', address: 'Alamat Sekolah 7', phone: '07-0071234', email: 'smkdemo7@moe-dl.edu.my', principal_name: 'Pengetua 7' },
      { name: 'SMK Demo 8', code: 'SMKDEMO8', ppd_id: 'J010', address: 'Alamat Sekolah 8', phone: '07-0081234', email: 'smkdemo8@moe-dl.edu.my', principal_name: 'Pengetua 8' },
      { name: 'SMK Demo 9', code: 'SMKDEMO9', ppd_id: 'J020', address: 'Alamat Sekolah 9', phone: '07-0091234', email: 'smkdemo9@moe-dl.edu.my', principal_name: 'Pengetua 9' },
      { name: 'SMK Demo 10', code: 'SMKDEMO10', ppd_id: 'J020', address: 'Alamat Sekolah 10', phone: '07-0101234', email: 'smkdemo10@moe-dl.edu.my', principal_name: 'Pengetua 10' },
      { name: 'SMK Demo 11', code: 'SMKDEMO11', ppd_id: 'J020', address: 'Alamat Sekolah 11', phone: '07-0111234', email: 'smkdemo11@moe-dl.edu.my', principal_name: 'Pengetua 11' },
      { name: 'SMK Demo 12', code: 'SMKDEMO12', ppd_id: 'J020', address: 'Alamat Sekolah 12', phone: '07-0121234', email: 'smkdemo12@moe-dl.edu.my', principal_name: 'Pengetua 12' },
      { name: 'SMK Demo 13', code: 'SMKDEMO13', ppd_id: 'J020', address: 'Alamat Sekolah 13', phone: '07-0131234', email: 'smkdemo13@moe-dl.edu.my', principal_name: 'Pengetua 13' },
      { name: 'SMK Demo 14', code: 'SMKDEMO14', ppd_id: 'J020', address: 'Alamat Sekolah 14', phone: '07-0141234', email: 'smkdemo14@moe-dl.edu.my', principal_name: 'Pengetua 14' },
      { name: 'SMK Demo 15', code: 'SMKDEMO15', ppd_id: 'J030', address: 'Alamat Sekolah 15', phone: '07-0151234', email: 'smkdemo15@moe-dl.edu.my', principal_name: 'Pengetua 15' },
      { name: 'SMK Demo 16', code: 'SMKDEMO16', ppd_id: 'J030', address: 'Alamat Sekolah 16', phone: '07-0161234', email: 'smkdemo16@moe-dl.edu.my', principal_name: 'Pengetua 16' },
      { name: 'SMK Demo 17', code: 'SMKDEMO17', ppd_id: 'J030', address: 'Alamat Sekolah 17', phone: '07-0171234', email: 'smkdemo17@moe-dl.edu.my', principal_name: 'Pengetua 17' },
      { name: 'SMK Demo 18', code: 'SMKDEMO18', ppd_id: 'J030', address: 'Alamat Sekolah 18', phone: '07-0181234', email: 'smkdemo18@moe-dl.edu.my', principal_name: 'Pengetua 18' },
      { name: 'SMK Demo 19', code: 'SMKDEMO19', ppd_id: 'J030', address: 'Alamat Sekolah 19', phone: '07-0191234', email: 'smkdemo19@moe-dl.edu.my', principal_name: 'Pengetua 19' },
      { name: 'SMK Demo 20', code: 'SMKDEMO20', ppd_id: 'J030', address: 'Alamat Sekolah 20', phone: '07-0201234', email: 'smkdemo20@moe-dl.edu.my', principal_name: 'Pengetua 20' }
    ];
    
    for (const school of schoolsData) {
      await pool.query(`
        INSERT INTO schools (name, code, ppd_id, address, phone, email, principal_name)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [school.name, school.code, school.ppd_id, school.address, school.phone, school.email, school.principal_name]);
    }
    
    // Setup subjects
    await pool.query(`
      INSERT INTO subjects (name, code) VALUES 
      ('Bahasa Melayu', 'BM'),
      ('Sejarah', 'SEJ'),
      ('Matematik', 'MAT')
    `);
    
    // Create admin users
    const hashedPassword = await bcrypt.hash('AdminPass123!', 12);
    
    await pool.query(`
      INSERT INTO users (email, name, role, password_hash) VALUES 
      ('admin@jpnj.gov.my', 'Admin JPNJ', 'sektor_perancangan', $1),
      ('koordinator@jpnj.gov.my', 'Koordinator Program', 'sektor_perancangan', $1),
      ('yayasan@jcorp.com.my', 'Yayasan JCorp', 'yayasan_jcorp', $1)
    `, [hashedPassword]);
    
    // Create PPD users
    for (let i = 10; i <= 110; i += 10) {
      const ppdCode = `J${String(i).padStart(3, '0')}`;
      await pool.query(`
        INSERT INTO users (email, name, role, ppd_id, password_hash)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        `ppd.${ppdCode.toLowerCase()}@moe.gov.my`,
        `PPD ${ppdCode}`,
        'ppd',
        ppdCode,
        hashedPassword
      ]);
    }
    
    // Create school users (one per school)
    const schoolUsers = [
      { email: 'smkdemo1@moe-dl.edu.my', name: 'SMK Demo 1', school_id: 1 },
      { email: 'smkdemo2@moe-dl.edu.my', name: 'SMK Demo 2', school_id: 2 },
      { email: 'smkdemo3@moe-dl.edu.my', name: 'SMK Demo 3', school_id: 3 },
      { email: 'smkdemo4@moe-dl.edu.my', name: 'SMK Demo 4', school_id: 4 },
      { email: 'smkdemo5@moe-dl.edu.my', name: 'SMK Demo 5', school_id: 5 }
    ];
    
    for (const schoolUser of schoolUsers) {
      await pool.query(`
        INSERT INTO users (email, name, role, school_id, password_hash)
        VALUES ($1, $2, $3, $4, $5)
      `, [schoolUser.email, schoolUser.name, 'sekolah', schoolUser.school_id, hashedPassword]);
    }
    
    // Add sample students (5 per school for first 5 schools = 25 students)
    const sampleStudents = [
      // School 1 students
      { ic_number: '051234567890', name: 'Ahmad Bin Ali', school_id: 1, form_level: 4, class_name: '4A', kodkaum: 'M', jantina: 'L', is_target_student: true },
      { ic_number: '051234567891', name: 'Siti Binti Ahmad', school_id: 1, form_level: 4, class_name: '4A', kodkaum: 'M', jantina: 'P', is_target_student: true },
      { ic_number: '051234567892', name: 'Lim Wei Ming', school_id: 1, form_level: 5, class_name: '5B', kodkaum: 'C', jantina: 'L', is_target_student: false },
      { ic_number: '051234567893', name: 'Priya A/P Raman', school_id: 1, form_level: 5, class_name: '5B', kodkaum: 'I', jantina: 'P', is_target_student: true },
      { ic_number: '051234567894', name: 'Nurul Ain Binti Hassan', school_id: 1, form_level: 4, class_name: '4C', kodkaum: 'M', jantina: 'P', is_target_student: false },
      
      // School 2 students  
      { ic_number: '051234567895', name: 'Muhammad Bin Ibrahim', school_id: 2, form_level: 4, class_name: '4A', kodkaum: 'M', jantina: 'L', is_target_student: true },
      { ic_number: '051234567896', name: 'Tan Mei Ling', school_id: 2, form_level: 4, class_name: '4A', kodkaum: 'C', jantina: 'P', is_target_student: true },
      { ic_number: '051234567897', name: 'Raj Kumar A/L Suresh', school_id: 2, form_level: 5, class_name: '5A', kodkaum: 'I', jantina: 'L', is_target_student: false },
      { ic_number: '051234567898', name: 'Fatimah Binti Omar', school_id: 2, form_level: 5, class_name: '5B', kodkaum: 'M', jantina: 'P', is_target_student: true },
      { ic_number: '051234567899', name: 'Wong Kar Wai', school_id: 2, form_level: 4, class_name: '4B', kodkaum: 'C', jantina: 'L', is_target_student: false },
      
      // School 3 students
      { ic_number: '051234567900', name: 'Aminah Binti Yusof', school_id: 3, form_level: 4, class_name: '4A', kodkaum: 'M', jantina: 'P', is_target_student: true },
      { ic_number: '051234567901', name: 'Chen Wei Jie', school_id: 3, form_level: 4, class_name: '4A', kodkaum: 'C', jantina: 'L', is_target_student: true },
      { ic_number: '051234567902', name: 'Kavitha A/P Krishnan', school_id: 3, form_level: 5, class_name: '5A', kodkaum: 'I', jantina: 'P', is_target_student: false },
      { ic_number: '051234567903', name: 'Hafiz Bin Rahman', school_id: 3, form_level: 5, class_name: '5B', kodkaum: 'M', jantina: 'L', is_target_student: true },
      { ic_number: '051234567904', name: 'Lee Xin Yi', school_id: 3, form_level: 4, class_name: '4C', kodkaum: 'C', jantina: 'P', is_target_student: false }
    ];
    
    for (const student of sampleStudents) {
      await pool.query(`
        INSERT INTO students (ic_number, name, school_id, form_level, class_name, kodkaum, jantina, is_target_student)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [student.ic_number, student.name, student.school_id, student.form_level, student.class_name, student.kodkaum, student.jantina, student.is_target_student]);
    }
    
    // Get counts
    const ppdsCount = await pool.query('SELECT COUNT(*) FROM ppds');
    const schoolsCount = await pool.query('SELECT COUNT(*) FROM schools');
    const studentsCount = await pool.query('SELECT COUNT(*) FROM students');
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    
    await pool.end();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Database setup completed successfully',
        data: {
          ppds: ppdsCount.rows[0].count,
          schools: schoolsCount.rows[0].count,
          students: studentsCount.rows[0].count,
          users: usersCount.rows[0].count
        }
      })
    };
    
  } catch (error) {
    console.error('Import error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};