import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.tsx';
import ChildCard from '../components/ChildCard.tsx';
import ProgressAnalytics from '../components/ProgressAnalytics.tsx';
import StreakAnalytics from '../components/StreakAnalytics.tsx';
import BadgesShowcase from '../components/BadgesShowcase.tsx';
import ProfileForm from '../components/ProfileForm.tsx';
import { mockChildren, mockProgressData, enhancedBadges, mockStreakData, generateInitialProgressData, generateInitialBadges, generateInitialStreakData } from '../utils/mockData.ts';
import { ChildProfile } from '../types/index.ts';
import { Plus, Award, TrendingUp, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Load children from localStorage or use mock data
  const [children, setChildren] = useState<ChildProfile[]>(() => {
    const savedChildren = localStorage.getItem('echopath_children');
    if (savedChildren) {
      try {
        return JSON.parse(savedChildren);
      } catch (error) {
        console.error('Error parsing saved children:', error);
      }
    }
    return mockChildren;
  });
  
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [showProgressAnalytics, setShowProgressAnalytics] = useState(false);
  const [showStreakAnalytics, setShowStreakAnalytics] = useState(false);
  const [showBadgesShowcase, setShowBadgesShowcase] = useState(false);
  const [showAddChildForm, setShowAddChildForm] = useState(false);

  // Save children to localStorage whenever children state changes
  React.useEffect(() => {
    localStorage.setItem('echopath_children', JSON.stringify(children));
  }, [children]);

  const handleChildSelect = (child: ChildProfile) => {
    setSelectedChild(child);
    navigate(`/session/${child.id}`);
  };

  const handleAddChild = () => {
    setShowAddChildForm(true);
  };

  const handleCloseAddChild = () => {
    setShowAddChildForm(false);
  };

  const handleChildAdded = (newChildData: any) => {
    // Generate a new child profile
    const newChild: ChildProfile = {
      id: `child-${Date.now()}`, // Simple ID generation
      name: newChildData.name,
      age: newChildData.age,
      avatar: getRandomAvatar(),
      difficultyLevel: newChildData.difficultyLevel,
      targetPhonemes: getTargetPhonemesForLevel(newChildData.difficultyLevel),
      sessionStreak: 0,
      totalSessions: 0,
      averageAccuracy: 50, // Starting accuracy
      lastSessionDate: new Date().toISOString().split('T')[0],
      preferences: {
        favoriteRewards: [newChildData.preferences.visualPreference],
        sessionLength: newChildData.preferences.sessionLength,
        breakFrequency: 3
      }
    };

    // Add to children list
    setChildren(prev => [...prev, newChild]);
    
    // Close the form
    setShowAddChildForm(false);
    
    // Select the new child
    setSelectedChild(newChild);
    
    // Show success notification (you could add a toast notification here)
    console.log(`New child profile created for ${newChild.name}!`);
  };

  // Helper functions
  const getRandomAvatar = () => {
    const avatars = ['👧', '👦', '🧒', '👶', '🧑'];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  const getTargetPhonemesForLevel = (level: string) => {
    switch (level) {
      case 'beginner': return ['s', 'l'];
      case 'intermediate': return ['r', 's', 'th'];
      case 'advanced': return ['r', 's', 'th', 'ch', 'sh'];
      default: return ['s', 'l'];
    }
  };

  // Calculate stats for selected child or first child if none selected
  const currentChild = selectedChild || children[0];
  const earnedBadges = enhancedBadges.filter(badge => badge.earned).length;
  
  // If no children exist, show empty state
  if (children.length === 0) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="font-display font-bold text-3xl text-gray-800 mb-4">
                Welcome to EchoPath AI! 🌟
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Let's start by creating your first child profile
              </p>
              <motion.button
                onClick={handleAddChild}
                className="btn-primary text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={20} className="mr-2" />
                Create First Profile
              </motion.button>
            </motion.div>
          </div>
          
          {/* Add Child Modal */}
          {showAddChildForm && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <ProfileForm 
                  onClose={handleCloseAddChild} 
                  isModal={true} 
                  onChildAdded={handleChildAdded}
                />
              </motion.div>
            </motion.div>
          )}
        </div>
      </Layout>
    );
  }
  
  const getChildStats = (child: ChildProfile) => [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Average Progress',
      value: `${child.averageAccuracy}%`,
      change: child.averageAccuracy > 75 ? '+12%' : '+8%',
      color: 'text-green-600',
      onClick: () => {
        setSelectedChild(child);
        setShowProgressAnalytics(true);
      }
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Active Streak',
      value: `${child.sessionStreak} days`,
      change: child.sessionStreak > 10 ? 'Personal best!' : 'Great progress!',
      color: 'text-orange-600',
      onClick: () => {
        setSelectedChild(child);
        setShowStreakAnalytics(true);
      }
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: 'Badges Earned',
      value: earnedBadges.toString(),
      change: '2 this week',
      color: 'text-purple-600',
      onClick: () => {
        setSelectedChild(child);
        setShowBadgesShowcase(true);
      }
    }
  ];

  const stats = getChildStats(currentChild);

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

        {/* Child Selector for Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-xl text-gray-800">
              Progress Overview for:
            </h2>
            <div className="flex space-x-2">
              {children.map((child) => (
                <motion.button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    (selectedChild?.id || children[0]?.id) === child.id
                      ? 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border-2 border-orange-300'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg">{child.avatar}</span>
                  <span className="font-medium">{child.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
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
              className="card-enhanced hover:shadow-lg transition-all duration-300 cursor-pointer"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={stat.onClick}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className={`text-sm ${stat.color} font-medium`}>{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br from-orange-100 to-yellow-100 ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-500 text-center">
                Click to view details
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Children Profiles */}
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
            {children.map((child, index) => (
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

        {/* Analytics Modals */}
        <ProgressAnalytics
          show={showProgressAnalytics}
          onClose={() => setShowProgressAnalytics(false)}
          childName={currentChild.name}
          progressData={mockProgressData}
        />

        <StreakAnalytics
          show={showStreakAnalytics}
          onClose={() => setShowStreakAnalytics(false)}
          childName={currentChild.name}
          streakData={mockStreakData}
          currentStreak={currentChild.sessionStreak}
          bestStreak={15}
        />

        <BadgesShowcase
          show={showBadgesShowcase}
          onClose={() => setShowBadgesShowcase(false)}
          childName={currentChild.name}
          badges={enhancedBadges}
        />

        {/* Add Child Modal */}
        {showAddChildForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ProfileForm 
                onClose={handleCloseAddChild} 
                isModal={true} 
                onChildAdded={handleChildAdded}
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;