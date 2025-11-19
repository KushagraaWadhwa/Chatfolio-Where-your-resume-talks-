from langchain_google_genai import GoogleGenerativeAI
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from .pinecone_store import retrieve_from_pinecone
from typing import Dict, Optional, Any
import hashlib
from .config import SKIP_INTENT_CLASSIFICATION, DEFAULT_TOP_K, GEMINI_MODEL

# Load environment variables
load_dotenv()

# Configure Google API Key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

# Set for langchain
os.environ["GOOGLE_API_KEY"] = GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini model for intent classification
model = genai.GenerativeModel(GEMINI_MODEL)

# Response cache (holds last 100 query-response pairs)
_response_cache: Dict[str, Dict[str, Any]] = {}

def classify_query_intent(query: str) -> Dict:
    """
    Classify the query intent to optimize retrieval and response generation.
    Returns category, complexity, and specific aspects to focus on.
    """
    classification_prompt = f"""Analyze this query about a professional portfolio and classify it:

Query: "{query}"

Respond in JSON format:
{{
    "category": "work_experience|projects|skills|education|general|personal",
    "complexity": "simple|moderate|complex",
    "specific_focus": ["list", "of", "key", "aspects"],
    "requires_details": true|false
}}

Categories:
- work_experience: Questions about jobs, roles, responsibilities
- projects: Questions about specific projects, implementations
- skills: Questions about technical abilities, technologies
- education: Questions about academic background
- general: Overview or broad questions
- personal: About interests, goals, background

Complexity:
- simple: Direct fact query (1-2 data points)
- moderate: Requires 3-5 data points or context
- complex: Requires comprehensive analysis or multiple sources"""

    try:
        response = model.generate_content(classification_prompt)
        response_text = response.text.strip()
        
        # Extract JSON
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        intent = json.loads(response_text)
        return intent
    except Exception as e:
        print(f"Intent classification error: {e}")
        # Fallback
        return {
            "category": "general",
            "complexity": "moderate",
            "specific_focus": [],
            "requires_details": True
        }

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

def create_enhanced_prompt(query: str, context: str, intent: Dict) -> str:
    """Create a concise prompt to minimize token usage"""
    
    # MUCH SHORTER PROMPT - saves API costs!
    prompt = f"""You are Kushagra Wadhwa's portfolio assistant. Answer professionally using ONLY the provided context.

Rules:
- Be specific with numbers, metrics, and technologies
- Use professional tone
- If info unavailable, say so clearly

Query: {query}

Context:
{context}

Answer:"""
    
    return prompt


def generate_response(query: str, skip_intent_classification: Optional[bool] = None) -> Dict[str, Any]:
    """
    Optimized RAG response generation with optional intent classification and caching.
    :param query: The user query.
    :param skip_intent_classification: Skip intent classification for faster response (None = use config default)
    :return: Dict with enhanced response and metadata
    """
    
    # Use config default if not specified
    if skip_intent_classification is None:
        skip_intent_classification = SKIP_INTENT_CLASSIFICATION
    
    # Check cache first - SAVES API CALLS!
    query_normalized = query.lower().strip()
    query_hash = hashlib.md5(query_normalized.encode()).hexdigest()
    
    if query_hash in _response_cache:
        print("💰 Cache HIT! Returning cached response (saved API call)")
        return _response_cache[query_hash]
    
    # Step 1: Fast keyword-based classification (replaces slow LLM intent classification)
    if skip_intent_classification:
        # Simple keyword-based approach - much faster
        query_lower = query.lower()
        if any(word in query_lower for word in ['project', 'built', 'developed', 'implemented']):
            top_k = DEFAULT_TOP_K
            intent = {'category': 'projects', 'complexity': 'moderate'}
        elif any(word in query_lower for word in ['work', 'job', 'company', 'experience', 'role']):
            top_k = DEFAULT_TOP_K
            intent = {'category': 'work_experience', 'complexity': 'moderate'}
        elif any(word in query_lower for word in ['skill', 'technology', 'tech', 'know', 'programming']):
            top_k = max(DEFAULT_TOP_K - 1, 3)
            intent = {'category': 'skills', 'complexity': 'simple'}
        elif any(word in query_lower for word in ['education', 'degree', 'university', 'college']):
            top_k = max(DEFAULT_TOP_K - 1, 3)
            intent = {'category': 'education', 'complexity': 'simple'}
        else:
            top_k = DEFAULT_TOP_K
            intent = {'category': 'general', 'complexity': 'moderate'}
        print(f"\n⚡ Fast classification: {intent.get('category')} (top_k={top_k})")
    else:
        # Original slower but more accurate classification
        print("\n🧠 Analyzing query intent...")
        intent = classify_query_intent(query)
        print(f"   Category: {intent.get('category')}")
        print(f"   Complexity: {intent.get('complexity')}")
        
        # Adaptive retrieval based on complexity
        if intent.get('complexity') == 'simple':
            top_k = 4
        elif intent.get('complexity') == 'moderate':
            top_k = 5
        else:
            top_k = 7
    
    # Initialize LLM (API key already set in environment at module level)
    llm = GoogleGenerativeAI(model=GEMINI_MODEL)
    
    retrieved_chunks = retrieve_documents(query, top_k=top_k)

    # Ensure we have valid retrieved context
    if not retrieved_chunks:
        return {
            "answer": "I don't have enough information in my knowledge base to answer this question accurately. Please try asking about Kushagra's work experience, projects, skills, or education.",
            "intent": intent,
            "num_chunks": 0
        }

    # Step 3: Format context - SIMPLIFIED to save tokens
    context_text = ""
    for i, chunk in enumerate(retrieved_chunks, 1):
        # Only include essential info - no verbose metadata
        context_text += f"[{i}] {chunk.page_content}\n\n"

    # Step 4: Create enhanced prompt based on intent
    prompt = create_enhanced_prompt(query, context_text, intent)
    
    # Step 5: Generate response with enhanced LLM
    print("🤖 Generating enhanced response...")
    response = llm.invoke(prompt).strip()

    # Return structured response with metadata
    result = {
        "answer": response,
        "intent": intent,
        "num_chunks": len(retrieved_chunks)
    }
    
    # Cache the response - limit cache to 100 entries
    if len(_response_cache) >= 100:
        # Remove oldest entry (simple FIFO)
        oldest_key = next(iter(_response_cache))
        del _response_cache[oldest_key]
    _response_cache[query_hash] = result
    print(f"💾 Response cached ({len(_response_cache)}/100 cached queries)")
    
    return result

# Example usage
if __name__ == "__main__":
    query = "Can you tell about the technologies he used in his project about SalesAssist AI"
    response = generate_response(query)
    print("Answer:\n", response["answer"])