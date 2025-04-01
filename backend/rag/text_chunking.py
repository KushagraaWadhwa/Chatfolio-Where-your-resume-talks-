# text_chunking.py
from langchain.docstore.document import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from .data_loading import load_all_json_files

def extract_section_texts(json_object):
    """
    Extract text for each section from a JSON object.
    Assumes each key is a section name.
    Returns a list of Document objects.
    """
    documents = []
    for section, content in json_object.items():
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
