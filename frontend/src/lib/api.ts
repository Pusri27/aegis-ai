import axios from 'axios';
import type {
    AnalysisRequest,
    AnalysisResponse,
    AnalysisStatusResponse,
    FeedbackRequest,
    FeedbackResponse,
    HistoryItem,
    AnalysisStats,
    Explanation
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Analysis endpoints
export const analysisApi = {
    /**
     * Create a new analysis
     */
    create: async (data: AnalysisRequest): Promise<{ id: string; status: string }> => {
        const response = await api.post('/api/v1/analysis', data);
        return response.data;
    },

    /**
     * Get analysis by ID
     */
    get: async (id: string): Promise<AnalysisResponse> => {
        const response = await api.get(`/api/v1/analysis/${id}`);
        return response.data;
    },

    /**
     * Get analysis status
     */
    getStatus: async (id: string): Promise<AnalysisStatusResponse> => {
        const response = await api.get(`/api/v1/analysis/${id}/status`);
        return response.data;
    },

    /**
     * Get reasoning timeline
     */
    getReasoning: async (id: string) => {
        const response = await api.get(`/api/v1/analysis/${id}/reasoning`);
        return response.data;
    },

    /**
     * Get human-friendly explanation
     */
    getExplanation: async (id: string): Promise<Explanation> => {
        const response = await api.get(`/api/v1/analysis/${id}/explanation`);
        return response.data;
    },

    /**
     * Delete analysis
     */
    delete: async (id: string): Promise<void> => {
        await api.delete(`/api/v1/analysis/${id}`);
    },

    /**
     * Subscribe to status updates via SSE
     */
    subscribeToStatus: (id: string, onMessage: (data: AnalysisStatusResponse) => void) => {
        const eventSource = new EventSource(`${API_BASE_URL}/api/v1/analysis/${id}/status/stream`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);

            if (data.final) {
                eventSource.close();
            }
        };

        eventSource.onerror = () => {
            eventSource.close();
        };

        return () => eventSource.close();
    },
};

// History endpoints
export const historyApi = {
    /**
     * Get analysis history
     */
    list: async (limit = 10, offset = 0, status?: string): Promise<{ analyses: HistoryItem[]; total: number }> => {
        const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
        if (status) params.append('status', status);

        const response = await api.get(`/api/v1/history?${params}`);
        return response.data;
    },

    /**
     * Get analysis statistics
     */
    getStats: async (): Promise<AnalysisStats> => {
        const response = await api.get('/api/v1/history/stats');
        return response.data;
    },
};

// Feedback endpoints
export const feedbackApi = {
    /**
     * Submit feedback
     */
    submit: async (data: FeedbackRequest): Promise<FeedbackResponse> => {
        const response = await api.post('/api/v1/feedback', data);
        return response.data;
    },

    /**
     * Get feedback for analysis
     */
    get: async (analysisId: string) => {
        const response = await api.get(`/api/v1/feedback/${analysisId}`);
        return response.data;
    },
};

export default api;
