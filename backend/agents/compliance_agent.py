from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import hashlib
import json

class ComplianceAgent:
    """
    AI Agent responsible for ensuring HIPAA compliance, data privacy,
    safety monitoring, and clinical audit trail management.
    """
    
    def __init__(self):
        self.name = "Compliance Agent"
        self.status = "active"
        self.last_action = "Initialized compliance monitoring system"
        self.confidence = 0.99
        
        # Compliance parameters
        self.data_retention_days = 2555  # 7 years for medical records
        self.audit_log_retention_days = 2555
        self.session_timeout_minutes = 30
        self.max_failed_attempts = 3
        
        # Safety thresholds
        self.safety_thresholds = {
            'max_session_duration': 45,  # minutes
            'max_daily_sessions': 3,
            'min_break_between_sessions': 60,  # minutes
            'accuracy_decline_threshold': 20,  # percentage points
            'engagement_drop_threshold': 30   # percentage points
        }
    
    def get_status(self) -> str:
        return self.status
    
    def get_last_action(self) -> str:
        return self.last_action
    
    def get_confidence(self) -> float:
        return self.confidence
    
    def validate_session_safety(self, child_profile: Dict[str, Any], session_data: Dict[str, Any], recent_sessions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Validate session safety parameters and child wellbeing indicators
        """
        self.status = "processing"
        self.last_action = "Validating session safety parameters"
        
        try:
            safety_checks = []
            warnings = []
            recommendations = []
            
            # Check session duration
            duration_check = self._check_session_duration(session_data)
            safety_checks.append(duration_check)
            if not duration_check['passed']:
                warnings.append(duration_check['message'])
                recommendations.append("Consider shorter session duration")
            
            # Check daily session frequency
            frequency_check = self._check_daily_frequency(recent_sessions)
            safety_checks.append(frequency_check)
            if not frequency_check['passed']:
                warnings.append(frequency_check['message'])
                recommendations.append("Limit sessions per day to prevent fatigue")
            
            # Check performance decline indicators
            performance_check = self._check_performance_decline(child_profile, session_data, recent_sessions)
            safety_checks.append(performance_check)
            if not performance_check['passed']:
                warnings.append(performance_check['message'])
                recommendations.append("Consider adjusting difficulty or taking a break")
            
            # Check engagement levels
            engagement_check = self._check_engagement_levels(session_data, recent_sessions)
            safety_checks.append(engagement_check)
            if not engagement_check['passed']:
                warnings.append(engagement_check['message'])
                recommendations.append("Implement more engaging activities")
            
            # Check age-appropriate content
            content_check = self._check_age_appropriate_content(child_profile, session_data)
            safety_checks.append(content_check)
            if not content_check['passed']:
                warnings.append(content_check['message'])
                recommendations.append("Adjust content for age appropriateness")
            
            # Overall safety assessment
            passed_checks = sum(1 for check in safety_checks if check['passed'])
            safety_score = (passed_checks / len(safety_checks)) * 100
            
            overall_status = "safe" if safety_score >= 80 else "caution" if safety_score >= 60 else "concern"
            
            self.status = "active"
            self.last_action = f"Safety validation complete: {overall_status}"
            
            return {
                'overall_status': overall_status,
                'safety_score': round(safety_score, 1),
                'checks_performed': len(safety_checks),
                'checks_passed': passed_checks,
                'warnings': warnings,
                'recommendations': recommendations,
                'detailed_checks': safety_checks,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error in safety validation: {str(e)}"
            return self._get_fallback_safety_report()
    
    def audit_data_access(self, user_id: str, child_id: str, action: str, data_accessed: List[str]) -> Dict[str, Any]:
        """
        Create audit trail for data access and modifications
        """
        self.status = "processing"
        self.last_action = f"Auditing data access: {action}"
        
        try:
            # Create audit entry
            audit_entry = {
                'audit_id': self._generate_audit_id(),
                'timestamp': datetime.now().isoformat(),
                'user_id': self._hash_identifier(user_id),
                'child_id': self._hash_identifier(child_id),
                'action': action,
                'data_accessed': data_accessed,
                'ip_address': self._get_masked_ip(),  # Would get from request in real implementation
                'session_id': self._generate_session_id(),
                'compliance_flags': self._check_compliance_flags(action, data_accessed)
            }
            
            # Validate audit entry
            validation_result = self._validate_audit_entry(audit_entry)
            
            self.status = "active"
            self.last_action = f"Audit entry created: {audit_entry['audit_id']}"
            
            return {
                'audit_entry': audit_entry,
                'validation_result': validation_result,
                'retention_until': (datetime.now() + timedelta(days=self.audit_log_retention_days)).isoformat()
            }
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error creating audit entry: {str(e)}"
            return {'error': str(e)}
    
    def check_data_privacy_compliance(self, data_request: Dict[str, Any]) -> Dict[str, Any]:
        """
        Check data request against privacy compliance requirements
        """
        self.status = "processing"
        self.last_action = "Checking data privacy compliance"
        
        try:
            compliance_checks = []
            
            # Check data minimization
            minimization_check = self._check_data_minimization(data_request)
            compliance_checks.append(minimization_check)
            
            # Check purpose limitation
            purpose_check = self._check_purpose_limitation(data_request)
            compliance_checks.append(purpose_check)
            
            # Check consent requirements
            consent_check = self._check_consent_requirements(data_request)
            compliance_checks.append(consent_check)
            
            # Check data retention limits
            retention_check = self._check_retention_limits(data_request)
            compliance_checks.append(retention_check)
            
            # Check access controls
            access_check = self._check_access_controls(data_request)
            compliance_checks.append(access_check)
            
            # Calculate compliance score
            passed_checks = sum(1 for check in compliance_checks if check['compliant'])
            compliance_score = (passed_checks / len(compliance_checks)) * 100
            
            overall_compliance = compliance_score >= 100  # Must pass all checks
            
            self.status = "active"
            self.last_action = f"Privacy compliance check: {'PASS' if overall_compliance else 'FAIL'}"
            
            return {
                'compliant': overall_compliance,
                'compliance_score': compliance_score,
                'checks_performed': compliance_checks,
                'recommendations': self._generate_privacy_recommendations(compliance_checks),
                'approval_required': not overall_compliance
            }
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error checking privacy compliance: {str(e)}"
            return {'compliant': False, 'error': str(e)}
    
    def generate_compliance_report(self, time_period: str = "30_days") -> Dict[str, Any]:
        """
        Generate comprehensive compliance report
        """
        self.status = "processing"
        self.last_action = f"Generating {time_period} compliance report"
        
        try:
            # In a real implementation, this would query audit logs and compliance data
            report = {
                'report_period': time_period,
                'generated_at': datetime.now().isoformat(),
                'compliance_summary': {
                    'overall_compliance_score': 98.5,
                    'hipaa_compliance': True,
                    'data_privacy_compliance': True,
                    'safety_compliance': True,
                    'audit_trail_complete': True
                },
                'audit_statistics': {
                    'total_audit_entries': 1247,
                    'data_access_events': 892,
                    'data_modification_events': 234,
                    'failed_access_attempts': 3,
                    'security_incidents': 0
                },
                'safety_statistics': {
                    'safety_checks_performed': 456,
                    'safety_warnings_issued': 12,
                    'sessions_flagged': 2,
                    'average_safety_score': 94.2
                },
                'privacy_statistics': {
                    'data_requests_processed': 178,
                    'consent_verifications': 89,
                    'data_retention_reviews': 45,
                    'privacy_violations': 0
                },
                'recommendations': [
                    "Continue current compliance monitoring practices",
                    "Review safety thresholds quarterly",
                    "Update privacy policies annually"
                ],
                'next_review_date': (datetime.now() + timedelta(days=90)).isoformat()
            }
            
            self.status = "active"
            self.last_action = "Compliance report generated successfully"
            
            return report
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error generating compliance report: {str(e)}"
            return {'error': str(e)}
    
    def validate_consent_status(self, child_id: str, parent_id: str) -> Dict[str, Any]:
        """
        Validate parental consent status for data processing
        """
        self.status = "processing"
        self.last_action = "Validating consent status"
        
        try:
            # In a real implementation, this would check consent database
            consent_status = {
                'child_id': self._hash_identifier(child_id),
                'parent_id': self._hash_identifier(parent_id),
                'consent_given': True,
                'consent_date': '2024-01-15T10:00:00Z',
                'consent_version': '2.1',
                'consent_scope': [
                    'speech_therapy_sessions',
                    'progress_tracking',
                    'ai_analysis',
                    'anonymized_research'
                ],
                'consent_expiry': '2025-01-15T10:00:00Z',
                'withdrawal_rights_acknowledged': True,
                'data_portability_rights_acknowledged': True
            }
            
            # Check if consent is still valid
            consent_expiry = datetime.fromisoformat(consent_status['consent_expiry'].replace('Z', '+00:00'))
            consent_valid = datetime.now() < consent_expiry
            
            self.status = "active"
            self.last_action = f"Consent validation: {'VALID' if consent_valid else 'EXPIRED'}"
            
            return {
                'consent_valid': consent_valid,
                'consent_details': consent_status,
                'actions_required': [] if consent_valid else ['Renew parental consent'],
                'data_processing_allowed': consent_valid
            }
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error validating consent: {str(e)}"
            return {'consent_valid': False, 'error': str(e)}
    
    def _check_session_duration(self, session_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check if session duration is within safe limits"""
        
        start_time = session_data.get('start_time')
        end_time = session_data.get('end_time')
        
        if not start_time or not end_time:
            return {
                'check_name': 'session_duration',
                'passed': True,
                'message': 'Session in progress - duration check pending'
            }
        
        if isinstance(start_time, str):
            start_time = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
        if isinstance(end_time, str):
            end_time = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
        
        duration_minutes = (end_time - start_time).total_seconds() / 60
        
        passed = duration_minutes <= self.safety_thresholds['max_session_duration']
        
        return {
            'check_name': 'session_duration',
            'passed': passed,
            'duration_minutes': round(duration_minutes, 1),
            'threshold': self.safety_thresholds['max_session_duration'],
            'message': f"Session duration: {duration_minutes:.1f} minutes" + 
                      ("" if passed else f" (exceeds {self.safety_thresholds['max_session_duration']} minute limit)")
        }
    
    def _check_daily_frequency(self, recent_sessions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Check daily session frequency"""
        
        today = datetime.now().date()
        today_sessions = 0
        
        for session in recent_sessions:
            session_date = session.get('start_time')
            if isinstance(session_date, str):
                session_date = datetime.fromisoformat(session_date.replace('Z', '+00:00')).date()
            
            if session_date == today:
                today_sessions += 1
        
        passed = today_sessions <= self.safety_thresholds['max_daily_sessions']
        
        return {
            'check_name': 'daily_frequency',
            'passed': passed,
            'sessions_today': today_sessions,
            'threshold': self.safety_thresholds['max_daily_sessions'],
            'message': f"{today_sessions} sessions today" + 
                      ("" if passed else f" (exceeds {self.safety_thresholds['max_daily_sessions']} session limit)")
        }
    
    def _check_performance_decline(self, child_profile: Dict[str, Any], session_data: Dict[str, Any], recent_sessions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Check for concerning performance decline"""
        
        if len(recent_sessions) < 3:
            return {
                'check_name': 'performance_decline',
                'passed': True,
                'message': 'Insufficient data for performance trend analysis'
            }
        
        # Calculate recent average accuracy
        recent_accuracies = []
        for session in recent_sessions[-3:]:
            for exercise in session.get('exercises', []):
                for attempt in exercise.get('attempts', []):
                    recent_accuracies.append(attempt.get('accuracy', 0))
        
        current_accuracies = []
        for exercise in session_data.get('exercises', []):
            for attempt in exercise.get('attempts', []):
                current_accuracies.append(attempt.get('accuracy', 0))
        
        if not recent_accuracies or not current_accuracies:
            return {
                'check_name': 'performance_decline',
                'passed': True,
                'message': 'Insufficient accuracy data'
            }
        
        recent_avg = sum(recent_accuracies) / len(recent_accuracies)
        current_avg = sum(current_accuracies) / len(current_accuracies)
        decline = recent_avg - current_avg
        
        passed = decline < self.safety_thresholds['accuracy_decline_threshold']
        
        return {
            'check_name': 'performance_decline',
            'passed': passed,
            'accuracy_decline': round(decline, 1),
            'threshold': self.safety_thresholds['accuracy_decline_threshold'],
            'message': f"Accuracy change: {decline:+.1f}%" + 
                      ("" if passed else " (significant decline detected)")
        }
    
    def _check_engagement_levels(self, session_data: Dict[str, Any], recent_sessions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Check engagement levels"""
        
        # Calculate current session engagement
        total_exercises = len(session_data.get('exercises', []))
        completed_exercises = len([ex for ex in session_data.get('exercises', []) if ex.get('completed', False)])
        
        if total_exercises == 0:
            return {
                'check_name': 'engagement_levels',
                'passed': True,
                'message': 'No exercises to evaluate'
            }
        
        current_engagement = (completed_exercises / total_exercises) * 100
        
        # Compare with recent sessions
        if recent_sessions:
            recent_engagements = []
            for session in recent_sessions[-5:]:
                session_total = len(session.get('exercises', []))
                session_completed = len([ex for ex in session.get('exercises', []) if ex.get('completed', False)])
                if session_total > 0:
                    recent_engagements.append((session_completed / session_total) * 100)
            
            if recent_engagements:
                recent_avg = sum(recent_engagements) / len(recent_engagements)
                engagement_drop = recent_avg - current_engagement
            else:
                engagement_drop = 0
        else:
            engagement_drop = 0
        
        passed = engagement_drop < self.safety_thresholds['engagement_drop_threshold']
        
        return {
            'check_name': 'engagement_levels',
            'passed': passed,
            'current_engagement': round(current_engagement, 1),
            'engagement_drop': round(engagement_drop, 1),
            'threshold': self.safety_thresholds['engagement_drop_threshold'],
            'message': f"Engagement: {current_engagement:.1f}%" + 
                      ("" if passed else f" (drop of {engagement_drop:.1f}%)")
        }
    
    def _check_age_appropriate_content(self, child_profile: Dict[str, Any], session_data: Dict[str, Any]) -> Dict[str, Any]:
        """Check if content is age-appropriate"""
        
        child_age = child_profile.get('age', 7)
        
        # Define age-appropriate difficulty levels
        age_difficulty_map = {
            (3, 5): 'beginner',
            (6, 8): ['beginner', 'intermediate'],
            (9, 12): ['beginner', 'intermediate', 'advanced'],
            (13, 18): ['intermediate', 'advanced']
        }
        
        appropriate_difficulties = []
        for age_range, difficulties in age_difficulty_map.items():
            if age_range[0] <= child_age <= age_range[1]:
                if isinstance(difficulties, list):
                    appropriate_difficulties.extend(difficulties)
                else:
                    appropriate_difficulties.append(difficulties)
                break
        
        # Check exercise difficulties
        inappropriate_exercises = []
        for exercise in session_data.get('exercises', []):
            exercise_difficulty = exercise.get('difficulty', 1)
            # Convert numeric difficulty to level
            if exercise_difficulty <= 2:
                difficulty_level = 'beginner'
            elif exercise_difficulty <= 3:
                difficulty_level = 'intermediate'
            else:
                difficulty_level = 'advanced'
            
            if difficulty_level not in appropriate_difficulties:
                inappropriate_exercises.append(exercise.get('id', 'unknown'))
        
        passed = len(inappropriate_exercises) == 0
        
        return {
            'check_name': 'age_appropriate_content',
            'passed': passed,
            'child_age': child_age,
            'appropriate_difficulties': appropriate_difficulties,
            'inappropriate_exercises': inappropriate_exercises,
            'message': f"Content appropriate for age {child_age}" + 
                      ("" if passed else f" ({len(inappropriate_exercises)} exercises may be too difficult)")
        }
    
    def _check_data_minimization(self, data_request: Dict[str, Any]) -> Dict[str, Any]:
        """Check data minimization principle"""
        
        requested_fields = data_request.get('fields', [])
        purpose = data_request.get('purpose', '')
        
        # Define necessary fields for different purposes
        necessary_fields = {
            'therapy_session': ['child_id', 'exercises', 'attempts', 'accuracy'],
            'progress_report': ['child_id', 'session_history', 'accuracy_trends'],
            'research': ['anonymized_data', 'accuracy_scores', 'demographics']
        }
        
        required_fields = necessary_fields.get(purpose, [])
        unnecessary_fields = [field for field in requested_fields if field not in required_fields]
        
        compliant = len(unnecessary_fields) == 0
        
        return {
            'check_name': 'data_minimization',
            'compliant': compliant,
            'unnecessary_fields': unnecessary_fields,
            'message': 'Data request follows minimization principle' if compliant else f'Unnecessary fields: {unnecessary_fields}'
        }
    
    def _check_purpose_limitation(self, data_request: Dict[str, Any]) -> Dict[str, Any]:
        """Check purpose limitation principle"""
        
        stated_purpose = data_request.get('purpose', '')
        allowed_purposes = [
            'therapy_session',
            'progress_report', 
            'research',
            'clinical_review',
            'parent_dashboard'
        ]
        
        compliant = stated_purpose in allowed_purposes
        
        return {
            'check_name': 'purpose_limitation',
            'compliant': compliant,
            'stated_purpose': stated_purpose,
            'message': 'Purpose is within allowed scope' if compliant else f'Purpose "{stated_purpose}" not allowed'
        }
    
    def _check_consent_requirements(self, data_request: Dict[str, Any]) -> Dict[str, Any]:
        """Check consent requirements"""
        
        # In a real implementation, this would verify actual consent
        consent_verified = data_request.get('consent_verified', False)
        
        return {
            'check_name': 'consent_requirements',
            'compliant': consent_verified,
            'message': 'Consent verified' if consent_verified else 'Consent verification required'
        }
    
    def _check_retention_limits(self, data_request: Dict[str, Any]) -> Dict[str, Any]:
        """Check data retention limits"""
        
        data_age_days = data_request.get('data_age_days', 0)
        compliant = data_age_days <= self.data_retention_days
        
        return {
            'check_name': 'retention_limits',
            'compliant': compliant,
            'data_age_days': data_age_days,
            'retention_limit': self.data_retention_days,
            'message': 'Data within retention period' if compliant else 'Data exceeds retention limit'
        }
    
    def _check_access_controls(self, data_request: Dict[str, Any]) -> Dict[str, Any]:
        """Check access control requirements"""
        
        user_role = data_request.get('user_role', '')
        requested_data_type = data_request.get('data_type', '')
        
        # Define role-based access permissions
        role_permissions = {
            'parent': ['child_progress', 'session_summaries'],
            'therapist': ['child_progress', 'session_details', 'clinical_notes'],
            'researcher': ['anonymized_data'],
            'admin': ['all_data']
        }
        
        allowed_data_types = role_permissions.get(user_role, [])
        compliant = requested_data_type in allowed_data_types or 'all_data' in allowed_data_types
        
        return {
            'check_name': 'access_controls',
            'compliant': compliant,
            'user_role': user_role,
            'requested_data_type': requested_data_type,
            'message': 'Access authorized for role' if compliant else f'Role "{user_role}" not authorized for "{requested_data_type}"'
        }
    
    def _generate_privacy_recommendations(self, compliance_checks: List[Dict[str, Any]]) -> List[str]:
        """Generate privacy compliance recommendations"""
        
        recommendations = []
        
        for check in compliance_checks:
            if not check.get('compliant', True):
                check_name = check.get('check_name', 'unknown')
                
                if check_name == 'data_minimization':
                    recommendations.append("Remove unnecessary data fields from request")
                elif check_name == 'purpose_limitation':
                    recommendations.append("Specify valid purpose for data access")
                elif check_name == 'consent_requirements':
                    recommendations.append("Obtain and verify parental consent")
                elif check_name == 'retention_limits':
                    recommendations.append("Archive or delete data exceeding retention period")
                elif check_name == 'access_controls':
                    recommendations.append("Request data access through authorized role")
        
        if not recommendations:
            recommendations.append("All privacy requirements met")
        
        return recommendations
    
    def _generate_audit_id(self) -> str:
        """Generate unique audit ID"""
        timestamp = datetime.now().isoformat()
        return hashlib.sha256(timestamp.encode()).hexdigest()[:16]
    
    def _hash_identifier(self, identifier: str) -> str:
        """Hash sensitive identifiers for audit trail"""
        return hashlib.sha256(identifier.encode()).hexdigest()[:16]
    
    def _get_masked_ip(self) -> str:
        """Get masked IP address for audit"""
        # In real implementation, would get actual IP and mask last octet
        return "192.168.1.xxx"
    
    def _generate_session_id(self) -> str:
        """Generate session ID for audit"""
        return hashlib.sha256(datetime.now().isoformat().encode()).hexdigest()[:12]
    
    def _check_compliance_flags(self, action: str, data_accessed: List[str]) -> List[str]:
        """Check for compliance flags"""
        
        flags = []
        
        # Flag sensitive data access
        sensitive_data = ['audio_recordings', 'personal_info', 'medical_history']
        if any(data in data_accessed for data in sensitive_data):
            flags.append('sensitive_data_access')
        
        # Flag bulk data operations
        if len(data_accessed) > 10:
            flags.append('bulk_data_operation')
        
        # Flag administrative actions
        admin_actions = ['delete', 'export', 'modify_permissions']
        if action in admin_actions:
            flags.append('administrative_action')
        
        return flags
    
    def _validate_audit_entry(self, audit_entry: Dict[str, Any]) -> Dict[str, Any]:
        """Validate audit entry completeness"""
        
        required_fields = ['audit_id', 'timestamp', 'user_id', 'action']
        missing_fields = [field for field in required_fields if not audit_entry.get(field)]
        
        valid = len(missing_fields) == 0
        
        return {
            'valid': valid,
            'missing_fields': missing_fields,
            'completeness_score': ((len(required_fields) - len(missing_fields)) / len(required_fields)) * 100
        }
    
    def _get_fallback_safety_report(self) -> Dict[str, Any]:
        """Fallback safety report when errors occur"""
        
        return {
            'overall_status': 'unknown',
            'safety_score': 0.0,
            'checks_performed': 0,
            'checks_passed': 0,
            'warnings': ['Unable to perform safety validation'],
            'recommendations': ['Manual safety review required'],
            'detailed_checks': [],
            'timestamp': datetime.now().isoformat()
        }