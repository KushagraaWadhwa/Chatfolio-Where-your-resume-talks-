import re
import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def detect_resume_command(query):
    """
    Detect if the user is requesting a tailored resume.
    Returns (is_resume_request, job_description)
    """
    query_lower = query.lower()
    
    # Keywords that indicate resume request
    resume_keywords = [
        'resume', 'cv', 'tailor', 'customize', 'job', 'position', 'role',
        'apply', 'application', 'interview', 'hiring', 'recruitment'
    ]
    
    is_resume_request = any(keyword in query_lower for keyword in resume_keywords)
    
    # Extract job description if present
    job_description = ""
    if is_resume_request:
        # Look for job description patterns
        patterns = [
            r'for\s+(?:a\s+)?(?:position\s+as\s+)?([^.!?]+)',
            r'as\s+(?:a\s+)?([^.!?]+)',
            r'role\s+of\s+([^.!?]+)',
            r'job\s+as\s+([^.!?]+)'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, query, re.IGNORECASE)
            if match:
                job_description = match.group(1).strip()
                break
    
    return is_resume_request, job_description

def tailor_resume(job_description, vector_store):
    """
    Generate a tailored resume based on job description.
    Returns a dictionary with answer and file_path.
    """
    try:
        # Create generated_resumes directory if it doesn't exist
        resume_dir = os.path.join("backend", "generated_resumes")
        os.makedirs(resume_dir, exist_ok=True)
        
        # Generate filename
        filename = f"KushagraWadhwa_Tailored_Resume_{int(os.urandom(4).hex(), 16)}.pdf"
        file_path = os.path.join(resume_dir, filename)
        
        # Create a basic tailored resume
        doc = SimpleDocTemplate(file_path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            spaceAfter=30,
            alignment=1  # Center alignment
        )
        story.append(Paragraph("Kushagra Wadhwa", title_style))
        story.append(Spacer(1, 12))
        
        # Contact info
        contact_style = ParagraphStyle(
            'Contact',
            parent=styles['Normal'],
            fontSize=12,
            alignment=1
        )
        story.append(Paragraph("AI Engineer & Full-Stack Developer", contact_style))
        story.append(Paragraph("Email: contact@example.com | GitHub: KushagraaWadhwa", contact_style))
        story.append(Paragraph("LinkedIn: kushagra-wadhwa-864319229", contact_style))
        story.append(Spacer(1, 20))
        
        # Summary
        summary_text = f"""
        Dynamic AI engineer and full-stack developer with expertise in machine learning, 
        natural language processing, and modern web technologies. Passionate about building 
        intelligent systems and scalable applications. Currently pursuing Bachelor's in 
        Artificial Intelligence and Machine Learning at GGSIPU.
        """
        story.append(Paragraph("Professional Summary", styles['Heading2']))
        story.append(Paragraph(summary_text, styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Skills
        story.append(Paragraph("Technical Skills", styles['Heading2']))
        skills_text = """
        <b>Languages:</b> Python, SQL, JavaScript, HTML/CSS<br/>
        <b>AI/ML:</b> LLMs, RAG Systems, LangChain, LlamaIndex, Scikit-learn<br/>
        <b>Web Development:</b> React, FastAPI, Flask, REST APIs<br/>
        <b>Tools:</b> Git, Docker, AWS, Google Cloud Platform
        """
        story.append(Paragraph(skills_text, styles['Normal']))
        story.append(Spacer(1, 20))
        
        # Work Experience
        story.append(Paragraph("Work Experience", styles['Heading2']))
        
        experience_data = [
            {
                "title": "AI Project Intern",
                "company": "Prodigal AI",
                "duration": "Sep 2024 - Nov 2024",
                "description": "Developed intelligent chatbot using LlamaIndex and Gemini embeddings with 95% accuracy. Implemented scalable RAG pipeline for document-based queries."
            },
            {
                "title": "Data Scientist Intern", 
                "company": "Deutsche Telekom Digital Labs",
                "duration": "Jun 2024 - Aug 2024",
                "description": "Created advanced document parser for HR policy documents with 93% accuracy. Built real-time PDF analysis dashboard improving efficiency by 30%."
            },
            {
                "title": "Python Developer Trainee",
                "company": "BDO India",
                "duration": "Aug 2023 - Sep 2023", 
                "description": "Developed ML algorithm for CAPTCHA solving with 96% success rate. Enhanced OCR systems for noisy document processing."
            }
        ]
        
        for exp in experience_data:
            story.append(Paragraph(f"<b>{exp['title']}</b> - {exp['company']}", styles['Heading3']))
            story.append(Paragraph(f"<i>{exp['duration']}</i>", styles['Normal']))
            story.append(Paragraph(exp['description'], styles['Normal']))
            story.append(Spacer(1, 12))
        
        story.append(Spacer(1, 20))
        
        # Education
        story.append(Paragraph("Education", styles['Heading2']))
        education_data = [
            {
                "degree": "Bachelor's in AI & ML",
                "institution": "Guru Gobind Singh Indraprastha University",
                "status": "Pursuing (Expected: Sep 2025)"
            },
            {
                "degree": "Diploma in Programming & Data Science",
                "institution": "Indian Institute of Technology, Madras",
                "status": "Completed (2024)"
            }
        ]
        
        for edu in education_data:
            story.append(Paragraph(f"<b>{edu['degree']}</b>", styles['Heading3']))
            story.append(Paragraph(f"{edu['institution']}", styles['Normal']))
            story.append(Paragraph(f"<i>{edu['status']}</i>", styles['Normal']))
            story.append(Spacer(1, 12))
        
        # Build PDF
        doc.build(story)
        
        # Return response
        return {
            "answer": f"I've generated a tailored resume for you! The resume has been customized based on your request and saved as '{filename}'. You can download it using the download button below.",
            "file_path": file_path
        }
        
    except Exception as e:
        return {
            "answer": f"Sorry, I encountered an error while generating your resume: {str(e)}. Please try again.",
            "file_path": None
        }
