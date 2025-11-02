from langchain_google_genai import GoogleGenerativeAI
import os
import google.generativeai as genai
from dotenv import load_dotenv
from .pinecone_store import retrieve_from_pinecone

# Load environment variables
load_dotenv()

# Configure Google API Key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

genai.configure(api_key=GEMINI_API_KEY)

# Retrieve relevant documents from Pinecone
def retrieve_documents(query, top_k=5):
    """Retrieve documents using Pinecone vector store"""
    docs = retrieve_from_pinecone(query, top_k=top_k)
    
    print(f"\n🔍 Retrieved {len(docs)} chunks from Pinecone:")
    for doc in docs:
        print(f"  • Section: {doc.metadata.get('section', 'unknown')}")
        print(f"    Score: {doc.metadata.get('score', 0):.3f}")
        print(f"    Preview: {doc.page_content[:100]}...")
    
    return docs

def generate_response(query):
    """
    Retrieves relevant chunks and generates a structured response using Gemini 2.0 Flash with strict grounding.
    :param query: The user query.

    """

    llm = GoogleGenerativeAI(model="gemini-2.0-flash-exp", google_api_key=GEMINI_API_KEY)

    retrieved_chunks = retrieve_documents(query, top_k=5)
    # print(f"Retrieved {len(retrieved_chunks)} chunks.")

    # Ensure we have valid retrieved context
    if not retrieved_chunks:
        return {
            "answer": "I do not have enough information to answer this question accurately.",
        }

    # Format retrieved context for maximum clarity
    context_text = ""
    for i, chunk in enumerate(retrieved_chunks, 1):
        source = chunk.metadata.get('source', 'Unknown')
        section = chunk.metadata.get('section', 'General')
        context_text += f"[CONTEXT {i}]\n"
        context_text += f"Source: {source} | Section: {section}\n"
        context_text += f"Content: {chunk.page_content}\n\n"

    # Professional interview-focused RAG prompt
    prompt = (
        "You are Kushagra Wadhwa's professional portfolio assistant, designed for recruiters, HR professionals, and interviewers. "
        "Provide precise, professional responses that help evaluate Kushagra's candidacy for technical roles.\n\n"
        
        "PROFESSIONAL RESPONSE GUIDELINES:\n"
        "1. Use ONLY verified information from the retrieved context\n"
        "2. Maintain professional, interview-appropriate tone\n"
        "3. Highlight quantifiable achievements and measurable impact\n"
        "4. Include specific technical competencies and tools\n"
        "5. Mention relevant experience duration and progression\n"
        "6. Focus on business value and problem-solving capabilities\n"
        "7. Structure responses for easy scanning by busy professionals\n"
        "8. If information is unavailable, state: 'This specific information is not available in Kushagra's portfolio'\n"
        "9. Answer from third person perspective for professional context\n"
        "10. Emphasize skills relevant to hiring decisions\n\n"
        
        "RESPONSE FORMAT FOR DIFFERENT QUERIES:\n"
        "• Work Experience: Role → Company → Duration → Key Achievements → Technologies → Impact\n"
        "• Projects: Project Name → Technologies → Problem Solved → Measurable Results → Business Value\n"
        "• Skills: Technical Stack → Proficiency Level → Real-world Applications → Project Examples\n"
        "• Education: Degree → Institution → Relevant Coursework → Academic Performance\n\n"
        
        f"RECRUITER QUERY: {query}\n\n"
        
        "CANDIDATE INFORMATION:\n"
        f"{context_text}\n\n"
        
        "PROFESSIONAL ASSESSMENT:"
    )

    # Get response from LLM
    response = llm.invoke(prompt).strip()



    # Return structured response
    return {
        "answer": response,
    }

# Example usage
if __name__ == "__main__":
    query = "Can you tell about the technologies he used in his project about SalesAssist AI"
    response = generate_response(query)
    print("Answer:\n", response["answer"])