from typing import Dict, List, Any
from datetime import datetime, timedelta
import statistics
import random

class AdaptiveLearningAgent:
    """
    AI Agent responsible for adapting difficulty levels and personalizing
    the learning experience based on child's performance and engagement.
    """
    
    def __init__(self):
        self.name = "Adaptive Learning Agent"
        self.status = "active"
        self.last_action = "Initialized adaptive learning system"
        self.confidence = 0.94
        
        # Learning parameters
        self.difficulty_thresholds = {
            'increase': 85,  # Increase difficulty if accuracy > 85%
            'decrease': 60,  # Decrease difficulty if accuracy < 60%
            'maintain': (60, 85)  # Maintain if between 60-85%
        }
        
        self.engagement_factors = {
            'session_completion': 0.3,
            'accuracy_improvement': 0.25,
            'consistency': 0.2,
            'attempt_frequency': 0.15,
            'time_spent': 0.1
        }
    
    def get_status(self) -> str:
        return self.status
    
    def get_last_action(self) -> str:
        return self.last_action
    
    def get_confidence(self) -> float:
        return self.confidence
    
    def adapt_difficulty(self, child_profile: Dict[str, Any], recent_sessions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze performance and adapt difficulty level
        """
        self.status = "processing"
        self.last_action = "Analyzing performance patterns for difficulty adaptation"
        
        try:
            current_difficulty = child_profile.get('difficulty_level', 'beginner')
            
            # Analyze recent performance
            performance_analysis = self._analyze_recent_performance(recent_sessions)
            
            # Determine if difficulty should change
            adaptation_decision = self._make_difficulty_decision(
                performance_analysis, 
                current_difficulty
            )
            
            # Generate personalized recommendations
            recommendations = self._generate_adaptive_recommendations(
                performance_analysis, 
                adaptation_decision,
                child_profile
            )
            
            self.status = "active"
            self.last_action = f"Recommended difficulty: {adaptation_decision['new_difficulty']}"
            self.confidence = adaptation_decision['confidence']
            
            return {
                'current_difficulty': current_difficulty,
                'recommended_difficulty': adaptation_decision['new_difficulty'],
                'change_reason': adaptation_decision['reason'],
                'confidence': adaptation_decision['confidence'],
                'performance_summary': performance_analysis,
                'recommendations': recommendations,
                'next_session_adjustments': self._suggest_session_adjustments(adaptation_decision)
            }
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error in difficulty adaptation: {str(e)}"
            return self._get_fallback_adaptation(child_profile)
    
    def calculate_engagement_score(self, child_profile: Dict[str, Any], session_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate child's engagement score based on multiple factors
        """
        self.status = "processing"
        self.last_action = "Calculating engagement metrics"
        
        try:
            engagement_metrics = {}
            
            # Session completion rate
            total_exercises = len(session_data.get('exercises', []))
            completed_exercises = sum(1 for ex in session_data.get('exercises', []) if ex.get('completed', False))
            completion_rate = completed_exercises / max(1, total_exercises)
            engagement_metrics['completion_rate'] = completion_rate
            
            # Accuracy improvement within session
            accuracies = []
            for exercise in session_data.get('exercises', []):
                for attempt in exercise.get('attempts', []):
                    accuracies.append(attempt.get('accuracy', 0))
            
            if len(accuracies) >= 2:
                improvement = accuracies[-1] - accuracies[0]
                engagement_metrics['accuracy_improvement'] = max(0, improvement / 100)
            else:
                engagement_metrics['accuracy_improvement'] = 0.5
            
            # Attempt frequency (attempts per exercise)
            if total_exercises > 0:
                total_attempts = sum(len(ex.get('attempts', [])) for ex in session_data.get('exercises', []))
                attempt_frequency = total_attempts / total_exercises
                engagement_metrics['attempt_frequency'] = min(1.0, attempt_frequency / 3)  # Normalize to 3 attempts
            else:
                engagement_metrics['attempt_frequency'] = 0
            
            # Time engagement (session duration vs expected)
            session_start = session_data.get('start_time')
            session_end = session_data.get('end_time')
            expected_duration = child_profile.get('preferences', {}).get('session_length', 15) * 60  # Convert to seconds
            
            if session_start and session_end:
                if isinstance(session_start, str):
                    session_start = datetime.fromisoformat(session_start.replace('Z', '+00:00'))
                if isinstance(session_end, str):
                    session_end = datetime.fromisoformat(session_end.replace('Z', '+00:00'))
                
                actual_duration = (session_end - session_start).total_seconds()
                time_engagement = min(1.0, actual_duration / expected_duration)
                engagement_metrics['time_engagement'] = time_engagement
            else:
                engagement_metrics['time_engagement'] = 0.7  # Default moderate engagement
            
            # Calculate overall engagement score
            overall_score = (
                engagement_metrics['completion_rate'] * self.engagement_factors['session_completion'] +
                engagement_metrics['accuracy_improvement'] * self.engagement_factors['accuracy_improvement'] +
                engagement_metrics['attempt_frequency'] * self.engagement_factors['attempt_frequency'] +
                engagement_metrics['time_engagement'] * self.engagement_factors['time_spent']
            )
            
            # Add consistency bonus if available
            consistency_score = self._calculate_consistency_score(child_profile)
            overall_score += consistency_score * self.engagement_factors['consistency']
            
            # Normalize to 0-100 scale
            overall_score = min(100, max(0, overall_score * 100))
            
            self.status = "active"
            self.last_action = f"Calculated engagement score: {overall_score:.1f}%"
            
            return {
                'overall_score': round(overall_score, 1),
                'metrics': engagement_metrics,
                'factors': self._interpret_engagement_factors(engagement_metrics),
                'recommendations': self._generate_engagement_recommendations(engagement_metrics)
            }
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error calculating engagement: {str(e)}"
            return {
                'overall_score': 70.0,
                'metrics': {},
                'factors': ['Unable to calculate detailed metrics'],
                'recommendations': ['Continue regular practice sessions']
            }
    
    def personalize_session_plan(self, child_profile: Dict[str, Any], performance_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Create personalized session plan based on learning patterns
        """
        self.status = "processing"
        self.last_action = "Creating personalized session plan"
        
        try:
            # Analyze learning patterns
            learning_patterns = self._analyze_learning_patterns(performance_history)
            
            # Get child preferences
            preferences = child_profile.get('preferences', {})
            
            # Create personalized plan
            session_plan = {
                'recommended_duration': self._optimize_session_duration(learning_patterns, preferences),
                'exercise_sequence': self._optimize_exercise_sequence(learning_patterns, child_profile),
                'break_intervals': self._optimize_break_timing(learning_patterns, preferences),
                'difficulty_progression': self._plan_difficulty_progression(learning_patterns),
                'motivation_strategies': self._select_motivation_strategies(child_profile, learning_patterns),
                'focus_areas': self._identify_focus_areas(learning_patterns)
            }
            
            self.status = "active"
            self.last_action = "Generated personalized session plan"
            
            return session_plan
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error creating session plan: {str(e)}"
            return self._get_default_session_plan(child_profile)
    
    def _analyze_recent_performance(self, recent_sessions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze performance trends from recent sessions"""
        
        if not recent_sessions:
            return {
                'average_accuracy': 70.0,
                'accuracy_trend': 'stable',
                'consistency': 0.7,
                'session_count': 0
            }
        
        # Extract accuracy scores
        all_accuracies = []
        session_accuracies = []
        
        for session in recent_sessions[-10:]:  # Last 10 sessions
            session_scores = []
            for exercise in session.get('exercises', []):
                for attempt in exercise.get('attempts', []):
                    accuracy = attempt.get('accuracy', 0)
                    all_accuracies.append(accuracy)
                    session_scores.append(accuracy)
            
            if session_scores:
                session_accuracies.append(statistics.mean(session_scores))
        
        # Calculate metrics
        average_accuracy = statistics.mean(all_accuracies) if all_accuracies else 70.0
        
        # Determine trend
        if len(session_accuracies) >= 3:
            recent_avg = statistics.mean(session_accuracies[-3:])
            older_avg = statistics.mean(session_accuracies[:-3]) if len(session_accuracies) > 3 else recent_avg
            
            if recent_avg > older_avg + 5:
                trend = 'improving'
            elif recent_avg < older_avg - 5:
                trend = 'declining'
            else:
                trend = 'stable'
        else:
            trend = 'insufficient_data'
        
        # Calculate consistency (inverse of standard deviation)
        consistency = 1.0 - (statistics.stdev(all_accuracies) / 100) if len(all_accuracies) > 1 else 0.7
        consistency = max(0, min(1, consistency))
        
        return {
            'average_accuracy': round(average_accuracy, 1),
            'accuracy_trend': trend,
            'consistency': round(consistency, 2),
            'session_count': len(recent_sessions),
            'total_attempts': len(all_accuracies)
        }
    
    def _make_difficulty_decision(self, performance_analysis: Dict[str, Any], current_difficulty: str) -> Dict[str, Any]:
        """Make decision about difficulty adjustment"""
        
        avg_accuracy = performance_analysis['average_accuracy']
        trend = performance_analysis['accuracy_trend']
        consistency = performance_analysis['consistency']
        
        # Difficulty level mapping
        difficulty_levels = ['beginner', 'intermediate', 'advanced']
        current_index = difficulty_levels.index(current_difficulty) if current_difficulty in difficulty_levels else 0
        
        # Decision logic
        if avg_accuracy > self.difficulty_thresholds['increase'] and consistency > 0.7 and trend != 'declining':
            # Increase difficulty
            new_index = min(len(difficulty_levels) - 1, current_index + 1)
            reason = f"High accuracy ({avg_accuracy}%) with good consistency"
            confidence = 0.9
        elif avg_accuracy < self.difficulty_thresholds['decrease'] or (trend == 'declining' and consistency < 0.5):
            # Decrease difficulty
            new_index = max(0, current_index - 1)
            reason = f"Low accuracy ({avg_accuracy}%) or declining performance"
            confidence = 0.85
        else:
            # Maintain current difficulty
            new_index = current_index
            reason = f"Performance within optimal range ({avg_accuracy}%)"
            confidence = 0.8
        
        return {
            'new_difficulty': difficulty_levels[new_index],
            'reason': reason,
            'confidence': confidence,
            'change_magnitude': abs(new_index - current_index)
        }
    
    def _generate_adaptive_recommendations(self, performance_analysis: Dict[str, Any], adaptation_decision: Dict[str, Any], child_profile: Dict[str, Any]) -> List[str]:
        """Generate specific recommendations based on analysis"""
        
        recommendations = []
        
        # Performance-based recommendations
        if performance_analysis['average_accuracy'] < 70:
            recommendations.append("Focus on foundational skills with more practice time")
            recommendations.append("Consider shorter sessions with more frequent breaks")
        elif performance_analysis['average_accuracy'] > 85:
            recommendations.append("Ready for more challenging exercises")
            recommendations.append("Introduce new phonemes or complex words")
        
        # Consistency-based recommendations
        if performance_analysis['consistency'] < 0.6:
            recommendations.append("Work on building consistent performance")
            recommendations.append("Review and reinforce previously learned sounds")
        
        # Trend-based recommendations
        if performance_analysis['accuracy_trend'] == 'declining':
            recommendations.append("Take a step back and reinforce basics")
            recommendations.append("Consider motivational rewards to re-engage")
        elif performance_analysis['accuracy_trend'] == 'improving':
            recommendations.append("Maintain current approach - it's working well!")
            recommendations.append("Gradually introduce new challenges")
        
        return recommendations
    
    def _suggest_session_adjustments(self, adaptation_decision: Dict[str, Any]) -> Dict[str, Any]:
        """Suggest specific adjustments for next session"""
        
        adjustments = {}
        
        if adaptation_decision['change_magnitude'] > 0:
            if adaptation_decision['new_difficulty'] == 'advanced':
                adjustments['exercise_types'] = ['sentence', 'conversation']
                adjustments['session_length'] = 'increase_by_5_minutes'
            elif adaptation_decision['new_difficulty'] == 'beginner':
                adjustments['exercise_types'] = ['phoneme', 'word']
                adjustments['session_length'] = 'decrease_by_5_minutes'
            else:
                adjustments['exercise_types'] = ['phoneme', 'word', 'sentence']
                adjustments['session_length'] = 'maintain_current'
        
        adjustments['focus_intensity'] = 'high' if adaptation_decision['confidence'] > 0.85 else 'moderate'
        
        return adjustments
    
    def _calculate_consistency_score(self, child_profile: Dict[str, Any]) -> float:
        """Calculate consistency score based on session streak"""
        
        streak = child_profile.get('session_streak', 0)
        
        # Normalize streak to 0-1 scale (optimal streak is around 7-14 days)
        if streak >= 7:
            return min(1.0, streak / 14)
        else:
            return streak / 7
    
    def _interpret_engagement_factors(self, metrics: Dict[str, Any]) -> List[str]:
        """Interpret engagement metrics into readable factors"""
        
        factors = []
        
        if metrics.get('completion_rate', 0) > 0.8:
            factors.append("High session completion rate")
        elif metrics.get('completion_rate', 0) < 0.5:
            factors.append("Low session completion - may need shorter sessions")
        
        if metrics.get('accuracy_improvement', 0) > 0.1:
            factors.append("Shows improvement within sessions")
        
        if metrics.get('attempt_frequency', 0) > 0.7:
            factors.append("Good engagement with multiple attempts")
        
        if metrics.get('time_engagement', 0) > 0.8:
            factors.append("Maintains focus for full session duration")
        
        return factors if factors else ["Moderate engagement across all areas"]
    
    def _generate_engagement_recommendations(self, metrics: Dict[str, Any]) -> List[str]:
        """Generate recommendations to improve engagement"""
        
        recommendations = []
        
        if metrics.get('completion_rate', 0) < 0.6:
            recommendations.append("Consider shorter sessions or more breaks")
        
        if metrics.get('attempt_frequency', 0) < 0.5:
            recommendations.append("Encourage multiple attempts with positive reinforcement")
        
        if metrics.get('time_engagement', 0) < 0.6:
            recommendations.append("Add more interactive elements or visual rewards")
        
        return recommendations if recommendations else ["Continue current engagement strategies"]
    
    def _analyze_learning_patterns(self, performance_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze learning patterns from historical data"""
        
        # Simplified pattern analysis for demo
        return {
            'best_time_of_day': 'morning',  # Would be calculated from timestamps
            'optimal_session_length': 15,   # Would be calculated from performance vs duration
            'preferred_exercise_types': ['phoneme', 'word'],
            'learning_velocity': 'moderate',
            'retention_rate': 0.8
        }
    
    def _optimize_session_duration(self, learning_patterns: Dict[str, Any], preferences: Dict[str, Any]) -> int:
        """Optimize session duration based on patterns"""
        
        base_duration = preferences.get('session_length', 15)
        optimal_duration = learning_patterns.get('optimal_session_length', 15)
        
        # Blend preference with optimal
        return int((base_duration + optimal_duration) / 2)
    
    def _optimize_exercise_sequence(self, learning_patterns: Dict[str, Any], child_profile: Dict[str, Any]) -> List[str]:
        """Optimize exercise sequence"""
        
        difficulty = child_profile.get('difficulty_level', 'beginner')
        
        sequences = {
            'beginner': ['warm_up', 'phoneme_practice', 'word_practice', 'review'],
            'intermediate': ['warm_up', 'phoneme_practice', 'word_practice', 'sentence_practice', 'review'],
            'advanced': ['warm_up', 'word_practice', 'sentence_practice', 'conversation_practice', 'review']
        }
        
        return sequences.get(difficulty, sequences['beginner'])
    
    def _optimize_break_timing(self, learning_patterns: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Optimize break timing"""
        
        return {
            'frequency_minutes': preferences.get('break_frequency', 5),
            'duration_seconds': 30,
            'type': 'visual_reward'
        }
    
    def _plan_difficulty_progression(self, learning_patterns: Dict[str, Any]) -> Dict[str, Any]:
        """Plan difficulty progression"""
        
        return {
            'progression_rate': learning_patterns.get('learning_velocity', 'moderate'),
            'next_milestone': 'improve_consistency',
            'estimated_timeline': '2_weeks'
        }
    
    def _select_motivation_strategies(self, child_profile: Dict[str, Any], learning_patterns: Dict[str, Any]) -> List[str]:
        """Select appropriate motivation strategies"""
        
        favorite_rewards = child_profile.get('preferences', {}).get('favorite_rewards', ['stars'])
        
        strategies = []
        for reward in favorite_rewards:
            if reward in ['stars', 'rainbows', 'elephants', 'clouds']:
                strategies.append(f"Use {reward} as visual rewards")
        
        strategies.append("Celebrate small improvements")
        strategies.append("Provide encouraging feedback")
        
        return strategies
    
    def _identify_focus_areas(self, learning_patterns: Dict[str, Any]) -> List[str]:
        """Identify areas that need focus"""
        
        return [
            "Consistency building",
            "Target phoneme accuracy",
            "Session engagement"
        ]
    
    def _get_fallback_adaptation(self, child_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback adaptation when errors occur"""
        
        current_difficulty = child_profile.get('difficulty_level', 'beginner')
        
        return {
            'current_difficulty': current_difficulty,
            'recommended_difficulty': current_difficulty,
            'change_reason': 'Maintaining current level due to insufficient data',
            'confidence': 0.5,
            'performance_summary': {'average_accuracy': 70.0, 'accuracy_trend': 'stable'},
            'recommendations': ['Continue regular practice'],
            'next_session_adjustments': {'focus_intensity': 'moderate'}
        }
    
    def _get_default_session_plan(self, child_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Default session plan when personalization fails"""
        
        preferences = child_profile.get('preferences', {})
        
        return {
            'recommended_duration': preferences.get('session_length', 15),
            'exercise_sequence': ['warm_up', 'phoneme_practice', 'word_practice', 'review'],
            'break_intervals': {'frequency_minutes': 5, 'duration_seconds': 30},
            'difficulty_progression': {'progression_rate': 'moderate'},
            'motivation_strategies': ['Use visual rewards', 'Provide encouraging feedback'],
            'focus_areas': ['Basic phoneme practice']
        }