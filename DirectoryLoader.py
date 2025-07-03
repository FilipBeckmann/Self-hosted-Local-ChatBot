from langchain_community.document_loaders.html_bs import BSHTMLLoader


class BSHTMLLoaderUTF8(BSHTMLLoader):
    def load(self):
        # Überschreibe load() für utf-8 Öffnung
        with open(self.file_path, encoding="utf-8") as f:
            soup = self.bs4(f, **self.bs_kwargs)
        # Der Rest wie beim Original
        metadata = self._get_metadata()
        texts = [str(s) for s in soup.find_all(self.tag)]
        documents = []
        for text in texts:
            documents.append(self._create_document(text, metadata))
        return documents
