import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Lock, Calendar, Target, TrendingUp, Star } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  category: 'accuracy' | 'consistency' | 'improvement' | 'milestone' | 'special';
  requirement: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface BadgesShowcaseProps {
  show: boolean;
  onClose: () => void;
  childName: string;
  badges: Badge[];
}

const BadgesShowcase: React.FC<BadgesShowcaseProps> = ({ 
  show, 
  onClose, 
  childName, 
  badges 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const categories = [
    { id: 'all', name: 'All Badges', icon: '🏆' },
    { id: 'accuracy', name: 'Accuracy', icon: '🎯' },
    { id: 'consistency', name: 'Consistency', icon: '📅' },
    { id: 'improvement', name: 'Improvement', icon: '📈' },
    { id: 'milestone', name: 'Milestones', icon: '🌟' },
    { id: 'special', name: 'Special', icon: '💎' }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500';
      case 'rare': return 'from-blue-400 to-blue-500';
      case 'epic': return 'from-purple-400 to-purple-500';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300';
      case 'rare': return 'border-blue-300';
      case 'epic': return 'border-purple-300';
      case 'legendary': return 'border-yellow-300';
      default: return 'border-gray-300';
    }
  };

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const earnedBadges = badges.filter(badge => badge.earned);
  const totalBadges = badges.length;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-gray-800">
                  {childName}'s Badge Collection
                </h2>
                <p className="text-gray-600">
                  {earnedBadges.length} of {totalBadges} badges earned ({Math.round((earnedBadges.length / totalBadges) * 100)}%)
                </p>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} className="text-gray-500" />
              </motion.button>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Collection Progress</span>
                <span className="font-medium">{earnedBadges.length}/{totalBadges}</span>
              </div>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${(earnedBadges.length / totalBadges) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    selectedCategory === category.id
                      ? 'bg-orange-100 text-orange-700 border border-orange-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{category.icon}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {filteredBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  className={`card cursor-pointer transition-all hover:shadow-lg ${
                    badge.earned ? 'opacity-100' : 'opacity-60'
                  } ${getRarityBorder(badge.rarity)}`}
                  onClick={() => setSelectedBadge(badge)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: badge.earned ? 1 : 0.6, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-center">
                    {/* Badge Icon with Rarity Glow */}
                    <div className="relative mb-3">
                      <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center text-2xl text-white shadow-lg`}>
                        {badge.earned ? badge.icon : <Lock size={20} />}
                      </div>
                      {badge.earned && badge.rarity === 'legendary' && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-30"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>
                    
                    <h3 className={`font-medium text-sm mb-1 ${
                      badge.earned ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {badge.name}
                    </h3>
                    
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {badge.earned ? badge.description : badge.requirement}
                    </p>
                    
                    {badge.earned && badge.earnedDate && (
                      <p className="text-xs text-green-600 mt-1">
                        {new Date(badge.earnedDate).toLocaleDateString()}
                      </p>
                    )}
                    
                    {/* Rarity Indicator */}
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white`}>
                      {badge.rarity}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Achievements */}
            <motion.div 
              className="card bg-gradient-to-r from-green-50 to-emerald-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
                Recent Achievements
              </h3>
              
              <div className="space-y-3">
                {earnedBadges
                  .sort((a, b) => new Date(b.earnedDate || '').getTime() - new Date(a.earnedDate || '').getTime())
                  .slice(0, 3)
                  .map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      className="flex items-center space-x-3 p-3 bg-white rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center text-white`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{badge.name}</div>
                        <div className="text-sm text-gray-600">{badge.description}</div>
                      </div>
                      <div className="text-xs text-green-600">
                        {badge.earnedDate && new Date(badge.earnedDate).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                
                {earnedBadges.length === 0 && (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No badges earned yet</p>
                    <p className="text-sm text-gray-500">Keep practicing to earn your first badge!</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Badge Detail Modal */}
            <AnimatePresence>
              {selectedBadge && (
                <motion.div
                  className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedBadge(null)}
                >
                  <motion.div
                    className="bg-white rounded-2xl p-6 max-w-md w-full"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-center">
                      <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${getRarityColor(selectedBadge.rarity)} flex items-center justify-center text-3xl text-white shadow-lg mb-4`}>
                        {selectedBadge.earned ? selectedBadge.icon : <Lock size={24} />}
                      </div>
                      
                      <h3 className="font-display font-bold text-xl text-gray-800 mb-2">
                        {selectedBadge.name}
                      </h3>
                      
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 bg-gradient-to-r ${getRarityColor(selectedBadge.rarity)} text-white`}>
                        {selectedBadge.rarity} badge
                      </div>
                      
                      <p className="text-gray-600 mb-4">
                        {selectedBadge.description}
                      </p>
                      
                      {selectedBadge.earned ? (
                        <div className="bg-green-50 rounded-lg p-3 mb-4">
                          <p className="text-green-800 font-medium">Earned!</p>
                          {selectedBadge.earnedDate && (
                            <p className="text-green-600 text-sm">
                              {new Date(selectedBadge.earnedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="bg-orange-50 rounded-lg p-3 mb-4">
                          <p className="text-orange-800 font-medium">How to earn:</p>
                          <p className="text-orange-700 text-sm">
                            {selectedBadge.requirement}
                          </p>
                        </div>
                      )}
                      
                      <motion.button
                        onClick={() => setSelectedBadge(null)}
                        className="btn-primary px-6 py-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Close
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BadgesShowcase;