import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, CheckCircle, X } from 'lucide-react';

interface VoiceInstructionsProps {
  show: boolean;
  onClose: () => void;
  targetWord?: string;
}

const VoiceInstructions: React.FC<VoiceInstructionsProps> = ({ show, onClose, targetWord = 'red' }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Volume2 className="w-8 h-8 text-blue-500" />,
      title: 'Listen to the Target Word',
      description: `You'll be asked to say "${targetWord}". Listen carefully to how it should sound.`,
      tip: 'Pay attention to each sound in the word'
    },
    {
      icon: <Mic className="w-8 h-8 text-green-500" />,
      title: 'Record Your Voice',
      description: 'Click the microphone button and speak clearly into your device.',
      tip: 'Hold the device close to your mouth and speak at normal volume'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-purple-500" />,
      title: 'Get AI Feedback',
      description: 'Our AI will analyze your pronunciation and give you helpful feedback.',
      tip: 'The AI checks if you pronounced each sound correctly'
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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
            className="bg-white rounded-2xl p-8 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl text-gray-800">
                How Voice Verification Works
              </h2>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} className="text-gray-500" />
              </motion.button>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-2 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep ? 'bg-orange-400' : 
                    index < currentStep ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Current Step */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center mb-8"
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center">
                  {steps[currentStep].icon}
                </div>
              </div>
              
              <h3 className="font-display font-semibold text-xl text-gray-800 mb-3">
                {steps[currentStep].title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {steps[currentStep].description}
              </p>
              
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-700">
                  💡 <strong>Tip:</strong> {steps[currentStep].tip}
                </p>
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <motion.button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`btn-secondary px-6 py-2 ${
                  currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                whileHover={currentStep > 0 ? { scale: 1.05 } : {}}
                whileTap={currentStep > 0 ? { scale: 0.95 } : {}}
              >
                Previous
              </motion.button>
              
              <motion.button
                onClick={nextStep}
                className="btn-primary px-6 py-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentStep === steps.length - 1 ? 'Start Practice!' : 'Next'}
              </motion.button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-green-50 rounded-xl">
              <h4 className="font-medium text-green-800 mb-2">What makes our AI special?</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Real-time speech recognition</li>
                <li>• Pronunciation accuracy scoring</li>
                <li>• Personalized feedback for each sound</li>
                <li>• Adaptive difficulty adjustment</li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceInstructions;