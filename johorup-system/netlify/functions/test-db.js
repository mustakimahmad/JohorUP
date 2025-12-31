// Netlify Function to test database connection
const { Pool } = require('pg');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Use NETLIFY_DATABASE_URL which is already configured
    const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          error: 'Database URL not configured',
          message: 'Neither NETLIFY_DATABASE_URL nor DATABASE_URL found',
          availableEnvVars: Object.keys(process.env).filter(key => key.includes('DATABASE')).join(', ')
        })
      };
    }

    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    const startTime = Date.now();
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    const queryTime = Date.now() - startTime;
    
    await pool.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'connected',
        timestamp: result.rows[0].current_time,
        version: result.rows[0].pg_version,
        queryTime: `${queryTime}ms`,
        environment: process.env.NODE_ENV || 'production',
        database: 'Neon PostgreSQL',
        connectionUsed: databaseUrl ? 'NETLIFY_DATABASE_URL' : 'DATABASE_URL'
      })
    };

  } catch (error) {
    console.error('Database test error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        message: 'Database connection failed',
        environment: process.env.NODE_ENV || 'production'
      })
    };
  }
};