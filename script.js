async function validateStudentId(studentId) {
  if (!studentId) {
    throw new Error('Please enter your Student ID');
  }

  const studentIdRegex = /^\d{3}-\d{2}-\d{4}$/;
  if (!studentIdRegex.test(studentId)) {
    throw new Error('Invalid Student ID format. Please use format: XXX-XX-XXXX (e.g., 221-15-5725)');
  }

  return true;
}

async function fetchResult() {
  const studentId = document.getElementById('studentId').value;
  const semesterId = document.getElementById('semesterId').value;
  const resultContainer = document.getElementById('result');

  try {
    // Validate student ID before proceeding
    await validateStudentId(studentId);

    // Display loading state
    resultContainer.innerHTML = `
      <div class="card text-center">
          <div class="animate-pulse">
              <div class="text-gray-600">Fetching result...</div>
          </div>
      </div>`;

    // Fetch the result data from the API
    const response = await fetch(
      `/.netlify/functions/fetch-result?semesterId=${semesterId}&studentId=${studentId}`
    );

    if (!response.ok) {
      throw new Error(`No result found for ID: ${studentId}`);
    }

    const data = await response.json();
    displayResult(data);
  } catch (error) {
    resultContainer.innerHTML = `
        <div class="card">
            <div class="text-red-600 text-center">
                <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <p class="text-lg font-semibold">${error.message}</p>
                ${error.message.includes('format') ? `
                <div class="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <p>Example of correct format:</p>
                    <code class="font-mono bg-gray-100 px-2 py-1 rounded">221-15-5725</code>
                </div>
                ` : ''}
            </div>
        </div>`;
  }

  ensureContactSection();
}

function displayResult(data) {
  const resultContainer = document.getElementById('result');

  const studentInfo = data.studentInfo;
  const results = data.result;

  if (!studentInfo || !results || results.length === 0) {
    resultContainer.innerHTML = `
        <div class="card text-center">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-gray-600 text-lg">No result found for this semester.</p>
        </div>`;
    return;
  }

  const { studentName, studentId, departmentName } = studentInfo;
  const { semesterName, semesterYear } = results[0];
  const cgpa = results[0].cgpa || "N/A";

  let resultHtml = `
      <div id="result-content" class="card">
          <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-gray-800 mb-2">${studentName}</h2>
              <p class="text-gray-600">${departmentName}</p>
              <p class="text-gray-600">Student ID: ${studentId}</p>
              <p class="text-gray-600">Semester: ${semesterName} ${semesterYear}</p>
          </div>

          <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-8 text-center">
              <p class="text-white text-sm uppercase tracking-wider mb-1">Overall CGPA</p>
              <p class="text-white text-4xl font-bold">${cgpa}</p>
          </div>

          <div class="overflow-x-auto rounded-lg border border-gray-200 mb-8">
              <table class="w-full">
                  <thead class="bg-gray-50">
                      <tr>
                          <th class="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                          <th class="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                          <th class="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                          <th class="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">`;

  results.forEach(course => {
    resultHtml += `
        <tr class="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
            <td class="px-6 py-4 text-sm text-gray-900">${course.customCourseId}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${course.courseTitle}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${course.totalCredit}</td>
            <td class="px-6 py-4 text-sm font-medium ${getGradeColor(course.gradeLetter)}">${course.gradeLetter}</td>
        </tr>`;
  });

  resultHtml += `
                  </tbody>
              </table>
          </div>
          
          <!-- Download Button -->
          <div class="text-center">
              <button 
                  id="download-btn"
                  onclick="downloadPDF()"
                  class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Result as PDF
              </button>
          </div>
      </div>`;

  resultContainer.innerHTML = resultHtml;
  ensureContactSection();
}

// Add input formatting helper
document.getElementById('studentId').addEventListener('input', function(e) {
  let value = e.target.value.replace(/[^0-9-]/g, '');
  
  if (value.length >= 3 && value.charAt(3) !== '-') {
    value = value.slice(0, 3) + '-' + value.slice(3);
  }
  if (value.length >= 6 && value.charAt(6) !== '-') {
    value = value.slice(0, 6) + '-' + value.slice(6);
  }
  
  value = value.slice(0, 11);
  e.target.value = value;
});

