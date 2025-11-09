"""
Regenerate Pinecone Embeddings with Improved Chunking
Run this after updating backend data to refresh vector store
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from backend.rag.pinecone_store import create_pinecone_embeddings, get_pinecone_index

def regenerate_embeddings():
    """Regenerate all Pinecone embeddings with improved chunking"""
    print("=" * 80)
    print("REGENERATING PINECONE EMBEDDINGS")
    print("=" * 80)
    
    print("\n🗑️  Step 1: Clearing existing embeddings...")
    try:
        index = get_pinecone_index()
        stats = index.describe_index_stats()
        print(f"   Current vectors in index: {stats['total_vector_count']}")
        
        # Delete all vectors (fresh start)
        index.delete(delete_all=True)
        print("   ✅ Cleared all existing vectors")
    except Exception as e:
        print(f"   ⚠️  Could not clear index: {e}")
    
    print("\n📚 Step 2: Creating new embeddings with improved chunking...")
    json_directory = Path("backend/data")
    
    try:
        create_pinecone_embeddings(
            json_directory=str(json_directory),
            chunk_size=512,  # Good size for preserving context
            overlap=150  # Increased overlap for better context continuity
        )
        print("   ✅ Successfully created new embeddings!")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        raise
    
    print("\n✅ Step 3: Verifying new embeddings...")
    try:
        index = get_pinecone_index()
        stats = index.describe_index_stats()
        print(f"   Total vectors in index: {stats['total_vector_count']}")
        print(f"   Dimensions: {stats.get('dimension', 'N/A')}")
    except Exception as e:
        print(f"   ⚠️  Could not verify: {e}")
    
    print("\n" + "=" * 80)
    print("REGENERATION COMPLETE!")
    print("=" * 80)
    print("\n💡 Your RAG system now has:")
    print("   ✅ Updated work experience with current projects")
    print("   ✅ Better structured chunks for precise retrieval")
    print("   ✅ Enhanced metadata for filtering")
    print("   ✅ Improved context preservation")
    print("\n🚀 Deploy to production to see improvements!\n")


if __name__ == "__main__":
    regenerate_embeddings()

