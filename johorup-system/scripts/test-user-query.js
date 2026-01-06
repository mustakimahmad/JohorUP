#!/usr/bin/env node

const { Pool } = require('pg');

async function testUserQuery() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    
    console.log('Testing the exact user query from the API...');
    
    const userResult = await client.query(`
      SELECT u.*, p.name as ppd_name, s.name as school_name 
      FROM users u
      LEFT JOIN schools s ON u.school_id = s.id
      LEFT JOIN ppd p ON s.ppd_id = p.id
      WHERE u.email = $1
    `, ['admin@s4pd.gov.my']);
    
    console.log('✅ User query successful:', userResult.rows[0]);
    
    client.release();
  } catch (e) {
    console.error('❌ User query failed:', e.message);
  } finally {
    await pool.end();
  }
}

testUserQuery();