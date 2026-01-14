'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { historyApi } from '@/lib/api';
import { formatDate, truncateText } from '@/lib/utils';
import type { HistoryItem } from '@/types';

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const limit = 10;

    useEffect(() => {
        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                const data = await historyApi.list(limit, page * limit, statusFilter || undefined);
                setHistory(data.analyses);
                setTotal(data.total);
            } catch (error) {
                console.error('Failed to fetch history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [page, statusFilter]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-light)]">
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">

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
                                Analysis <span className="text-accent-primary">History</span>
                            </h1>
                            <p className="text-xl text-[var(--text-secondary)] font-mono">
                                <span className="font-bold text-[var(--dark)]">{total}</span> total analyses
                            </p>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                            {/* Status Filter */}
                            <div className="relative">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setPage(0);
                                    }}
                                    className="appearance-none px-4 py-3 pr-10 border-[3px] border-[var(--border-color)] bg-[var(--bg-paper)] text-[var(--dark)] font-bold uppercase text-sm tracking-wide focus:outline-none focus:border-[var(--primary)] transition-colors cursor-pointer"
                                >
                                    <option value="">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                </select>
                                <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] pointer-events-none" />
                            </div>

                            <Link href="/analysis" className="btn-brutalist-primary">
                                <Plus className="w-5 h-5" />
                                New Analysis
                            </Link>
                        </div>
                    </motion.div>

                    {/* History List */}
                    {isLoading ? (
                        <div className="brutalist-card p-12 text-center">
                            <div className="w-12 h-12 border-[3px] border-[var(--primary)] border-t-transparent animate-spin mx-auto mb-4" />
                            <p className="text-[var(--text-secondary)] font-medium">Loading history...</p>
                        </div>
                    ) : history.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="brutalist-card p-12 text-center"
                        >
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-2xl font-bold text-[var(--dark)] mb-3">
                                No analyses found
                            </h3>
                            <p className="text-[var(--text-secondary)] mb-6 text-lg">
                                {statusFilter ? 'No analyses match your filter' : 'Start your first analysis to see history here'}
                            </p>
                            <Link href="/analysis" className="btn-brutalist-primary">
                                <Plus className="w-5 h-5" />
                                Start Analysis
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <div className="space-y-4 mb-8">
                                {history.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link href={`/analysis/${item.id}`}>
                                            <div className="brutalist-card p-6 hover:border-[var(--primary)] cursor-pointer group">
                                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="w-10 h-10 border-[2px] border-[var(--border-color-light)] flex items-center justify-center font-mono text-sm font-bold text-[var(--text-secondary)] group-hover:border-[var(--primary)] group-hover:text-[var(--primary)] transition-colors flex-shrink-0">
                                                                {(page * limit + index + 1).toString().padStart(2, '0')}
                                                            </div>
                                                            <p className="text-[var(--dark)] font-bold leading-tight">
                                                                {truncateText(item.problem_statement, 150)}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm font-mono ml-13">
                                                            <span className="text-[var(--text-secondary)]">
                                                                Created: <span className="text-[var(--dark)] font-bold">{formatDate(item.created_at)}</span>
                                                            </span>
                                                            {item.completed_at && (
                                                                <span className="text-[var(--text-secondary)]">
                                                                    Completed: <span className="text-[var(--dark)] font-bold">{formatDate(item.completed_at)}</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 flex-wrap">
                                                        {item.verdict && (
                                                            <span className="px-4 py-2 border-[2px] border-[var(--dark)] bg-[var(--accent)] text-[var(--dark)] text-sm font-bold uppercase">
                                                                {item.verdict}
                                                            </span>
                                                        )}
                                                        {item.confidence !== undefined && item.confidence !== null && (
                                                            <div className="text-center">
                                                                <div className="px-3 py-2 border-[2px] border-[var(--secondary)] text-[var(--secondary)] font-mono font-bold">
                                                                    {(item.confidence * 100).toFixed(0)}%
                                                                </div>
                                                            </div>
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-3 flex-wrap">
                                    <button
                                        onClick={() => setPage(Math.max(0, page - 1))}
                                        disabled={page === 0}
                                        className={`btn-brutalist-outline ${page === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i;
                                            } else if (page < 2) {
                                                pageNum = i;
                                            } else if (page > totalPages - 3) {
                                                pageNum = totalPages - 5 + i;
                                            } else {
                                                pageNum = page - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setPage(pageNum)}
                                                    className={`w-12 h-12 border-[3px] font-mono font-bold transition-colors ${page === pageNum
                                                            ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                                                            : 'border-[var(--border-color)] bg-[var(--bg-paper)] text-[var(--text-secondary)] hover:border-[var(--dark)] hover:text-[var(--dark)]'
                                                        }`}
                                                >
                                                    {pageNum + 1}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                        disabled={page >= totalPages - 1}
                                        className={`btn-brutalist-outline ${page >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
