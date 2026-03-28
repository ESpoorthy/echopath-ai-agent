from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate" 
    ADVANCED = "advanced"

class ExerciseType(str, Enum):
    PHONEME = "phoneme"
    WORD = "word"
    SENTENCE = "sentence"
    CONVERSATION = "conversation"

class BadgeCategory(str, Enum):
    ACCURACY = "accuracy"
    CONSISTENCY = "consistency"
    IMPROVEMENT = "improvement"
    MILESTONE = "milestone"

class ChildPreferences(BaseModel):
    favorite_rewards: List[str] = Field(default_factory=list)
    session_length: int = Field(default=15, ge=5, le=30)
    break_frequency: int = Field(default=5, ge=1, le=10)

class ChildProfile(BaseModel):
    id: str
    name: str
    age: int = Field(ge=3, le=18)
    avatar: str = "👶"
    difficulty_level: DifficultyLevel = DifficultyLevel.BEGINNER
    target_phonemes: List[str] = Field(default_factory=list)
    session_streak: int = Field(default=0, ge=0)
    total_sessions: int = Field(default=0, ge=0)
    average_accuracy: float = Field(default=0.0, ge=0.0, le=100.0)
    last_session_date: Optional[datetime] = None
    preferences: ChildPreferences = Field(default_factory=ChildPreferences)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class Attempt(BaseModel):
    id: str
    audio_url: Optional[str] = None
    transcription: str
    accuracy: float = Field(ge=0.0, le=100.0)
    confidence: float = Field(ge=0.0, le=1.0)
    feedback: str
    timestamp: datetime = Field(default_factory=datetime.now)

class Exercise(BaseModel):
    id: str
    type: ExerciseType
    prompt: str
    target_sound: str
    difficulty: int = Field(ge=1, le=5)
    attempts: List[Attempt] = Field(default_factory=list)
    completed: bool = False
    score: Optional[float] = None

class TherapySession(BaseModel):
    id: str
    child_id: str
    start_time: datetime = Field(default_factory=datetime.now)
    end_time: Optional[datetime] = None
    exercises: List[Exercise] = Field(default_factory=list)
    overall_score: float = Field(default=0.0, ge=0.0, le=100.0)
    feedback: str = ""
    next_recommendations: List[str] = Field(default_factory=list)
    ai_insights: Dict[str, Any] = Field(default_factory=dict)

class ProgressData(BaseModel):
    date: datetime
    accuracy: float = Field(ge=0.0, le=100.0)
    sessions_completed: int = Field(ge=0)
    streak_days: int = Field(ge=0)
    phoneme_scores: Dict[str, float] = Field(default_factory=dict)

class RewardBadge(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    earned: bool = False
    earned_date: Optional[datetime] = None
    category: BadgeCategory

class TherapistNote(BaseModel):
    id: str
    child_id: str
    session_id: str
    content: str
    priority: str = Field(regex="^(low|medium|high)$")
    created_at: datetime = Field(default_factory=datetime.now)
    created_by: str
    resolved: bool = False