import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.tsx';
import ProgressChart from '../components/ProgressChart.tsx';
import { mockChildren, mockProgressData, mockAIAgents } from '../utils/mockData.ts';
import { ChildProfile } from '../types/index.ts';
import { 
  User, 
  Calendar, 
  TrendingUp, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Settings,
  Download
} from 'lucide-react';

const TherapistView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState<ChildProfile>(mockChildren[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'compliance'>('overview');

  const sessionLogs = [
    {
      id: '1',
      date: '2024-03-27',
      duration: 15,
      exercisesCompleted: 8,
      averageScore: 82,
      aiDecisions: 3,
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-03-26',
      duration: 12,
      exercisesCompleted: 6,
      averageScore: 78,
      aiDecisions: 2,
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-03-25',
      duration: 18,
      exercisesCompleted: 10,
      averageScore: 85,
      aiDecisions: 4,
      status: 'completed'
    }
  ];

  const complianceItems = [
    { item: 'HIPAA Compliance', status: 'compliant', lastCheck: '2024-03-27' },
    { item: 'Data Encryption', status: 'compliant', lastCheck: '2024-03-27' },
    { item: 'Parental Consent', status: 'compliant', lastCheck: '2024-03-20' },
    { item: 'Session Recording Policy', status: 'warning', lastCheck: '2024-03-25' },
    { item: 'AI Decision Audit Trail', status: 'compliant', lastCheck: '2024-03-27' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User size={16} /> },
    { id: 'sessions', label: 'Session Logs', icon: <Calendar size={16} /> },
    { id: 'compliance', label: 'Compliance', icon: <Shield size={16} /> }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-display font-bold text-3xl text-gray-800 mb-2">
              Therapist Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor progress, review AI decisions, and ensure compliance
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              className="btn-secondary flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={16} />
              <span>Export Report</span>
            </motion.button>
            <motion.button
              className="btn-secondary p-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings size={16} />
            </motion.button>
          </div>
        </motion.div>

        {/* Child Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-beige-200 to-beige-300 rounded-full flex items-center justify-center text-2xl">
                {selectedChild.avatar}
              </div>
              <div>
                <h2 className="font-display font-semibold text-xl text-gray-800">
                  {selectedChild.name}
                </h2>
                <p className="text-gray-600">
                  {selectedChild.age} years old • {selectedChild.difficultyLevel} level
                </p>
              </div>
            </div>
            <select
              value={selectedChild.id}
              onChange={(e) => {
                const child = mockChildren.find(c => c.id === e.target.value);
                if (child) setSelectedChild(child);
              }}
              className="px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-beige-400"
            >
              {mockChildren.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex space-x-1 mb-6"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-beige-100 text-beige-700 border border-beige-300'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="card text-center">
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{selectedChild.averageAccuracy}%</div>
                    <div className="text-sm text-gray-600">Average Accuracy</div>
                  </div>
                  <div className="card text-center">
                    <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{selectedChild.sessionStreak}</div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="card text-center">
                    <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-800">{selectedChild.totalSessions}</div>
                    <div className="text-sm text-gray-600">Total Sessions</div>
                  </div>
                </div>

                {/* Progress Chart */}
                <ProgressChart data={mockProgressData} />
              </div>

              {/* AI Agents Status */}
              <div className="space-y-4">
                <div className="card">
                  <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
                    AI Agents Status
                  </h3>
                  <div className="space-y-3">
                    {mockAIAgents.map((agent, index) => (
                      <div key={agent.name} className="flex items-center justify-between p-3 bg-cream-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm text-gray-800">{agent.name}</div>
                          <div className="text-xs text-gray-600">{agent.lastAction}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            agent.status === 'active' ? 'bg-green-500' : 
                            agent.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-400'
                          }`} />
                          <span className="text-xs text-gray-500">{Math.round(agent.confidence * 100)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                  <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <motion.button
                      className="w-full btn-secondary text-left"
                      onClick={() => navigate(`/session/${selectedChild.id}`)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start New Session
                    </motion.button>
                    <motion.button
                      className="w-full btn-secondary text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Review AI Decisions
                    </motion.button>
                    <motion.button
                      className="w-full btn-secondary text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Adjust Settings
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="card">
              <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
                Session History
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cream-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Duration</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Exercises</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Avg Score</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">AI Decisions</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionLogs.map((session) => (
                      <tr key={session.id} className="border-b border-cream-100 hover:bg-cream-50">
                        <td className="py-3 px-4">{new Date(session.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{session.duration} min</td>
                        <td className="py-3 px-4">{session.exercisesCompleted}</td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-green-600">{session.averageScore}%</span>
                        </td>
                        <td className="py-3 px-4">{session.aiDecisions}</td>
                        <td className="py-3 px-4">
                          <span className="flex items-center space-x-1">
                            <CheckCircle size={14} className="text-green-500" />
                            <span className="text-sm text-green-600 capitalize">{session.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
                  Compliance Status
                </h3>
                <div className="space-y-3">
                  {complianceItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-cream-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {item.status === 'compliant' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        )}
                        <div>
                          <div className="font-medium text-gray-800">{item.item}</div>
                          <div className="text-sm text-gray-600">Last checked: {item.lastCheck}</div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'compliant' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
                  AI Decision Audit Trail
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-800">Difficulty Adjustment</span>
                      <span className="text-sm text-blue-600">2024-03-27 10:15 AM</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Adaptive Agent increased difficulty from level 3 to 4 based on consistent 85%+ accuracy scores.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-800">Exercise Selection</span>
                      <span className="text-sm text-green-600">2024-03-27 10:12 AM</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Therapy Agent selected /r/ sound exercises targeting word-final position based on phoneme analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default TherapistView;