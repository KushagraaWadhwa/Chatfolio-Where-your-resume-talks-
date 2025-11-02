"""
Unified RAG System
Integrates all advanced features:
- Advanced RAG with query rewriting and re-ranking
- Agentic system with tool calling
- Semantic caching
- Query optimization
"""

import os
from typing import Dict, Optional
from .advanced_rag import get_rag_instance
from .agent_system import get_agent_instance
from .smart_cache import get_cache_instance
from .github_stats import get_github_stats
from .resume_tailoring import tailor_resume
import logging

logger = logging.getLogger(__name__)


class UnifiedRAGSystem:
    """
    Unified RAG system that combines all advanced features.
    """
    
    def __init__(self, use_cache: bool = True, use_agent: bool = True):
        self.use_cache = use_cache
        self.use_agent = use_agent
        
        # Initialize components
        self.rag = get_rag_instance()
        self.cache = get_cache_instance() if use_cache else None
        self.agent = get_agent_instance() if use_agent else None
        
        # Connect agent tools to actual implementations
        if self.agent:
            self._connect_agent_tools()
        
        logger.info(f"UnifiedRAGSystem initialized (cache={use_cache}, agent={use_agent})")
    
    def _connect_agent_tools(self):
        """Connect agent tool placeholders to actual implementations"""
        
        def rag_search_impl(query: str) -> str:
            """Actual RAG search implementation"""
            result = self.rag.generate_response(query, use_hybrid=True)
            return result['answer']
        
        def github_stats_impl(query: str) -> str:
            """Actual GitHub stats implementation"""
            try:
                stats = get_github_stats(query)
                return f"GitHub Stats Retrieved: {stats}"
            except Exception as e:
                return f"Failed to retrieve GitHub stats: {str(e)}"
        
        def resume_tailor_impl(job_description: str) -> str:
            """Actual resume tailoring implementation"""
            try:
                # Note: This requires vector_store, which should be passed
                result = tailor_resume(job_description, self.rag.vector_store)
                return f"Resume tailored successfully. File: {result.get('file_path', 'N/A')}"
            except Exception as e:
                return f"Failed to tailor resume: {str(e)}"
        
        # Set implementations
        self.agent.set_tool_implementation('rag_search', rag_search_impl)
        self.agent.set_tool_implementation('github_stats', github_stats_impl)
        self.agent.set_tool_implementation('resume_tailor', resume_tailor_impl)
    
    def process_query(
        self, 
        query: str,
        use_cache: Optional[bool] = None,
        use_agent: Optional[bool] = None,
        return_metadata: bool = False
    ) -> Dict:
        """
        Process a query using the unified RAG system.
        
        Args:
            query: User query
            use_cache: Override default cache setting
            use_agent: Override default agent setting
            return_metadata: Whether to return detailed metadata
        
        Returns:
            Dict with response and optional metadata
        """
        _use_cache = use_cache if use_cache is not None else self.use_cache
        _use_agent = use_agent if use_agent is not None else self.use_agent
        
        metadata = {
            'from_cache': False,
            'used_agent': False,
            'processing_time_ms': 0
        }
        
        import time
        start_time = time.time()
        
        try:
            # Step 1: Check cache
            if _use_cache and self.cache:
                cached_result = self.cache.get(query)
                if cached_result:
                    metadata['from_cache'] = True
                    metadata['cache_similarity'] = cached_result.get('similarity', 0)
                    metadata['processing_time_ms'] = (time.time() - start_time) * 1000
                    
                    response = {
                        'answer': cached_result['response'],
                        'type': 'text'
                    }
                    
                    if return_metadata:
                        response['metadata'] = metadata
                    
                    return response
            
            # Step 2: Use agent or direct RAG
            if _use_agent and self.agent:
                # Use agentic system for reasoning and tool selection
                result = self.agent.process_query(query)
                answer = result['response']
                metadata['used_agent'] = True
                metadata['agent_plan'] = result.get('plan', {})
                metadata['agent_reasoning'] = result.get('reasoning', '')
                
            else:
                # Use direct RAG
                result = self.rag.generate_response(query, use_hybrid=True)
                answer = result['answer']
                metadata['intent'] = result.get('intent', {})
                metadata['sources'] = result.get('sources', [])
                metadata['num_chunks'] = result.get('num_chunks_retrieved', 0)
            
            # Step 3: Cache the result
            if _use_cache and self.cache:
                self.cache.set(query, answer, metadata=metadata)
            
            metadata['processing_time_ms'] = (time.time() - start_time) * 1000
            
            response = {
                'answer': answer,
                'type': 'text'
            }
            
            if return_metadata:
                response['metadata'] = metadata
            
            return response
        
        except Exception as e:
            logger.error(f"Error processing query: {str(e)}")
            metadata['error'] = str(e)
            metadata['processing_time_ms'] = (time.time() - start_time) * 1000
            
            response = {
                'answer': "I apologize, but I encountered an error while processing your request. Please try again.",
                'type': 'error'
            }
            
            if return_metadata:
                response['metadata'] = metadata
            
            return response
    
    def get_cache_stats(self) -> Dict:
        """Get cache statistics"""
        if self.cache:
            return self.cache.get_stats()
        return {'error': 'Cache not enabled'}
    
    def clear_cache(self):
        """Clear the cache"""
        if self.cache:
            self.cache.clear()
    
    def health_check(self) -> Dict:
        """Check health of all components"""
        health = {
            'status': 'healthy',
            'components': {}
        }
        
        try:
            # Check RAG
            if self.rag and self.rag.vector_store:
                health['components']['rag'] = {
                    'status': 'healthy',
                    'vector_store_initialized': True
                }
            else:
                health['components']['rag'] = {
                    'status': 'unhealthy',
                    'vector_store_initialized': False
                }
                health['status'] = 'degraded'
            
            # Check cache
            if self.cache:
                cache_stats = self.cache.get_stats()
                health['components']['cache'] = {
                    'status': 'healthy',
                    'entries': cache_stats.get('total_entries', 0)
                }
            else:
                health['components']['cache'] = {
                    'status': 'disabled'
                }
            
            # Check agent
            if self.agent:
                health['components']['agent'] = {
                    'status': 'healthy',
                    'tools_registered': len(self.agent.tools)
                }
            else:
                health['components']['agent'] = {
                    'status': 'disabled'
                }
        
        except Exception as e:
            health['status'] = 'unhealthy'
            health['error'] = str(e)
        
        return health


