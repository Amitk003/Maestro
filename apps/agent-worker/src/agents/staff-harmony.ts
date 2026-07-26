import type { TwinState, AgentLog, StaffTask } from '@maestro/shared';

export function propose(state: TwinState): { logs: AgentLog[]; tasks: StaffTask[] } {
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

  // Suggest micro-break rotation if staff energy is low
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
