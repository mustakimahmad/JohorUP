#!/usr/bin/env node

/**
 * Test Production Fix
 * This script tests if the production API fix is working
 */

const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testProductionFix() {
  console.log('🧪 Testing Production API Fix...');
  console.log('=====================================');
  
  try {
    const client = await pool.connect();
    
    // Test 1: Basic connection
    console.log('1️⃣ Testing database connection...');
    const connectionTest = await client.query('SELECT NOW() as current_time');
    console.log(`✅ Connection successful: ${connectionTest.rows[0].current_time}`);
    
    // Test 2: Check table structure
    console.log('\n2️⃣ Checking table structure...');
    
    const userColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('📊 Users table columns:');
    userColumns.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}`);
    });
    
    const schoolColumns = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'schools' AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    console.log('\n🏫 Schools table columns:');
    schoolColumns.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type}`);
    });
    
    // Test 3: Test the fixed queries
    console.log('\n3️⃣ Testing fixed API queries...');
    
    // Test query from get-user-hierarchy.js
    console.log('🔍 Testing user hierarchy query...');
    try {
      const hierarchyTest = await client.query(`
        SELECT u.*, s.ppd as ppd_name, s.name as school_name 
        FROM users u
        LEFT JOIN schools s ON u.school_id = s.id
        LIMIT 3
      `);
      console.log(`✅ User hierarchy query successful - ${hierarchyTest.rows.length} rows returned`);
      
      if (hierarchyTest.rows.length > 0) {
        const sample = hierarchyTest.rows[0];
        console.log(`   Sample: ${sample.name} (${sample.role}) - School: ${sample.school_name || 'N/A'}`);
      }
    } catch (error) {
      console.log(`❌ User hierarchy query failed: ${error.message}`);
    }
    
    // Test query for PPD filtering
    console.log('\n🔍 Testing PPD filtering query...');
    try {
      const ppdTest = await client.query(`
        SELECT u.*, s.ppd, s.name as school_name
        FROM users u
        LEFT JOIN schools s ON u.school_id = s.id
        WHERE s.ppd IS NOT NULL
        LIMIT 3
      `);
      console.log(`✅ PPD filtering query successful - ${ppdTest.rows.length} rows returned`);
      
      if (ppdTest.rows.length > 0) {
        const sample = ppdTest.rows[0];
        console.log(`   Sample: ${sample.name} - PPD: ${sample.ppd}`);
      }
    } catch (error) {
      console.log(`❌ PPD filtering query failed: ${error.message}`);
    }
    
    // Test 4: Check data integrity
    console.log('\n4️⃣ Checking data integrity...');
    
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    const schoolCount = await client.query('SELECT COUNT(*) FROM schools');
    const studentCount = await client.query('SELECT COUNT(*) FROM students');
    
    console.log(`👥 Users: ${userCount.rows[0].count}`);
    console.log(`🏫 Schools: ${schoolCount.rows[0].count}`);
    console.log(`🎓 Students: ${studentCount.rows[0].count}`);
    
    // Test 5: Check user roles distribution
    console.log('\n5️⃣ Checking user roles...');
    const roleDistribution = await client.query(`
      SELECT role, COUNT(*) as count
      FROM users 
      GROUP BY role 
      ORDER BY count DESC
    `);
    
    console.log('📊 User role distribution:');
    roleDistribution.rows.forEach(row => {
      console.log(`   - ${row.role}: ${row.count}`);
    });
    
    // Test 6: Check schools with PPD info
    console.log('\n6️⃣ Checking schools PPD information...');
    const schoolPpdInfo = await client.query(`
      SELECT ppd, COUNT(*) as school_count
      FROM schools 
      WHERE ppd IS NOT NULL
      GROUP BY ppd 
      ORDER BY school_count DESC
    `);
    
    if (schoolPpdInfo.rows.length > 0) {
      console.log('🏫 Schools by PPD:');
      schoolPpdInfo.rows.forEach(row => {
        console.log(`   - ${row.ppd}: ${row.school_count} schools`);
      });
    } else {
      console.log('⚠️  No PPD information found in schools table');
    }
    
    client.release();
    
    console.log('\n🎉 Production fix test completed!');
    console.log('\n📋 Summary:');
    console.log('✅ Database connection working');
    console.log('✅ Table structure verified');
    console.log('✅ Fixed queries tested');
    console.log('✅ Data integrity checked');
    
    console.log('\n🚀 Ready for API testing!');
    console.log('Next steps:');
    console.log('1. Deploy the fixed API functions');
    console.log('2. Test login and navigation');
    console.log('3. Verify all modules are accessible');
    
  } catch (error) {
    console.error('❌ Production fix test failed:', error);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check DATABASE_URL is correct');
    console.log('2. Ensure database schema is up to date');
    console.log('3. Run fix-production-schema.js first');
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Check if DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required');
  console.log('💡 Usage: DATABASE_URL="your-neon-connection-string" node scripts/test-production-fix.js');
  process.exit(1);
}

testProductionFix();