# Singleton instance
_unified_rag = None

def get_unified_rag(use_cache: bool = True, use_agent: bool = True) -> UnifiedRAGSystem:
    """Get or create the unified RAG system"""
    global _unified_rag
    if _unified_rag is None:
        _unified_rag = UnifiedRAGSystem(use_cache=use_cache, use_agent=use_agent)
    return _unified_rag


# Backward compatible function for existing code
def generate_response(query: str) -> Dict:
    """
    Generate a response using the unified RAG system.
    Maintains backward compatibility with existing code.
    
    Args:
        query: User query
    
    Returns:
        Dict with 'answer' key and response text
    """
    rag = get_unified_rag(use_cache=True, use_agent=True)
    result = rag.process_query(query, return_metadata=False)
    
    # Return in the expected format
    return {
        'answer': result.get('answer', 'I apologize, but I could not generate a response.')
    }


if __name__ == "__main__":
    # Test the unified system
    rag = UnifiedRAGSystem(use_cache=True, use_agent=True)
    
    # Health check
    print("Health Check:")
    print(rag.health_check())
    
    # Test queries
    test_queries = [
        "Hi there!",
        "What AI projects has Kushagra worked on?",
        "Tell me about his experience at ShorthillsAI",
        "What AI projects has Kushagra worked on?"  # Should hit cache
    ]
    
    for query in test_queries:
        print(f"\n{'='*80}")
        print(f"Query: {query}")
        print(f"{'='*80}")
        
        result = rag.process_query(query, return_metadata=True)
        
        print(f"\nAnswer: {result['answer']}")
        print(f"\nMetadata:")
        for key, value in result.get('metadata', {}).items():
            print(f"  {key}: {value}")
    
    # Cache stats
    print(f"\n{'='*80}")
    print("Cache Statistics:")
    print(rag.get_cache_stats())

