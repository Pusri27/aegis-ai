'use client';

import { motion } from 'framer-motion';
import type { Decision } from '@/types';

interface ResultCardProps {
    decision: Decision;
}

export default function ResultCard({ decision }: ResultCardProps) {
    const verdictEmoji = {
        'GO': '✅',
        'NO-GO': '❌',
        'CONDITIONAL': '⚠️',
    };

    // Use confidence with fallback to confidence_score for backward compatibility
    const confidenceValue = decision.confidence ?? decision.confidence_score ?? 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="brutalist-card p-8"
        >
            {/* Verdict Header */}
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 border-[3px] border-[var(--dark)] bg-[var(--accent)] flex items-center justify-center text-4xl">
                        {verdictEmoji[decision.verdict as keyof typeof verdictEmoji] || '🤔'}
                    </div>
                    <div>
                        <span className="px-6 py-3 border-[3px] border-[var(--dark)] bg-[var(--primary)] text-white font-bold text-xl uppercase">
                            {decision.verdict}
                        </span>
                    </div>
                </div>

                {/* Confidence Meter */}
                <div className="text-right">
                    <div className="text-sm text-[var(--text-secondary)] mb-2 font-bold uppercase tracking-wide">Confidence</div>
                    <div className="flex items-center gap-3">
                        <div className="w-32 h-3 border-[2px] border-[var(--dark)] bg-[var(--bg-light)] overflow-hidden">
                            <motion.div
                                className="h-full bg-[var(--primary)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${confidenceValue * 100}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                        </div>
                        <span className="font-mono font-bold text-[var(--dark)] text-xl">
                            {(confidenceValue * 100).toFixed(0)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="mb-8 p-6 border-[3px] border-[var(--border-color-light)] bg-[var(--bg-light)]">
                <h3 className="text-lg font-bold text-[var(--dark)] mb-3 uppercase tracking-wide">Summary</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed text-base">{decision.summary}</p>
            </div>

            {/* Key Factors */}
            {decision.key_factors && decision.key_factors.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-[var(--dark)] mb-4 uppercase tracking-wide">Key Factors</h3>
                    <div className="space-y-3">
                        {decision.key_factors.map((factor, index) => {
                            // Handle both string and object formats
                            const isString = typeof factor === 'string';
                            const factorText = isString ? factor : factor.factor;
                            const factorImpact = isString ? 'neutral' : factor.impact;
                            const factorWeight = isString ? 0 : factor.weight;
                            const factorExplanation = isString ? '' : factor.explanation;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-3 p-4 border-[3px] border-[var(--border-color-light)] bg-[var(--bg-paper)]"
                                >
                                    {!isString && (
                                        <div className={`w-10 h-10 border-[2px] flex items-center justify-center text-xl font-bold flex-shrink-0 ${factorImpact === 'positive'
                                            ? 'border-[var(--secondary)] text-[var(--secondary)]'
                                            : factorImpact === 'negative'
                                                ? 'border-[var(--primary)] text-[var(--primary)]'
                                                : 'border-[var(--border-color)] text-[var(--text-secondary)]'
                                            }`}>
                                            {factorImpact === 'positive' ? '↑' : factorImpact === 'negative' ? '↓' : '→'}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="font-bold text-[var(--dark)] mb-1">{factorText}</div>
                                        {factorExplanation && <div className="text-sm text-[var(--text-secondary)]">{factorExplanation}</div>}
                                    </div>
                                    {!isString && factorWeight > 0 && (
                                        <div className="px-3 py-1 border-[2px] border-[var(--border-color)] text-[var(--dark)] text-sm font-mono font-bold">
                                            {(factorWeight * 100).toFixed(0)}%
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Risks */}
            {decision.risks && decision.risks.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-[var(--dark)] mb-4 uppercase tracking-wide">Identified Risks</h3>
                    <div className="grid gap-4">
                        {decision.risks.slice(0, 3).map((risk, index) => {
                            // Handle both string and object formats
                            const isString = typeof risk === 'string';
                            const riskText = isString ? risk : risk.description;
                            const riskSeverity = isString ? 'medium' : risk.severity;
                            const riskCategory = isString ? 'general' : risk.category;
                            const riskMitigation = isString ? '' : risk.mitigation;

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-5 border-[3px] border-[var(--border-color)] bg-[var(--bg-paper)]"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className={`px-3 py-1 border-[2px] text-xs font-bold uppercase ${riskSeverity === 'critical' || riskSeverity === 'high'
                                            ? 'border-[var(--primary)] text-[var(--primary)]'
                                            : riskSeverity === 'medium'
                                                ? 'border-[var(--dark)] text-[var(--dark)]'
                                                : 'border-[var(--secondary)] text-[var(--secondary)]'
                                            }`}>
                                            {riskSeverity}
                                        </span>
                                        <span className="text-xs text-[var(--text-secondary)] font-mono font-bold">{riskCategory}</span>
                                    </div>
                                    <p className="text-sm text-[var(--text-secondary)] mb-3 leading-relaxed">{riskText}</p>
                                    {riskMitigation && (
                                        <div className="text-xs text-[var(--text-secondary)] p-3 border-l-[3px] border-[var(--secondary)] bg-[var(--bg-light)]">
                                            <strong className="text-[var(--dark)]">Mitigation:</strong> {riskMitigation}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {decision.recommendations && decision.recommendations.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-[var(--dark)] mb-4 uppercase tracking-wide">Recommendations</h3>
                    <ul className="space-y-3">
                        {decision.recommendations.map((rec, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-3"
                            >
                                <div className="w-6 h-6 border-[2px] border-[var(--primary)] flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-[var(--primary)] font-bold text-xs">{index + 1}</span>
                                </div>
                                <span className="text-[var(--text-secondary)] leading-relaxed">{rec}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Next Steps */}
            {decision.next_steps && decision.next_steps.length > 0 && (
                <div>
                    <h3 className="text-lg font-bold text-[var(--dark)] mb-4 uppercase tracking-wide">Next Steps</h3>
                    <div className="flex flex-wrap gap-3">
                        {decision.next_steps.map((step, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="px-4 py-2 border-[3px] border-[var(--primary)] bg-[var(--accent)] text-[var(--dark)] text-sm font-bold"
                            >
                                {index + 1}. {step}
                            </motion.span>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
