import os
import tempfile
import requests
from typing import Optional
from app.schemas.analysis_schema import (
    AnalyzeEvidenceRequest,
    AnalyzeEvidenceResponse,
    AnalysisResultSchema
)
from app.services.ocr_service import OCRService
from app.services.gemini_service import GeminiService
from app.services.mock_service import MockAIService

class AnalysisOrchestrator:
    """
    Central orchestration service for evidence analysis.
    Implements provider abstraction, OCR pipeline, and automatic mock fallback.
    """

    def __init__(self):
        self.gemini = GeminiService()

    def is_live_ai_available(self) -> bool:
        return self.gemini.is_configured()

    def analyze_evidence(self, request: AnalyzeEvidenceRequest) -> AnalyzeEvidenceResponse:
        resolved_path = None
        temp_downloaded = False

        try:
            # 1. Resolve local file path
            if request.filePath and os.path.exists(request.filePath):
                resolved_path = request.filePath
            elif request.fileUrl:
                # If fileUrl is a local server path e.g. /uploads/...
                if request.fileUrl.startswith("/uploads/"):
                    local_candidate = os.path.join(
                        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
                        "server",
                        request.fileUrl.lstrip("/")
                    )
                    if os.path.exists(local_candidate):
                        resolved_path = local_candidate

                # Or an HTTP URL
                elif request.fileUrl.startswith("http://") or request.fileUrl.startswith("https://"):
                    try:
                        resp = requests.get(request.fileUrl, timeout=10)
                        if resp.status_code == 200:
                            suffix = os.path.splitext(request.fileName or request.fileUrl)[1] or ".jpg"
                            tf = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
                            tf.write(resp.content)
                            tf.close()
                            resolved_path = tf.name
                            temp_downloaded = True
                    except Exception as e:
                        print(f"[AnalysisOrchestrator] Warning: could not download fileUrl: {e}")

            # 2. Extract OCR / text if applicable
            extracted_text = ""
            if resolved_path and os.path.exists(resolved_path):
                extracted_text = OCRService.extract_text_from_file(resolved_path)

            # 3. Choose Provider: Live Gemini vs Mock AI
            if self.is_live_ai_available():
                try:
                    print(f"[AnalysisOrchestrator] Running LIVE Gemini Vision analysis for {request.fileName or request.evidenceId}...")
                    analysis, raw_resp = self.gemini.analyze(
                        request=request,
                        file_path=resolved_path,
                        extracted_text=extracted_text
                    )
                    return AnalyzeEvidenceResponse(
                        success=True,
                        mode="LIVE_AI",
                        provider="gemini",
                        analysis=analysis,
                        rawResponse=raw_resp
                    )
                except Exception as e:
                    print(f"[AnalysisOrchestrator] Gemini live analysis failed: {e}. Falling back to resilient Mock AI.")
                    analysis, raw_resp = MockAIService.analyze(request, extracted_text=extracted_text)
                    return AnalyzeEvidenceResponse(
                        success=True,
                        mode="MOCK_AI",
                        provider="mock_fallback",
                        analysis=analysis,
                        rawResponse=raw_resp,
                        error=f"Gemini API error (used fallback): {str(e)}"
                    )
            else:
                # Mock AI Mode
                print(f"[AnalysisOrchestrator] Running MOCK AI analysis (GEMINI_API_KEY not configured)...")
                analysis, raw_resp = MockAIService.analyze(request, extracted_text=extracted_text)
                return AnalyzeEvidenceResponse(
                    success=True,
                    mode="MOCK_AI",
                    provider="mock_service",
                    analysis=analysis,
                    rawResponse=raw_resp
                )

        finally:
            if temp_downloaded and resolved_path and os.path.exists(resolved_path):
                try:
                    os.remove(resolved_path)
                except Exception:
                    pass
