import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import Layout from './Layout.tsx';

interface ProfileFormData {
  name: string;
  age: number;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  preferences: {
    visualPreference: 'elephants' | 'rainbows' | 'clouds' | 'stars';
    audioPreference: 'gentle' | 'encouraging' | 'playful';
    sessionLength: number;
  };
}

interface ProfileFormProps {
  onClose?: () => void;
  isModal?: boolean;
  onChildAdded?: (childData: ProfileFormData) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onClose, isModal = false, onChildAdded }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    age: 5,
    difficultyLevel: 'beginner',
    preferences: {
      visualPreference: 'elephants',
      audioPreference: 'gentle',
      sessionLength: 10
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isModal && onChildAdded) {
      // Call the callback to add the child to the parent component
      onChildAdded(formData);
    } else {
      // Save profile data (in real app, would save to backend)
      localStorage.setItem('childProfile', JSON.stringify(formData));
      navigate('/dashboard');
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const visualOptions = [
    { value: 'elephants', emoji: '🐘', label: 'Gentle Elephants' },
    { value: 'rainbows', emoji: '🌈', label: 'Soft Rainbows' },
    { value: 'clouds', emoji: '☁️', label: 'Fluffy Clouds' },
    { value: 'stars', emoji: '⭐', label: 'Twinkling Stars' }
  ];

  const audioOptions = [
    { value: 'gentle', label: 'Gentle & Calm' },
    { value: 'encouraging', label: 'Encouraging & Supportive' },
    { value: 'playful', label: 'Playful & Fun' }
  ];

  const formContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl text-gray-800">
            Create Child Profile 🌟
          </h2>
          <p className="text-gray-600">
            Help us personalize the perfect therapy experience
          </p>
        </div>
        {isModal && (
          <motion.button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} className="text-gray-500" />
          </motion.button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Child's Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-beige-400 focus:border-transparent"
            placeholder="Enter your child's name"
            required
          />
        </div>

        {/* Age Input */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Age: {formData.age} years
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="3"
              max="12"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
              className="flex-1 h-2 bg-cream-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="w-12 h-8 bg-beige-100 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-beige-700">{formData.age}</span>
            </div>
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-gray-700 font-medium mb-3">
            Starting Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <motion.button
                key={level}
                type="button"
                onClick={() => setFormData({ ...formData, difficultyLevel: level })}
                className={`p-3 rounded-xl border-2 transition-all text-sm ${
                  formData.difficultyLevel === level
                    ? 'border-beige-400 bg-beige-50'
                    : 'border-cream-300 bg-white hover:border-beige-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-xl mb-1">
                    {level === 'beginner' ? '🌱' : level === 'intermediate' ? '🌿' : '🌳'}
                  </div>
                  <div className="font-medium capitalize">{level}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Visual Preferences */}
        <div>
          <label className="block text-gray-700 font-medium mb-3">
            Favorite Theme
          </label>
          <div className="grid grid-cols-2 gap-2">
            {visualOptions.map((option) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  preferences: { ...formData.preferences, visualPreference: option.value as any }
                })}
                className={`p-3 rounded-xl border-2 transition-all text-sm ${
                  formData.preferences.visualPreference === option.value
                    ? 'border-beige-400 bg-beige-50'
                    : 'border-cream-300 bg-white hover:border-beige-300'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{option.emoji}</div>
                  <div className="font-medium">{option.label}</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Audio Preferences - Only show in full form, not modal */}
        {!isModal && (
          <div>
            <label className="block text-gray-700 font-medium mb-3">
              Feedback Style
            </label>
            <div className="space-y-2">
              {audioOptions.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    preferences: { ...formData.preferences, audioPreference: option.value as any }
                  })}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all text-sm ${
                    formData.preferences.audioPreference === option.value
                      ? 'border-beige-400 bg-beige-50'
                      : 'border-cream-300 bg-white hover:border-beige-300'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Session Length */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Session Length: {formData.preferences.sessionLength} minutes
          </label>
          <input
            type="range"
            min="5"
            max="20"
            step="5"
            value={formData.preferences.sessionLength}
            onChange={(e) => setFormData({
              ...formData,
              preferences: { ...formData.preferences, sessionLength: parseInt(e.target.value) }
            })}
            className="w-full h-2 bg-cream-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5 min</span>
            <span>10 min</span>
            <span>15 min</span>
            <span>20 min</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-3 pt-4">
          {isModal && (
            <motion.button
              type="button"
              onClick={handleClose}
              className="flex-1 btn-secondary py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          )}
          <motion.button
            type="submit"
            className={`${isModal ? 'flex-1' : 'w-full'} btn-primary py-3`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!formData.name}
          >
            Create Profile
          </motion.button>
        </div>
      </form>
    </>
  );

  if (isModal) {
    return formContent;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="font-display font-bold text-3xl text-gray-800 mb-4">
            Let's Create Your Child's Profile 🌟
          </h1>
          <p className="text-gray-600 text-lg">
            Help us personalize the perfect therapy experience
          </p>
        </motion.div>

        <motion.div
          className="card max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {formContent}
        </motion.div>

        {/* Decorative Elements */}
        <motion.div 
          className="flex justify-center space-x-8 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-3xl"
          >
            🌈
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="text-3xl"
          >
            ☁️
          </motion.div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="text-3xl"
          >
            🐘
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ProfileForm;