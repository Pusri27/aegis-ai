from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage
import time
import logging
from app.config import get_settings
from app.schemas import AgentConfig, AgentInput, AgentOutput

logger = logging.getLogger(__name__)
settings = get_settings()


class BaseAgent(ABC):
    """Base class for all AegisAI agents."""
    
    def __init__(self, config: AgentConfig):
        self.config = config
        self.llm = ChatOpenAI(
            api_key=settings.OPENROUTER_API_KEY,
            model=settings.OPENROUTER_MODEL,
            base_url="https://openrouter.ai/api/v1",
            temperature=config.temperature,
            max_tokens=config.max_tokens,
            default_headers={
                "HTTP-Referer": "https://aegis-ai.vercel.app",
                "X-Title": "AegisAI Decision System",
            }
        )
        self.reasoning_log: List[Dict[str, Any]] = []
    
    @property
    def name(self) -> str:
        return self.config.name
    
    @property
    def role(self) -> str:
        return self.config.role
    
    @abstractmethod
    def get_system_prompt(self) -> str:
        """Return the system prompt for this agent."""
        pass
    
    @abstractmethod
    def format_task(self, input_data: AgentInput) -> str:
        """Format the task for the LLM."""
        pass
    
    @abstractmethod
    def parse_response(self, response: str) -> Dict[str, Any]:
        """Parse the LLM response into structured data."""
        pass
    
    async def execute(self, input_data: AgentInput) -> AgentOutput:
        """Execute the agent's task."""
        start_time = time.time()
        
        try:
            # Build messages
            messages = [
                SystemMessage(content=self.get_system_prompt()),
                HumanMessage(content=self.format_task(input_data))
            ]
            
            # Add memory context if available
            if input_data.memory_context:
                memory_msg = f"\n\n[RELEVANT PAST EXPERIENCES]\n{input_data.memory_context}"
                messages[1] = HumanMessage(content=self.format_task(input_data) + memory_msg)
            
            # Call LLM
            logger.info(f"Agent {self.name} executing task...")
            response = await self.llm.ainvoke(messages)
            
            # Parse response
            result = self.parse_response(response.content)
            
            # Calculate metrics
            duration_ms = int((time.time() - start_time) * 1000)
            tokens_used = response.response_metadata.get('token_usage', {}).get('total_tokens', 0)
            
            # Extract confidence from result
            confidence = result.get('confidence', 0.7)
            if isinstance(confidence, str):
                try:
                    confidence = float(confidence)
                except:
                    confidence = 0.7
            
            # Build reasoning summary
            reasoning = self._build_reasoning(result)
            
            output = AgentOutput(
                agent_name=self.name,
                result=result,
                reasoning=reasoning,
                confidence=min(max(confidence, 0), 1),  # Clamp between 0 and 1
                tools_used=[],
                tokens_used=tokens_used,
                duration_ms=duration_ms
            )
            
            logger.info(f"Agent {self.name} completed in {duration_ms}ms")
            return output
            
        except Exception as e:
            logger.error(f"Agent {self.name} failed: {str(e)}")
            duration_ms = int((time.time() - start_time) * 1000)
            
            return AgentOutput(
                agent_name=self.name,
                result={"error": str(e)},
                reasoning=f"Agent failed with error: {str(e)}",
                confidence=0.0,
                tools_used=[],
                tokens_used=0,
                duration_ms=duration_ms
            )
    
    def _build_reasoning(self, result: Dict[str, Any]) -> str:
        """Build a reasoning summary from the result."""
        reasoning_parts = []
        
        # Try to extract reasoning from various possible fields
        if 'reasoning' in result and result['reasoning'] and result['reasoning'] != "Analysis completed.":
            reasoning_parts.append(result['reasoning'])
        
        # Extract from detailed_reasoning structure
        if 'detailed_reasoning' in result and isinstance(result['detailed_reasoning'], dict):
            detailed = result['detailed_reasoning']
            if 'why_this_decision' in detailed:
                reasoning_parts.append(f"Rationale: {detailed['why_this_decision'][:150]}")
            if 'key_considerations' in detailed and isinstance(detailed['key_considerations'], list):
                considerations = ', '.join(detailed['key_considerations'][:3])
                reasoning_parts.append(f"Key considerations: {considerations}")
        
        # Extract from market overview (Research Agent)
        if 'market_overview' in result and isinstance(result['market_overview'], dict):
            market = result['market_overview']
            market_info = []
            if 'market_size' in market:
                market_info.append(f"Market size: {market['market_size']}")
            if 'growth_rate' in market:
                market_info.append(f"Growth: {market['growth_rate']}")
            if 'key_trends' in market and isinstance(market['key_trends'], list):
                market_info.append(f"Trends: {', '.join(market['key_trends'][:2])}")
            if market_info:
                reasoning_parts.append(" | ".join(market_info))
        
        # Extract from analysis scores (Analysis Agent)
        if 'overall_analysis_score' in result:
            score = result['overall_analysis_score']
            reasoning_parts.append(f"Overall viability score: {score:.0%}")
        
        if 'market_viability' in result and isinstance(result['market_viability'], dict):
            score = result['market_viability'].get('score', 0)
            reasoning_parts.append(f"Market viability: {score:.0%}")
        
        # Extract from risk assessment (Risk Agent)
        if 'overall_risk_score' in result:
            score = result['overall_risk_score']
            reasoning_parts.append(f"Overall risk level: {score:.0%}")
        
        if 'risk_matrix_summary' in result and isinstance(result['risk_matrix_summary'], dict):
            summary = result['risk_matrix_summary']
            critical = summary.get('critical_risks', 0)
            high = summary.get('high_risks', 0)
            if critical > 0 or high > 0:
                reasoning_parts.append(f"Identified {critical} critical and {high} high-priority risks")
        
        # Extract from decision (Decision Agent)
        if 'verdict' in result:
            verdict = result['verdict']
            confidence = result.get('confidence', 0)
            reasoning_parts.append(f"Reached decision: {verdict} (confidence: {confidence:.0%})")
        
        # Fallback to other fields
        if not reasoning_parts:
            if 'summary' in result and result['summary']:
                reasoning_parts.append(result['summary'][:200])
            elif 'key_points' in result and isinstance(result['key_points'], list):
                reasoning_parts.append(f"Key points: {', '.join(result['key_points'][:3])}")
            elif 'conclusion' in result and result['conclusion']:
                reasoning_parts.append(f"Conclusion: {result['conclusion']}")
        
        # Final fallback
        if not reasoning_parts:
            return f"Completed {self.name} analysis. Check the summary for key findings."
        
        return " | ".join(reasoning_parts)
    
    def log_step(self, step: str, details: Dict[str, Any]) -> None:
        """Log a reasoning step."""
        self.reasoning_log.append({
            "agent": self.name,
            "step": step,
            "details": details,
            "timestamp": time.time()
        })
