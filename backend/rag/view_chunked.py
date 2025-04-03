from langchain_chroma import Chroma

# Load ChromaDB
vector_store = Chroma(persist_directory="../chroma_db")

# Retrieve stored chunks & their embeddings
docs = vector_store.get()
embeddings = vector_store.get(include=["embeddings"])  # Includes embeddings

print("\n📌 Chunks and Embeddings:")
for idx, doc in enumerate(docs["documents"]):
    print(f"\n🔹 Chunk {idx + 1}:")
    print(f"📜 Text: {doc}")
    print(f"🧬 Embedding: {embeddings['embeddings'][idx][:5]} ...")  # Show first 5 values
