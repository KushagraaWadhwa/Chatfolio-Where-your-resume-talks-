#!/usr/bin/env python3
"""
Resume Data Update Script

This script automates the process of:
1. Parsing a new resume PDF
2. Updating the relevant JSON data files
3. Triggering a regeneration of the vector database embeddings

Usage:
python -m backend.scripts.resume.update_resume_data --resume_path /path/to/new/resume.pdf
"""

import os
import sys
import json
import argparse
import shutil
from pathlib import Path
import time

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))))

from backend.data.resume_parser import extract_pdf, parse_resume_with_gemini
from backend.rag.auto_update import manual_update

def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="Update resume data and regenerate embeddings")
    parser.add_argument("--resume_path", 
                        type=str, 
                        default="backend/data/KushagraWadhwa_Resume.pdf",
                        help="Path to the new resume PDF")
    return parser.parse_args()

def backup_json_files(data_dir):
    """Create backups of existing JSON files."""
    backup_dir = Path(data_dir) / "backups"
    backup_dir.mkdir(exist_ok=True)
    
    print(f"📦 Creating backups in {backup_dir}")
    
    for json_file in Path(data_dir).glob("*.json"):
        if json_file.name != "backups":
            backup_path = backup_dir / f"{json_file.stem}_{int(time.time())}.json"
            shutil.copy2(json_file, backup_path)
            print(f"  ↳ Backed up {json_file.name}")
    
    return backup_dir

def parse_resume(resume_path):
    """Parse the resume PDF into structured data."""
    print(f"📄 Parsing resume from {resume_path}")
    
    try:
        resume_text, links = extract_pdf(resume_path)
        if not resume_text:
            print("❌ Failed to extract text from PDF")
            return None
            
        structured_data = parse_resume_with_gemini(resume_text, links)
        if not structured_data:
            print("❌ Failed to parse resume with Gemini")
            return None
            
        print("✅ Successfully parsed resume")
        return structured_data
    except Exception as e:
        print(f"❌ Error parsing resume: {str(e)}")
        return None

def update_parsed_resume(data_dir, structured_data):
    """Update the parsed_resume.json file."""
    output_path = Path(data_dir) / "parsed_resume.json"
    
    with open(output_path, "w") as f:
        json.dump(structured_data, f, indent=2)
    
    print(f"✅ Updated {output_path}")
    return True

def update_work_experience(data_dir, structured_data):
    """Update work_experience.json with new data."""
    work_exp_path = Path(data_dir) / "work_experience.json"
    
    # Load existing work experience data
    try:
        with open(work_exp_path, "r") as f:
            work_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        work_data = {"Work_Experience": []}
    
    # Transform resume work experience to match our format
    new_work_experiences = []
    
    for job in structured_data.get("Work Experience", []):
        # Extract start and end dates
        duration = job.get("Duration", "")
        dates = duration.split("–") if "–" in duration else duration.split("-")
        
        start_date = dates[0].strip() if len(dates) > 0 else ""
        end_date = dates[1].strip() if len(dates) > 1 else "Present"
        
        # Create new work experience entry
        new_exp = {
            "Title": job.get("Role", ""),
            "Company": job.get("Company", ""),
            "Location": "Remote",  # Default if not specified
            "Start_Date": start_date,
            "End_Date": end_date,
            "Responsibilities": [job.get("Responsibilities", "")],
            "Technologies_Used": []  # Will need manual update
        }
        
        new_work_experiences.append(new_exp)
    
    # Replace or merge work experiences
    # Option 1: Replace all work experiences
    work_data["Work_Experience"] = new_work_experiences
    
    # Option 2: Merge with existing (uncomment if preferred)
    # existing_companies = [job["Company"] for job in work_data["Work_Experience"]]
    # for new_job in new_work_experiences:
    #     if new_job["Company"] not in existing_companies:
    #         work_data["Work_Experience"].append(new_job)
    
    # Save updated work experience
    with open(work_exp_path, "w") as f:
        json.dump(work_data, f, indent=2)
    
    print(f"✅ Updated {work_exp_path}")
    return True

