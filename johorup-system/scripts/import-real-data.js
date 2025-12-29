// Script untuk import data sebenar dari Excel/CSV ke database Neon
// Run: node scripts/import-real-data.js

const { Pool } = require('pg');
const XLSX = require('xlsx');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Hash password function
async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

// Import Schools from Excel
async function importSchools(filePath) {
  console.log('📚 Importing schools...');
  
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets['Schools'];
  const schools = XLSX.utils.sheet_to_json(worksheet);
  
  for (const school of schools) {
    try {
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
      
      console.log(`✅ Imported school: ${school.name}`);
    } catch (error) {
      console.error(`❌ Error importing school ${school.name}:`, error.message);
    }
  }
}

// Import Students from Excel
async function importStudents(filePath) {
  console.log('👨‍🎓 Importing students...');
  
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets['Students'];
  const students = XLSX.utils.sheet_to_json(worksheet);
  
  for (const student of students) {
    try {
      // Convert kodkaum from number to letter code
      let kodkaum = student.kodkaum;
      if (typeof kodkaum === 'number') {
        // Map common kodkaum numbers to letters (adjust based on your data)
        const kodkaumMap = {
          1: 'M',   // Melayu
          2: 'C',   // Cina  
          3: 'I',   // India
          4: 'L',   // Lain-lain
          16: 'C',  // Based on sample data
          // Add more mappings as needed
        };
        kodkaum = kodkaumMap[kodkaum] || 'M'; // Default to Melayu if unknown
      }
      
      // Convert jantina to single letter
      let jantina = student.jantina;
      if (jantina === 'LELAKI') jantina = 'L';
      else if (jantina === 'PEREMPUAN') jantina = 'P';
      else if (typeof jantina === 'string' && jantina.length > 1) {
        jantina = jantina.charAt(0).toUpperCase(); // Take first letter
      }
      
      // Convert IC number to string
      const icNumber = String(student.ic_number);
      
      // Convert form_level to 4 or 5
      let formLevel = student.form_level;
      if (formLevel === 200 || formLevel > 10) {
        formLevel = 4; // Default to Form 4 for unusual values
      }
      
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
        student.is_target_student === 'TRUE' || student.is_target_student === true
      ]);
      
      console.log(`✅ Imported student: ${student.name} (${kodkaum}/${jantina})`);
    } catch (error) {
      console.error(`❌ Error importing student ${student.name}:`, error.message);
    }
  }
}

// Import Teachers from Excel
async function importTeachers(filePath) {
  console.log('👩‍🏫 Importing teachers...');
  
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets['Teachers'];
  const teachers = XLSX.utils.sheet_to_json(worksheet);
  
  for (const teacher of teachers) {
    try {
      await pool.query(`
        INSERT INTO teachers (name, email, phone, school_id, subject_id, position, experience_years)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        school_id = EXCLUDED.school_id,
        subject_id = EXCLUDED.subject_id,
        position = EXCLUDED.position,
        experience_years = EXCLUDED.experience_years
      `, [
        teacher.name,
        teacher.email,
        teacher.phone,
        teacher.school_id,
        teacher.subject_id,
        teacher.position,
        teacher.experience_years
      ]);
      
      console.log(`✅ Imported teacher: ${teacher.name}`);
    } catch (error) {
      console.error(`❌ Error importing teacher ${teacher.name}:`, error.message);
    }
  }
}

// Import Users from Excel
async function importUsers(filePath) {
  console.log('👤 Importing users...');
  
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets['Users'];
  const users = XLSX.utils.sheet_to_json(worksheet);
  
  for (const user of users) {
    try {
      const hashedPassword = await hashPassword(user.password || 'DefaultPass123!');
      
      await pool.query(`
        INSERT INTO users (email, name, role, school_id, ppd_id, password_hash)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        school_id = EXCLUDED.school_id,
        ppd_id = EXCLUDED.ppd_id,
        password_hash = EXCLUDED.password_hash
      `, [
        user.email,
        user.name,
        user.role,
        user.school_id || null,
        user.ppd_id || null,
        hashedPassword
      ]);
      
      console.log(`✅ Imported user: ${user.email}`);
    } catch (error) {
      console.error(`❌ Error importing user ${user.email}:`, error.message);
    }
  }
}

// Import Student Grades from Excel
async function importGrades(filePath) {
  console.log('📊 Importing student grades...');
  
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets['Grades'];
  const grades = XLSX.utils.sheet_to_json(worksheet);
  
  for (const grade of grades) {
    try {
      await pool.query(`
        INSERT INTO student_grades (student_id, subject_id, exam_type, exam_date, grade, marks, total_marks, percentage)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        grade.student_id,
        grade.subject_id,
        grade.exam_type,
        grade.exam_date,
        grade.grade,
        grade.marks,
        grade.total_marks,
        grade.percentage
      ]);
      
      console.log(`✅ Imported grade for student ID: ${grade.student_id}`);
    } catch (error) {
      console.error(`❌ Error importing grade:`, error.message);
    }
  }
}

// Main import function
async function importAllData() {
  const dataDir = path.join(__dirname, '../data');
  
  try {
    console.log('🚀 Starting data import...');
    
    // Check if data directory exists
    if (!fs.existsSync(dataDir)) {
      console.log('📁 Creating data directory...');
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Import in order (due to foreign key dependencies)
    const files = {
      schools: path.join(dataDir, 'schools.xlsx'),
      students: path.join(dataDir, 'students.xlsx'),
      teachers: path.join(dataDir, 'teachers.xlsx'),
      users: path.join(dataDir, 'users.xlsx'),
      grades: path.join(dataDir, 'grades.xlsx')
    };
    
    // Check which files exist
    for (const [type, filePath] of Object.entries(files)) {
      if (fs.existsSync(filePath)) {
        console.log(`📄 Found ${type} file: ${filePath}`);
        
        switch (type) {
          case 'schools':
            await importSchools(filePath);
            break;
          case 'students':
            await importStudents(filePath);
            break;
          case 'teachers':
            await importTeachers(filePath);
            break;
          case 'users':
            await importUsers(filePath);
            break;
          case 'grades':
            await importGrades(filePath);
            break;
        }
      } else {
        console.log(`⚠️  File not found: ${filePath}`);
        console.log(`   Create this file with the required data to import ${type}`);
      }
    }
    
    console.log('✅ Data import completed!');
    
    // Show summary
    const summary = await pool.query(`
      SELECT 'Schools' as table_name, COUNT(*) as record_count FROM schools
      UNION ALL
      SELECT 'Students', COUNT(*) FROM students
      UNION ALL
      SELECT 'Teachers', COUNT(*) FROM teachers
      UNION ALL
      SELECT 'Users', COUNT(*) FROM users
      UNION ALL
      SELECT 'Grades', COUNT(*) FROM student_grades
      ORDER BY table_name
    `);
    
    console.log('\n📊 Database Summary:');
    console.table(summary.rows);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  importAllData();
}

module.exports = {
  importSchools,
  importStudents,
  importTeachers,
  importUsers,
  importGrades,
  importAllData
};