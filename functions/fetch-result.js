const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Extract query parameters
  const { semesterId, studentId } = event.queryStringParameters;

  if (!semesterId || !studentId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'semesterId and studentId are required' }),
    };
  }

  const apiUrl = `http://software.diu.edu.bd:8006/result?grecaptcha=&semesterId=${semesterId}&studentId=${studentId}`;

  try {
    // Forward the request to the original API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Failed to fetch from API: ${response.statusText}` }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
    };
  }
};
