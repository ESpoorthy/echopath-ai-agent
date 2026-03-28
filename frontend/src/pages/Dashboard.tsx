import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ChildCard from '../components/ChildCard';
import ProgressChart from '../components/ProgressChart';
import { mockChildren, mockProgressData, mockRewards } from '../utils/mockData';
import { ChildProfile, RewardBadge } from '../types';
import { Plus, Award, TrendingUp, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);

  const handleChildSelect = (child: ChildProfile) => {
    setSelectedChild(child);
    navigate(`/session/${child.id}`);
  };

  const handleAddChild = () => {
    // In a real app, this would open a form modal
    console.log('Add new child profile');
  };

  const stats = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Average Progress',
      value: '78%',
      change: '+12%',
      color: 'text-green-600'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Active Streak',
      value: '12 days',
      change: 'Personal best!',
      color: 'text-orange-600'
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: 'Badges Earned',
      value: mockRewards.filter(r => r.earned).length.toString(),
      change: '2 this week',
      color: 'text-purple-600'
    }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="font-display font-bold text-3xl text-gray-800 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">
            Let's continue the speech therapy journey with your children.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="card hover:shadow-lg transition-all duration-300"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className={`text-sm ${stat.color} font-medium`}>{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br from-beige-100 to-beige-200 ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Children Profiles */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-2xl text-gray-800">
                  Children Profiles
                </h2>
                <motion.button
                  className="btn-secondary flex items-center space-x-2"
                  onClick={handleAddChild}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus size={16} />
                  <span>Add Child</span>
                </motion.button>
              </div>

              <div className="grid gap-6">
                {mockChildren.map((child, index) => (
                  <motion.div
                    key={child.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <ChildCard child={child} onSelect={handleChildSelect} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Progress Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ProgressChart data={mockProgressData} />
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <motion.div
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
                Recent Achievements
              </h3>
              <div className="space-y-3">
                {mockRewards.filter(r => r.earned).map((badge, index) => (
                  <motion.div
                    key={badge.id}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-beige-50 to-cream-50 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-gray-800">{badge.name}</h4>
                      <p className="text-xs text-gray-600">{badge.description}</p>
                      {badge.earnedDate && (
                        <p className="text-xs text-beige-600 font-medium">
                          {new Date(badge.earnedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full btn-primary text-sm py-3">
                  Start Quick Session
                </button>
                <button className="w-full btn-secondary text-sm py-3">
                  View Progress Reports
                </button>
                <button className="w-full btn-secondary text-sm py-3">
                  Therapist Notes
                </button>
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              className="card bg-gradient-to-br from-sage-50 to-beige-50 border-sage-200"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="font-display font-semibold text-lg mb-3 text-gray-800">
                💡 Today's Tip
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Consistent daily practice, even for just 10 minutes, is more effective 
                than longer, infrequent sessions. Keep up the great work!
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;