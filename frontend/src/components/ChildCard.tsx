import React from 'react';
import { motion } from 'framer-motion';
import { ChildProfile } from '../types';

interface ChildCardProps {
  child: ChildProfile;
  onSelect: (child: ChildProfile) => void;
}

const ChildCard: React.FC<ChildCardProps> = ({ child, onSelect }) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
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
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(child.difficultyLevel)}`}>
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
          <span className="font-semibold text-beige-600">{child.averageAccuracy}%</span>
        </div>

        <div className="progress-bar">
          <motion.div 
            className="progress-fill"
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