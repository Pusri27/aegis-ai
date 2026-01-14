from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("")
async def get_analysis_history(
    limit: int = Query(default=10, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    status: Optional[str] = None
):
    """
    Get analysis history for the current user.
    In production, this would filter by authenticated user.
    """
    from app.db import AnalysisDocument, is_connected
    from app.api.routes.analysis import active_analyses
    
    all_analyses = []
    
    # Try MongoDB first
    if is_connected():
        # Build query
        query = {}
        if status:
            query["status"] = status
        
        # Get total count
        total = await AnalysisDocument.find(query).count()
        
        # Query with pagination and sorting
        docs = await AnalysisDocument.find(query).sort("-created_at").skip(offset).limit(limit).to_list()
        
        # Convert to response format
        for doc in docs:
            history_item = {
                "id": doc.analysis_id,
                "problem_statement": doc.problem_statement[:100] + "..." if len(doc.problem_statement) > 100 else doc.problem_statement,
                "status": doc.status,
                "verdict": doc.decision.verdict if doc.decision else None,
                "confidence": doc.decision.confidence if doc.decision else None,
                "created_at": doc.created_at.isoformat(),
                "completed_at": doc.completed_at.isoformat() if doc.completed_at else None
            }
            all_analyses.append(history_item)
        
        return {
            "analyses": all_analyses,
            "total": total,
            "limit": limit,
            "offset": offset
        }
    
    # Fallback to in-memory
    all_analyses_data = list(active_analyses.values())
    
    # Filter by status if provided
    if status:
        all_analyses_data = [a for a in all_analyses_data if a.get("status", "").value == status]
    
    # Sort by created_at descending
    all_analyses_data.sort(
        key=lambda x: x.get("created_at", ""), 
        reverse=True
    )
    
    # Apply pagination
    paginated = all_analyses_data[offset:offset + limit]
    
    # Simplify for list view
    history = []
    for analysis in paginated:
        result = analysis.get("result", {})
        decision = result.get("decision") if result else None
        
        history.append({
            "id": analysis.get("id"),
            "problem_statement": analysis.get("problem_statement", "")[:100] + "...",
            "status": analysis.get("status", "unknown"),
            "verdict": decision.verdict if hasattr(decision, 'verdict') else (decision.get("verdict") if isinstance(decision, dict) else None),
            "confidence": decision.confidence_score if hasattr(decision, 'confidence_score') else (decision.get("confidence_score") if isinstance(decision, dict) else None),
            "created_at": analysis.get("created_at"),
            "completed_at": analysis.get("completed_at")
        })
    
    return {
        "analyses": history,
        "total": len(all_analyses_data),
        "limit": limit,
        "offset": offset
    }


@router.get("/stats")
async def get_analysis_stats():
    """Get statistics about analyses."""
    from app.db import AnalysisDocument, is_connected
    from app.api.routes.analysis import active_analyses
    
    # Try MongoDB first
    if is_connected():
        all_docs = await AnalysisDocument.find_all().to_list()
        
        if not all_docs:
            return {
                "total_analyses": 0,
                "completed": 0,
                "pending": 0,
                "failed": 0,
                "average_confidence": None,
                "verdict_distribution": {}
            }
        
        completed = [d for d in all_docs if d.status == "completed"]
        pending = [d for d in all_docs if d.status in ["pending", "researching", "analyzing", "assessing_risks", "deciding"]]
        failed = [d for d in all_docs if d.status == "failed"]
        
        # Calculate verdict distribution and average confidence
        verdict_dist = {}
        confidences = []
        
        for doc in completed:
            if doc.decision:
                if doc.decision.verdict:
                    verdict_dist[doc.decision.verdict] = verdict_dist.get(doc.decision.verdict, 0) + 1
                if doc.decision.confidence:
                    confidences.append(doc.decision.confidence)
        
        return {
            "total_analyses": len(all_docs),
            "completed": len(completed),
            "pending": len(pending),
            "failed": len(failed),
            "average_confidence": sum(confidences) / len(confidences) if confidences else None,
            "verdict_distribution": verdict_dist
        }
    
    # Fallback to in-memory
    all_analyses = list(active_analyses.values())
    
    if not all_analyses:
        return {
            "total_analyses": 0,
            "completed": 0,
            "pending": 0,
            "failed": 0,
            "average_confidence": None,
            "verdict_distribution": {}
        }
    
    completed = [a for a in all_analyses if str(a.get("status", "")) == "completed"]
    pending = [a for a in all_analyses if str(a.get("status", "")) in ["pending", "researching", "analyzing", "assessing_risks", "deciding"]]
    failed = [a for a in all_analyses if str(a.get("status", "")) == "failed"]
    
    # Calculate verdict distribution
    verdict_dist = {}
    confidences = []
    
    for analysis in completed:
        result = analysis.get("result", {})
        decision = result.get("decision") if result else None
        
        if decision:
            verdict = decision.verdict if hasattr(decision, 'verdict') else decision.get("verdict")
            if verdict:
                verdict_dist[verdict] = verdict_dist.get(verdict, 0) + 1
            
            conf = decision.confidence_score if hasattr(decision, 'confidence_score') else decision.get("confidence_score")
            if conf:
                confidences.append(conf)
    
    return {
        "total_analyses": len(all_analyses),
        "completed": len(completed),
        "pending": len(pending),
        "failed": len(failed),
        "average_confidence": sum(confidences) / len(confidences) if confidences else None,
        "verdict_distribution": verdict_dist
    }
