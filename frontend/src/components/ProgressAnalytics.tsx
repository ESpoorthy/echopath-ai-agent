import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { X, TrendingUp, Calendar, Target } from 'lucide-react';

interface ProgressAnalyticsProps {
  show: boolean;
  onClose: () => void;
  childName: string;
  progressData: Array<{
    date: string;
    accuracy: number;
    sessionsCompleted: number;
    streakDays: number;
    phonemeScores: { [key: string]: number };
  }>;
}

const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ 
  show, 
  onClose, 
  childName, 
  progressData 
}) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-cream-200">
          <p className="font-medium text-gray-800">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const averageAccuracy = progressData.length > 0 
    ? progressData.reduce((sum, day) => sum + day.accuracy, 0) / progressData.length 
    : 0;

  const improvementRate = progressData.length > 1 
    ? progressData[progressData.length - 1].accuracy - progressData[0].accuracy 
    : 0;

  const totalSessions = progressData.reduce((sum, day) => sum + day.sessionsCompleted, 0);

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
                  {childName}'s Progress Analytics
                </h2>
                <p className="text-gray-600">Detailed performance insights and trends</p>
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

            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <motion.div 
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{Math.round(averageAccuracy)}%</div>
                <div className="text-sm text-gray-600">Average Accuracy</div>
                <div className={`text-xs mt-1 ${improvementRate >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {improvementRate >= 0 ? '+' : ''}{Math.round(improvementRate)}% improvement
                </div>
              </motion.div>

              <motion.div 
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">{totalSessions}</div>
                <div className="text-sm text-gray-600">Total Sessions</div>
                <div className="text-xs text-blue-600 mt-1">
                  {progressData.length} days tracked
                </div>
              </motion.div>

              <motion.div 
                className="card text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Target className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {Math.max(...progressData.map(d => d.streakDays))}
                </div>
                <div className="text-sm text-gray-600">Best Streak</div>
                <div className="text-xs text-purple-600 mt-1">
                  Current: {progressData[progressData.length - 1]?.streakDays || 0} days
                </div>
              </motion.div>
            </div>

            {/* Accuracy Trend Chart */}
            <motion.div 
              className="card mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
                Accuracy Trend Over Time
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFD8A8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#FFD8A8" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f1eb" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      domain={[0, 100]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#FFD8A8" 
                      strokeWidth={3}
                      fill="url(#accuracyGradient)"
                      name="Accuracy"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Phoneme Performance */}
            <motion.div 
              className="card mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
                Sound-Specific Performance
              </h3>
              
              {/* Get unique phonemes */}
              {(() => {
                const allPhonemes = new Set<string>();
                progressData.forEach(day => {
                  Object.keys(day.phonemeScores).forEach(phoneme => allPhonemes.add(phoneme));
                });
                
                return Array.from(allPhonemes).map(phoneme => {
                  const phonemeData = progressData.map(day => ({
                    date: day.date,
                    score: day.phonemeScores[phoneme] || 0
                  })).filter(item => item.score > 0);
                  
                  const avgScore = phonemeData.length > 0 
                    ? phonemeData.reduce((sum, item) => sum + item.score, 0) / phonemeData.length 
                    : 0;
                  
                  return (
                    <div key={phoneme} className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">/{phoneme}/ sound</span>
                        <span className="text-sm font-bold text-gray-800">{Math.round(avgScore)}%</span>
                      </div>
                      <div className="progress-bar">
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${avgScore}%` }}
                          transition={{ duration: 1, delay: 0.1 }}
                        />
                      </div>
                    </div>
                  );
                });
              })()}
            </motion.div>

            {/* Performance Insights */}
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
                AI Insights & Recommendations
              </h3>
              
              <div className="space-y-3">
                {improvementRate > 10 && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-green-600">🎉</span>
                      <span className="font-medium text-green-800">Excellent Progress!</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      {childName} has improved by {Math.round(improvementRate)}% - keep up the great work!
                    </p>
                  </div>
                )}
                
                {averageAccuracy > 85 && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-600">⭐</span>
                      <span className="font-medium text-blue-800">High Achiever</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Consistently high accuracy scores suggest readiness for more challenging exercises.
                    </p>
                  </div>
                )}
                
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-600">💡</span>
                    <span className="font-medium text-orange-800">Next Steps</span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Focus on maintaining consistent practice sessions to build on current progress.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProgressAnalytics;