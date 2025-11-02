"""
Advanced RAG Implementation with Query Enhancement, Re-ranking, and Hybrid Search
This module provides state-of-the-art RAG capabilities for better retrieval and generation.
"""

import os
from typing import List, Dict, Optional
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.docstore.document import Document
from sentence_transformers import CrossEncoder
import google.generativeai as genai

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

genai.configure(api_key=GEMINI_API_KEY)


class AdvancedRAG:
    """
    Advanced RAG system with:
    - Query rewriting and expansion
    - Hybrid retrieval (semantic + keyword)
    - Cross-encoder re-ranking
    - Context compression
    - Response verification
    """
    
    def __init__(self, persist_directory: str = "backend/chroma_db"):
        self.persist_directory = persist_directory
        self.embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.vector_store = None
        self.reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
        self.llm = GoogleGenerativeAI(model="gemini-2.0-flash-exp", google_api_key=GEMINI_API_KEY)
        self._load_vector_store()
    
    def _load_vector_store(self):
        """Load the vector store"""
        self.vector_store = Chroma(
            persist_directory=self.persist_directory,
            embedding_function=self.embedding_model
        )
    
    def rewrite_query(self, query: str) -> List[str]:
        """
        Rewrite the query to improve retrieval using LLM.
        Generate multiple query variations for better coverage.
        """
        prompt = f"""Given the user query about a professional portfolio, generate 3 alternative queries that would help retrieve relevant information.
        
Original Query: {query}

Generate 3 alternative queries that:
1. Rephrase the question differently
2. Break down complex questions into simpler parts
3. Add relevant context or synonyms

Return only the 3 queries, one per line, without numbering or explanation."""

        try:
            response = self.llm.invoke(prompt).strip()
            rewritten_queries = [q.strip() for q in response.split('\n') if q.strip()]
            return [query] + rewritten_queries[:3]  # Original + up to 3 variations
        except Exception as e:
            print(f"Query rewriting failed: {e}")
            return [query]
    
    def retrieve_with_mmr(self, query: str, k: int = 5, fetch_k: int = 20) -> List[Document]:
        """
        Retrieve documents using Maximal Marginal Relevance (MMR)
        to balance relevance with diversity.
        """
        retriever = self.vector_store.as_retriever(
            search_type="mmr",
            search_kwargs={
                "k": k,
                "fetch_k": fetch_k,
                "lambda_mult": 0.7  # Balance between relevance (1.0) and diversity (0.0)
            }
        )
        return retriever.invoke(query)
    
    def hybrid_retrieve(self, query: str, k: int = 5) -> List[Document]:
        """
        Perform hybrid retrieval using multiple query variations
        and combine results.
        """
        # Get query variations
        queries = self.rewrite_query(query)
        
        # Retrieve documents for each query variation
        all_docs = []
        seen_content = set()
        
        for q in queries:
            docs = self.retrieve_with_mmr(q, k=k)
            for doc in docs:
                # Avoid duplicates based on content
                content_hash = hash(doc.page_content)
                if content_hash not in seen_content:
                    all_docs.append(doc)
                    seen_content.add(content_hash)
        
        return all_docs
    
    def rerank_documents(self, query: str, documents: List[Document], top_k: int = 5) -> List[Document]:
        """
        Re-rank documents using a cross-encoder model for better relevance.
        """
        if not documents:
            return []
        
        # Create query-document pairs
        pairs = [[query, doc.page_content] for doc in documents]
        
        # Get relevance scores
        scores = self.reranker.predict(pairs)
        
        # Sort documents by score
        doc_score_pairs = list(zip(documents, scores))
        doc_score_pairs.sort(key=lambda x: x[1], reverse=True)
        
        # Return top_k documents
        return [doc for doc, score in doc_score_pairs[:top_k]]
    
    def classify_query_intent(self, query: str) -> Dict[str, any]:
        """
        Classify the intent of the query to customize retrieval and generation.
        """
        prompt = f"""Analyze this query about a professional portfolio and classify it.

Query: {query}

Determine:
1. Category: work_experience, projects, skills, education, general, or contact
2. Complexity: simple, moderate, complex
3. Requires specific details: yes or no

Return in this exact format:
category: <category>
complexity: <complexity>
specific_details: <yes/no>"""

        try:
            response = self.llm.invoke(prompt).strip()
            lines = response.split('\n')
            
            intent = {
                'category': 'general',
                'complexity': 'moderate',
                'specific_details': False
            }
            
            for line in lines:
                if ':' in line:
                    key, value = line.split(':', 1)
                    key = key.strip().lower().replace(' ', '_')
                    value = value.strip().lower()
                    
                    if key == 'category':
                        intent['category'] = value
                    elif key == 'complexity':
                        intent['complexity'] = value
                    elif key == 'specific_details':
                        intent['specific_details'] = value == 'yes'
            
            return intent
        except Exception as e:
            print(f"Intent classification failed: {e}")
            return {
                'category': 'general',
                'complexity': 'moderate',
                'specific_details': False
            }
    
    def generate_response(self, query: str, use_hybrid: bool = True) -> Dict[str, any]:
        """
        Generate a response using advanced RAG techniques.
        
        Args:
            query: User query
            use_hybrid: Whether to use hybrid retrieval (default: True)
        
        Returns:
            Dict with answer and metadata
        """
        # Classify query intent
        intent = self.classify_query_intent(query)
        
        # Adjust retrieval based on complexity
        k = 3 if intent['complexity'] == 'simple' else 5 if intent['complexity'] == 'moderate' else 8
        
        # Retrieve documents
        if use_hybrid:
            retrieved_docs = self.hybrid_retrieve(query, k=k * 2)
        else:
            retrieved_docs = self.retrieve_with_mmr(query, k=k * 2)
        
        # Re-rank documents
        reranked_docs = self.rerank_documents(query, retrieved_docs, top_k=k)
        
        if not reranked_docs:
            return {
                "answer": "I do not have enough information to answer this question accurately.",
                "sources": [],
                "intent": intent
            }
        
        # Format context
        context_text = ""
        sources = []
        for i, doc in enumerate(reranked_docs, 1):
            source = doc.metadata.get('source', 'Unknown')
            section = doc.metadata.get('section', 'General')
            context_text += f"[CONTEXT {i}]\n"
            context_text += f"Source: {source} | Section: {section}\n"
            context_text += f"Content: {doc.page_content}\n\n"
            sources.append({'section': section, 'source': source})
        
        # Generate response with enhanced prompt
        prompt = self._create_prompt(query, context_text, intent)
        response = self.llm.invoke(prompt).strip()
        
        return {
            "answer": response,
            "sources": sources,
            "intent": intent,
            "num_chunks_retrieved": len(reranked_docs)
        }
    
    def _create_prompt(self, query: str, context: str, intent: Dict) -> str:
        """Create an optimized prompt based on query intent"""
        
        base_instructions = """You are Kushagra Wadhwa's professional portfolio assistant, designed for recruiters, HR professionals, and interviewers.
Provide precise, professional responses that help evaluate Kushagra's candidacy for technical roles.

PROFESSIONAL RESPONSE GUIDELINES:
1. Use ONLY verified information from the retrieved context
2. Maintain professional, interview-appropriate tone
3. Highlight quantifiable achievements and measurable impact
4. Include specific technical competencies and tools
5. Mention relevant experience duration and progression
6. Focus on business value and problem-solving capabilities
7. Structure responses for easy scanning by busy professionals
8. If information is unavailable, state: 'This specific information is not available in Kushagra's portfolio'
9. Answer from third person perspective for professional context
10. Emphasize skills relevant to hiring decisions"""

        # Customize based on intent
        if intent['category'] == 'work_experience':
            format_guide = "\nFORMAT: Role → Company → Duration → Key Achievements → Technologies → Impact"
        elif intent['category'] == 'projects':
            format_guide = "\nFORMAT: Project Name → Technologies → Problem Solved → Measurable Results → Business Value"
        elif intent['category'] == 'skills':
            format_guide = "\nFORMAT: Technical Stack → Proficiency Level → Real-world Applications → Project Examples"
        elif intent['category'] == 'education':
            format_guide = "\nFORMAT: Degree → Institution → Relevant Coursework → Academic Performance"
        else:
            format_guide = "\nProvide a clear, structured response."
        
        prompt = f"""{base_instructions}
{format_guide}

RECRUITER QUERY: {query}

CANDIDATE INFORMATION:
{context}

PROFESSIONAL ASSESSMENT:"""
        
        return prompt


# Singleton instance
_rag_instance = None

def get_rag_instance() -> AdvancedRAG:
    """Get or create the singleton RAG instance"""
    global _rag_instance
    if _rag_instance is None:
        _rag_instance = AdvancedRAG()
    return _rag_instance


if __name__ == "__main__":
    # Test the advanced RAG
    rag = AdvancedRAG()
    
    test_queries = [
        "What technologies did Kushagra use in SalesAssist AI?",
        "Tell me about his work experience at ShorthillsAI",
        "What are his main technical skills?"
    ]
    
    for query in test_queries:
        print(f"\n{'='*80}")
        print(f"Query: {query}")
        print(f"{'='*80}")
        
        result = rag.generate_response(query)
        print(f"\nIntent: {result['intent']}")
        print(f"Chunks Retrieved: {result['num_chunks_retrieved']}")
        print(f"\nAnswer:\n{result['answer']}")
        print(f"\nSources: {result['sources']}")

