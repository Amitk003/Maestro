import type { TwinState, AgentLog } from '@maestro/shared';

export function propose(_state: TwinState): AgentLog[] {
  const logs: AgentLog[] = [];
  const timestamp = new Date().toISOString();

  // Heuristic: suggest recovery perks for long-wait tables
  const longWaitOrders = _state.activeOrders.filter(
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

  // Heuristic: suggest menu morphing recommendations based on weather
  if (_state.weather.condition === 'rainy' || _state.weather.condition === 'cold') {
    logs.push({
      id: `GA_WEATHER_${Date.now()}`,
      agent_name: 'guest_alchemist',
      action_type: 'weather_menu_morph',
      target_entity: 'RESTAURANT_GLOBAL',
      proposal: {
        action: 'Promote comfort food and warm dishes',
        reason: `${_state.weather.condition} weather increases comfort food demand by estimated 22%`,
        suggested_boost: 'Mushroom Risotto + Risotto',
      },
      utility_score: 7.8,
      status: 'proposed',
      created_at: timestamp,
    });
  }

  return logs;
}
