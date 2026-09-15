import os
import io
from typing import Optional

class OCRService:
    """
    Dedicated text extraction and OCR service for DPRs, PDFs, and scanned documents.
    """

    @staticmethod
    def extract_text_from_file(file_path: str) -> str:
        """
        Extract selectable text directly; if empty or scanned, fallback to OCR.
        """
        if not file_path or not os.path.exists(file_path):
            return ""

        ext = os.path.splitext(file_path)[1].lower()

        if ext == ".pdf":
            return OCRService._extract_pdf_text(file_path)
        elif ext in [".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"]:
            return OCRService._ocr_image(file_path)

        return ""

    @staticmethod
    def _extract_pdf_text(pdf_path: str) -> str:
        extracted = []
        # Attempt 1: pypdfium2
        try:
            import pypdfium2 as pdfium
            pdf = pdfium.PdfDocument(pdf_path)
            for i, page in enumerate(pdf):
                textpage = page.get_textpage()
                page_text = textpage.get_text_range()
                if page_text and page_text.strip():
                    extracted.append(page_text.strip())
            
            combined = "\n".join(extracted).strip()
            if len(combined) > 40:
                return combined
        except Exception as e:
            print(f"[OCRService] pypdfium2 text extraction failed: {e}")

        # Attempt 2: OCR on rendered pages if text was too sparse or scanned
        try:
            import pytesseract
            from PIL import Image
            import pypdfium2 as pdfium

            pdf = pdfium.PdfDocument(pdf_path)
            ocr_texts = []
            for i, page in enumerate(pdf):
                if i >= 3:  # limit to first 3 pages
                    break
                pil_image = page.render(scale=2.0).to_pil()
                page_text = pytesseract.image_to_string(pil_image)
                if page_text.strip():
                    ocr_texts.append(page_text.strip())
            
            return "\n".join(ocr_texts).strip()
        except Exception as e:
            print(f"[OCRService] PDF OCR fallback failed: {e}")

        return "\n".join(extracted).strip()

    @staticmethod
    def _ocr_image(image_path: str) -> str:
        try:
            import pytesseract
            from PIL import Image
            with Image.open(image_path) as img:
                return pytesseract.image_to_string(img).strip()
        except Exception as e:
            print(f"[OCRService] Image OCR failed: {e}")
            return ""
