from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.schemas.analysis_schema import AnalyzeEvidenceRequest, AnalyzeEvidenceResponse
from app.services.analysis_service import AnalysisOrchestrator

router = APIRouter(prefix="/ai", tags=["AI Analysis"])
orchestrator = AnalysisOrchestrator()

@router.post("/analyze-evidence", response_model=AnalyzeEvidenceResponse)
async def analyze_evidence(request: AnalyzeEvidenceRequest):
    try:
        result = orchestrator.analyze_evidence(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI evidence analysis failed: {str(e)}"
        )

@router.get("/status")
async def get_ai_status():
    is_live = orchestrator.is_live_ai_available()
    return {
        "status": "ready",
        "liveAIAvailable": is_live,
        "mode": "LIVE_AI" if is_live else "MOCK_AI",
        "provider": "Gemini 1.5 Flash" if is_live else "InfraSync Deterministic Mock AI"
    }
