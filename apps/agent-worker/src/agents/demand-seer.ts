import type { TwinState, AgentLog } from '@maestro/shared';

export function propose(_state: TwinState): AgentLog[] {
  const logs: AgentLog[] = [];
  const timestamp = new Date().toISOString();

  // Heuristic: if weather is rainy/cold, predict demand surge for comfort dishes
  if (_state.weather.condition === 'rainy' || _state.weather.condition === 'cold') {
    logs.push({
      id: `DS_${Date.now()}`,
      agent_name: 'demand_seer',
      action_type: 'demand_forecast',
      target_entity: 'RESTAURANT_GLOBAL',
      proposal: {
        action: 'Increase seating forecast by 20% for next 2 hours',
        reason: `${_state.weather.condition} weather with local event '${_state.localEvent.title}' nearby - prepare for surge`,
        expected_surge_pct: 20,
        surge_duration_hours: 2,
        suggested_actions: ['Pre-stage 4 extra table settings', 'Alert kitchen for 25% volume increase'],
      },
      utility_score: 9.3,
      status: 'proposed',
      created_at: timestamp,
    });
  }

  // Heuristic: local event signal
  if (_state.localEvent.expected_surge === 'high') {
    logs.push({
      id: `DS_EVENT_${Date.now()}`,
      agent_name: 'demand_seer',
      action_type: 'event_surge_warning',
      target_entity: 'RESTAURANT_GLOBAL',
      proposal: {
        action: 'Activate pre-rush preparation protocol',
        reason: `Event '${_state.localEvent.title}' nearby (${_state.localEvent.location}) expected to end soon`,
        expected_surge_pct: 35,
      },
      utility_score: 9.5,
      status: 'proposed',
      created_at: timestamp,
    });
  }

  return logs;
}
