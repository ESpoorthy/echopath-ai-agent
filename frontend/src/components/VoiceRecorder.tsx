import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, RotateCcw } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, transcription: string) => void;
  isProcessing?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, isProcessing = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setHasRecording(true);
        
        // Simulate transcription for demo
        const mockTranscription = "red"; // This would come from speech-to-text API
        onRecordingComplete(audioBlob, mockTranscription);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const resetRecording = () => {
    setHasRecording(false);
    setAudioUrl(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  return (
    <div className="card text-center">
      <h3 className="font-display font-semibold text-lg mb-6 text-gray-800">
        Voice Recording
      </h3>

      <div className="flex flex-col items-center space-y-6">
        {/* Recording Visualization */}
        <div className="relative">
          <motion.div
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              isRecording 
                ? 'bg-red-100 border-4 border-red-300' 
                : hasRecording 
                  ? 'bg-green-100 border-4 border-green-300'
                  : 'bg-beige-100 border-4 border-beige-300'
            }`}
            animate={isRecording ? { scale: [1, 1.1, 1] } : { scale: 1 }}
            transition={{ repeat: isRecording ? Infinity : 0, duration: 1 }}
          >
            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.div
                  key="recording"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-red-500"
                >
                  <Mic size={32} />
                </motion.div>
              ) : hasRecording ? (
                <motion.div
                  key="recorded"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-green-500"
                >
                  ✓
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-beige-500"
                >
                  <Mic size={32} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Pulse animation while recording */}
          {isRecording && (
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-red-300"
              animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          )}
        </div>

        {/* Status Text */}
        <div className="text-center">
          {isProcessing ? (
            <p className="text-beige-600 font-medium">Processing your speech...</p>
          ) : isRecording ? (
            <p className="text-red-600 font-medium">Recording... Speak clearly!</p>
          ) : hasRecording ? (
            <p className="text-green-600 font-medium">Great job! Recording captured.</p>
          ) : (
            <p className="text-gray-600">Press the microphone to start recording</p>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-4">
          {!hasRecording ? (
            <motion.button
              className={`btn-primary flex items-center space-x-2 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isRecording ? (
                <>
                  <Square size={16} />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Mic size={16} />
                  <span>Record</span>
                </>
              )}
            </motion.button>
          ) : (
            <div className="flex space-x-3">
              <motion.button
                className="btn-secondary flex items-center space-x-2"
                onClick={playRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={16} />
                <span>Play</span>
              </motion.button>
              <motion.button
                className="btn-secondary flex items-center space-x-2"
                onClick={resetRecording}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw size={16} />
                <span>Try Again</span>
              </motion.button>
            </div>
          )}
        </div>

        {/* Recording Tips */}
        {!hasRecording && !isRecording && (
          <div className="text-xs text-gray-500 max-w-xs">
            <p>💡 Tip: Speak clearly and hold the device close to your mouth for best results</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;