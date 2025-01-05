async function fetchResult() {
  const studentId = document.getElementById('studentId').value;  // Get student ID from input field
  const semesterId = document.getElementById('semesterId').value;  // Get semester ID from dropdown
  const resultContainer = document.getElementById('result');  // Container where the result will be displayed

  resultContainer.innerHTML = 'Fetching result...';  // Display loading message

  // Build the URL with the selected semester and student ID
  const url = `http://software.diu.edu.bd:8006/result?grecaptcha=&semesterId=${semesterId}&studentId=${studentId}`;

  try {
    // Make a GET request to fetch the result data
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch result: ${response.status}`);
    }

    // Parse the response JSON
    const data = await response.json();
    displayResult(data);  // Call function to display result
  } catch (error) {
    resultContainer.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;  // Show error if any
  }
}

function displayResult(data) {
  if (Array.isArray(data) && data.length > 0) {
    const cgpa = data[0].cgpa;  // Get CGPA from first result
    const studentId = data[0].studentId;
    const semesterName = data[0].semesterName;
    const semesterYear = data[0].semesterYear;

    let resultHtml = `
      <h2>Result for Student ID: ${studentId} (Semester: ${semesterName} ${semesterYear})</h2>
      <p><strong>Overall CGPA:</strong> ${cgpa}</p>
      <table>
        <tr>
          <th>Course Code</th>
          <th>Course Title</th>
          <th>Credit</th>
          <th>Grade</th>
        </tr>`;

    // Loop through all the courses and display their details
    data.forEach(course => {
      resultHtml += `
        <tr>
          <td>${course.customCourseId}</td>
          <td>${course.courseTitle}</td>
          <td>${course.totalCredit}</td>
          <td>${course.gradeLetter}</td>
        </tr>`;
    });

    resultHtml += `</table>`;
    document.getElementById('result').innerHTML = resultHtml;  // Display the result
  } else {
    document.getElementById('result').innerHTML = '<p>No result found for this semester.</p>';  // Handle case where no result is found
  }
}
