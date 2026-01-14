import logging
from typing import Dict, Any, List
from datetime import datetime
from uuid import UUID
from app.schemas import AgentStep

logger = logging.getLogger(__name__)


class ReasoningLogger:
    """
    Logs reasoning steps for explainable AI.
    Provides a transparent record of how decisions were made.
    """
    
    def __init__(self, analysis_id: UUID):
        self.analysis_id = analysis_id
        self.steps: List[AgentStep] = []
        self.timeline: List[Dict[str, Any]] = []
    
    def log_step(self, step: AgentStep) -> None:
        """Log a reasoning step."""
        self.steps.append(step)
        
        # Create timeline entry
        timeline_entry = {
            "timestamp": step.timestamp.isoformat(),
            "agent": step.agent_name,
            "step_number": step.step_number,
            "action": step.action,
            "summary": step.output_summary,
            "confidence": step.confidence,
            "duration_ms": step.duration_ms
        }
        self.timeline.append(timeline_entry)
        
        logger.info(
            f"[{self.analysis_id}] Step {step.step_number}: "
            f"{step.agent_name} - {step.action} "
            f"(confidence: {step.confidence:.2f}, {step.duration_ms}ms)"
        )
    
    def get_timeline(self) -> List[Dict[str, Any]]:
        """Get the reasoning timeline."""
        return self.timeline
    
    def get_explanation(self) -> Dict[str, Any]:
        """Generate a human-readable explanation of the reasoning process."""
        if not self.steps:
            return {"message": "No reasoning steps recorded"}
        
        explanation = {
            "total_steps": len(self.steps),
            "agents_involved": list(set(s.agent_name for s in self.steps)),
            "total_duration_ms": sum(s.duration_ms for s in self.steps),
            "average_confidence": sum(s.confidence for s in self.steps) / len(self.steps),
            "narrative": self._generate_narrative(),
            "key_decisions": self._extract_key_decisions(),
            "tools_used": self._get_all_tools_used()
        }
        
        return explanation
    
    def _generate_narrative(self) -> str:
        """Generate a narrative explanation of the process."""
        if not self.steps:
            return "No analysis performed."
        
        narratives = []
        
        for step in self.steps:
            if "Research" in step.agent_name:
                narratives.append(
                    f"First, we gathered information about the problem. {step.output_summary}"
                )
            elif "Analysis" in step.agent_name:
                narratives.append(
                    f"Next, we analyzed the data to evaluate viability. {step.output_summary}"
                )
            elif "Risk" in step.agent_name:
                narratives.append(
                    f"We then assessed potential risks. {step.output_summary}"
                )
            elif "Decision" in step.agent_name:
                narratives.append(
                    f"Finally, we synthesized everything to reach a decision. {step.output_summary}"
                )
        
        return " ".join(narratives)
    
    def _extract_key_decisions(self) -> List[Dict[str, Any]]:
        """Extract key decision points from the steps."""
        key_decisions = []
        
        for step in self.steps:
            if step.confidence >= 0.7:
                key_decisions.append({
                    "agent": step.agent_name,
                    "action": step.action,
                    "outcome": step.output_summary,
                    "confidence": step.confidence
                })
        
        return key_decisions
    
    def _get_all_tools_used(self) -> List[str]:
        """Get list of all tools used across all steps."""
        all_tools = []
        for step in self.steps:
            all_tools.extend(step.tools_used)
        return list(set(all_tools))


class ExplanationGenerator:
    """Generates user-friendly explanations from analysis results."""
    
    @staticmethod
    def generate_decision_explanation(
        decision_result: Dict[str, Any],
        reasoning_steps: List[AgentStep]
    ) -> Dict[str, Any]:
        """Generate a comprehensive explanation of the decision."""
        
        verdict = decision_result.get('verdict', 'UNKNOWN')
        confidence = decision_result.get('confidence', 0)
        
        # Determine explanation tone based on verdict
        if verdict == "GO":
            sentiment = "positive"
            emoji = "✅"
            header = "Recommendation: Proceed"
        elif verdict == "NO-GO":
            sentiment = "negative"
            emoji = "❌"
            header = "Recommendation: Do Not Proceed"
        else:
            sentiment = "neutral"
            emoji = "⚠️"
            header = "Recommendation: Proceed with Conditions"
        
        # Build explanation
        explanation = {
            "emoji": emoji,
            "header": header,
            "sentiment": sentiment,
            "confidence_level": ExplanationGenerator._confidence_to_text(confidence),
            "confidence_percentage": f"{confidence * 100:.0f}%",
            "summary": decision_result.get('summary', ''),
            "main_reasons": [],
            "concerns": [],
            "next_actions": decision_result.get('next_steps', []),
            "timeline": []
        }
        
        # Extract main reasons (positive factors)
        for factor in decision_result.get('key_factors', []):
            if isinstance(factor, dict):
                if factor.get('impact') == 'positive':
                    explanation['main_reasons'].append(factor.get('factor', ''))
                elif factor.get('impact') == 'negative':
                    explanation['concerns'].append(factor.get('factor', ''))
        
        # Build reasoning timeline
        for step in reasoning_steps:
            explanation['timeline'].append({
                "agent": step.agent_name.replace(" Agent", ""),
                "action": step.output_summary,
                "confidence": f"{step.confidence * 100:.0f}%"
            })
        
        return explanation
    
    @staticmethod
    def _confidence_to_text(confidence: float) -> str:
        """Convert confidence score to human-readable text."""
        if confidence >= 0.9:
            return "Very High"
        elif confidence >= 0.75:
            return "High"
        elif confidence >= 0.6:
            return "Moderate"
        elif confidence >= 0.4:
            return "Low"
        else:
            return "Very Low"
