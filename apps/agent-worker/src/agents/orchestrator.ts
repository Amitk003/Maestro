import type { AgentLog } from '@maestro/shared';
import type { TwinState } from '@maestro/shared';
import { callGemini, extractJSONArray } from '../llm/gemini';
import { SYSTEM_PROMPTS } from '../llm/prompts';

const AGENT_PRIORITY: Record<string, number> = {
  guest_alchemist: 5,
  kitchen_conductor: 4,
  inventory_guardian: 3,
  staff_harmony: 2,
  demand_seer: 1,
};

function heuristicResolve(proposals: AgentLog[]): AgentLog[] {
  const accepted: AgentLog[] = [];

  const byTarget = new Map<string, AgentLog[]>();
  for (const p of proposals) {
    const existing = byTarget.get(p.target_entity) || [];
    existing.push(p);
    byTarget.set(p.target_entity, existing);
  }

  for (const [, group] of byTarget) {
    group.sort((a, b) => {
      if (b.utility_score !== a.utility_score) return b.utility_score - a.utility_score;
      return (AGENT_PRIORITY[b.agent_name] || 0) - (AGENT_PRIORITY[a.agent_name] || 0);
    });

    for (let i = 0; i < group.length; i++) {
      accepted.push({ ...group[i], status: i === 0 ? 'accepted' : 'overridden' });
    }
  }

  return accepted;
}

export async function resolve(proposals: AgentLog[], state: TwinState): Promise<AgentLog[]> {
  if (proposals.length === 0) return [];

  try {
    const prompt = `Here are the current agent proposals:\n${JSON.stringify(proposals, null, 2)}\n\nHere is the current restaurant state:\n${JSON.stringify({ metrics: state.metrics, stations: state.stations.map((s) => ({ id: s.id, heat_index: s.heat_index })) }, null, 2)}\n\nResolve conflicts by setting each proposal's status to "accepted" or "overridden". Return the complete modified array.`;
    const text = await callGemini(SYSTEM_PROMPTS.orchestrator, prompt);
    if (text) {
      const parsed = extractJSONArray(text);
      if (parsed && Array.isArray(parsed)) {
        const resolved = parsed as Array<Record<string, unknown>>;
        const mapped = proposals.map((orig) => {
          const match = resolved.find((r: Record<string, unknown>) =>
            r.id === orig.id || (r.action_type === orig.action_type && r.target_entity === orig.target_entity)
          );
          return {
            ...orig,
            status: (match?.status === 'accepted' ? 'accepted' : 'overridden') as 'accepted' | 'overridden',
          };
        });
        if (mapped.some((m) => m.status === 'accepted')) {
          return mapped;
        }
      }
    }
  } catch {
    // fall through to heuristic
  }

  return heuristicResolve(proposals);
}
