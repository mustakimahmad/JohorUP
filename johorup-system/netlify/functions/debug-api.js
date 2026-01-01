// Simple debug API to test if functions are working
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
    console.log('Debug API called');
    console.log('HTTP Method:', event.httpMethod);
    console.log('Headers:', event.headers);
    console.log('Body:', event.body);
    
    const response = {
      status: 'success',
      message: 'Debug API is working',
      timestamp: new Date().toISOString(),
      method: event.httpMethod,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasDatabase: !!(process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL),
        functionName: context.functionName,
        functionVersion: context.functionVersion
      },
      request: {
        headers: event.headers,
        body: event.body,
        queryStringParameters: event.queryStringParameters
      }
    };

    console.log('Debug response:', response);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response, null, 2)
    };

  } catch (error) {
    console.error('Debug API error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }, null, 2)
    };
  }
};