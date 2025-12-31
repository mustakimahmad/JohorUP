// Debug environment variables for database connection
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
    // Get all database-related environment variables
    const dbEnvVars = {};
    const allEnvKeys = Object.keys(process.env);
    
    // Filter for database-related variables
    const dbKeys = allEnvKeys.filter(key => 
      key.includes('DATABASE') || 
      key.includes('NEON') || 
      key.includes('POSTGRES') ||
      key.includes('PG_')
    );

    dbKeys.forEach(key => {
      const value = process.env[key];
      if (value) {
        // Mask password in connection strings for security
        if (value.includes('postgresql://')) {
          const masked = value.replace(/:([^@]+)@/, ':***@');
          dbEnvVars[key] = masked;
        } else {
          dbEnvVars[key] = value.length > 20 ? value.substring(0, 20) + '...' : value;
        }
      }
    });

    // Check if main database URL exists
    const mainDbUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL;
    const hasDbUrl = !!mainDbUrl;
    
    // Parse connection string to check format
    let connectionInfo = null;
    if (mainDbUrl && mainDbUrl.startsWith('postgresql://')) {
      try {
        const url = new URL(mainDbUrl);
        connectionInfo = {
          protocol: url.protocol,
          hostname: url.hostname,
          port: url.port || '5432',
          database: url.pathname.substring(1),
          username: url.username,
          hasPassword: !!url.password,
          searchParams: Object.fromEntries(url.searchParams)
        };
      } catch (parseError) {
        connectionInfo = { error: 'Invalid URL format', message: parseError.message };
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'debug_info',
        hasMainDatabaseUrl: hasDbUrl,
        databaseEnvironmentVariables: dbEnvVars,
        connectionInfo: connectionInfo,
        totalEnvVars: allEnvKeys.length,
        nodeVersion: process.version,
        platform: process.platform,
        timestamp: new Date().toISOString(),
        suggestions: [
          hasDbUrl ? 'Database URL found' : 'No database URL found - check NETLIFY_DATABASE_URL',
          connectionInfo?.hasPassword ? 'Password present in connection string' : 'No password in connection string',
          connectionInfo?.searchParams?.sslmode ? 'SSL mode configured' : 'Consider adding ?sslmode=require'
        ]
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};