// Import real data to Neon database (for Netlify environment)
// This script can be run via Netlify Functions or manually with DATABASE_URL

const { Pool } = require('pg');
const XLSX = require('xlsx');
const bcrypt = require('bcryptjs');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function setupDatabase() {
  console.log('🏗️ Setting up database schema...');
  
  try {
    // Read and execute setup SQL
    const setupSQL = `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- PPDs (Pejabat Pendidikan Daerah)
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

      -- Subjects
      CREATE TABLE IF NOT EXISTS subjects (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          code VARCHAR(10) UNIQUE NOT NULL,
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

      -- Insert initial data
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
      ON CONFLICT (code) DO NOTHING;

      INSERT INTO subjects (name, code) VALUES 
      ('Bahasa Melayu', 'BM'),
      ('Sejarah', 'SEJ'),
      ('Matematik', 'MAT')
      ON CONFLICT (code) DO NOTHING;
    `;
    
    await pool.query(setupSQL);
    console.log('✅ Database schema setup complete');
    
  } catch (error) {
    console.error('❌ Database setup error:', error.message);
    throw error;
  }
}

async function importRealData() {
  console.log('📊 Starting real data import to Neon...');
  
  try {
    // Setup database first
    await setupDatabase();
    
    // Import schools (assuming schools.xlsx exists)
    console.log('🏫 Importing schools...');
    try {
      const schoolsWB = XLSX.readFile('data/schools.xlsx');
      const schools = XLSX.utils.sheet_to_json(schoolsWB.Sheets['Schools']);
      
      for (const school of schools) {
        await pool.query(`
          INSERT INTO schools (name, code, ppd_id, address, phone, email, principal_name)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name,
          ppd_id = EXCLUDED.ppd_id,
          address = EXCLUDED.address,
          phone = EXCLUDED.phone,
          email = EXCLUDED.email,
          principal_name = EXCLUDED.principal_name
        `, [
          school.name,
          school.code,
          school.ppd_id,
          school.address,
          school.phone,
          school.email,
          school.principal_name
        ]);
      }
      console.log(`✅ Imported ${schools.length} schools`);
    } catch (error) {
      console.log('⚠️ Schools import skipped:', error.message);
    }
    
    // Import real students
    console.log('👨‍🎓 Importing real students...');
    const studentsWB = XLSX.readFile('data/students_real.xlsx');
    const students = XLSX.utils.sheet_to_json(studentsWB.Sheets['Students']);
    
    let importedCount = 0;
    for (const student of students) {
      try {
        // Convert kodkaum from number to letter code
        let kodkaum = 'M'; // Default to Melayu
        if (typeof student.kodkaum === 'number') {
          // Simple mapping - adjust based on your data
          if (student.kodkaum <= 11) kodkaum = 'M'; // Melayu
          else if (student.kodkaum <= 16) kodkaum = 'C'; // Cina
          else if (student.kodkaum <= 19) kodkaum = 'I'; // India
          else kodkaum = 'L'; // Lain-lain
        }
        
        // Convert jantina
        let jantina = student.jantina === 'LELAKI' ? 'L' : 'P';
        
        // Convert form level
        let formLevel = 4; // Default
        if (student.form_level >= 200) formLevel = 5;
        
        // Convert IC to string
        const icNumber = String(student.ic_number);
        
        await pool.query(`
          INSERT INTO students (ic_number, name, school_id, form_level, class_name, kodkaum, jantina, is_target_student)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (ic_number) DO UPDATE SET
          name = EXCLUDED.name,
          school_id = EXCLUDED.school_id,
          form_level = EXCLUDED.form_level,
          class_name = EXCLUDED.class_name,
          kodkaum = EXCLUDED.kodkaum,
          jantina = EXCLUDED.jantina,
          is_target_student = EXCLUDED.is_target_student
        `, [
          icNumber,
          student.name,
          student.school_id,
          formLevel,
          student.class_name,
          kodkaum,
          jantina,
          true
        ]);
        
        importedCount++;
        if (importedCount % 100 === 0) {
          console.log(`   Imported ${importedCount}/${students.length} students...`);
        }
        
      } catch (error) {
        console.error(`❌ Error importing student ${student.name}:`, error.message);
      }
    }
    
    console.log(`✅ Imported ${importedCount} real students`);
    
    // Create admin users
    console.log('👤 Creating admin users...');
    const hashedPassword = await bcrypt.hash('AdminPass123!', 12);
    
    const adminUsers = [
      { email: 'admin@jpnj.gov.my', name: 'Admin JPNJ', role: 'sektor_perancangan' },
      { email: 'koordinator@jpnj.gov.my', name: 'Koordinator Program', role: 'sektor_perancangan' },
      { email: 'yayasan@jcorp.com.my', name: 'Yayasan JCorp', role: 'yayasan_jcorp' }
    ];
    
    for (const user of adminUsers) {
      await pool.query(`
        INSERT INTO users (email, name, role, password_hash)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        password_hash = EXCLUDED.password_hash
      `, [user.email, user.name, user.role, hashedPassword]);
    }
    
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
    
    console.log('✅ Created admin and PPD users');
    
    // Show summary
    const summary = await pool.query(`
      SELECT 'Schools' as table_name, COUNT(*) as record_count FROM schools
      UNION ALL
      SELECT 'Students', COUNT(*) FROM students
      UNION ALL
      SELECT 'Users', COUNT(*) FROM users
      ORDER BY table_name
    `);
    
    console.log('\n📊 Import Summary:');
    summary.rows.forEach(row => {
      console.log(`   ${row.table_name}: ${row.record_count} records`);
    });
    
    console.log('\n🎉 Real data import to Neon completed successfully!');
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run import
if (require.main === module) {
  importRealData().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { importRealData };