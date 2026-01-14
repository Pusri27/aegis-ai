from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from fastapi.responses import StreamingResponse
from typing import Optional, Dict, Any
from uuid import UUID, uuid4
from datetime import datetime
import asyncio
import json
import logging

from app.schemas import (
    AnalysisRequest,
    AnalysisResponse,
    AnalysisStatusResponse,
    AnalysisStatus
)
from app.agents import AgentOrchestrator
from app.reasoning import ExplanationGenerator
from app.db import AnalysisDocument, DecisionModel, ReasoningStepModel, is_connected

logger = logging.getLogger(__name__)
router = APIRouter()

# In-memory storage for active analyses (fallback when MongoDB not available)
active_analyses: Dict[str, Dict[str, Any]] = {}
analysis_orchestrators: Dict[str, AgentOrchestrator] = {}


@router.post("", response_model=Dict[str, Any])
async def create_analysis(
    request: AnalysisRequest,
    background_tasks: BackgroundTasks
):
    """
    Start a new analysis.
    Returns the analysis ID immediately, processing happens in background.
    """
    analysis_id = str(uuid4())
    created_at = datetime.now()
    
    # Create analysis document
    if is_connected():
        # Use MongoDB
        analysis_doc = AnalysisDocument(
            analysis_id=analysis_id,
            status=AnalysisStatus.PENDING.value,
            problem_statement=request.problem_statement,
            context=request.context,
            created_at=created_at
        )
        await analysis_doc.insert()
        logger.info(f"📝 Created analysis in MongoDB: {analysis_id}")
    else:
        # Fallback to in-memory
        active_analyses[analysis_id] = {
            "id": analysis_id,
            "status": AnalysisStatus.PENDING,
            "problem_statement": request.problem_statement,
            "context": request.context,
            "created_at": created_at.isoformat(),
            "result": None,
            "error": None
        }
        logger.info(f"📝 Created analysis in memory: {analysis_id}")
    
    # Create orchestrator
    orchestrator = AgentOrchestrator(UUID(analysis_id))
    analysis_orchestrators[analysis_id] = orchestrator
    
    # Start background processing
    background_tasks.add_task(
        run_analysis,
        analysis_id,
        request.problem_statement,
        request.preferences
    )
    
    return {
        "id": analysis_id,
        "status": AnalysisStatus.PENDING,
        "message": "Analysis started. Use the status endpoint to track progress.",
        "created_at": created_at.isoformat()
    }


