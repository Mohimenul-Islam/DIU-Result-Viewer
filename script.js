async function fetchResult() {
  const studentId = document.getElementById('studentId').value;
  const semesterId = document.getElementById('semesterId').value;
  const resultContainer = document.getElementById('result');

  resultContainer.innerHTML = `
      <div class="card text-center">
          <div class="animate-pulse">
              <div class="text-gray-600">Fetching result...</div>
          </div>
      </div>`;

  const url = `/.netlify/functions/fetch-result?semesterId=${semesterId}&studentId=${studentId}`;

  try {
      const response = await fetch(url);

      if (!response.ok) {
          throw new Error(`Failed to fetch result: ${response.status}`);
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
                  <p class="text-lg font-semibold">Error: ${error.message}</p>
              </div>
          </div>`;
      displayContactSection();
  }
}

function displayResult(data) {
  const resultContainer = document.getElementById('result');

  if (Array.isArray(data) && data.length > 0) {
      const cgpa = data[0].cgpa;
      const studentId = data[0].studentId;
      const semesterName = data[0].semesterName;
      const semesterYear = data[0].semesterYear;

      let resultHtml = `
          <div class="card">
              <div class="text-center mb-8">
                  <h2 class="text-2xl font-bold text-gray-800 mb-2">Result for Student ID: ${studentId}</h2>
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

      data.forEach(course => {
          resultHtml += `
              <tr class="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                  <td class="px-6 py-4 text-sm text-gray-900">${course.customCourseId}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">${course.courseTitle}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">${course.totalCredit}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">${course.gradeLetter}</td>
              </tr>`;
      });

      resultHtml += `
                      </tbody>
                  </table>
              </div>
          </div>`;

      resultContainer.innerHTML = resultHtml;
  } else {
      resultContainer.innerHTML = `
          <div class="card text-center">
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-gray-600 text-lg">No result found for this semester.</p>
          </div>`;
  }

  displayContactSection();
}

function displayContactSection() {
  const contactHtml = `
      <div class="relative pt-8 border-t border-gray-200">
          <div class="mt-6 text-center">
              <p class="text-gray-600 mb-6 font-medium">Contact me if you got any queries!</p>
              <div class="flex justify-center space-x-8">
                  <a href="https://www.facebook.com/mohimenul.islam.927" 
                     target="_blank" 
                     class="group relative">
                      <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-75 group-hover:opacity-100 blur transition duration-200"></div>
                      <div class="relative bg-white rounded-lg p-4 flex items-center space-x-3 transition duration-200 transform group-hover:scale-105">
                          <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                          </svg>
                          <span class="text-gray-700 font-medium">Facebook</span>
                      </div>
                  </a>
                  
                  <a href="https://www.linkedin.com/in/mohimenul-islam0" 
                     target="_blank" 
                     class="group relative">
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
          </div>
      </div>`;

  document.getElementById('result').innerHTML += contactHtml;
}
