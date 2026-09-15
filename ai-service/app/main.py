import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import analysis

load_dotenv()

app = FastAPI(
    title="InfraSync AI Site Evidence Service",
    description="AI-powered intelligent data capture and structured analysis of infrastructure site photographs, Daily Progress Reports (DPRs), and engineering documents.",
    version="1.0.0 (Phase 4)"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router)

@app.get("/health")
async def health_check():
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    has_key = bool(gemini_key and len(gemini_key) > 10)
    return {
        "status": "healthy",
        "service": "InfraSync Python AI Microservice",
        "version": "1.0.0",
        "mode": "LIVE_AI" if has_key else "MOCK_AI",
        "geminiConfigured": has_key
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("AI_SERVICE_PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
