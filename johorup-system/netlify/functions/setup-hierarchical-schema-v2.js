// Setup hierarchical user management schema - Version 2 (Simplified)
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          error: 'Database URL not configured'
        })
      };
    }

    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();

    try {
      // Drop existing hierarchical tables if they exist
      await client.query(`DROP TABLE IF EXISTS students CASCADE`);
      await client.query(`DROP TABLE IF EXISTS schools CASCADE`);
      await client.query(`DROP TABLE IF EXISTS ppd CASCADE`);

      // Remove hierarchical columns from users table
      try {
        await client.query(`ALTER TABLE users DROP COLUMN IF EXISTS ppd_id CASCADE`);
        await client.query(`ALTER TABLE users DROP COLUMN IF EXISTS school_id CASCADE`);
        await client.query(`ALTER TABLE users DROP COLUMN IF EXISTS subject CASCADE`);
        await client.query(`ALTER TABLE users DROP COLUMN IF EXISTS specialization CASCADE`);
      } catch (dropError) {
        console.log('Column drop error (expected):', dropError.message);
      }

      // Create PPD table
      await client.query(`
        CREATE TABLE ppd (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          code VARCHAR(20) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          district VARCHAR(100) NOT NULL,
          state VARCHAR(50) DEFAULT 'Johor',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Schools table
      await client.query(`
        CREATE TABLE schools (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          code VARCHAR(20) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          ppd_id UUID REFERENCES ppd(id) ON DELETE SET NULL,
          address TEXT,
          phone VARCHAR(20),
          email VARCHAR(100),
          principal_name VARCHAR(255),
          student_count INTEGER DEFAULT 0,
          teacher_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create Students table
      await client.query(`
        CREATE TABLE students (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          ic_number VARCHAR(20) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
          class_level VARCHAR(10),
          class_name VARCHAR(50),
          gender VARCHAR(10),
          race VARCHAR(50),
          religion VARCHAR(50),
          address TEXT,
          parent_phone VARCHAR(20),
          tuition_status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Add hierarchical fields to users table
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN ppd_id UUID REFERENCES ppd(id) ON DELETE SET NULL,
        ADD COLUMN school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
        ADD COLUMN subject VARCHAR(100),
        ADD COLUMN specialization VARCHAR(100)
      `);

      // Insert PPD data
      const ppdData = [
        ['PPD_JB', 'PPD Johor Bahru', 'Johor Bahru'],
        ['PPD_KL', 'PPD Kluang', 'Kluang'],
        ['PPD_BP', 'PPD Batu Pahat', 'Batu Pahat'],
        ['PPD_MR', 'PPD Muar', 'Muar'],
        ['PPD_SG', 'PPD Segamat', 'Segamat']
      ];

      for (const [code, name, district] of ppdData) {
        await client.query(
          `INSERT INTO ppd (code, name, district) VALUES ($1, $2, $3)`,
          [code, name, district]
        );
      }

      // Insert Schools data
      const schoolsData = [
        ['SMK001', 'SMK Taman Johor Jaya', 'PPD_JB', 'Puan Siti Aminah', 850, 45],
        ['SMK002', 'SMK Bandar Baru UDA', 'PPD_JB', 'Encik Ahmad Rahman', 920, 52],
        ['SMK003', 'SMK Kluang', 'PPD_KL', 'Puan Noraini Hassan', 780, 38],
        ['SMK004', 'SMK Simpang Renggam', 'PPD_KL', 'Encik Mohd Farid', 650, 32],
        ['SMK005', 'SMK Batu Pahat', 'PPD_BP', 'Puan Rozita Ahmad', 890, 48]
      ];

      for (const [code, name, ppdCode, principal, studentCount, teacherCount] of schoolsData) {
        const ppdResult = await client.query('SELECT id FROM ppd WHERE code = $1', [ppdCode]);
        if (ppdResult.rows.length > 0) {
          await client.query(
            `INSERT INTO schools (code, name, ppd_id, principal_name, student_count, teacher_count) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [code, name, ppdResult.rows[0].id, principal, studentCount, teacherCount]
          );
        }
      }

      // Insert Students data
      const studentsData = [
        ['051234567890', 'Ahmad Bin Abdullah', 'SMK001', 'Form 4', '4 Bestari', 'Male', 'Malay'],
        ['051234567891', 'Siti Nurhaliza Binti Hassan', 'SMK001', 'Form 4', '4 Bestari', 'Female', 'Malay'],
        ['051234567892', 'Lim Wei Ming', 'SMK001', 'Form 4', '4 Cemerlang', 'Male', 'Chinese'],
        ['051234567893', 'Priya A/P Raman', 'SMK003', 'Form 4', '4 Bijak', 'Female', 'Indian'],
        ['051234567894', 'Muhammad Faiz Bin Omar', 'SMK003', 'Form 4', '4 Bijak', 'Male', 'Malay']
      ];

      for (const [ic, name, schoolCode, classLevel, className, gender, race] of studentsData) {
        const schoolResult = await client.query('SELECT id FROM schools WHERE code = $1', [schoolCode]);
        if (schoolResult.rows.length > 0) {
          await client.query(
            `INSERT INTO students (ic_number, name, school_id, class_level, class_name, gender, race) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [ic, name, schoolResult.rows[0].id, classLevel, className, gender, race]
          );
        }
      }

      // Update users with hierarchical data
      const userUpdates = [
        ['ppd.jb@jpnj.gov.my', 'PPD_JB', null, null, 'District Administration'],
        ['school.demo@jpnj.gov.my', null, 'SMK001', null, 'School Administration'],
        ['teacher.math@jpnj.gov.my', null, 'SMK001', 'Mathematics', 'Additional Mathematics'],
        ['sisc.math@jpnj.gov.my', 'PPD_KL', null, 'Mathematics', 'SISC+ Mathematics']
      ];

      for (const [email, ppdCode, schoolCode, subject, specialization] of userUpdates) {
        let ppdId = null;
        let schoolId = null;

        if (ppdCode) {
          const ppdResult = await client.query('SELECT id FROM ppd WHERE code = $1', [ppdCode]);
          if (ppdResult.rows.length > 0) {
            ppdId = ppdResult.rows[0].id;
          }
        }

        if (schoolCode) {
          const schoolResult = await client.query('SELECT id FROM schools WHERE code = $1', [schoolCode]);
          if (schoolResult.rows.length > 0) {
            schoolId = schoolResult.rows[0].id;
          }
        }

        await client.query(
          `UPDATE users SET ppd_id = $1, school_id = $2, subject = $3, specialization = $4 WHERE email = $5`,
          [ppdId, schoolId, subject, specialization, email]
        );
      }

      client.release();
      await pool.end();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Hierarchical schema setup completed successfully',
          tablesCreated: ['ppd', 'schools', 'students'],
          ppdCreated: ppdData.length,
          schoolsCreated: schoolsData.length,
          studentsCreated: studentsData.length,
          usersUpdated: userUpdates.length,
          timestamp: new Date().toISOString()
        })
      };

    } catch (dbError) {
      client.release();
      await pool.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Schema setup error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        message: 'Schema setup failed'
      })
    };
  }
};