from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class AgentConfig(BaseModel):
    """Configuration for an agent."""
    name: str
    role: str
    system_prompt: str
    allowed_tools: List[str] = []
    temperature: float = Field(default=0.7, ge=0, le=2)
    max_tokens: int = Field(default=2000, ge=100, le=8000)


class AgentInput(BaseModel):
    """Input to an agent."""
    task: str
    context: Dict[str, Any] = {}
    previous_outputs: Dict[str, Any] = {}
    memory_context: Optional[str] = None


class AgentOutput(BaseModel):
    """Output from an agent."""
    agent_name: str
    result: Dict[str, Any]
    reasoning: str
    confidence: float = Field(ge=0, le=1)
    tools_used: List[str] = []
    tokens_used: int = 0
    duration_ms: int = 0


class OrchestratorState(BaseModel):
    """State of the orchestrator during execution."""
    analysis_id: str
    current_phase: str
    completed_agents: List[str] = []
    agent_outputs: Dict[str, AgentOutput] = {}
    error: Optional[str] = None
