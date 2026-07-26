'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useTwinStore } from '../lib/store/useTwinStore';

export default function Home() {
  const { state, isConnected, isCrisisActive, initSocket, triggerCrisis } = useTwinStore();

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white selection:bg-rose-500 selection:text-white">
      {/* Top Banner */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-black text-lg">
            M
          </div>
          <div>
            <span className="text-xl font-black tracking-tight">MAESTRO</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
              v2.0 Swarm OS
            </span>
          </div>
        </div>

        {/* System Telemetry Bar */}
        <div className="hidden md:flex items-center gap-6 text-xs text-zinc-400 font-mono">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            {isConnected ? 'Digital Twin Ticking' : 'Connecting to Worker...'}
          </div>
          {state && (
            <>
              <div>Weather: <span className="text-zinc-200">{state.weather.condition} ({state.weather.temp_celsius}°C)</span></div>
              <div>CSAT: <span className="text-emerald-400">{state.metrics.guest_delight_score} / 5</span></div>
            </>
          )}
        </div>

        {/* Role Navigation */}
        <div className="flex items-center gap-3">
          <Link href="/customer/menu" className="text-xs text-zinc-400 hover:text-white transition">Guest Portal</Link>
          <Link href="/staff/tasks" className="text-xs text-zinc-400 hover:text-white transition">Staff UI</Link>
          <Link href="/staff/kds" className="text-xs text-zinc-400 hover:text-white transition">KDS</Link>
          <Link href="/manager/dashboard" className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-zinc-200 transition">
            Manager Twin
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center max-w-5xl mx-auto">
        {isCrisisActive && (
          <div className="w-full mb-8 rounded-2xl bg-rose-500/20 border border-rose-500/50 p-4 text-rose-300 font-mono text-sm animate-bounce">
            🔥 CRISIS SIMULATED: Rain storm + Stadium event surge! Multi-agent swarm auto-resolving bottlenecks...
          </div>
        )}

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/60 text-xs text-zinc-400 mb-6">
          <span className="h-2 w-2 rounded-full bg-rose-500"></span>
          Adaptive Multi-Agent Restaurant Orchestration System
        </div>

        <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-none bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
          Your restaurant runs itself before crises happen.
        </h1>

        <p className="mt-6 text-lg text-zinc-400 max-w-2xl font-light">
          Maestro models your restaurant as a continuous living Digital Twin. Specialized AI agents continuously negotiate kitchen loads, inventory decay, guest vibes, and staff fatigue for maximum global profit and guest delight.
        </p>

        {/* Demo Crisis Trigger Superpower Button */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={triggerCrisis}
            className="rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 px-8 py-4 text-sm font-bold text-white shadow-xl hover:from-rose-500 hover:to-amber-500 transition active:scale-95 flex items-center gap-2"
          >
            🔥 SIMULATE PEAK-HOUR CRISIS
          </button>
          <Link
            href="/manager/dashboard"
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-8 py-4 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 transition"
          >
            Open Digital Twin Command Center
          </Link>
        </div>

        {/* Interactive Role Cards */}
        <div className="mt-20 grid w-full grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <Link href="/customer/menu" className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-purple-500/50 hover:bg-zinc-900/80 transition">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition">
              ✨
            </div>
            <h3 className="text-lg font-bold text-white">Guest Alchemist Portal</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Describe mood, time constraints, dietary needs. AI crafts a personalized dining sequence with transparent wait updates.
            </p>
          </Link>

          <Link href="/staff/tasks" className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-amber-500/50 hover:bg-zinc-900/80 transition">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-white">Staff Harmony Feed</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Ranked proactive micro-tasks for waiters and chefs with 1-tap execution. Fatigue-aware shift rotation.
            </p>
          </Link>

          <Link href="/manager/dashboard" className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-rose-500/50 hover:bg-zinc-900/80 transition">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition">
              📊
            </div>
            <h3 className="text-lg font-bold text-white">Digital Twin Command Center</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Live 2D floorplan heatmaps, real-time agent negotiation logs, and continuous what-if scenario simulator.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
