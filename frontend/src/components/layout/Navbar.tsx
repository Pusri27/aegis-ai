'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/analysis', label: 'Analysis' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/history', label: 'History' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-[var(--bg-paper)] border-b-[3px] border-[var(--border-color)] shadow-md'
                : 'bg-[var(--bg-light)]'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo - Bold & Geometric */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 border-[3px] border-[var(--dark)] bg-[var(--primary)] flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--secondary)]">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-[var(--dark)] tracking-tight">
                            Aegis<span className="text-[var(--primary)]">AI</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="underline-accent text-[var(--text-primary)] font-medium hover:text-[var(--primary)] transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button - Brutalist */}
                    <div className="hidden md:flex items-center">
                        <Link
                            href="/analysis"
                            className="btn-brutalist-primary"
                        >
                            Start Now
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 border-[3px] border-[var(--dark)] bg-[var(--bg-paper)] hover:bg-[var(--dark)] hover:text-white transition-colors"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu - Brutalist Style */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t-[3px] border-[var(--border-color)] bg-[var(--bg-paper)]"
                    >
                        <div className="px-4 py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block py-3 px-4 border-l-[3px] border-[var(--border-color-light)] text-[var(--text-primary)] font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/analysis"
                                onClick={() => setIsMenuOpen(false)}
                                className="btn-brutalist-primary w-full justify-center mt-4"
                            >
                                Start Analysis
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
