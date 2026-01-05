import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

export async function GET() {
  try {
    const client = await pool.connect();
    
    try {
      // Test basic connection
      const result = await client.query('SELECT NOW() as current_time, version() as db_version');
      
      // Test if users table exists
      const tableCheck = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('users', 'schools', 'ppds', 'audit_logs')
      `);
      
      const tables = tableCheck.rows.map(row => row.table_name);
      
      return NextResponse.json({
        status: 'success',
        message: 'Database connection successful',
        data: {
          current_time: result.rows[0].current_time,
          database_version: result.rows[0].db_version,
          available_tables: tables,
          ssl_enabled: process.env.DATABASE_SSL === 'true',
          connection_string: process.env.DATABASE_URL ? 'configured' : 'not configured'
        }
      });
      
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Database connection failed - using demo mode',
        error: error instanceof Error ? error.message : 'Unknown error',
        fallback: 'Demo authentication is available',
        connection_string: process.env.DATABASE_URL ? 'configured' : 'not configured'
      },
      { status: 200 } // Changed to 200 since demo mode is acceptable
    );
  }
}