async def run_analysis(
    analysis_id: str, 
    problem_statement: str,
    preferences: Optional[Dict[str, Any]] = None
):
    """Background task to run the analysis."""
    try:
        orchestrator = analysis_orchestrators.get(analysis_id)
        if not orchestrator:
            logger.error(f"Orchestrator not found for {analysis_id}")
            return
        
        # Run the multi-agent analysis
        result = await orchestrator.execute(
            problem_statement=problem_statement,
            context=preferences
        )
        
        # Prepare result data
        completed_at = datetime.now()
        decision_data = None
        reasoning_steps_data = []
        
        # Helper function to extract strings from list of dicts or strings
        def extract_strings(items):
            if not items:
                return []
            result = []
            for item in items:
                if isinstance(item, dict):
                    # Try common keys for string extraction
                    text = item.get('factor') or item.get('risk') or item.get('recommendation') or item.get('step') or item.get('description') or item.get('text') or str(item)
                    result.append(text)
                elif isinstance(item, str):
                    result.append(item)
                else:
                    result.append(str(item))
            return result
        
        if result and "decision" in result:
            decision = result["decision"]
            # Handle both Pydantic model and dict
            if hasattr(decision, 'model_dump'):
                # It's a Pydantic model
                decision_dict = decision.model_dump()
            elif hasattr(decision, '__dict__'):
                # It's an object with attributes
                # Try both 'confidence' and 'confidence_score' fields
                confidence_value = getattr(decision, 'confidence', None) or getattr(decision, 'confidence_score', 0.75)
                
                decision_dict = {
                    "verdict": getattr(decision, 'verdict', ''),
                    "confidence": confidence_value,
                    "summary": getattr(decision, 'summary', ''),
                    "key_factors": getattr(decision, 'key_factors', []),
                    "risks": getattr(decision, 'risks', []),
                    "recommendations": getattr(decision, 'recommendations', []),
                    "next_steps": getattr(decision, 'next_steps', [])
                }
            else:
                # It's already a dict
                decision_dict = decision
            
            # Extract confidence with fallback to confidence_score
            confidence_value = decision_dict.get("confidence") or decision_dict.get("confidence_score", 0.75)
            
            decision_data = DecisionModel(
                verdict=decision_dict.get("verdict", ""),
                confidence=confidence_value,
                summary=decision_dict.get("summary", ""),
                key_factors=extract_strings(decision_dict.get("key_factors", [])),
                risks=extract_strings(decision_dict.get("risks", [])),
                recommendations=extract_strings(decision_dict.get("recommendations", [])),
                next_steps=extract_strings(decision_dict.get("next_steps", []))
            )
        
        if result and "reasoning_steps" in result:
            for step in result["reasoning_steps"]:
                # Handle both Pydantic model and dict
                if hasattr(step, 'model_dump'):
                    step_dict = step.model_dump()
                    # Map field names from AgentStep schema to ReasoningStepModel schema
                    if 'agent_name' in step_dict:
                        step_dict['agent'] = step_dict.pop('agent_name')
                    if 'output_summary' in step_dict:
                        step_dict['summary'] = step_dict.pop('output_summary')
                elif hasattr(step, '__dict__'):
                    # AgentStep has agent_name and output_summary, not agent and summary
                    step_dict = {
                        "step_number": getattr(step, 'step_number', 0),
                        "agent": getattr(step, 'agent_name', ''),
                        "action": getattr(step, 'action', ''),
                        "summary": getattr(step, 'output_summary', ''),
                        "reasoning": getattr(step, 'reasoning', ''),
                        "confidence": getattr(step, 'confidence', 0.0),
                        "duration_ms": getattr(step, 'duration_ms', 0),
                        "timestamp": getattr(step, 'timestamp', '')
                    }
                else:
                    step_dict = step
                    # Also handle dict case where field names might be wrong
                    if 'agent_name' in step_dict and 'agent' not in step_dict:
                        step_dict['agent'] = step_dict.get('agent_name', '')
                    if 'output_summary' in step_dict and 'summary' not in step_dict:
                        step_dict['summary'] = step_dict.get('output_summary', '')
                
                # Convert timestamp to string if it's a datetime object
                timestamp_value = step_dict.get("timestamp", "")
                if hasattr(timestamp_value, 'isoformat'):
                    timestamp_value = timestamp_value.isoformat()
                elif not isinstance(timestamp_value, str):
                    timestamp_value = str(timestamp_value) if timestamp_value else ""
                
                reasoning_steps_data.append(ReasoningStepModel(
                    step_number=step_dict.get("step_number", 0),
                    agent=step_dict.get("agent", ""),
                    action=step_dict.get("action", ""),
                    summary=step_dict.get("summary", ""),
                    reasoning=step_dict.get("reasoning", ""),
                    confidence=step_dict.get("confidence", 0.0),
                    duration_ms=step_dict.get("duration_ms", 0),
                    timestamp=timestamp_value
                ))
        
        # Update storage
        if is_connected():
            # Update MongoDB
            analysis_doc = await AnalysisDocument.find_one(AnalysisDocument.analysis_id == analysis_id)
            if analysis_doc:
                analysis_doc.status = AnalysisStatus.COMPLETED.value
                analysis_doc.completed_at = completed_at
                analysis_doc.decision = decision_data
                analysis_doc.reasoning_steps = reasoning_steps_data
                await analysis_doc.save()
                logger.info(f"✅ Analysis completed and saved to MongoDB: {analysis_id}")
        else:
            # Update in-memory
            if analysis_id in active_analyses:
                active_analyses[analysis_id]["status"] = AnalysisStatus.COMPLETED
                active_analyses[analysis_id]["result"] = result
                active_analyses[analysis_id]["completed_at"] = completed_at.isoformat()
                logger.info(f"✅ Analysis completed (in-memory): {analysis_id}")
        
    except Exception as e:
        logger.error(f"❌ Analysis failed: {analysis_id} - {str(e)}")
        
        # Update error status
        if is_connected():
            analysis_doc = await AnalysisDocument.find_one(AnalysisDocument.analysis_id == analysis_id)
            if analysis_doc:
                analysis_doc.status = AnalysisStatus.FAILED.value
                analysis_doc.error = str(e)
                await analysis_doc.save()
        else:
            if analysis_id in active_analyses:
                active_analyses[analysis_id]["status"] = AnalysisStatus.FAILED
                active_analyses[analysis_id]["error"] = str(e)


