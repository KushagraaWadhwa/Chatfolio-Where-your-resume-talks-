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

- Python 3.11+
- Node.js 16+
- Pinecone API Key
- Google Gemini API Key

### Local Development

1. Clone and install backend:
```bash
git clone https://github.com/yourusername/chatfolio.git
cd chatfolio
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. Create `.env` file:
```bash
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
GITHUB_USERNAME=your_github_username
ENABLE_WHISPER=false
```

3. Install and run frontend:
```bash
cd client
npm install
npm run dev
```

4. Run backend:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8083
```

Access at http://localhost:5173

## Deployment

**Backend:** Vercel Serverless Functions  
**Frontend:** Vercel

### Quick Deploy to Vercel

See detailed deployment guides:
- 📖 [Complete Deployment Guide](DEPLOYMENT_GUIDE.md) - Full step-by-step instructions
- ⚡ [Quick Deploy Guide](QUICK_DEPLOY.md) - TL;DR version
- ✅ [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) - Pre-flight checklist
- ⚠️ [Vercel Considerations](VERCEL_CONSIDERATIONS.md) - Important limitations & solutions

### Quick Start

1. **Deploy Backend:**
   ```bash
   vercel --prod
   ```
   Set environment variables in Vercel dashboard: `PINECONE_API_KEY`, `GOOGLE_API_KEY`, `OPENAI_API_KEY`, `ENABLE_WHISPER=false`

2. **Deploy Frontend:**
   ```bash
   cd client
   vercel --prod
   ```
   Set `VITE_API_URL` to your backend URL in Vercel dashboard

3. **Update Backend CORS:**
   Set `FRONTEND_URL` in backend project to your frontend URL and redeploy

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
