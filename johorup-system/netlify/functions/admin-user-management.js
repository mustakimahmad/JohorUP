// Admin User Management API - CRUD operations with hierarchy
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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
      const { action, adminEmail, adminRole } = JSON.parse(event.body || '{}');

      // Verify admin permissions
      if (!['super_admin_s4pd', 'admin_spb', 'admin_spm'].includes(adminRole)) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({
            status: 'error',
            error: 'Insufficient permissions for user management'
          })
        };
      }

      switch (action) {
        case 'list_all_users':
          return await listAllUsers(client, headers);
        
        case 'get_hierarchy_options':
          return await getHierarchyOptions(client, headers);
        
        case 'create_user':
          const { userData } = JSON.parse(event.body);
          return await createUser(client, headers, userData, adminEmail);
        
        case 'update_user':
          const { userId, updateData } = JSON.parse(event.body);
          return await updateUser(client, headers, userId, updateData, adminEmail);
        
        case 'delete_user':
          const { userIdToDelete } = JSON.parse(event.body);
          return await deleteUser(client, headers, userIdToDelete, adminEmail);
        
        case 'assign_hierarchy':
          const { userIdToAssign, hierarchyData } = JSON.parse(event.body);
          return await assignHierarchy(client, headers, userIdToAssign, hierarchyData, adminEmail);
        
        default:
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              status: 'error',
              error: 'Invalid action'
            })
          };
      }

    } catch (dbError) {
      client.release();
      await pool.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Admin user management error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        message: 'User management operation failed'
      })
    };
  }
};

// List all users with hierarchy information
async function listAllUsers(client, headers) {
  const result = await client.query(`
    SELECT 
      u.id, u.name, u.email, u.role, u.level, u.sector, u.status,
      u.subject, u.specialization, u.created_at,
      p.name as ppd_name, p.code as ppd_code,
      s.name as school_name, s.code as school_code
    FROM users u
    LEFT JOIN schools s ON u.school_id = s.id
    LEFT JOIN ppd p ON s.ppd_id = p.id
    ORDER BY u.created_at DESC
  `);

  client.release();
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      users: result.rows,
      total: result.rows.length
    })
  };
}

// Get hierarchy options (PPD, Schools) for dropdowns
async function getHierarchyOptions(client, headers) {
  const ppdResult = await client.query('SELECT id, code, name, district FROM ppd ORDER BY name');
  const schoolsResult = await client.query(`
    SELECT s.id, s.code, s.name, s.ppd_id, p.name as ppd_name 
    FROM schools s 
    LEFT JOIN ppd p ON s.ppd_id = p.id 
    ORDER BY s.name
  `);

  client.release();
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      ppd: ppdResult.rows,
      schools: schoolsResult.rows,
      roles: [
        { value: 'super_admin_s4pd', label: 'Super Admin S4PD', level: 'Super Admin' },
        { value: 'admin_spb', label: 'Admin SPB', level: 'Admin' },
        { value: 'admin_spm', label: 'Admin SPM', level: 'Admin' },
        { value: 'strategic_jcorp', label: 'Strategic JCorp', level: 'Strategic Viewer' },
        { value: 'strategic_hasanah', label: 'Strategic Hasanah', level: 'Strategic Viewer' },
        { value: 'tactical_ppd', label: 'PPD User', level: 'Tactical User' },
        { value: 'coaching_sisc', label: 'SISC+ User', level: 'Coaching User' },
        { value: 'operational_school', label: 'School Admin', level: 'Operational User' },
        { value: 'operational_teacher', label: 'Teacher', level: 'Operational User' }
      ],
      subjects: ['Mathematics', 'Science', 'English', 'Bahasa Malaysia', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology']
    })
  };
}

// Create new user
async function createUser(client, headers, userData, adminEmail) {
  const { name, email, password, role, level, sector, ppd_id, school_id, subject, specialization } = userData;

  // Check if email already exists
  const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    client.release();
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: 'Email already exists'
      })
    };
  }

  // Insert new user
  const result = await client.query(`
    INSERT INTO users (name, email, password, role, level, sector, ppd_id, school_id, subject, specialization, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active')
    RETURNING id, name, email, role, level, sector
  `, [name, email, password, role, level, sector, ppd_id || null, school_id || null, subject || null, specialization || null]);

  // Log audit trail
  const adminResult = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
  if (adminResult.rows.length > 0) {
    await client.query(`
      INSERT INTO audit_logs (user_id, action, resource, details)
      VALUES ($1, 'USER_CREATED', 'USER_MANAGEMENT', $2)
    `, [
      adminResult.rows[0].id,
      JSON.stringify({
        created_user: result.rows[0],
        admin_email: adminEmail,
        timestamp: new Date().toISOString()
      })
    ]);
  }

  client.release();
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      message: 'User created successfully',
      user: result.rows[0]
    })
  };
}

