#!/usr/bin/env node

const { Pool } = require('pg');

async function checkPpdsTable() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    
    // Check for PPD-related tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name LIKE '%ppd%' 
      ORDER BY table_name
    `);
    console.log('PPD-related tables:', tables.rows);
    
    // Check if ppds table exists
    const ppdsExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'ppds'
      )
    `);
    console.log('ppds table exists:', ppdsExists.rows[0].exists);
    
    if (ppdsExists.rows[0].exists) {
      const ppdsStructure = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'ppds' AND table_schema = 'public' 
        ORDER BY ordinal_position
      `);
      console.log('ppds table structure:', ppdsStructure.rows);
      
      const ppdsData = await client.query('SELECT * FROM ppds LIMIT 5');
      console.log('ppds sample data:', ppdsData.rows);
    }
    
    // Check schools table ppd_id relationships
    const schoolPpdCheck = await client.query(`
      SELECT s.ppd_id, s.ppd, COUNT(*) as count
      FROM schools s 
      GROUP BY s.ppd_id, s.ppd
      ORDER BY count DESC
    `);
    console.log('Schools PPD relationships:', schoolPpdCheck.rows);
    
    client.release();
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkPpdsTable();