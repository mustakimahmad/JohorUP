// Helper function to get client IP address
function getClientIP(event) {
  // Get IP from headers
  const forwarded = event.headers['x-forwarded-for'];
  const realIP = event.headers['x-real-ip'];
  const clientIP = event.headers['client-ip'];
  
  // Handle multiple IPs in x-forwarded-for (take first one)
  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim());
    // Return first valid IP (usually client IP)
    for (const ip of ips) {
      if (isValidIP(ip)) {
        return ip;
      }
    }
  }
  
  // Try other headers
  if (realIP && isValidIP(realIP)) return realIP;
  if (clientIP && isValidIP(clientIP)) return clientIP;
  
  // Fallback
  return '127.0.0.1';
}

// Helper function to validate IP address format
function isValidIP(ip) {
  // Basic IPv4 validation
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  // Basic IPv6 validation (simplified)
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  if (ipv4Regex.test(ip)) {
    // Check if each octet is valid (0-255)
    const octets = ip.split('.');
    return octets.every(octet => {
      const num = parseInt(octet, 10);
      return num >= 0 && num <= 255;
    });
  }
  
  // For IPv6, accept if it matches basic pattern
  if (ipv6Regex.test(ip)) {
    return true;
  }
  
  return false;
}

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
          getClientIP(event)
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
          getClientIP(event),
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