// Get filtered data based on user's hierarchical permissions
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
    const { userEmail, userRole, dataType } = JSON.parse(event.body || '{}');

    if (!userEmail || !userRole || !dataType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          error: 'User email, role, and data type required'
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
      // Get user details first
      const userResult = await client.query(
        `SELECT u.*, p.name as ppd_name, s.name as school_name 
         FROM users u
         LEFT JOIN ppd p ON u.ppd_id = p.id
         LEFT JOIN schools s ON u.school_id = s.id
         WHERE u.email = $1`,
        [userEmail]
      );

      if (userResult.rows.length === 0) {
        throw new Error('User not found');
      }

      const user = userResult.rows[0];
      let data = {};

      // Based on data type and user role, get filtered data
      switch (dataType) {
        case 'students':
          data = await getStudentsData(client, user, userRole);
          break;
        case 'teachers':
          data = await getTeachersData(client, user, userRole);
          break;
        case 'schools':
          data = await getSchoolsData(client, user, userRole);
          break;
        case 'ppd':
          data = await getPPDData(client, user, userRole);
          break;
        case 'dashboard_stats':
          data = await getDashboardStats(client, user, userRole);
          break;
        default:
          throw new Error('Invalid data type');
      }

      client.release();
      await pool.end();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          data,
          user_info: {
            name: user.name,
            role: userRole,
            ppd_name: user.ppd_name,
            school_name: user.school_name,
            subject: user.subject
          }
        })
      };

    } catch (dbError) {
      client.release();
      await pool.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Get user data error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        message: 'Failed to get user data'
      })
    };
  }
};

// Get students data based on user role and hierarchy
async function getStudentsData(client, user, userRole) {
  let query = '';
  let params = [];

  switch (userRole) {
    case 'super_admin_s4pd':
    case 'admin_spb':
    case 'admin_spm':
      // Super admin can see all students
      query = `
        SELECT st.*, s.name as school_name, p.name as ppd_name, p.district
        FROM students st
        LEFT JOIN schools s ON st.school_id = s.id
        LEFT JOIN ppd p ON s.ppd_id = p.id
        ORDER BY st.name
      `;
      break;

    case 'tactical_ppd':
      // PPD can see students in their PPD
      if (user.ppd_id) {
        query = `
          SELECT st.*, s.name as school_name, p.name as ppd_name, p.district
          FROM students st
          LEFT JOIN schools s ON st.school_id = s.id
          LEFT JOIN ppd p ON s.ppd_id = p.id
          WHERE s.ppd_id = $1
          ORDER BY st.name
        `;
        params = [user.ppd_id];
      }
      break;

    case 'coaching_sisc':
      // SISC+ can see students in their PPD
      if (user.ppd_id) {
        query = `
          SELECT st.*, s.name as school_name, p.name as ppd_name, p.district
          FROM students st
          LEFT JOIN schools s ON st.school_id = s.id
          LEFT JOIN ppd p ON s.ppd_id = p.id
          WHERE s.ppd_id = $1
          ORDER BY st.name
        `;
        params = [user.ppd_id];
      }
      break;

    case 'operational_school':
    case 'operational_teacher':
      // School admin and teachers can see students in their school
      if (user.school_id) {
        query = `
          SELECT st.*, s.name as school_name, p.name as ppd_name, p.district
          FROM students st
          LEFT JOIN schools s ON st.school_id = s.id
          LEFT JOIN ppd p ON s.ppd_id = p.id
          WHERE st.school_id = $1
          ORDER BY st.class_level, st.class_name, st.name
        `;
        params = [user.school_id];
      }
      break;

    default:
      // Strategic viewers get summary only
      query = `
        SELECT COUNT(*) as total_students
        FROM students st
        LEFT JOIN schools s ON st.school_id = s.id
      `;
      break;
  }

  if (query) {
    const result = await client.query(query, params);
    return result.rows;
  }
  return [];
}

