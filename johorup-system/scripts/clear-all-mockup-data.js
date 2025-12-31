const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/johorup_db"
});

async function clearMockupData() {
  const client = await pool.connect();
  
  try {
    console.log('🧹 Memulakan pembersihan data mockup...');
    
    // Read and execute the SQL script
    const sqlScript = fs.readFileSync(path.join(__dirname, 'clear-mock-data.sql'), 'utf8');
    
    // Split by statements and execute each
    const statements = sqlScript.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.trim().substring(0, 50)}...`);
        await client.query(statement);
      }
    }
    
    console.log('✅ Data mockup telah dibersihkan dengan jayanya!');
    console.log('📊 Memeriksa data yang tinggal...');
    
    // Check remaining data
    const result = await client.query(`
      SELECT 'PPDs' as table_name, COUNT(*) as record_count FROM ppds
      UNION ALL
      SELECT 'Schools', COUNT(*) FROM schools
      UNION ALL
      SELECT 'Users', COUNT(*) FROM users
      UNION ALL
      SELECT 'Students', COUNT(*) FROM students
      UNION ALL
      SELECT 'Teachers', COUNT(*) FROM teachers
      UNION ALL
      SELECT 'Programs', COUNT(*) FROM programs
    `);
    
    console.log('\n📋 Ringkasan data selepas pembersihan:');
    result.rows.forEach(row => {
      console.log(`${row.table_name}: ${row.record_count} rekod`);
    });
    
  } catch (error) {
    console.error('❌ Ralat semasa membersihkan data:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the cleanup
clearMockupData()
  .then(() => {
    console.log('\n🎉 Pembersihan selesai! Anda boleh log masuk dengan:');
    console.log('Email: admin@jpnj.gov.my');
    console.log('Password: admin123');
    console.log('\nAtau:');
    console.log('Email: koordinator@jpnj.gov.my');
    console.log('Password: admin123');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Pembersihan gagal:', error);
    process.exit(1);
  });