"""
Pytest configuration and shared fixtures for AegisAI tests.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    """FastAPI test client."""
    return TestClient(app)


@pytest.fixture
def sample_analysis_request():
    """Sample analysis request payload."""
    return {
        "problem_statement": "Should I launch a SaaS platform for AI-powered inventory management targeting small businesses?",
        "context": "Target market: 50-200 employee companies, Budget: $500k, Timeline: 6 months"
    }


@pytest.fixture
def sample_feedback():
    """Sample feedback payload."""
    return {
        "analysis_id": "test-analysis-id",
        "rating": 5,
        "accuracy_rating": 4,
        "helpfulness_rating": 5,
        "comment": "Very helpful analysis!",
        "was_decision_correct": True
    }


@pytest.fixture
def mock_analysis_response():
    """Mock completed analysis response."""
    return {
        "id": "test-123",
        "status": "completed",
        "problem_statement": "Test problem",
        "created_at": "2026-01-13T12:00:00",
        "completed_at": "2026-01-13T12:02:00",
        "total_duration_ms": 120000,
        "result": {
            "decision": {
                "verdict": "GO",
                "confidence": 0.85,
                "summary": "Strong market opportunity with manageable risks.",
                "key_factors": [
                    "Large addressable market",
                    "Clear product-market fit",
                    "Competitive advantage"
                ],
                "risks": [
                    "Market competition",
                    "Technical complexity"
                ],
                "recommendations": [
                    "Start with MVP",
                    "Focus on customer acquisition"
                ],
                "next_steps": [
                    "Build prototype",
                    "Conduct user testing"
                ]
            },
            "reasoning_steps": [
                {
                    "step_number": 1,
                    "agent": "Research Agent",
                    "action": "Market research",
                    "summary": "Completed market analysis",
                    "reasoning": "Analyzed market size and trends",
                    "confidence": 0.8,
                    "duration_ms": 30000,
                    "timestamp": "2026-01-13T12:00:30"
                }
            ]
        }
    }
