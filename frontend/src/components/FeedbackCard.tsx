import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, Target, TrendingUp } from 'lucide-react';

interface FeedbackCardProps {
  score: number;
  transcription: string;
  targetSound: string;
  feedback: string;
  confidence: number;
  onTryAgain: () => void;
  onNextExercise: () => void;
  showAIExplanation?: boolean;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  score,
  transcription,
  targetSound,
  feedback,
  confidence,
  onTryAgain,
  onNextExercise,
  showAIExplanation = false
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-500';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-8 h-8 text-green-500" />;
    if (score >= 75) return <Star className="w-8 h-8 text-yellow-500" />;
    if (score >= 60) return <Target className="w-8 h-8 text-orange-500" />;
    return <TrendingUp className="w-8 h-8 text-red-500" />;
  };

  const getEncouragingMessage = (score: number) => {
    if (score >= 90) return "Outstanding! You're a speech superstar! 🌟";
    if (score >= 75) return "Great job! You're getting better every time! 🎉";
    if (score >= 60) return "Good effort! Keep practicing, you're improving! 💪";
    return "Nice try! Every practice makes you stronger! 🌱";
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center">
        {/* Score Display */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="flex justify-center mb-3">
            {getScoreIcon(score)}
          </div>
          <div className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}>
            {score}%
          </div>
          <div className="text-lg font-medium text-gray-800">
            {getEncouragingMessage(score)}
          </div>
        </motion.div>

        {/* Feedback Details */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="text-sm text-blue-600 font-medium mb-1">Target Sound</div>
            <div className="text-2xl font-bold text-blue-800">/{targetSound}/</div>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4">
            <div className="text-sm text-green-600 font-medium mb-1">You Said</div>
            <div className="text-lg font-semibold text-green-800">"{transcription}"</div>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="text-sm text-purple-600 font-medium mb-1">Confidence</div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-16 h-2 bg-purple-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <span className="text-sm font-bold text-purple-800">
                {Math.round(confidence * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* AI Feedback */}
        <motion.div
          className="bg-gradient-to-r from-beige-50 to-cream-50 rounded-xl p-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-2">
            <span className="text-lg">🤖</span>
            <span className="font-medium text-gray-800">AI Speech Coach Says:</span>
          </div>
          <p className="text-gray-700">{feedback}</p>
        </motion.div>

        {/* AI Decision Explanation */}
        {showAIExplanation && (
          <motion.div
            className="bg-blue-50 rounded-xl p-4 mb-6 text-left"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-blue-600">🧠</span>
              <span className="font-semibold text-blue-800">AI Decision Process</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span><strong>Speech Agent:</strong> Analyzed pronunciation accuracy</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span><strong>Adaptive Agent:</strong> {score >= 80 ? 'Recommending slight difficulty increase' : 'Maintaining current level for practice'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span><strong>Progress Agent:</strong> Updated learning trajectory</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 justify-center">
          <motion.button
            className="btn-secondary flex items-center space-x-2 px-6 py-3"
            onClick={onTryAgain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>🔄</span>
            <span>Try Again</span>
          </motion.button>
          
          <motion.button
            className="btn-primary flex items-center space-x-2 px-6 py-3"
            onClick={onNextExercise}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Next Exercise</span>
            <span>→</span>
          </motion.button>
        </div>

        {/* Reward Elements */}
        {score >= 85 && (
          <motion.div
            className="mt-4 flex justify-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              🏆
            </motion.span>
            <motion.span
              className="text-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: 3, delay: 0.2 }}
            >
              ⭐
            </motion.span>
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: 3, delay: 0.4 }}
            >
              🎉
            </motion.span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FeedbackCard;