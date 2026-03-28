import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import VoiceRecorder from '../components/VoiceRecorder';
import AIAgentPanel from '../components/AIAgentPanel';
import { mockChildren, mockSession, mockAIAgents } from '../utils/mockData';
import { Exercise, Attempt, ChildProfile } from '../types';
import { ArrowLeft, RotateCcw, CheckCircle, Star } from 'lucide-react';

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

  useEffect(() => {
    if (childId) {
      const foundChild = mockChildren.find(c => c.id === childId);
      setChild(foundChild || null);
      
      // Initialize first exercise
      setCurrentExercise({
        id: 'ex-1',
        type: 'phoneme',
        prompt: 'Say "red" clearly and slowly',
        targetSound: 'r',
        difficulty: 3,
        attempts: [],
        completed: false
      });
    }
  }, [childId]);

  const handleRecordingComplete = async (audioBlob: Blob, transcription: string) => {
    setIsProcessing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI analysis
    const accuracy = Math.floor(Math.random() * 30) + 70; // 70-100%
    const confidence = Math.random() * 0.3 + 0.7; // 0.7-1.0
    
    const newAttempt: Attempt = {
      id: `attempt-${Date.now()}`,
      transcription,
      accuracy,
      confidence,
      feedback: accuracy > 85 ? 'Excellent pronunciation!' : accuracy > 70 ? 'Good job! Try to emphasize the "r" sound more.' : 'Keep practicing! Focus on tongue position.',
      timestamp: new Date().toISOString()
    };

    setAttempts(prev => [...prev, newAttempt]);
    setSessionScore(prev => Math.max(prev, accuracy));
    setShowFeedback(true);
    setIsProcessing(false);

    // Show reward animation for good attempts
    if (accuracy > 80) {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }
  };

  const generateNextExercise = () => {
    const exercises = [
      { prompt: 'Say "rainbow" with a clear "r" sound', targetSound: 'r' },
      { prompt: 'Practice "star" - focus on the ending', targetSound: 'r' },
      { prompt: 'Try "car" - make the "r" strong', targetSound: 'r' },
      { prompt: 'Say "sun" with a clear "s" sound', targetSound: 's' },
      { prompt: 'Practice "snake" - emphasize the "s"', targetSound: 's' }
    ];
    
    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    
    setCurrentExercise({
      id: `ex-${Date.now()}`,
      type: 'phoneme',
      prompt: randomExercise.prompt,
      targetSound: randomExercise.targetSound,
      difficulty: 3,
      attempts: [],
      completed: false
    });
    
    setAttempts([]);
    setShowFeedback(false);
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
                <div className="inline-flex items-center space-x-2 bg-beige-100 px-4 py-2 rounded-full mb-4">
                  <span className="text-beige-600 font-medium">Target Sound:</span>
                  <span className="font-bold text-beige-700">/{currentExercise.targetSound}/</span>
                </div>
                <h2 className="font-display font-semibold text-2xl text-gray-800 mb-4">
                  {currentExercise.prompt}
                </h2>
                <p className="text-gray-600">
                  Take your time and speak clearly. You've got this! 💪
                </p>
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
              />
            </motion.div>

            {/* Feedback Panel */}
            <AnimatePresence>
              {showFeedback && attempts.length > 0 && (
                <motion.div
                  className="card"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-center">
                    <div className="mb-4">
                      {attempts[attempts.length - 1].accuracy > 85 ? (
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      ) : (
                        <Star className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                      )}
                      <h3 className="font-display font-semibold text-xl text-gray-800">
                        {attempts[attempts.length - 1].feedback}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">Accuracy</p>
                        <p className="text-2xl font-bold text-beige-600">
                          {attempts[attempts.length - 1].accuracy}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-1">You Said</p>
                        <p className="text-lg font-medium text-gray-800">
                          "{attempts[attempts.length - 1].transcription}"
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-3 justify-center">
                      <motion.button
                        className="btn-secondary flex items-center space-x-2"
                        onClick={() => setShowFeedback(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <RotateCcw size={16} />
                        <span>Try Again</span>
                      </motion.button>
                      <motion.button
                        className="btn-primary flex items-center space-x-2"
                        onClick={generateNextExercise}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>Next Exercise</span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Agents Panel */}
            <AIAgentPanel agents={mockAIAgents} />

            {/* Session Progress */}
            <motion.div
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
                Session Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Attempts</span>
                    <span className="font-medium">{attempts.length}/5</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(attempts.length / 5) * 100}%` }}
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
              </div>

              {attempts.length >= 3 && (
                <motion.button
                  className="w-full btn-primary mt-4"
                  onClick={completeSession}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Complete Session
                </motion.button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Reward Animation */}
        <AnimatePresence>
          {showReward && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-6xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                🌟
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default TherapySession;