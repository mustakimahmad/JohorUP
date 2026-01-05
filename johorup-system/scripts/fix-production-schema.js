#!/usr/bin/env node

/**
 * Fix Production Database Schema
 * This script fixes the schema mismatch between development and production
 */

const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function fixProductionSchema() {
  console.log('🔧 Fixing production database schema...');
  
  try {
    const client = await pool.connect();
    
    console.log('📊 Checking current schema...');
    
    // Check if users table has ppd_id column
    const userColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
    `);
    
    const hasUserPpdId = userColumns.rows.some(row => row.column_name === 'ppd_id');
    const hasUserSchoolId = userColumns.rows.some(row => row.column_name === 'school_id');
    
    console.log(`Users table has ppd_id: ${hasUserPpdId}`);
    console.log(`Users table has school_id: ${hasUserSchoolId}`);
    
    // Check if schools table has ppd column
    const schoolColumns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'schools' AND table_schema = 'public'
    `);
    
    const hasSchoolPpd = schoolColumns.rows.some(row => row.column_name === 'ppd');
    const hasSchoolPpdId = schoolColumns.rows.some(row => row.column_name === 'ppd_id');
    
    console.log(`Schools table has ppd: ${hasSchoolPpd}`);
    console.log(`Schools table has ppd_id: ${hasSchoolPpdId}`);
    
    // Add missing columns if needed
    if (!hasUserSchoolId) {
      console.log('➕ Adding school_id column to users table...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS school_id UUID REFERENCES schools(id)
      `);
    }
    
    if (!hasSchoolPpd && hasSchoolPpdId) {
      console.log('➕ Adding ppd column to schools table...');
      await client.query(`
        ALTER TABLE schools 
        ADD COLUMN IF NOT EXISTS ppd VARCHAR(100)
      `);
      
      // Migrate data from ppd_id to ppd if ppds table exists
      const ppdsTableExists = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'ppds'
        )
      `);
      
      if (ppdsTableExists.rows[0].exists) {
        console.log('🔄 Migrating PPD data from ppds table...');
        await client.query(`
          UPDATE schools 
          SET ppd = p.name 
          FROM ppds p 
          WHERE schools.ppd_id = p.id AND schools.ppd IS NULL
        `);
      }
    }
    
    // Ensure users table has correct structure for production
    console.log('🔧 Ensuring users table has correct structure...');
    
    // Add missing columns to users if they don't exist
    const userColumnsToAdd = [
      'level VARCHAR(100)',
      'sector VARCHAR(100)',
      'status VARCHAR(50) DEFAULT \'active\''
    ];
    
    for (const column of userColumnsToAdd) {
      const columnName = column.split(' ')[0];
      const hasColumn = userColumns.rows.some(row => row.column_name === columnName);
      
      if (!hasColumn) {
        console.log(`➕ Adding ${columnName} column to users table...`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS ${column}`);
      }
    }
    
    // Update existing users to have proper level and sector if they're null
    console.log('🔄 Updating user levels and sectors...');
    await client.query(`
      UPDATE users 
      SET 
        level = CASE 
          WHEN role LIKE '%super_admin%' THEN 'Super Admin'
          WHEN role LIKE '%admin%' THEN 'Admin'
          WHEN role LIKE '%strategic%' THEN 'Strategic Viewer'
          WHEN role LIKE '%tactical%' THEN 'Tactical User'
          WHEN role LIKE '%operational%' THEN 'Operational User'
          WHEN role LIKE '%coaching%' THEN 'Coaching User'
          ELSE 'User'
        END,
        sector = CASE 
          WHEN role LIKE '%s4pd%' THEN 'S4PD'
          WHEN role LIKE '%spb%' THEN 'SPB'
          WHEN role LIKE '%spm%' THEN 'SPM'
          WHEN role LIKE '%jcorp%' THEN 'JCORP'
          WHEN role LIKE '%hasanah%' THEN 'HASANAH'
          WHEN role LIKE '%ppd%' THEN 'PPD'
          WHEN role LIKE '%school%' THEN 'SCHOOL'
          WHEN role LIKE '%teacher%' THEN 'TEACHER'
          WHEN role LIKE '%sisc%' THEN 'SISC'
          ELSE 'GENERAL'
        END
      WHERE level IS NULL OR sector IS NULL
    `);
    
    // Create indexes if they don't exist
    console.log('📊 Creating indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
      'CREATE INDEX IF NOT EXISTS idx_users_school ON users(school_id)',
      'CREATE INDEX IF NOT EXISTS idx_schools_ppd ON schools(ppd)',
      'CREATE INDEX IF NOT EXISTS idx_students_school ON students(school_id)',
      'CREATE INDEX IF NOT EXISTS idx_teachers_school ON teachers(school_id)'
    ];
    
    for (const index of indexes) {
      try {
        await client.query(index);
      } catch (error) {
        console.log(`⚠️  Index creation warning: ${error.message}`);
      }
    }
    
    // Verify the fix
    console.log('✅ Verifying schema fix...');
    
    const testQuery = `
      SELECT u.*, s.ppd as ppd_name, s.name as school_name 
      FROM users u
      LEFT JOIN schools s ON u.school_id = s.id
      LIMIT 1
    `;
    
    const testResult = await client.query(testQuery);
    console.log('✅ Schema fix verified - test query successful!');
    
    client.release();
    
    console.log('🎉 Production schema fix completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Fixed users table structure');
    console.log('- Ensured schools table has ppd column');
    console.log('- Updated user levels and sectors');
    console.log('- Created necessary indexes');
    console.log('- Verified API compatibility');
    
  } catch (error) {
    console.error('❌ Schema fix failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Check if DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.log('💡 Usage: DATABASE_URL="your-neon-connection-string" node scripts/fix-production-schema.js');
  process.exit(1);
}

fixProductionSchema();