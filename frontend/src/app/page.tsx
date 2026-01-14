'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Globe, Shield, Target, ArrowRight, Zap } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const features = [
    {
      number: '01',
      title: 'Research Agent',
      description: 'Scans market landscapes, competitor analysis, and industry trends to build comprehensive context.',
      icon: Globe,
      color: 'primary'
    },
    {
      number: '02',
      title: 'Analysis Agent',
      description: 'Processes data through multiple frameworks to identify patterns and opportunities.',
      icon: Brain,
      color: 'secondary'
    },
    {
      number: '03',
      title: 'Risk Assessment',
      description: 'Evaluates potential pitfalls with severity scoring and mitigation strategies.',
      icon: Shield,
      color: 'primary'
    },
    {
      number: '04',
      title: 'Decision Engine',
      description: 'Synthesizes insights into clear, actionable recommendations with confidence scores.',
      icon: Target,
      color: 'secondary'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-light)]">
      <Navbar />

      {/* Hero Section - Asymmetric & Bold */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left: Bold Typography */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <div className="inline-block px-4 py-2 border-[3px] border-[var(--dark)] bg-[var(--accent)] mb-6">
                  <span className="font-mono text-sm font-bold uppercase tracking-wider text-[var(--dark)]">
                    AI Decision Intelligence
                  </span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="heading-brutalist text-6xl md:text-8xl mb-8"
              >
                Think <span className="text-accent-primary">Smarter.</span>
                <br />
                Decide <span className="text-accent-secondary">Faster.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl text-[var(--text-secondary)] mb-12 max-w-2xl leading-relaxed"
              >
                Four specialized AI agents collaborate to research, analyze, and explain complex business decisions.
                <strong className="text-[var(--text-primary)]"> No guesswork. Just clarity.</strong>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/analysis" className="btn-brutalist-primary group">
                  Start Analysis
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/dashboard" className="btn-brutalist-outline">
                  View Dashboard
                </Link>
              </motion.div>

              {/* Stats - Brutalist Style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-16 grid grid-cols-3 gap-6"
              >
                {[
                  { value: '4', label: 'AI Agents' },
                  { value: '<2min', label: 'Analysis' },
                  { value: 'Free', label: 'Forever' }
                ].map((stat, i) => (
                  <div key={i} className="border-l-[3px] border-[var(--dark)] pl-4">
                    <div className="font-mono text-3xl font-bold text-[var(--dark)]">{stat.value}</div>
                    <div className="text-sm text-[var(--text-secondary)] uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Visual Element */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                {/* Agent Flow Visualization */}
                <div className="brutalist-card brutalist-card-primary p-8">
                  <div className="space-y-6">
                    {[
                      { icon: Globe, label: 'Research', color: 'primary' },
                      { icon: Brain, label: 'Analyze', color: 'secondary' },
                      { icon: Shield, label: 'Assess', color: 'primary' },
                      { icon: Target, label: 'Decide', color: 'secondary' }
                    ].map((agent, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                        className="flex items-center gap-4"
                      >
                        <div className={`w-12 h-12 border-[3px] border-[var(--dark)] flex items-center justify-center bg-[var(--${agent.color})]`}>
                          <agent.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 h-[3px] bg-[var(--border-color-light)]" />
                        <span className="font-mono font-bold text-[var(--text-primary)]">{agent.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Accent Corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[var(--secondary)] -mt-4 -mr-4" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider section-divider-accent" />

      {/* Features Section - Asymmetric Grid */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">

          {/* Section Header */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <div className="number-badge">04</div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="heading-brutalist text-5xl md:text-6xl mb-6"
            >
              How It <span className="text-accent-primary">Works</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-[var(--text-secondary)] max-w-2xl"
            >
              A complete cognitive architecture designed to handle complex business scenarios with human-level reasoning.
            </motion.p>
          </div>

          {/* Features Grid - Staggered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`brutalist-card brutalist-card-${feature.color} ${i === 1 ? 'md:mt-12' : ''
                  } ${i === 2 ? 'md:mt-8' : ''}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="number-badge text-lg">{feature.number}</div>
                  <feature.icon className={`w-8 h-8 text-[var(--${feature.color})] mt-2`} />
                </div>

                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                  {feature.title}
                </h3>

                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Different Section */}
      <section className="py-20 px-4 md:px-8 bg-[var(--dark)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div>
              <h2 className="heading-brutalist text-5xl md:text-6xl text-[var(--text-inverse)] mb-6">
                Why <span className="text-accent-primary">AegisAI?</span>
              </h2>
              <p className="text-xl text-[var(--gray-light)] leading-relaxed mb-8">
                Most AI tools give you answers. We show you <strong className="text-white">how we got there.</strong>
              </p>

              <div className="space-y-4">
                {[
                  'Transparent reasoning timeline',
                  'Multi-agent collaboration',
                  'Explainable outcomes',
                  'Continuous learning from feedback'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-[var(--primary)] flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[var(--text-inverse)] font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="brutalist-card bg-[var(--bg-paper)] p-8">
                <div className="font-mono text-sm text-[var(--text-secondary)] mb-4">
                  // Example Output
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <span className="text-[var(--primary)] font-mono">→</span>
                    <span className="text-[var(--text-primary)]">Analyzed 47 data points</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[var(--secondary)] font-mono">→</span>
                    <span className="text-[var(--text-primary)]">Identified 3 key risks</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[var(--primary)] font-mono">→</span>
                    <span className="text-[var(--text-primary)]">Confidence: 94%</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[var(--secondary)] font-mono">✓</span>
                    <span className="text-[var(--text-primary)] font-bold">Recommendation ready</span>
                  </div>
                </div>
              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--accent)] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="heading-brutalist text-5xl md:text-7xl mb-8"
          >
            Ready to Deploy Your
            <br />
            <span className="text-accent-primary">Intelligence Unit?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[var(--text-secondary)] mb-12"
          >
            Start making smarter decisions today. No credit card required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/analysis" className="btn-brutalist-primary text-lg px-12 py-4">
              Launch Analysis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        {/* Background accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--primary)] opacity-5 -z-10" />
      </section>

      <Footer />
    </div>
  );
}
