#!/usr/bin/env node

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
  try {
    const client = await pool.connect();
    
    console.log('=== PRODUCTION DATABASE SCHEMA ===');
    
    // Check all tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('📊 Tables:');
    tables.rows.forEach(row => console.log('  -', row.table_name));
    
    // Check ppds table if exists
    const ppdsExists = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'ppds'
      )
    `);
    
    console.log('\n🔍 PPDs table exists:', ppdsExists.rows[0].exists);
    
    if (ppdsExists.rows[0].exists) {
      const ppdsData = await client.query('SELECT * FROM ppds LIMIT 5');
      console.log('📋 PPDs data:');
      ppdsData.rows.forEach(row => console.log('  -', row));
    }
    
    // Check schools schema
    const schoolsSchema = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'schools' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('\n🏫 Schools table schema:');
    schoolsSchema.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Check users schema
    const usersSchema = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('\n👥 Users table schema:');
    usersSchema.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    client.release();
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();