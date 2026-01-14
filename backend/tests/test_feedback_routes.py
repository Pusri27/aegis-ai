"""
Unit tests for feedback API routes.
"""
import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime


@pytest.mark.unit
class TestFeedbackRoutes:
    """Test feedback API endpoints."""
    
    def test_submit_feedback_success(self, client, sample_feedback):
        """Test submitting feedback."""
        with patch('app.api.routes.feedback.FeedbackDocument') as mock_doc:
            # Mock save operation
            mock_instance = MagicMock()
            mock_instance.save.return_value = None
            mock_doc.return_value = mock_instance
            
            response = client.post("/api/v1/feedback", json=sample_feedback)
            
            assert response.status_code == 200
            data = response.json()
            assert data["message"] == "Feedback submitted successfully"
    
    def test_submit_feedback_missing_analysis_id(self, client):
        """Test submitting feedback without analysis_id."""
        response = client.post("/api/v1/feedback", json={
            "rating": 5
        })
        
        assert response.status_code == 422
    
    def test_submit_feedback_invalid_rating(self, client):
        """Test submitting feedback with invalid rating."""
        response = client.post("/api/v1/feedback", json={
            "analysis_id": "test-id",
            "rating": 6  # Should be 1-5
        })
        
        assert response.status_code == 422
    
    def test_submit_feedback_negative_rating(self, client):
        """Test submitting feedback with negative rating."""
        response = client.post("/api/v1/feedback", json={
            "analysis_id": "test-id",
            "rating": 0
        })
        
        assert response.status_code == 422
    
    def test_get_feedback_success(self, client):
        """Test getting feedback for an analysis."""
        analysis_id = "test-123"
        
        with patch('app.api.routes.feedback.FeedbackDocument') as mock_doc:
            mock_feedback = MagicMock(
                analysis_id=analysis_id,
                rating=5,
                accuracy_rating=4,
                helpfulness_rating=5,
                comment="Great!",
                was_decision_correct=True,
                created_at=datetime.now()
            )
            
            mock_doc.find_one.return_value = mock_feedback
            
            response = client.get(f"/api/v1/feedback/{analysis_id}")
            
            assert response.status_code == 200
            data = response.json()
            assert data["rating"] == 5
    
    def test_get_feedback_not_found(self, client):
        """Test getting feedback for non-existent analysis."""
        with patch('app.api.routes.feedback.FeedbackDocument') as mock_doc:
            mock_doc.find_one.return_value = None
            
            response = client.get("/api/v1/feedback/nonexistent-id")
            
            assert response.status_code == 404


@pytest.mark.unit
class TestFeedbackValidation:
    """Test validation for feedback endpoints."""
    
    def test_rating_range_validation(self, client):
        """Test that rating must be between 1-5."""
        # Test upper bound
        response = client.post("/api/v1/feedback", json={
            "analysis_id": "test-id",
            "rating": 10
        })
        assert response.status_code == 422
        
        # Test lower bound
        response = client.post("/api/v1/feedback", json={
            "analysis_id": "test-id",
            "rating": -1
        })
        assert response.status_code == 422
    
    def test_optional_fields(self, client):
        """Test that optional fields are truly optional."""
        with patch('app.api.routes.feedback.FeedbackDocument'):
            response = client.post("/api/v1/feedback", json={
                "analysis_id": "test-id",
                "rating": 4
                # All other fields optional
            })
            
            assert response.status_code == 200
