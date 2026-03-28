from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import our agent modules
from agents.therapy_agent import TherapyPlannerAgent
from agents.speech_agent import SpeechAnalysisAgent
from agents.adaptive_agent import AdaptiveLearningAgent
from agents.progress_agent import ProgressTrackingAgent
from agents.compliance_agent import ComplianceAgent

# Import routes
from routes.session_routes import router as session_router

# Import models
from models.child_profile import ChildProfile, TherapySession

app = FastAPI(
    title="EchoPath AI Backend",
    description="AI-powered speech therapy platform backend with multi-agent system",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI agents
therapy_agent = TherapyPlannerAgent()
speech_agent = SpeechAnalysisAgent()
adaptive_agent = AdaptiveLearningAgent()
progress_agent = ProgressTrackingAgent()
compliance_agent = ComplianceAgent()

# Include routers
app.include_router(session_router, prefix="/api/sessions", tags=["sessions"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "EchoPath AI is running 🚀",
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "agents": {
            "therapy_planner": therapy_agent.get_status(),
            "speech_analyzer": speech_agent.get_status(),
            "adaptive_learning": adaptive_agent.get_status(),
            "progress_tracker": progress_agent.get_status(),
            "compliance": compliance_agent.get_status()
        }
    }

@app.get("/api/health")
async def health_check():
    """Detailed health check for monitoring"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "agents_active": 5
    }

@app.get("/api/agents/status")
async def get_agents_status():
    """Get status of all AI agents"""
    return {
        "agents": [
            {
                "name": "Therapy Planner",
                "status": therapy_agent.get_status(),
                "last_action": therapy_agent.get_last_action(),
                "confidence": therapy_agent.get_confidence()
            },
            {
                "name": "Speech Analyzer", 
                "status": speech_agent.get_status(),
                "last_action": speech_agent.get_last_action(),
                "confidence": speech_agent.get_confidence()
            },
            {
                "name": "Adaptive Learning",
                "status": adaptive_agent.get_status(), 
                "last_action": adaptive_agent.get_last_action(),
                "confidence": adaptive_agent.get_confidence()
            },
            {
                "name": "Progress Tracker",
                "status": progress_agent.get_status(),
                "last_action": progress_agent.get_last_action(), 
                "confidence": progress_agent.get_confidence()
            }
        ]
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )