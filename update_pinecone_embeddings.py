#!/usr/bin/env python3
"""
Update Pinecone Embeddings
Run this script whenever you update your data files to regenerate embeddings
"""

import sys
from pathlib import Path
from backend.rag.pinecone_store import create_pinecone_embeddings, clear_pinecone_index, get_pinecone_index

def main():
    print("=" * 60)
    print("🌲 Pinecone Embeddings Updater")
    print("=" * 60)
    
    # Ask for confirmation
    print("\n⚠️  This will:")
    print("   1. Clear all existing embeddings from Pinecone")
    print("   2. Re-generate embeddings from backend/data/")
    print("   3. Upload new embeddings to Pinecone")
    
    confirm = input("\n❓ Continue? (yes/no): ").lower().strip()
    
    if confirm not in ['yes', 'y']:
        print("❌ Cancelled")
        sys.exit(0)
    
    try:
        # Step 1: Clear existing embeddings
        print("\n🧹 Clearing existing embeddings...")
        clear_pinecone_index()
        
        # Step 2: Create new embeddings
        print("\n🔄 Creating new embeddings...")
        json_directory = "backend/data"
        create_pinecone_embeddings(
            json_directory=json_directory,
            chunk_size=512,
            overlap=120
        )
        
        # Step 3: Verify
        print("\n✅ Verifying...")
        index = get_pinecone_index()
        stats = index.describe_index_stats()
        
        print("\n" + "=" * 60)
        print("✅ SUCCESS!")
        print("=" * 60)
        print(f"📊 Total vectors in Pinecone: {stats['total_vector_count']}")
        print(f"🌲 Index name: chatfolio")
        print(f"📍 Dimension: 384")
        print("\n🚀 Your embeddings are updated and ready!")
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        sys.exit(1)


if __name__ == "__main__":
    main()