function downloadPDF() {
  // Get the result data
  const studentName = document.querySelector('#result h2').textContent;
  const departmentName = document.querySelector('#result p:nth-of-type(1)').textContent;
  const studentId = document.querySelector('#result p:nth-of-type(2)').textContent.split(': ')[1];
  const semester = document.querySelector('#result p:nth-of-type(3)').textContent.split(': ')[1];
  const cgpa = document.querySelector('#result .text-4xl').textContent;
  
  // Create a temporary container for PDF content
  const pdfContainer = document.createElement('div');
  pdfContainer.style.padding = '20px';
  pdfContainer.style.maxWidth = '800px';
  pdfContainer.style.margin = '0 auto';
  pdfContainer.style.fontFamily = 'Arial, sans-serif';
  
  // Create the PDF content with inline styles
  pdfContainer.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="font-size: 24px; color: #1a202c; margin: 0 0 8px 0;">${studentName}</h1>
      <p style="margin: 4px 0; color: #4a5568; font-size: 14px;">${departmentName}</p>
      <p style="margin: 4px 0; color: #4a5568; font-size: 14px;">ID: ${studentId}</p>
      <p style="margin: 4px 0; color: #4a5568; font-size: 14px;">${semester}</p>
    </div>

    <div style="background: linear-gradient(90deg, #3b82f6, #8b5cf6); 
                color: white; 
                padding: 15px; 
                border-radius: 8px; 
                text-align: center;
                margin: 20px 0;">
      <p style="margin: 0; font-size: 14px; text-transform: uppercase;">CGPA</p>
      <p style="margin: 5px 0 0 0; font-size: 28px; font-weight: bold;">${cgpa}</p>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px;">
      <thead>
        <tr style="background-color: #f1f5f9;">
          <th style="padding: 8px; text-align: left; border: 1px solid #e2e8f0;">Course Code</th>
          <th style="padding: 8px; text-align: left; border: 1px solid #e2e8f0;">Course Title</th>
          <th style="padding: 8px; text-align: center; border: 1px solid #e2e8f0;">Credit</th>
          <th style="padding: 8px; text-align: center; border: 1px solid #e2e8f0;">Grade</th>
        </tr>
      </thead>
      <tbody>
        ${Array.from(document.querySelectorAll('#result tbody tr')).map(row => `
          <tr>
            <td style="padding: 8px; border: 1px solid #e2e8f0;">${row.cells[0].textContent}</td>
            <td style="padding: 8px; border: 1px solid #e2e8f0;">${row.cells[1].textContent}</td>
            <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center;">${row.cells[2].textContent}</td>
            <td style="padding: 8px; border: 1px solid #e2e8f0; text-align: center; font-weight: bold; color: ${getPDFGradeColor(row.cells[3].textContent)}">
              ${row.cells[3].textContent}
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Handle button state
  const downloadBtn = document.getElementById('download-btn');
  const originalContent = downloadBtn.innerHTML;
  downloadBtn.innerHTML = `
    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Generating PDF...`;
  downloadBtn.disabled = true;

  // Add container to document temporarily
  document.body.appendChild(pdfContainer);

  // Configure PDF options
  const opt = {
    margin: [0.3, 0.3],
    filename: `${studentId}-result.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait'
    }
  };

  // Generate PDF
  html2pdf().set(opt).from(pdfContainer).save()
    .then(() => {
      document.body.removeChild(pdfContainer);
      downloadBtn.innerHTML = originalContent;
      downloadBtn.disabled = false;
    })
    .catch(error => {
      console.error('PDF generation failed:', error);
      document.body.removeChild(pdfContainer);
      downloadBtn.innerHTML = originalContent;
      downloadBtn.disabled = false;
    });
}

function getPDFGradeColor(grade) {
  const colors = {
    'A+': '#059669',
    'A': '#059669',
    'A-': '#10B981',
    'B+': '#2563EB',
    'B': '#3B82F6',
    'B-': '#60A5FA',
    'C+': '#D97706',
    'C': '#F59E0B',
    'D': '#DC2626',
    'F': '#DC2626'
  };
  return colors[grade] || '#111827';
}

function getGradeColor(grade) {
  const colors = {
    'A+': 'text-green-600',
    'A': 'text-green-600',
    'A-': 'text-green-500',
    'B+': 'text-blue-600',
    'B': 'text-blue-500',
    'B-': 'text-blue-400',
    'C+': 'text-yellow-600',
    'C': 'text-yellow-500',
    'D': 'text-orange-500',
    'F': 'text-red-600',
  };
  return colors[grade] || 'text-gray-900';
}