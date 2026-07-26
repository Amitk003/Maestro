import type { TwinState, AgentLog, StaffTask, AgentName } from '@maestro/shared';
import { callGemini, extractJSON } from '../llm/gemini';
import { SYSTEM_PROMPTS, buildAgentStatePrompt } from '../llm/prompts';
import type { LLMStaffResult } from '../llm/types';

function heuristicPropose(state: TwinState): { logs: AgentLog[]; tasks: StaffTask[] } {
  const logs: AgentLog[] = [];
  const tasks: StaffTask[] = [];
  const timestamp = new Date().toISOString();

  const dirtyTables = state.tables.filter((t) => t.status === 'dirty');
  if (dirtyTables.length > 0) {
    const task: StaffTask = {
      id: `SH_${Date.now()}_CLEAN`,
      title: `Clean Table ${dirtyTables[0].id}`,
      description: `Table ${dirtyTables[0].id} in ${dirtyTables[0].zone} area has been dirty and needs resetting for next seating`,
      urgency: 'attention',
      target_table_id: dirtyTables[0].id,
      target_station_id: '',
      status: 'pending',
      created_at: timestamp,
    };
    tasks.push(task);

    logs.push({
      id: `SH_LOG_${Date.now()}`,
      agent_name: 'staff_harmony',
      action_type: 'table_clean_task',
      target_entity: dirtyTables[0].id,
      proposal: {
        action: `Assign cleaning of Table ${dirtyTables[0].id}`,
        reason: `Table has been dirty - auto-assigning to nearest available staff`,
      },
      utility_score: 7.5,
      status: 'proposed',
      created_at: timestamp,
    });
  }

  if (state.metrics.staff_energy_avg < 60) {
    logs.push({
      id: `SH_BREAK_${Date.now()}`,
      agent_name: 'staff_harmony',
      action_type: 'micro_break_suggestion',
      target_entity: 'STAFF_ALL',
      proposal: {
        action: 'Rotate 10-minute micro-breaks for staff',
        reason: `Staff energy at ${state.metrics.staff_energy_avg}% - breaks improve productivity by 18%`,
      },
      utility_score: 8.9,
      status: 'proposed',
      created_at: timestamp,
    });
  }

  return { logs, tasks };
}

function llmResultToAgentOutput(result: LLMStaffResult, agentName: AgentName): { logs: AgentLog[]; tasks: StaffTask[] } {
  const timestamp = new Date().toISOString();
  const logs: AgentLog[] = result.logs.map((p, i) => ({
    id: `${agentName}_LLM_${Date.now()}_${i}`,
    agent_name: agentName,
    action_type: p.action_type,
    target_entity: p.target_entity,
    proposal: p.proposal,
    utility_score: p.utility_score,
    status: 'proposed' as const,
    created_at: timestamp,
  }));
  const tasks: StaffTask[] = result.tasks.map((t, i) => ({
    id: `${agentName}_TASK_${Date.now()}_${i}`,
    title: t.title,
    description: t.description,
    urgency: t.urgency as StaffTask['urgency'],
    target_table_id: t.target_table_id,
    target_station_id: t.target_station_id,
    status: 'pending' as const,
    created_at: timestamp,
  }));
  return { logs, tasks };
}

export async function propose(state: TwinState): Promise<{ logs: AgentLog[]; tasks: StaffTask[] }> {
  try {
    const text = await callGemini(SYSTEM_PROMPTS.staff_harmony, buildAgentStatePrompt('staff_harmony', state));
    if (text) {
      const parsed = extractJSON(text);
      const result = parsed as unknown as LLMStaffResult;
      if (result && Array.isArray(result.logs) && Array.isArray(result.tasks)) {
        return llmResultToAgentOutput(result, 'staff_harmony');
      }
    }
  } catch {
    // fall through to heuristic
  }
  return heuristicPropose(state);
}
