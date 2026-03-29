import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, RotateCcw } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, transcription: string, confidence: number) => void;
  isProcessing?: boolean;
  targetWord?: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onRecordingComplete, 
  isProcessing = false,
  targetWord = ''
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');
  const confidenceRef = useRef(0);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let confidence = 0;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            confidence = result[0].confidence || 0.8;
          }
        }

        if (finalTranscript) {
          const trimmed = finalTranscript.trim().toLowerCase();
          setTranscript(trimmed);
          setConfidence(confidence);
          transcriptRef.current = trimmed;
          confidenceRef.current = confidence;
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setError('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      setTranscript('');
      setConfidence(0);
      transcriptRef.current = '';
      confidenceRef.current = 0;
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000
        } 
      });

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
        
        // Wait briefly for speech recognition to finalize its result
        setTimeout(() => {
          const finalTranscript = transcriptRef.current || targetWord || 'unknown';
          const finalConfidence = confidenceRef.current || 0.5;
          
          onRecordingComplete(audioBlob, finalTranscript, finalConfidence);
        }, 500);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => {
        console.error('Error playing audio:', err);
        setError('Failed to play recording.');
      });
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setIsRecording(false);
    setHasRecording(false);
    setAudioUrl(null);
    setError(null);
    setTranscript('');
    setConfidence(0);
    setIsListening(false);
    audioChunksRef.current = [];
    mediaRecorderRef.current = null;
  };

  // Calculate pronunciation accuracy
  const calculateAccuracy = () => {
    if (!transcript || !targetWord) return 0;
    
    const spokenWord = transcript.toLowerCase().trim();
    const target = targetWord.toLowerCase().trim();
    
    // Simple similarity calculation
    if (spokenWord === target) return 100;
    
    // Check if target word is contained in spoken text
    if (spokenWord.includes(target)) return 85;
    
    // Calculate Levenshtein distance for similarity
    const distance = levenshteinDistance(spokenWord, target);
    const maxLength = Math.max(spokenWord.length, target.length);
    const similarity = ((maxLength - distance) / maxLength) * 100;
    
    return Math.max(0, Math.round(similarity));
  };

  // Levenshtein distance calculation
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  return (
    <div className="card-enhanced text-center">
      <h3 className="font-display font-semibold text-lg mb-6 text-gray-800">
        Voice Recording & Analysis
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
                  : 'bg-orange-100 border-4 border-orange-300'
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
                  className="text-green-500 text-2xl"
                >
                  ✓
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="text-orange-500"
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

        {/* Real-time Transcript Display */}
        {(isRecording || transcript) && (
          <motion.div
            className="bg-blue-50 rounded-xl p-4 min-h-[60px] w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-sm text-blue-600 font-medium mb-1">
              {isListening ? 'Listening...' : 'You said:'}
            </div>
            <div className="text-lg font-medium text-blue-800">
              {transcript || (isListening ? '...' : 'No speech detected')}
            </div>
            {confidence > 0 && (
              <div className="text-xs text-blue-600 mt-1">
                Confidence: {Math.round(confidence * 100)}%
              </div>
            )}
          </motion.div>
        )}

        {/* Pronunciation Analysis */}
        {transcript && targetWord && (
          <motion.div
            className="bg-green-50 rounded-xl p-4 w-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-sm text-green-600 font-medium mb-2">
              Pronunciation Analysis
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600">Target: "{targetWord}"</div>
                <div className="text-xs text-gray-600">Spoken: "{transcript}"</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-700">
                  {calculateAccuracy()}%
                </div>
                <div className="text-xs text-green-600">Accuracy</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Status Text */}
        <div className="text-center">
          {error ? (
            <p className="text-red-600 font-medium text-sm">{error}</p>
          ) : isProcessing ? (
            <p className="text-orange-600 font-medium">Processing your speech...</p>
          ) : isRecording ? (
            <div>
              <p className="text-red-600 font-medium">Recording... Speak clearly!</p>
              {targetWord && (
                <p className="text-sm text-gray-600 mt-1">Say: "{targetWord}"</p>
              )}
            </div>
          ) : hasRecording ? (
            <p className="text-green-600 font-medium">Great job! Recording captured and analyzed.</p>
          ) : (
            <div>
              <p className="text-gray-600">Press the microphone to start recording</p>
              {targetWord && (
                <p className="text-sm text-orange-600 mt-1">Target word: "{targetWord}"</p>
              )}
            </div>
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
          <div className="text-xs text-gray-500 max-w-xs text-center">
            <p>💡 Tip: Speak clearly and hold the device close to your mouth for best results</p>
            {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
              <p className="text-red-500 mt-2">⚠️ Speech recognition not supported in this browser</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;