@router.get("/{analysis_id}")
async def get_analysis(analysis_id: str):
    """Get the full analysis result."""
    # Return mock data for demo ID
    if analysis_id == "demo-analysis-123":
        return await get_mock_analysis()
    
    # Try MongoDB first
    if is_connected():
        analysis_doc = await AnalysisDocument.find_one(AnalysisDocument.analysis_id == analysis_id)
        if analysis_doc:
            # Convert to dict for response
            result_data = {
                "id": analysis_doc.analysis_id,
                "status": analysis_doc.status,
                "problem_statement": analysis_doc.problem_statement,
                "context": analysis_doc.context,
                "created_at": analysis_doc.created_at.isoformat(),
                "completed_at": analysis_doc.completed_at.isoformat() if analysis_doc.completed_at else None,
                "result": {}
            }
            
            if analysis_doc.decision:
                result_data["result"]["decision"] = analysis_doc.decision.model_dump()
            
            if analysis_doc.reasoning_steps:
                result_data["result"]["reasoning_steps"] = [
                    step.model_dump() for step in analysis_doc.reasoning_steps
                ]
            
            if analysis_doc.error:
                result_data["error"] = analysis_doc.error
            
            return result_data
    
    # Fallback to in-memory
    if analysis_id not in active_analyses:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    analysis = active_analyses[analysis_id]
    
    if analysis["status"] == AnalysisStatus.FAILED:
        raise HTTPException(
            status_code=500, 
            detail=f"Analysis failed: {analysis.get('error', 'Unknown error')}"
        )
    
    return analysis


@router.get("/{analysis_id}/status")
async def get_analysis_status(analysis_id: str):
    """Get real-time status of an analysis."""
    # Return completed status for demo ID
    if analysis_id == "demo-analysis-123":
        return AnalysisStatusResponse(
            id=UUID(analysis_id),
            status=AnalysisStatus.COMPLETED,
            current_agent=None,
            current_step=None,
            progress_percentage=100,
            latest_update="Analysis completed"
        )
    
    # Try MongoDB first
    if is_connected():
        analysis_doc = await AnalysisDocument.find_one(AnalysisDocument.analysis_id == analysis_id)
        if analysis_doc:
            # Check if orchestrator is still running
            orchestrator = analysis_orchestrators.get(analysis_id)
            if orchestrator:
                status = orchestrator.get_status()
                latest_step = status.get("latest_step")
                return AnalysisStatusResponse(
                    id=UUID(analysis_id),
                    status=status["status"],
                    current_agent=status.get("current_agent"),
                    current_step=latest_step.action if latest_step and hasattr(latest_step, 'action') else None,
                    progress_percentage=status["progress_percentage"],
                    latest_update=f"Step {status['completed_steps']}: {status.get('current_agent', 'Processing')}"
                )
            
            # Return stored status
            return AnalysisStatusResponse(
                id=UUID(analysis_id),
                status=AnalysisStatus(analysis_doc.status),
                current_agent=None,
                current_step=None,
                progress_percentage=100 if analysis_doc.status == AnalysisStatus.COMPLETED.value else 0,
                latest_update=analysis_doc.status
            )
    
    # Fallback to in-memory
    if analysis_id not in active_analyses:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    orchestrator = analysis_orchestrators.get(analysis_id)
    
    if orchestrator:
        status = orchestrator.get_status()
        latest_step = status.get("latest_step")
        return AnalysisStatusResponse(
            id=UUID(analysis_id),
            status=status["status"],
            current_agent=status.get("current_agent"),
            current_step=latest_step.action if latest_step and hasattr(latest_step, 'action') else None,
            progress_percentage=status["progress_percentage"],
            latest_update=f"Step {status['completed_steps']}: {status.get('current_agent', 'Processing')}"
        )
    
    analysis = active_analyses[analysis_id]
    return AnalysisStatusResponse(
        id=UUID(analysis_id),
        status=analysis["status"],
        current_agent=None,
        current_step=None,
        progress_percentage=100 if analysis["status"] == AnalysisStatus.COMPLETED else 0,
        latest_update=analysis["status"].value
    )


