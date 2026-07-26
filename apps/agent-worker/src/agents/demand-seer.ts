import type { TwinState, AgentLog, AgentName } from '@maestro/shared';
import { callGemini, extractJSONArray } from '../llm/gemini';
import { SYSTEM_PROMPTS, buildAgentStatePrompt } from '../llm/prompts';
import type { LLMProposal } from '../llm/types';

function heuristicPropose(state: TwinState): AgentLog[] {
  const logs: AgentLog[] = [];
  const timestamp = new Date().toISOString();

  if (state.weather.condition === 'rainy' || state.weather.condition === 'cold') {
    logs.push({
      id: `DS_${Date.now()}`,
      agent_name: 'demand_seer',
      action_type: 'demand_forecast',
      target_entity: 'RESTAURANT_GLOBAL',
      proposal: {
        action: 'Increase seating forecast by 20% for next 2 hours',
        reason: `${state.weather.condition} weather with local event '${state.localEvent.title}' nearby - prepare for surge`,
        expected_surge_pct: 20,
        surge_duration_hours: 2,
        suggested_actions: ['Pre-stage 4 extra table settings', 'Alert kitchen for 25% volume increase'],
      },
      utility_score: 9.3,
      status: 'proposed',
      created_at: timestamp,
    });
  }

  if (state.localEvent.expected_surge === 'high') {
    logs.push({
      id: `DS_EVENT_${Date.now()}`,
      agent_name: 'demand_seer',
      action_type: 'event_surge_warning',
      target_entity: 'RESTAURANT_GLOBAL',
      proposal: {
        action: 'Activate pre-rush preparation protocol',
        reason: `Event '${state.localEvent.title}' nearby (${state.localEvent.location}) expected to end soon`,
        expected_surge_pct: 35,
      },
      utility_score: 9.5,
      status: 'proposed',
      created_at: timestamp,
    });
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
    const text = await callGemini(SYSTEM_PROMPTS.demand_seer, buildAgentStatePrompt('demand_seer', state));
    if (text) {
      const parsed = extractJSONArray(text);
      if (parsed) {
        return llmProposalsToLogs(parsed as LLMProposal[], 'demand_seer');
      }
    }
  } catch {
    // fall through to heuristic
  }
  return heuristicPropose(state);
}
