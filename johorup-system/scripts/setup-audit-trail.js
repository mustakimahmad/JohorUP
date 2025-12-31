// Setup Audit Trail Database Schema
// Run this script to initialize audit trail tables in your database

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupAuditTrail() {
  console.log('🚀 JohorUP Audit Trail Setup');
  console.log('============================');
  
  try {
    // Database connection
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
    });

    console.log('📡 Connecting to database...');
    
    // Test connection
    const testResult = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Database connected successfully');
    console.log(`   Current time: ${testResult.rows[0].current_time}`);

    // Read and execute audit schema
    console.log('\n📋 Setting up audit trail schema...');
    const schemaPath = path.join(__dirname, '..', 'database', 'audit_schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split SQL into individual statements
    const statements = schemaSql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`   Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await pool.query(statement);
          console.log(`   ✅ Statement ${i + 1}/${statements.length} executed`);
        } catch (error) {
          // Some statements might fail if objects already exist - that's okay
          if (error.message.includes('already exists')) {
            console.log(`   ⚠️  Statement ${i + 1}/${statements.length} skipped (already exists)`);
          } else {
            console.error(`   ❌ Statement ${i + 1}/${statements.length} failed:`, error.message);
          }
        }
      }
    }

    // Verify tables were created
    console.log('\n🔍 Verifying audit trail tables...');
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('audit_logs', 'login_attempts', 'system_events', 'data_changes', 'security_events')
      ORDER BY table_name
    `);

    const expectedTables = ['audit_logs', 'data_changes', 'login_attempts', 'security_events', 'system_events'];
    const actualTables = tablesResult.rows.map(row => row.table_name);

    expectedTables.forEach(table => {
      if (actualTables.includes(table)) {
        console.log(`   ✅ Table '${table}' created successfully`);
      } else {
        console.log(`   ❌ Table '${table}' missing`);
      }
    });

    // Check indexes
    console.log('\n📊 Verifying indexes...');
    const indexesResult = await pool.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename IN ('audit_logs', 'login_attempts', 'system_events', 'data_changes', 'security_events')
      AND indexname LIKE 'idx_%'
      ORDER BY indexname
    `);

    console.log(`   ✅ ${indexesResult.rows.length} indexes created for performance`);

    // Check views
    console.log('\n👁️  Verifying views...');
    const viewsResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.views 
      WHERE table_schema = 'public' 
      AND table_name IN ('recent_audit_activities', 'failed_login_attempts', 'system_health_summary')
      ORDER BY table_name
    `);

    console.log(`   ✅ ${viewsResult.rows.length} audit views created`);

    // Check functions
    console.log('\n⚙️  Verifying functions...');
    const functionsResult = await pool.query(`
      SELECT routine_name 
      FROM information_schema.routines 
      WHERE routine_schema = 'public' 
      AND routine_name IN ('log_audit_entry', 'cleanup_old_audit_logs', 'audit_users_changes')
      ORDER BY routine_name
    `);

    console.log(`   ✅ ${functionsResult.rows.length} audit functions created`);

    // Insert initial system event
    console.log('\n📝 Logging initial system event...');
    await pool.query(`
      INSERT INTO system_events (event_type, description, initiated_by_email, status, details)
      VALUES (
        'AUDIT_SYSTEM_INIT',
        'Audit trail system initialized successfully',
        'system@jpnj.gov.my',
        'COMPLETED',
        $1
      )
    `, [JSON.stringify({
      version: '1.0',
      tables_created: actualTables.length,
      indexes_created: indexesResult.rows.length,
      views_created: viewsResult.rows.length,
      functions_created: functionsResult.rows.length,
      setup_date: new Date().toISOString()
    })]);

    // Test audit logging
    console.log('\n🧪 Testing audit logging...');
    const testAuditResult = await pool.query(`
      SELECT log_audit_entry(
        1,
        'admin@jpnj.gov.my',
        'Admin JPNJ',
        'admin',
        'SYSTEM_CONFIG_CHANGE',
        'audit_logs',
        NULL,
        NULL,
        '{"test": "audit_setup"}',
        '127.0.0.1',
        'Setup Script',
        'setup_session',
        '{"test_mode": true}'
      ) as audit_id
    `);

    console.log(`   ✅ Test audit log created with ID: ${testAuditResult.rows[0].audit_id}`);

    // Display summary
    console.log('\n🎉 Audit Trail Setup Complete!');
    console.log('================================');
    console.log(`✅ Tables: ${actualTables.length}/${expectedTables.length}`);
    console.log(`✅ Indexes: ${indexesResult.rows.length}`);
    console.log(`✅ Views: ${viewsResult.rows.length}`);
    console.log(`✅ Functions: ${functionsResult.rows.length}`);
    console.log('✅ Test logging: Successful');

    console.log('\n📋 Next Steps:');
    console.log('1. Update your application to use AuditService');
    console.log('2. Test audit logging in development');
    console.log('3. Configure data retention policies');
    console.log('4. Set up monitoring and alerts');
    console.log('5. Train admin users on audit dashboard');

    console.log('\n🔗 Access Points:');
    console.log('• Audit Dashboard: /dashboard/admin/audit-trail');
    console.log('• API Endpoints: /api/audit/*');
    console.log('• Database Views: recent_audit_activities, failed_login_attempts');

    await pool.end();

  } catch (error) {
    console.error('\n❌ Audit trail setup failed:', error);
    console.error('\nError details:', error.message);
    
    if (error.message.includes('connect')) {
      console.error('\n💡 Troubleshooting:');
      console.error('1. Check DATABASE_URL environment variable');
      console.error('2. Ensure database is running and accessible');
      console.error('3. Verify SSL settings (DATABASE_SSL)');
    }
    
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  setupAuditTrail();
}

module.exports = { setupAuditTrail };