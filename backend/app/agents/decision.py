import json
import re
from typing import Dict, Any
from app.agents.base import BaseAgent
from app.schemas import AgentConfig, AgentInput


DECISION_SYSTEM_PROMPT = """You are the Decision Agent for AegisAI, an Autonomous Explainable AI Decision System.

Your role is to synthesize ALL information from other agents and make the FINAL decision with clear reasoning.

## RESPONSIBILITIES:
- Review and weigh all agent outputs
- Make a clear, actionable decision
- Provide detailed explanation for your decision
- Identify key factors that influenced the decision
- Suggest concrete next steps
- Assign an overall confidence score

## DECISION OPTIONS:
- **GO**: Proceed with the idea/decision - benefits outweigh risks
- **NO-GO**: Do not proceed - risks/challenges too significant
- **CONDITIONAL**: Proceed only if certain conditions are met

## RULES:
1. Consider ALL aspects from research, analysis, and risk assessment
2. Be decisive but balanced in your reasoning
3. Explain your decision clearly for non-technical audiences
4. Weight factors appropriately based on importance
5. Be honest about uncertainties
6. Provide actionable recommendations regardless of decision

## OUTPUT FORMAT:
You must respond with a valid JSON object in this exact format:
```json
{
    "verdict": "GO|NO-GO|CONDITIONAL",
    "verdict_confidence": 0.85,
    "summary": "One-paragraph executive summary of the decision",
    "detailed_reasoning": {
        "why_this_decision": "Detailed explanation of why this decision was made",
        "key_evidence": ["Evidence point 1", "Evidence point 2"],
        "trade_offs_considered": "What trade-offs were weighed"
    },
    "key_factors": [
        {
            "factor": "Factor description",
            "impact": "positive|negative|neutral",
            "weight": 0.9,
            "explanation": "Why this factor matters"
        }
    ],
    "risk_acknowledgment": {
        "accepted_risks": ["Risks we accept by proceeding"],
        "mitigated_risks": ["Risks addressed by conditions/recommendations"],
        "residual_risk_level": "low|medium|high"
    },
    "conditions": [
        "Condition 1 that must be met (for CONDITIONAL verdict)",
        "Condition 2"
    ],
    "recommendations": [
        {
            "priority": "high|medium|low",
            "action": "Recommended action",
            "rationale": "Why this is recommended",
            "timeline": "When to do this"
        }
    ],
    "next_steps": [
        "Immediate step 1",
        "Immediate step 2",
        "Immediate step 3"
    ],
    "success_metrics": [
        "How to measure success if proceeding"
    ],
    "review_timeline": "When to review this decision",
    "confidence": 0.82
}
```

Respond ONLY with the JSON object, no additional text."""


class DecisionAgent(BaseAgent):
    """Agent responsible for making the final decision."""
    
    def __init__(self):
        config = AgentConfig(
            name="Decision Agent",
            role="Decision Maker",
            system_prompt=DECISION_SYSTEM_PROMPT,
            allowed_tools=[],
            temperature=0.5,
            max_tokens=4000
        )
        super().__init__(config)
    
    def get_system_prompt(self) -> str:
        return DECISION_SYSTEM_PROMPT
    
    def format_task(self, input_data: AgentInput) -> str:
        research_data = input_data.previous_outputs.get('Research Agent', {})
        analysis_data = input_data.previous_outputs.get('Analysis Agent', {})
        risk_data = input_data.previous_outputs.get('Risk Agent', {})
        
        task = f"""
## DECISION TASK

**Original Problem/Idea:**
{input_data.task}

---

### RESEARCH FINDINGS (from Research Agent):
```json
{json.dumps(research_data, indent=2)}
```

---

### ANALYSIS RESULTS (from Analysis Agent):
```json
{json.dumps(analysis_data, indent=2)}
```

---

### RISK ASSESSMENT (from Risk Agent):
```json
{json.dumps(risk_data, indent=2)}
```

---

## YOUR TASK:
1. Synthesize all the above information
2. Weigh the pros and cons carefully
3. Make a clear GO, NO-GO, or CONDITIONAL decision
4. Explain your reasoning thoroughly
5. Provide actionable next steps

Make your decision and return it in the specified JSON format.
"""
        return task
    
    def parse_response(self, response: str) -> Dict[str, Any]:
        """Parse the JSON response from the LLM."""
        try:
            json_match = re.search(r'\{[\s\S]*\}', response)
            if json_match:
                return json.loads(json_match.group())
            return json.loads(response)
        except json.JSONDecodeError:
            return {
                "error": "Failed to parse response",
                "raw_response": response[:500],
                "verdict": "CONDITIONAL",
                "summary": "Unable to parse decision - manual review required",
                "key_factors": [],
                "recommendations": [],
                "next_steps": ["Review raw output manually"],
                "confidence": 0.3
            }
