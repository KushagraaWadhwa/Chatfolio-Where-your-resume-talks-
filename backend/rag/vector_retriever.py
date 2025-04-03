from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

# Load the vector database (Chroma)
def load_vector_store(persist_directory="../chroma_db"):
    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store = Chroma(persist_directory=persist_directory, embedding_function=embedding_model)
    return vector_store

# Retrieve relevant documents based on vector similarity
def retrieve_documents(query, top_k=5):
    print(f"\n🔍 Retrieval query: '{query}'")
    vector_store = load_vector_store()
    print(f"📚 Vector store contains {vector_store._collection.count()} documents")
    
    retriever = vector_store.as_retriever(search_kwargs={"k": top_k})
    docs = retriever.invoke(query)
    
    print(f"\n🔍 Retrieved {len(docs)} chunks:")
    for i, doc in enumerate(docs, 1):
        print(f"\nChunk {i}:")
        print(f"Section: {doc.metadata.get('section', 'Unknown')}")
        print(f"Content: {doc.page_content[:200]}...")
    
    return docs

# Test retrieval
if __name__ == "__main__":
    query = "Tell about the projects of Kushagra"
    results = retrieve_documents(query, top_k=5)
    print("\nRetrieved Documents:")
    for doc in results:
        print(f"\nSection: {doc.metadata['section']}\nContent: {doc.page_content}")