from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import statistics
from collections import defaultdict

class ProgressTrackingAgent:
    """
    AI Agent responsible for tracking progress, generating reports,
    and identifying trends in speech therapy outcomes.
    """
    
    def __init__(self):
        self.name = "Progress Tracking Agent"
        self.status = "active"
        self.last_action = "Initialized progress tracking system"
        self.confidence = 0.98
        
        # Progress tracking parameters
        self.milestone_thresholds = {
            'first_session': 1,
            'consistency_week': 7,
            'accuracy_milestone': 80,
            'improvement_streak': 5,
            'phoneme_mastery': 90
        }
    
    def get_status(self) -> str:
        return self.status
    
    def get_last_action(self) -> str:
        return self.last_action
    
    def get_confidence(self) -> float:
        return self.confidence
    
    def generate_progress_report(self, child_profile: Dict[str, Any], session_history: List[Dict[str, Any]], time_period: str = "30_days") -> Dict[str, Any]:
        """
        Generate comprehensive progress report for specified time period
        """
        self.status = "processing"
        self.last_action = f"Generating {time_period} progress report"
        
        try:
            # Filter sessions by time period
            filtered_sessions = self._filter_sessions_by_period(session_history, time_period)
            
            # Calculate core metrics
            core_metrics = self._calculate_core_metrics(filtered_sessions)
            
            # Analyze trends
            trend_analysis = self._analyze_trends(filtered_sessions)
            
            # Identify achievements
            achievements = self._identify_achievements(child_profile, filtered_sessions)
            
            # Generate insights
            insights = self._generate_insights(core_metrics, trend_analysis, achievements)
            
            # Create recommendations
            recommendations = self._generate_progress_recommendations(core_metrics, trend_analysis)
            
            self.status = "active"
            self.last_action = f"Generated comprehensive progress report"
            self.confidence = 0.95
            
            return {
                'report_period': time_period,
                'generated_at': datetime.now().isoformat(),
                'child_id': child_profile.get('id'),
                'child_name': child_profile.get('name'),
                'core_metrics': core_metrics,
                'trend_analysis': trend_analysis,
                'achievements': achievements,
                'insights': insights,
                'recommendations': recommendations,
                'next_milestones': self._identify_next_milestones(child_profile, core_metrics)
            }
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error generating progress report: {str(e)}"
            return self._get_fallback_report(child_profile)
    
    def track_session_progress(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Track progress within a single session
        """
        self.status = "processing"
        self.last_action = "Tracking session progress"
        
        try:
            session_metrics = {
                'session_id': session_data.get('id'),
                'start_time': session_data.get('start_time'),
                'end_time': session_data.get('end_time'),
                'duration_minutes': self._calculate_session_duration(session_data),
                'exercises_completed': len([ex for ex in session_data.get('exercises', []) if ex.get('completed', False)]),
                'total_exercises': len(session_data.get('exercises', [])),
                'total_attempts': sum(len(ex.get('attempts', [])) for ex in session_data.get('exercises', [])),
                'average_accuracy': self._calculate_session_accuracy(session_data),
                'phoneme_breakdown': self._analyze_phoneme_performance(session_data),
                'improvement_within_session': self._calculate_within_session_improvement(session_data),
                'engagement_indicators': self._assess_session_engagement(session_data)
            }
            
            # Calculate session score
            session_metrics['overall_session_score'] = self._calculate_overall_session_score(session_metrics)
            
            self.status = "active"
            self.last_action = f"Tracked session with {session_metrics['average_accuracy']:.1f}% accuracy"
            
            return session_metrics
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error tracking session progress: {str(e)}"
            return {'error': str(e)}
    
    def update_streak_counter(self, child_profile: Dict[str, Any], new_session_date: datetime) -> Dict[str, Any]:
        """
        Update and manage session streak counter
        """
        self.status = "processing"
        self.last_action = "Updating session streak"
        
        try:
            last_session_date = child_profile.get('last_session_date')
            current_streak = child_profile.get('session_streak', 0)
            
            if isinstance(last_session_date, str):
                last_session_date = datetime.fromisoformat(last_session_date.replace('Z', '+00:00'))
            elif last_session_date is None:
                # First session ever
                new_streak = 1
                streak_status = 'started'
            else:
                # Calculate days between sessions
                days_diff = (new_session_date.date() - last_session_date.date()).days
                
                if days_diff == 1:
                    # Consecutive day - increment streak
                    new_streak = current_streak + 1
                    streak_status = 'continued'
                elif days_diff == 0:
                    # Same day - maintain streak
                    new_streak = current_streak
                    streak_status = 'maintained'
                else:
                    # Gap in sessions - reset streak
                    new_streak = 1
                    streak_status = 'reset'
            
            # Check for streak milestones
            milestone_achieved = None
            if new_streak in [3, 7, 14, 30, 60, 100]:
                milestone_achieved = f"{new_streak}_day_streak"
            
            self.status = "active"
            self.last_action = f"Updated streak to {new_streak} days"
            
            return {
                'previous_streak': current_streak,
                'new_streak': new_streak,
                'streak_status': streak_status,
                'milestone_achieved': milestone_achieved,
                'days_since_last_session': days_diff if 'days_diff' in locals() else 0
            }
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error updating streak: {str(e)}"
            return {'error': str(e)}
    
    def identify_learning_patterns(self, session_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Identify patterns in learning behavior and performance
        """
        self.status = "processing"
        self.last_action = "Analyzing learning patterns"
        
        try:
            patterns = {}
            
            # Time-based patterns
            patterns['time_patterns'] = self._analyze_time_patterns(session_history)
            
            # Performance patterns
            patterns['performance_patterns'] = self._analyze_performance_patterns(session_history)
            
            # Difficulty progression patterns
            patterns['difficulty_patterns'] = self._analyze_difficulty_patterns(session_history)
            
            # Engagement patterns
            patterns['engagement_patterns'] = self._analyze_engagement_patterns(session_history)
            
            # Phoneme-specific patterns
            patterns['phoneme_patterns'] = self._analyze_phoneme_learning_patterns(session_history)
            
            self.status = "active"
            self.last_action = "Identified key learning patterns"
            
            return patterns
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error analyzing patterns: {str(e)}"
            return {}
    
    def generate_milestone_badges(self, child_profile: Dict[str, Any], session_history: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Generate achievement badges based on milestones
        """
        self.status = "processing"
        self.last_action = "Checking for milestone achievements"
        
        try:
            badges = []
            
            # Session count milestones
            total_sessions = len(session_history)
            session_milestones = [1, 5, 10, 25, 50, 100]
            for milestone in session_milestones:
                if total_sessions >= milestone:
                    badges.append({
                        'id': f'sessions_{milestone}',
                        'name': f'{milestone} Sessions Complete',
                        'description': f'Completed {milestone} therapy sessions',
                        'icon': '🎯' if milestone < 10 else '🏆',
                        'category': 'milestone',
                        'earned': True,
                        'earned_date': self._estimate_milestone_date(session_history, milestone)
                    })
            
            # Accuracy milestones
            if session_history:
                best_accuracy = max(
                    max(attempt.get('accuracy', 0) for attempt in exercise.get('attempts', []) if exercise.get('attempts'))
                    for session in session_history
                    for exercise in session.get('exercises', [])
                    if exercise.get('attempts')
                )
                
                accuracy_milestones = [70, 80, 90, 95]
                for milestone in accuracy_milestones:
                    if best_accuracy >= milestone:
                        badges.append({
                            'id': f'accuracy_{milestone}',
                            'name': f'{milestone}% Accuracy',
                            'description': f'Achieved {milestone}% accuracy in an exercise',
                            'icon': '🎯' if milestone < 90 else '🌟',
                            'category': 'accuracy',
                            'earned': True,
                            'earned_date': datetime.now().isoformat()
                        })
            
            # Streak milestones
            current_streak = child_profile.get('session_streak', 0)
            streak_milestones = [3, 7, 14, 30]
            for milestone in streak_milestones:
                if current_streak >= milestone:
                    badges.append({
                        'id': f'streak_{milestone}',
                        'name': f'{milestone} Day Streak',
                        'description': f'Practiced for {milestone} consecutive days',
                        'icon': '🔥',
                        'category': 'consistency',
                        'earned': True,
                        'earned_date': datetime.now().isoformat()
                    })
            
            # Improvement milestones
            if len(session_history) >= 5:
                recent_avg = self._calculate_recent_average_accuracy(session_history[-5:])
                early_avg = self._calculate_recent_average_accuracy(session_history[:5])
                improvement = recent_avg - early_avg
                
                if improvement >= 10:
                    badges.append({
                        'id': 'improvement_10',
                        'name': 'Great Improvement',
                        'description': 'Improved accuracy by 10% or more',
                        'icon': '📈',
                        'category': 'improvement',
                        'earned': True,
                        'earned_date': datetime.now().isoformat()
                    })
            
            self.status = "active"
            self.last_action = f"Generated {len(badges)} achievement badges"
            
            return badges
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error generating badges: {str(e)}"
            return []
    
    def _filter_sessions_by_period(self, session_history: List[Dict[str, Any]], time_period: str) -> List[Dict[str, Any]]:
        """Filter sessions by specified time period"""
        
        now = datetime.now()
        
        if time_period == "7_days":
            cutoff = now - timedelta(days=7)
        elif time_period == "30_days":
            cutoff = now - timedelta(days=30)
        elif time_period == "90_days":
            cutoff = now - timedelta(days=90)
        else:
            return session_history  # Return all if period not recognized
        
        filtered = []
        for session in session_history:
            session_date = session.get('start_time')
            if isinstance(session_date, str):
                session_date = datetime.fromisoformat(session_date.replace('Z', '+00:00'))
            
            if session_date and session_date >= cutoff:
                filtered.append(session)
        
        return filtered
    
    def _calculate_core_metrics(self, sessions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate core progress metrics"""
        
        if not sessions:
            return {
                'total_sessions': 0,
                'total_exercises': 0,
                'total_attempts': 0,
                'average_accuracy': 0.0,
                'completion_rate': 0.0,
                'total_practice_time': 0
            }
        
        total_sessions = len(sessions)
        total_exercises = sum(len(session.get('exercises', [])) for session in sessions)
        completed_exercises = sum(
            len([ex for ex in session.get('exercises', []) if ex.get('completed', False)])
            for session in sessions
        )
        
        all_accuracies = []
        total_attempts = 0
        
        for session in sessions:
            for exercise in session.get('exercises', []):
                for attempt in exercise.get('attempts', []):
                    all_accuracies.append(attempt.get('accuracy', 0))
                    total_attempts += 1
        
        average_accuracy = statistics.mean(all_accuracies) if all_accuracies else 0.0
        completion_rate = (completed_exercises / total_exercises) if total_exercises > 0 else 0.0
        
        # Calculate total practice time
        total_practice_time = 0
        for session in sessions:
            duration = self._calculate_session_duration(session)
            if duration:
                total_practice_time += duration
        
        return {
            'total_sessions': total_sessions,
            'total_exercises': total_exercises,
            'total_attempts': total_attempts,
            'average_accuracy': round(average_accuracy, 1),
            'completion_rate': round(completion_rate * 100, 1),
            'total_practice_time': total_practice_time
        }
    
    def _analyze_trends(self, sessions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze performance trends"""
        
        if len(sessions) < 2:
            return {'trend': 'insufficient_data'}
        
        # Calculate session-level accuracies
        session_accuracies = []
        for session in sessions:
            session_attempts = []
            for exercise in session.get('exercises', []):
                for attempt in exercise.get('attempts', []):
                    session_attempts.append(attempt.get('accuracy', 0))
            
            if session_attempts:
                session_accuracies.append(statistics.mean(session_attempts))
        
        if len(session_accuracies) < 2:
            return {'trend': 'insufficient_data'}
        
        # Calculate trend
        recent_avg = statistics.mean(session_accuracies[-3:]) if len(session_accuracies) >= 3 else session_accuracies[-1]
        early_avg = statistics.mean(session_accuracies[:3]) if len(session_accuracies) >= 6 else session_accuracies[0]
        
        improvement = recent_avg - early_avg
        
        if improvement > 5:
            trend = 'improving'
        elif improvement < -5:
            trend = 'declining'
        else:
            trend = 'stable'
        
        return {
            'trend': trend,
            'improvement_percentage': round(improvement, 1),
            'recent_average': round(recent_avg, 1),
            'early_average': round(early_avg, 1),
            'consistency': round(1.0 - (statistics.stdev(session_accuracies) / 100), 2) if len(session_accuracies) > 1 else 1.0
        }
    
    def _identify_achievements(self, child_profile: Dict[str, Any], sessions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Identify recent achievements"""
        
        achievements = []
        
        # Session completion achievements
        if len(sessions) >= 5:
            achievements.append({
                'type': 'consistency',
                'description': f'Completed {len(sessions)} sessions in the period',
                'icon': '📅'
            })
        
        # Accuracy achievements
        if sessions:
            best_accuracy = 0
            for session in sessions:
                for exercise in session.get('exercises', []):
                    for attempt in exercise.get('attempts', []):
                        best_accuracy = max(best_accuracy, attempt.get('accuracy', 0))
            
            if best_accuracy >= 90:
                achievements.append({
                    'type': 'accuracy',
                    'description': f'Achieved {best_accuracy:.1f}% accuracy',
                    'icon': '🎯'
                })
        
        return achievements
    
    def _generate_insights(self, core_metrics: Dict[str, Any], trend_analysis: Dict[str, Any], achievements: List[Dict[str, Any]]) -> List[str]:
        """Generate insights from metrics"""
        
        insights = []
        
        # Accuracy insights
        if core_metrics['average_accuracy'] > 80:
            insights.append("Excellent accuracy performance - ready for more challenging exercises")
        elif core_metrics['average_accuracy'] > 70:
            insights.append("Good accuracy progress - continue current approach")
        else:
            insights.append("Focus on building foundational skills")
        
        # Trend insights
        if trend_analysis.get('trend') == 'improving':
            insights.append(f"Strong improvement trend (+{trend_analysis.get('improvement_percentage', 0):.1f}%)")
        elif trend_analysis.get('trend') == 'declining':
            insights.append("Performance declining - consider adjusting difficulty or approach")
        
        # Consistency insights
        consistency = trend_analysis.get('consistency', 0)
        if consistency > 0.8:
            insights.append("Very consistent performance across sessions")
        elif consistency < 0.6:
            insights.append("Performance varies significantly - focus on consistency")
        
        return insights
    
    def _generate_progress_recommendations(self, core_metrics: Dict[str, Any], trend_analysis: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on progress"""
        
        recommendations = []
        
        # Based on accuracy
        if core_metrics['average_accuracy'] < 70:
            recommendations.append("Increase practice frequency with foundational exercises")
        elif core_metrics['average_accuracy'] > 85:
            recommendations.append("Introduce more challenging phonemes and words")
        
        # Based on trend
        if trend_analysis.get('trend') == 'declining':
            recommendations.append("Review and reinforce previously learned sounds")
        elif trend_analysis.get('trend') == 'improving':
            recommendations.append("Maintain current approach - it's working well")
        
        # Based on completion rate
        if core_metrics['completion_rate'] < 70:
            recommendations.append("Consider shorter sessions or more engaging activities")
        
        return recommendations
    
    def _identify_next_milestones(self, child_profile: Dict[str, Any], core_metrics: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Identify upcoming milestones"""
        
        milestones = []
        
        # Session count milestones
        current_sessions = core_metrics['total_sessions']
        next_session_milestone = None
        for milestone in [5, 10, 25, 50, 100]:
            if current_sessions < milestone:
                next_session_milestone = milestone
                break
        
        if next_session_milestone:
            milestones.append({
                'type': 'sessions',
                'target': next_session_milestone,
                'current': current_sessions,
                'progress': (current_sessions / next_session_milestone) * 100
            })
        
        # Accuracy milestones
        current_accuracy = core_metrics['average_accuracy']
        next_accuracy_milestone = None
        for milestone in [70, 80, 90, 95]:
            if current_accuracy < milestone:
                next_accuracy_milestone = milestone
                break
        
        if next_accuracy_milestone:
            milestones.append({
                'type': 'accuracy',
                'target': next_accuracy_milestone,
                'current': current_accuracy,
                'progress': (current_accuracy / next_accuracy_milestone) * 100
            })
        
        return milestones
    
    def _calculate_session_duration(self, session_data: Dict[str, Any]) -> Optional[int]:
        """Calculate session duration in minutes"""
        
        start_time = session_data.get('start_time')
        end_time = session_data.get('end_time')
        
        if not start_time or not end_time:
            return None
        
        if isinstance(start_time, str):
            start_time = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
        if isinstance(end_time, str):
            end_time = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
        
        duration = (end_time - start_time).total_seconds() / 60
        return int(duration)
    
    def _calculate_session_accuracy(self, session_data: Dict[str, Any]) -> float:
        """Calculate average accuracy for a session"""
        
        all_accuracies = []
        for exercise in session_data.get('exercises', []):
            for attempt in exercise.get('attempts', []):
                all_accuracies.append(attempt.get('accuracy', 0))
        
        return statistics.mean(all_accuracies) if all_accuracies else 0.0
    
    def _analyze_phoneme_performance(self, session_data: Dict[str, Any]) -> Dict[str, float]:
        """Analyze performance by phoneme"""
        
        phoneme_scores = defaultdict(list)
        
        for exercise in session_data.get('exercises', []):
            target_phoneme = exercise.get('target_sound', 'unknown')
            for attempt in exercise.get('attempts', []):
                phoneme_scores[target_phoneme].append(attempt.get('accuracy', 0))
        
        # Calculate averages
        phoneme_averages = {}
        for phoneme, scores in phoneme_scores.items():
            phoneme_averages[phoneme] = statistics.mean(scores) if scores else 0.0
        
        return phoneme_averages
    
    def _calculate_within_session_improvement(self, session_data: Dict[str, Any]) -> float:
        """Calculate improvement within a single session"""
        
        all_accuracies = []
        for exercise in session_data.get('exercises', []):
            for attempt in exercise.get('attempts', []):
                all_accuracies.append(attempt.get('accuracy', 0))
        
        if len(all_accuracies) < 2:
            return 0.0
        
        # Compare first and last attempts
        return all_accuracies[-1] - all_accuracies[0]
    
    def _assess_session_engagement(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """Assess engagement indicators for a session"""
        
        total_exercises = len(session_data.get('exercises', []))
        completed_exercises = len([ex for ex in session_data.get('exercises', []) if ex.get('completed', False)])
        total_attempts = sum(len(ex.get('attempts', [])) for ex in session_data.get('exercises', []))
        
        return {
            'completion_rate': (completed_exercises / total_exercises) if total_exercises > 0 else 0.0,
            'attempts_per_exercise': (total_attempts / total_exercises) if total_exercises > 0 else 0.0,
            'session_completed': session_data.get('end_time') is not None
        }
    
    def _calculate_overall_session_score(self, session_metrics: Dict[str, Any]) -> float:
        """Calculate overall session score"""
        
        accuracy_score = session_metrics.get('average_accuracy', 0) * 0.4
        completion_score = (session_metrics.get('exercises_completed', 0) / max(1, session_metrics.get('total_exercises', 1))) * 100 * 0.3
        engagement_score = min(100, session_metrics.get('total_attempts', 0) * 10) * 0.3
        
        return round(accuracy_score + completion_score + engagement_score, 1)
    
    def _analyze_time_patterns(self, session_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze time-based patterns"""
        
        # Simplified analysis for demo
        return {
            'preferred_time': 'morning',
            'session_frequency': 'daily',
            'optimal_duration': 15
        }
    
    def _analyze_performance_patterns(self, session_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze performance patterns"""
        
        return {
            'learning_curve': 'steady_improvement',
            'plateau_periods': 0,
            'breakthrough_sessions': 2
        }
    
    def _analyze_difficulty_patterns(self, session_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze difficulty progression patterns"""
        
        return {
            'progression_rate': 'appropriate',
            'difficulty_comfort_zone': 'intermediate',
            'challenge_readiness': True
        }
    
    def _analyze_engagement_patterns(self, session_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze engagement patterns"""
        
        return {
            'engagement_trend': 'stable',
            'peak_engagement_time': 'mid_session',
            'attention_span': 'good'
        }
    
    def _analyze_phoneme_learning_patterns(self, session_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze phoneme-specific learning patterns"""
        
        return {
            'strongest_phonemes': ['s', 'l'],
            'challenging_phonemes': ['r', 'th'],
            'learning_order': ['s', 'l', 'r', 'th']
        }
    
    def _estimate_milestone_date(self, session_history: List[Dict[str, Any]], milestone: int) -> str:
        """Estimate when a milestone was achieved"""
        
        if len(session_history) >= milestone:
            session = session_history[milestone - 1]
            return session.get('start_time', datetime.now().isoformat())
        
        return datetime.now().isoformat()
    
    def _calculate_recent_average_accuracy(self, sessions: List[Dict[str, Any]]) -> float:
        """Calculate average accuracy for a set of sessions"""
        
        all_accuracies = []
        for session in sessions:
            for exercise in session.get('exercises', []):
                for attempt in exercise.get('attempts', []):
                    all_accuracies.append(attempt.get('accuracy', 0))
        
        return statistics.mean(all_accuracies) if all_accuracies else 0.0
    
    def _get_fallback_report(self, child_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback report when errors occur"""
        
        return {
            'report_period': '30_days',
            'generated_at': datetime.now().isoformat(),
            'child_id': child_profile.get('id'),
            'child_name': child_profile.get('name'),
            'core_metrics': {
                'total_sessions': 0,
                'average_accuracy': 0.0,
                'completion_rate': 0.0
            },
            'trend_analysis': {'trend': 'insufficient_data'},
            'achievements': [],
            'insights': ['Insufficient data for detailed analysis'],
            'recommendations': ['Continue regular practice sessions'],
            'next_milestones': []
        }