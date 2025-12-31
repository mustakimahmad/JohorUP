// Simple test function without database
exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'success',
        message: 'Netlify function is working!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        availableEnvVars: Object.keys(process.env).filter(key => 
          key.includes('DATABASE') || key.includes('NETLIFY')
        ).join(', ')
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