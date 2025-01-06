// netlify/functions/fetch-result.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

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

  try {
    // Fetch both student info and results
    const [studentInfoResponse, resultResponse] = await Promise.all([
      fetch(`http://software.diu.edu.bd:8006/result/studentInfo?studentId=${studentId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }),
      fetch(`http://software.diu.edu.bd:8006/result?grecaptcha=&semesterId=${semesterId}&studentId=${studentId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })
    ]);

    if (!studentInfoResponse.ok || !resultResponse.ok) {
      throw new Error('Failed to fetch data');
    }

    const studentInfo = await studentInfoResponse.json();
    const resultData = await resultResponse.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        studentInfo,
        results: resultData
      })
    };
  } catch (error) {
    console.error('Error:', error);
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