// Get audit logs with filtering and pagination
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
          error: 'Database not configured'
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
      // Parse query parameters
      const queryParams = event.queryStringParameters || {};
      const limit = parseInt(queryParams.limit) || 50;
      const offset = parseInt(queryParams.offset) || 0;
      const action = queryParams.action;
      const userEmail = queryParams.user_email;
      const dateFrom = queryParams.date_from;
      const dateTo = queryParams.date_to;

      // Build WHERE clause
      let whereConditions = [];
      let queryValues = [];
      let paramIndex = 1;

      if (action) {
        whereConditions.push(`action = $${paramIndex}`);
        queryValues.push(action);
        paramIndex++;
      }

      if (userEmail) {
        whereConditions.push(`user_email ILIKE $${paramIndex}`);
        queryValues.push(`%${userEmail}%`);
        paramIndex++;
      }

      if (dateFrom) {
        whereConditions.push(`timestamp >= $${paramIndex}`);
        queryValues.push(dateFrom);
        paramIndex++;
      }

      if (dateTo) {
        whereConditions.push(`timestamp <= $${paramIndex}`);
        queryValues.push(dateTo);
        paramIndex++;
      }

      const whereClause = whereConditions.length > 0 
        ? `WHERE ${whereConditions.join(' AND ')}`
        : '';

      // Get audit logs
      const auditQuery = `
        SELECT 
          id, user_email, user_name, user_role, action, table_name, 
          record_id, old_values, new_values, ip_address, user_agent,
          timestamp, status, error_message, additional_info
        FROM audit_logs 
        ${whereClause}
        ORDER BY timestamp DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      queryValues.push(limit, offset);
      const auditResult = await client.query(auditQuery, queryValues);

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM audit_logs 
        ${whereClause}
      `;
      const countResult = await client.query(countQuery, queryValues.slice(0, -2));

      // Get recent login attempts
      const loginAttemptsResult = await client.query(`
        SELECT email, ip_address, success, failure_reason, timestamp
        FROM login_attempts 
        ORDER BY timestamp DESC 
        LIMIT 20
      `);

      // Get system events
      const systemEventsResult = await client.query(`
        SELECT event_type, description, status, start_time, end_time, details
        FROM system_events 
        ORDER BY start_time DESC 
        LIMIT 10
      `);

      // Get audit statistics
      const statsResult = await client.query(`
        SELECT 
          COUNT(*) as total_logs,
          COUNT(CASE WHEN action LIKE '%LOGIN%' THEN 1 END) as login_logs,
          COUNT(CASE WHEN action = 'CREATE' THEN 1 END) as create_logs,
          COUNT(CASE WHEN action = 'UPDATE' THEN 1 END) as update_logs,
          COUNT(CASE WHEN action = 'DELETE' THEN 1 END) as delete_logs,
          COUNT(CASE WHEN status = 'SUCCESS' THEN 1 END) as success_logs,
          COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed_logs
        FROM audit_logs
        WHERE timestamp >= NOW() - INTERVAL '7 days'
      `);

      client.release();
      await pool.end();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          data: {
            audit_logs: auditResult.rows,
            total_count: parseInt(countResult.rows[0].total),
            current_page: Math.floor(offset / limit) + 1,
            total_pages: Math.ceil(parseInt(countResult.rows[0].total) / limit),
            login_attempts: loginAttemptsResult.rows,
            system_events: systemEventsResult.rows,
            statistics: statsResult.rows[0]
          },
          pagination: {
            limit,
            offset,
            has_more: (offset + limit) < parseInt(countResult.rows[0].total)
          },
          timestamp: new Date().toISOString()
        })
      };

    } catch (dbError) {
      client.release();
      await pool.end();
      throw dbError;
    }

  } catch (error) {
    console.error('Get audit logs error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        message: 'Failed to retrieve audit logs'
      })
    };
  }
};