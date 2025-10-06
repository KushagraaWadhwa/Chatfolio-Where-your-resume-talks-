# Chatfolio - Where Your Resume Talks

An interactive portfolio website with a chatbot that can answer questions about your resume, skills, and projects.

## Features

- Interactive chatbot powered by RAG (Retrieval-Augmented Generation)
- Document management system for resumes, certificates, and other files
- Resume tailoring based on job descriptions
- GitHub statistics integration
- Audio transcription for voice queries
- Responsive design with dark mode support

## Project Structure

```
chatfolio/
├── backend/              # Backend API and services
│   ├── data/             # JSON data files and resume parser
│   ├── rag/              # RAG system components
│   ├── scripts/          # Utility scripts
│   │   ├── db/           # Database scripts
│   │   └── resume/       # Resume processing scripts
│   ├── uploads/          # Document storage
│   ├── document_service.py
│   ├── models.py
│   └── security.py
├── client/               # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/
│       ├── hooks/
│       └── services/
├── main.py               # FastAPI application entry point
└── requirements.txt      # Python dependencies
```

## Setup and Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- SQLite

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chatfolio.git
cd chatfolio
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
# Create a .env file with the following:
GEMINI_API_KEY=your_gemini_api_key
```

5. Run database migrations:
```bash
python -m backend.scripts.db.migrate_documents
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Running the Application

1. Start the backend server:
```bash
uvicorn main:app --reload --port 8001
```

2. In a separate terminal, start the frontend:
```bash
cd client
npm run dev
```

3. Access the application at http://localhost:5173

## Updating Resume Data

To update your resume data:

1. Place your updated resume PDF in `backend/data/KushagraWadhwa_Resume.pdf`
2. Run the update script:
```bash
python -m backend.scripts.resume.update_resume_data
```

For more details, see the [Resume Update Documentation](docs/RESUME_UPDATE.md).

## API Documentation

The API documentation is available at http://localhost:8001/docs when the backend server is running.

## License

MIT

## Author

Kushagra Wadhwa
