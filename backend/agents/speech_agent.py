import os
import random
from typing import Dict, List, Any, Tuple
from datetime import datetime
import json

class SpeechAnalysisAgent:
    """
    AI Agent responsible for analyzing speech recordings and providing
    accuracy scores, feedback, and pronunciation insights.
    """
    
    def __init__(self):
        self.name = "Speech Analysis Agent"
        self.status = "idle"
        self.last_action = "Initialized speech analysis system"
        self.confidence = 0.87
        
        # Phoneme analysis patterns (simplified for demo)
        self.phoneme_patterns = {
            'r': ['red', 'car', 'run', 'rainbow', 'strawberry'],
            's': ['sun', 'snake', 'house', 'sunshine', 'Mississippi'],
            'th': ['think', 'three', 'bath', 'birthday'],
            'l': ['love', 'ball', 'hello', 'yellow'],
            'sh': ['shoe', 'fish', 'wash', 'sunshine']
        }
    
    def get_status(self) -> str:
        return self.status
    
    def get_last_action(self) -> str:
        return self.last_action
    
    def get_confidence(self) -> float:
        return self.confidence
    
    def analyze_speech(self, audio_data: bytes, target_word: str, target_phoneme: str) -> Dict[str, Any]:
        """
        Analyze speech recording and return accuracy score with feedback
        """
        self.status = "processing"
        self.last_action = f"Analyzing pronunciation of '{target_word}'"
        
        try:
            # In a real implementation, this would use speech-to-text and phoneme analysis
            # For demo purposes, we'll simulate the analysis
            
            analysis_result = self._simulate_speech_analysis(target_word, target_phoneme)
            
            self.status = "active"
            self.last_action = f"Analyzed pronunciation: {analysis_result['accuracy']}% accuracy"
            self.confidence = analysis_result['confidence']
            
            return analysis_result
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error analyzing speech: {str(e)}"
            self.confidence = 0.0
            
            return self._get_fallback_analysis(target_word, target_phoneme)
    
    def analyze_transcription(self, transcription: str, target_word: str, target_phoneme: str) -> Dict[str, Any]:
        """
        Analyze transcribed text for pronunciation accuracy
        """
        self.status = "processing"
        self.last_action = f"Analyzing transcription: '{transcription}'"
        
        try:
            # Calculate similarity between transcription and target
            accuracy = self._calculate_pronunciation_accuracy(transcription, target_word, target_phoneme)
            
            # Generate feedback based on accuracy
            feedback = self._generate_feedback(accuracy, target_phoneme, transcription, target_word)
            
            # Assess confidence based on transcription quality
            confidence = self._assess_transcription_confidence(transcription, target_word)
            
            self.status = "active"
            self.last_action = f"Transcription analysis complete: {accuracy}% accuracy"
            self.confidence = confidence
            
            return {
                'accuracy': accuracy,
                'feedback': feedback,
                'confidence': confidence,
                'transcription': transcription,
                'target_word': target_word,
                'target_phoneme': target_phoneme,
                'phoneme_detected': self._detect_phoneme_presence(transcription, target_phoneme),
                'suggestions': self._generate_improvement_suggestions(accuracy, target_phoneme)
            }
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error analyzing transcription: {str(e)}"
            return self._get_fallback_analysis(target_word, target_phoneme)
    
    def _simulate_speech_analysis(self, target_word: str, target_phoneme: str) -> Dict[str, Any]:
        """
        Simulate speech analysis for demo purposes
        """
        # Generate realistic but random accuracy score
        base_accuracy = random.uniform(65, 95)
        
        # Adjust based on word difficulty
        word_difficulty = self._assess_word_difficulty(target_word)
        accuracy = max(50, min(100, base_accuracy - (word_difficulty * 5)))
        
        # Generate mock transcription
        transcription = self._generate_mock_transcription(target_word, accuracy)
        
        return self.analyze_transcription(transcription, target_word, target_phoneme)
    
    def _calculate_pronunciation_accuracy(self, transcription: str, target_word: str, target_phoneme: str) -> float:
        """
        Calculate pronunciation accuracy based on transcription
        """
        transcription = transcription.lower().strip()
        target_word = target_word.lower().strip()
        
        # Exact match gets high score
        if transcription == target_word:
            return random.uniform(85, 95)
        
        # Calculate string similarity
        similarity = self._calculate_string_similarity(transcription, target_word)
        
        # Check if target phoneme is present
        phoneme_present = self._detect_phoneme_presence(transcription, target_phoneme)
        
        # Combine similarity and phoneme presence
        base_score = similarity * 70  # Up to 70% for similarity
        phoneme_bonus = 20 if phoneme_present else 0  # Up to 20% for phoneme
        random_factor = random.uniform(-5, 10)  # Small random variation
        
        accuracy = max(30, min(100, base_score + phoneme_bonus + random_factor))
        return round(accuracy, 1)
    
    def _calculate_string_similarity(self, str1: str, str2: str) -> float:
        """
        Calculate similarity between two strings using simple algorithm
        """
        if not str1 or not str2:
            return 0.0
        
        # Simple character-based similarity
        max_len = max(len(str1), len(str2))
        if max_len == 0:
            return 1.0
        
        matches = sum(1 for a, b in zip(str1, str2) if a == b)
        return matches / max_len
    
    def _detect_phoneme_presence(self, transcription: str, target_phoneme: str) -> bool:
        """
        Detect if target phoneme is likely present in transcription
        """
        transcription = transcription.lower()
        
        # Simple phoneme detection patterns
        phoneme_indicators = {
            'r': ['r', 'ar', 'er', 'or'],
            's': ['s', 'ss', 'se'],
            'th': ['th', 'f', 'v'],  # Common substitutions
            'l': ['l', 'll'],
            'sh': ['sh', 'ch', 's']  # Common substitutions
        }
        
        indicators = phoneme_indicators.get(target_phoneme, [target_phoneme])
        return any(indicator in transcription for indicator in indicators)
    
    def _generate_feedback(self, accuracy: float, target_phoneme: str, transcription: str, target_word: str) -> str:
        """
        Generate encouraging feedback based on accuracy
        """
        if accuracy >= 90:
            return "Excellent pronunciation! You nailed it! 🌟"
        elif accuracy >= 80:
            return f"Great job! Your /{target_phoneme}/ sound is getting stronger! 👏"
        elif accuracy >= 70:
            return f"Good effort! Keep practicing the /{target_phoneme}/ sound. You're improving!"
        elif accuracy >= 60:
            return f"Nice try! Focus on making the /{target_phoneme}/ sound clearer. Keep going!"
        else:
            return f"Keep practicing! Remember to position your tongue correctly for the /{target_phoneme}/ sound."
    
    def _generate_improvement_suggestions(self, accuracy: float, target_phoneme: str) -> List[str]:
        """
        Generate specific improvement suggestions
        """
        suggestions = []
        
        phoneme_tips = {
            'r': [
                "Curl your tongue tip slightly back",
                "Make sure your tongue doesn't touch the roof of your mouth",
                "Practice with 'er' sound first"
            ],
            's': [
                "Keep your tongue tip behind your front teeth",
                "Make a thin stream of air",
                "Practice the 'snake' sound: ssssss"
            ],
            'th': [
                "Put your tongue tip between your teeth gently",
                "Blow air softly over your tongue",
                "Practice with 'think' and 'three'"
            ],
            'l': [
                "Touch your tongue tip to the roof of your mouth",
                "Let air flow around the sides of your tongue",
                "Practice with 'la la la'"
            ]
        }
        
        if accuracy < 80:
            tips = phoneme_tips.get(target_phoneme, ["Keep practicing!"])
            suggestions.extend(tips[:2])  # Limit to 2 suggestions
        
        if accuracy < 60:
            suggestions.append("Try saying the sound slowly first, then speed up")
        
        return suggestions
    
    def _assess_word_difficulty(self, word: str) -> int:
        """
        Assess word difficulty (1-5 scale)
        """
        word = word.lower()
        
        # Simple difficulty assessment
        if len(word) <= 3:
            return 1
        elif len(word) <= 5:
            return 2
        elif len(word) <= 8:
            return 3
        elif len(word) <= 12:
            return 4
        else:
            return 5
    
    def _generate_mock_transcription(self, target_word: str, accuracy: float) -> str:
        """
        Generate mock transcription based on target word and intended accuracy
        """
        if accuracy > 85:
            return target_word  # Perfect transcription
        elif accuracy > 70:
            # Minor variations
            variations = {
                'red': ['wed', 'red'],
                'car': ['cah', 'car'],
                'sun': ['sun', 'thun'],
                'snake': ['nake', 'snake']
            }
            options = variations.get(target_word.lower(), [target_word])
            return random.choice(options)
        else:
            # More significant variations
            return target_word.replace('r', 'w').replace('s', 'th')[:len(target_word)]
    
    def _assess_transcription_confidence(self, transcription: str, target_word: str) -> float:
        """
        Assess confidence in transcription quality
        """
        if not transcription or len(transcription) < 2:
            return 0.3
        
        # Higher confidence for longer, more complete transcriptions
        length_factor = min(1.0, len(transcription) / len(target_word))
        base_confidence = 0.6 + (length_factor * 0.3)
        
        return round(base_confidence, 2)
    
    def _get_fallback_analysis(self, target_word: str, target_phoneme: str) -> Dict[str, Any]:
        """
        Fallback analysis when errors occur
        """
        return {
            'accuracy': 65.0,
            'feedback': "Good effort! Keep practicing!",
            'confidence': 0.50,
            'transcription': target_word,
            'target_word': target_word,
            'target_phoneme': target_phoneme,
            'phoneme_detected': True,
            'suggestions': ["Keep practicing!", "Take your time"]
        }
    
    def get_phoneme_statistics(self, session_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze phoneme performance across sessions
        """
        self.status = "processing"
        self.last_action = "Calculating phoneme statistics"
        
        try:
            phoneme_stats = {}
            
            for session in session_history:
                for exercise in session.get('exercises', []):
                    phoneme = exercise.get('target_sound', 'unknown')
                    
                    if phoneme not in phoneme_stats:
                        phoneme_stats[phoneme] = {
                            'attempts': 0,
                            'total_accuracy': 0,
                            'best_score': 0,
                            'recent_scores': []
                        }
                    
                    for attempt in exercise.get('attempts', []):
                        accuracy = attempt.get('accuracy', 0)
                        phoneme_stats[phoneme]['attempts'] += 1
                        phoneme_stats[phoneme]['total_accuracy'] += accuracy
                        phoneme_stats[phoneme]['best_score'] = max(
                            phoneme_stats[phoneme]['best_score'], 
                            accuracy
                        )
                        phoneme_stats[phoneme]['recent_scores'].append(accuracy)
            
            # Calculate averages and trends
            for phoneme, stats in phoneme_stats.items():
                if stats['attempts'] > 0:
                    stats['average_accuracy'] = stats['total_accuracy'] / stats['attempts']
                    stats['recent_scores'] = stats['recent_scores'][-10:]  # Keep last 10
                    
                    # Calculate trend
                    if len(stats['recent_scores']) >= 3:
                        recent_avg = sum(stats['recent_scores'][-3:]) / 3
                        older_avg = sum(stats['recent_scores'][:-3]) / max(1, len(stats['recent_scores']) - 3)
                        stats['trend'] = 'improving' if recent_avg > older_avg else 'stable'
                    else:
                        stats['trend'] = 'insufficient_data'
            
            self.status = "active"
            self.last_action = f"Analyzed {len(phoneme_stats)} phonemes"
            
            return phoneme_stats
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error calculating statistics: {str(e)}"
            return {}