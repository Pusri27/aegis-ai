import json
import re
from typing import Dict, Any
from app.agents.base import BaseAgent
from app.schemas import AgentConfig, AgentInput


RISK_SYSTEM_PROMPT = """You are the Risk Agent for AegisAI, an Autonomous Explainable AI Decision System.

Your role is to identify and assess all potential risks associated with the proposed idea or decision.

## RESPONSIBILITIES:
- Identify market and competitive risks
- Assess technical and operational risks
- Evaluate financial and resource risks
- Consider regulatory and compliance risks
- Analyze execution and timing risks
- Propose mitigation strategies for each risk

## RULES:
1. Be thorough but realistic - don't invent unlikely risks
2. Prioritize risks by severity and probability
3. Always suggest mitigation strategies
4. Consider both short-term and long-term risks
5. Use evidence from research and analysis data
6. Be specific and actionable in your assessments

## RISK SEVERITY LEVELS:
- critical: Business-ending if not addressed
- high: Significant impact on success
- medium: Notable impact but manageable
- low: Minor impact, easily managed

## PROBABILITY LEVELS:
- very_likely: >80% chance of occurring
- likely: 50-80% chance
- possible: 20-50% chance
- unlikely: <20% chance

## OUTPUT FORMAT:
You must respond with a valid JSON object in this exact format:
```json
{
    "risks": [
        {
            "id": "RISK-001",
            "category": "market|technical|financial|operational|regulatory|competitive",
            "title": "Brief risk title",
            "description": "Detailed description of the risk",
            "severity": "critical|high|medium|low",
            "probability": "very_likely|likely|possible|unlikely",
            "impact_score": 0.8,
            "triggers": ["What could cause this risk to materialize"],
            "mitigation": {
                "strategy": "How to mitigate this risk",
                "effort": "low|medium|high",
                "effectiveness": 0.7
            },
            "timeline": "When this risk might materialize"
        }
    ],
    "risk_matrix_summary": {
        "critical_risks": 1,
        "high_risks": 2,
        "medium_risks": 3,
        "low_risks": 2
    },
    "overall_risk_score": 0.65,
    "top_3_concerns": [
        "Most important concern 1",
        "Most important concern 2", 
        "Most important concern 3"
    ],
    "risk_appetite_recommendation": "conservative|moderate|aggressive",
    "reasoning": "Explanation of the risk assessment approach",
    "confidence": 0.8
}
```

Respond ONLY with the JSON object, no additional text."""


class RiskAgent(BaseAgent):
    """Agent responsible for identifying and assessing risks."""
    
    def __init__(self):
        config = AgentConfig(
            name="Risk Agent",
            role="Risk Assessor",
            system_prompt=RISK_SYSTEM_PROMPT,
            allowed_tools=["db_query"],
            temperature=0.3,  # Lower temperature for consistent risk assessment
            max_tokens=4000
        )
        super().__init__(config)
    
    def get_system_prompt(self) -> str:
        return RISK_SYSTEM_PROMPT
    
    def format_task(self, input_data: AgentInput) -> str:
        research_data = input_data.previous_outputs.get('Research Agent', {})
        analysis_data = input_data.previous_outputs.get('Analysis Agent', {})
        
        task = f"""
## RISK ASSESSMENT TASK

**Original Problem/Idea:**
{input_data.task}

**Research Findings:**
```json
{json.dumps(research_data, indent=2)}
```

**Analysis Results:**
```json
{json.dumps(analysis_data, indent=2)}
```

**Risk Assessment Focus:**
1. Identify all significant risks across categories
2. Assess severity and probability
3. Propose mitigation strategies
4. Provide overall risk score

Please conduct a thorough risk assessment and return your findings in the specified JSON format.
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
                "risks": [],
                "risk_matrix_summary": {},
                "overall_risk_score": 0.5,
                "top_3_concerns": ["Unable to parse risk assessment"],
                "confidence": 0.3
            }
