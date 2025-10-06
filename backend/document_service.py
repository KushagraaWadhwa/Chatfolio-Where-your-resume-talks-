from sqlalchemy.orm import Session
from backend.models import Document, get_db
from typing import List, Optional
import os
import shutil
from pathlib import Path
import uuid
from fastapi import UploadFile, HTTPException
import aiofiles

class DocumentService:
    def __init__(self):
        self.upload_dir = Path("backend/uploads")
        self.upload_dir.mkdir(exist_ok=True)
        
        # Create subdirectories for different document types
        (self.upload_dir / "resumes").mkdir(exist_ok=True)
        (self.upload_dir / "certificates").mkdir(exist_ok=True)
        (self.upload_dir / "others").mkdir(exist_ok=True)
    
    def get_documents(self, db: Session, category: Optional[str] = None, public_only: bool = True) -> List[Document]:
        """Get all documents, optionally filtered by category"""
        query = db.query(Document)
        
        if public_only:
            query = query.filter(Document.is_public == True)
        
        if category:
            query = query.filter(Document.category == category)
        
        return query.order_by(Document.created_at.desc()).all()
    
    def get_document_by_id(self, db: Session, document_id: int) -> Optional[Document]:
        """Get a specific document by ID"""
        return db.query(Document).filter(Document.id == document_id).first()
    
    def create_document(self, db: Session, file: UploadFile, title: str, description: str = "", category: str = "others") -> Document:
        """Create a new document record and save the file"""
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Determine upload directory based on category
        category_dir = self.upload_dir / category
        file_path = category_dir / unique_filename
        
        # Save file
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
        
        # Get file size
        file_size = file_path.stat().st_size
        
        # Create database record
        document = Document(
            title=title,
            description=description,
            filename=unique_filename,
            file_path=str(file_path),
            file_type=file_extension[1:] if file_extension else "unknown",
            file_size=file_size,
            category=category
        )
        
        db.add(document)
        db.commit()
        db.refresh(document)
        
        return document
    
    def update_document(self, db: Session, document_id: int, title: Optional[str] = None, 
                       description: Optional[str] = None, category: Optional[str] = None,
                       is_public: Optional[bool] = None) -> Optional[Document]:
        """Update document metadata"""
        document = db.query(Document).filter(Document.id == document_id).first()
        
        if not document:
            return None
        
        if title is not None:
            document.title = title
        if description is not None:
            document.description = description
        if category is not None:
            document.category = category
        if is_public is not None:
            document.is_public = is_public
        
        db.commit()
        db.refresh(document)
        
        return document
    
    def delete_document(self, db: Session, document_id: int) -> bool:
        """Delete document and its file"""
        document = db.query(Document).filter(Document.id == document_id).first()
        
        if not document:
            return False
        
        # Delete file
        try:
            if os.path.exists(document.file_path):
                os.remove(document.file_path)
        except Exception as e:
            print(f"Warning: Failed to delete file {document.file_path}: {str(e)}")
        
        # Delete database record
        db.delete(document)
        db.commit()
        
        return True
    
    def increment_download_count(self, db: Session, document_id: int):
        """Increment download count for analytics"""
        document = db.query(Document).filter(Document.id == document_id).first()
        if document:
            document.download_count += 1
            db.commit()
    
    def migrate_existing_documents(self, db: Session):
        """Migrate existing documents from public folder to database"""
        public_docs_dir = Path("client/public/documents")
        
        if not public_docs_dir.exists():
            return
        
        # Document mappings from your current setup
        document_mappings = [
            {
                "filename": "KushagraWadhwa_Resume.pdf",
                "title": "Resume",
                "description": "My professional experience and skills",
                "category": "resumes"
            },
            {
                "filename": "Gate Scorecard.pdf",
                "title": "GATE DA 2025 Scorecard",
                "description": "GATE 2025 Data Science and Artificial Intelligence Scorecard",
                "category": "certificates"
            },
            {
                "filename": "Diploma DS.pdf",
                "title": "Certificate-Diploma in Data Science @IIT Madras",
                "description": "Certificate for completing Diploma in Data Science course",
                "category": "certificates"
            },
            {
                "filename": "Diploma Prog.pdf",
                "title": "Certificate-Diploma in Programming @IIT Madras",
                "description": "Certificate for completing Diploma in Programming course",
                "category": "certificates"
            },
            {
                "filename": "Foundation Cert.pdf",
                "title": "Foundational Certificate-Data Science and Programming @IIT Madras",
                "description": "Certificate for completing Foundational Level",
                "category": "certificates"
            }
        ]
        
        for mapping in document_mappings:
            source_file = public_docs_dir / mapping["filename"]
            if source_file.exists():
                # Check if document already exists in database
                existing = db.query(Document).filter(Document.filename == mapping["filename"]).first()
                if existing:
                    continue
                
                # Copy file to upload directory
                category_dir = self.upload_dir / mapping["category"]
                category_dir.mkdir(exist_ok=True)
                dest_file = category_dir / mapping["filename"]
                
                shutil.copy2(source_file, dest_file)
                
                # Create database record
                document = Document(
                    title=mapping["title"],
                    description=mapping["description"],
                    filename=mapping["filename"],
                    file_path=str(dest_file),
                    file_type="pdf",
                    file_size=dest_file.stat().st_size,
                    category=mapping["category"],
                    is_public=True
                )
                
                db.add(document)
        
        db.commit()
        print("Migration completed successfully!")
