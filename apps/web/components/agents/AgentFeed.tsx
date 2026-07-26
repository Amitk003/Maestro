'use client';

import React from 'react';
import { AgentLog } from '@maestro/shared';

interface AgentFeedProps {
  logs: AgentLog[];
}

export const AgentFeed: React.FC<AgentFeedProps> = ({ logs }) => {
  const getAgentBadge = (agent: AgentLog['agent_name']) => {
    switch (agent) {
      case 'inventory_guardian': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'kitchen_conductor': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'guest_alchemist': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'staff_harmony': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'demand_seer': return 'bg-teal-500/10 text-teal-400 border-teal-500/30';
      case 'maestro_orchestrator': return 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold';
      default: return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Multi-Agent Swarm Live Feed</h3>
          <p className="text-xs text-zinc-400">Real-time negotiations, proposals & consensus</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span> Live Swarm Active
        </span>
      </div>

      <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
        {logs.map((log) => (
          <div
            key={log.id}
            className="rounded-xl border border-zinc-900 bg-zinc-900/60 p-3.5 text-xs transition-all hover:border-zinc-800"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wider ${getAgentBadge(log.agent_name)}`}>
                {log.agent_name.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-zinc-500">
                Score: {log.utility_score} | {new Date(log.created_at).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-zinc-300 font-medium">{log.action_type.replace(/_/g, ' ')}</p>
            <div className="mt-1 rounded bg-zinc-950/80 p-2 text-zinc-400 font-mono text-[11px] overflow-x-auto">
              {JSON.stringify(log.proposal, null, 2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
