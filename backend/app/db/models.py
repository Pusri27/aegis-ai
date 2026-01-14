"""Database models for MongoDB using Beanie ODM."""
from datetime import datetime
from typing import Optional, List
from uuid import UUID, uuid4
from beanie import Document
from pydantic import BaseModel, Field


class DecisionModel(BaseModel):
    """Embedded decision model."""
    verdict: str
    confidence: float
    summary: str
    key_factors: List[str] = []
    risks: List[str] = []
    recommendations: List[str] = []
    next_steps: List[str] = []


class ReasoningStepModel(BaseModel):
    """Embedded reasoning step model."""
    step_number: int
    agent: str
    action: str
    summary: str
    reasoning: str
    confidence: float
    duration_ms: int
    timestamp: str


class AnalysisDocument(Document):
    """Main analysis document stored in MongoDB."""
    
    # Use string ID for compatibility with existing code
    analysis_id: str = Field(default_factory=lambda: str(uuid4()))
    status: str  # pending, researching, analyzing, assessing_risks, deciding, completed, failed
    problem_statement: str
    context: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    completed_at: Optional[datetime] = None
    
    # Result data
    decision: Optional[DecisionModel] = None
    reasoning_steps: List[ReasoningStepModel] = []
    
    # Error tracking
    error: Optional[str] = None
    
    class Settings:
        name = "analyses"  # Collection name
        indexes = [
            "analysis_id",
            "status",
            "created_at",
        ]
    
    class Config:
        json_schema_extra = {
            "example": {
                "analysis_id": "123e4567-e89b-12d3-a456-426614174000",
                "status": "completed",
                "problem_statement": "Should I invest in renewable energy?",
                "context": "Looking for long-term investment",
                "created_at": "2024-01-11T10:00:00",
                "completed_at": "2024-01-11T10:05:00",
                "decision": {
                    "verdict": "PROCEED_WITH_CAUTION",
                    "confidence": 0.78,
                    "summary": "Good long-term potential with some risks",
                    "key_factors": ["Climate policy", "Technology advancement"],
                    "risks": ["Policy changes", "Market volatility"],
                    "recommendations": ["Diversify portfolio"],
                    "next_steps": ["Research top companies"]
                },
                "reasoning_steps": []
            }
        }
