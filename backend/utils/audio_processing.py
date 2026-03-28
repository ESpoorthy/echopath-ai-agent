import io
import wave
import numpy as np
from typing import Optional, Dict, Any, Tuple
import tempfile
import os

class AudioProcessor:
    """
    Utility class for processing audio files for speech therapy analysis
    """
    
    def __init__(self):
        self.supported_formats = ['.wav', '.mp3', '.m4a', '.ogg']
        self.target_sample_rate = 16000  # 16kHz for speech processing
        self.target_channels = 1  # Mono
        
    def validate_audio_file(self, audio_data: bytes, filename: str) -> Dict[str, Any]:
        """
        Validate audio file format and basic properties
        """
        try:
            # Check file extension
            file_ext = os.path.splitext(filename)[1].lower()
            if file_ext not in self.supported_formats:
                return {
                    'valid': False,
                    'error': f'Unsupported format: {file_ext}',
                    'supported_formats': self.supported_formats
                }
            
            # Check file size (limit to 10MB for demo)
            max_size_mb = 10
            file_size_mb = len(audio_data) / (1024 * 1024)
            if file_size_mb > max_size_mb:
                return {
                    'valid': False,
                    'error': f'File too large: {file_size_mb:.1f}MB (max: {max_size_mb}MB)',
                    'file_size_mb': file_size_mb
                }
            
            # Basic audio validation for WAV files
            if file_ext == '.wav':
                validation_result = self._validate_wav_file(audio_data)
                if not validation_result['valid']:
                    return validation_result
            
            return {
                'valid': True,
                'file_size_mb': file_size_mb,
                'format': file_ext,
                'message': 'Audio file validation passed'
            }
            
        except Exception as e:
            return {
                'valid': False,
                'error': f'Validation error: {str(e)}'
            }
    
    def preprocess_audio(self, audio_data: bytes, filename: str) -> Dict[str, Any]:
        """
        Preprocess audio for speech analysis
        """
        try:
            # Validate first
            validation = self.validate_audio_file(audio_data, filename)
            if not validation['valid']:
                return validation
            
            # For demo purposes, we'll simulate preprocessing
            # In a real implementation, this would:
            # 1. Convert to target format (16kHz, mono, WAV)
            # 2. Normalize audio levels
            # 3. Remove silence/noise
            # 4. Apply filters for speech enhancement
            
            processed_info = {
                'original_size': len(audio_data),
                'processed_size': len(audio_data),  # Would be different after processing
                'sample_rate': self.target_sample_rate,
                'channels': self.target_channels,
                'duration_seconds': self._estimate_duration(audio_data, filename),
                'preprocessing_applied': [
                    'format_conversion',
                    'noise_reduction',
                    'normalization',
                    'silence_trimming'
                ]
            }
            
            return {
                'success': True,
                'processed_audio': audio_data,  # Would be actual processed audio
                'processing_info': processed_info,
                'quality_score': self._assess_audio_quality(audio_data, filename)
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Preprocessing error: {str(e)}'
            }
    
    def extract_speech_features(self, audio_data: bytes) -> Dict[str, Any]:
        """
        Extract speech features for analysis
        """
        try:
            # In a real implementation, this would extract:
            # - Fundamental frequency (F0)
            # - Formants (F1, F2, F3)
            # - Spectral features
            # - Prosodic features
            # - Voice quality measures
            
            # Simulated features for demo
            features = {
                'fundamental_frequency': {
                    'mean_f0': 180.5,  # Hz
                    'f0_range': 45.2,
                    'f0_stability': 0.85
                },
                'formants': {
                    'f1_mean': 650.3,  # Hz
                    'f2_mean': 1720.8,
                    'f3_mean': 2580.1
                },
                'spectral_features': {
                    'spectral_centroid': 1250.4,
                    'spectral_rolloff': 3200.7,
                    'zero_crossing_rate': 0.12
                },
                'prosodic_features': {
                    'speech_rate': 4.2,  # syllables per second
                    'pause_frequency': 0.8,
                    'intensity_variation': 0.65
                },
                'voice_quality': {
                    'jitter': 0.02,  # Frequency perturbation
                    'shimmer': 0.03,  # Amplitude perturbation
                    'harmonics_to_noise_ratio': 15.2  # dB
                }
            }
            
            return {
                'success': True,
                'features': features,
                'feature_extraction_confidence': 0.92,
                'analysis_timestamp': self._get_timestamp()
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Feature extraction error: {str(e)}'
            }
    
    def analyze_pronunciation_quality(self, audio_features: Dict[str, Any], target_phoneme: str) -> Dict[str, Any]:
        """
        Analyze pronunciation quality based on extracted features
        """
        try:
            # Phoneme-specific analysis parameters
            phoneme_targets = {
                'r': {
                    'f3_target': 1800,  # Lower F3 for /r/
                    'f3_tolerance': 200,
                    'quality_indicators': ['f3_lowering', 'formant_transitions']
                },
                's': {
                    'spectral_peak': 7000,  # High frequency energy for /s/
                    'spectral_tolerance': 1000,
                    'quality_indicators': ['high_frequency_energy', 'frication_noise']
                },
                'th': {
                    'frication_frequency': 5000,
                    'frication_tolerance': 800,
                    'quality_indicators': ['interdental_frication', 'airflow_turbulence']
                },
                'l': {
                    'f2_target': 1200,
                    'f2_tolerance': 150,
                    'quality_indicators': ['lateral_resonance', 'formant_structure']
                }
            }
            
            target_params = phoneme_targets.get(target_phoneme, phoneme_targets['r'])
            
            # Simulate pronunciation analysis
            quality_score = self._calculate_pronunciation_score(audio_features, target_params)
            
            # Generate specific feedback
            feedback = self._generate_pronunciation_feedback(quality_score, target_phoneme, audio_features)
            
            return {
                'success': True,
                'target_phoneme': target_phoneme,
                'quality_score': quality_score,
                'feedback': feedback,
                'acoustic_analysis': {
                    'target_achieved': quality_score > 75,
                    'primary_issues': self._identify_pronunciation_issues(audio_features, target_params),
                    'improvement_suggestions': self._generate_improvement_suggestions(target_phoneme, quality_score)
                },
                'confidence': 0.88
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f'Pronunciation analysis error: {str(e)}'
            }
    
    def _validate_wav_file(self, audio_data: bytes) -> Dict[str, Any]:
        """
        Validate WAV file format and properties
        """
        try:
            # Create temporary file for wave module
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_file_path = temp_file.name
            
            try:
                with wave.open(temp_file_path, 'rb') as wav_file:
                    frames = wav_file.getnframes()
                    sample_rate = wav_file.getframerate()
                    channels = wav_file.getnchannels()
                    sample_width = wav_file.getsampwidth()
                    
                    # Check basic properties
                    duration = frames / sample_rate
                    
                    # Validate duration (between 0.5 and 30 seconds for speech therapy)
                    if duration < 0.5:
                        return {
                            'valid': False,
                            'error': f'Audio too short: {duration:.1f}s (minimum: 0.5s)'
                        }
                    
                    if duration > 30:
                        return {
                            'valid': False,
                            'error': f'Audio too long: {duration:.1f}s (maximum: 30s)'
                        }
                    
                    return {
                        'valid': True,
                        'properties': {
                            'duration': duration,
                            'sample_rate': sample_rate,
                            'channels': channels,
                            'sample_width': sample_width,
                            'frames': frames
                        }
                    }
                    
            finally:
                # Clean up temporary file
                os.unlink(temp_file_path)
                
        except Exception as e:
            return {
                'valid': False,
                'error': f'WAV validation error: {str(e)}'
            }
    
    def _estimate_duration(self, audio_data: bytes, filename: str) -> float:
        """
        Estimate audio duration
        """
        # Simplified estimation for demo
        # In reality, would parse audio headers properly
        file_ext = os.path.splitext(filename)[1].lower()
        
        if file_ext == '.wav':
            try:
                with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                    temp_file.write(audio_data)
                    temp_file_path = temp_file.name
                
                try:
                    with wave.open(temp_file_path, 'rb') as wav_file:
                        frames = wav_file.getnframes()
                        sample_rate = wav_file.getframerate()
                        return frames / sample_rate
                finally:
                    os.unlink(temp_file_path)
            except:
                pass
        
        # Fallback estimation based on file size
        # Very rough approximation: 16kHz, 16-bit, mono ≈ 32KB per second
        estimated_duration = len(audio_data) / 32000
        return min(max(estimated_duration, 1.0), 10.0)  # Clamp between 1-10 seconds
    
    def _assess_audio_quality(self, audio_data: bytes, filename: str) -> Dict[str, Any]:
        """
        Assess audio quality for speech analysis
        """
        # Simulated quality assessment
        quality_factors = {
            'signal_to_noise_ratio': 18.5,  # dB
            'dynamic_range': 45.2,  # dB
            'frequency_response': 0.85,  # 0-1 score
            'distortion_level': 0.02,  # THD percentage
            'background_noise_level': -35.8  # dB
        }
        
        # Calculate overall quality score
        snr_score = min(quality_factors['signal_to_noise_ratio'] / 20, 1.0)
        freq_score = quality_factors['frequency_response']
        noise_score = min(abs(quality_factors['background_noise_level']) / 40, 1.0)
        
        overall_score = (snr_score * 0.4 + freq_score * 0.3 + noise_score * 0.3) * 100
        
        quality_rating = 'excellent' if overall_score > 85 else 'good' if overall_score > 70 else 'fair' if overall_score > 50 else 'poor'
        
        return {
            'overall_score': round(overall_score, 1),
            'rating': quality_rating,
            'factors': quality_factors,
            'recommendations': self._get_quality_recommendations(quality_factors)
        }
    
    def _calculate_pronunciation_score(self, features: Dict[str, Any], target_params: Dict[str, Any]) -> float:
        """
        Calculate pronunciation quality score
        """
        # Simplified scoring for demo
        base_score = 75.0
        
        # Add some randomness to simulate real analysis variation
        import random
        variation = random.uniform(-10, 15)
        
        score = max(30, min(100, base_score + variation))
        return round(score, 1)
    
    def _generate_pronunciation_feedback(self, quality_score: float, target_phoneme: str, features: Dict[str, Any]) -> str:
        """
        Generate specific pronunciation feedback
        """
        if quality_score >= 90:
            return f"Excellent pronunciation of /{target_phoneme}/! Your articulation is very clear."
        elif quality_score >= 80:
            return f"Great job with the /{target_phoneme}/ sound! Minor adjustments could make it even better."
        elif quality_score >= 70:
            return f"Good attempt at /{target_phoneme}/. Focus on tongue placement for clearer articulation."
        elif quality_score >= 60:
            return f"Keep practicing /{target_phoneme}/. Try to position your tongue more precisely."
        else:
            return f"Let's work on the /{target_phoneme}/ sound together. Remember the correct tongue position."
    
    def _identify_pronunciation_issues(self, features: Dict[str, Any], target_params: Dict[str, Any]) -> List[str]:
        """
        Identify specific pronunciation issues
        """
        issues = []
        
        # Simulated issue detection
        formants = features.get('formants', {})
        voice_quality = features.get('voice_quality', {})
        
        if voice_quality.get('jitter', 0) > 0.05:
            issues.append('voice_instability')
        
        if formants.get('f2_mean', 0) < 1000:
            issues.append('formant_positioning')
        
        return issues
    
    def _generate_improvement_suggestions(self, target_phoneme: str, quality_score: float) -> List[str]:
        """
        Generate improvement suggestions
        """
        suggestions = []
        
        phoneme_tips = {
            'r': [
                "Curl your tongue tip slightly back",
                "Don't let your tongue touch the roof of your mouth",
                "Practice the 'er' sound first"
            ],
            's': [
                "Keep your tongue tip behind your front teeth",
                "Create a narrow channel for air flow",
                "Practice the snake sound: ssssss"
            ],
            'th': [
                "Place your tongue tip between your teeth gently",
                "Blow air softly over your tongue",
                "Practice with 'think' and 'three'"
            ],
            'l': [
                "Touch your tongue tip to the roof of your mouth",
                "Let air flow around the sides of your tongue",
                "Practice 'la la la' sounds"
            ]
        }
        
        if quality_score < 80:
            tips = phoneme_tips.get(target_phoneme, ["Keep practicing!"])
            suggestions.extend(tips[:2])
        
        if quality_score < 60:
            suggestions.append("Try saying the sound very slowly first")
        
        return suggestions
    
    def _get_quality_recommendations(self, quality_factors: Dict[str, Any]) -> List[str]:
        """
        Get recommendations for improving audio quality
        """
        recommendations = []
        
        if quality_factors['signal_to_noise_ratio'] < 15:
            recommendations.append("Record in a quieter environment")
        
        if quality_factors['background_noise_level'] > -30:
            recommendations.append("Reduce background noise")
        
        if quality_factors['frequency_response'] < 0.7:
            recommendations.append("Use a better quality microphone")
        
        if not recommendations:
            recommendations.append("Audio quality is good for analysis")
        
        return recommendations
    
    def _get_timestamp(self) -> str:
        """
        Get current timestamp
        """
        from datetime import datetime
        return datetime.now().isoformat()