from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from uuid import UUID, uuid4
from datetime import datetime
import logging

from app.schemas import FeedbackCreate, FeedbackResponse
from app.memory import update_memory_from_feedback

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory storage for feedback (replace with DB in production)
feedback_storage: Dict[str, Dict[str, Any]] = {}


@router.post("", response_model=FeedbackResponse)
async def submit_feedback(feedback: FeedbackCreate):
    """
    Submit feedback for an analysis.
    This updates the memory system to improve future decisions.
    """
    feedback_id = uuid4()
    
    # Store feedback
    feedback_data = {
        "id": str(feedback_id),
        "analysis_id": str(feedback.analysis_id),
        "rating": feedback.rating,
        "accuracy_rating": feedback.accuracy_rating,
        "helpfulness_rating": feedback.helpfulness_rating,
        "comment": feedback.comment,
        "was_decision_correct": feedback.was_decision_correct,
        "missing_factors": feedback.missing_factors,
        "overestimated_risks": feedback.overestimated_risks,
        "underestimated_risks": feedback.underestimated_risks,
        "created_at": datetime.now().isoformat()
    }
    
    feedback_storage[str(feedback_id)] = feedback_data
    
    # Update memory based on feedback
    memory_updated = False
    try:
        update_memory_from_feedback(
            str(feedback.analysis_id),
            feedback_data
        )
        memory_updated = True
        logger.info(f"Memory updated from feedback: {feedback_id}")
    except Exception as e:
        logger.warning(f"Failed to update memory: {e}")
    
    # Generate improvement notes based on feedback
    improvement_notes = None
    if feedback.rating < 3 or feedback.accuracy_rating < 3:
        notes = []
        if feedback.missing_factors:
            notes.append(f"Will consider: {feedback.missing_factors}")
        if feedback.overestimated_risks:
            notes.append(f"Noted overestimation in: {feedback.overestimated_risks}")
        if feedback.underestimated_risks:
            notes.append(f"Will increase weight of: {feedback.underestimated_risks}")
        improvement_notes = " | ".join(notes) if notes else "Feedback recorded for improvement"
    
    return FeedbackResponse(
        id=feedback_id,
        analysis_id=feedback.analysis_id,
        rating=feedback.rating,
        accuracy_rating=feedback.accuracy_rating,
        helpfulness_rating=feedback.helpfulness_rating,
        comment=feedback.comment,
        created_at=datetime.now(),
        memory_updated=memory_updated,
        improvement_notes=improvement_notes
    )


@router.get("/{analysis_id}")
async def get_feedback_for_analysis(analysis_id: str):
    """Get all feedback for a specific analysis."""
    feedbacks = [
        fb for fb in feedback_storage.values()
        if fb["analysis_id"] == analysis_id
    ]
    
    if not feedbacks:
        return {"analysis_id": analysis_id, "feedback": [], "message": "No feedback found"}
    
    return {
        "analysis_id": analysis_id,
        "feedback": feedbacks,
        "average_rating": sum(fb["rating"] for fb in feedbacks) / len(feedbacks),
        "total_feedback": len(feedbacks)
    }
