"""
RAG Configuration for Performance Optimization
Tune these settings for speed vs accuracy tradeoff

IMPORTANT: These settings directly affect your Gemini API usage and costs!
"""
import os

# === API COST OPTIMIZATIONS ===

# Skip slow LLM-based intent classification (use fast keyword matching instead)
# Setting to True SAVES 1 API call per query (50% reduction!)
# Set to False for more accurate but slower classification + 2x API calls
SKIP_INTENT_CLASSIFICATION = os.getenv("SKIP_INTENT_CLASSIFICATION", "true").lower() == "true"

# Reduce chunk retrieval for faster response
# Lower = fewer tokens sent to API = lower cost
# Default: 4 (was 8-12, which sent 3x more context!)
DEFAULT_TOP_K = int(os.getenv("DEFAULT_TOP_K", "4"))

# Chunk sizes for embeddings (smaller = faster + less tokens)
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "400"))  # Default: 400 (was 512)
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "80"))  # Default: 80 (was 120)

# Response caching - CRITICAL FOR SAVING API CALLS!
# Repeated questions = 0 API calls (free!)
ENABLE_RESPONSE_CACHE = os.getenv("ENABLE_RESPONSE_CACHE", "true").lower() == "true"
CACHE_SIZE = int(os.getenv("CACHE_SIZE", "100"))  # Cache last 100 queries

# Model selection (flash models are faster)
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash-exp")

# === RENDER-SPECIFIC OPTIMIZATIONS ===

# Timeout settings (Render has 30s timeout on free tier)
REQUEST_TIMEOUT = int(os.getenv("REQUEST_TIMEOUT", "25"))  # 25 seconds max

# Connection pooling
PINECONE_POOL_SIZE = int(os.getenv("PINECONE_POOL_SIZE", "5"))

print(f"""
⚡ RAG Performance & Cost Optimization:
   - Intent Classification: {'Keyword-based (SAVES 1 API call/query!)' if SKIP_INTENT_CLASSIFICATION else 'LLM-based (2x API calls)'}
   - Top K Chunks: {DEFAULT_TOP_K} (reduced from 8-12 = 60% less tokens!)
   - Chunk Size: {CHUNK_SIZE} (overlap: {CHUNK_OVERLAP})
   - Response Cache: {'Enabled (repeated queries = FREE!)' if ENABLE_RESPONSE_CACHE else 'Disabled'}
   - Model: {GEMINI_MODEL}
   
💰 Expected API Usage Reduction: ~70-80% vs old config
""")