def update_projects(data_dir, structured_data):
    """Update projects.json with new data."""
    projects_path = Path(data_dir) / "projects.json"
    
    # Load existing projects data
    try:
        with open(projects_path, "r") as f:
            projects_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        projects_data = {"Projects": {"Artificial Intelligence": [], "Data Science": [], "Software Engineering": []}}
    
    # Transform resume projects to match our format
    new_projects = []
    
    for project in structured_data.get("Projects", []):
        # Determine category based on technologies
        tech_str = project.get("Technologies Used", "").lower()
        category = "Artificial Intelligence"
        
        if "ai" in tech_str or "llm" in tech_str or "ml" in tech_str:
            category = "Artificial Intelligence"
        elif "data" in tech_str or "python" in tech_str:
            category = "Data Science"
        else:
            category = "Software Engineering"
            
        # Create new project entry
        new_proj = {
            "Project_Name": project.get("Name", ""),
            "Short_Name": project.get("Name", "").split(":")[0] if ":" in project.get("Name", "") else project.get("Name", ""),
            "Description": project.get("Description", ""),
            "Technologies": [tech.strip() for tech in project.get("Technologies Used", "").split(",")],
            "Core_Features": []  # Will need manual update
        }
        
        # Extract features from description
        description = project.get("Description", "")
        if "Key Features:" in description:
            features_text = description.split("Key Features:")[1]
            features = [f.strip() for f in features_text.split("o") if f.strip()]
            if features:
                new_proj["Core_Features"] = features
        
        # Add to appropriate category
        if category not in projects_data["Projects"]:
            projects_data["Projects"][category] = []
            
        projects_data["Projects"][category].append(new_proj)
    
    # Save updated projects
    with open(projects_path, "w") as f:
        json.dump(projects_data, f, indent=2)
    
    print(f"✅ Updated {projects_path}")
    return True

def update_education(data_dir, structured_data):
    """Update education.json with new data."""
    education_path = Path(data_dir) / "education.json"
    
    # Load existing education data
    try:
        with open(education_path, "r") as f:
            education_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        education_data = {"Education": []}
    
    # Transform resume education to match our format
    new_education = []
    
    for edu in structured_data.get("Education", []):
        # Parse degree information
        degree_info = edu.get("Degree", "").split()
        degree_type = degree_info[0] if degree_info else "Bachelor's degree"
        
        # Extract year information
        year_info = edu.get("Year", "")
        completion_year = "2025"  # Default
        status = "Pursuing"
        
        if "Pursuing" in year_info:
            status = "Pursuing"
            if "-" in year_info:
                years = year_info.split("-")
                if len(years) > 1:
                    completion_year = years[1].replace("(Pursuing)", "").strip()
        
        # Create new education entry
        new_edu = {
            "Degree": degree_type,
            "Field": " ".join(degree_info[1:]) if len(degree_info) > 1 else "",
            "Institution": edu.get("University", ""),
            "Status": status,
            "Expected_Completion": f"September {completion_year}" if status == "Pursuing" else "",
            "Coursework": []  # Will need manual update
        }
        
        new_education.append(new_edu)
    
    # Replace or merge education entries
    # Option 1: Replace all education entries
    education_data["Education"] = new_education
    
    # Option 2: Merge with existing (uncomment if preferred)
    # existing_institutions = [edu["Institution"] for edu in education_data["Education"]]
    # for new_edu in new_education:
    #     if new_edu["Institution"] not in existing_institutions:
    #         education_data["Education"].append(new_edu)
    
    # Save updated education data
    with open(education_path, "w") as f:
        json.dump(education_data, f, indent=2)
    
    print(f"✅ Updated {education_path}")
    return True

def update_others(data_dir, structured_data):
    """Update others.json with new data if needed."""
    # This is typically more static information that might not change with resume updates
    # But we can extract any personal information if available
    
    others_path = Path(data_dir) / "others.json"
    
    # Load existing others data
    try:
        with open(others_path, "r") as f:
            others_data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        others_data = {}
    
    # No need to update if no new personal info in resume
    # Just keep this function for completeness
    
    print(f"ℹ️ No updates needed for {others_path}")
    return True

def trigger_embedding_regeneration():
    """Trigger the regeneration of embeddings."""
    print("🔄 Triggering embedding regeneration...")
    
    try:
        manual_update()
        print("✅ Embeddings regenerated successfully")
        return True
    except Exception as e:
        print(f"❌ Error regenerating embeddings: {str(e)}")
        return False

def main():
    """Main function to update resume data and regenerate embeddings."""
    args = parse_args()
    data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
    
    print("\n🚀 Starting resume data update process...")
    
    # Step 1: Create backups
    backup_dir = backup_json_files(data_dir)
    print(f"✅ Created backups in {backup_dir}")
    
    # Step 2: Parse the resume
    structured_data = parse_resume(args.resume_path)
    if not structured_data:
        print("❌ Failed to parse resume. Aborting.")
        return 1
    
    # Step 3: Update JSON files
    update_parsed_resume(data_dir, structured_data)
    update_work_experience(data_dir, structured_data)
    update_projects(data_dir, structured_data)
    update_education(data_dir, structured_data)
    update_others(data_dir, structured_data)
    
    # Step 4: Trigger embedding regeneration
    trigger_embedding_regeneration()
    
    print("\n✅ Resume data update completed successfully!")
    print("📊 Your RAG system now has the latest resume data.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
