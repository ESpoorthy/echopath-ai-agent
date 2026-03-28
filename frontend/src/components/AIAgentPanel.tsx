import React from 'react';
import { motion } from 'framer-motion';
import { AIAgent } from '../types/index.ts';

interface AIAgentPanelProps {
  agents: AIAgent[];
}

const AIAgentPanel: React.FC<AIAgentPanelProps> = ({ agents }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'processing': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'idle': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'processing': return '🟡';
      case 'idle': return '⚪';
      default: return '⚪';
    }
  };

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-gray-800">
          AI Agents
        </h3>
        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Multi-Agent System
        </div>
      </div>

      <div className="space-y-3">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.name}
            className="p-3 bg-cream-50 rounded-xl border border-cream-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{getStatusIcon(agent.status)}</span>
                <h4 className="font-medium text-sm text-gray-800">{agent.name}</h4>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(agent.status)}`}>
                {agent.status}
              </span>
            </div>
            
            <p className="text-xs text-gray-600 mb-2">{agent.lastAction}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Confidence</span>
              <div className="flex items-center space-x-2">
                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-beige-400 to-beige-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.confidence * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {Math.round(agent.confidence * 100)}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-blue-600">🤖</span>
          <h4 className="font-medium text-sm text-blue-800">System Status</h4>
        </div>
        <p className="text-xs text-blue-700">
          All agents are coordinating to provide personalized therapy recommendations.
        </p>
      </div>
    </motion.div>
  );
};

export default AIAgentPanel;