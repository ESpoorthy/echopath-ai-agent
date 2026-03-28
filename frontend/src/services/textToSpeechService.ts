class TextToSpeechService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private isInitialized: boolean = false;

  constructor() {
    this.synth = window.speechSynthesis;
    this.initializeVoices();
  }

  private initializeVoices(): void {
    // Load voices
    const loadVoices = () => {
      this.voices = this.synth.getVoices();
      this.isInitialized = true;
    };

    // Voices might not be loaded immediately
    if (this.synth.getVoices().length > 0) {
      loadVoices();
    } else {
      this.synth.addEventListener('voiceschanged', loadVoices);
    }
  }

  private getOptimalVoice(): SpeechSynthesisVoice | null {
    if (!this.isInitialized || this.voices.length === 0) {
      return null;
    }

    // Prefer child-friendly voices (higher pitch, clearer pronunciation)
    const preferredVoices = [
      // English voices with good clarity
      'Google UK English Female',
      'Google US English',
      'Microsoft Zira - English (United States)',
      'Microsoft David - English (United States)',
      'Alex', // macOS
      'Samantha', // macOS
      'Karen', // macOS
    ];

    // Try to find a preferred voice
    for (const voiceName of preferredVoices) {
      const voice = this.voices.find(v => v.name.includes(voiceName));
      if (voice) return voice;
    }

    // Fallback to any English voice
    const englishVoice = this.voices.find(v => 
      v.lang.startsWith('en') && v.localService
    );
    if (englishVoice) return englishVoice;

    // Last resort - any available voice
    return this.voices[0] || null;
  }

  public speak(text: string, options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: SpeechSynthesisErrorEvent) => void;
  } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      // Stop any ongoing speech
      this.stop();

      // Clean text for better pronunciation
      const cleanText = this.preprocessText(text);
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Set voice
      const voice = this.getOptimalVoice();
      if (voice) {
        utterance.voice = voice;
      }

      // Configure speech parameters for child-friendly delivery
      utterance.rate = options.rate || 0.8; // Slightly slower for clarity
      utterance.pitch = options.pitch || 1.1; // Slightly higher pitch
      utterance.volume = options.volume || 0.9;

      // Event handlers
      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (error) => {
        options.onError?.(error);
        reject(error);
      };

      // Speak the text
      this.synth.speak(utterance);
    });
  }

  private preprocessText(text: string): string {
    // Remove emojis and special characters that might cause pronunciation issues
    let cleanText = text.replace(/[🎯🗣️⭐💪🌟🎉💙🧩💡∞]/g, '');
    
    // Replace quotes with "say" for better pronunciation
    cleanText = cleanText.replace(/"([^"]+)"/g, 'say $1');
    
    // Add pauses for better pacing
    cleanText = cleanText.replace(/\./g, '... ');
    cleanText = cleanText.replace(/!/g, '. ');
    
    // Ensure proper pronunciation of phonetic symbols
    cleanText = cleanText.replace(/\/([^\/]+)\//g, 'the $1 sound');
    
    return cleanText.trim();
  }

  public speakExerciseInstruction(exercisePrompt: string, targetSound: string): Promise<void> {
    const instruction = `${exercisePrompt}. Take your time and speak clearly. Focus on the ${targetSound} sound. You've got this!`;
    
    return this.speak(instruction, {
      rate: 0.75, // Slower for instructions
      pitch: 1.0, // Normal pitch for instructions
      volume: 0.9
    });
  }

  public speakFeedback(feedback: string, isPositive: boolean = true): Promise<void> {
    return this.speak(feedback, {
      rate: isPositive ? 0.9 : 0.8,
      pitch: isPositive ? 1.2 : 1.0,
      volume: 0.9
    });
  }

  public stop(): void {
    if (this.synth.speaking) {
      this.synth.cancel();
    }
  }

  public pause(): void {
    if (this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  public isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  public isSpeaking(): boolean {
    return this.synth.speaking;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

export default new TextToSpeechService();