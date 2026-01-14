'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BentoCardProps {
    children?: ReactNode;
    className?: string;
    title?: string;
    description?: string;
    icon?: ReactNode;
    delay?: number;
}

export default function BentoCard({
    children,
    className = "",
    title,
    description,
    icon,
    delay = 0
}: BentoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className={`glass-panel p-6 relative overflow-hidden group ${className}`}
        >
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col">
                {icon && (
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:border-purple-500/50 group-hover:shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                        {icon}
                    </div>
                )}

                {title && (
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2 group-hover:text-purple-300 transition-colors">
                        {title}
                    </h3>
                )}

                {description && (
                    <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
                        {description}
                    </p>
                )}

                <div className="mt-auto">
                    {children}
                </div>
            </div>
        </motion.div>
    );
}
