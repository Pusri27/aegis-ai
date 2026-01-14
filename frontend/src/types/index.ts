// API Types for AegisAI

export type AnalysisStatus =
  | 'pending'
  | 'researching'
  | 'analyzing'
  | 'assessing_risks'
  | 'deciding'
  | 'completed'
  | 'failed';

export type Verdict = 'GO' | 'NO-GO' | 'CONDITIONAL';

export interface KeyFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  explanation: string;
}

export interface RiskItem {
  category: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  probability: 'very_likely' | 'likely' | 'possible' | 'unlikely';
  mitigation: string;
  impact_score: number;
}

export interface Decision {
  verdict: string;
  summary: string;
  detailed_explanation?: string;
  key_factors: string[] | KeyFactor[];
  risks: string[] | RiskItem[];
  recommendations: string[];
  next_steps: string[];
  confidence: number;
  confidence_score?: number; // Legacy field
}

export interface AgentStep {
  step_number: number;
  agent?: string; // Backend field
  agent_name?: string; // Legacy field
  action: string;
  summary?: string; // Backend field
  input_summary?: string;
  output_summary?: string; // Legacy field
  tools_used?: string[];
  reasoning: string;
  confidence: number;
  duration_ms: number;
  timestamp: string;
}

export interface AnalysisRequest {
  problem_statement: string;
  context?: string;
  preferences?: Record<string, unknown>;
}

export interface AnalysisResponse {
  id: string;
  status: AnalysisStatus;
  problem_statement: string;
  created_at: string;
  completed_at?: string;
  research_summary?: string;
  analysis_summary?: string;
  risk_summary?: string;
  result?: {
    decision?: Decision;
    reasoning_steps?: AgentStep[];
  };
  // Legacy fields for backward compatibility
  decision?: Decision;
  reasoning_steps?: AgentStep[];
  total_duration_ms?: number;
  tokens_used?: number;
}

export interface AnalysisStatusResponse {
  id: string;
  status: AnalysisStatus;
  current_agent?: string;
  current_step?: string;
  progress_percentage: number;
  latest_update: string;
}

export interface FeedbackRequest {
  analysis_id: string;
  rating: number;
  accuracy_rating: number;
  helpfulness_rating: number;
  comment?: string;
  was_decision_correct?: boolean;
  missing_factors?: string;
  overestimated_risks?: string;
  underestimated_risks?: string;
}

export interface FeedbackResponse {
  id: string;
  analysis_id: string;
  rating: number;
  accuracy_rating: number;
  helpfulness_rating: number;
  comment?: string;
  created_at: string;
  memory_updated: boolean;
  improvement_notes?: string;
}

export interface HistoryItem {
  id: string;
  problem_statement: string;
  status: AnalysisStatus;
  verdict?: Verdict;
  confidence?: number;
  created_at: string;
  completed_at?: string;
}

export interface AnalysisStats {
  total_analyses: number;
  completed: number;
  pending: number;
  failed: number;
  average_confidence?: number;
  verdict_distribution: Record<Verdict, number>;
}

export interface Explanation {
  emoji: string;
  header: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence_level: string;
  confidence_percentage: string;
  summary: string;
  main_reasons: string[];
  concerns: string[];
  next_actions: string[];
  timeline: {
    agent: string;
    action: string;
    confidence: string;
  }[];
}
