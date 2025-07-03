import os
from langchain_community.document_loaders.pdf import PyPDFLoader
from langchain_community.document_loaders.directory import DirectoryLoader
from langchain_community.document_loaders.html_bs import BSHTMLLoader

# Eigene BSHTMLLoader-Version mit utf-8 Öffnung


class BSHTMLLoaderUTF8(BSHTMLLoader):
    def load(self):
        with open(self.file_path, encoding="utf-8") as f:
            soup = self.bs4(f, **self.bs_kwargs)
        metadata = self._get_metadata()
        texts = [str(s) for s in soup.find_all(self.tag)]
        documents = []
        for text in texts:
            documents.append(self._create_document(text, metadata))
        return documents


# Basisverzeichnis für relative Pfade (Verzeichnis von ingest.py)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Pfad zum PDF-Funktionshandbuch
pdf_path = os.path.join(BASE_DIR, "data", "Funktionshandbuch.pdf")

# Pfad zum HTML-Website-Ordner
html_dir = os.path.join(BASE_DIR, "data", "site")

# PDF laden
pdf_loader = PyPDFLoader(pdf_path)

# HTML laden mit eigenem Loader, rekursiv alle .html Dateien
html_loader = DirectoryLoader(
    html_dir,
    glob="**/*.html",
    loader_cls=BSHTMLLoaderUTF8
)

# Dokumente laden
pdf_docs = pdf_loader.load()
html_docs = html_loader.load()

# Alle Dokumente zusammenfassen
all_docs = pdf_docs + html_docs

print(f"PDF Dokumente geladen: {len(pdf_docs)}")
print(f"HTML Dokumente geladen: {len(html_docs)}")
print(f"Gesamt: {len(all_docs)} Dokumente")

# Hier kannst du z.B. Vektorindex aufbauen oder abspeichern
