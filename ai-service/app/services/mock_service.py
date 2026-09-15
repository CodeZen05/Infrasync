import json
from datetime import date
from typing import Optional
from app.schemas.analysis_schema import AnalysisResultSchema, AnalyzeEvidenceRequest

class MockAIService:
    """
    Deterministic, context-aware Mock AI Provider.
    Enables reliable demonstrations and testing when GEMINI_API_KEY is absent.
    """

    @staticmethod
    def analyze(request: AnalyzeEvidenceRequest, extracted_text: Optional[str] = None) -> tuple[AnalysisResultSchema, str]:
        ev_type = (request.evidenceType or "PHOTO").upper()
        file_name = (request.fileName or request.fileUrl or "").lower()
        context = request.context

        # Check if context points to specific activity
        ctx_act = context.activityName if context else None
        ctx_code = context.activityCode if context else None

        # Scenario 1: Foundation DPR or Foundation-related evidence
        if "foundation" in file_name or "dpr" in file_name or (ctx_code and "CIV-023" in ctx_code) or (ctx_act and "foundation" in ctx_act.lower()):
            if ev_type == "PHOTO":
                # Photo rule: do not claim quantity from photo alone
                analysis = AnalysisResultSchema(
                    activityName=ctx_act or "Foundation Construction",
                    location="Zone A - Pier 14/15",
                    date=str(date.today()),
                    quantity=None,
                    unit="m3",
                    progressPercentage=80.0,
                    workStatus="IN_PROGRESS",
                    issues=["Slight water accumulation in footing trench"],
                    remarks="Reinforced concrete foundation casting visible for Pier 15 footings with transit mixer on site.",
                    materials=["Reinforcement steel rebar TMT 500D", "Concrete M35 grade"],
                    manpower="1 Foreman, 6 Bar-benders, 4 Concreting masons",
                    equipment=["Transit Mixer #08", "Concrete Boom Pump", "Needle Vibrators (2x)"],
                    confidenceScore=88
                )
            else:
                # DPR Document: Full exact metrics matching the spec
                analysis = AnalysisResultSchema(
                    activityName=ctx_act or "Foundation Construction",
                    location="Zone A",
                    date=str(date.today()),
                    quantity=65.0,
                    unit="m3",
                    progressPercentage=81.0,
                    workStatus="IN_PROGRESS",
                    issues=["Reinforcement material shortage"],
                    remarks="Foundation work at Zone A completed up to 65 cubic meters. Progress slightly constrained by rebar dispatch delay.",
                    materials=["Reinforcement steel TMT", "Ready-Mix Concrete M35"],
                    manpower="1 Site Supervisor, 8 Steel Fixers, 5 Laborers",
                    equipment=["Transit Mixer (Batching Truck #08)", "Tower Crane 1"],
                    confidenceScore=94
                )

        # Scenario 2: Piling or Pier Cap
        elif "pier" in file_name or "pile" in file_name or (ctx_code and "CIV-012" in ctx_code):
            analysis = AnalysisResultSchema(
                activityName=ctx_act or "Geotechnical Bore Piling (1200mm dia)",
                location="Corridor Pier 08-12",
                date=str(date.today()),
                quantity=45.0 if ev_type != "PHOTO" else None,
                unit="m",
                progressPercentage=75.0,
                workStatus="IN_PROGRESS",
                issues=[],
                remarks="Bored cast-in-situ piling execution inspected with rotary hydraulic rig.",
                materials=["Bentonite slurry", "Steel cage rebar"],
                manpower="6 Rig operators & crew",
                equipment=["Hydraulic Piling Rig (Soilmec)", "Service Crane"],
                confidenceScore=91
            )

        # Scenario 3: Girder launching
        elif "girder" in file_name or "viaduct" in file_name or (ctx_code and "CIV-045" in ctx_code):
            analysis = AnalysisResultSchema(
                activityName=ctx_act or "Pre-cast Box Girder Launching",
                location="Viaduct Span 18-19",
                date=str(date.today()),
                quantity=1.0 if ev_type != "PHOTO" else None,
                unit="span",
                progressPercentage=60.0,
                workStatus="IN_PROGRESS",
                issues=["High wind velocity monitored before final segment stitch"],
                remarks="Segmental erection gantry loaded with precast concrete segments.",
                materials=["Prestressed concrete box segments", "High tensile strands"],
                manpower="1 Erection Engineer, 12 Specialized rigging crew",
                equipment=["Launching Gantry 120T", "Multi-axle hydraulic transporter"],
                confidenceScore=89
            )

        # Scenario 4: Default Infrastructure Evidence
        else:
            analysis = AnalysisResultSchema(
                activityName=ctx_act or "Site Infrastructure Execution",
                location="Main Construction Corridor",
                date=str(date.today()),
                quantity=None,
                unit="units",
                progressPercentage=68.0,
                workStatus="IN_PROGRESS",
                issues=[],
                remarks="Civil construction activity recorded on site. Structural elements correspond to baseline schedule.",
                materials=["Structural concrete", "Formwork panels"],
                manpower="Field construction crew",
                equipment=["Heavy earthmoving / lifting machinery"],
                confidenceScore=85
            )

        raw_json = json.dumps(analysis.model_dump(), indent=2)
        return analysis, raw_json
