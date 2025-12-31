import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query(`
      SELECT * FROM audit_logs 
      ORDER BY timestamp DESC 
      LIMIT 100
    `);
    client.release();

    return NextResponse.json({
      success: true,
      logs: result.rows
    });
  } catch (error) {
    console.error('Audit logs fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auditData = await request.json();
    
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO audit_logs (user_id, action, resource, details, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [auditData.user_id, auditData.action, auditData.resource, 
       JSON.stringify(auditData.details), auditData.ip_address, auditData.user_agent]
    );
    client.release();

    return NextResponse.json({
      success: true,
      log: result.rows[0]
    });
  } catch (error) {
    console.error('Audit log creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}