@router.get("/{analysis_id}/status/stream")
async def stream_analysis_status(analysis_id: str):
    """Stream real-time status updates using Server-Sent Events."""
    if analysis_id not in active_analyses:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    async def event_generator():
        last_status = None
        
        while True:
            orchestrator = analysis_orchestrators.get(analysis_id)
            analysis = active_analyses.get(analysis_id)
            
            if not analysis:
                yield f"data: {json.dumps({'error': 'Analysis not found'})}\n\n"
                break
            
            # Get current status
            if orchestrator:
                current_status = orchestrator.get_status()
            else:
                current_status = {
                    "status": analysis["status"],
                    "progress_percentage": 100 if analysis["status"] == AnalysisStatus.COMPLETED else 0
                }
            
            # Send update if status changed
            if current_status != last_status:
                yield f"data: {json.dumps(current_status, default=str)}\n\n"
                last_status = current_status.copy()
            
            # Check if completed or failed
            if analysis["status"] in [AnalysisStatus.COMPLETED, AnalysisStatus.FAILED]:
                yield f"data: {json.dumps({'final': True, 'status': analysis['status'].value})}\n\n"
                break
            
            await asyncio.sleep(1)  # Poll every second
    
    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@router.get("/{analysis_id}/reasoning")
async def get_reasoning_timeline(analysis_id: str):
    """Get the reasoning timeline for an analysis."""
    if analysis_id not in active_analyses:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    orchestrator = analysis_orchestrators.get(analysis_id)
    
    if orchestrator:
        return {
            "analysis_id": analysis_id,
            "steps": [
                {
                    "step_number": step.step_number,
                    "agent": step.agent_name,
                    "action": step.action,
                    "summary": step.output_summary,
                    "reasoning": step.reasoning,
                    "confidence": step.confidence,
                    "duration_ms": step.duration_ms,
                    "timestamp": step.timestamp.isoformat()
                }
                for step in orchestrator.reasoning_steps
            ],
            "total_steps": len(orchestrator.reasoning_steps)
        }
    
    return {
        "analysis_id": analysis_id,
        "steps": [],
        "message": "Reasoning data not available"
    }


@router.get("/{analysis_id}/explanation")
async def get_explanation(analysis_id: str):
    """Get a human-friendly explanation of the analysis."""
    if analysis_id not in active_analyses:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    analysis = active_analyses[analysis_id]
    
    if analysis["status"] != AnalysisStatus.COMPLETED:
        raise HTTPException(
            status_code=400,
            detail=f"Analysis not completed. Current status: {analysis['status'].value}"
        )
    
    orchestrator = analysis_orchestrators.get(analysis_id)
    result = analysis.get("result", {})
    decision = result.get("decision")
    
    if decision and orchestrator:
        # Convert Decision object to dict if needed
        decision_dict = decision.model_dump() if hasattr(decision, 'model_dump') else decision
        
        explanation = ExplanationGenerator.generate_decision_explanation(
            decision_dict,
            orchestrator.reasoning_steps
        )
        return explanation
    
    return {
        "message": "Explanation not available",
        "analysis_id": analysis_id
    }


