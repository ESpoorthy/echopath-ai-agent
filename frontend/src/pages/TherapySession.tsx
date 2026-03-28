import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.tsx';
import VoiceRecorder from '../components/VoiceRecorder.tsx';
import AIAgentPanel from '../components/AIAgentPanel.tsx';
import FeedbackCard from '../components/FeedbackCard.tsx';
import AdaptivePanel from '../components/AdaptivePanel.tsx';
import RewardAnimation from '../components/RewardAnimation.tsx';
import VoiceInstructions from '../components/VoiceInstructions.tsx';
import { mockChildren, mockAIAgents } from '../utils/mockData.ts';
import { Exercise, Attempt, ChildProfile } from '../types/index.ts';
import SpeechService from '../services/speechService.ts';
import TextToSpeechService from '../services/textToSpeechService.ts';
import { ArrowLeft, Info, HelpCircle, Volume2, VolumeX } from 'lucide-react';

const TherapySession: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [child, setChild] = useState<ChildProfile | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [rewardType, setRewardType] = useState<'star' | 'rainbow' | 'elephant' | 'cloud'>('star');
  const [difficultyLevel, setDifficultyLevel] = useState(3);
  const [recentPerformance, setRecentPerformance] = useState<number[]>([]);
  const [showAIExplanation, setShowAIExplanation] = useState(false);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [aiDecisions, setAiDecisions] = useState({
    therapyAgent: 'Initializing personalized exercise selection...',
    speechAgent: 'Ready to analyze pronunciation patterns...',
    adaptiveAgent: 'Assessing optimal difficulty level...',
    progressAgent: 'Preparing to track learning progress...'
  });
  const [showInstructions, setShowInstructions] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeechEnabled, setAutoSpeechEnabled] = useState(true);

  const exercises = [
    { prompt: 'Say "red" clearly and slowly', targetSound: 'r', difficulty: 3 },
    { prompt: 'Practice "rainbow" with a clear "r" sound', targetSound: 'r', difficulty: 4 },
    { prompt: 'Try "car" - make the "r" strong', targetSound: 'r', difficulty: 3 },
    { prompt: 'Say "sun" with a clear "s" sound', targetSound: 's', difficulty: 2 },
    { prompt: 'Practice "snake" - emphasize the "s"', targetSound: 's', difficulty: 3 },
    { prompt: 'Say "ball" with clear pronunciation', targetSound: 'l', difficulty: 2 },
    { prompt: 'Try "elephant" - focus on each sound', targetSound: 'l', difficulty: 5 }
  ];

  useEffect(() => {
    if (childId) {
      // First check localStorage for all children (including newly added ones)
      let allChildren = mockChildren;
      const savedChildren = localStorage.getItem('echopath_children');
      if (savedChildren) {
        try {
          allChildren = JSON.parse(savedChildren);
        } catch (error) {
          console.error('Error parsing saved children:', error);
          allChildren = mockChildren;
        }
      }
      
      console.log('Looking for child with ID:', childId, 'in children:', allChildren);
      const foundChild = allChildren.find(c => c.id === childId);
      
      if (!foundChild) {
        console.error('Child not found with ID:', childId);
        // Redirect back to dashboard if child not found
        navigate('/dashboard');
        return;
      }
      
      console.log('Found child:', foundChild);
      setChild(foundChild);
      
      // Initialize first exercise based on child's level
      const initialDifficulty = foundChild?.difficultyLevel === 'beginner' ? 2 : 
                               foundChild?.difficultyLevel === 'intermediate' ? 3 : 4;
      setDifficultyLevel(initialDifficulty);
      
      const suitableExercises = exercises.filter(ex => ex.difficulty <= initialDifficulty + 1);
      const randomExercise = suitableExercises[Math.floor(Math.random() * suitableExercises.length)];
      
      setCurrentExercise({
        id: 'ex-1',
        type: 'phoneme',
        prompt: randomExercise.prompt,
        targetSound: randomExercise.targetSound,
        difficulty: randomExercise.difficulty,
        attempts: [],
        completed: false
      });

      // Speak the initial exercise instruction after a short delay
      setTimeout(() => {
        if (autoSpeechEnabled) {
          speakExerciseInstruction(randomExercise.prompt, randomExercise.targetSound);
        }
      }, 1000);
    }
  }, [childId, navigate, autoSpeechEnabled]);

  const speakExerciseInstruction = async (prompt: string, targetSound: string) => {
    if (!TextToSpeechService.isSupported() || !autoSpeechEnabled) return;
    
    try {
      setIsSpeaking(true);
      await TextToSpeechService.speakExerciseInstruction(prompt, targetSound);
    } catch (error) {
      console.error('Text-to-speech error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const speakFeedback = async (feedback: string, isPositive: boolean = true) => {
    if (!TextToSpeechService.isSupported() || !autoSpeechEnabled) return;
    
    try {
      setIsSpeaking(true);
      await TextToSpeechService.speakFeedback(feedback, isPositive);
    } catch (error) {
      console.error('Text-to-speech error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const toggleAutoSpeech = () => {
    setAutoSpeechEnabled(!autoSpeechEnabled);
    if (TextToSpeechService.isSpeaking()) {
      TextToSpeechService.stop();
      setIsSpeaking(false);
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob, transcription: string, speechConfidence: number) => {
    setIsProcessing(true);
    
    try {
      // Convert audio to base64 for backend processing
      const audioBase64 = await SpeechService.convertAudioToBase64(audioBlob);
      
      // Get target word from exercise prompt
      const targetWord = currentExercise?.prompt.match(/"([^"]+)"/)?.[1] || currentExercise?.targetSound || '';
      
      // Call real speech analysis service
      const analysisResult = await SpeechService.analyzePronunciation({
        audioData: audioBase64,
        transcription,
        targetWord,
        targetSound: currentExercise?.targetSound || '',
        childId: child?.id || '1',
        difficultyLevel
      });
      
      const newAttempt: Attempt = {
        id: `attempt-${Date.now()}`,
        transcription,
        accuracy: analysisResult.accuracy,
        confidence: analysisResult.confidence,
        feedback: analysisResult.feedback,
        timestamp: new Date().toISOString()
      };

      setAttempts(prev => [...prev, newAttempt]);
      setRecentPerformance(prev => [...prev.slice(-4), analysisResult.accuracy]);
      setSessionScore(prev => Math.max(prev, analysisResult.accuracy));
      setShowFeedback(true);
      setIsProcessing(false);

      // Update difficulty based on AI recommendation
      if (analysisResult.difficulty_recommendation !== difficultyLevel) {
        setDifficultyLevel(analysisResult.difficulty_recommendation);
      }

      // Show reward animation for good attempts
      if (analysisResult.accuracy > 80) {
        const rewardTypes: ('star' | 'rainbow' | 'elephant' | 'cloud')[] = ['star', 'rainbow', 'elephant', 'cloud'];
        setRewardType(rewardTypes[Math.floor(Math.random() * rewardTypes.length)]);
        setShowReward(true);
        setTimeout(() => setShowReward(false), 3000);
      }

      // Store AI decisions for display
      setAiDecisions(analysisResult.ai_decisions);
      
      // Speak feedback if enabled
      if (autoSpeechEnabled) {
        setTimeout(() => {
          speakFeedback(analysisResult.feedback, analysisResult.accuracy > 70);
        }, 500);
      }
      
    } catch (error) {
      console.error('Speech analysis failed:', error);
      setIsProcessing(false);
      
      // Fallback to local analysis
      const accuracy = calculatePronunciationAccuracy(transcription, currentExercise?.prompt.match(/"([^"]+)"/)?.[1] || '', speechConfidence);
      
      const newAttempt: Attempt = {
        id: `attempt-${Date.now()}`,
        transcription,
        accuracy,
        confidence: speechConfidence,
        feedback: generateDetailedFeedback(accuracy, transcription, currentExercise?.prompt.match(/"([^"]+)"/)?.[1] || '', currentExercise?.targetSound || ''),
        timestamp: new Date().toISOString()
      };

      setAttempts(prev => [...prev, newAttempt]);
      setRecentPerformance(prev => [...prev.slice(-4), accuracy]);
      setSessionScore(prev => Math.max(prev, accuracy));
      setShowFeedback(true);
    }
  };

  const calculatePronunciationAccuracy = (spoken: string, target: string, confidence: number): number => {
    if (!spoken || !target) return 0;
    
    const spokenLower = spoken.toLowerCase().trim();
    const targetLower = target.toLowerCase().trim();
    
    // Exact match gets highest score
    if (spokenLower === targetLower) {
      return Math.min(100, Math.round(85 + (confidence * 15)));
    }
    
    // Check if target word is contained in spoken text
    if (spokenLower.includes(targetLower)) {
      return Math.min(95, Math.round(75 + (confidence * 20)));
    }
    
    // Calculate phonetic similarity
    const similarity = calculatePhoneticSimilarity(spokenLower, targetLower);
    const baseScore = similarity * 70; // Max 70 for partial matches
    const confidenceBonus = confidence * 20; // Max 20 bonus for confidence
    
    return Math.max(0, Math.min(85, Math.round(baseScore + confidenceBonus)));
  };

  const calculatePhoneticSimilarity = (word1: string, word2: string): number => {
    // Simple phonetic similarity based on common speech patterns
    const phoneticMap: { [key: string]: string } = {
      'ph': 'f', 'gh': 'f', 'ck': 'k', 'qu': 'kw',
      'x': 'ks', 'c': 'k', 'z': 's', 'th': 't'
    };
    
    const normalize = (word: string) => {
      let normalized = word.toLowerCase();
      Object.entries(phoneticMap).forEach(([pattern, replacement]) => {
        normalized = normalized.replace(new RegExp(pattern, 'g'), replacement);
      });
      return normalized;
    };
    
    const norm1 = normalize(word1);
    const norm2 = normalize(word2);
    
    // Levenshtein distance
    const distance = levenshteinDistance(norm1, norm2);
    const maxLength = Math.max(norm1.length, norm2.length);
    
    return maxLength > 0 ? (maxLength - distance) / maxLength : 0;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const generateDetailedFeedback = (accuracy: number, spoken: string, target: string, targetSound: string): string => {
    if (accuracy >= 90) {
      return `Outstanding! You pronounced "${target}" perfectly! Your "${targetSound}" sound is excellent! 🌟`;
    } else if (accuracy >= 80) {
      return `Great job! You said "${spoken}" and we heard the "${targetSound}" sound clearly. Keep it up! 🎉`;
    } else if (accuracy >= 65) {
      return `Good effort! You said "${spoken}". Try to emphasize the "${targetSound}" sound more clearly. You're improving! 💪`;
    } else if (accuracy >= 40) {
      return `Nice try! You said "${spoken}". Let's focus on the "${targetSound}" sound in "${target}". Take your time! 🌱`;
    } else {
      return `Keep practicing! Remember to say "${target}" clearly. Focus on making the "${targetSound}" sound. Every try makes you better! 🎯`;
    }
  };

  const generateNextExercise = () => {
    setExerciseCount(prev => prev + 1);
    
    // Filter exercises by current difficulty level
    const suitableExercises = exercises.filter(ex => 
      ex.difficulty >= difficultyLevel - 1 && ex.difficulty <= difficultyLevel + 1
    );
    
    const randomExercise = suitableExercises[Math.floor(Math.random() * suitableExercises.length)];
    
    setCurrentExercise({
      id: `ex-${Date.now()}`,
      type: 'phoneme',
      prompt: randomExercise.prompt,
      targetSound: randomExercise.targetSound,
      difficulty: randomExercise.difficulty,
      attempts: [],
      completed: false
    });
    
    setAttempts([]);
    setShowFeedback(false);

    // Speak the new exercise instruction
    if (autoSpeechEnabled) {
      setTimeout(() => {
        speakExerciseInstruction(randomExercise.prompt, randomExercise.targetSound);
      }, 800);
    }
  };

  const getAIDecisions = () => {
    return {
      therapyAgent: aiDecisions.therapy_agent || aiDecisions.therapyAgent,
      speechAgent: aiDecisions.speech_agent || aiDecisions.speechAgent,
      adaptiveAgent: aiDecisions.adaptive_agent || aiDecisions.adaptiveAgent,
      progressAgent: aiDecisions.progress_agent || aiDecisions.progressAgent
    };
  };

  const getNextExerciseReason = () => {
    if (recentPerformance.length === 0) return "Starting with foundational exercises to assess current ability level.";
    
    const avgScore = recentPerformance.reduce((a, b) => a + b, 0) / recentPerformance.length;
    
    if (avgScore > 85) {
      return "Excellent performance detected! Introducing slightly more challenging exercises to promote continued growth.";
    } else if (avgScore < 60) {
      return "Adjusting to simpler exercises to build confidence and ensure successful learning experiences.";
    } else {
      return "Maintaining current difficulty level as performance indicates optimal challenge for skill development.";
    }
  };

  const completeSession = () => {
    navigate('/dashboard');
  };

  if (!child || !currentExercise) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beige-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading session...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <motion.button
              className="btn-secondary p-2"
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={20} />
            </motion.button>
            <motion.button
              className="btn-secondary p-2"
              onClick={() => setShowInstructions(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="How voice verification works"
            >
              <HelpCircle size={20} />
            </motion.button>
            <motion.button
              className={`btn-secondary p-2 ${isSpeaking ? 'bg-green-100' : ''}`}
              onClick={toggleAutoSpeech}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={autoSpeechEnabled ? "Disable AI voice instructions" : "Enable AI voice instructions"}
            >
              {autoSpeechEnabled ? (
                isSpeaking ? (
                  <Volume2 size={20} className="text-green-600" />
                ) : (
                  <Volume2 size={20} />
                )
              ) : (
                <VolumeX size={20} className="text-gray-400" />
              )}
            </motion.button>
            <div>
              <h1 className="font-display font-bold text-2xl text-gray-800">
                {child.name}'s Session
              </h1>
              <p className="text-gray-600">Practice makes progress! 🌟</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Session Score</p>
              <p className="text-2xl font-bold text-beige-600">{sessionScore}%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-beige-200 to-beige-300 rounded-full flex items-center justify-center text-2xl">
              {child.avatar}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Exercise Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exercise Prompt */}
            <motion.div
              className="card text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="inline-flex items-center space-x-2 bg-beige-100 px-4 py-2 rounded-full">
                    <span className="text-beige-600 font-medium">Target Sound:</span>
                    <span className="font-bold text-beige-700">/{currentExercise.targetSound}/</span>
                  </div>
                  <motion.button
                    onClick={() => setShowAIExplanation(!showAIExplanation)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Info size={16} className="text-gray-500" />
                  </motion.button>
                </div>
                <h2 className="font-display font-semibold text-2xl text-gray-800 mb-4">
                  {currentExercise.prompt}
                </h2>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <p className="text-gray-600">
                    Take your time and speak clearly. You've got this! 💪
                  </p>
                  <motion.button
                    onClick={() => speakExerciseInstruction(currentExercise.prompt, currentExercise.targetSound)}
                    disabled={isSpeaking || !TextToSpeechService.isSupported()}
                    className={`p-2 rounded-full transition-colors ${
                      isSpeaking 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                    } ${!TextToSpeechService.isSupported() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    whileHover={TextToSpeechService.isSupported() && !isSpeaking ? { scale: 1.1 } : {}}
                    whileTap={TextToSpeechService.isSupported() && !isSpeaking ? { scale: 0.9 } : {}}
                    title="Listen to instructions"
                  >
                    <Volume2 size={20} />
                  </motion.button>
                </div>
              </div>

              {/* Decorative illustration area */}
              <motion.div 
                className="flex justify-center space-x-4 mb-6"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-4xl">🎯</span>
                <span className="text-4xl">🗣️</span>
                <span className="text-4xl">⭐</span>
              </motion.div>
            </motion.div>

            {/* Voice Recorder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <VoiceRecorder 
                onRecordingComplete={handleRecordingComplete}
                isProcessing={isProcessing}
                targetWord={currentExercise.prompt.match(/"([^"]+)"/)?.[1] || currentExercise.targetSound}
              />
            </motion.div>

            {/* AI Agents Panel - Moved here for better flow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <AIAgentPanel agents={mockAIAgents} />
            </motion.div>

            {/* Session Progress - Moved here for better flow */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
                Session Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Exercises Completed</span>
                    <span className="font-medium">{exerciseCount}/5</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(exerciseCount / 5) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Best Score</span>
                    <span className="font-medium">{sessionScore}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${sessionScore}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Attempts This Exercise</span>
                    <span className="font-medium">{attempts.length}</span>
                  </div>
                </div>
              </div>

              {exerciseCount >= 3 && (
                <motion.button
                  className="w-full btn-primary mt-4"
                  onClick={completeSession}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Complete Session 🎉
                </motion.button>
              )}
            </motion.div>

            {/* Feedback Panel */}
            <AnimatePresence>
              {showFeedback && attempts.length > 0 && (
                <FeedbackCard
                  score={attempts[attempts.length - 1].accuracy}
                  transcription={attempts[attempts.length - 1].transcription}
                  targetSound={currentExercise.targetSound}
                  feedback={attempts[attempts.length - 1].feedback}
                  confidence={attempts[attempts.length - 1].confidence}
                  onTryAgain={() => setShowFeedback(false)}
                  onNextExercise={generateNextExercise}
                  showAIExplanation={showAIExplanation}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Adaptive Intelligence Panel */}
            <AdaptivePanel
              currentDifficulty={difficultyLevel}
              recentPerformance={recentPerformance}
              nextExerciseReason={getNextExerciseReason()}
              aiDecisions={getAIDecisions()}
            />
          </div>
        </div>

        {/* Voice Instructions Modal */}
        <VoiceInstructions 
          show={showInstructions}
          onClose={() => setShowInstructions(false)}
          targetWord={currentExercise.prompt.match(/"([^"]+)"/)?.[1] || currentExercise.targetSound}
        />

        {/* Reward Animation */}
        <RewardAnimation 
          show={showReward} 
          type={rewardType}
          onComplete={() => setShowReward(false)}
        />
      </div>
    </Layout>
  );
};

export default TherapySession;