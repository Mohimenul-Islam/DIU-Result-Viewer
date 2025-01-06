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
          <div id="toast-container" class="fixed top-4 right-4 z-50"></div>
          <div class="text-center">
              <button 
                  id="download-btn"
                  onclick="showDownloadMessage()"
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
  
  // if (value.length >= 3 && value.charAt(3) !== '-') {
  //   value = value.slice(0, 3) + '-' + value.slice(3);
  // }
  // if (value.length >= 6 && value.charAt(6) !== '-') {
  //   value = value.slice(0, 6) + '-' + value.slice(6);
  // }
  
  value = value.slice(0, 11);
  e.target.value = value;
});

function showDownloadMessage() {
  const toastContainer = document.getElementById('toast-container');
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'transform transition-all duration-300 ease-out scale-95 opacity-0';
  toast.innerHTML = `
    <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-4 flex items-center space-x-3">
      <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-gray-700">PDF Download is currently unavailable</p>
    </div>
  `;
  
  // Add toast to container
  toastContainer.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.remove('scale-95', 'opacity-0');
    toast.classList.add('scale-100', 'opacity-100');
  }, 10);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('scale-100', 'opacity-100');
    toast.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, 3000);
}
function ensureContactSection() {
  const contactSection = document.getElementById('contact');
  if (!contactSection) {
    const container = document.createElement('div');
    container.id = 'contact';
    document.body.appendChild(container);
  }
  displayContactSection(document.getElementById('contact'));
}

function displayContactSection(contactSection) {
  const contactHtml = `
      <div class="card text-center mt-6">
          <p class="text-gray-600 mb-6 font-medium">Contact me if you have any queries!</p>
          <div class="flex justify-center space-x-8">
              <a href="https://www.facebook.com/mohimenul.islam.927" target="_blank" class="group relative">
                  <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
                  <div class="relative bg-white rounded-lg p-4 flex items-center space-x-3 transition duration-200 transform group-hover:scale-105">
                      <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                      <span class="text-gray-700 font-medium">Facebook</span>
                  </div>
              </a>
              <a href="https://www.linkedin.com/in/mohimenul-islam0" target="_blank" class="group relative">
                  <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
                  <div class="relative bg-white rounded-lg p-4 flex items-center space-x-3 transition duration-200 transform group-hover:scale-105">
                      <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                          <rect x="2" y="9" width="4" height="12"></rect>
                          <circle cx="4" cy="4" r="2"></circle>
                      </svg>
                      <span class="text-gray-700 font-medium">LinkedIn</span>
                  </div>
              </a>
          </div>
          <p class="mt-8 text-gray-500 italic">
              <span class="inline-block transform hover:scale-110 transition-transform duration-200">
                  Arigato gozaimasu for visiting!
              </span>
          </p>
      </div>`;
  contactSection.innerHTML = contactHtml;
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