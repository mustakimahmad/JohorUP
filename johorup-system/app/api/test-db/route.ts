import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export async function GET() {
  try {
    // Test database connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });

    const startTime = Date.now();
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    const queryTime = Date.now() - startTime;
    
    await pool.end();

    return NextResponse.json({
      status: 'connected',
      timestamp: result.rows[0].current_time,
      version: result.rows[0].pg_version,
      queryTime: `${queryTime}ms`,
      environment: process.env.NODE_ENV,
      database: 'Neon PostgreSQL'
    });

  } catch (error) {
    console.error('Database test error:', error);
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV
    }, { status: 500 });
  }
}