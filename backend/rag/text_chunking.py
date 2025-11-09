# text_chunking.py
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from .data_loading import load_all_json_files
import json

def extract_section_texts(json_object):
    """
    Extract text for each section from a JSON object with enhanced context.
    Creates multiple document chunks for better retrieval.
    Returns a list of Document objects.
    """
    documents = []
    
    for section, content in json_object.items():
        # Handle Work Experience with structured projects
        if section == "Work_Experience" and isinstance(content, list):
            for experience in content:
                # Create main experience chunk
                exp_text = f"Work Experience:\n"
                exp_text += f"Role: {experience.get('Title', 'N/A')}\n"
                exp_text += f"Company: {experience.get('Company', 'N/A')}\n"
                exp_text += f"Location: {experience.get('Location', 'N/A')}\n"
                exp_text += f"Duration: {experience.get('Start_Date', 'N/A')} to {experience.get('End_Date', 'N/A')}"
                
                if experience.get('Duration'):
                    exp_text += f" ({experience.get('Duration')})"
                
                if experience.get('Current_Status'):
                    exp_text += f"\nStatus: {experience.get('Current_Status')}"
                
                exp_text += f"\n\nTechnologies: {', '.join(experience.get('Technologies_Used', []))}"
                
                # Add responsibilities
                if experience.get('Responsibilities'):
                    exp_text += f"\n\nKey Responsibilities:\n"
                    for resp in experience.get('Responsibilities', []):
                        exp_text += f"• {resp}\n"
                
                documents.append(Document(
                    page_content=exp_text,
                    metadata={
                        "section": "Work Experience",
                        "company": experience.get('Company', 'N/A'),
                        "role": experience.get('Title', 'N/A'),
                        "current": experience.get('End_Date') == 'Present'
                    }
                ))
                
                # Create separate chunks for each key project (better retrieval)
                if experience.get('Key_Projects'):
                    for project in experience['Key_Projects']:
                        project_text = f"Work Project at {experience.get('Company')}:\n"
                        project_text += f"Project: {project.get('Project', 'N/A')}\n"
                        project_text += f"Role: {project.get('Role', experience.get('Title'))}\n"
                        project_text += f"Description: {project.get('Description', 'N/A')}\n"
                        project_text += f"Technologies: {', '.join(project.get('Technologies', []))}\n"
                        
                        if project.get('Features'):
                            project_text += f"Features: {', '.join(project.get('Features', []))}\n"
                        
                        if project.get('Achievement'):
                            project_text += f"Achievement: {project.get('Achievement')}\n"
                        
                        if project.get('Impact'):
                            project_text += f"Impact: {project.get('Impact')}\n"
                        
                        if project.get('Status'):
                            project_text += f"Current Status: {project.get('Status')}\n"
                        
                        documents.append(Document(
                            page_content=project_text,
                            metadata={
                                "section": "Work Experience",
                                "company": experience.get('Company', 'N/A'),
                                "project": project.get('Project', 'N/A'),
                                "current": project.get('Status', '').lower().find('current') >= 0
                            }
                        ))
        
        # Handle regular sections
        else:
            if isinstance(content, list):
                text = section + ":\n" + "\n".join(str(item) for item in content)
            else:
                text = section + ":\n" + str(content)
            documents.append(Document(page_content=text, metadata={"section": section}))
    
    return documents

def split_documents(documents, chunk_size, overlap):
    """Use RecursiveCharacterTextSplitter to split documents into chunks."""
    splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=overlap)
    split_docs = []
    for doc in documents:
        chunks = splitter.split_text(doc.page_content)
        for chunk in chunks:
            modified_chunk = f"{doc.metadata['section']}:\n{chunk}"
            # Assign the section name to each chunk's metadata for reference after retrieval 
            split_docs.append(Document(page_content=modified_chunk, metadata={"section": doc.metadata["section"]}))

    return split_docs

# Test the chunking
if __name__ == "__main__":
    json_objects = load_all_json_files("backend/data")
    
    # For demonstration, we'll combine the Documents from all JSON objects
    docs = []
    for json_object in json_objects:
        docs.extend(extract_section_texts(json_object))
    
    print("Original Documents:")
    for doc in docs:
        print(doc.page_content)
    
    split_docs = split_documents(docs, chunk_size=512, overlap=120)
    print("\nSplit Documents:")
    for doc in split_docs:
        print(f"Section: {doc.metadata['section']}, Chunk: {doc.page_content}")
