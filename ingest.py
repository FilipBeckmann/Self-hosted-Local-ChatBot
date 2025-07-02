# ingest.py
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader, BSHTMLLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OllamaEmbeddings
from langchain.vectorstores import FAISS
import os

# 1. Lade PDF
pdf_loader = PyPDFLoader(".data\Funktionshandbuch.pdf")
pdf_docs = pdf_loader.load()

# 2. Lade HTML-Seiten
html_loader = DirectoryLoader(
    "data\website", glob="**\*.html", loader_cls=BSHTMLLoader)
html_docs = html_loader.load()

# 3. Dokumente zusammenfassen
all_docs = pdf_docs + html_docs

# 4. Texte splitten
splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=200)
split_docs = splitter.split_documents(all_docs)

# 5. Embeddings erzeugen mit Ollama
embeddings = OllamaEmbeddings(model="llama3")

# 6. FAISS-Vektorstore speichern
db = FAISS.from_documents(split_docs, embeddings)
db.save_local("vectorstore")

print("✅ Index erstellt und gespeichert.")
