from langchain_google_genai import GoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
import os

# Load the vector database (Chroma)
def load_vector_store(persist_directory = os.path.join("backend", "chroma_db")):
    embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    vector_store = Chroma(persist_directory=persist_directory, embedding_function=embedding_model)
    return vector_store

# Retrieve relevant documents based on vector similarity
def retrieve_documents(query, top_k):
    vector_store = load_vector_store()
    print(f"🧠 Loaded vector store with {vector_store._collection.count()} documents")
    retriever = vector_store.as_retriever(search_kwargs={"k": top_k})
    docs = retriever.invoke(query)
    # print(f"Retrieved {len(docs)} chunks.")
    print(f"\n🔍 Retrieved {len(docs)} chunks:")
    for doc in docs:
        print("Retrieved Doc:", doc.page_content, "Metadata:", doc.metadata)

    return docs

def generate_response(query):
    """
    Retrieves relevant chunks and generates a structured response using Gemini 2.0 Flash with strict grounding.
    :param query: The user query.

    """

    llm = GoogleGenerativeAI(model="gemini-2.0-flash")

    retrieved_chunks = retrieve_documents(query, top_k=5)
    # print(f"Retrieved {len(retrieved_chunks)} chunks.")

    # Ensure we have valid retrieved context
    if not retrieved_chunks:
        return {
            "answer": "I do not have enough information to answer this question accurately.",
        }

    # Format retrieved context for clarity
    context_text = "\n\n".join([
        f"Source: {chunk.metadata.get('source', 'Unknown')}\nContent: {chunk.page_content}" 
        for chunk in retrieved_chunks
    ])

    # Strict instruction prompt
    prompt = (
        "You are a personal AI assistant for Kushagra, answering queries on his behalf. "
        "Your responses must be strictly grounded in the retrieved context. "
        "Each chunk of information belongs to a specific section. Use this section context to improve accuracy. "
        "Do not generate or assume any information beyond what is explicitly provided. "
        "If the context lacks relevant details, respond with: "
        "'I do not have enough information to answer this question accurately.'\n\n"
        "### User Query:\n"
        f"{query}\n\n"
        "### Retrieved Context:\n"
        f"{context_text}\n\n"
        "### Response Guidelines:\n"
        "- Provide an answer only using the retrieved context.\n"
        "- If no relevant information is found, explicitly state it.\n"
        "- Keep the response factual and professional.\n"
        "- Do not generate or assume any information beyond what is explicitly provided.\n"
        "- Give detailed answer when asked for specific details.\n"
        "- Answer from Kushagra's perspective or third person, as and when required as per the user's way of asking questions.\n\n"
        "**Answer:**"
    )

    # Get response from LLM
    response = llm.invoke(prompt).strip()



    # Return structured response
    return {
        "answer": response,
    }

# Example usage
if __name__ == "__main__":
    query = "Can you tell about the technologies he used in his project about SalesAssist AI"
    response = generate_response(query)
    print("Answer:\n", response["answer"])