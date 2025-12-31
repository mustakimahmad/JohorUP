import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM users ORDER BY created_at DESC');
    client.release();

    return NextResponse.json({
      success: true,
      users: result.rows
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO users (name, email, password, role, level, sector, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [userData.name, userData.email, userData.password, userData.role, 
       userData.level, userData.sector, userData.status || 'active']
    );
    client.release();

    return NextResponse.json({
      success: true,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}