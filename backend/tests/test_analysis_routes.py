"""
Unit tests for analysis API routes.
"""
import pytest
from unittest.mock import patch, MagicMock
from uuid import uuid4


@pytest.mark.unit
class TestAnalysisRoutes:
    """Test analysis API endpoints."""
    
    def test_create_analysis_success(self, client, sample_analysis_request):
        """Test creating a new analysis."""
        with patch('app.api.routes.analysis.run_analysis') as mock_run:
            # Mock the background task
            mock_run.return_value = None
            
            response = client.post("/api/v1/analysis", json=sample_analysis_request)
            
            assert response.status_code == 200
            data = response.json()
            assert "id" in data
            assert data["status"] == "pending"
            assert data["problem_statement"] == sample_analysis_request["problem_statement"]
    
    def test_create_analysis_missing_problem_statement(self, client):
        """Test creating analysis without problem statement."""
        response = client.post("/api/v1/analysis", json={})
        
        assert response.status_code == 422  # Validation error
    
    def test_create_analysis_short_problem_statement(self, client):
        """Test creating analysis with too short problem statement."""
        response = client.post("/api/v1/analysis", json={
            "problem_statement": "Short"
        })
        
        assert response.status_code == 422
    
    def test_get_analysis_success(self, client, mock_analysis_response):
        """Test getting an existing analysis."""
        analysis_id = "test-123"
        
        with patch('app.api.routes.analysis.AnalysisDocument') as mock_doc:
            # Mock MongoDB query
            mock_instance = MagicMock()
            mock_instance.analysis_id = analysis_id
            mock_instance.status = "completed"
            mock_instance.problem_statement = "Test problem"
            mock_instance.decision = mock_analysis_response["result"]["decision"]
            mock_instance.reasoning_steps = mock_analysis_response["result"]["reasoning_steps"]
            mock_instance.created_at = "2026-01-13T12:00:00"
            mock_instance.completed_at = "2026-01-13T12:02:00"
            mock_instance.total_duration_ms = 120000
            
            mock_doc.find_one.return_value = mock_instance
            
            response = client.get(f"/api/v1/analysis/{analysis_id}")
            
            assert response.status_code == 200
            data = response.json()
            assert data["id"] == analysis_id
            assert data["status"] == "completed"
    
    def test_get_analysis_not_found(self, client):
        """Test getting non-existent analysis."""
        with patch('app.api.routes.analysis.AnalysisDocument') as mock_doc:
            mock_doc.find_one.return_value = None
            
            response = client.get("/api/v1/analysis/nonexistent-id")
            
            assert response.status_code == 404
    
    def test_get_analysis_status_success(self, client):
        """Test getting analysis status."""
        analysis_id = str(uuid4())
        
        with patch('app.api.routes.analysis.AnalysisDocument') as mock_doc:
            mock_instance = MagicMock()
            mock_instance.analysis_id = analysis_id
            mock_instance.status = "analyzing"
            mock_instance.current_agent = "Analysis Agent"
            mock_instance.progress_percentage = 50
            
            mock_doc.find_one.return_value = mock_instance
            
            response = client.get(f"/api/v1/analysis/{analysis_id}/status")
            
            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "analyzing"
            assert data["progress_percentage"] == 50
    
    def test_get_analysis_status_not_found(self, client):
        """Test getting status for non-existent analysis."""
        with patch('app.api.routes.analysis.AnalysisDocument') as mock_doc:
            mock_doc.find_one.return_value = None
            
            response = client.get(f"/api/v1/analysis/{uuid4()}/status")
            
            assert response.status_code == 404


@pytest.mark.unit
class TestAnalysisValidation:
    """Test input validation for analysis endpoints."""
    
    def test_problem_statement_min_length(self, client):
        """Test minimum length validation for problem statement."""
        response = client.post("/api/v1/analysis", json={
            "problem_statement": "a" * 19  # Less than 20 chars
        })
        
        assert response.status_code == 422
    
    def test_problem_statement_max_length(self, client):
        """Test maximum length validation for problem statement."""
        response = client.post("/api/v1/analysis", json={
            "problem_statement": "a" * 10001  # More than 10000 chars
        })
        
        assert response.status_code == 422
    
    def test_context_optional(self, client, sample_analysis_request):
        """Test that context field is optional."""
        with patch('app.api.routes.analysis.run_analysis'):
            request_without_context = {
                "problem_statement": sample_analysis_request["problem_statement"]
            }
            
            response = client.post("/api/v1/analysis", json=request_without_context)
            
            assert response.status_code == 200
