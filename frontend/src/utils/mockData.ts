import { ChildProfile, ProgressData, RewardBadge, AIAgent, TherapySession } from '../types/index.ts';

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
    description: 'Completed your first speech therapy session!',
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
  },
  {
    id: 'badge-4',
    name: 'Perfect Week',
    description: 'Practiced every day for a full week',
    icon: '📅',
    earned: true,
    earnedDate: '2024-03-21',
    category: 'consistency'
  },
  {
    id: 'badge-5',
    name: 'R Sound Master',
    description: 'Mastered the R sound with 95% accuracy',
    icon: '🗣️',
    earned: true,
    earnedDate: '2024-03-25',
    category: 'accuracy'
  },
  {
    id: 'badge-6',
    name: 'Quick Learner',
    description: 'Improved accuracy by 20% in one week',
    icon: '⚡',
    earned: false,
    category: 'improvement'
  },
  {
    id: 'badge-7',
    name: 'Speech Superstar',
    description: 'Completed 50 therapy sessions',
    icon: '⭐',
    earned: false,
    category: 'milestone'
  },
  {
    id: 'badge-8',
    name: 'Pronunciation Pro',
    description: 'Achieved 85%+ accuracy on 5 different sounds',
    icon: '🎤',
    earned: false,
    category: 'accuracy'
  },
  {
    id: 'badge-9',
    name: 'Monthly Marvel',
    description: 'Practiced for 30 consecutive days',
    icon: '📆',
    earned: false,
    category: 'consistency'
  },
  {
    id: 'badge-10',
    name: 'Breakthrough Moment',
    description: 'Achieved personal best accuracy score',
    icon: '💥',
    earned: true,
    earnedDate: '2024-03-26',
    category: 'improvement'
  },
  {
    id: 'badge-11',
    name: 'Voice Virtuoso',
    description: 'Completed 100 voice recordings',
    icon: '🎵',
    earned: false,
    category: 'milestone'
  },
  {
    id: 'badge-12',
    name: 'Golden Tongue',
    description: 'Achieved 100% accuracy in a session',
    icon: '👑',
    earned: false,
    category: 'special'
  }
];

// Enhanced badge data with rarity and requirements
export const enhancedBadges = [
  {
    id: 'badge-1',
    name: 'First Steps',
    description: 'Completed your first speech therapy session!',
    icon: '🌟',
    earned: true,
    earnedDate: '2024-03-15',
    category: 'milestone' as const,
    requirement: 'Complete your first therapy session',
    rarity: 'common' as const
  },
  {
    id: 'badge-2',
    name: 'Consistency Champion',
    description: 'Completed 7 days in a row',
    icon: '🏆',
    earned: true,
    earnedDate: '2024-03-27',
    category: 'consistency' as const,
    requirement: 'Practice for 7 consecutive days',
    rarity: 'rare' as const
  },
  {
    id: 'badge-3',
    name: 'Accuracy Expert',
    description: 'Achieved 90% accuracy in a session',
    icon: '🎯',
    earned: false,
    category: 'accuracy' as const,
    requirement: 'Score 90% or higher in any session',
    rarity: 'epic' as const
  },
  {
    id: 'badge-4',
    name: 'Perfect Week',
    description: 'Practiced every day for a full week',
    icon: '📅',
    earned: true,
    earnedDate: '2024-03-21',
    category: 'consistency' as const,
    requirement: 'Complete at least one session every day for 7 days',
    rarity: 'rare' as const
  },
  {
    id: 'badge-5',
    name: 'R Sound Master',
    description: 'Mastered the R sound with 95% accuracy',
    icon: '🗣️',
    earned: true,
    earnedDate: '2024-03-25',
    category: 'accuracy' as const,
    requirement: 'Achieve 95% accuracy on R sound exercises',
    rarity: 'epic' as const
  },
  {
    id: 'badge-6',
    name: 'Quick Learner',
    description: 'Improved accuracy by 20% in one week',
    icon: '⚡',
    earned: false,
    category: 'improvement' as const,
    requirement: 'Increase your average accuracy by 20% within 7 days',
    rarity: 'rare' as const
  },
  {
    id: 'badge-7',
    name: 'Speech Superstar',
    description: 'Completed 50 therapy sessions',
    icon: '⭐',
    earned: false,
    category: 'milestone' as const,
    requirement: 'Complete a total of 50 therapy sessions',
    rarity: 'epic' as const
  },
  {
    id: 'badge-8',
    name: 'Pronunciation Pro',
    description: 'Achieved 85%+ accuracy on 5 different sounds',
    icon: '🎤',
    earned: false,
    category: 'accuracy' as const,
    requirement: 'Score 85% or higher on 5 different phoneme types',
    rarity: 'epic' as const
  },
  {
    id: 'badge-9',
    name: 'Monthly Marvel',
    description: 'Practiced for 30 consecutive days',
    icon: '📆',
    earned: false,
    category: 'consistency' as const,
    requirement: 'Practice for 30 days in a row',
    rarity: 'legendary' as const
  },
  {
    id: 'badge-10',
    name: 'Breakthrough Moment',
    description: 'Achieved personal best accuracy score',
    icon: '💥',
    earned: true,
    earnedDate: '2024-03-26',
    category: 'improvement' as const,
    requirement: 'Beat your previous best accuracy score',
    rarity: 'common' as const
  },
  {
    id: 'badge-11',
    name: 'Voice Virtuoso',
    description: 'Completed 100 voice recordings',
    icon: '🎵',
    earned: false,
    category: 'milestone' as const,
    requirement: 'Record your voice 100 times',
    rarity: 'rare' as const
  },
  {
    id: 'badge-12',
    name: 'Golden Tongue',
    description: 'Achieved 100% accuracy in a session',
    icon: '👑',
    earned: false,
    category: 'special' as const,
    requirement: 'Score perfect 100% accuracy in any session',
    rarity: 'legendary' as const
  },
  {
    id: 'badge-13',
    name: 'Early Bird',
    description: 'Completed morning sessions for 5 days',
    icon: '🌅',
    earned: true,
    earnedDate: '2024-03-20',
    category: 'special' as const,
    requirement: 'Practice before 10 AM for 5 consecutive days',
    rarity: 'common' as const
  },
  {
    id: 'badge-14',
    name: 'Steady Progress',
    description: 'Improved every day for a week',
    icon: '📈',
    earned: false,
    category: 'improvement' as const,
    requirement: 'Show improvement in accuracy for 7 consecutive days',
    rarity: 'epic' as const
  },
  {
    id: 'badge-15',
    name: 'Sound Explorer',
    description: 'Practiced 10 different phoneme types',
    icon: '🔍',
    earned: false,
    category: 'milestone' as const,
    requirement: 'Complete exercises for 10 different sound types',
    rarity: 'rare' as const
  }
];