// Get teachers data based on user role and hierarchy
async function getTeachersData(client, user, userRole) {
  let query = '';
  let params = [];

  switch (userRole) {
    case 'super_admin_s4pd':
    case 'admin_spb':
    case 'admin_spm':
      // Super admin can see all teachers
      query = `
        SELECT u.*, s.name as school_name, p.name as ppd_name
        FROM users u
        LEFT JOIN schools s ON u.school_id = s.id
        LEFT JOIN ppd p ON u.ppd_id = p.id
        WHERE u.role IN ('operational_teacher', 'coaching_sisc', 'operational_school', 'tactical_ppd')
        ORDER BY u.name
      `;
      break;

    case 'tactical_ppd':
      // PPD can see teachers in their PPD
      if (user.ppd_id) {
        query = `
          SELECT u.*, s.name as school_name, p.name as ppd_name
          FROM users u
          LEFT JOIN schools s ON u.school_id = s.id
          LEFT JOIN ppd p ON u.ppd_id = p.id
          WHERE (u.ppd_id = $1 OR s.ppd_id = $1) 
          AND u.role IN ('operational_teacher', 'coaching_sisc', 'operational_school')
          ORDER BY u.name
        `;
        params = [user.ppd_id];
      }
      break;

    case 'coaching_sisc':
      // SISC+ can see teachers in their PPD and subject
      if (user.ppd_id && user.subject) {
        query = `
          SELECT u.*, s.name as school_name, p.name as ppd_name
          FROM users u
          LEFT JOIN schools s ON u.school_id = s.id
          LEFT JOIN ppd p ON u.ppd_id = p.id
          WHERE s.ppd_id = $1 AND u.role = 'operational_teacher' AND u.subject = $2
          ORDER BY u.name
        `;
        params = [user.ppd_id, user.subject];
      }
      break;

    case 'operational_school':
      // School admin can see teachers in their school
      if (user.school_id) {
        query = `
          SELECT u.*, s.name as school_name, p.name as ppd_name
          FROM users u
          LEFT JOIN schools s ON u.school_id = s.id
          LEFT JOIN ppd p ON u.ppd_id = p.id
          WHERE u.school_id = $1 AND u.role = 'operational_teacher'
          ORDER BY u.subject, u.name
        `;
        params = [user.school_id];
      }
      break;

    default:
      // Others get summary only
      query = `
        SELECT COUNT(*) as total_teachers
        FROM users u
        WHERE u.role = 'operational_teacher'
      `;
      break;
  }

  if (query) {
    const result = await client.query(query, params);
    return result.rows;
  }
  return [];
}

// Get schools data based on user role and hierarchy
async function getSchoolsData(client, user, userRole) {
  let query = '';
  let params = [];

  switch (userRole) {
    case 'super_admin_s4pd':
    case 'admin_spb':
    case 'admin_spm':
      // Super admin can see all schools
      query = `
        SELECT s.*, p.name as ppd_name, p.district,
               COUNT(DISTINCT st.id) as student_count,
               COUNT(DISTINCT u.id) as teacher_count
        FROM schools s
        LEFT JOIN ppd p ON s.ppd_id = p.id
        LEFT JOIN students st ON s.id = st.school_id
        LEFT JOIN users u ON s.id = u.school_id AND u.role = 'operational_teacher'
        GROUP BY s.id, p.name, p.district
        ORDER BY s.name
      `;
      break;

    case 'tactical_ppd':
    case 'coaching_sisc':
      // PPD and SISC+ can see schools in their PPD
      if (user.ppd_id) {
        query = `
          SELECT s.*, p.name as ppd_name, p.district,
                 COUNT(DISTINCT st.id) as student_count,
                 COUNT(DISTINCT u.id) as teacher_count
          FROM schools s
          LEFT JOIN ppd p ON s.ppd_id = p.id
          LEFT JOIN students st ON s.id = st.school_id
          LEFT JOIN users u ON s.id = u.school_id AND u.role = 'operational_teacher'
          WHERE s.ppd_id = $1
          GROUP BY s.id, p.name, p.district
          ORDER BY s.name
        `;
        params = [user.ppd_id];
      }
      break;

    case 'operational_school':
      // School admin can see their own school
      if (user.school_id) {
        query = `
          SELECT s.*, p.name as ppd_name, p.district,
                 COUNT(DISTINCT st.id) as student_count,
                 COUNT(DISTINCT u.id) as teacher_count
          FROM schools s
          LEFT JOIN ppd p ON s.ppd_id = p.id
          LEFT JOIN students st ON s.id = st.school_id
          LEFT JOIN users u ON s.id = u.school_id AND u.role = 'operational_teacher'
          WHERE s.id = $1
          GROUP BY s.id, p.name, p.district
        `;
        params = [user.school_id];
      }
      break;

    default:
      // Others get summary only
      query = `
        SELECT COUNT(*) as total_schools
        FROM schools s
      `;
      break;
  }

  if (query) {
    const result = await client.query(query, params);
    return result.rows;
  }
  return [];
}

