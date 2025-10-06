import pdfplumber
import json
import google.generativeai as genai
import os
from dotenv import load_dotenv
import regex as re

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))  # Load API key from .env file

def clean_text(text):
    """Remove unwanted characters like \u2013 (en dash) and other unicode artifacts."""
    return re.sub(r"\\u[0-9A-Fa-f]{4}", "-", text)

def extract_pdf(pdf_path):
    """Extract text and hyperlinks from a PDF file."""
    extracted_text = []
    links = []
    
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            if page.extract_text():
                extracted_text.append(clean_text(page.extract_text()))  
            if "annots" in page.to_dict():
                for annot in page.to_dict()["annots"]:
                    if annot.get("uri"):
                        links.append(annot["uri"])
    
    return "\n".join(extracted_text), links

def parse_resume_with_gemini(resume_text, links):
    """Use Gemini Flash 2 to extract structured resume data."""
    prompt = (
        "You are an excellent Resume Parser.Extract the following structured information from the resume text:\n"
        "- Contact Information (Name, Phone, Email, LinkedIn, GitHub)\n"
        "- Summary\n"
        "- Education (Degree, University, Year)\n"
        "- Skills\n"
        "- Work Experience (Company, Role, Duration, Responsibilities)\n"
        "- Projects (Name, Description, Technologies Used)\n"
        "- Certifications\n"
        "- Extracted Links\n"
        "Format the response as a JSON object.\n"
        "Resume Text:\n" + resume_text,
        "Extracted Links:\n" + json.dumps(links)
    )
    
    model=genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content(prompt)
    
    try:
        return json.loads(response.text.strip().strip('```json').strip('```'))
    except json.JSONDecodeError:
        print("Failed to parse Gemini response as JSON.")
        return None

def save_json(data, output_path):
    """Save extracted resume data to a JSON file."""
    with open(output_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Resume data saved to {output_path}")

if __name__ == "__main__":
    pdf_path = "backend/data/KushagraWadhwa_Resume.pdf"  # Path to your resume PDF
    output_path = "backend/data/parsed_resume.json"
    
    print("Extracting text from PDF...")
    resume_text,links = extract_pdf(pdf_path)
    
    if resume_text:
        print("Parsing resume with Gemini...")
        structured_data = parse_resume_with_gemini(resume_text,links)
        
        if structured_data:
            save_json(structured_data, output_path)
        else:
            print("Failed to extract structured data.")
    else:
        print("Failed to extract text from PDF.")