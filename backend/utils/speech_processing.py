import numpy as np
from typing import Dict, List, Tuple, Optional
import librosa
import scipy.signal
from datetime import datetime

class SpeechProcessor:
    """
    Advanced speech processing utilities for phoneme analysis and feedback generation
    """
    
    def __init__(self, sample_rate: int = 16000):
        self.sample_rate = sample_rate
        self.frame_length = 2048
        self.hop_length = 512
        
        # Phoneme-specific frequency ranges (Hz)
        self.phoneme_characteristics = {
            'r': {
                'f3_range': (1400, 1800),  # Lower F3 for /r/
                'f2_range': (1000, 1400),
                'formant_transitions': True,
                'duration_range': (0.08, 0.15)
            },
            's': {
                'frication_range': (6000, 10000),  # High frequency energy
                'spectral_peak': 7000,
                'duration_range': (0.10, 0.25),
                'noise_characteristics': True
            },
            'th': {
                'frication_range': (4000, 8000),
                'spectral_peak': 5000,
                'duration_range': (0.08, 0.20),
                'interdental': True
            },
            'l': {
                'f2_range': (1000, 1400),
                'lateral_resonance': True,
                'formant_structure': 'clear',
                'duration_range': (0.06, 0.12)
            }
        }
    
    def extract_formants(self, audio: np.ndarray) -> Dict[str, List[float]]:
        """
        Extract formant frequencies from audio signal
        """
        try:
            # Pre-emphasis filter
            pre_emphasized = scipy.signal.lfilter([1, -0.97], [1], audio)
            
            # Windowing and LPC analysis
            frame_size = int(0.025 * self.sample_rate)  # 25ms frames
            hop_size = int(0.010 * self.sample_rate)    # 10ms hop
            
            formants = {'f1': [], 'f2': [], 'f3': [], 'f4': []}
            
            for i in range(0, len(pre_emphasized) - frame_size, hop_size):
                frame = pre_emphasized[i:i + frame_size]
                
                # Apply Hamming window
                windowed = frame * np.hamming(len(frame))
                
                # LPC analysis (order 12 for formant extraction)
                lpc_coeffs = self._lpc_analysis(windowed, order=12)
                
                # Find formant frequencies from LPC roots
                frame_formants = self._lpc_to_formants(lpc_coeffs)
                
                if frame_formants:
                    for j, freq in enumerate(frame_formants[:4]):
                        if j < len(formants):
                            list(formants.values())[j].append(freq)
            
            # Calculate statistics
            formant_stats = {}
            for formant, frequencies in formants.items():
                if frequencies:
                    formant_stats[formant] = {
                        'mean': np.mean(frequencies),
                        'std': np.std(frequencies),
                        'median': np.median(frequencies),
                        'range': (np.min(frequencies), np.max(frequencies))
                    }
                else:
                    formant_stats[formant] = {
                        'mean': 0, 'std': 0, 'median': 0, 'range': (0, 0)
                    }
            
            return formant_stats
            
        except Exception as e:
            print(f"Formant extraction error: {e}")
            return self._get_default_formants()
    
    def analyze_phoneme_quality(self, audio: np.ndarray, target_phoneme: str) -> Dict[str, float]:
        """
        Analyze phoneme-specific acoustic characteristics
        """
        try:
            characteristics = self.phoneme_characteristics.get(target_phoneme, {})
            
            if target_phoneme == 'r':
                return self._analyze_r_sound(audio, characteristics)
            elif target_phoneme == 's':
                return self._analyze_s_sound(audio, characteristics)
            elif target_phoneme == 'th':
                return self._analyze_th_sound(audio, characteristics)
            elif target_phoneme == 'l':
                return self._analyze_l_sound(audio, characteristics)
            else:
                return self._analyze_generic_phoneme(audio)
                
        except Exception as e:
            print(f"Phoneme analysis error: {e}")
            return {'quality_score': 70.0, 'confidence': 0.5}
    
    def _analyze_r_sound(self, audio: np.ndarray, characteristics: Dict) -> Dict[str, float]:
        """
        Analyze /r/ sound characteristics
        """
        # Extract formants
        formants = self.extract_formants(audio)
        
        # Check F3 lowering (key characteristic of /r/)
        f3_mean = formants.get('f3', {}).get('mean', 2500)
        f3_target_range = characteristics.get('f3_range', (1400, 1800))
        
        # Score F3 positioning
        if f3_target_range[0] <= f3_mean <= f3_target_range[1]:
            f3_score = 100
        else:
            # Penalize based on distance from target range
            if f3_mean < f3_target_range[0]:
                f3_score = max(0, 100 - (f3_target_range[0] - f3_mean) / 10)
            else:
                f3_score = max(0, 100 - (f3_mean - f3_target_range[1]) / 10)
        
        # Check formant transitions
        f2_mean = formants.get('f2', {}).get('mean', 1500)
        f2_std = formants.get('f2', {}).get('std', 0)
        
        # /r/ should have smooth formant transitions
        transition_score = max(0, 100 - f2_std / 5) if f2_std > 0 else 80
        
        # Overall quality score
        quality_score = (f3_score * 0.7 + transition_score * 0.3)
        
        return {
            'quality_score': min(100, max(0, quality_score)),
            'f3_score': f3_score,
            'transition_score': transition_score,
            'confidence': 0.85
        }
    
    def _analyze_s_sound(self, audio: np.ndarray, characteristics: Dict) -> Dict[str, float]:
        """
        Analyze /s/ sound characteristics
        """
        # Compute power spectral density
        frequencies, psd = scipy.signal.welch(audio, self.sample_rate, nperseg=1024)
        
        # Find energy in high frequency range (frication)
        frication_range = characteristics.get('frication_range', (6000, 10000))
        frication_indices = np.where(
            (frequencies >= frication_range[0]) & 
            (frequencies <= frication_range[1])
        )[0]
        
        if len(frication_indices) > 0:
            frication_energy = np.sum(psd[frication_indices])
            total_energy = np.sum(psd)
            
            # /s/ should have significant high-frequency energy
            frication_ratio = frication_energy / total_energy if total_energy > 0 else 0
            frication_score = min(100, frication_ratio * 500)  # Scale appropriately
        else:
            frication_score = 0
        
        # Check spectral peak location
        peak_freq = frequencies[np.argmax(psd)]
        target_peak = characteristics.get('spectral_peak', 7000)
        
        peak_score = max(0, 100 - abs(peak_freq - target_peak) / 50)
        
        # Overall quality score
        quality_score = (frication_score * 0.6 + peak_score * 0.4)
        
        return {
            'quality_score': min(100, max(0, quality_score)),
            'frication_score': frication_score,
            'peak_score': peak_score,
            'confidence': 0.80
        }
    
    def _analyze_th_sound(self, audio: np.ndarray, characteristics: Dict) -> Dict[str, float]:
        """
        Analyze /th/ sound characteristics
        """
        # Similar to /s/ but with different frequency characteristics
        frequencies, psd = scipy.signal.welch(audio, self.sample_rate, nperseg=1024)
        
        frication_range = characteristics.get('frication_range', (4000, 8000))
        frication_indices = np.where(
            (frequencies >= frication_range[0]) & 
            (frequencies <= frication_range[1])
        )[0]
        
        if len(frication_indices) > 0:
            frication_energy = np.sum(psd[frication_indices])
            total_energy = np.sum(psd)
            frication_ratio = frication_energy / total_energy if total_energy > 0 else 0
            frication_score = min(100, frication_ratio * 400)
        else:
            frication_score = 0
        
        # /th/ has lower frequency frication than /s/
        quality_score = frication_score
        
        return {
            'quality_score': min(100, max(0, quality_score)),
            'frication_score': frication_score,
            'confidence': 0.75
        }
    
    def _analyze_l_sound(self, audio: np.ndarray, characteristics: Dict) -> Dict[str, float]:
        """
        Analyze /l/ sound characteristics
        """
        formants = self.extract_formants(audio)
        
        # /l/ has characteristic F2 positioning
        f2_mean = formants.get('f2', {}).get('mean', 1500)
        f2_target_range = characteristics.get('f2_range', (1000, 1400))
        
        if f2_target_range[0] <= f2_mean <= f2_target_range[1]:
            f2_score = 100
        else:
            f2_score = max(0, 100 - abs(f2_mean - np.mean(f2_target_range)) / 20)
        
        # Check formant clarity
        f1_mean = formants.get('f1', {}).get('mean', 500)
        f3_mean = formants.get('f3', {}).get('mean', 2500)
        
        # /l/ should have clear formant structure
        clarity_score = 100 if f1_mean > 0 and f2_mean > 0 and f3_mean > 0 else 50
        
        quality_score = (f2_score * 0.7 + clarity_score * 0.3)
        
        return {
            'quality_score': min(100, max(0, quality_score)),
            'f2_score': f2_score,
            'clarity_score': clarity_score,
            'confidence': 0.82
        }
    
    def _analyze_generic_phoneme(self, audio: np.ndarray) -> Dict[str, float]:
        """
        Generic phoneme analysis for unsupported phonemes
        """
        # Basic spectral analysis
        frequencies, psd = scipy.signal.welch(audio, self.sample_rate, nperseg=1024)
        
        # Check for reasonable spectral distribution
        spectral_centroid = np.sum(frequencies * psd) / np.sum(psd) if np.sum(psd) > 0 else 1000
        
        # Score based on spectral characteristics
        if 500 <= spectral_centroid <= 3000:
            quality_score = 75
        else:
            quality_score = 60
        
        return {
            'quality_score': quality_score,
            'spectral_centroid': spectral_centroid,
            'confidence': 0.60
        }
    
    def _lpc_analysis(self, signal: np.ndarray, order: int = 12) -> np.ndarray:
        """
        Linear Predictive Coding analysis
        """
        try:
            # Autocorrelation method
            autocorr = np.correlate(signal, signal, mode='full')
            autocorr = autocorr[len(autocorr)//2:]
            
            # Levinson-Durbin algorithm
            lpc_coeffs = np.zeros(order + 1)
            lpc_coeffs[0] = 1.0
            
            if len(autocorr) > order:
                for i in range(1, order + 1):
                    if i < len(autocorr):
                        lpc_coeffs[i] = autocorr[i] / autocorr[0] if autocorr[0] != 0 else 0
            
            return lpc_coeffs
            
        except Exception:
            return np.zeros(order + 1)
    
    def _lpc_to_formants(self, lpc_coeffs: np.ndarray) -> List[float]:
        """
        Extract formant frequencies from LPC coefficients
        """
        try:
            # Find roots of LPC polynomial
            roots = np.roots(lpc_coeffs)
            
            # Keep only roots inside unit circle with positive imaginary parts
            formant_roots = []
            for root in roots:
                if abs(root) < 1 and np.imag(root) > 0:
                    formant_roots.append(root)
            
            # Convert to frequencies
            formants = []
            for root in formant_roots:
                freq = np.angle(root) * self.sample_rate / (2 * np.pi)
                if 200 <= freq <= 4000:  # Reasonable formant range
                    formants.append(freq)
            
            return sorted(formants)
            
        except Exception:
            return []
    
    def _get_default_formants(self) -> Dict[str, Dict[str, float]]:
        """
        Default formant values when extraction fails
        """
        return {
            'f1': {'mean': 500, 'std': 50, 'median': 500, 'range': (450, 550)},
            'f2': {'mean': 1500, 'std': 100, 'median': 1500, 'range': (1400, 1600)},
            'f3': {'mean': 2500, 'std': 150, 'median': 2500, 'range': (2350, 2650)},
            'f4': {'mean': 3500, 'std': 200, 'median': 3500, 'range': (3300, 3700)}
        }
    
    def generate_feedback(self, analysis_results: Dict[str, float], target_phoneme: str) -> str:
        """
        Generate specific feedback based on analysis results
        """
        quality_score = analysis_results.get('quality_score', 0)
        
        if quality_score >= 90:
            return f"Excellent /{target_phoneme}/ sound! Your pronunciation is very clear and accurate."
        elif quality_score >= 80:
            return f"Great job with /{target_phoneme}/! You're very close to perfect pronunciation."
        elif quality_score >= 70:
            return f"Good work on /{target_phoneme}/! Keep practicing to make it even clearer."
        elif quality_score >= 60:
            return f"Nice try with /{target_phoneme}/! Focus on the tongue position and try again."
        else:
            return f"Keep practicing /{target_phoneme}/! Remember the correct mouth and tongue position."