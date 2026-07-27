import type { TwinState, AgentLog, AgentName } from '@maestro/shared';
import { callGemini, extractJSONArray } from '../llm/gemini';
import { SYSTEM_PROMPTS, buildAgentStatePrompt } from '../llm/prompts';
import { llmProposalsToLogs } from '../llm/llm-utils';
import type { LLMProposal } from '../llm/types';

function heuristicPropose(state: TwinState): AgentLog[] {
  const logs: AgentLog[] = [];
  const timestamp = new Date().toISOString();

  const longWaitOrders = state.activeOrders.filter(
    (o) => o.status === 'in_prep' && Date.now() - new Date(o.created_at).getTime() > 15 * 60 * 1000
  );
  if (longWaitOrders.length > 0) {
    logs.push({
      id: `GA_${Date.now()}`,
      agent_name: 'guest_alchemist',
      action_type: 'recovery_perk',
      target_entity: `table_${longWaitOrders[0].table_id}`,
      proposal: {
        action: 'Serve complimentary amuse-bouche',
        reason: `Order ${longWaitOrders[0].id.slice(0, 8)} has been in prep for over 15 minutes`,
        perk_value: '$8.50',
      },
      utility_score: 8.3,
      status: 'proposed',
      created_at: timestamp,
    });
  }

  if (state.weather.condition === 'rainy' || state.weather.condition === 'cold') {
    logs.push({
      id: `GA_WEATHER_${Date.now()}`,
      agent_name: 'guest_alchemist',
      action_type: 'weather_menu_morph',
      target_entity: 'RESTAURANT_GLOBAL',
      proposal: {
        action: 'Promote comfort food and warm dishes',
        reason: `${state.weather.condition} weather increases comfort food demand by estimated 22%`,
        suggested_boost: 'Mushroom Risotto',
      },
      utility_score: 7.8,
      status: 'proposed',
      created_at: timestamp,
    });
  }

  return logs;
}

export async function propose(state: TwinState): Promise<AgentLog[]> {
  try {
    const text = await callGemini(SYSTEM_PROMPTS.guest_alchemist, buildAgentStatePrompt('guest_alchemist', state));
    if (text) {
      const parsed = extractJSONArray(text);
      if (parsed) {
        return llmProposalsToLogs(parsed as LLMProposal[], 'guest_alchemist');
      }
    }
  } catch {
    // fall through to heuristic
  }
  return heuristicPropose(state);
}
