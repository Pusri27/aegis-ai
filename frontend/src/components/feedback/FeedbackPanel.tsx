'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { feedbackApi } from '@/lib/api';
import type { FeedbackRequest } from '@/types';

interface FeedbackPanelProps {
    analysisId: string;
    onSubmitted?: () => void;
}

export default function FeedbackPanel({ analysisId, onSubmitted }: FeedbackPanelProps) {
    const [rating, setRating] = useState(0);
    const [accuracyRating, setAccuracyRating] = useState(0);
    const [helpfulnessRating, setHelpfulnessRating] = useState(0);
    const [comment, setComment] = useState('');
    const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            const feedback: FeedbackRequest = {
                analysis_id: analysisId,
                rating,
                accuracy_rating: accuracyRating || rating,
                helpfulness_rating: helpfulnessRating || rating,
                comment: comment || undefined,
                was_decision_correct: wasCorrect ?? undefined,
            };

            await feedbackApi.submit(feedback);
            setIsSubmitted(true);
            onSubmitted?.();
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card text-center"
            >
                <div className="text-4xl mb-4">🙏</div>
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                    Thank You for Your Feedback!
                </h3>
                <p className="text-[var(--text-secondary)]">
                    Your feedback helps AegisAI learn and improve future analyses.
                </p>
            </motion.div>
        );
    }

    const StarRating = ({
        value,
        onChange,
        label
    }: {
        value: number;
        onChange: (v: number) => void;
        label: string;
    }) => (
        <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                {label}
            </label>
            <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => onChange(star)}
                        className={`text-2xl transition-transform hover:scale-110 ${star <= value ? 'text-yellow-400' : 'text-[var(--text-muted)]'
                            }`}
                    >
                        ★
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
        >
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
                📝 How was this analysis?
            </h3>

            <StarRating
                value={rating}
                onChange={setRating}
                label="Overall Rating"
            />

            <StarRating
                value={accuracyRating}
                onChange={setAccuracyRating}
                label="Accuracy of Analysis"
            />

            <StarRating
                value={helpfulnessRating}
                onChange={setHelpfulnessRating}
                label="Helpfulness"
            />

            {/* Was decision correct? */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Was the decision recommendation accurate?
                </label>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setWasCorrect(true)}
                        className={`flex items-center space-x-2 px-4 py-2 border-[3px] font-bold uppercase text-sm transition-all ${wasCorrect === true
                            ? 'border-[var(--secondary)] bg-[var(--secondary)] text-white'
                            : 'border-[var(--border-color)] bg-transparent text-[var(--text-primary)] hover:border-[var(--secondary)] hover:bg-[var(--secondary)] hover:text-white'
                            }`}
                    >
                        <span>👍</span>
                        <span>Yes</span>
                    </button>
                    <button
                        onClick={() => setWasCorrect(false)}
                        className={`flex items-center space-x-2 px-4 py-2 border-[3px] font-bold uppercase text-sm transition-all ${wasCorrect === false
                            ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                            : 'border-[var(--border-color)] bg-transparent text-[var(--text-primary)] hover:border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'
                            }`}
                    >
                        <span>👎</span>
                        <span>No</span>
                    </button>
                </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Additional Comments (Optional)
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What could be improved? Any missing factors?"
                    className="textarea"
                    rows={3}
                />
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                className={`w-full btn-primary ${rating === 0 || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>

            <p className="text-xs text-[var(--text-muted)] text-center mt-3">
                Your feedback will be used to improve future analyses
            </p>
        </motion.div>
    );
}
