from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

def rerank_documents(query, retrieved_docs):
    """Re-rank documents based on relevance to the query."""
    if not retrieved_docs:
        return []

    scores = reranker.predict([[query, doc.page_content] for doc in retrieved_docs])
    sorted_docs = [doc for _, doc in sorted(zip(scores, retrieved_docs), reverse=True)]
    
    return sorted_docs

# Load the vector database (Chroma)
def load_vector_store(persist_directory="../chroma_db"):
    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store = Chroma(persist_directory=persist_directory, embedding_function=embedding_model)
    return vector_store

# Retrieve relevant documents based on vector similarity
def retrieve_documents(query, section=None, top_k=5):
    vector_store = load_vector_store()

    search_kwargs = {"k": top_k, "fetch_k": 20}  # Fetch more, return best
    if section:
        search_kwargs["filter"] = {"section": section}  # Section-based filtering

    retriever = vector_store.as_retriever(search_type="mmr", search_kwargs=search_kwargs)
    docs = retriever.get_relevant_documents(query)

    return docs

# Test retrieval
if __name__ == "__main__":
    query = "Tell about the projects of Kushagra"
    results = retrieve_documents(query, top_k=5)
    print("\nRetrieved Documents:")
    for doc in results:
        print(f"\nSection: {doc.metadata['section']}\nContent: {doc.page_content}")