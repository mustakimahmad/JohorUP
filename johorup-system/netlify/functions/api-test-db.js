// API endpoint for testing database connection
const { Pool } = require('pg');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
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
    // Use NETLIFY_DATABASE_URL which is configured in environment
    const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          error: 'Database URL not configured',
          message: 'Neither NETLIFY_DATABASE_URL nor DATABASE_URL found',
          availableEnvVars: Object.keys(process.env).filter(key => key.includes('DATABASE')).join(', '),
          timestamp: new Date().toISOString()
        })
      };
    }

    console.log('Attempting database connection...');
    
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000
    });

    const startTime = Date.now();
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    const queryTime = Date.now() - startTime;
    
    await pool.end();

    console.log('Database connection successful');

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
        connectionUsed: 'NETLIFY_DATABASE_URL',
        message: 'Database connection successful!'
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
        code: error.code,
        message: 'Database connection failed',
        environment: process.env.NODE_ENV || 'production',
        timestamp: new Date().toISOString()
      })
    };
  }
};