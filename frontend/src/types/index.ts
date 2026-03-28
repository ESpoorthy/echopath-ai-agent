export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  targetPhonemes: string[];
  sessionStreak: number;
  totalSessions: number;
  averageAccuracy: number;
  lastSessionDate: string;
  preferences: {
    favoriteRewards: string[];
    sessionLength: number;
    breakFrequency: number;
  };
}

export interface TherapySession {
  id: string;
  childId: string;
  startTime: string;
  endTime?: string;
  exercises: Exercise[];
  overallScore: number;
  feedback: string;
  nextRecommendations: string[];
}

export interface Exercise {
  id: string;
  type: 'phoneme' | 'word' | 'sentence' | 'conversation';
  prompt: string;
  targetSound: string;
  difficulty: number;
  attempts: Attempt[];
  completed: boolean;
  score?: number;
}

export interface Attempt {
  id: string;
  audioUrl?: string;
  transcription: string;
  accuracy: number;
  feedback: string;
  timestamp: string;
  confidence: number;
}

export interface ProgressData {
  date: string;
  accuracy: number;
  sessionsCompleted: number;
  streakDays: number;
  phonemeScores: { [phoneme: string]: number };
}

export interface AIAgent {
  name: string;
  status: 'active' | 'processing' | 'idle';
  lastAction: string;
  confidence: number;
}

export interface RewardBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  category: 'accuracy' | 'consistency' | 'improvement' | 'milestone';
}

export interface TherapistNote {
  id: string;
  childId: string;
  sessionId: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  createdBy: string;
  resolved: boolean;
}