// Test Neon database connection
const { Pool } = require('pg');

async function testConnection() {
  console.log('🔍 Testing Neon Database Connection...');
  console.log('====================================');
  
  // Check if DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    console.log('❌ DATABASE_URL environment variable not found');
    console.log('💡 You need to set DATABASE_URL to connect to Neon');
    console.log('💡 Format: postgresql://username:password@host:port/database?sslmode=require');
    return false;
  }
  
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    console.log('🔗 Attempting to connect to Neon...');
    const startTime = Date.now();
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    const queryTime = Date.now() - startTime;
    
    console.log('✅ Connection successful!');
    console.log(`📅 Server time: ${result.rows[0].current_time}`);
    console.log(`🐘 PostgreSQL version: ${result.rows[0].pg_version}`);
    console.log(`⚡ Query time: ${queryTime}ms`);
    
    // Test if tables exist
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📊 Existing tables:');
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    } else {
      console.log('   No tables found - database needs setup');
    }
    
    // Check if we have data
    try {
      const schoolsCount = await pool.query('SELECT COUNT(*) FROM schools');
      const studentsCount = await pool.query('SELECT COUNT(*) FROM students');
      
      console.log('\n📈 Current data:');
      console.log(`   Schools: ${schoolsCount.rows[0].count}`);
      console.log(`   Students: ${studentsCount.rows[0].count}`);
    } catch (error) {
      console.log('\n⚠️  Tables exist but may be empty or need setup');
    }
    
    await pool.end();
    return true;
    
  } catch (error) {
    console.log('❌ Connection failed!');
    console.log(`Error: ${error.message}`);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('💡 Check your DATABASE_URL hostname');
    } else if (error.message.includes('authentication')) {
      console.log('💡 Check your DATABASE_URL username/password');
    } else if (error.message.includes('SSL')) {
      console.log('💡 SSL connection issue - check Neon SSL settings');
    }
    
    return false;
  }
}

// Run test
testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Database connection ready for import!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: node scripts/import-real-data.js');
    console.log('2. Import your real schools and students data');
  } else {
    console.log('\n💡 Fix connection issues before importing data');
  }
});