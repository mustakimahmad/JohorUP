// User authentication API
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          error: 'Email and password required'
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
      // Find user by email and password (in production, use hashed passwords)
      const result = await client.query(
        `SELECT id, name, email, role, level, sector, status, created_at 
         FROM users 
         WHERE email = $1 AND password = $2 AND status = 'active'`,
        [email, password]
      );

      if (result.rows.length === 0) {
        // Log failed login attempt
        await client.query(
          `INSERT INTO audit_logs (user_id, action, resource, details, ip_address) 
           VALUES (NULL, 'LOGIN_FAILED', 'AUTH', $1, $2)`,
          [
            JSON.stringify({ email, reason: 'Invalid credentials' }),
            event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown'
          ]
        );

        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({
            status: 'error',
            error: 'Invalid email or password'
          })
        };
      }

      const user = result.rows[0];

      // Log successful login
      await client.query(
        `INSERT INTO audit_logs (user_id, action, resource, details, ip_address, user_agent) 
         VALUES ($1, 'LOGIN_SUCCESS', 'AUTH', $2, $3, $4)`,
        [
          user.id,
          JSON.stringify({ email: user.email, role: user.role }),
          event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown',
          event.headers['user-agent'] || 'unknown'
        ]
      );

      client.release();
      await pool.end();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Login successful',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            level: user.level,
            sector: user.sector,
            loginTime: new Date().toISOString()
          }
        })
      };

    } catch (dbError) {
      client.release();
      await pool.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Login error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        message: 'Login failed'
      })
    };
  }
};