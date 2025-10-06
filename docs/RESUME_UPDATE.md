# Resume Update System Documentation

This document explains how to update your resume data in the Chatfolio RAG system.

## Overview

The resume update system allows you to:
1. Parse a new resume PDF into structured data
2. Update the relevant JSON files in your data directory
3. Automatically regenerate embeddings for the RAG system

## Prerequisites

- Python 3.8+
- All dependencies from `requirements.txt`
- A Gemini API key (for resume parsing)

## How to Update Your Resume

### Step 1: Add Your New Resume

Place your updated resume PDF in the appropriate location:
```
backend/data/KushagraWadhwa_Resume.pdf
```

### Step 2: Run the Update Script

Execute the update script:
```bash
python -m backend.scripts.resume.update_resume_data
```

You can also specify a custom path to your resume:
```bash
python -m backend.scripts.resume.update_resume_data --resume_path /path/to/your/resume.pdf
```

### Step 3: Verify the Updates

The script will:
1. Create backups of your existing JSON files in `backend/data/backups/`
2. Parse your resume using the Gemini API
3. Update the following JSON files:
   - `parsed_resume.json` (complete resume data)
   - `work_experience.json` (work history)
   - `projects.json` (project details)
   - `education.json` (education history)
4. Trigger the regeneration of embeddings in your vector database

### Step 4: Manual Review and Enhancements

After running the script, you should:
1. Review the updated JSON files to ensure accuracy
2. Add any missing details that weren't captured from the PDF
3. Enhance the data with additional context if needed

## How It Works

### Resume Parsing

The system uses:
- `pdfplumber` to extract text and links from your PDF
- Google's Gemini API to parse the text into structured data

### JSON Updates

The script updates several JSON files:
- `parsed_resume.json`: Contains the complete parsed resume
- `work_experience.json`: Work history with detailed responsibilities
- `projects.json`: Projects categorized by domain (AI, Data Science, Software Engineering)
- `education.json`: Educational background and coursework

### Vector Database Updates

The system leverages the existing auto-update mechanism:
1. The script triggers a manual update of the vector database
2. This removes the old vector store and creates a new one with updated data
3. The RAG system immediately begins using the new embeddings

## Troubleshooting

### Common Issues

1. **Parse Error**: If the resume parsing fails, check:
   - Your Gemini API key is valid and set in your environment
   - The PDF is properly formatted and readable
   - Try running the `resume_parser.py` script directly for debugging

2. **JSON Update Error**: If JSON updates fail:
   - Check the backup files in `backend/data/backups/`
   - Restore them if needed and try again with fixes

3. **Embedding Regeneration Error**: If embedding updates fail:
   - Check the Chroma DB directory permissions
   - Ensure all required libraries are installed
   - Try running the embedding regeneration manually

## Advanced Usage

### Custom Data Integration

If you have custom data that isn't in your resume but should be in the RAG system:
1. Edit the JSON files directly after running the update script
2. Manually trigger embedding regeneration:
   ```python
   from backend.rag.auto_update import manual_update
   manual_update()
   ```

### Scheduled Updates

To set up automatic updates when your resume changes:
1. Use a file watcher or cron job to monitor your resume file
2. Trigger the update script when changes are detected
