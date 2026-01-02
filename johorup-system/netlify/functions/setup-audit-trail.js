// Setup comprehensive audit trail system
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          error: 'Database URL not configured'
        })
      };
    }

    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false }
    });

    const client = await pool.connect();

    try {
      // Drop existing audit tables if they exist
      await client.query(`DROP TABLE IF EXISTS data_changes CASCADE`);
      await client.query(`DROP TABLE IF EXISTS security_events CASCADE`);
      await client.query(`DROP TABLE IF EXISTS system_events CASCADE`);
      await client.query(`DROP TABLE IF EXISTS login_attempts CASCADE`);
      await client.query(`DROP TABLE IF EXISTS audit_logs CASCADE`);

      // Create comprehensive audit_logs table
      await client.query(`
        CREATE TABLE audit_logs (
          id SERIAL PRIMARY KEY,
          user_id UUID,
          user_email VARCHAR(255) NOT NULL,
          user_name VARCHAR(255),
          user_role VARCHAR(100),
          action VARCHAR(100) NOT NULL,
          table_name VARCHAR(100),
          record_id VARCHAR(100),
          old_values JSONB,
          new_values JSONB,
          ip_address INET,
          user_agent TEXT,
          session_id VARCHAR(255),
          request_url TEXT,
          request_method VARCHAR(10),
          timestamp TIMESTAMP DEFAULT NOW(),
          status VARCHAR(20) DEFAULT 'SUCCESS',
          error_message TEXT,
          additional_info JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create login_attempts table
      await client.query(`
        CREATE TABLE login_attempts (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          ip_address INET,
          user_agent TEXT,
          success BOOLEAN NOT NULL,
          failure_reason VARCHAR(255),
          session_id VARCHAR(255),
          timestamp TIMESTAMP DEFAULT NOW(),
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create system_events table
      await client.query(`
        CREATE TABLE system_events (
          id SERIAL PRIMARY KEY,
          event_type VARCHAR(100) NOT NULL,
          description TEXT NOT NULL,
          initiated_by UUID,
          initiated_by_email VARCHAR(255),
          status VARCHAR(20) NOT NULL DEFAULT 'STARTED',
          start_time TIMESTAMP DEFAULT NOW(),
          end_time TIMESTAMP,
          duration_seconds INTEGER,
          details JSONB,
          error_message TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create security_events table
      await client.query(`
        CREATE TABLE security_events (
          id SERIAL PRIMARY KEY,
          event_type VARCHAR(100) NOT NULL,
          severity VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
          user_email VARCHAR(255),
          ip_address INET,
          user_agent TEXT,
          description TEXT NOT NULL,
          details JSONB,
          resolved BOOLEAN DEFAULT FALSE,
          resolved_by UUID,
          resolved_at TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create indexes for performance
      await client.query(`CREATE INDEX idx_audit_logs_user_email ON audit_logs(user_email)`);
      await client.query(`CREATE INDEX idx_audit_logs_action ON audit_logs(action)`);
      await client.query(`CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp)`);
      await client.query(`CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name)`);
      
      await client.query(`CREATE INDEX idx_login_attempts_email ON login_attempts(email)`);
      await client.query(`CREATE INDEX idx_login_attempts_timestamp ON login_attempts(timestamp)`);
      await client.query(`CREATE INDEX idx_login_attempts_success ON login_attempts(success)`);
      
      await client.query(`CREATE INDEX idx_system_events_type ON system_events(event_type)`);
      await client.query(`CREATE INDEX idx_system_events_status ON system_events(status)`);
      
      await client.query(`CREATE INDEX idx_security_events_type ON security_events(event_type)`);
      await client.query(`CREATE INDEX idx_security_events_severity ON security_events(severity)`);

      // Insert initial system event
      await client.query(`
        INSERT INTO system_events (event_type, description, initiated_by_email, status, details)
        VALUES ($1, $2, $3, $4, $5)
      `, [
        'AUDIT_SYSTEM_SETUP',
        'Comprehensive audit trail system initialized',
        'system@johorup.gov.my',
        'COMPLETED',
        JSON.stringify({
          tables_created: ['audit_logs', 'login_attempts', 'system_events', 'security_events'],
          indexes_created: 10,
          timestamp: new Date().toISOString()
        })
      ]);

      // Insert sample audit log
      await client.query(`
        INSERT INTO audit_logs (user_email, user_name, user_role, action, table_name, new_values, ip_address, status, additional_info)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        'system@johorup.gov.my',
        'System Administrator',
        'system',
        'SYSTEM_INIT',
        'audit_logs',
        JSON.stringify({ message: 'Audit trail system initialized' }),
        '127.0.0.1',
        'SUCCESS',
        JSON.stringify({ setup_version: '2.0', timestamp: new Date().toISOString() })
      ]);

      client.release();
      await pool.end();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Comprehensive audit trail system setup completed',
          tables_created: ['audit_logs', 'login_attempts', 'system_events', 'security_events'],
          indexes_created: 10,
          timestamp: new Date().toISOString()
        })
      };

    } catch (dbError) {
      client.release();
      await pool.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Audit trail setup error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        message: 'Audit trail setup failed'
      })
    };
  }
};