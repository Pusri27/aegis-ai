import asyncio
import logging
import time
from typing import Dict, Any, List, Optional, AsyncGenerator
from datetime import datetime
from uuid import UUID, uuid4

from app.agents.research import ResearchAgent
from app.agents.analyst import AnalystAgent
from app.agents.risk import RiskAgent
from app.agents.decision import DecisionAgent
from app.schemas import (
    AgentInput, 
    AgentOutput, 
    AnalysisStatus,
    AgentStep,
    Decision,
    KeyFactor,
    RiskItem
)
from app.memory import search_similar_memories, add_memory
from app.reasoning.logger import ReasoningLogger

logger = logging.getLogger(__name__)


class AgentOrchestrator:
    """
    Orchestrates the multi-agent workflow for decision analysis.
    
    Flow:
    1. Research Agent → Gather data
    2. Analysis Agent → Analyze findings
    3. Risk Agent → Assess risks
    4. Decision Agent → Make final decision
    """
    
    def __init__(self, analysis_id: UUID):
        self.analysis_id = analysis_id
        self.agents = {
            "research": ResearchAgent(),
            "analyst": AnalystAgent(),
            "risk": RiskAgent(),
            "decision": DecisionAgent()
        }
        self.agent_outputs: Dict[str, AgentOutput] = {}
        self.reasoning_steps: List[AgentStep] = []
        self.reasoning_logger = ReasoningLogger(analysis_id)
        self.status = AnalysisStatus.PENDING
        self.current_agent: Optional[str] = None
        self.start_time: Optional[float] = None
    
    async def execute(
        self, 
        problem_statement: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Execute the full multi-agent analysis workflow.
        """
        self.start_time = time.time()
        
        try:
            # Get relevant memories for context
            memory_context = await self._get_memory_context(problem_statement)
            
            # Phase 1: Research
            self.status = AnalysisStatus.RESEARCHING
            self.current_agent = "Research Agent"
            research_output = await self._execute_agent(
                "research",
                problem_statement,
                context or {},
                memory_context
            )
            
            # Phase 2: Analysis
            self.status = AnalysisStatus.ANALYZING
            self.current_agent = "Analysis Agent"
            analysis_output = await self._execute_agent(
                "analyst",
                problem_statement,
                context or {},
                None
            )
            
            # Phase 3: Risk Assessment
            self.status = AnalysisStatus.ASSESSING_RISKS
            self.current_agent = "Risk Agent"
            risk_output = await self._execute_agent(
                "risk", 
                problem_statement,
                context or {},
                None
            )
            
            # Phase 4: Decision
            self.status = AnalysisStatus.DECIDING
            self.current_agent = "Decision Agent"
            decision_output = await self._execute_agent(
                "decision",
                problem_statement,
                context or {},
                None
            )
            
            # Compile final result
            self.status = AnalysisStatus.COMPLETED
            self.current_agent = None
            
            total_duration = int((time.time() - self.start_time) * 1000)
            
            # Store insights in memory for future reference
            await self._store_insights(problem_statement, decision_output)
            
            return self._compile_result(total_duration)
            
        except Exception as e:
            logger.error(f"Orchestrator failed: {str(e)}")
            self.status = AnalysisStatus.FAILED
            raise
    
    async def _get_memory_context(self, problem: str) -> Optional[str]:
        """Retrieve relevant memories for context."""
        try:
            memories = search_similar_memories(problem, n_results=3)
            if memories:
                context_parts = []
                for mem in memories:
                    context_parts.append(f"- {mem['text'][:200]}...")
                return "\n".join(context_parts)
        except Exception as e:
            logger.warning(f"Failed to retrieve memories: {e}")
        return None
    
    async def _execute_agent(
        self,
        agent_key: str,
        problem: str,
        context: Dict[str, Any],
        memory_context: Optional[str]
    ) -> AgentOutput:
        """Execute a single agent and log the results."""
        agent = self.agents[agent_key]
        
        # Build input with previous outputs
        agent_input = AgentInput(
            task=problem,
            context=context,
            previous_outputs={
                name: output.result 
                for name, output in self.agent_outputs.items()
            },
            memory_context=memory_context
        )
        
        # Execute agent
        output = await agent.execute(agent_input)
        
        # Store output
        self.agent_outputs[agent.name] = output
        
        # Log reasoning step
        step = AgentStep(
            agent_name=agent.name,
            step_number=len(self.reasoning_steps) + 1,
            action=f"Executing {agent.role}",
            input_summary=problem[:200] + "..." if len(problem) > 200 else problem,
            output_summary=self._summarize_output(output.result),
            tools_used=output.tools_used,
            reasoning=output.reasoning,
            confidence=output.confidence,
            duration_ms=output.duration_ms,
            timestamp=datetime.now()
        )
        self.reasoning_steps.append(step)
        self.reasoning_logger.log_step(step)
        
        return output
    
    def _summarize_output(self, result: Dict[str, Any]) -> str:
        """Create a brief summary of agent output."""
        if "error" in result:
            return f"Error: {result['error']}"
        
        if "verdict" in result:
            return f"Decision: {result['verdict']} (confidence: {result.get('confidence', 'N/A')})"
        
        if "overall_risk_score" in result:
            return f"Risk Score: {result['overall_risk_score']}"
        
        if "overall_analysis_score" in result:
            return f"Analysis Score: {result['overall_analysis_score']}"
        
        if "market_overview" in result:
            return "Market research completed"
        
        return "Analysis completed"
    
    async def _store_insights(
        self, 
        problem: str, 
        decision_output: AgentOutput
    ) -> None:
        """Store key insights in memory for future reference."""
        try:
            result = decision_output.result
            
            # Store the decision as a memory
            memory_text = f"""
            Problem: {problem[:300]}
            Decision: {result.get('verdict', 'Unknown')}
            Key Factors: {', '.join([f.get('factor', '') for f in result.get('key_factors', [])][:3])}
            Confidence: {result.get('confidence', 0)}
            """
            
            add_memory(
                text=memory_text,
                metadata={
                    "type": "decision",
                    "analysis_id": str(self.analysis_id),
                    "verdict": result.get('verdict'),
                    "confidence": result.get('confidence', 0),
                    "category": "analysis_result"
                }
            )
            
            logger.info(f"Stored decision insight for analysis {self.analysis_id}")
            
        except Exception as e:
            logger.warning(f"Failed to store insights: {e}")
    
    def _compile_result(self, total_duration: int) -> Dict[str, Any]:
        """Compile all agent outputs into the final result."""
        decision_result = self.agent_outputs.get("Decision Agent", {})
        if hasattr(decision_result, 'result'):
            decision_result = decision_result.result
        
        research_result = self.agent_outputs.get("Research Agent", {})
        if hasattr(research_result, 'result'):
            research_result = research_result.result
            
        analysis_result = self.agent_outputs.get("Analysis Agent", {})
        if hasattr(analysis_result, 'result'):
            analysis_result = analysis_result.result
            
        risk_result = self.agent_outputs.get("Risk Agent", {})
        if hasattr(risk_result, 'result'):
            risk_result = risk_result.result
        
        # Build decision object
        decision = None
        if decision_result:
            key_factors = []
            for kf in decision_result.get('key_factors', []):
                if isinstance(kf, dict):
                    key_factors.append(KeyFactor(
                        factor=kf.get('factor', ''),
                        impact=kf.get('impact', 'neutral'),
                        weight=kf.get('weight', 0.5),
                        explanation=kf.get('explanation', '')
                    ))
            
            risks = []
            for risk in risk_result.get('risks', [])[:5]:  # Top 5 risks
                if isinstance(risk, dict):
                    risks.append(RiskItem(
                        category=risk.get('category', 'unknown'),
                        description=risk.get('description', ''),
                        severity=risk.get('severity', 'medium'),
                        probability=risk.get('probability', 'possible'),
                        mitigation=risk.get('mitigation', {}).get('strategy', '') if isinstance(risk.get('mitigation'), dict) else str(risk.get('mitigation', '')),
                        impact_score=risk.get('impact_score', 0.5)
                    ))
            
            recommendations = []
            for rec in decision_result.get('recommendations', []):
                if isinstance(rec, dict):
                    recommendations.append(rec.get('action', ''))
                else:
                    recommendations.append(str(rec))
            
            decision = Decision(
                verdict=decision_result.get('verdict', 'CONDITIONAL'),
                summary=decision_result.get('summary', ''),
                detailed_explanation=decision_result.get('detailed_reasoning', {}).get('why_this_decision', '') if isinstance(decision_result.get('detailed_reasoning'), dict) else '',
                key_factors=key_factors,
                risks=risks,
                recommendations=recommendations,
                next_steps=decision_result.get('next_steps', []),
                confidence_score=decision_result.get('confidence', 0.5)
            )
        
        # Calculate total tokens
        total_tokens = sum(
            output.tokens_used 
            for output in self.agent_outputs.values()
        )
        
        return {
            "status": self.status,
            "research_summary": self._get_research_summary(research_result),
            "analysis_summary": self._get_analysis_summary(analysis_result),
            "risk_summary": self._get_risk_summary(risk_result),
            "decision": decision,
            "reasoning_steps": self.reasoning_steps,
            "total_duration_ms": total_duration,
            "tokens_used": total_tokens,
            "agent_outputs": {
                name: output.result 
                for name, output in self.agent_outputs.items()
            }
        }
    
    def _get_research_summary(self, result: Dict[str, Any]) -> str:
        """Generate research summary."""
        if not result:
            return "No research data available"
        
        market = result.get('market_overview', {})
        competitors = result.get('competitors', [])
        
        summary_parts = []
        if market.get('market_size'):
            summary_parts.append(f"Market: {market['market_size']}")
        if competitors:
            summary_parts.append(f"Competitors identified: {len(competitors)}")
        if market.get('key_trends'):
            summary_parts.append(f"Key trends: {len(market['key_trends'])}")
        
        return " | ".join(summary_parts) if summary_parts else "Research completed"
    
    def _get_analysis_summary(self, result: Dict[str, Any]) -> str:
        """Generate analysis summary."""
        if not result:
            return "No analysis data available"
        
        scores = []
        if result.get('market_viability', {}).get('score'):
            scores.append(f"Market: {result['market_viability']['score']:.0%}")
        if result.get('technical_feasibility', {}).get('score'):
            scores.append(f"Tech: {result['technical_feasibility']['score']:.0%}")
        if result.get('business_model_analysis', {}).get('score'):
            scores.append(f"Business: {result['business_model_analysis']['score']:.0%}")
        
        return " | ".join(scores) if scores else "Analysis completed"
    
    def _get_risk_summary(self, result: Dict[str, Any]) -> str:
        """Generate risk summary."""
        if not result:
            return "No risk data available"
        
        summary = result.get('risk_matrix_summary', {})
        overall = result.get('overall_risk_score', 0)
        
        return f"Overall Risk: {overall:.0%} | Critical: {summary.get('critical_risks', 0)} | High: {summary.get('high_risks', 0)}"
    
    def get_status(self) -> Dict[str, Any]:
        """Get current orchestrator status for real-time updates."""
        progress = 0
        if self.status == AnalysisStatus.RESEARCHING:
            progress = 25
        elif self.status == AnalysisStatus.ANALYZING:
            progress = 50
        elif self.status == AnalysisStatus.ASSESSING_RISKS:
            progress = 75
        elif self.status == AnalysisStatus.DECIDING:
            progress = 90
        elif self.status == AnalysisStatus.COMPLETED:
            progress = 100
        
        return {
            "id": str(self.analysis_id),
            "status": self.status,
            "current_agent": self.current_agent,
            "progress_percentage": progress,
            "completed_steps": len(self.reasoning_steps),
            "latest_step": self.reasoning_steps[-1] if self.reasoning_steps else None
        }
