import type { AgentLog } from '@maestro/shared';

/**
 * Orchestrator scores proposals against a global utility function and
 * resolves conflicts. Highest-utility proposals are accepted; conflicting
 * proposals (same target_entity, different action) see the lower-utility
 * one overridden.
 */

const AGENT_PRIORITY: Record<string, number> = {
  guest_alchemist: 5,
  kitchen_conductor: 4,
  inventory_guardian: 3,
  staff_harmony: 2,
  demand_seer: 1,
};

export function resolve(proposals: AgentLog[]): AgentLog[] {
  const accepted: AgentLog[] = [];

  // Group proposals by target entity
  const byTarget = new Map<string, AgentLog[]>();
  for (const p of proposals) {
    const existing = byTarget.get(p.target_entity) || [];
    existing.push(p);
    byTarget.set(p.target_entity, existing);
  }

  for (const [, group] of byTarget) {
    // Sort by utility score descending, then by agent priority
    group.sort((a, b) => {
      if (b.utility_score !== a.utility_score) return b.utility_score - a.utility_score;
      return (AGENT_PRIORITY[b.agent_name] || 0) - (AGENT_PRIORITY[a.agent_name] || 0);
    });

    for (let i = 0; i < group.length; i++) {
      if (i === 0) {
        accepted.push({ ...group[i], status: 'accepted' });
      } else {
        accepted.push({ ...group[i], status: 'overridden' });
      }
    }
  }

  return accepted;
}
