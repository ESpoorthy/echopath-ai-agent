import { ChildProfile, TherapySession, ProgressData, RewardBadge, AIAgent } from '../types';

export const mockChildren: ChildProfile[] = [
  {
    id: '1',
    name: 'Emma',
    age: 7,
    avatar: '👧',
    difficultyLevel: 'intermediate',
    targetPhonemes: ['r', 's', 'th'],
    sessionStreak: 12,
    totalSessions: 45,
    averageAccuracy: 78,
    lastSessionDate: '2024-03-27',
    preferences: {
      favoriteRewards: ['stars', 'rainbows'],
      sessionLength: 15,
      breakFrequency: 5
    }
  },
  {
    id: '2',
    name: 'Alex',
    age: 9,
    avatar: '👦',
    difficultyLevel: 'beginner',
    targetPhonemes: ['l', 'r'],
    sessionStreak: 5,
    totalSessions: 23,
    averageAccuracy: 65,
    lastSessionDate: '2024-03-26',
    preferences: {
      favoriteRewards: ['elephants', 'clouds'],
      sessionLength: 10,
      breakFrequency: 3
    }
  }
];

export const mockSession: TherapySession = {
  id: 'session-1',
  childId: '1',
  startTime: '2024-03-28T10:00:00Z',
  exercises: [
    {
      id: 'ex-1',
      type: 'phoneme',
      prompt: 'Say "red" clearly',
      targetSound: 'r',
      difficulty: 3,
      attempts: [],
      completed: false
    }
  ],
  overallScore: 0,
  feedback: '',
  nextRecommendations: []
};

export const mockProgressData: ProgressData[] = [
  { date: '2024-03-21', accuracy: 65, sessionsCompleted: 1, streakDays: 1, phonemeScores: { 'r': 60, 's': 70 } },
  { date: '2024-03-22', accuracy: 68, sessionsCompleted: 1, streakDays: 2, phonemeScores: { 'r': 65, 's': 71 } },
  { date: '2024-03-23', accuracy: 72, sessionsCompleted: 1, streakDays: 3, phonemeScores: { 'r': 70, 's': 74 } },
  { date: '2024-03-24', accuracy: 75, sessionsCompleted: 1, streakDays: 4, phonemeScores: { 'r': 73, 's': 77 } },
  { date: '2024-03-25', accuracy: 78, sessionsCompleted: 1, streakDays: 5, phonemeScores: { 'r': 76, 's': 80 } },
  { date: '2024-03-26', accuracy: 80, sessionsCompleted: 1, streakDays: 6, phonemeScores: { 'r': 78, 's': 82 } },
  { date: '2024-03-27', accuracy: 82, sessionsCompleted: 1, streakDays: 7, phonemeScores: { 'r': 80, 's': 84 } }
];

export const mockRewards: RewardBadge[] = [
  {
    id: 'badge-1',
    name: 'First Steps',
    description: 'Completed your first session!',
    icon: '🌟',
    earned: true,
    earnedDate: '2024-03-15',
    category: 'milestone'
  },
  {
    id: 'badge-2',
    name: 'Consistency Champion',
    description: 'Completed 7 days in a row',
    icon: '🏆',
    earned: true,
    earnedDate: '2024-03-27',
    category: 'consistency'
  },
  {
    id: 'badge-3',
    name: 'Accuracy Expert',
    description: 'Achieved 90% accuracy in a session',
    icon: '🎯',
    earned: false,
    category: 'accuracy'
  }
];

export const mockAIAgents: AIAgent[] = [
  {
    name: 'Therapy Planner',
    status: 'active',
    lastAction: 'Generated personalized exercise for /r/ sound',
    confidence: 0.92
  },
  {
    name: 'Speech Analyzer',
    status: 'idle',
    lastAction: 'Analyzed pronunciation accuracy: 78%',
    confidence: 0.87
  },
  {
    name: 'Adaptive Learning',
    status: 'processing',
    lastAction: 'Adjusting difficulty based on performance',
    confidence: 0.94
  },
  {
    name: 'Progress Tracker',
    status: 'active',
    lastAction: 'Updated streak counter: 12 days',
    confidence: 0.98
  }
];