// Get PPD data based on user role and hierarchy
async function getPPDData(client, user, userRole) {
  let query = '';
  let params = [];

  switch (userRole) {
    case 'super_admin_s4pd':
    case 'admin_spb':
    case 'admin_spm':
      // Super admin can see all PPD
      query = `
        SELECT p.*, 
               COUNT(DISTINCT s.id) as school_count,
               COUNT(DISTINCT st.id) as student_count,
               COUNT(DISTINCT u.id) as teacher_count
        FROM ppd p
        LEFT JOIN schools s ON p.id = s.ppd_id
        LEFT JOIN students st ON s.id = st.school_id
        LEFT JOIN users u ON s.id = u.school_id AND u.role = 'operational_teacher'
        GROUP BY p.id
        ORDER BY p.name
      `;
      break;

    case 'tactical_ppd':
    case 'coaching_sisc':
      // PPD and SISC+ can see their own PPD
      if (user.ppd_id) {
        query = `
          SELECT p.*, 
                 COUNT(DISTINCT s.id) as school_count,
                 COUNT(DISTINCT st.id) as student_count,
                 COUNT(DISTINCT u.id) as teacher_count
          FROM ppd p
          LEFT JOIN schools s ON p.id = s.ppd_id
          LEFT JOIN students st ON s.id = st.school_id
          LEFT JOIN users u ON s.id = u.school_id AND u.role = 'operational_teacher'
          WHERE p.id = $1
          GROUP BY p.id
        `;
        params = [user.ppd_id];
      }
      break;

    default:
      // Others get summary only
      query = `
        SELECT COUNT(*) as total_ppd
        FROM ppd p
      `;
      break;
  }

  if (query) {
    const result = await client.query(query, params);
    return result.rows;
  }
  return [];
}

// Get dashboard statistics based on user role and hierarchy
async function getDashboardStats(client, user, userRole) {
  let stats = {};

  switch (userRole) {
    case 'super_admin_s4pd':
    case 'admin_spb':
    case 'admin_spm':
      // Super admin gets all stats
      const allStats = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM ppd) as total_ppd,
          (SELECT COUNT(*) FROM schools) as total_schools,
          (SELECT COUNT(*) FROM students) as total_students,
          (SELECT COUNT(*) FROM users WHERE role = 'operational_teacher') as total_teachers
      `);
      stats = allStats.rows[0];
      break;

    case 'tactical_ppd':
    case 'coaching_sisc':
      // PPD and SISC+ get their PPD stats
      if (user.ppd_id) {
        const ppdStats = await client.query(`
          SELECT 
            1 as total_ppd,
            COUNT(DISTINCT s.id) as total_schools,
            COUNT(DISTINCT st.id) as total_students,
            COUNT(DISTINCT u.id) as total_teachers
          FROM ppd p
          LEFT JOIN schools s ON p.id = s.ppd_id
          LEFT JOIN students st ON s.id = st.school_id
          LEFT JOIN users u ON s.id = u.school_id AND u.role = 'operational_teacher'
          WHERE p.id = $1
        `, [user.ppd_id]);
        stats = ppdStats.rows[0];
      }
      break;

    case 'operational_school':
    case 'operational_teacher':
      // School admin and teachers get their school stats
      if (user.school_id) {
        const schoolStats = await client.query(`
          SELECT 
            0 as total_ppd,
            1 as total_schools,
            COUNT(DISTINCT st.id) as total_students,
            COUNT(DISTINCT u.id) as total_teachers
          FROM schools s
          LEFT JOIN students st ON s.id = st.school_id
          LEFT JOIN users u ON s.id = u.school_id AND u.role = 'operational_teacher'
          WHERE s.id = $1
        `, [user.school_id]);
        stats = schoolStats.rows[0];
      }
      break;

    default:
      // Strategic viewers get summary stats
      const summaryStats = await client.query(`
        SELECT 
          COUNT(DISTINCT p.id) as total_ppd,
          COUNT(DISTINCT s.id) as total_schools,
          COUNT(DISTINCT st.id) as total_students,
          COUNT(DISTINCT u.id) as total_teachers
        FROM ppd p
        LEFT JOIN schools s ON p.id = s.ppd_id
        LEFT JOIN students st ON s.id = st.school_id
        LEFT JOIN users u ON s.id = u.school_id AND u.role = 'operational_teacher'
      `);
      stats = summaryStats.rows[0];
      break;
  }

  return stats;
}