// Simple test function to verify API routing
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
    console.log('Test get user data function called');
    console.log('HTTP Method:', event.httpMethod);
    console.log('Event body:', event.body);
    
    const body = event.body ? JSON.parse(event.body) : {};
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'success',
        message: 'Test get user data function is working',
        method: event.httpMethod,
        receivedData: body,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Test function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        error: error.message,
        message: 'Test function failed'
      })
    };
  }
};