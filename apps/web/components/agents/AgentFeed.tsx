'use client';

import { useEffect, useState, useRef } from 'react';
import { AgentLog } from '@maestro/shared';
import { useTwinStore } from '../../lib/store/useTwinStore';

interface AgentFeedProps {
  logs: AgentLog[];
}

export const AgentFeed: React.FC<AgentFeedProps> = ({ logs }) => {
  const { latestProposals, isCrisisActive, crisisPhase, crisisResolved } = useTwinStore();
  const [incoming, setIncoming] = useState<AgentLog[]>([]);
  const [filterAgent, setFilterAgent] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (latestProposals.length > 0) {
      setIncoming((prev) => [...latestProposals, ...prev].slice(0, 10));
    }
  }, [latestProposals]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getAgentBadge = (agent: AgentLog['agent_name'], isProposal: boolean) => {
    const base = (c: string, t: string, b: string) =>
      `${c} ${t} ${b}${isProposal ? ' animate-pulse' : ''}`;
    switch (agent) {
      case 'inventory_guardian': return base('bg-emerald-500/10', 'text-emerald-400', 'border-emerald-500/30');
      case 'kitchen_conductor': return base('bg-amber-500/10', 'text-amber-400', 'border-amber-500/30');
      case 'guest_alchemist': return base('bg-purple-500/10', 'text-purple-400', 'border-purple-500/30');
      case 'staff_harmony': return base('bg-blue-500/10', 'text-blue-400', 'border-blue-500/30');
      case 'demand_seer': return base('bg-teal-500/10', 'text-teal-400', 'border-teal-500/30');
      case 'maestro_orchestrator': return base('bg-rose-500/20', 'text-rose-400', 'border-rose-500/40');
      default: return base('bg-zinc-800', 'text-zinc-300', 'border-zinc-700');
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Multi-Agent Swarm Live Feed</h3>
          <p className="text-xs text-zinc-400">Real-time negotiations, proposals and consensus</p>
        </div>
        <div className="flex items-center gap-2">
          {crisisPhase && (
            <span className="text-[10px] px-2 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse font-bold">
              PHASE {crisisPhase.phase + 1}: {crisisPhase.label.toUpperCase()}
            </span>
          )}
          {crisisResolved && (
            <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
              CRISIS AVERTED
            </span>
          )}
          {isCrisisActive && !crisisPhase && (
            <span className="text-[10px] px-2 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse font-bold">
              CRISIS ACTIVE
            </span>
          )}
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            Live
          </span>
        </div>
      </div>

      {/* Crisis Phase Banner */}
      {crisisPhase && (
        <div className="mb-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-rose-400 uppercase">
              Phase {crisisPhase.phase + 1} of 4: {crisisPhase.label}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-rose-500 transition-all"
                style={{ width: `${((crisisPhase.phase + 1) / 4) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-rose-300">{crisisPhase.message}</p>
        </div>
      )}

      {crisisResolved && (
        <div className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
          <p className="text-xs font-bold text-emerald-400">Crisis Resolved - Global Score +14.2%</p>
          <p className="text-[10px] text-emerald-300 mt-1">Multi-Agent Swarm successfully stabilized operations</p>
        </div>
      )}

      {/* Incoming Proposals Banner */}
      {incoming.length > 0 && (
        <div className="mb-3 space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
            Incoming Agent Proposals
          </span>
          {incoming.slice(0, 3).map((proposal) => (
            <div
              key={proposal.id}
              className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-3 text-xs animate-in slide-in-from-top-1 duration-300"
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wider ${getAgentBadge(proposal.agent_name, true)}`}>
                  {proposal.agent_name.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-zinc-500">
                  Score: {proposal.utility_score}
                </span>
              </div>
              <p className="text-zinc-300 font-medium">{proposal.action_type.replace(/_/g, ' ')}</p>
              <div className="mt-1 rounded bg-zinc-950/80 p-2 text-zinc-400 font-mono text-[11px] overflow-x-auto">
                {(proposal.proposal as Record<string, unknown>).reason as string}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        <select
          value={filterAgent}
          onChange={(e) => setFilterAgent(e.target.value)}
          className="text-[10px] rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-zinc-300 focus:outline-none cursor-pointer"
        >
          <option value="all">All Agents</option>
          <option value="guest_alchemist">Guest Alchemist</option>
          <option value="kitchen_conductor">Kitchen Conductor</option>
          <option value="inventory_guardian">Inventory Guardian</option>
          <option value="staff_harmony">Staff Harmony</option>
          <option value="demand_seer">Demand Seer</option>
          <option value="maestro_orchestrator">Orchestrator</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-[10px] rounded-lg border border-zinc-800 bg-zinc-900 px-2 py-1 text-zinc-300 focus:outline-none cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="accepted">Accepted</option>
          <option value="overridden">Overridden</option>
          <option value="proposed">Proposed</option>
        </select>
      </div>

      {/* Feed */}
      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
        {logs
          .filter((log) => filterAgent === 'all' || log.agent_name === filterAgent)
          .filter((log) => filterStatus === 'all' || log.status === filterStatus)
          .map((log) => (
          <div
            key={log.id}
            className="rounded-xl border border-zinc-900 bg-zinc-900/60 p-3.5 text-xs transition-all hover:border-zinc-800"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase tracking-wider ${getAgentBadge(log.agent_name, false)}`}>
                  {log.agent_name.replace('_', ' ')}
                </span>
                {log.status === 'accepted' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                    ACCEPTED
                  </span>
                )}
                {log.status === 'overridden' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-mono">
                    OVERRIDDEN
                  </span>
                )}
              </div>
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
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
