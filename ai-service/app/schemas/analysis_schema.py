from typing import List, Optional, Any
from pydantic import BaseModel, Field, field_validator

class EvidenceContext(BaseModel):
    projectName: Optional[str] = None
    activityName: Optional[str] = None
    activityCode: Optional[str] = None

class AnalyzeEvidenceRequest(BaseModel):
    evidenceId: Optional[str] = None
    fileUrl: Optional[str] = None
    filePath: Optional[str] = None
    fileName: Optional[str] = None
    fileType: Optional[str] = None
    evidenceType: str = "PHOTO"  # PHOTO, DPR, DOCUMENT
    context: Optional[EvidenceContext] = None

class AnalysisResultSchema(BaseModel):
    activityName: Optional[str] = Field(None, description="Identified construction activity name")
    location: Optional[str] = Field(None, description="Physical site zone, pier, or chainage")
    date: Optional[str] = Field(None, description="Execution date in YYYY-MM-DD format")
    quantity: Optional[float] = Field(None, description="Numeric measured quantity completed")
    unit: Optional[str] = Field(None, description="Engineering unit of measure (e.g. m3, m, %, tonnes)")
    progressPercentage: Optional[float] = Field(None, ge=0.0, le=100.0, description="Cumulative progress percentage")
    workStatus: Optional[str] = Field("IN_PROGRESS", description="Current execution state")
    issues: List[str] = Field(default_factory=list, description="Identified site bottlenecks, defects, or shortages")
    remarks: Optional[str] = Field(None, description="Concise engineering observation summary")
    materials: Optional[List[str]] = Field(default_factory=list, description="Observed or reported construction materials")
    manpower: Optional[str] = Field(None, description="Reported workforce deployment")
    equipment: Optional[List[str]] = Field(default_factory=list, description="Observed machinery or equipment")
    confidenceScore: int = Field(..., ge=0, le=100, description="Estimated extraction confidence between 0 and 100")

    @field_validator("confidenceScore")
    @classmethod
    def validate_confidence(cls, v: int) -> int:
        return max(0, min(100, int(v)))

    @field_validator("progressPercentage")
    @classmethod
    def validate_progress(cls, v: Optional[float]) -> Optional[float]:
        if v is not None:
            return round(max(0.0, min(100.0, float(v))), 2)
        return None

class AnalyzeEvidenceResponse(BaseModel):
    success: bool
    mode: str  # LIVE_AI or MOCK_AI
    provider: str  # gemini, mock, etc.
    analysis: AnalysisResultSchema
    rawResponse: Optional[str] = None
    error: Optional[str] = None
