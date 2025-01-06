const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  const { semesterId, studentId } = event.queryStringParameters;

  if (!semesterId || !studentId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'semesterId and studentId are required' })
    };
  }

  const resultApiUrl = `http://software.diu.edu.bd:8006/result?grecaptcha=&semesterId=${semesterId}&studentId=${studentId}`;
  const studentInfoApiUrl = `http://software.diu.edu.bd:8006/result/studentInfo?studentId=${studentId}`;

  try {
    // Fetch result data
    const [resultResponse, studentInfoResponse] = await Promise.all([
      fetch(resultApiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      }),
      fetch(studentInfoApiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      })
    ]);

    if (!resultResponse.ok || !studentInfoResponse.ok) {
      throw new Error('Failed to fetch data from APIs');
    }

    const resultData = await resultResponse.json();
    const studentInfoData = await studentInfoResponse.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        result: resultData,
        studentInfo: studentInfoData
      })
    };
  } catch (error) {
    console.error('Error fetching result or student info:', error);

    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        error: 'Failed to fetch data',
        details: error.message
      })
    };
  }
};
