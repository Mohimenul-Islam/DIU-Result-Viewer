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
                <p class="text-lg font-semibold">Error: ${error.message}</p>
            </div>
        </div>`;
  }

  // Ensure the Contact Me section is always rendered
  renderContactSection();
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
                <td class="px-6 py-4 text-sm font-medium ${getGradeColor(course.gradeLetter)}">${course.gradeLetter}</td>
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
            <p class="text-gray-600 text-lg">No result found for this semester.</p>
        </div>`;
  }
}

function renderContactSection() {
  const resultContainer = document.getElementById('result');
  const contactHtml = `
      <div class="card mt-8">
          <div class="text-center">
              <p class="text-gray-600 mb-6 font-medium">Contact me if you have any queries!</p>
              <div class="flex justify-center space-x-8">
                  <a href="https://www.facebook.com/mohimenul.islam.927" target="_blank" class="group">
                      <div class="relative bg-white rounded-lg p-4 flex items-center space-x-3 transition-transform duration-200">
                          <span class="text-blue-600 font-medium">Facebook</span>
                      </div>
                  </a>
                  <a href="https://www.linkedin.com/in/mohimenul-islam0" target="_blank" class="group">
                      <div class="relative bg-white rounded-lg p-4 flex items-center space-x-3 transition-transform duration-200">
                          <span class="text-blue-600 font-medium">LinkedIn</span>
                      </div>
                  </a>
              </div>
          </div>
      </div>`;
  resultContainer.insertAdjacentHTML('beforeend', contactHtml);
}
