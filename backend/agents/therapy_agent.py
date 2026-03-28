import openai
import os
from typing import Dict, List, Any
from datetime import datetime
import json
import random

class TherapyPlannerAgent:
    """
    AI Agent responsible for generating personalized therapy sessions
    and exercise recommendations based on child's profile and progress.
    """
    
    def __init__(self):
        self.name = "Therapy Planner Agent"
        self.status = "active"
        self.last_action = "Initialized therapy planning system"
        self.confidence = 0.95
        
        # Initialize OpenAI client if API key is available
        self.openai_client = None
        if os.getenv("OPENAI_API_KEY"):
            openai.api_key = os.getenv("OPENAI_API_KEY")
            self.openai_client = openai
    
    def get_status(self) -> str:
        return self.status
    
    def get_last_action(self) -> str:
        return self.last_action
    
    def get_confidence(self) -> float:
        return self.confidence
    
    def generate_exercise(self, child_profile: Dict[str, Any], session_history: List[Dict] = None) -> Dict[str, Any]:
        """
        Generate a personalized exercise based on child's profile and history
        """
        self.status = "processing"
        self.last_action = f"Generating exercise for {child_profile.get('name', 'child')}"
        
        try:
            # Use AI to generate exercise if OpenAI is available, otherwise use rule-based approach
            if self.openai_client:
                exercise = self._generate_ai_exercise(child_profile, session_history)
            else:
                exercise = self._generate_rule_based_exercise(child_profile, session_history)
            
            self.status = "active"
            self.last_action = f"Generated {exercise['type']} exercise for /{exercise['target_sound']}/ sound"
            self.confidence = exercise.get('confidence', 0.85)
            
            return exercise
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error generating exercise: {str(e)}"
            self.confidence = 0.0
            
            # Fallback to simple exercise
            return self._get_fallback_exercise(child_profile)
    
    def _generate_ai_exercise(self, child_profile: Dict[str, Any], session_history: List[Dict] = None) -> Dict[str, Any]:
        """Generate exercise using OpenAI GPT"""
        
        prompt = self._build_exercise_prompt(child_profile, session_history)
        
        try:
            response = self.openai_client.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a specialized speech therapy AI that creates personalized exercises for autistic children. Focus on clear, encouraging, and age-appropriate prompts."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.7
            )
            
            # Parse AI response into structured exercise
            ai_content = response.choices[0].message.content
            return self._parse_ai_exercise_response(ai_content, child_profile)
            
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return self._generate_rule_based_exercise(child_profile, session_history)
    
    def _generate_rule_based_exercise(self, child_profile: Dict[str, Any], session_history: List[Dict] = None) -> Dict[str, Any]:
        """Generate exercise using rule-based logic"""
        
        target_phonemes = child_profile.get('target_phonemes', ['r', 's'])
        difficulty_level = child_profile.get('difficulty_level', 'beginner')
        age = child_profile.get('age', 7)
        
        # Select target phoneme (rotate through target phonemes)
        target_phoneme = random.choice(target_phonemes)
        
        # Exercise templates by difficulty and phoneme
        exercise_templates = {
            'beginner': {
                'r': [
                    "Say 'red' slowly and clearly",
                    "Practice 'car' - make the 'r' sound strong",
                    "Try 'run' - focus on the beginning sound"
                ],
                's': [
                    "Say 'sun' with a clear 's' sound", 
                    "Practice 'snake' - make the 's' sound long",
                    "Try 'house' - focus on the 's' at the end"
                ]
            },
            'intermediate': {
                'r': [
                    "Say 'rainbow' with clear 'r' sounds",
                    "Practice 'strawberry' - focus on both 'r' sounds",
                    "Try 'refrigerator' slowly"
                ],
                's': [
                    "Say 'sunshine' clearly",
                    "Practice 'grasshopper' - focus on the 's' sounds", 
                    "Try 'Mississippi' slowly"
                ]
            },
            'advanced': {
                'r': [
                    "Say this sentence: 'Red roses grow in the garden'",
                    "Practice: 'The rabbit ran around the tree'",
                    "Try: 'Robert's brother brought bread'"
                ],
                's': [
                    "Say this sentence: 'Seven snakes slithered slowly'",
                    "Practice: 'Susan sells seashells by the seashore'",
                    "Try: 'The students studied science seriously'"
                ]
            }
        }
        
        # Get appropriate template
        templates = exercise_templates.get(difficulty_level, exercise_templates['beginner'])
        phoneme_templates = templates.get(target_phoneme, templates['r'])
        
        prompt = random.choice(phoneme_templates)
        
        # Determine exercise type based on difficulty
        if difficulty_level == 'beginner':
            exercise_type = 'phoneme'
        elif difficulty_level == 'intermediate':
            exercise_type = 'word'
        else:
            exercise_type = 'sentence'
        
        return {
            'id': f"ex_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'type': exercise_type,
            'prompt': prompt,
            'target_sound': target_phoneme,
            'difficulty': self._get_difficulty_score(difficulty_level),
            'confidence': 0.85,
            'generated_by': 'rule_based_agent'
        }
    
    def _build_exercise_prompt(self, child_profile: Dict[str, Any], session_history: List[Dict] = None) -> str:
        """Build prompt for AI exercise generation"""
        
        name = child_profile.get('name', 'the child')
        age = child_profile.get('age', 7)
        difficulty = child_profile.get('difficulty_level', 'beginner')
        target_phonemes = child_profile.get('target_phonemes', ['r', 's'])
        
        prompt = f"""
        Create a speech therapy exercise for {name}, age {age}, at {difficulty} level.
        
        Target phonemes: {', '.join(target_phonemes)}
        
        Requirements:
        - Age-appropriate and encouraging
        - Clear, simple instructions
        - Focus on one target phoneme
        - Suitable for autistic children (calm, structured)
        
        Please provide:
        1. Exercise type (phoneme/word/sentence)
        2. Clear prompt/instruction
        3. Target phoneme
        4. Difficulty level (1-5)
        
        Format as JSON with keys: type, prompt, target_sound, difficulty
        """
        
        return prompt
    
    def _parse_ai_exercise_response(self, ai_content: str, child_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Parse AI response into structured exercise"""
        
        try:
            # Try to extract JSON from AI response
            import re
            json_match = re.search(r'\{.*\}', ai_content, re.DOTALL)
            if json_match:
                exercise_data = json.loads(json_match.group())
                exercise_data['id'] = f"ex_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                exercise_data['confidence'] = 0.90
                exercise_data['generated_by'] = 'ai_agent'
                return exercise_data
        except:
            pass
        
        # Fallback parsing if JSON extraction fails
        return self._generate_rule_based_exercise(child_profile)
    
    def _get_fallback_exercise(self, child_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Simple fallback exercise"""
        return {
            'id': f"ex_fallback_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            'type': 'phoneme',
            'prompt': 'Say "hello" clearly',
            'target_sound': 'h',
            'difficulty': 1,
            'confidence': 0.50,
            'generated_by': 'fallback'
        }
    
    def _get_difficulty_score(self, difficulty_level: str) -> int:
        """Convert difficulty level to numeric score"""
        mapping = {
            'beginner': 2,
            'intermediate': 3, 
            'advanced': 4
        }
        return mapping.get(difficulty_level, 2)
    
    def analyze_session_needs(self, child_profile: Dict[str, Any], recent_sessions: List[Dict] = None) -> Dict[str, Any]:
        """Analyze what the child needs to work on next"""
        
        self.status = "processing"
        self.last_action = "Analyzing session needs and recommendations"
        
        try:
            # Analyze recent performance
            recommendations = []
            focus_areas = []
            
            if recent_sessions:
                # Analyze accuracy trends
                recent_accuracy = [s.get('overall_score', 0) for s in recent_sessions[-5:]]
                avg_accuracy = sum(recent_accuracy) / len(recent_accuracy) if recent_accuracy else 0
                
                if avg_accuracy < 70:
                    recommendations.append("Focus on foundational phoneme practice")
                    focus_areas.append("accuracy_improvement")
                elif avg_accuracy > 85:
                    recommendations.append("Ready for more challenging exercises")
                    focus_areas.append("difficulty_increase")
                else:
                    recommendations.append("Continue current difficulty level")
                    focus_areas.append("consistency_building")
            
            # Check target phonemes that need work
            target_phonemes = child_profile.get('target_phonemes', ['r', 's'])
            for phoneme in target_phonemes:
                recommendations.append(f"Continue practicing /{phoneme}/ sound")
                focus_areas.append(f"phoneme_{phoneme}")
            
            self.status = "active"
            self.last_action = f"Generated {len(recommendations)} recommendations"
            
            return {
                'recommendations': recommendations,
                'focus_areas': focus_areas,
                'suggested_session_length': child_profile.get('preferences', {}).get('session_length', 15),
                'confidence': 0.88
            }
            
        except Exception as e:
            self.status = "error"
            self.last_action = f"Error analyzing session needs: {str(e)}"
            return {
                'recommendations': ["Continue regular practice"],
                'focus_areas': ["general_practice"],
                'suggested_session_length': 15,
                'confidence': 0.50
            }