import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, Target, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface AdaptivePanelProps {
  currentDifficulty: number;
  recentPerformance: number[];
  nextExerciseReason: string;
  aiDecisions: {
    therapyAgent: string;
    speechAgent: string;
    adaptiveAgent: string;
    progressAgent: string;
  };
}

const AdaptivePanel: React.FC<AdaptivePanelProps> = ({
  currentDifficulty,
  recentPerformance,
  nextExerciseReason,
  aiDecisions
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const getDifficultyLabel = (level: number) => {
    if (level <= 3) return { label: 'Beginner', color: 'text-green-600', bg: 'bg-green-100' };
    if (level <= 6) return { label: 'Intermediate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Advanced', color: 'text-orange-600', bg: 'bg-orange-100' };
  };

  const averagePerformance = recentPerformance.length > 0 
    ? recentPerformance.reduce((a, b) => a + b, 0) / recentPerformance.length 
    : 0;

  const difficultyInfo = getDifficultyLabel(currentDifficulty);

  const agentData = [
    {
      name: 'Therapy Planner',
      icon: '🎯',
      decision: aiDecisions.therapyAgent,
      color: 'from-blue-400 to-blue-500',
      status: 'active'
    },
    {
      name: 'Speech Analyzer',
      icon: '🗣️',
      decision: aiDecisions.speechAgent,
      color: 'from-green-400 to-green-500',
      status: 'processing'
    },
    {
      name: 'Adaptive Learning',
      icon: '🧠',
      decision: aiDecisions.adaptiveAgent,
      color: 'from-purple-400 to-purple-500',
      status: 'active'
    },
    {
      name: 'Progress Tracker',
      icon: '📊',
      decision: aiDecisions.progressAgent,
      color: 'from-orange-400 to-orange-500',
      status: 'idle'
    }
  ];

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="font-display font-semibold text-lg text-gray-800">
            AI Intelligence Panel
          </h3>
        </div>
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </motion.button>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-r from-beige-50 to-cream-50 rounded-xl p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Target className="w-4 h-4 text-beige-600" />
            <span className="text-sm font-medium text-gray-700">Difficulty Level</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyInfo.bg} ${difficultyInfo.color}`}>
              {difficultyInfo.label}
            </span>
            <span className="text-sm text-gray-600">{currentDifficulty}/10</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Performance</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-green-600">
              {Math.round(averagePerformance)}%
            </span>
            <div className="w-12 h-1.5 bg-green-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${averagePerformance}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Next Exercise Reasoning */}
      <div className="bg-blue-50 rounded-xl p-4 mb-4">
        <div className="flex items-start space-x-2">
          <div className="flex items-center space-x-1">
            <span className="text-blue-600">💡</span>
            <span className="font-medium text-blue-800 text-sm">Why This Exercise?</span>
            <motion.button
              onHoverStart={() => setShowTooltip('reasoning')}
              onHoverEnd={() => setShowTooltip(null)}
              className="relative"
            >
              <Info size={12} className="text-blue-500" />
              <AnimatePresence>
                {showTooltip === 'reasoning' && (
                  <motion.div
                    className="absolute bottom-full left-0 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-10"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                  >
                    AI agents collaborate to choose optimal exercises
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
        <p className="text-blue-700 text-sm mt-2">{nextExerciseReason}</p>
      </div>

      {/* AI Agents Grid */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="text-sm font-medium text-gray-700 mb-2">Agent Decisions:</div>
            {agentData.map((agent, index) => (
              <motion.div
                key={agent.name}
                className="bg-white border border-cream-200 rounded-lg p-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 bg-gradient-to-r ${agent.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                      {agent.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-800">{agent.name}</div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${
                          agent.status === 'active' ? 'bg-green-500' : 
                          agent.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                        <span className="text-xs text-gray-500 capitalize">{agent.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{agent.decision}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance Trend */}
      {recentPerformance.length > 0 && (
        <div className="mt-4 pt-4 border-t border-cream-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Recent Trend</span>
            <span className="text-xs text-gray-500">{recentPerformance.length} attempts</span>
          </div>
          <div className="flex items-end space-x-1 h-8">
            {recentPerformance.map((score, index) => (
              <motion.div
                key={index}
                className="flex-1 bg-gradient-to-t from-beige-400 to-beige-300 rounded-t"
                initial={{ height: 0 }}
                animate={{ height: `${(score / 100) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdaptivePanel;