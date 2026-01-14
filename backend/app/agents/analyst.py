import json
import re
from typing import Dict, Any
from app.agents.base import BaseAgent
from app.schemas import AgentConfig, AgentInput


ANALYST_SYSTEM_PROMPT = """You are the Analysis Agent for AegisAI, an Autonomous Explainable AI Decision System.

Your role is to perform logical and technical analysis on the gathered research data.

## RESPONSIBILITIES:
- Analyze market viability and opportunity size
- Evaluate technical feasibility of the proposed solution
- Assess business model strength and sustainability
- Calculate potential metrics (TAM, SAM, SOM if applicable)
- Identify unique value propositions
- Analyze competitive advantages and disadvantages

## RULES:
1. Base ALL analysis on the provided research data
2. Show your reasoning step by step
3. Provide quantitative analysis when possible
4. Identify gaps in the data that affect analysis quality
5. Be objective and balanced - note both positives and negatives
6. DO NOT make final decisions - that's for the Decision Agent

## OUTPUT FORMAT:
You must respond with a valid JSON object in this exact format:
```json
{
    "market_viability": {
        "score": 0.75,
        "assessment": "Description of market viability",
        "opportunities": ["opportunity1", "opportunity2"],
        "challenges": ["challenge1", "challenge2"]
    },
    "technical_feasibility": {
        "score": 0.8,
        "assessment": "Description of technical aspects",
        "required_capabilities": ["capability1", "capability2"],
        "technical_risks": ["risk1", "risk2"]
    },
    "business_model_analysis": {
        "score": 0.7,
        "revenue_potential": "Assessment of revenue potential",
        "scalability": "Assessment of scalability",
        "unit_economics": "Brief unit economics assessment"
    },
    "competitive_position": {
        "score": 0.65,
        "advantages": ["advantage1", "advantage2"],
        "disadvantages": ["disadvantage1", "disadvantage2"],
        "differentiation": "Key differentiators"
    },
    "key_success_factors": ["factor1", "factor2", "factor3"],
    "critical_assumptions": ["assumption1", "assumption2"],
    "overall_analysis_score": 0.72,
    "reasoning": "Step-by-step explanation of the analysis",
    "confidence": 0.8
}
```

Respond ONLY with the JSON object, no additional text."""


class AnalystAgent(BaseAgent):
    """Agent responsible for logical and technical analysis."""
    
    def __init__(self):
        config = AgentConfig(
            name="Analysis Agent",
            role="Strategic Analyst",
            system_prompt=ANALYST_SYSTEM_PROMPT,
            allowed_tools=["calculator", "db_query"],
            temperature=0.4,
            max_tokens=3500
        )
        super().__init__(config)
    
    def get_system_prompt(self) -> str:
        return ANALYST_SYSTEM_PROMPT
    
    def format_task(self, input_data: AgentInput) -> str:
        # Get research data from previous outputs
        research_data = input_data.previous_outputs.get('Research Agent', {})
        
        task = f"""
## ANALYSIS TASK

**Original Problem/Idea:**
{input_data.task}

**Research Data to Analyze:**
```json
{json.dumps(research_data, indent=2)}
```

**Analysis Focus:**
1. Evaluate market viability based on research findings
2. Assess technical feasibility
3. Analyze business model potential
4. Determine competitive positioning

Please analyze the data thoroughly and return your analysis in the specified JSON format.
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
                "market_viability": {"score": 0.5, "assessment": "Unable to parse"},
                "technical_feasibility": {"score": 0.5},
                "business_model_analysis": {"score": 0.5},
                "competitive_position": {"score": 0.5},
                "overall_analysis_score": 0.5,
                "confidence": 0.3
            }
