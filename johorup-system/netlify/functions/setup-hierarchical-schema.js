// Setup hierarchical user management schema
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
      // Create PPD (Pejabat Pendidikan Daerah) table
      await client.query(`
        CREATE TABLE IF NOT EXISTS ppd (
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
        CREATE TABLE IF NOT EXISTS schools (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          code VARCHAR(20) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          ppd_id UUID,
          address TEXT,
          phone VARCHAR(20),
          email VARCHAR(100),
          principal_name VARCHAR(255),
          student_count INTEGER DEFAULT 0,
          teacher_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Add foreign key constraint for schools after ppd table exists
      try {
        await client.query(`
          ALTER TABLE schools 
          ADD CONSTRAINT fk_schools_ppd 
          FOREIGN KEY (ppd_id) REFERENCES ppd(id) ON DELETE SET NULL
        `);
      } catch (fkError) {
        console.log('Schools PPD foreign key constraint already exists:', fkError.message);
      }

      // Create Students table
      await client.query(`
        CREATE TABLE IF NOT EXISTS students (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          ic_number VARCHAR(20) UNIQUE NOT NULL,
          name VARCHAR(255) NOT NULL,
          school_id UUID,
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

      // Add foreign key constraint for students after schools table exists
      try {
        await client.query(`
          ALTER TABLE students 
          ADD CONSTRAINT fk_students_school 
          FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL
        `);
      } catch (fkError) {
        console.log('Students school foreign key constraint already exists:', fkError.message);
      }

      // Add hierarchical fields to users table (without foreign key constraints first)
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS ppd_id UUID,
        ADD COLUMN IF NOT EXISTS school_id UUID,
        ADD COLUMN IF NOT EXISTS subject VARCHAR(100),
        ADD COLUMN IF NOT EXISTS specialization VARCHAR(100)
      `);

      // Insert sample PPD data
      const ppdData = [
        { code: 'PPD_JB', name: 'PPD Johor Bahru', district: 'Johor Bahru' },
        { code: 'PPD_KL', name: 'PPD Kluang', district: 'Kluang' },
        { code: 'PPD_BP', name: 'PPD Batu Pahat', district: 'Batu Pahat' },
        { code: 'PPD_MR', name: 'PPD Muar', district: 'Muar' },
        { code: 'PPD_SG', name: 'PPD Segamat', district: 'Segamat' }
      ];

      for (const ppd of ppdData) {
        await client.query(
          `INSERT INTO ppd (code, name, district) 
           VALUES ($1, $2, $3) 
           ON CONFLICT (code) DO UPDATE SET
           name = EXCLUDED.name,
           district = EXCLUDED.district`,
          [ppd.code, ppd.name, ppd.district]
        );
      }

      // Insert sample Schools data
      const schoolsData = [
        { code: 'SMK001', name: 'SMK Taman Johor Jaya', ppd_code: 'PPD_JB', principal: 'Puan Siti Aminah', student_count: 850, teacher_count: 45 },
        { code: 'SMK002', name: 'SMK Bandar Baru UDA', ppd_code: 'PPD_JB', principal: 'Encik Ahmad Rahman', student_count: 920, teacher_count: 52 },
        { code: 'SMK003', name: 'SMK Kluang', ppd_code: 'PPD_KL', principal: 'Puan Noraini Hassan', student_count: 780, teacher_count: 38 },
        { code: 'SMK004', name: 'SMK Simpang Renggam', ppd_code: 'PPD_KL', principal: 'Encik Mohd Farid', student_count: 650, teacher_count: 32 },
        { code: 'SMK005', name: 'SMK Batu Pahat', ppd_code: 'PPD_BP', principal: 'Puan Rozita Ahmad', student_count: 890, teacher_count: 48 }
      ];

      for (const school of schoolsData) {
        // Get PPD ID
        const ppdResult = await client.query('SELECT id FROM ppd WHERE code = $1', [school.ppd_code]);
        if (ppdResult.rows.length > 0) {
          await client.query(
            `INSERT INTO schools (code, name, ppd_id, principal_name, student_count, teacher_count) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             ON CONFLICT (code) DO UPDATE SET
             name = EXCLUDED.name,
             ppd_id = EXCLUDED.ppd_id,
             principal_name = EXCLUDED.principal_name,
             student_count = EXCLUDED.student_count,
             teacher_count = EXCLUDED.teacher_count`,
            [school.code, school.name, ppdResult.rows[0].id, school.principal, school.student_count, school.teacher_count]
          );
        }
      }

      // Update existing users with hierarchical data
      const userUpdates = [
        { email: 'ppd.jb@jpnj.gov.my', ppd_code: 'PPD_JB', specialization: 'District Administration' },
        { email: 'school.demo@jpnj.gov.my', school_code: 'SMK001', specialization: 'School Administration' },
        { email: 'teacher.math@jpnj.gov.my', school_code: 'SMK001', subject: 'Mathematics', specialization: 'Additional Mathematics' },
        { email: 'sisc.math@jpnj.gov.my', ppd_code: 'PPD_KL', subject: 'Mathematics', specialization: 'SISC+ Mathematics' }
      ];

      for (const update of userUpdates) {
        let updateQuery = 'UPDATE users SET ';
        let updateValues = [];
        let valueIndex = 1;

        if (update.ppd_code) {
          const ppdResult = await client.query('SELECT id FROM ppd WHERE code = $1', [update.ppd_code]);
          if (ppdResult.rows.length > 0) {
            updateQuery += `ppd_id = $${valueIndex}, `;
            updateValues.push(ppdResult.rows[0].id);
            valueIndex++;
          }
        }

        if (update.school_code) {
          const schoolResult = await client.query('SELECT id FROM schools WHERE code = $1', [update.school_code]);
          if (schoolResult.rows.length > 0) {
            updateQuery += `school_id = $${valueIndex}, `;
            updateValues.push(schoolResult.rows[0].id);
            valueIndex++;
          }
        }

        if (update.subject) {
          updateQuery += `subject = $${valueIndex}, `;
          updateValues.push(update.subject);
          valueIndex++;
        }

        if (update.specialization) {
          updateQuery += `specialization = $${valueIndex}, `;
          updateValues.push(update.specialization);
          valueIndex++;
        }

        // Remove trailing comma and add WHERE clause
        updateQuery = updateQuery.slice(0, -2) + ` WHERE email = $${valueIndex}`;
        updateValues.push(update.email);

        if (updateValues.length > 1) {
          await client.query(updateQuery, updateValues);
        }
      }

      // Add foreign key constraints after data is inserted
      try {
        await client.query(`
          ALTER TABLE users 
          ADD CONSTRAINT fk_users_ppd 
          FOREIGN KEY (ppd_id) REFERENCES ppd(id) ON DELETE SET NULL
        `);
      } catch (fkError) {
        console.log('PPD foreign key constraint already exists or failed:', fkError.message);
      }

      try {
        await client.query(`
          ALTER TABLE users 
          ADD CONSTRAINT fk_users_school 
          FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE SET NULL
        `);
      } catch (fkError) {
        console.log('School foreign key constraint already exists or failed:', fkError.message);
      }

      // Insert sample students data
      const studentsData = [
        { ic: '051234567890', name: 'Ahmad Bin Abdullah', school_code: 'SMK001', class_level: 'Form 4', class_name: '4 Bestari', gender: 'Male', race: 'Malay' },
        { ic: '051234567891', name: 'Siti Nurhaliza Binti Hassan', school_code: 'SMK001', class_level: 'Form 4', class_name: '4 Bestari', gender: 'Female', race: 'Malay' },
        { ic: '051234567892', name: 'Lim Wei Ming', school_code: 'SMK001', class_level: 'Form 4', class_name: '4 Cemerlang', gender: 'Male', race: 'Chinese' },
        { ic: '051234567893', name: 'Priya A/P Raman', school_code: 'SMK003', class_level: 'Form 4', class_name: '4 Bijak', gender: 'Female', race: 'Indian' },
        { ic: '051234567894', name: 'Muhammad Faiz Bin Omar', school_code: 'SMK003', class_level: 'Form 4', class_name: '4 Bijak', gender: 'Male', race: 'Malay' }
      ];

      for (const student of studentsData) {
        const schoolResult = await client.query('SELECT id FROM schools WHERE code = $1', [student.school_code]);
        if (schoolResult.rows.length > 0) {
          await client.query(
            `INSERT INTO students (ic_number, name, school_id, class_level, class_name, gender, race) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) 
             ON CONFLICT (ic_number) DO UPDATE SET
             name = EXCLUDED.name,
             school_id = EXCLUDED.school_id,
             class_level = EXCLUDED.class_level,
             class_name = EXCLUDED.class_name`,
            [student.ic, student.name, schoolResult.rows[0].id, student.class_level, student.class_name, student.gender, student.race]
          );
        }
      }

      client.release();
      await pool.end();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Hierarchical schema setup completed',
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