'use client';

import { motion } from 'framer-motion';
import { formatDuration, getAgentIcon } from '@/lib/utils';
import type { AgentStep } from '@/types';

interface ReasoningTimelineProps {
    steps: AgentStep[];
}

export default function ReasoningTimeline({ steps }: ReasoningTimelineProps) {
    if (!steps || steps.length === 0) {
        return (
            <div className="text-center text-[var(--text-secondary)] py-12 brutalist-card p-8">
                <div className="text-4xl mb-3">🤔</div>
                <p className="font-medium">No reasoning steps available yet.</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-1 bg-[var(--border-color)]" />

            {/* Steps */}
            <div className="space-y-6">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.step_number}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 }}
                        className="relative pl-16"
                    >
                        {/* Step indicator */}
                        <div className="absolute left-0 w-12 h-12 border-[3px] border-[var(--dark)] bg-[var(--primary)] flex items-center justify-center text-2xl">
                            {getAgentIcon(step.agent || step.agent_name || '')}
                        </div>

                        {/* Content */}
                        <div className="brutalist-card p-5">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-[var(--dark)] text-lg uppercase">
                                        {step.agent || step.agent_name || 'Agent'}
                                    </span>
                                    <span className="px-2 py-1 border-[2px] border-[var(--border-color)] text-xs font-mono font-bold text-[var(--text-secondary)]">
                                        Step {step.step_number}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    {/* Confidence */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[var(--text-secondary)] font-medium">Confidence:</span>
                                        <span className={`font-mono font-bold px-2 py-1 border-[2px] ${step.confidence >= 0.7
                                            ? 'border-[var(--secondary)] text-[var(--secondary)]'
                                            : step.confidence >= 0.4
                                                ? 'border-[var(--primary)] text-[var(--primary)]'
                                                : 'border-[var(--dark)] text-[var(--dark)]'
                                            }`}>
                                            {(step.confidence * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                    {/* Duration */}
                                    <span className="text-[var(--text-secondary)] font-mono font-bold">
                                        {formatDuration(step.duration_ms)}
                                    </span>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="text-sm text-[var(--text-secondary)] mb-3 p-3 border-l-[3px] border-[var(--primary)] bg-[var(--bg-light)]">
                                <strong className="text-[var(--dark)]">Action:</strong> {step.action}
                            </div>

                            {/* Summary */}
                            <div className="text-sm text-[var(--text-secondary)] mb-3 p-3 border-l-[3px] border-[var(--secondary)] bg-[var(--bg-light)]">
                                <strong className="text-[var(--dark)]">Summary:</strong> {step.summary || step.output_summary || 'No summary available'}
                            </div>

                            {/* Reasoning (expandable) */}
                            {step.reasoning && (
                                <details className="mt-4">
                                    <summary className="cursor-pointer text-sm text-[var(--dark)] font-bold uppercase tracking-wide hover:text-[var(--primary)] transition-colors">
                                        View Reasoning →
                                    </summary>
                                    <div className="mt-3 p-4 border-[3px] border-[var(--border-color-light)] bg-[var(--bg-paper)] text-sm text-[var(--text-secondary)] leading-relaxed">
                                        {step.reasoning}
                                    </div>
                                </details>
                            )}

                            {/* Tools Used */}
                            {step.tools_used && step.tools_used.length > 0 && (
                                <div className="flex items-center gap-2 mt-4 flex-wrap">
                                    <span className="text-xs text-[var(--text-secondary)] font-bold uppercase">Tools:</span>
                                    {step.tools_used.map((tool, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 border-[2px] border-[var(--border-color)] bg-[var(--bg-light)] text-xs text-[var(--dark)] font-mono font-bold"
                                        >
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
