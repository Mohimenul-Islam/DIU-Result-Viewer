# DIU Result Viewer 🎓

A modern, fast, and user-friendly web application to view academic results for Daffodil International University students. This application provides a seamless experience for students to check their semester results with a beautiful UI and responsive design.


## 🌟 Features

- **Modern UI/UX**: Clean and intuitive interface with gradient animations
- **Fast Results**: Instant result fetching with loading indicators
- **Responsive Design**: Works perfectly on all devices (mobile, tablet, desktop)
- **Detailed Information**: Displays comprehensive result data including:
  - Student information
  - Semester details
  - Course-wise grades
  - CGPA calculation
  - Color-coded grade visualization

## 🚀 Tech Stack

- **Frontend**:
  - HTML5
  - Tailwind CSS
  - JavaScript (Vanilla)
  - HTML2PDF.js for PDF generation

- **Backend**:
  - Netlify Functions (Serverless)
  - Node.js

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/diu-result-viewer.git
cd diu-result-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Build the Tailwind CSS:
```bash
npm run build
```

4. For development with watch mode:
```bash
npm run dev
```

## 🔧 Configuration

1. Create a `.env` file in the root directory (if needed for API keys or configurations)

2. Set up Netlify:
   - Deploy to Netlify using the provided `netlify.toml` configuration
   - Ensure the serverless functions are properly configured

## 💻 Local Development

1. Install the Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Run the development server:
```bash
netlify dev
```

The application will be available at `http://localhost:8888`

## 📝 API Endpoints

The application uses the following endpoints:

- `/.netlify/functions/fetch-result`: Fetches student results and information
  - Parameters:
    - `semesterId`: Semester identifier
    - `studentId`: Student's ID number

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 👨‍💻 Author

- **Mohimenul Islam**
  - [LinkedIn](https://www.linkedin.com/in/mohimenul-islam0)
  - [Facebook](https://www.facebook.com/mohimenul.islam.927)

## 🙏 Acknowledgments

- Daffodil International University for providing the result data API
- All contributors who have helped improve this project

## ⚠️ Disclaimer

This is an unofficial result viewer and is not affiliated with Daffodil International University. This tool is created for educational purposes and to help students access their results more conveniently.
