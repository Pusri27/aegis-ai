from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from uuid import UUID


class AnalysisStatus(str, Enum):
    PENDING = "pending"
    RESEARCHING = "researching"
    ANALYZING = "analyzing"
    ASSESSING_RISKS = "assessing_risks"
    DECIDING = "deciding"
    COMPLETED = "completed"
    FAILED = "failed"


class AnalysisRequest(BaseModel):
    """Request to start a new analysis."""
    problem_statement: str = Field(..., min_length=20, max_length=5000)
    context: Optional[str] = Field(None, max_length=2000)
    preferences: Optional[Dict[str, Any]] = None


class AgentStep(BaseModel):
    """A single step in the agent reasoning process."""
    agent_name: str
    step_number: int
    action: str
    input_summary: str
    output_summary: str
    tools_used: List[str] = []
    reasoning: str
    confidence: float = Field(ge=0, le=1)
    duration_ms: int
    timestamp: datetime


class RiskItem(BaseModel):
    """A single identified risk."""
    category: str
    description: str
    severity: str  # high, medium, low
    probability: str  # high, medium, low
    mitigation: str
    impact_score: float = Field(ge=0, le=1)


class KeyFactor(BaseModel):
    """A key factor in the decision."""
    factor: str
    impact: str  # positive, negative, neutral
    weight: float = Field(ge=0, le=1)
    explanation: str


class Decision(BaseModel):
    """The final decision output."""
    verdict: str  # GO, NO-GO, CONDITIONAL
    summary: str
    detailed_explanation: str
    key_factors: List[KeyFactor]
    risks: List[RiskItem]
    recommendations: List[str]
    next_steps: List[str]
    confidence_score: float = Field(ge=0, le=1)


class AnalysisResponse(BaseModel):
    """Full analysis response."""
    id: UUID
    status: AnalysisStatus
    problem_statement: str
    created_at: datetime
    completed_at: Optional[datetime] = None
    
    # Agent outputs
    research_summary: Optional[str] = None
    analysis_summary: Optional[str] = None
    risk_summary: Optional[str] = None
    
    # Final decision
    decision: Optional[Decision] = None
    
    # Reasoning timeline
    reasoning_steps: List[AgentStep] = []
    
    # Metadata
    total_duration_ms: Optional[int] = None
    tokens_used: Optional[int] = None


class AnalysisStatusResponse(BaseModel):
    """Real-time status update."""
    id: UUID
    status: AnalysisStatus
    current_agent: Optional[str] = None
    current_step: Optional[str] = None
    progress_percentage: int = Field(ge=0, le=100)
    latest_update: str
