"""
Unit tests for history API routes.
"""
import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime


@pytest.mark.unit
class TestHistoryRoutes:
    """Test history API endpoints."""
    
    def test_get_history_success(self, client):
        """Test getting analysis history."""
        with patch('app.api.routes.history.AnalysisDocument') as mock_doc:
            # Mock MongoDB query
            mock_analyses = [
                MagicMock(
                    analysis_id="test-1",
                    status="completed",
                    problem_statement="Test 1",
                    created_at=datetime.now(),
                    completed_at=datetime.now(),
                    total_duration_ms=60000,
                    decision={"verdict": "GO", "confidence": 0.8}
                ),
                MagicMock(
                    analysis_id="test-2",
                    status="completed",
                    problem_statement="Test 2",
                    created_at=datetime.now(),
                    completed_at=datetime.now(),
                    total_duration_ms=90000,
                    decision={"verdict": "NO_GO", "confidence": 0.6}
                )
            ]
            
            mock_doc.find.return_value.sort.return_value.skip.return_value.limit.return_value.to_list.return_value = mock_analyses
            mock_doc.find.return_value.count_documents.return_value = 2
            
            response = client.get("/api/v1/history?limit=10&offset=0")
            
            assert response.status_code == 200
            data = response.json()
            assert "analyses" in data
            assert "total" in data
            assert "limit" in data
            assert "offset" in data
    
    def test_get_history_with_pagination(self, client):
        """Test history pagination."""
        with patch('app.api.routes.history.AnalysisDocument') as mock_doc:
            mock_doc.find.return_value.sort.return_value.skip.return_value.limit.return_value.to_list.return_value = []
            mock_doc.find.return_value.count_documents.return_value = 0
            
            response = client.get("/api/v1/history?limit=5&offset=10")
            
            assert response.status_code == 200
            data = response.json()
            assert data["limit"] == 5
            assert data["offset"] == 10
    
    def test_get_stats_success(self, client):
        """Test getting analysis statistics."""
        with patch('app.api.routes.history.AnalysisDocument') as mock_doc:
            # Mock count queries
            mock_doc.find.return_value.count_documents.return_value = 10
            
            response = client.get("/api/v1/history/stats")
            
            assert response.status_code == 200
            data = response.json()
            assert "total_analyses" in data
            assert "completed_analyses" in data
            assert "failed_analyses" in data
            assert "pending_analyses" in data


@pytest.mark.unit
class TestHistoryValidation:
    """Test validation for history endpoints."""
    
    def test_get_history_invalid_limit(self, client):
        """Test history with invalid limit."""
        response = client.get("/api/v1/history?limit=0")
        
        assert response.status_code == 422
    
    def test_get_history_negative_offset(self, client):
        """Test history with negative offset."""
        response = client.get("/api/v1/history?offset=-1")
        
        assert response.status_code == 422
