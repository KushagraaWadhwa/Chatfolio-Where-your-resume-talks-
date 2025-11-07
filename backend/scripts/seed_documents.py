"""
Seed the database with static documents for deployment
This script creates document records in the database pointing to static files
served by the frontend, avoiding the need for persistent file storage on the backend.
"""

import sys
import os
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from backend.models import create_tables, get_db, Document
from sqlalchemy.orm import Session

# Static documents configuration
# These files are served from the frontend's public/documents folder
STATIC_DOCUMENTS = [
    {
        "title": "Resume - Kushagra Wadhwa",
        "description": "Professional resume showcasing AI/ML experience and software development skills",
        "filename": "KushagraWadhwa_Resume.pdf",
        "file_path": "static/documents/KushagraWadhwa_Resume.pdf",  # Virtual path
        "file_type": "pdf",
        "file_size": 0,
        "category": "resumes",
        "is_public": True
    },
    {
        "title": "IIT Madras - Data Science Diploma",
        "description": "Diploma in Data Science from IIT Madras",
        "filename": "Diploma DS.pdf",
        "file_path": "static/documents/Diploma DS.pdf",
        "file_type": "pdf",
        "file_size": 0,
        "category": "certificates",
        "is_public": True
    },
    {
        "title": "IIT Madras - Programming Diploma",
        "description": "Diploma in Programming from IIT Madras",
        "filename": "Diploma Prog.pdf",
        "file_path": "static/documents/Diploma Prog.pdf",
        "file_type": "pdf",
        "file_size": 0,
        "category": "certificates",
        "is_public": True
    },
    {
        "title": "IIT Madras - Foundation Certificate",
        "description": "Foundation Certificate from IIT Madras",
        "filename": "Foundation Cert.pdf",
        "file_path": "static/documents/Foundation Cert.pdf",
        "file_type": "pdf",
        "file_size": 0,
        "category": "certificates",
        "is_public": True
    },
    {
        "title": "GATE Scorecard",
        "description": "Graduate Aptitude Test in Engineering (GATE) Scorecard",
        "filename": "Gate Scorecard.pdf",
        "file_path": "static/documents/Gate Scorecard.pdf",
        "file_type": "pdf",
        "file_size": 0,
        "category": "certificates",
        "is_public": True
    }
]


def seed_documents():
    """Seed the database with static document records"""
    print("🌱 Seeding database with static documents...")
    
    # Create tables if they don't exist
    create_tables()
    
    # Get database session
    db = next(get_db())
    
    try:
        # Check if documents already exist
        existing_count = db.query(Document).count()
        
        if existing_count > 0:
            print(f"✅ Database already has {existing_count} documents. Skipping seed.")
            return
        
        # Add each static document
        for doc_data in STATIC_DOCUMENTS:
            document = Document(**doc_data)
            db.add(document)
            print(f"   ➕ Added: {doc_data['title']}")
        
        db.commit()
        print(f"✅ Successfully seeded {len(STATIC_DOCUMENTS)} documents!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding documents: {str(e)}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_documents()

