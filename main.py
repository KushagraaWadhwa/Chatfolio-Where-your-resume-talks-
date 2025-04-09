# import os
# from rag.embedding_store import create_vector_store
# from rag.generator import generate_response, load_vector_store
# from rag.github_stats import get_github_stats

# def main():
#     print("Welcome to Kushagra's Portfolio Chatbot!")
    
#     # Path configuration
#     json_directory = os.path.join("backend", "data")
#     persist_directory = os.path.join("backend", "chroma_db")

#     # Vector store initialization
#     if not os.path.exists(persist_directory) or not os.listdir(persist_directory):
#         print("🔄 Creating new vector store...")
#         try:
#             create_vector_store(
#                 json_directory=json_directory,
#                 chunk_size=512,
#                 overlap=120,
#                 persist_directory=persist_directory
#             )
#             print("✅ Vector store created successfully")
#         except Exception as e:
#             print(f"❌ Failed to create vector store: {str(e)}")
#             return
#     else:
#         print("✅ Using existing vector store")

#     # Interaction loop
#     while True:
#         query = input("\n💬 Enter your query (type 'exit' to quit): ").strip().lower()
        
#         if not query or query.lower() in ['hi', 'hello']:
#             print("Hello there! How can I help you today? I am Kushagra's Portfolio Chatbot. Feel free to ask me anything!")
#             continue
#         elif "github" in query or "repo" in query or "commits" in query:
#             github_data = get_github_stats(query)
#             print("📊 GitHub Data:", github_data)
#             continue

#         elif query.lower() in ['bye','exit', 'quit']:
#             print("👋 Goodbye!")
#             break
        
#         else:
#             vector_store = load_vector_store()
#             # print(vector_store._collection.count())  # Prints number of stored embeddings
#             response = generate_response(query)
#             print("\n📝 Answer:", response["answer"])

# if __name__ == "__main__":
#     main()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from backend.rag.embedding_store import create_vector_store
from backend.rag.generator import generate_response, load_vector_store
from backend.rag.github_stats import get_github_stats

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize vector store on startup
@app.on_event("startup")
async def startup_event():
    json_directory = os.path.join("backend","data")
    persist_directory = os.path.join("backend","chroma_db")

    if not os.path.exists(persist_directory) or not os.listdir(persist_directory):
        try:
            create_vector_store(
                json_directory=json_directory,
                chunk_size=512,
                overlap=120,
                persist_directory=persist_directory
            )
        except Exception as e:
            print(f"Failed to create vector store: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to initialize vector store")

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    type: str = "text"
    metadata: dict = {}

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    query = request.message.strip()
    
    # Handle greetings
    if not query or query.lower() in ['hi', 'hello']:
        return ChatResponse(
            response="Hello! I'm Kushagra's Portfolio Chatbot. How can I help you today?",
            type="text"
        )
    
    # Handle GitHub related queries
    if any(keyword in query.lower() for keyword in ["github", "repo", "commits"]):
        github_data = get_github_stats(query)
        return ChatResponse(
            response="Here's the GitHub information you requested",
            type="github_stats",
            metadata={"github_data": github_data}
        )
    
    # Handle general queries using RAG
    try:
        vector_store = load_vector_store()
        response = generate_response(query)
        return ChatResponse(
            response=response["answer"],
            type="text",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}