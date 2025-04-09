# embedding_vector_store.py
import os
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from .data_loading import load_all_json_files
from .text_chunking import extract_section_texts, split_documents

def create_vector_store(json_directory, chunk_size, overlap, persist_directory):
    """
    Loads JSON files from the specified directory, processes them into Documents by section,
    splits the Documents into chunks using a recursive text splitter, embeds these chunks, and
    finally stores them in a persistent Chroma vector store.
    """
    # 1. Load all JSON objects from the directory using data_loading.py
    json_objects = load_all_json_files(json_directory)

    if not json_objects:
        print("No JSON files found in the directory.")
        return None

    # 2. For each JSON object, extract section texts into LangChain Document objects.
    docs = []
    for json_object in json_objects:
        docs.extend(extract_section_texts(json_object))
    
    # 3. Split the Documents into smaller, context-preserving chunks using text_chunking.py.
    split_docs = split_documents(docs, chunk_size=chunk_size, overlap=overlap)
    print(f"Created {len(split_docs)} chunks from the documents.")

    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    # 5. Create a Chroma vector store from the document chunks.
    vector_store = Chroma.from_documents(
        split_docs,
        embedding=embeddings,
        persist_directory=persist_directory
    )
    os.makedirs(persist_directory, exist_ok=True)

    print(f"Vector store created and persisted with {len(split_docs)} document chunks.")
    return vector_store

if __name__ == "__main__":

    json_directory = "backend/data"
    vector_store = create_vector_store(json_directory, chunk_size=512, overlap=120, persist_directory="../chroma_db")
