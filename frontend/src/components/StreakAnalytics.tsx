import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { X, Calendar, Flame, Trophy, Target } from 'lucide-react';

interface StreakAnalyticsProps {
  show: boolean;
  onClose: () => void;
  childName: string;
  streakData: Array<{
    week: string;
    days: number;
    sessions: number;
    isCurrentWeek?: boolean;
  }>;
  currentStreak: number;
  bestStreak: number;
}

const StreakAnalytics: React.FC<StreakAnalyticsProps> = ({ 
  show, 
  onClose, 
  childName, 
  streakData,
  currentStreak,
  bestStreak
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-cream-200">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-sm text-orange-600">
            Active Days: {data.days}/7
          </p>
          <p className="text-sm text-blue-600">
            Sessions: {data.sessions}
          </p>
        </div>
      );
    }
    return null;
  };

  const getBarColor = (days: number, isCurrentWeek: boolean) => {
    if (isCurrentWeek) return '#FF6B35'; // Current week - orange
    if (days === 7) return '#10B981'; // Perfect week - green
    if (days >= 5) return '#F59E0B'; // Good week - amber
    if (days >= 3) return '#EF4444'; // Okay week - red
    return '#9CA3AF'; // Low activity - gray
  };

  const weeklyStats = {
    perfectWeeks: streakData.filter(week => week.days === 7).length,
    averageDays: streakData.length > 0 
      ? streakData.reduce((sum, week) => sum + week.days, 0) / streakData.length 
      : 0,
    totalSessions: streakData.reduce((sum, week) => sum + week.sessions, 0),
    consistency: streakData.length > 0 
      ? (streakData.filter(week => week.days >= 5).length / streakData.length) * 100 
      : 0
  };

  const achievements = [
    {
      icon: '🔥',
      title: 'Current Streak',
      value: `${currentStreak} days`,
      description: currentStreak > bestStreak ? 'New personal record!' : 'Keep it going!',
      color: 'text-orange-600'
    },
    {
      icon: '🏆',
      title: 'Best Streak',
      value: `${bestStreak} days`,
      description: 'Personal best achievement',
      color: 'text-yellow-600'
    },
    {
      icon: '⭐',
      title: 'Perfect Weeks',
      value: weeklyStats.perfectWeeks,
      description: '7 days of practice',
      color: 'text-green-600'
    },
    {
      icon: '📊',
      title: 'Consistency',
      value: `${Math.round(weeklyStats.consistency)}%`,
      description: 'Weeks with 5+ days',
      color: 'text-blue-600'
    }
  ];

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
            className="bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl text-gray-800">
                  {childName}'s Activity Streaks
                </h2>
                <p className="text-gray-600">Practice consistency and achievements</p>
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

            {/* Achievement Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              {achievements.map((achievement, index) => (
                <motion.div 
                  key={achievement.title}
                  className="card text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className={`text-2xl font-bold ${achievement.color}`}>
                    {achievement.value}
                  </div>
                  <div className="text-sm font-medium text-gray-800 mb-1">
                    {achievement.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {achievement.description}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Weekly Activity Chart */}
            <motion.div 
              className="card mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
                Weekly Activity Pattern
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={streakData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f1eb" />
                    <XAxis 
                      dataKey="week" 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      domain={[0, 7]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="days" radius={[4, 4, 0, 0]}>
                      {streakData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={getBarColor(entry.days, entry.isCurrentWeek || false)} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Perfect Week (7 days)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Good Week (5-6 days)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Okay Week (3-4 days)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-orange-500 rounded"></div>
                  <span>Current Week</span>
                </div>
              </div>
            </motion.div>

            {/* Streak Milestones */}
            <motion.div 
              className="card mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
                Streak Milestones
              </h3>
              
              <div className="space-y-3">
                {[
                  { days: 3, title: 'Getting Started', icon: '🌱', achieved: currentStreak >= 3 },
                  { days: 7, title: 'One Week Wonder', icon: '⭐', achieved: bestStreak >= 7 },
                  { days: 14, title: 'Two Week Champion', icon: '🏆', achieved: bestStreak >= 14 },
                  { days: 30, title: 'Monthly Master', icon: '👑', achieved: bestStreak >= 30 },
                  { days: 50, title: 'Consistency King', icon: '💎', achieved: bestStreak >= 50 }
                ].map((milestone, index) => (
                  <motion.div
                    key={milestone.days}
                    className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                      milestone.achieved 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{milestone.icon}</span>
                      <div>
                        <div className={`font-medium ${
                          milestone.achieved ? 'text-green-800' : 'text-gray-600'
                        }`}>
                          {milestone.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {milestone.days} day streak
                        </div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      milestone.achieved 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {milestone.achieved ? 'Achieved!' : 'Locked'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Motivational Message */}
            <motion.div 
              className="card bg-gradient-to-r from-orange-50 to-yellow-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-center">
                <Flame className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-display font-semibold text-lg text-gray-800 mb-2">
                  Keep the Streak Alive!
                </h3>
                <p className="text-gray-600 mb-4">
                  {currentStreak === 0 
                    ? "Start your journey today - every expert was once a beginner!"
                    : currentStreak < 7
                      ? `You're ${7 - currentStreak} days away from your first week milestone!`
                      : currentStreak === bestStreak
                        ? "You're on your best streak ever - amazing work!"
                        : `Only ${bestStreak - currentStreak + 1} more days to beat your personal best!`
                  }
                </p>
                <div className="text-sm text-orange-600 font-medium">
                  💡 Tip: Consistent daily practice, even for 5 minutes, builds lasting habits!
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StreakAnalytics;