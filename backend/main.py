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

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "EchoPath AI is running 🚀",
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "agents": {
            "therapy_planner": "active",
            "speech_analyzer": "active", 
            "adaptive_learning": "active",
            "progress_tracker": "active",
            "compliance": "active"
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

@app.post("/api/sessions/start")
async def start_therapy_session(child_id: str):
    """Start a new therapy session for a child"""
    try:
        # Mock session creation
        session = {
            'id': f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'child_id': child_id,
            'start_time': datetime.now().isoformat(),
            'exercises': [{
                'id': 'ex-1',
                'type': 'phoneme',
                'prompt': 'Say "red" clearly and slowly',
                'target_sound': 'r',
                'difficulty': 3,
                'attempts': [],
                'completed': False
            }],
            'overall_score': 0.0,
            'feedback': '',
            'next_recommendations': []
        }
        
        return {
            'session': session,
            'message': 'Therapy session started successfully',
            'ai_agents_status': {
                'therapy_planner': 'active',
                'speech_analyzer': 'idle',
                'adaptive_learning': 'active',
                'progress_tracker': 'active'
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting session: {str(e)}")

@app.post("/api/sessions/analyze-speech")
async def analyze_speech_attempt(
    session_id: str,
    exercise_id: str,
    transcription: str,
    target_word: str,
    target_phoneme: str
):
    """Analyze a speech attempt using AI"""
    try:
        # Mock AI analysis
        import random
        accuracy = random.uniform(70, 95)
        
        attempt = {
            'id': f"attempt_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'transcription': transcription,
            'accuracy': round(accuracy, 1),
            'confidence': random.uniform(0.7, 0.95),
            'feedback': 'Great job! Keep practicing!' if accuracy > 80 else 'Good effort! Try again.',
            'timestamp': datetime.now().isoformat()
        }
        
        return {
            'attempt': attempt,
            'ai_insights': {
                'phoneme_detected': True,
                'suggestions': ['Focus on tongue position', 'Speak more slowly'],
                'confidence_level': attempt['confidence']
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing speech: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )