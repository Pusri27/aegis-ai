from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class FeedbackCreate(BaseModel):
    """Request to submit feedback."""
    analysis_id: UUID
    rating: int = Field(ge=1, le=5)
    accuracy_rating: int = Field(ge=1, le=5)
    helpfulness_rating: int = Field(ge=1, le=5)
    comment: Optional[str] = Field(None, max_length=1000)
    
    # Specific feedback points
    was_decision_correct: Optional[bool] = None
    missing_factors: Optional[str] = None
    overestimated_risks: Optional[str] = None
    underestimated_risks: Optional[str] = None


class FeedbackResponse(BaseModel):
    """Feedback response."""
    id: UUID
    analysis_id: UUID
    rating: int
    accuracy_rating: int
    helpfulness_rating: int
    comment: Optional[str]
    created_at: datetime
    
    # Acknowledgment
    memory_updated: bool = False
    improvement_notes: Optional[str] = None
