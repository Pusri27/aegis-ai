'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { analysisApi } from '@/lib/api';

export default function AnalysisPage() {
    const router = useRouter();
    const [problemStatement, setProblemStatement] = useState('');
    const [context, setContext] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Ref for auto-scrolling to textarea
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const exampleProblems = [
        "I want to start a SaaS platform for small businesses to manage their inventory using AI predictions. Is this a viable business idea?",
        "Should we pivot our e-commerce platform to focus on sustainable products? What are the risks and opportunities?",
        "I'm considering launching a mobile app for personal finance management targeting Gen Z. Is there market opportunity?",
    ];

    const handleSubmit = async () => {
        if (problemStatement.length < 20) {
            setError('Please provide a more detailed problem statement (at least 20 characters).');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await analysisApi.create({
                problem_statement: problemStatement,
                context: context || undefined,
            });

            // Redirect to the analysis result page
            router.push(`/analysis/${response.id}`);
        } catch (err) {
            console.error('Failed to create analysis:', err);
            setError('Failed to start analysis. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExampleClick = (example: string) => {
        setProblemStatement(example);

        // Smooth scroll to textarea
        setTimeout(() => {
            textareaRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            textareaRef.current?.focus();
        }, 100);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--bg-light)]">
            <Navbar />

            <main className="flex-1 pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <div className="inline-block mb-6">
                            <div className="number-badge">01</div>
                        </div>

                        <h1 className="heading-brutalist text-5xl md:text-6xl mb-6">
                            Start New <span className="text-accent-primary">Analysis</span>
                        </h1>

                        <p className="text-xl text-[var(--text-secondary)] max-w-3xl leading-relaxed">
                            Describe your business idea, decision, or problem. Our multi-agent AI will analyze it
                            from multiple perspectives and provide an explainable recommendation.
                        </p>
                    </motion.div>

                    {/* Main Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="brutalist-card brutalist-card-primary p-8 md:p-10 mb-8"
                    >
                        {/* Problem Statement */}
                        <div className="mb-8">
                            <label className="block text-xl font-bold text-[var(--dark)] mb-4 uppercase tracking-wide">
                                What would you like to analyze? *
                            </label>
                            <textarea
                                ref={textareaRef}
                                value={problemStatement}
                                onChange={(e) => setProblemStatement(e.target.value)}
                                placeholder="Describe your business idea, startup concept, or decision you need help with..."
                                className="w-full min-h-[200px] p-4 border-[3px] border-[var(--border-color)] bg-[var(--bg-paper)] text-[var(--text-primary)] font-medium resize-none focus:outline-none focus:border-[var(--primary)] transition-colors"
                                rows={8}
                            />
                            <div className="flex justify-between mt-3">
                                <span className="text-sm text-[var(--text-secondary)] font-medium">
                                    Be as specific as possible for better analysis
                                </span>
                                <span className={`text-sm font-mono font-bold ${problemStatement.length < 20
                                    ? 'text-[var(--primary)]'
                                    : 'text-[var(--secondary)]'
                                    }`}>
                                    {problemStatement.length} chars
                                </span>
                            </div>
                        </div>

                        {/* Additional Context */}
                        <div className="mb-8">
                            <label className="block text-xl font-bold text-[var(--dark)] mb-4 uppercase tracking-wide">
                                Additional Context <span className="text-[var(--text-secondary)] text-sm normal-case">(Optional)</span>
                            </label>
                            <textarea
                                value={context}
                                onChange={(e) => setContext(e.target.value)}
                                placeholder="Any additional information that might help the analysis (target market, budget, timeline, competitors, etc.)"
                                className="w-full min-h-[120px] p-4 border-[3px] border-[var(--border-color)] bg-[var(--bg-paper)] text-[var(--text-primary)] font-medium resize-none focus:outline-none focus:border-[var(--secondary)] transition-colors"
                                rows={4}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mb-6 p-4 border-[3px] border-[var(--primary)] bg-[var(--accent)] text-[var(--dark)] font-bold"
                            >
                                ⚠️ {error}
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || problemStatement.length < 20}
                            className="btn-brutalist-primary w-full text-lg py-5 justify-center font-bold"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Starting Analysis...</span>
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-3">
                                    <Sparkles className="w-5 h-5" />
                                    <span>Start Analysis</span>
                                    <ArrowRight className="w-5 h-5" />
                                </span>
                            )}
                        </button>

                        {/* What happens next */}
                        <div className="mt-8 p-6 border-[3px] border-[var(--border-color-light)] bg-[var(--bg-light)]">
                            <h4 className="font-bold text-[var(--dark)] mb-4 text-lg uppercase tracking-wide">
                                What happens next?
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { number: '01', label: 'Research', desc: 'Gather data' },
                                    { number: '02', label: 'Analysis', desc: 'Evaluate' },
                                    { number: '03', label: 'Risk', desc: 'Assess' },
                                    { number: '04', label: 'Decision', desc: 'Recommend' }
                                ].map((step, i) => (
                                    <div key={i} className="text-center">
                                        <div className="inline-flex items-center justify-center w-12 h-12 border-[3px] border-[var(--dark)] bg-[var(--accent)] mb-2">
                                            <span className="font-mono font-bold text-[var(--dark)]">{step.number}</span>
                                        </div>
                                        <div className="font-bold text-[var(--dark)] text-sm">{step.label}</div>
                                        <div className="text-xs text-[var(--text-secondary)]">{step.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Example Problems */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-2xl font-bold text-[var(--dark)] mb-6 flex items-center gap-3">
                            <span className="text-3xl">💡</span>
                            Try an Example
                        </h3>

                        <div className="space-y-4">
                            {exampleProblems.map((example, index) => (
                                <motion.button
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                    onClick={() => handleExampleClick(example)}
                                    className="w-full text-left p-5 border-[3px] border-[var(--border-color-light)] bg-[var(--bg-paper)] hover:border-[var(--primary)] hover:translate-x-1 transition-all duration-200 group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 border-[2px] border-[var(--border-color-light)] flex items-center justify-center font-mono font-bold text-sm text-[var(--text-secondary)] group-hover:border-[var(--primary)] group-hover:text-[var(--primary)] transition-colors">
                                            {(index + 1).toString().padStart(2, '0')}
                                        </div>
                                        <p className="text-[var(--text-secondary)] leading-relaxed group-hover:text-[var(--text-primary)] transition-colors">
                                            {example}
                                        </p>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
