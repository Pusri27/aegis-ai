'use client';

import { motion } from 'framer-motion';
import { getAgentIcon, getAgentColor } from '@/lib/utils';
import type { AnalysisStatus } from '@/types';

interface AgentProgressProps {
    status: AnalysisStatus;
    currentAgent?: string;
    progressPercentage: number;
}

const agents = [
    { name: 'Research Agent', description: 'Gathering market data & insights' },
    { name: 'Analysis Agent', description: 'Evaluating viability & feasibility' },
    { name: 'Risk Agent', description: 'Assessing potential risks' },
    { name: 'Decision Agent', description: 'Making final recommendation' },
];

const statusToAgentIndex: Record<string, number> = {
    'pending': -1,
    'researching': 0,
    'analyzing': 1,
    'assessing_risks': 2,
    'deciding': 3,
    'completed': 4,
    'failed': -1,
};

export default function AgentProgress({ status, currentAgent, progressPercentage }: AgentProgressProps) {
    const currentIndex = statusToAgentIndex[status] ?? -1;

    return (
        <div className="space-y-4">
            {/* Progress Bar */}
            <div className="relative">
                <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
                <div className="mt-2 text-right text-sm text-[var(--text-secondary)]">
                    {progressPercentage}% Complete
                </div>
            </div>

            {/* Agent Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {agents.map((agent, index) => {
                    const isActive = index === currentIndex;
                    const isCompleted = index < currentIndex;
                    const isPending = index > currentIndex;

                    return (
                        <motion.div
                            key={agent.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-5 border-[3px] rounded-lg transition-all ${isCompleted
                                    ? 'border-[var(--secondary)] bg-gradient-to-br from-[var(--bg-paper)] to-[rgba(122,155,118,0.05)]'
                                    : isActive
                                        ? 'border-[var(--primary)] bg-[var(--bg-paper)]'
                                        : 'border-[var(--border-color-light)] bg-[var(--bg-paper)]'
                                }`}
                        >
                            {/* Agent Icon */}
                            <div className="flex items-center space-x-3 mb-3">
                                <div className={`relative w-10 h-10 rounded-lg bg-gradient-to-br ${getAgentColor(agent.name)} flex items-center justify-center text-xl ${isPending ? 'opacity-40' : ''}`}>
                                    {getAgentIcon(agent.name)}
                                    {/* Completed Overlay */}
                                    {isCompleted && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                            className="absolute inset-0 bg-[var(--secondary)] rounded-lg flex items-center justify-center"
                                        >
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <motion.path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={3}
                                                    d="M5 13l4 4L19 7"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 0.3, delay: 0.1 }}
                                                />
                                            </svg>
                                        </motion.div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-semibold ${isPending ? 'text-[var(--text-muted)]' : isCompleted ? 'text-[var(--secondary)]' : 'text-[var(--text-primary)]'}`}>
                                        {agent.name.replace(' Agent', '')}
                                    </h4>
                                </div>
                                {/* Active Spinner */}
                                {isActive && (
                                    <div className="w-6 h-6">
                                        <div className="spinner !w-6 !h-6 !border-2" />
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <p className={`text-sm ${isPending ? 'text-[var(--text-muted)]' : 'text-[var(--text-secondary)]'}`}>
                                {agent.description}
                            </p>

                            {/* Active Indicator */}
                            {isActive && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-3 text-xs text-[var(--primary-400)] font-medium"
                                >
                                    ● Processing...
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Current Status Text */}
            {currentAgent && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-[var(--text-secondary)] mt-4"
                >
                    <span className="text-[var(--primary-400)]">{currentAgent}</span> is working on your analysis...
                </motion.div>
            )}
        </div>
    );
}
