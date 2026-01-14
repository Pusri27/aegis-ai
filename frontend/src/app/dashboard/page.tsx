'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BarChart3, CheckCircle, Clock, Target, Plus, History, Settings } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { historyApi } from '@/lib/api';
import { formatDate, getVerdictColor, getStatusColor, truncateText } from '@/lib/utils';
import type { HistoryItem, AnalysisStats } from '@/types';

export default function DashboardPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [stats, setStats] = useState<AnalysisStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [historyData, statsData] = await Promise.all([
                    historyApi.list(5),
                    historyApi.getStats(),
                ]);
                setHistory(historyData.analyses);
                setStats(statsData);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        {
            label: 'Total Analyses',
            value: stats?.total_analyses || 0,
            icon: BarChart3,
            color: 'primary'
        },
        {
            label: 'Completed',
            value: stats?.completed || 0,
            icon: CheckCircle,
            color: 'secondary'
        },
        {
            label: 'In Progress',
            value: stats?.pending || 0,
            icon: Clock,
            color: 'primary'
        },
        {
            label: 'Avg Confidence',
            value: stats?.average_confidence ? `${(stats.average_confidence * 100).toFixed(0)}%` : 'N/A',
            icon: Target,
            color: 'secondary'
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-light)]">
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
                    >
                        <div>
                            <div className="inline-block mb-4">
                                <div className="number-badge">01</div>
                            </div>
                            <h1 className="heading-brutalist text-5xl md:text-6xl mb-3">
                                <span className="text-accent-primary">Dashboard</span>
                            </h1>
                            <p className="text-xl text-[var(--text-secondary)]">
                                Your AegisAI command center
                            </p>
                        </div>
                        <Link href="/analysis" className="btn-brutalist-primary">
                            <Plus className="w-5 h-5" />
                            New Analysis
                        </Link>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                    >
                        {statCards.map((stat, index) => (
                            <div
                                key={index}
                                className={`brutalist-card brutalist-card-${stat.color} p-6`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 border-[3px] border-[var(--dark)] bg-[var(--${stat.color})] flex items-center justify-center`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="font-mono text-xs text-[var(--text-secondary)] font-bold">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </div>
                                </div>
                                <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wide font-bold mb-2">
                                    {stat.label}
                                </p>
                                <p className="text-4xl font-bold text-[var(--dark)] font-mono">
                                    {isLoading ? '—' : stat.value}
                                </p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Verdict Distribution */}
                    {stats && stats.verdict_distribution && Object.keys(stats.verdict_distribution).length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="brutalist-card p-8 mb-12"
                        >
                            <h2 className="text-2xl font-bold text-[var(--dark)] mb-8 uppercase tracking-wide">
                                Decision Distribution
                            </h2>
                            <div className="flex flex-wrap items-center justify-center gap-8">
                                {Object.entries(stats.verdict_distribution).map(([verdict, count], index) => (
                                    <div key={verdict} className="text-center">
                                        <div className="relative inline-block mb-3">
                                            <div className="w-20 h-20 border-[3px] border-[var(--dark)] bg-[var(--accent)] flex items-center justify-center">
                                                <span className="text-3xl font-bold font-mono text-[var(--dark)]">
                                                    {count}
                                                </span>
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--primary)] border-[2px] border-[var(--dark)] flex items-center justify-center">
                                                <span className="text-xs font-mono font-bold text-white">
                                                    {(index + 1).toString().padStart(2, '0')}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-[var(--dark)] uppercase tracking-wide">
                                            {verdict}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Recent Analyses */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-[var(--dark)] uppercase tracking-wide">
                                Recent Analyses
                            </h2>
                            <Link
                                href="/history"
                                className="underline-accent text-[var(--text-primary)] font-bold hover:text-[var(--primary)] transition-colors"
                            >
                                View All →
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="brutalist-card p-12 text-center">
                                <div className="w-12 h-12 border-[3px] border-[var(--primary)] border-t-transparent animate-spin mx-auto mb-4" />
                                <p className="text-[var(--text-secondary)] font-medium">Loading...</p>
                            </div>
                        ) : history.length === 0 ? (
                            <div className="brutalist-card p-12 text-center">
                                <div className="text-6xl mb-4">📭</div>
                                <h3 className="text-2xl font-bold text-[var(--dark)] mb-3">
                                    No analyses yet
                                </h3>
                                <p className="text-[var(--text-secondary)] mb-6 text-lg">
                                    Start your first analysis to see results here
                                </p>
                                <Link href="/analysis" className="btn-brutalist-primary">
                                    <Plus className="w-5 h-5" />
                                    Start Analysis
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {history.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <Link href={`/analysis/${item.id}`}>
                                            <div className="brutalist-card p-6 hover:border-[var(--primary)] cursor-pointer group">
                                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="w-8 h-8 border-[2px] border-[var(--border-color-light)] flex items-center justify-center font-mono text-xs font-bold text-[var(--text-secondary)] group-hover:border-[var(--primary)] group-hover:text-[var(--primary)] transition-colors">
                                                                {(index + 1).toString().padStart(2, '0')}
                                                            </div>
                                                            <p className="text-[var(--dark)] font-bold truncate">
                                                                {truncateText(item.problem_statement, 100)}
                                                            </p>
                                                        </div>
                                                        <p className="text-sm text-[var(--text-secondary)] font-mono ml-11">
                                                            {item.created_at && formatDate(item.created_at)}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        {item.verdict && (
                                                            <span className="px-4 py-2 border-[2px] border-[var(--dark)] bg-[var(--accent)] text-[var(--dark)] text-sm font-bold uppercase">
                                                                {item.verdict}
                                                            </span>
                                                        )}
                                                        {item.confidence && (
                                                            <span className="px-3 py-2 border-[2px] border-[var(--secondary)] text-[var(--secondary)] text-sm font-mono font-bold">
                                                                {(item.confidence * 100).toFixed(0)}%
                                                            </span>
                                                        )}
                                                        <span className="px-3 py-2 border-[2px] border-[var(--border-color)] text-[var(--text-secondary)] text-xs font-bold uppercase">
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-12"
                    >
                        <h2 className="text-2xl font-bold text-[var(--dark)] mb-6 uppercase tracking-wide">
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link href="/analysis" className="brutalist-card brutalist-card-primary p-6 hover:border-[var(--primary)] group">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-14 h-14 border-[3px] border-[var(--dark)] bg-[var(--primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Plus className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="font-mono text-xs text-[var(--text-secondary)] font-bold">01</div>
                                </div>
                                <h3 className="text-xl font-bold text-[var(--dark)] mb-2">New Analysis</h3>
                                <p className="text-sm text-[var(--text-secondary)] font-medium">
                                    Start a new AI-powered analysis
                                </p>
                            </Link>

                            <Link href="/history" className="brutalist-card brutalist-card-secondary p-6 hover:border-[var(--secondary)] group">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-14 h-14 border-[3px] border-[var(--dark)] bg-[var(--secondary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <History className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="font-mono text-xs text-[var(--text-secondary)] font-bold">02</div>
                                </div>
                                <h3 className="text-xl font-bold text-[var(--dark)] mb-2">View History</h3>
                                <p className="text-sm text-[var(--text-secondary)] font-medium">
                                    Browse past analyses
                                </p>
                            </Link>

                            <div className="brutalist-card p-6 opacity-50 cursor-not-allowed">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-14 h-14 border-[3px] border-[var(--border-color-light)] bg-[var(--bg-light)] flex items-center justify-center">
                                        <Settings className="w-7 h-7 text-[var(--text-secondary)]" />
                                    </div>
                                    <div className="font-mono text-xs text-[var(--text-secondary)] font-bold">03</div>
                                </div>
                                <h3 className="text-xl font-bold text-[var(--dark)] mb-2">Settings</h3>
                                <p className="text-sm text-[var(--text-secondary)] font-medium">
                                    Coming soon
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