// Mock streak data for analytics
export const mockStreakData = [
  { week: 'Week 1', days: 5, sessions: 7, isCurrentWeek: false },
  { week: 'Week 2', days: 7, sessions: 10, isCurrentWeek: false },
  { week: 'Week 3', days: 6, sessions: 8, isCurrentWeek: false },
  { week: 'Week 4', days: 4, sessions: 5, isCurrentWeek: false },
  { week: 'Week 5', days: 7, sessions: 9, isCurrentWeek: false },
  { week: 'Week 6', days: 3, sessions: 4, isCurrentWeek: false },
  { week: 'This Week', days: 5, sessions: 6, isCurrentWeek: true }
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

// Function to generate initial progress data for new children
export const generateInitialProgressData = (childName: string): ProgressData[] => {
  const today = new Date();
  const data: ProgressData[] = [];
  
  // Generate 7 days of initial data with low but improving scores
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const baseAccuracy = 45 + (6 - i) * 3; // Gradual improvement from 45% to 63%
    const variation = Math.random() * 10 - 5; // ±5% variation
    const accuracy = Math.max(30, Math.min(70, Math.round(baseAccuracy + variation)));
    
    data.push({
      date: date.toISOString().split('T')[0],
      accuracy,
      sessionsCompleted: i < 3 ? 1 : 0, // Only recent days have sessions
      streakDays: Math.max(0, 3 - i), // Building up streak
      phonemeScores: {
        's': accuracy - 5 + Math.random() * 10,
        'l': accuracy + Math.random() * 10 - 5
      }
    });
  }
  
  return data;
};

// Function to generate initial badges for new children
export const generateInitialBadges = () => {
  return enhancedBadges.map(badge => ({
    ...badge,
    earned: badge.id === 'badge-1', // Only "First Steps" badge earned initially
    earnedDate: badge.id === 'badge-1' ? new Date().toISOString().split('T')[0] : undefined
  }));
};

// Function to generate initial streak data for new children
export const generateInitialStreakData = () => {
  return [
    { week: 'Week 1', days: 2, sessions: 2, isCurrentWeek: false },
    { week: 'Week 2', days: 3, sessions: 4, isCurrentWeek: false },
    { week: 'This Week', days: 3, sessions: 3, isCurrentWeek: true }
  ];
};

export const mockSession: TherapySession = {
  id: 'session-1',
  childId: '1',
  startTime: '2024-03-27T10:00:00Z',
  exercises: [
    {
      id: 'ex-1',
      type: 'phoneme',
      prompt: 'Say "red" clearly and slowly',
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