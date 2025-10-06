#!/usr/bin/env python3
"""
Migration script to move documents from public folder to database-managed storage.
Run this script after setting up the database to migrate your existing documents.

Usage:
python -m backend.scripts.db.migrate_documents
"""

import os
import sys

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))

from backend.models import create_tables, get_db
from backend.document_service import DocumentService

def main():
    print("🚀 Starting document migration...")
    
    # Create database tables
    print("📊 Creating database tables...")
    create_tables()
    
    # Initialize document service
    document_service = DocumentService()
    
    # Get database session
    db = next(get_db())
    
    try:
        # Run migration
        print("📁 Migrating documents from public folder to database...")
        document_service.migrate_existing_documents(db)
        
        print("✅ Migration completed successfully!")
        print("\n📋 Summary:")
        print("- Documents have been moved from client/public/documents/ to backend/uploads/")
        print("- Document metadata has been stored in the database")
        print("- You can now safely remove the client/public/documents/ folder")
        print("- Documents are now served through the API with proper security")
        
        # List migrated documents
        documents = document_service.get_documents(db)
        print(f"\n📄 Migrated {len(documents)} documents:")
        for doc in documents:
            print(f"  - {doc.title} ({doc.category})")
        
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        return 1
    finally:
        db.close()
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
