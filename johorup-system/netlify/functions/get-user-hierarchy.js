// Get user hierarchy data based on role and permissions
// Updated: 2026-01-06 - Fixed production schema compatibility
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
    const { userEmail, userRole } = JSON.parse(event.body || '{}');

    if (!userEmail || !userRole) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          error: 'User email and role required'
        })
      };
    }

    const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          error: 'Database not configured'
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
      let hierarchyData = {};

      // Get user details by email
      const userResult = await client.query(
        `SELECT u.*, p.name as ppd_name, s.name as school_name 
         FROM users u
         LEFT JOIN schools s ON u.school_id = s.id
         LEFT JOIN ppd p ON s.ppd_id = p.id
         WHERE u.email = $1`,
        [userEmail]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult.rows[0];
      hierarchyData.user = user;

      // Based on role, get accessible data
      switch (userRole) {
        case 'super_admin_s4pd':
        case 'admin_spb':
        case 'admin_spm':
          // Super admin can see everything
          const allPPD = await client.query('SELECT * FROM ppd ORDER BY name');
          const allSchools = await client.query(`
            SELECT s.*, p.name as ppd_name 
            FROM schools s 
            LEFT JOIN ppd p ON s.ppd_id = p.id 
            ORDER BY s.name
          `);
          const allStudents = await client.query(`
            SELECT st.*, s.name as school_name, p.name as ppd_name
            FROM students st
            LEFT JOIN schools s ON st.school_id = s.id
            LEFT JOIN ppd p ON s.ppd_id = p.id
            ORDER BY st.name
          `);
          const allTeachers = await client.query(`
            SELECT u.*, s.name as school_name, p.name as ppd_name
            FROM users u
            LEFT JOIN schools s ON u.school_id = s.id
            LEFT JOIN ppd p ON s.ppd_id = p.id
            WHERE u.role IN ('operational_teacher', 'coaching_sisc', 'operational_school', 'tactical_ppd')
            ORDER BY u.name
          `);

          hierarchyData.ppd = allPPD.rows;
          hierarchyData.schools = allSchools.rows;
          hierarchyData.students = allStudents.rows;
          hierarchyData.teachers = allTeachers.rows;
          break;

        case 'tactical_ppd':
          // PPD can see schools and students under their PPD
          // For now, since users don't have ppd_id assignments, show all data
          const ppdSchools = await client.query(`
            SELECT s.*, p.name as ppd_name 
            FROM schools s 
            LEFT JOIN ppd p ON s.ppd_id = p.id 
            ORDER BY s.name
          `);

          const ppdStudents = await client.query(`
            SELECT st.*, s.name as school_name, p.name as ppd_name
            FROM students st
            LEFT JOIN schools s ON st.school_id = s.id
            LEFT JOIN ppd p ON s.ppd_id = p.id
            ORDER BY st.name
          `);

          const ppdTeachers = await client.query(`
            SELECT u.*, s.name as school_name, p.name as ppd_name
            FROM users u
            LEFT JOIN schools s ON u.school_id = s.id
            LEFT JOIN ppd p ON s.ppd_id = p.id
            WHERE u.role IN ('operational_teacher', 'coaching_sisc', 'operational_school')
            ORDER BY u.name
          `);

          hierarchyData.schools = ppdSchools.rows;
          hierarchyData.students = ppdStudents.rows;
          hierarchyData.teachers = ppdTeachers.rows;
          break;

        case 'coaching_sisc':
          // SISC+ can see schools and students under their PPD
          // For now, since users don't have ppd_id assignments, show all data
          const siscSchools = await client.query(`
            SELECT s.*, p.name as ppd_name 
            FROM schools s 
            LEFT JOIN ppd p ON s.ppd_id = p.id 
            ORDER BY s.name
          `);

          const siscStudents = await client.query(`
            SELECT st.*, s.name as school_name, p.name as ppd_name
            FROM students st
            LEFT JOIN schools s ON st.school_id = s.id
            LEFT JOIN ppd p ON s.ppd_id = p.id
            ORDER BY st.name
          `);

          const siscTeachers = await client.query(`
            SELECT u.*, s.name as school_name
            FROM users u
            LEFT JOIN schools s ON u.school_id = s.id
            WHERE u.role = 'operational_teacher'
            ORDER BY u.name
          `);

          hierarchyData.schools = siscSchools.rows;
          hierarchyData.students = siscStudents.rows;
          hierarchyData.teachers = siscTeachers.rows;
          break;

        case 'operational_school':
          // School admin can see students and teachers in their school
          if (user.school_id) {
            const schoolStudents = await client.query(`
              SELECT st.*, s.name as school_name
              FROM students st
              LEFT JOIN schools s ON st.school_id = s.id
              WHERE st.school_id = $1
              ORDER BY st.class_level, st.class_name, st.name
            `, [user.school_id]);

            const schoolTeachers = await client.query(`
              SELECT u.*, s.name as school_name
              FROM users u
              LEFT JOIN schools s ON u.school_id = s.id
              WHERE u.school_id = $1 AND u.role = 'operational_teacher'
              ORDER BY u.subject, u.name
            `, [user.school_id]);

            hierarchyData.students = schoolStudents.rows;
            hierarchyData.teachers = schoolTeachers.rows;
          }
          break;

        case 'operational_teacher':
          // Teacher can see students in their school
          if (user.school_id) {
            const teacherStudents = await client.query(`
              SELECT st.*, s.name as school_name
              FROM students st
              LEFT JOIN schools s ON st.school_id = s.id
              WHERE st.school_id = $1
              ORDER BY st.class_level, st.class_name, st.name
            `, [user.school_id]);

            hierarchyData.students = teacherStudents.rows;
          }
          break;

        default:
          // Strategic viewers get summary data only
          const summaryData = await client.query(`
            SELECT 
              COUNT(DISTINCT p.id) as total_ppd,
              COUNT(DISTINCT s.id) as total_schools,
              COUNT(DISTINCT st.id) as total_students,
              COUNT(DISTINCT u.id) as total_teachers
            FROM ppd p
            LEFT JOIN schools s ON p.id = s.ppd_id
            LEFT JOIN students st ON s.id = st.school_id
            LEFT JOIN users u ON (s.id = u.school_id AND u.role = 'operational_teacher')
          `);

          hierarchyData.summary = summaryData.rows[0];
          break;
      }

      client.release();
      await pool.end();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          data: hierarchyData,
          permissions: {
            canViewAll: ['super_admin_s4pd', 'admin_spb', 'admin_spm'].includes(userRole),
            canEditStudents: ['super_admin_s4pd', 'admin_spb', 'admin_spm', 'tactical_ppd', 'coaching_sisc', 'operational_school', 'operational_teacher'].includes(userRole),
            canManageUsers: ['super_admin_s4pd', 'admin_spb', 'admin_spm'].includes(userRole),
            scope: userRole.includes('super_admin') ? 'all' : 
                   userRole.includes('tactical_ppd') ? 'ppd' :
                   userRole.includes('coaching_sisc') ? 'ppd_subject' :
                   userRole.includes('operational_school') ? 'school' :
                   userRole.includes('operational_teacher') ? 'school' : 'summary'
          }
        })
      };

    } catch (dbError) {
      client.release();
      await pool.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Hierarchy data error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        message: 'Failed to get hierarchy data'
      })
    };
  }
};