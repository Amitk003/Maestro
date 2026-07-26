import type { TwinState, AgentLog, AgentName } from '@maestro/shared';
import { callGemini, extractJSONArray } from '../llm/gemini';
import { SYSTEM_PROMPTS, buildAgentStatePrompt } from '../llm/prompts';
import type { LLMProposal } from '../llm/types';

function heuristicPropose(state: TwinState): AgentLog[] {
  const logs: AgentLog[] = [];
  const timestamp = new Date().toISOString();

  for (const ing of state.ingredients) {
    if (ing.freshness_pct < 30) {
      const linkedItems = state.menuItems.filter((m) =>
        m.ingredients.some((i) => i.ingredient_id === ing.id)
      );
      for (const item of linkedItems) {
        logs.push({
          id: `IG_${Date.now()}_${ing.id}`,
          agent_name: 'inventory_guardian',
          action_type: 'spoilage_salvage',
          target_entity: ing.id,
          proposal: {
            action: `Boost promotion of ${item.name} to salvage ${ing.name}`,
            reason: `${ing.name} at ${ing.freshness_pct}% freshness - boost ${item.name} by 25% to move stock`,
            ingredient: ing.name,
            menu_item: item.name,
            freshness_pct: ing.freshness_pct,
            spoilage_salvage_kg: parseFloat((ing.quantity * 0.3).toFixed(2)),
          },
          utility_score: 8.7,
          status: 'proposed',
          created_at: timestamp,
        });
      }
    }
  }

  return logs;
}

function llmProposalsToLogs(proposals: LLMProposal[], agentName: AgentName): AgentLog[] {
  const timestamp = new Date().toISOString();
  return proposals.map((p, i) => ({
    id: `${agentName}_LLM_${Date.now()}_${i}`,
    agent_name: agentName,
    action_type: p.action_type,
    target_entity: p.target_entity,
    proposal: p.proposal,
    utility_score: p.utility_score,
    status: 'proposed' as const,
    created_at: timestamp,
  }));
}

export async function propose(state: TwinState): Promise<AgentLog[]> {
  try {
    const text = await callGemini(SYSTEM_PROMPTS.inventory_guardian, buildAgentStatePrompt('inventory_guardian', state));
    if (text) {
      const parsed = extractJSONArray(text);
      if (parsed) {
        return llmProposalsToLogs(parsed as LLMProposal[], 'inventory_guardian');
      }
    }
  } catch {
    // fall through to heuristic
  }
  return heuristicPropose(state);
}
