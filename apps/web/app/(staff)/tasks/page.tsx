'use client';

import React, { useEffect } from 'react';
import { useTwinStore } from '../../../lib/store/useTwinStore';
import Link from 'next/link';

export default function StaffTasksPage() {
  const { state, initSocket, resolveTask } = useTwinStore();

  useEffect(() => {
    initSocket();
  }, [initSocket]);

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse';
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'attention': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Staff Harmony Feed</h1>
            <p className="text-xs text-zinc-400">Proactive ranked micro-tasks & fatigue management</p>
          </div>
          <Link href="/" className="text-xs text-zinc-400 hover:text-white">← Home</Link>
        </div>

        {/* Staff Energy / Fatigue Header Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 mb-8 flex justify-between items-center">
          <div>
            <span className="text-xs text-zinc-400 uppercase font-mono">Shift Energy Monitor</span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              {state?.metrics.staff_energy_avg || 78}% Optimal
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-zinc-400 font-mono">Active Waiters: 3</span>
            <div className="text-xs text-zinc-500 mt-0.5">Next micro-break scheduled in 25m</div>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Ranked Micro-Task Action Feed</h2>

          {state?.staffTasks.map((task) => (
            <div
              key={task.id}
              className={`rounded-2xl border p-5 transition-all ${
                task.status === 'completed'
                  ? 'border-zinc-800 bg-zinc-900/20 opacity-50'
                  : 'border-zinc-800 bg-zinc-900/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border ${getUrgencyBadge(task.urgency)}`}>
                  {task.urgency}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {new Date(task.created_at).toLocaleTimeString()}
                </span>
              </div>

              <h3 className="font-bold text-white text-base">{task.title}</h3>
              <p className="text-xs text-zinc-400 mt-1">{task.description}</p>

              {task.status !== 'completed' ? (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => resolveTask(task.id)}
                    className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-black hover:bg-zinc-200 transition"
                  >
                    ✓ Accept & Execute
                  </button>
                  <button className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs text-zinc-400 hover:text-white transition">
                    Snooze 2m
                  </button>
                </div>
              ) : (
                <div className="mt-3 text-xs text-emerald-400 font-mono">✓ Task Executed</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
