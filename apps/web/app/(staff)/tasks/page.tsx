'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTwinStore } from '../../../lib/store/useTwinStore';
import { useToastStore } from '../../../lib/store/useToastStore';
import type { StaffTask } from '@maestro/shared';
import { PageTransition } from '../../../components/ui/PageTransition';
import { ErrorBoundary } from '../../../components/ui/ErrorBoundary';

export default function StaffTasksPage() {
  const { state, initSocket, resolveTask } = useTwinStore();
  const addToast = useToastStore((s) => s.addToast);
  const [tasks, setTasks] = useState<StaffTask[]>([]);
  const [resolving, setResolving] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/staff/tasks');
      const data = await res.json();
      if (data.tasks) {
        setTasks(data.tasks.sort((a: StaffTask, b: StaffTask) => {
          const urgencyRank: Record<string, number> = { critical: 0, urgent: 1, attention: 2, normal: 3 };
          return (urgencyRank[a.urgency] ?? 99) - (urgencyRank[b.urgency] ?? 99);
        }));
      }
    } catch {
      addToast('Failed to fetch tasks', 'error');
    }
  }, []);

  useEffect(() => {
    initSocket();
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, [initSocket, fetchTasks]);

  const handleResolve = async (taskId: string) => {
    setResolving(taskId);
    try {
      await fetch('/api/staff/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: 'completed' }),
      });
      resolveTask(taskId);
      fetchTasks();
    } catch {
      addToast('Failed to resolve task, using local state', 'error');
      resolveTask(taskId);
    } finally {
      setResolving(null);
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse';
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'attention': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const twinTasks = state?.staffTasks || [];
  const displayTasks = tasks.length > 0 ? tasks : twinTasks;

  return (
    <ErrorBoundary>
    <PageTransition>
    <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-zinc-900 pb-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Staff Harmony Feed</h1>
            <p className="text-xs text-zinc-400">Proactive ranked micro-tasks and fatigue management</p>
          </div>
          <Link href="/" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 mb-8 flex justify-between items-center">
          <div>
            <span className="text-xs text-zinc-400 uppercase font-mono">Shift Energy Monitor</span>
            <div className="text-2xl font-black text-emerald-400 mt-0.5">
              {state?.metrics?.staff_energy_avg ?? 78}% Optimal
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-zinc-400 font-mono">Active Waiters: {state?.staffTasks.filter(t => t.status !== 'completed').length || 3}</span>
            <div className="text-xs text-zinc-500 mt-0.5">Next micro-break scheduled in {Math.max(5, Math.floor(Math.random() * 25 + 5))}m</div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold">Ranked Micro-Task Action Feed</h2>

          {displayTasks.length === 0 && (
            <div className="text-xs text-zinc-500 text-center py-12 border border-dashed border-zinc-800 rounded-2xl">
              No tasks available right now
            </div>
          )}

          {displayTasks.map((task: StaffTask) => (
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
                    onClick={() => handleResolve(task.id)}
                    disabled={resolving === task.id}
                    className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-black hover:bg-zinc-200 transition disabled:opacity-50"
                  >
                    {resolving === task.id ? 'Resolving...' : 'Accept and Execute'}
                  </button>
                  <button
                    onClick={() => addToast('Task snoozed for 2 minutes', 'success')}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs text-zinc-400 hover:text-white transition"
                  >
                    Snooze 2m
                  </button>
                </div>
              ) : (
                <div className="mt-3 text-xs text-emerald-400 font-mono">Task Completed</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </PageTransition>
    </ErrorBoundary>
  );
}
