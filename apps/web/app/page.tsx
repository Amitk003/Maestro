'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTwinStore } from '../lib/store/useTwinStore';
import { PageTransition } from '../components/ui/PageTransition';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

export default function Home() {
  const { state, isConnected, isCrisisActive, initSocket, triggerCrisis } = useTwinStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  return (
    <ErrorBoundary>
    <PageTransition>
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 selection:bg-rose-500 selection:text-white relative overflow-hidden font-sans">
      {/* Subtle Ambient Radial Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-rose-600/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-96 -left-40 h-[400px] w-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-96 -right-40 h-[400px] w-[600px] rounded-full bg-amber-600/10 blur-[120px]" />

      {/* Top Glassmorphic Navigation Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-zinc-900/80 bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-rose-500 via-amber-500 to-purple-600 p-[1px]">
            <div className="h-full w-full bg-zinc-950 rounded-[11px] flex items-center justify-center font-extrabold text-white text-sm tracking-widest">
              M
            </div>
          </div>
          <div>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              MAESTRO
            </span>
            <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
              v2.0 Swarm OS
            </span>
          </div>
        </div>

        {/* Real-time Telemetry Status Bar */}
        <div className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-mono bg-zinc-900/40 px-4 py-1.5 rounded-full border border-zinc-800/60">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-zinc-300">{isConnected ? 'Digital Twin Ticking' : 'Connecting to Worker...'}</span>
          </div>
          {state && (
            <>
              <span className="text-zinc-700">|</span>
              <div>Weather: <span className="text-zinc-200 font-semibold">{state.weather.condition} ({state.weather.temp_celsius}C)</span></div>
              <span className="text-zinc-700">|</span>
              <div>CSAT: <span className="text-emerald-400 font-semibold">{state.metrics.guest_delight_score} / 5</span></div>
            </>
          )}
        </div>

        {/* Nav Links Desktop */}
        <div className="hidden md:flex items-center gap-3 text-xs font-medium">
          <Link href="/customer/menu" className="text-zinc-400 hover:text-white transition-colors">Guest Portal</Link>
          <Link href="/staff/tasks" className="text-zinc-400 hover:text-white transition-colors">Staff UI</Link>
          <Link href="/staff/kds" className="text-zinc-400 hover:text-white transition-colors">KDS</Link>
          <Link href="/manager/dashboard" className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition-all shadow-sm">
            Manager Twin
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </header>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-b border-zinc-900/80 bg-zinc-950/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-3 text-sm"
        >
          <Link href="/customer/menu" onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white transition-colors">Guest Portal</Link>
          <Link href="/staff/tasks" onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white transition-colors">Staff UI</Link>
          <Link href="/staff/kds" onClick={() => setMobileMenuOpen(false)} className="text-zinc-400 hover:text-white transition-colors">KDS</Link>
          <Link href="/manager/dashboard" onClick={() => setMobileMenuOpen(false)} className="rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition-all inline-block text-center">
            Manager Twin
          </Link>
        </motion.div>
      )}

      {/* Main Hero Container */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center max-w-5xl mx-auto z-10">
        {isCrisisActive && (
          <div className="w-full mb-8 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 text-rose-300 font-mono text-xs flex items-center justify-center gap-3 animate-pulse backdrop-blur-md">
            <svg className="h-5 w-5 text-rose-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>CRISIS SIMULATED: Rain storm + Stadium event surge! Multi-agent swarm auto-resolving station bottlenecks...</span>
          </div>
        )}

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400 mb-6 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span>Adaptive Multi-Agent Restaurant Orchestration System</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          Your restaurant runs itself before crises happen.
        </h1>

        <p className="mt-6 text-base md:text-lg text-zinc-400 max-w-2xl font-normal leading-relaxed">
          Maestro models your restaurant as a continuous living Digital Twin. Specialized AI agents negotiate kitchen loads, inventory decay, guest vibes, and staff fatigue in real time for maximum global outcome.
        </p>

        {/* Hero Interactive Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={triggerCrisis}
            className="rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 px-7 py-3.5 text-xs font-bold text-white shadow-xl shadow-rose-950/40 hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2.5"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>SIMULATE PEAK-HOUR CRISIS</span>
          </button>
          <Link
            href="/manager/dashboard"
            className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-7 py-3.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:border-zinc-700 transition-all flex items-center gap-2"
          >
            <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Digital Twin Command Center</span>
          </Link>
        </div>

        {/* Feature Role Cards with Custom Styled Inline SVGs */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="mt-20 grid w-full grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
          <Link
            href="/customer/menu"
            className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 hover:border-purple-500/40 hover:bg-zinc-900/80 backdrop-blur-sm transition-all duration-300 shadow-lg block"
          >
            <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-purple-500/20 transition-all">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">Guest Alchemist Portal</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-normal">
              Describe mood, timing constraints, or dietary needs. AI crafts a personalized dining sequence with transparent wait progress.
            </p>
          </Link>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
          <Link
            href="/staff/tasks"
            className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 hover:border-amber-500/40 hover:bg-zinc-900/80 backdrop-blur-sm transition-all duration-300 shadow-lg block"
          >
            <div className="h-11 w-11 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-amber-500/20 transition-all">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">Staff Harmony Feed</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-normal">
              Ranked proactive micro-tasks for waiters and chefs with 1-tap execution. Fatigue-aware shift scheduling and coordination.
            </p>
          </Link>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
          <Link
            href="/manager/dashboard"
            className="group rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 hover:border-rose-500/40 hover:bg-zinc-900/80 backdrop-blur-sm transition-all duration-300 shadow-lg block"
          >
            <div className="h-11 w-11 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-rose-500/20 transition-all">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">Digital Twin Command Center</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-normal">
              Live 2D floorplan heatmaps, real-time agent negotiation logs, and continuous what-if scenario simulator engine.
            </p>
          </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
    </PageTransition>
    </ErrorBoundary>
  );
}