@router.get("/mock/demo")
async def get_mock_analysis():
    """Get mock analysis data for UI testing."""
    mock_id = "demo-analysis-123"
    
    # Create mock analysis with complete data
    mock_analysis = {
        "id": mock_id,
        "status": "completed",
        "problem_statement": "Should I invest in renewable energy stocks for long-term growth?",
        "context": "Looking for sustainable investment opportunities with 10-year horizon",
        "created_at": "2024-01-11T10:00:00",
        "completed_at": "2024-01-11T10:05:30",
        "result": {
            "decision": {
                "verdict": "PROCEED_WITH_CAUTION",
                "confidence": 0.78,
                "summary": "Renewable energy stocks show strong long-term potential driven by global climate commitments and technological advancement. However, market volatility and regulatory uncertainties require careful portfolio diversification.",
                "key_factors": [
                    "Global push for net-zero emissions by 2050",
                    "Declining costs of solar and wind technology",
                    "Government incentives and subsidies",
                    "Growing corporate ESG commitments"
                ],
                "risks": [
                    "Policy changes affecting subsidies",
                    "Technology disruption risks",
                    "Supply chain dependencies",
                    "Market volatility in emerging sectors"
                ],
                "recommendations": [
                    "Diversify across solar, wind, and energy storage companies",
                    "Focus on established players with strong balance sheets",
                    "Allocate 15-20% of portfolio to renewable energy sector",
                    "Monitor regulatory changes and policy developments"
                ],
                "next_steps": [
                    "Research top 10 renewable energy companies by market cap",
                    "Analyze Q4 earnings reports and growth projections",
                    "Set up price alerts for entry points",
                    "Consult with financial advisor for tax implications"
                ]
            },
            "reasoning_steps": [
                {
                    "step_number": 1,
                    "agent": "Research Agent",
                    "action": "Market Analysis",
                    "summary": "Analyzed global renewable energy market trends and growth projections",
                    "reasoning": "The renewable energy sector is experiencing unprecedented growth with global investments reaching $500B annually. Solar and wind capacity additions are accelerating, driven by cost competitiveness with fossil fuels.",
                    "confidence": 0.85,
                    "duration_ms": 2340,
                    "timestamp": "2024-01-11T10:01:15"
                },
                {
                    "step_number": 2,
                    "agent": "Research Agent",
                    "action": "Policy Review",
                    "summary": "Evaluated government policies and international climate commitments",
                    "reasoning": "Major economies have committed to net-zero targets with substantial policy support. The US Inflation Reduction Act allocates $369B for clean energy, while EU's Green Deal targets €1T in sustainable investments.",
                    "confidence": 0.82,
                    "duration_ms": 1890,
                    "timestamp": "2024-01-11T10:02:00"
                },
                {
                    "step_number": 3,
                    "agent": "Analysis Agent",
                    "action": "Financial Viability Assessment",
                    "summary": "Assessed financial performance and growth potential of leading companies",
                    "reasoning": "Top renewable energy companies show strong revenue growth (15-25% YoY) with improving profit margins. However, valuations are elevated compared to traditional energy stocks, reflecting growth expectations.",
                    "confidence": 0.75,
                    "duration_ms": 2150,
                    "timestamp": "2024-01-11T10:03:30"
                },
                {
                    "step_number": 4,
                    "agent": "Risk Agent",
                    "action": "Risk Assessment",
                    "summary": "Identified key risks and mitigation strategies",
                    "reasoning": "Primary risks include policy reversals, technology obsolescence, and supply chain vulnerabilities. Diversification across technologies and geographies can mitigate these risks effectively.",
                    "confidence": 0.80,
                    "duration_ms": 1720,
                    "timestamp": "2024-01-11T10:04:45"
                },
                {
                    "step_number": 5,
                    "agent": "Decision Agent",
                    "action": "Final Recommendation",
                    "summary": "Synthesized findings into actionable investment recommendation",
                    "reasoning": "The combination of strong fundamentals, policy support, and technological advancement supports a positive long-term outlook. However, near-term volatility and valuation concerns warrant a cautious approach with proper diversification.",
                    "confidence": 0.78,
                    "duration_ms": 1560,
                    "timestamp": "2024-01-11T10:05:30"
                }
            ]
        }
    }
    
    # Store in active_analyses for status endpoint
    active_analyses[mock_id] = mock_analysis
    
    return mock_analysis


@router.delete("/{analysis_id}")
async def delete_analysis(analysis_id: str):
    """Delete an analysis."""
    if analysis_id not in active_analyses:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    del active_analyses[analysis_id]
    if analysis_id in analysis_orchestrators:
        del analysis_orchestrators[analysis_id]
    
    return {"message": f"Analysis {analysis_id} deleted"}
