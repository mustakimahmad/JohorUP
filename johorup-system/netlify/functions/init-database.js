// Initialize database schema and data
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

    let Pool;
    try {
      const pg = require('pg');
      Pool = pg.Pool;
    } catch (pgError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          error: 'pg package not available'
        })
      };
    }

    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();

    try {
      // Drop existing tables if they exist (to avoid foreign key conflicts)
      await client.query(`DROP TABLE IF EXISTS audit_logs CASCADE`);
      await client.query(`DROP TABLE IF EXISTS users CASCADE`);

      // Create users table first
      await client.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(100) NOT NULL,
          level VARCHAR(100) NOT NULL,
          sector VARCHAR(100) NOT NULL,
          status VARCHAR(50) DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Insert demo users
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
          name: 'Sekolah Demo',
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

      let insertedUsers = 0;
      for (const user of users) {
        try {
          await client.query(
            `INSERT INTO users (name, email, password, role, level, sector) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [user.name, user.email, user.password, user.role, user.level, user.sector]
          );
          insertedUsers++;
        } catch (userError) {
          console.log(`Error inserting user ${user.email}:`, userError.message);
        }
      }

      // Create audit logs table AFTER users are inserted
      await client.query(`
        CREATE TABLE audit_logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID,
          action VARCHAR(100) NOT NULL,
          resource VARCHAR(100) NOT NULL,
          details JSONB,
          ip_address INET,
          user_agent TEXT,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        )
      `);

      // Create initial audit log
      const adminUser = await client.query(
        `SELECT id FROM users WHERE email = 'admin@s4pd.gov.my' LIMIT 1`
      );
      
      if (adminUser.rows.length > 0) {
        await client.query(
          `INSERT INTO audit_logs (user_id, action, resource, details) 
           VALUES ($1, 'SYSTEM_SETUP', 'DATABASE', $2)`,
          [
            adminUser.rows[0].id,
            JSON.stringify({
              message: "Database initialized successfully",
              timestamp: new Date().toISOString(),
              usersCreated: insertedUsers
            })
          ]
        );
      }

      client.release();
      await pool.end();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Database initialized successfully',
          usersCreated: insertedUsers,
          tablesCreated: ['users', 'audit_logs'],
          timestamp: new Date().toISOString()
        })
      };

    } catch (dbError) {
      client.release();
      await pool.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Database initialization error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        message: 'Database initialization failed',
        timestamp: new Date().toISOString()
      })
    };
  }
};