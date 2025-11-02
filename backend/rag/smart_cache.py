"""
Intelligent Caching System for RAG
Implements semantic caching to avoid redundant LLM calls for similar queries.
"""

import os
import json
import hashlib
import time
from typing import Dict, Optional, List, Tuple
from datetime import datetime, timedelta
import numpy as np
from sentence_transformers import SentenceTransformer
from pathlib import Path


class SemanticCache:
    """
    Semantic cache that stores responses and retrieves them based on
    semantic similarity rather than exact string matching.
    """
    
    def __init__(
        self, 
        cache_file: str = "backend/cache/semantic_cache.json",
        similarity_threshold: float = 0.85,
        max_cache_size: int = 1000,
        ttl_hours: int = 24
    ):
        self.cache_file = Path(cache_file)
        self.similarity_threshold = similarity_threshold
        self.max_cache_size = max_cache_size
        self.ttl_hours = ttl_hours
        
        # Initialize embedding model for semantic similarity
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Cache structure: {query_hash: {query, embedding, response, metadata, timestamp}}
        self.cache = {}
        self.query_embeddings = []
        self.query_hashes = []
        
        # Load existing cache
        self._load_cache()
    
    def _load_cache(self):
        """Load cache from disk"""
        if self.cache_file.exists():
            try:
                with open(self.cache_file, 'r') as f:
                    data = json.load(f)
                    self.cache = data.get('cache', {})
                    
                # Rebuild embeddings and hashes
                self._rebuild_index()
                
                # Clean expired entries
                self._clean_expired()
                
                print(f"✅ Loaded cache with {len(self.cache)} entries")
            except Exception as e:
                print(f"⚠️  Failed to load cache: {e}")
                self.cache = {}
        else:
            # Create cache directory if it doesn't exist
            self.cache_file.parent.mkdir(parents=True, exist_ok=True)
            self.cache = {}
    
    def _rebuild_index(self):
        """Rebuild the embedding index from cache"""
        self.query_embeddings = []
        self.query_hashes = []
        
        for query_hash, entry in self.cache.items():
            if 'embedding' in entry:
                self.query_embeddings.append(entry['embedding'])
                self.query_hashes.append(query_hash)
    
    def _save_cache(self):
        """Save cache to disk"""
        try:
            with open(self.cache_file, 'w') as f:
                json.dump({'cache': self.cache}, f, indent=2)
        except Exception as e:
            print(f"⚠️  Failed to save cache: {e}")
    
    def _clean_expired(self):
        """Remove expired cache entries"""
        current_time = datetime.now()
        expired_keys = []
        
        for query_hash, entry in self.cache.items():
            timestamp = datetime.fromisoformat(entry['timestamp'])
            if current_time - timestamp > timedelta(hours=self.ttl_hours):
                expired_keys.append(query_hash)
        
        for key in expired_keys:
            del self.cache[key]
        
        if expired_keys:
            self._rebuild_index()
            print(f"🧹 Cleaned {len(expired_keys)} expired cache entries")
    
    def _enforce_size_limit(self):
        """Enforce maximum cache size by removing oldest entries"""
        if len(self.cache) > self.max_cache_size:
            # Sort by timestamp and remove oldest
            sorted_entries = sorted(
                self.cache.items(),
                key=lambda x: x[1]['timestamp']
            )
            
            num_to_remove = len(self.cache) - self.max_cache_size
            for query_hash, _ in sorted_entries[:num_to_remove]:
                del self.cache[query_hash]
            
            self._rebuild_index()
            print(f"🧹 Removed {num_to_remove} old cache entries to enforce size limit")
    
    def _compute_hash(self, query: str) -> str:
        """Compute a hash for the query"""
        return hashlib.md5(query.lower().strip().encode()).hexdigest()
    
    def _compute_embedding(self, query: str) -> List[float]:
        """Compute embedding for a query"""
        embedding = self.embedding_model.encode(query, convert_to_numpy=True)
        return embedding.tolist()
    
    def _find_similar(self, query_embedding: List[float]) -> Optional[Tuple[str, float]]:
        """
        Find the most similar cached query.
        Returns (query_hash, similarity_score) or None.
        """
        if not self.query_embeddings:
            return None
        
        # Convert to numpy arrays
        query_emb = np.array(query_embedding)
        cached_embs = np.array(self.query_embeddings)
        
        # Compute cosine similarity
        similarities = np.dot(cached_embs, query_emb) / (
            np.linalg.norm(cached_embs, axis=1) * np.linalg.norm(query_emb)
        )
        
        # Find most similar
        max_idx = np.argmax(similarities)
        max_similarity = similarities[max_idx]
        
        if max_similarity >= self.similarity_threshold:
            return (self.query_hashes[max_idx], float(max_similarity))
        
        return None
    
    def get(self, query: str) -> Optional[Dict]:
        """
        Retrieve cached response for a semantically similar query.
        
        Returns:
            Dict with response and metadata if found, None otherwise
        """
        # Clean expired entries periodically
        if len(self.cache) > 0 and np.random.random() < 0.1:  # 10% chance
            self._clean_expired()
        
        # Compute query embedding
        query_embedding = self._compute_embedding(query)
        
        # Find similar query
        similar = self._find_similar(query_embedding)
        
        if similar:
            query_hash, similarity = similar
            cached_entry = self.cache[query_hash]
            
            print(f"✨ Cache hit! Similarity: {similarity:.3f}")
            print(f"   Original query: {cached_entry['query']}")
            print(f"   Current query:  {query}")
            
            # Update access timestamp
            cached_entry['last_accessed'] = datetime.now().isoformat()
            cached_entry['access_count'] = cached_entry.get('access_count', 0) + 1
            
            return {
                'response': cached_entry['response'],
                'metadata': cached_entry.get('metadata', {}),
                'from_cache': True,
                'similarity': similarity,
                'original_query': cached_entry['query']
            }
        
        return None
    
    def set(self, query: str, response: str, metadata: Optional[Dict] = None):
        """
        Store a query-response pair in the cache.
        
        Args:
            query: The user query
            response: The generated response
            metadata: Optional metadata about the response
        """
        query_hash = self._compute_hash(query)
        query_embedding = self._compute_embedding(query)
        
        # Create cache entry
        entry = {
            'query': query,
            'embedding': query_embedding,
            'response': response,
            'metadata': metadata or {},
            'timestamp': datetime.now().isoformat(),
            'last_accessed': datetime.now().isoformat(),
            'access_count': 0
        }
        
        # Add to cache
        self.cache[query_hash] = entry
        self.query_embeddings.append(query_embedding)
        self.query_hashes.append(query_hash)
        
        # Enforce size limit
        self._enforce_size_limit()
        
        # Save to disk
        self._save_cache()
        
        print(f"💾 Cached response for: {query}")
    
    def clear(self):
        """Clear the entire cache"""
        self.cache = {}
        self.query_embeddings = []
        self.query_hashes = []
        self._save_cache()
        print("🧹 Cache cleared")
    
    def get_stats(self) -> Dict:
        """Get cache statistics"""
        if not self.cache:
            return {
                'total_entries': 0,
                'cache_size_mb': 0,
                'oldest_entry': None,
                'newest_entry': None,
                'total_accesses': 0
            }
        
        timestamps = [datetime.fromisoformat(e['timestamp']) for e in self.cache.values()]
        total_accesses = sum(e.get('access_count', 0) for e in self.cache.values())
        
        # Estimate cache size
        cache_size_bytes = len(json.dumps(self.cache).encode('utf-8'))
        
        return {
            'total_entries': len(self.cache),
            'cache_size_mb': cache_size_bytes / (1024 * 1024),
            'oldest_entry': min(timestamps).isoformat(),
            'newest_entry': max(timestamps).isoformat(),
            'total_accesses': total_accesses,
            'avg_accesses_per_entry': total_accesses / len(self.cache) if self.cache else 0
        }


# Singleton instance
_cache_instance = None

def get_cache_instance() -> SemanticCache:
    """Get or create the singleton cache instance"""
    global _cache_instance
    if _cache_instance is None:
        _cache_instance = SemanticCache()
    return _cache_instance


if __name__ == "__main__":
    # Test the cache
    cache = SemanticCache()
    
    # Test set and get
    cache.set(
        "What projects has Kushagra worked on?",
        "Kushagra has worked on several projects including SalesAssist AI, Recipe Rating ML, and more.",
        metadata={'source': 'test'}
    )
    
    # Test exact match
    result = cache.get("What projects has Kushagra worked on?")
    print(f"\nExact match: {result is not None}")
    
    # Test semantic similarity
    result = cache.get("Tell me about Kushagra's projects")
    print(f"\nSemantic match: {result is not None}")
    if result:
        print(f"Response: {result['response']}")
        print(f"Similarity: {result['similarity']}")
    
    # Test no match
    result = cache.get("What is the weather today?")
    print(f"\nNo match: {result is None}")
    
    # Get stats
    stats = cache.get_stats()
    print(f"\nCache Stats:")
    print(json.dumps(stats, indent=2))

