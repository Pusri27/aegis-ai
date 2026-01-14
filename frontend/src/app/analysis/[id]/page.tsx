'use client';

import { useState, useEffect, use, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Clock } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AgentProgress from '@/components/analysis/AgentProgress';
import ResultCard from '@/components/analysis/ResultCard';
import ReasoningTimeline from '@/components/analysis/ReasoningTimeline';
import FeedbackPanel from '@/components/feedback/FeedbackPanel';
import { analysisApi } from '@/lib/api';
import { formatDate, formatDuration } from '@/lib/utils';
import type { AnalysisResponse, AnalysisStatusResponse, AnalysisStatus } from '@/types';

interface AnalysisResultPageProps {
    params: Promise<{ id: string }>;
}

export default function AnalysisResultPage({ params }: AnalysisResultPageProps) {
    const { id } = use(params);
    const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
    const [status, setStatus] = useState<AnalysisStatusResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'result' | 'reasoning' | 'feedback'>('result');

    // Use ref to track if we've reached a terminal state to prevent overwrites
    const isTerminalState = useRef(false);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const fetchAnalysis = async () => {
            try {
                const data = await analysisApi.get(id);

                // Check if this is a terminal state
                if (data.status === 'completed' || data.status === 'failed') {
                    isTerminalState.current = true;
                }

                setAnalysis(data);

                // If not completed, subscribe to status updates
                if (data.status !== 'completed' && data.status !== 'failed') {
                    unsubscribe = analysisApi.subscribeToStatus(id, (statusUpdate) => {
                        setStatus(statusUpdate);

                        if (statusUpdate.status === 'completed' || statusUpdate.status === 'failed') {
                            // Fetch final result ONLY if we haven't already reached terminal state
                            if (!isTerminalState.current) {
                                analysisApi.get(id).then(finalData => {
                                    isTerminalState.current = true;
                                    setAnalysis(finalData);
                                });
                            }
                        }
                    });
                }
            } catch (err) {
                console.error('Failed to fetch analysis:', err);
                setError('Failed to load analysis. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalysis();

        // Poll for status if SSE fails (but only if not already completed)
        const pollInterval = setInterval(async () => {
            // CRITICAL: Stop polling if we've reached terminal state
            // Use ref instead of state to avoid closure issues
            if (isTerminalState.current) {
                clearInterval(pollInterval);
                return;
            }

            try {
                const statusData = await analysisApi.getStatus(id);
                setStatus(statusData);

                if (statusData.status === 'completed' || statusData.status === 'failed') {
                    // Only fetch and update if we haven't already reached terminal state
                    if (!isTerminalState.current) {
                        const data = await analysisApi.get(id);
                        isTerminalState.current = true;
                        setAnalysis(data);
                    }
                    clearInterval(pollInterval);
                }
            } catch (err) {
                // Ignore polling errors
            }
        }, 3000);

        return () => {
            if (unsubscribe) unsubscribe();
            clearInterval(pollInterval);
        };
    }, [id]); // Remove analysis and status from dependencies to prevent re-fetching

    const currentStatus = status?.status || analysis?.status || 'pending';
    const isProcessing = !['completed', 'failed'].includes(currentStatus);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--bg-light)]">
                <Navbar />
                <main className="flex-1 pt-32 pb-20 px-4 flex items-center justify-center">
                    <div className="brutalist-card p-12 text-center">
                        <div className="w-16 h-16 border-[3px] border-[var(--primary)] border-t-transparent animate-spin mx-auto mb-4" />
                        <p className="text-[var(--text-secondary)] font-medium text-lg">Loading analysis...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col bg-[var(--bg-light)]">
                <Navbar />
                <main className="flex-1 pt-32 pb-20 px-4 flex items-center justify-center">
                    <div className="brutalist-card p-12 text-center max-w-lg">
                        <div className="text-6xl mb-4">😕</div>
                        <h2 className="text-3xl font-bold text-[var(--dark)] mb-3">Something went wrong</h2>
                        <p className="text-[var(--text-secondary)] mb-6 text-lg">{error}</p>
                        <Link href="/analysis" className="btn-brutalist-primary">
                            <Plus className="w-5 h-5" />
                            Start New Analysis
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-light)]">
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="inline-block mb-4">
                                    <div className="number-badge">01</div>
                                </div>
                                <h1 className="heading-brutalist text-5xl md:text-6xl mb-3">
                                    {isProcessing ? (
                                        <>Analysis <span className="text-accent-primary">In Progress</span></>
                                    ) : (
                                        <>Analysis <span className="text-accent-primary">Complete</span></>
                                    )}
                                </h1>
                                <div className="flex items-center gap-3 text-lg font-mono text-[var(--text-secondary)]">
                                    <Clock className="w-5 h-5" />
                                    <span>
                                        Started <span className="text-[var(--dark)] font-bold">{analysis?.created_at && formatDate(analysis.created_at)}</span>
                                    </span>
                                    {analysis?.total_duration_ms && (
                                        <span>
                                            • Completed in <span className="text-[var(--dark)] font-bold">{formatDuration(analysis.total_duration_ms)}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <Link href="/analysis" className="btn-brutalist-outline">
                                <Plus className="w-5 h-5" />
                                New Analysis
                            </Link>
                        </div>
                    </motion.div>

                    {/* Problem Statement */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="brutalist-card p-8 mb-8"
                    >
                        <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">
                            Problem Statement
                        </h3>
                        <p className="text-[var(--dark)] text-lg leading-relaxed">{analysis?.problem_statement}</p>
                    </motion.div>

                    {/* Agent Progress */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8"
                    >
                        <AgentProgress
                            status={currentStatus as AnalysisStatus}
                            currentAgent={status?.current_agent}
                            progressPercentage={status?.progress_percentage || (currentStatus === 'completed' ? 100 : 0)}
                        />
                    </motion.div>

                    {/* Results Section */}
                    {currentStatus === 'completed' && analysis && (
                        <>
                            {/* Tabs */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="flex gap-3 mb-8 flex-wrap"
                            >
                                {[
                                    { id: 'result', label: 'Result', icon: '📊' },
                                    { id: 'reasoning', label: 'Reasoning', icon: '🧠' },
                                    { id: 'feedback', label: 'Feedback', icon: '📝' },
                                ].map((tab, index) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                        className={`px-6 py-3 border-[3px] font-bold uppercase text-sm tracking-wide transition-all flex items-center gap-2 ${activeTab === tab.id
                                            ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                                            : 'border-[var(--border-color)] bg-[var(--bg-paper)] text-[var(--text-secondary)] hover:border-[var(--dark)] hover:text-[var(--dark)]'
                                            }`}
                                    >
                                        <span className="text-lg">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </motion.div>

                            {/* Tab Content */}
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'result' && analysis.result?.decision && (
                                    <ResultCard decision={analysis.result.decision} />
                                )}

                                {activeTab === 'reasoning' && (
                                    <div className="brutalist-card p-8">
                                        <h2 className="text-3xl font-bold text-[var(--dark)] mb-8 uppercase tracking-wide">
                                            Reasoning Timeline
                                        </h2>
                                        <ReasoningTimeline steps={analysis.result?.reasoning_steps || []} />
                                    </div>
                                )}

                                {activeTab === 'feedback' && (
                                    <FeedbackPanel analysisId={id} />
                                )}
                            </motion.div>

                            {/* Summary Cards */}
                            {activeTab === 'result' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
                                >
                                    {analysis.research_summary && (
                                        <div className="brutalist-card brutalist-card-primary p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 border-[3px] border-[var(--dark)] bg-[var(--primary)] flex items-center justify-center text-2xl">
                                                    🔍
                                                </div>
                                                <h4 className="font-bold text-[var(--dark)] text-lg uppercase">Research</h4>
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{analysis.research_summary}</p>
                                        </div>
                                    )}
                                    {analysis.analysis_summary && (
                                        <div className="brutalist-card brutalist-card-secondary p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 border-[3px] border-[var(--dark)] bg-[var(--secondary)] flex items-center justify-center text-2xl">
                                                    📊
                                                </div>
                                                <h4 className="font-bold text-[var(--dark)] text-lg uppercase">Analysis</h4>
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{analysis.analysis_summary}</p>
                                        </div>
                                    )}
                                    {analysis.risk_summary && (
                                        <div className="brutalist-card brutalist-card-primary p-6">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 border-[3px] border-[var(--dark)] bg-[var(--primary)] flex items-center justify-center text-2xl">
                                                    ⚠️
                                                </div>
                                                <h4 className="font-bold text-[var(--dark)] text-lg uppercase">Risk</h4>
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{analysis.risk_summary}</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </>
                    )}

                    {/* Failed State */}
                    {currentStatus === 'failed' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="brutalist-card p-12 text-center"
                        >
                            <div className="text-6xl mb-4">😔</div>
                            <h2 className="text-3xl font-bold text-[var(--dark)] mb-3">
                                Analysis Failed
                            </h2>
                            <p className="text-[var(--text-secondary)] mb-6 text-lg max-w-2xl mx-auto">
                                We encountered an error while processing your analysis. This might be due to high demand or technical issues.
                            </p>
                            <Link href="/analysis" className="btn-brutalist-primary">
                                <Plus className="w-5 h-5" />
                                Try Again
                            </Link>
                        </motion.div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
