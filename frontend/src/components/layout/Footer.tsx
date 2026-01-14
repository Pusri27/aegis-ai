import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t-[3px] border-[var(--border-color)] mt-auto bg-[var(--bg-paper)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center space-x-3 mb-6 group">
                            <div className="w-12 h-12 border-[3px] border-[var(--dark)] bg-[var(--primary)] flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--secondary)]">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-[var(--dark)]">
                                Aegis<span className="text-[var(--primary)]">AI</span>
                            </span>
                        </Link>
                        <p className="text-[var(--text-secondary)] max-w-md leading-relaxed text-lg">
                            Autonomous Explainable AI Decision System. Make smarter decisions with
                            multi-agent AI analysis that you can understand and trust.
                        </p>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-bold text-[var(--dark)] mb-4 text-lg uppercase tracking-wide">Product</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/analysis" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors font-medium">
                                    New Analysis
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors font-medium">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/history" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors font-medium">
                                    History
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-bold text-[var(--dark)] mb-4 text-lg uppercase tracking-wide">Resources</h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors font-medium">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors font-medium">
                                    API Reference
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors font-medium">
                                    GitHub
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t-[3px] border-[var(--border-color)] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[var(--text-secondary)] font-mono text-sm">
                        © {new Date().getFullYear()} AegisAI. Built with Next.js & FastAPI.
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-[var(--text-secondary)] text-sm">Powered by</span>
                        <span className="px-3 py-1 border-[2px] border-[var(--primary)] text-[var(--primary)] font-bold text-sm">
                            OpenRouter
                        </span>
                        <span className="text-[var(--text-secondary)]">+</span>
                        <span className="px-3 py-1 border-[2px] border-[var(--secondary)] text-[var(--secondary)] font-bold text-sm">
                            LangChain
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