// Update existing user
async function updateUser(client, headers, userId, updateData, adminEmail) {
  const { name, email, role, level, sector, ppd_id, school_id, subject, specialization, status } = updateData;

  // Get role data to auto-populate level if not provided
  let finalLevel = level;
  let finalSector = sector;
  
  if (!finalLevel && role) {
    const roleMapping = {
      'super_admin_s4pd': 'Super Admin',
      'admin_spb': 'Admin',
      'admin_spm': 'Admin',
      'strategic_jcorp': 'Strategic Viewer',
      'strategic_hasanah': 'Strategic Viewer',
      'tactical_ppd': 'Tactical User',
      'coaching_sisc': 'Coaching User',
      'operational_school': 'Operational User',
      'operational_teacher': 'Operational User'
    };
    finalLevel = roleMapping[role] || 'User';
  }
  
  if (!finalSector && role) {
    const sectorMapping = {
      'super_admin_s4pd': 'S4PD',
      'admin_spb': 'SPB',
      'admin_spm': 'SPM',
      'strategic_jcorp': 'JCORP',
      'strategic_hasanah': 'HASANAH',
      'tactical_ppd': 'PPD',
      'coaching_sisc': 'SISC',
      'operational_school': 'SCHOOL',
      'operational_teacher': 'TEACHER'
    };
    finalSector = sectorMapping[role] || 'GENERAL';
  }

  const result = await client.query(`
    UPDATE users 
    SET name = $1, email = $2, role = $3, level = $4, sector = $5, 
        ppd_id = $6, school_id = $7, subject = $8, specialization = $9, status = $10,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $11
    RETURNING id, name, email, role, level, sector, status
  `, [name, email, role, finalLevel, finalSector, ppd_id || null, school_id || null, subject || null, specialization || null, status, userId]);

  if (result.rows.length === 0) {
    client.release();
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: 'User not found'
      })
    };
  }

  // Log audit trail
  const adminResult = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
  if (adminResult.rows.length > 0) {
    await client.query(`
      INSERT INTO audit_logs (user_id, action, resource, details)
      VALUES ($1, 'USER_UPDATED', 'USER_MANAGEMENT', $2)
    `, [
      adminResult.rows[0].id,
      JSON.stringify({
        updated_user: result.rows[0],
        admin_email: adminEmail,
        timestamp: new Date().toISOString()
      })
    ]);
  }

  client.release();
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      message: 'User updated successfully',
      user: result.rows[0]
    })
  };
}

// Delete user (soft delete - set status to inactive)
async function deleteUser(client, headers, userIdToDelete, adminEmail) {
  const result = await client.query(`
    UPDATE users 
    SET status = 'inactive', updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id, name, email, role
  `, [userIdToDelete]);

  if (result.rows.length === 0) {
    client.release();
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: 'User not found'
      })
    };
  }

  // Log audit trail
  const adminResult = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
  if (adminResult.rows.length > 0) {
    await client.query(`
      INSERT INTO audit_logs (user_id, action, resource, details)
      VALUES ($1, 'USER_DELETED', 'USER_MANAGEMENT', $2)
    `, [
      adminResult.rows[0].id,
      JSON.stringify({
        deleted_user: result.rows[0],
        admin_email: adminEmail,
        timestamp: new Date().toISOString()
      })
    ]);
  }

  client.release();
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      message: 'User deleted successfully'
    })
  };
}

// Assign hierarchy (PPD/School) to user
async function assignHierarchy(client, headers, userIdToAssign, hierarchyData, adminEmail) {
  const { ppd_id, school_id, subject, specialization } = hierarchyData;

  const result = await client.query(`
    UPDATE users 
    SET ppd_id = $1, school_id = $2, subject = $3, specialization = $4, updated_at = CURRENT_TIMESTAMP
    WHERE id = $5
    RETURNING id, name, email, role
  `, [ppd_id || null, school_id || null, subject || null, specialization || null, userIdToAssign]);

  if (result.rows.length === 0) {
    client.release();
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: 'User not found'
      })
    };
  }

  // Log audit trail
  const adminResult = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
  if (adminResult.rows.length > 0) {
    await client.query(`
      INSERT INTO audit_logs (user_id, action, resource, details)
      VALUES ($1, 'HIERARCHY_ASSIGNED', 'USER_MANAGEMENT', $2)
    `, [
      adminResult.rows[0].id,
      JSON.stringify({
        assigned_user: result.rows[0],
        hierarchy_data: hierarchyData,
        admin_email: adminEmail,
        timestamp: new Date().toISOString()
      })
    ]);
  }

  client.release();
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: 'success',
      message: 'Hierarchy assigned successfully'
    })
  };
}