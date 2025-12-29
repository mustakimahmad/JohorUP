// Netlify Function to import real data to Neon database
const { Pool } = require('pg');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  // Simple authentication check
  const { password } = JSON.parse(event.body || '{}');
  if (password !== 'AdminPass123!') {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }
  
  try {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    // Test connection
    await pool.query('SELECT NOW()');
    
    // Simple data setup (since we can't read Excel files in Netlify Functions easily)
    console.log('Setting up basic data structure...');
    
    // Setup PPDs
    await pool.query(`
      INSERT INTO ppds (name, code) VALUES 
      ('PPD J010', 'J010'),
      ('PPD J020', 'J020'),
      ('PPD J030', 'J030'),
      ('PPD J040', 'J040'),
      ('PPD J050', 'J050'),
      ('PPD J060', 'J060'),
      ('PPD J070', 'J070'),
      ('PPD J080', 'J080'),
      ('PPD J090', 'J090'),
      ('PPD J100', 'J100'),
      ('PPD J110', 'J110')
      ON CONFLICT (code) DO NOTHING
    `);
    
    // Setup subjects
    await pool.query(`
      INSERT INTO subjects (name, code) VALUES 
      ('Bahasa Melayu', 'BM'),
      ('Sejarah', 'SEJ'),
      ('Matematik', 'MAT')
      ON CONFLICT (code) DO NOTHING
    `);
    
    // Create admin users
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('AdminPass123!', 12);
    
    await pool.query(`
      INSERT INTO users (email, name, role, password_hash) VALUES 
      ('admin@jpnj.gov.my', 'Admin JPNJ', 'sektor_perancangan', $1),
      ('koordinator@jpnj.gov.my', 'Koordinator Program', 'sektor_perancangan', $1),
      ('yayasan@jcorp.com.my', 'Yayasan JCorp', 'yayasan_jcorp', $1)
      ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash
    `, [hashedPassword]);
    
    // Get counts
    const schoolsCount = await pool.query('SELECT COUNT(*) FROM schools');
    const studentsCount = await pool.query('SELECT COUNT(*) FROM students');
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    
    await pool.end();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Database setup completed',
        data: {
          schools: schoolsCount.rows[0].count,
          students: studentsCount.rows[0].count,
          users: usersCount.rows[0].count
        }
      })
    };
    
  } catch (error) {
    console.error('Import error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};