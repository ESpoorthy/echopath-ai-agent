import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';
import { ProgressData } from '../types';

interface ProgressChartProps {
  data: ProgressData[];
  type?: 'accuracy' | 'phonemes';
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data, type = 'accuracy' }) => {
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

  if (type === 'phonemes') {
    // Transform data for phoneme chart
    const phonemeData = data.slice(-7).map(item => ({
      date: formatDate(item.date),
      ...item.phonemeScores
    }));

    return (
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
          Phoneme Progress
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={phonemeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f1eb" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="r" fill="#f0d9c4" name="R Sound" radius={[2, 2, 0, 0]} />
              <Bar dataKey="s" fill="#e8c7a6" name="S Sound" radius={[2, 2, 0, 0]} />
              <Bar dataKey="th" fill="#ddb185" name="TH Sound" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="font-display font-semibold text-lg mb-4 text-gray-800">
        Accuracy Trend
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
            <Line 
              type="monotone" 
              dataKey="accuracy" 
              stroke="#e8c7a6" 
              strokeWidth={3}
              dot={{ fill: '#e8c7a6', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#e8c7a6', strokeWidth: 2, fill: '#fff' }}
              name="Accuracy"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <span>7-day trend</span>
        <span className="text-green-600 font-medium">
          +{data.length > 1 ? (data[data.length - 1].accuracy - data[0].accuracy).toFixed(1) : 0}% improvement
        </span>
      </div>
    </motion.div>
  );
};

export default ProgressChart;