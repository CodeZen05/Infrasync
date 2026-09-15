import os
import json
import base64
import mimetypes
import requests
from typing import Optional, Tuple
from app.schemas.analysis_schema import AnalysisResultSchema, AnalyzeEvidenceRequest
from app.utils.prompt_templates import SYSTEM_INSTRUCTION, ANALYSIS_PROMPT

class GeminiService:
    """
    Vision-capable LLM Provider utilizing Google Gemini API.
    Supports multimodal inputs (JPEG, PNG, PDF) with strict JSON output formatting.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("GEMINI_API_KEY", "").strip()
        self.model = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key) > 10)

    def analyze(
        self, 
        request: AnalyzeEvidenceRequest, 
        file_path: Optional[str] = None, 
        extracted_text: Optional[str] = None
    ) -> Tuple[AnalysisResultSchema, str]:
        if not self.is_configured():
            raise ValueError("GEMINI_API_KEY is not configured.")

        # Prepare contextual text prompt
        ctx = request.context
        prompt_text = ANALYSIS_PROMPT.format(
            evidence_type=request.evidenceType or "PHOTO",
            file_name=request.fileName or request.fileUrl or "site_evidence",
            project_name=ctx.projectName if ctx else "Infrastructure Project",
            activity_name=ctx.activityName if ctx else "Not Specified",
            activity_code=ctx.activityCode if ctx else "Not Specified",
            extracted_text=extracted_text or "No pre-extracted text."
        )

        parts = [{"text": prompt_text}]

        # If local image/pdf file exists, attach as inline multimodal part
        if file_path and os.path.exists(file_path):
            mime_type, _ = mimetypes.guess_type(file_path)
            if not mime_type:
                if file_path.lower().endswith(".pdf"):
                    mime_type = "application/pdf"
                else:
                    mime_type = "image/jpeg"

            try:
                with open(file_path, "rb") as f:
                    file_bytes = f.read()
                    # Limit inline binary to 15MB
                    if len(file_bytes) <= 15 * 1024 * 1024:
                        b64_data = base64.b64encode(file_bytes).decode("utf-8")
                        parts.append({
                            "inline_data": {
                                "mime_type": mime_type,
                                "data": b64_data
                            }
                        })
            except Exception as e:
                print(f"[GeminiService] Warning: Could not encode file {file_path}: {e}")

        payload = {
            "system_instruction": {
                "parts": [{"text": SYSTEM_INSTRUCTION}]
            },
            "contents": [
                {
                    "parts": parts
                }
            ],
            "generationConfig": {
                "response_mime_type": "application/json",
                "temperature": 0.1,
                "topP": 0.8
            }
        }

        url = f"{self.base_url}/{self.model}:generateContent?key={self.api_key}"
        response = requests.post(url, json=payload, timeout=30)

        if response.status_code != 200:
            raise RuntimeError(f"Gemini API error {response.status_code}: {response.text}")

        res_json = response.json()
        try:
            candidate_text = res_json["candidates"][0]["content"]["parts"][0]["text"]
            parsed_dict = json.loads(candidate_text)
            validated = AnalysisResultSchema(**parsed_dict)
            return validated, candidate_text
        except Exception as e:
            raise ValueError(f"Failed to parse and validate Gemini response: {e}\nRaw: {res_json}")
