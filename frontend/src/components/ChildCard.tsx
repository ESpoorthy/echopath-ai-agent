import React from 'react';
import { motion } from 'framer-motion';
import { ChildProfile } from '../types/index.ts';

interface ChildCardProps {
  child: ChildProfile;
  onSelect: (child: ChildProfile) => void;
}

const ChildCard: React.FC<ChildCardProps> = ({ child, onSelect }) => {
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'from-green-600 to-green-700 text-white'; // Dark green
    if (accuracy >= 80) return 'from-green-500 to-green-600 text-white'; // Medium-dark green
    if (accuracy >= 70) return 'from-green-400 to-green-500 text-white'; // Medium green
    if (accuracy >= 60) return 'from-green-300 to-green-400 text-gray-800'; // Light-medium green
    return 'from-green-200 to-green-300 text-gray-800'; // Light green
  };

  const getAccuracyProgressColor = (accuracy: number) => {
    if (accuracy >= 90) return 'from-green-600 to-green-700'; // Dark green
    if (accuracy >= 80) return 'from-green-500 to-green-600'; // Medium-dark green
    if (accuracy >= 70) return 'from-green-400 to-green-500'; // Medium green
    if (accuracy >= 60) return 'from-green-300 to-green-400'; // Light-medium green
    return 'from-green-200 to-green-300'; // Light green
  };

  return (
    <motion.div
      className="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onClick={() => onSelect(child)}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-beige-200 to-beige-300 rounded-full flex items-center justify-center text-2xl">
            {child.avatar}
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg text-gray-800">{child.name}</h3>
            <p className="text-sm text-gray-600">{child.age} years old</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          child.difficultyLevel === 'beginner' ? 'bg-green-100 text-green-700' :
          child.difficultyLevel === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
          'bg-orange-100 text-orange-700'
        }`}>
          {child.difficultyLevel}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Session Streak</span>
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-beige-600">{child.sessionStreak}</span>
            <span className="text-orange-400">🔥</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Average Accuracy</span>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${getAccuracyColor(child.averageAccuracy)}`}>
              {child.averageAccuracy}%
            </div>
          </div>
        </div>

        <div className="progress-bar">
          <motion.div 
            className={`h-full rounded-full bg-gradient-to-r ${getAccuracyProgressColor(child.averageAccuracy)}`}
            initial={{ width: 0 }}
            animate={{ width: `${child.averageAccuracy}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Total Sessions: {child.totalSessions}</span>
          <span>Last: {new Date(child.lastSessionDate).toLocaleDateString()}</span>
        </div>
      </div>

      <motion.div 
        className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        initial={false}
      >
        <button className="w-full btn-primary text-sm py-2">
          Start Session
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ChildCard;