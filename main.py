from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
import os
from pathlib import Path
from backend.rag.embedding_store import create_vector_store
from backend.rag.generator import generate_response, load_vector_store
from backend.rag.github_stats import get_github_stats
from backend.rag.resume_tailoring import detect_resume_command, tailor_resume  # Add this import
from typing import Optional
import logging
import whisper
import tempfile

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Portfolio Chatbot API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global vector store reference
vector_store = None
# Global Whisper model reference
whisper_model = None

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    type: str = "text"
    metadata: dict = {}

class TranscriptionResponse(BaseModel):
    text: str
    error: Optional[str] = None

@app.on_event("startup")
async def startup_event():
    """Initialize vector store and Whisper model on startup"""
    global vector_store, whisper_model
    
    try:
        # Use Path for cross-platform compatibility
        json_directory = Path("backend/data")
        persist_directory = Path("backend/chroma_db")

        if not persist_directory.exists() or not any(persist_directory.iterdir()):
            logger.info("Creating new vector store...")
            create_vector_store(
                json_directory=str(json_directory),
                chunk_size=512,
                overlap=120,
                persist_directory=str(persist_directory)
            )
            logger.info("Vector store created successfully")
        
        # Load vector store
        vector_store = load_vector_store()
        logger.info("Vector store loaded successfully")

        # Load Whisper model
        logger.info("Loading Whisper model...")
        whisper_model = whisper.load_model("base")
        logger.info("Whisper model loaded successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize services: {str(e)}")
        raise RuntimeError(f"Failed to initialize services: {str(e)}")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup resources on shutdown"""
    global vector_store, whisper_model
    if vector_store:
        try:
            vector_store = None
            logger.info("Vector store cleaned up successfully")
        except Exception as e:
            logger.error(f"Error during cleanup: {str(e)}")
    whisper_model = None

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Global exception handler caught: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."}
    )

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Handle chat requests"""
    try:
        query = request.message.strip()
        
        # Handle greetings
        if not query or query.lower() in ['hi', 'hello','hey']:
            return ChatResponse(
                response="Hello! I'm Kushagra's Portfolio Chatbot. How can I help you today?",
                type="text"
            )
        is_resume_request, job_description = detect_resume_command(query)
        if is_resume_request:
            try:
                result = tailor_resume(job_description, vector_store)
                # Pass either the full path or just the filename, depending on your frontend needs
                return ChatResponse(
                    response=result["answer"],
                    type="resume",
                    metadata={"file_path": result["file_path"], "filename": os.path.basename(result["file_path"])}
                )
            except Exception as e:
                logger.error(f"Resume tailoring error: {str(e)}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to tailor resume: {str(e)}"
                )
        # Handle GitHub related queries
        if any(keyword in query.lower() for keyword in ["github", "repo", "commits"]):
            try:
                github_data = get_github_stats(query)
                return ChatResponse(
                    response="Here's the GitHub information you requested",
                    type="github_stats",
                    metadata={"github_data": github_data}
                )
            except Exception as e:
                logger.error(f"GitHub stats error: {str(e)}")
                raise HTTPException(
                    status_code=500,
                    detail="Failed to fetch GitHub statistics. Please try again later."
                )
        
        # Handle general queries using RAG
        if not vector_store:
            raise HTTPException(
                status_code=503,
                detail="Vector store is not initialized. Please try again later."
            )
            
        response = generate_response(query)
        if not response or not response.get("answer"):
            raise HTTPException(
                status_code=500,
                detail="Failed to generate response. Please try again."
            )
            
        return ChatResponse(
            response=response["answer"],
            type="text",
        )
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request. Please try again."
        )

@app.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(file: UploadFile = File(...)):
    """Transcribe audio file using Whisper"""
    try:
        if not whisper_model:
            raise HTTPException(
                status_code=503,
                detail="Transcription service is not initialized"
            )

        # Create a temporary file to store the audio
        with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_file:
            # Write the uploaded file to the temporary file
            content = await file.read()
            temp_file.write(content)
            temp_file.flush()
            
            # Transcribe the audio
            try:
                result = whisper_model.transcribe(temp_file.name)
                transcribed_text = result["text"].strip()
                
                if not transcribed_text:
                    raise ValueError("No text was transcribed from the audio")
                
                return TranscriptionResponse(text=transcribed_text)
            
            finally:
                # Clean up the temporary file
                os.unlink(temp_file.name)
                
    except Exception as e:
        logger.error(f"Transcription error: {str(e)}")
        return TranscriptionResponse(
            text="",
            error=f"Failed to transcribe audio: {str(e)}"
        )

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    global vector_store, whisper_model
    return {
        "status": "healthy",
        "vector_store_initialized": vector_store is not None,
        "whisper_model_initialized": whisper_model is not None
    }

@app.get("/download-resume/{filename:path}")
async def download_resume(filename: str):
    """Download the tailored resume"""
    resume_dir = os.path.join("backend", "generated_resumes")
    file_path = os.path.join(resume_dir, filename)
    
    if not os.path.exists(file_path):
        # If the full path was passed instead of just the filename
        if os.path.exists(filename):
            file_path = filename
        else:
            raise HTTPException(status_code=404, detail="Resume file not found")
    
    return FileResponse(
        path=file_path,
        filename="KushagraWadhwa_Tailored_Resume.pdf",
        media_type="application/pdf"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)