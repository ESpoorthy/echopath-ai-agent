import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RewardAnimationProps {
  show: boolean;
  type: 'star' | 'rainbow' | 'elephant' | 'cloud';
  onComplete?: () => void;
}

const RewardAnimation: React.FC<RewardAnimationProps> = ({ show, type, onComplete }) => {
  const getRewardEmoji = (rewardType: string) => {
    switch (rewardType) {
      case 'star': return '⭐';
      case 'rainbow': return '🌈';
      case 'elephant': return '🐘';
      case 'cloud': return '☁️';
      default: return '⭐';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={onComplete}
        >
          <motion.div
            className="text-8xl"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [0, 360, 0]
            }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              duration: 2,
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
          >
            {getRewardEmoji(type)}
          </motion.div>
          
          {/* Sparkle effects */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              initial={{ 
                scale: 0,
                x: 0,
                y: 0,
                opacity: 0
              }}
              animate={{
                scale: [0, 1, 0],
                x: [0, (i % 2 ? 100 : -100) * Math.cos(i * Math.PI / 3)],
                y: [0, (i % 2 ? 100 : -100) * Math.sin(i * Math.PI / 3)],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                delay: 0.5 + i * 0.1,
                ease: "easeOut"
              }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RewardAnimation;