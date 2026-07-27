import type { AgentLog, AgentName } from '@maestro/shared';
import type { LLMProposal } from './types';

export function llmProposalsToLogs(proposals: LLMProposal[], agentName: AgentName): AgentLog[] {
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
