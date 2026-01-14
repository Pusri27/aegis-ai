import json
import re
from typing import Dict, Any
from app.agents.base import BaseAgent
from app.schemas import AgentConfig, AgentInput


RESEARCH_SYSTEM_PROMPT = """You are the Research Agent for AegisAI, an Autonomous Explainable AI Decision System.

Your role is to gather factual, relevant data about the given business problem or startup idea.

## RESPONSIBILITIES:
- Search for and synthesize market data and trends
- Identify key competitors and their strategies
- Gather relevant industry statistics
- Find case studies or similar businesses
- Identify target market characteristics

## RULES:
1. Only provide FACTUAL, verifiable information
2. Clearly indicate when information is estimated vs confirmed
3. DO NOT make conclusions or recommendations - that's for other agents
4. Focus purely on data gathering and organization
5. Be thorough but concise

## OUTPUT FORMAT:
You must respond with a valid JSON object in this exact format:
```json
{
    "market_overview": {
        "market_size": "Description of market size and growth",
        "growth_rate": "Annual growth rate if available",
        "key_trends": ["trend1", "trend2", "trend3"]
    },
    "competitors": [
        {
            "name": "Competitor name",
            "description": "Brief description",
            "strengths": ["strength1", "strength2"],
            "weaknesses": ["weakness1", "weakness2"]
        }
    ],
    "target_market": {
        "demographics": "Target demographic description",
        "pain_points": ["pain1", "pain2"],
        "buying_behavior": "Description of buying behavior"
    },
    "industry_insights": ["insight1", "insight2", "insight3"],
    "data_sources": ["source1", "source2"],
    "confidence": 0.8,
    "data_gaps": ["What information is missing or uncertain"]
}
```

Respond ONLY with the JSON object, no additional text."""


class ResearchAgent(BaseAgent):
    """Agent responsible for gathering factual data about the problem."""
    
    def __init__(self):
        config = AgentConfig(
            name="Research Agent",
            role="Data Gatherer",
            system_prompt=RESEARCH_SYSTEM_PROMPT,
            allowed_tools=["web_search", "db_query"],
            temperature=0.3,  # Lower temperature for factual responses
            max_tokens=3000
        )
        super().__init__(config)
    
    def get_system_prompt(self) -> str:
        return RESEARCH_SYSTEM_PROMPT
    
    def format_task(self, input_data: AgentInput) -> str:
        task = f"""
## RESEARCH TASK

**Problem/Idea to Research:**
{input_data.task}

**Additional Context:**
{input_data.context.get('additional_info', 'None provided')}

**Focus Areas:**
1. Market size and potential
2. Existing competitors
3. Target audience characteristics
4. Industry trends and dynamics

Please gather comprehensive data on the above and return your findings in the specified JSON format.
"""
        return task
    
    def parse_response(self, response: str) -> Dict[str, Any]:
        """Parse the JSON response from the LLM."""
        try:
            # Try to extract JSON from the response
            json_match = re.search(r'\{[\s\S]*\}', response)
            if json_match:
                return json.loads(json_match.group())
            
            # If no JSON found, try parsing the whole response
            return json.loads(response)
        except json.JSONDecodeError:
            # Return a structured error response
            return {
                "error": "Failed to parse response",
                "raw_response": response[:500],
                "market_overview": {"market_size": "Unable to parse", "key_trends": []},
                "competitors": [],
                "target_market": {},
                "industry_insights": [],
                "confidence": 0.3
            }
