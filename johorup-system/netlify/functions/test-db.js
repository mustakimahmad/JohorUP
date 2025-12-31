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
    // Check if DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          error: 'DATABASE_URL environment variable not configured',
          message: 'Please configure DATABASE_URL in Netlify environment variables'
        })
      };
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
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
        database: 'Neon PostgreSQL'
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