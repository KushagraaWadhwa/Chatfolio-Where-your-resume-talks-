from langchain_google_genai import GoogleGenerativeAI
import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from .pinecone_store import retrieve_from_pinecone
from typing import Dict, List

# Load environment variables
load_dotenv()

# Configure Google API Key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

genai.configure(api_key=GEMINI_API_KEY)

# Initialize Gemini model for intent classification
model = genai.GenerativeModel("gemini-2.0-flash-exp")

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
    """Create an enhanced prompt based on query intent and category"""
    
    base_instructions = """You are Kushagra Wadhwa's AI-powered portfolio assistant, expertly trained to help recruiters, hiring managers, and technical interviewers evaluate his candidacy.

CORE PRINCIPLES:
✓ Provide precise, data-driven responses using ONLY the verified context
✓ Maintain professional, interview-ready tone throughout
✓ Highlight quantifiable achievements with specific metrics
✓ Emphasize technical depth and practical applications
✓ Structure responses for maximum readability and impact
✓ Focus on business value and problem-solving capabilities
✓ Use third-person perspective for professional objectivity

RESPONSE QUALITY STANDARDS:
• Include specific numbers, percentages, and measurable outcomes
• Mention exact technologies, frameworks, and tools used
• Provide context about project scale and complexity
• Highlight unique contributions and innovative approaches
• Connect skills to real-world applications and results
• If information is unavailable, clearly state: "This specific information is not currently available in Kushagra's portfolio"
"""

    # Customize based on intent category
    if intent.get('category') == 'work_experience':
        format_guide = """
WORK EXPERIENCE FORMAT:
📍 Position & Company: [Role] at [Company]
⏱️ Duration: [Time period] ([X] months/years)
🎯 Key Responsibilities: [Main duties and scope]
💡 Major Achievements: [Quantified results and impact]
🛠️ Technology Stack: [Specific tools, languages, frameworks]
📈 Business Impact: [Measurable outcomes, efficiency gains, value created]
"""
    
    elif intent.get('category') == 'projects':
        format_guide = """
PROJECT SHOWCASE FORMAT:
🚀 Project Name & Purpose: [Name] - [Problem it solves]
🛠️ Technical Architecture: [Technologies, frameworks, design patterns]
💻 Implementation Details: [Key features, algorithms, methodologies]
📊 Results & Metrics: [Performance, users, efficiency gains]
🎯 Business Value: [Impact, ROI, competitive advantage]
🔗 Live Demo/Code: [Links if available]
"""
    
    elif intent.get('category') == 'skills':
        format_guide = """
TECHNICAL SKILLS FORMAT:
💡 Core Technologies: [Primary tech stack with proficiency levels]
🔧 Frameworks & Libraries: [Specific tools and their applications]
📚 Specialized Knowledge: [Advanced concepts, methodologies]
🏗️ Real-World Applications: [Where and how skills were applied]
📈 Proficiency Evidence: [Projects, certifications, achievements]
🎓 Continuous Learning: [Recent additions to skill set]
"""
    
    elif intent.get('category') == 'education':
        format_guide = """
EDUCATION FORMAT:
🎓 Degree & Field: [Degree] in [Major]
🏫 Institution: [University/College name]
📅 Timeline: [Graduation year or expected]
📚 Key Coursework: [Relevant courses and subjects]
🏆 Academic Achievements: [GPA, honors, awards]
💡 Notable Projects: [Academic projects with impact]
"""
    
    else:
        format_guide = """
GENERAL RESPONSE FORMAT:
• Start with a clear, direct answer
• Provide supporting details with specific examples
• Include relevant technical context
• Highlight measurable outcomes where applicable
• Close with broader implications or connections
"""
    
    # Add complexity-based instructions
    if intent.get('complexity') == 'complex':
        detail_instruction = "\n⚡ COMPREHENSIVE ANALYSIS REQUIRED: Provide in-depth, multi-faceted response covering all relevant aspects with rich detail and context.\n"
    elif intent.get('complexity') == 'moderate':
        detail_instruction = "\n⚡ BALANCED RESPONSE: Provide clear answer with supporting details and 2-3 concrete examples.\n"
    else:
        detail_instruction = "\n⚡ CONCISE RESPONSE: Provide direct, focused answer with 1-2 key supporting points.\n"
    
    # Construct final prompt
    prompt = f"""{base_instructions}
{format_guide}
{detail_instruction}

RECRUITER QUERY: {query}

VERIFIED CANDIDATE INFORMATION:
{context}

PROFESSIONAL ASSESSMENT (Structured response following the format above):"""
    
    return prompt


def generate_response(query):
    """
    Advanced RAG response generation with intent classification and adaptive retrieval.
    :param query: The user query.
    :return: Dict with enhanced response and metadata
    """
    
    # Step 1: Classify query intent
    print(f"\n🧠 Analyzing query intent...")
    intent = classify_query_intent(query)
    print(f"   Category: {intent.get('category')}")
    print(f"   Complexity: {intent.get('complexity')}")
    
    # Step 2: Adaptive retrieval based on complexity
    if intent.get('complexity') == 'simple':
        top_k = 3  # Fewer chunks for simple queries
    elif intent.get('complexity') == 'moderate':
        top_k = 6  # Standard retrieval
    else:
        top_k = 10  # More chunks for complex queries
    
    llm = GoogleGenerativeAI(model="gemini-2.0-flash-exp", google_api_key=GEMINI_API_KEY)
    
    retrieved_chunks = retrieve_documents(query, top_k=top_k)

    # Ensure we have valid retrieved context
    if not retrieved_chunks:
        return {
            "answer": "I don't have enough information in my knowledge base to answer this question accurately. Please try asking about Kushagra's work experience, projects, skills, or education.",
            "intent": intent,
            "num_chunks": 0
        }

    # Step 3: Format context with enhanced metadata
    context_text = ""
    for i, chunk in enumerate(retrieved_chunks, 1):
        source = chunk.metadata.get('source', 'Unknown')
        section = chunk.metadata.get('section', 'General')
        context_text += f"[CONTEXT {i}] (Relevance: {chunk.metadata.get('score', 0):.2f})\n"
        context_text += f"Source: {source} | Section: {section}\n"
        context_text += f"Content: {chunk.page_content}\n\n"

    # Step 4: Create enhanced prompt based on intent
    prompt = create_enhanced_prompt(query, context_text, intent)
    
    # Step 5: Generate response with enhanced LLM
    print(f"🤖 Generating enhanced response...")
    response = llm.invoke(prompt).strip()

    # Return structured response with metadata
    return {
        "answer": response,
        "intent": intent,
        "num_chunks": len(retrieved_chunks)
    }

# Example usage
if __name__ == "__main__":
    query = "Can you tell about the technologies he used in his project about SalesAssist AI"
    response = generate_response(query)
    print("Answer:\n", response["answer"])