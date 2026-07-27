import type { TwinState, AgentLog, AgentName } from '@maestro/shared';
import { callGemini, extractJSONArray } from '../llm/gemini';
import { SYSTEM_PROMPTS, buildAgentStatePrompt } from '../llm/prompts';
import { llmProposalsToLogs } from '../llm/llm-utils';
import type { LLMProposal } from '../llm/types';

function heuristicPropose(state: TwinState): AgentLog[] {
  const logs: AgentLog[] = [];
  const timestamp = new Date().toISOString();

  const overloadedStations = state.stations.filter((s) => s.heat_index > 80);
  for (const station of overloadedStations) {
    const viableTargets = state.stations.filter(
      (s) => s.id !== station.id && s.heat_index < 60
    );
    if (viableTargets.length > 0) {
      const target = viableTargets[0];
      logs.push({
        id: `KC_${Date.now()}_${station.id}`,
        agent_name: 'kitchen_conductor',
        action_type: 'station_reroute',
        target_entity: station.id,
        proposal: {
          action: `Reroute orders from ${station.name} to ${target.name}`,
          reason: `${station.name} heat index at ${station.heat_index}% - rerouting drops latency by estimated 8 minutes`,
          from_station: station.id,
          to_station: target.id,
          estimated_latency_reduction_min: 8,
        },
        utility_score: 9.1,
        status: 'proposed',
        created_at: timestamp,
      });
    }
  }

  return logs;
}

export async function propose(state: TwinState): Promise<AgentLog[]> {
  try {
    const text = await callGemini(SYSTEM_PROMPTS.kitchen_conductor, buildAgentStatePrompt('kitchen_conductor', state));
    if (text) {
      const parsed = extractJSONArray(text);
      if (parsed) {
        return llmProposalsToLogs(parsed as LLMProposal[], 'kitchen_conductor');
      }
    }
  } catch {
    // fall through to heuristic
  }
  return heuristicPropose(state);
}
