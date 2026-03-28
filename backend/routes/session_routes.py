from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List, Optional, Dict, Any
from datetime import datetime
import json

from models.child_profile import ChildProfile, TherapySession, Exercise, Attempt
from agents.therapy_agent import TherapyPlannerAgent
from agents.speech_agent import SpeechAnalysisAgent
from agents.adaptive_agent import AdaptiveLearningAgent
from agents.progress_agent import ProgressTrackingAgent
from agents.compliance_agent import ComplianceAgent

router = APIRouter()

# Initialize agents (in production, these would be dependency injected)
therapy_agent = TherapyPlannerAgent()
speech_agent = SpeechAnalysisAgent()
adaptive_agent = AdaptiveLearningAgent()
progress_agent = ProgressTrackingAgent()
compliance_agent = ComplianceAgent()

@router.post("/start")
async def start_therapy_session(child_id: str):
    """
    Start a new therapy session for a child
    """
    try:
        # In a real app, this would fetch from database
        mock_child_profile = {
            'id': child_id,
            'name': 'Emma',
            'age': 7,
            'difficulty_level': 'intermediate',
            'target_phonemes': ['r', 's', 'th'],
            'preferences': {
                'session_length': 15,
                'favorite_rewards': ['stars', 'rainbows']
            }
        }
        
        # Generate first exercise using therapy agent
        exercise = therapy_agent.generate_exercise(mock_child_profile)
        
        # Create session
        session = {
            'id': f"session_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'child_id': child_id,
            'start_time': datetime.now().isoformat(),
            'exercises': [exercise],
            'overall_score': 0.0,
            'feedback': '',
            'next_recommendations': []
        }
        
        return {
            'session': session,
            'message': 'Therapy session started successfully',
            'ai_agents_status': {
                'therapy_planner': therapy_agent.get_status(),
                'speech_analyzer': speech_agent.get_status(),
                'adaptive_learning': adaptive_agent.get_status(),
                'progress_tracker': progress_agent.get_status()
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting session: {str(e)}")

@router.post("/analyze-speech")
async def analyze_speech_attempt(
    session_id: str,
    exercise_id: str,
    transcription: str,
    target_word: str,
    target_phoneme: str
):
    """
    Analyze a speech attempt using the Speech Analysis Agent
    """
    try:
        # Analyze the speech attempt
        analysis_result = speech_agent.analyze_transcription(
            transcription=transcription,
            target_word=target_word,
            target_phoneme=target_phoneme
        )
        
        # Create attempt record
        attempt = {
            'id': f"attempt_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'transcription': transcription,
            'accuracy': analysis_result['accuracy'],
            'confidence': analysis_result['confidence'],
            'feedback': analysis_result['feedback'],
            'timestamp': datetime.now().isoformat()
        }
        
        return {
            'attempt': attempt,
            'analysis': analysis_result,
            'ai_insights': {
                'phoneme_detected': analysis_result.get('phoneme_detected', False),
                'suggestions': analysis_result.get('suggestions', []),
                'confidence_level': analysis_result['confidence']
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing speech: {str(e)}")

@router.post("/generate-next-exercise")
async def generate_next_exercise(
    child_id: str,
    session_history: Optional[List[Dict[str, Any]]] = None
):
    """
    Generate next exercise using Therapy Planner Agent
    """
    try:
        # Mock child profile (would fetch from database)
        mock_child_profile = {
            'id': child_id,
            'name': 'Emma',
            'age': 7,
            'difficulty_level': 'intermediate',
            'target_phonemes': ['r', 's', 'th'],
            'preferences': {
                'session_length': 15,
                'favorite_rewards': ['stars', 'rainbows']
            }
        }
        
        # Generate exercise
        exercise = therapy_agent.generate_exercise(
            child_profile=mock_child_profile,
            session_history=session_history or []
        )
        
        # Get adaptive recommendations
        if session_history:
            adaptation = adaptive_agent.adapt_difficulty(
                child_profile=mock_child_profile,
                recent_sessions=session_history
            )
        else:
            adaptation = {'recommendations': ['Continue current approach']}
        
        return {
            'exercise': exercise,
            'adaptive_recommendations': adaptation.get('recommendations', []),
            'ai_reasoning': {
                'therapy_agent_confidence': therapy_agent.get_confidence(),
                'adaptive_agent_insights': adaptation.get('performance_summary', {}),
                'recommended_difficulty': adaptation.get('recommended_difficulty', 'intermediate')
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating exercise: {str(e)}")

@router.post("/complete-session")
async def complete_therapy_session(
    session_id: str,
    child_id: str,
    session_data: Dict[str, Any]
):
    """
    Complete therapy session and generate progress insights
    """
    try:
        # Track session progress
        session_metrics = progress_agent.track_session_progress(session_data)
        
        # Update session end time
        session_data['end_time'] = datetime.now().isoformat()
        session_data['overall_score'] = session_metrics.get('overall_session_score', 0)
        
        # Mock child profile for progress tracking
        mock_child_profile = {
            'id': child_id,
            'name': 'Emma',
            'session_streak': 12,
            'last_session_date': datetime.now().isoformat()
        }
        
        # Update streak counter
        streak_update = progress_agent.update_streak_counter(
            child_profile=mock_child_profile,
            new_session_date=datetime.now()
        )
        
        # Safety validation
        safety_check = compliance_agent.validate_session_safety(
            child_profile=mock_child_profile,
            session_data=session_data,
            recent_sessions=[]  # Would include recent sessions from database
        )
        
        # Generate session summary
        session_summary = {
            'session_completed': True,
            'session_metrics': session_metrics,
            'streak_update': streak_update,
            'safety_validation': safety_check,
            'next_session_recommendations': [
                'Continue practicing target phonemes',
                'Maintain current difficulty level',
                'Consider adding new reward elements'
            ]
        }
        
        return {
            'session_summary': session_summary,
            'completion_message': 'Great job! Session completed successfully.',
            'badges_earned': streak_update.get('milestone_achieved'),
            'ai_insights': {
                'progress_trend': 'improving',
                'engagement_score': session_metrics.get('engagement_indicators', {}),
                'safety_score': safety_check.get('safety_score', 100)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error completing session: {str(e)}")

@router.get("/progress-report/{child_id}")
async def get_progress_report(
    child_id: str,
    time_period: str = "30_days"
):
    """
    Generate comprehensive progress report
    """
    try:
        # Mock child profile and session history
        mock_child_profile = {
            'id': child_id,
            'name': 'Emma',
            'age': 7,
            'total_sessions': 45,
            'session_streak': 12
        }
        
        mock_session_history = []  # Would fetch from database
        
        # Generate progress report
        progress_report = progress_agent.generate_progress_report(
            child_profile=mock_child_profile,
            session_history=mock_session_history,
            time_period=time_period
        )
        
        # Generate milestone badges
        badges = progress_agent.generate_milestone_badges(
            child_profile=mock_child_profile,
            session_history=mock_session_history
        )
        
        # Identify learning patterns
        patterns = progress_agent.identify_learning_patterns(mock_session_history)
        
        return {
            'progress_report': progress_report,
            'milestone_badges': badges,
            'learning_patterns': patterns,
            'ai_insights': {
                'progress_agent_confidence': progress_agent.get_confidence(),
                'report_completeness': 'high',
                'data_quality_score': 95
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating progress report: {str(e)}")

@router.get("/adaptive-insights/{child_id}")
async def get_adaptive_insights(child_id: str):
    """
    Get adaptive learning insights and recommendations
    """
    try:
        # Mock data (would fetch from database)
        mock_child_profile = {
            'id': child_id,
            'name': 'Emma',
            'difficulty_level': 'intermediate',
            'preferences': {
                'session_length': 15,
                'break_frequency': 5
            }
        }
        
        mock_recent_sessions = []  # Would fetch recent sessions
        mock_performance_history = []  # Would fetch performance history
        
        # Get difficulty adaptation recommendations
        difficulty_adaptation = adaptive_agent.adapt_difficulty(
            child_profile=mock_child_profile,
            recent_sessions=mock_recent_sessions
        )
        
        # Calculate engagement score (mock current session data)
        mock_session_data = {
            'exercises': [{'completed': True}, {'completed': True}],
            'start_time': datetime.now().isoformat(),
            'end_time': (datetime.now()).isoformat()
        }
        
        engagement_analysis = adaptive_agent.calculate_engagement_score(
            child_profile=mock_child_profile,
            session_data=mock_session_data
        )
        
        # Generate personalized session plan
        session_plan = adaptive_agent.personalize_session_plan(
            child_profile=mock_child_profile,
            performance_history=mock_performance_history
        )
        
        return {
            'difficulty_adaptation': difficulty_adaptation,
            'engagement_analysis': engagement_analysis,
            'personalized_session_plan': session_plan,
            'ai_insights': {
                'adaptive_agent_confidence': adaptive_agent.get_confidence(),
                'personalization_level': 'high',
                'recommendation_strength': 'strong'
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting adaptive insights: {str(e)}")

@router.get("/compliance-status/{child_id}")
async def get_compliance_status(child_id: str):
    """
    Get compliance and safety status
    """
    try:
        # Validate consent status
        consent_status = compliance_agent.validate_consent_status(
            child_id=child_id,
            parent_id="parent_123"  # Would get from session/auth
        )
        
        # Generate compliance report
        compliance_report = compliance_agent.generate_compliance_report(
            time_period="30_days"
        )
        
        # Create audit entry for this access
        audit_entry = compliance_agent.audit_data_access(
            user_id="therapist_456",  # Would get from session/auth
            child_id=child_id,
            action="view_compliance_status",
            data_accessed=["compliance_report", "consent_status"]
        )
        
        return {
            'consent_status': consent_status,
            'compliance_report': compliance_report,
            'audit_entry': audit_entry.get('audit_entry', {}),
            'compliance_insights': {
                'overall_compliance_score': compliance_report.get('compliance_summary', {}).get('overall_compliance_score', 0),
                'safety_status': 'compliant',
                'data_privacy_status': 'compliant',
                'audit_trail_complete': True
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting compliance status: {str(e)}")

@router.post("/upload-audio")
async def upload_audio_recording(
    session_id: str,
    exercise_id: str,
    audio_file: UploadFile = File(...)
):
    """
    Upload and process audio recording
    """
    try:
        # In a real implementation, this would:
        # 1. Save the audio file securely
        # 2. Process it with speech-to-text
        # 3. Analyze the pronunciation
        
        # For demo, we'll simulate the process
        audio_content = await audio_file.read()
        
        # Simulate speech-to-text processing
        mock_transcription = "red"  # Would come from actual STT service
        
        # Analyze with speech agent
        analysis_result = speech_agent.analyze_transcription(
            transcription=mock_transcription,
            target_word="red",
            target_phoneme="r"
        )
        
        return {
            'upload_successful': True,
            'file_size': len(audio_content),
            'transcription': mock_transcription,
            'analysis_result': analysis_result,
            'processing_time_ms': 1500,  # Simulated processing time
            'ai_insights': {
                'speech_quality': 'good',
                'background_noise': 'minimal',
                'confidence_in_analysis': analysis_result.get('confidence', 0.8)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing audio: {str(e)}")

@router.get("/agents-status")
async def get_agents_status():
    """
    Get status of all AI agents
    """
    try:
        return {
            'agents': [
                {
                    'name': 'Therapy Planner',
                    'status': therapy_agent.get_status(),
                    'last_action': therapy_agent.get_last_action(),
                    'confidence': therapy_agent.get_confidence()
                },
                {
                    'name': 'Speech Analyzer',
                    'status': speech_agent.get_status(),
                    'last_action': speech_agent.get_last_action(),
                    'confidence': speech_agent.get_confidence()
                },
                {
                    'name': 'Adaptive Learning',
                    'status': adaptive_agent.get_status(),
                    'last_action': adaptive_agent.get_last_action(),
                    'confidence': adaptive_agent.get_confidence()
                },
                {
                    'name': 'Progress Tracker',
                    'status': progress_agent.get_status(),
                    'last_action': progress_agent.get_last_action(),
                    'confidence': progress_agent.get_confidence()
                },
                {
                    'name': 'Compliance Monitor',
                    'status': compliance_agent.get_status(),
                    'last_action': compliance_agent.get_last_action(),
                    'confidence': compliance_agent.get_confidence()
                }
            ],
            'system_health': 'optimal',
            'last_updated': datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting agents status: {str(e)}")