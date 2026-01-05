import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import { findUserByEmail, validatePassword } from '@/lib/demo-auth';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { status: 'error', error: 'Email dan kata laluan diperlukan' },
        { status: 400 }
      );
    }

    // Try database authentication first
    try {
      const client = await pool.connect();
      
      try {
        const userQuery = `
          SELECT u.*, s.name as school_name, p.name as ppd_name 
          FROM users u
          LEFT JOIN schools s ON u.school_id = s.id
          LEFT JOIN ppds p ON u.ppd_id = p.id
          WHERE u.email = $1 AND u.is_active = true
        `;
        
        const result = await client.query(userQuery, [email.toLowerCase()]);
        
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const isValidPassword = await bcrypt.compare(password, user.password_hash);
          
          if (isValidPassword) {
            // Remove sensitive data
            const { password_hash, ...userWithoutPassword } = user;

            // Log successful login
            await client.query(
              'INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES ($1, $2, $3, $4)',
              [
                user.id,
                'LOGIN',
                `User logged in successfully`,
                request.headers.get('x-forwarded-for') || 'localhost'
              ]
            );

            return NextResponse.json({
              status: 'success',
              user: userWithoutPassword,
              message: 'Login berjaya (Database)',
              source: 'database'
            });
          }
        }
      } finally {
        client.release();
      }
    } catch (dbError) {
      console.log('Database not available, falling back to demo auth:', dbError);
    }

    // Fallback to demo authentication
    const demoUser = findUserByEmail(email);
    
    if (!demoUser) {
      return NextResponse.json(
        { status: 'error', error: 'Email atau kata laluan tidak sah' },
        { status: 401 }
      );
    }

    if (!validatePassword(demoUser, password)) {
      return NextResponse.json(
        { status: 'error', error: 'Email atau kata laluan tidak sah' },
        { status: 401 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = demoUser;

    return NextResponse.json({
      status: 'success',
      user: userWithoutPassword,
      message: 'Login berjaya (Demo Mode)',
      source: 'demo'
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { status: 'error', error: 'Ralat sistem. Sila cuba lagi.' },
      { status: 500 }
    );
  }
}