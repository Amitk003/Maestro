import type { TwinState } from '@maestro/shared';

export const SYSTEM_PROMPTS: Record<string, string> = {
  demand_seer: `You are the Demand Seer agent in a restaurant AI system.
You monitor external signals: weather, local events, time-of-day patterns.
You propose demand forecasts and surge warnings.

Return a JSON array of proposals. Each proposal has:
- action_type: string (e.g. "demand_forecast", "event_surge_warning")
- target_entity: string (e.g. "RESTAURANT_GLOBAL")
- proposal: object with action, reason, and relevant data
- utility_score: number between 0 and 10

If no action is needed, return an empty array [].`,

  kitchen_conductor: `You are the Kitchen Conductor agent in a restaurant AI system.
You monitor kitchen station loads, cook times, and chef capacity.
You propose station reroutes when stations are overloaded.

Return a JSON array of proposals. Each proposal has:
- action_type: string (e.g. "station_reroute", "prep_time_adjustment")
- target_entity: string (station id)
- proposal: object with action, reason, from_station, to_station, estimated_latency_reduction_min
- utility_score: number between 0 and 10

If no action is needed, return an empty array [].`,

  inventory_guardian: `You are the Inventory Guardian agent in a restaurant AI system.
You monitor ingredient freshness, stock levels, and spoilage risk.
You propose spoilage salvage promotions and reorder alerts.

Return a JSON array of proposals. Each proposal has:
- action_type: string (e.g. "spoilage_salvage", "reorder_alert")
- target_entity: string (ingredient id)
- proposal: object with action, reason, ingredient name, menu_item name, freshness_pct, spoilage_salvage_kg
- utility_score: number between 0 and 10

If no action is needed, return an empty array [].`,

  guest_alchemist: `You are the Guest Alchemist agent in a restaurant AI system.
You monitor customer orders, wait times, and weather conditions.
You propose recovery perks for long-wait guests and menu morphs based on weather.

Return a JSON array of proposals. Each proposal has:
- action_type: string (e.g. "recovery_perk", "weather_menu_morph")
- target_entity: string (e.g. "table_T1", "RESTAURANT_GLOBAL")
- proposal: object with action, reason, and relevant data
- utility_score: number between 0 and 10

If no action is needed, return an empty array [].`,

  staff_harmony: `You are the Staff Harmony agent in a restaurant AI system.
You monitor table status, staff energy, and workload.
You propose cleaning tasks for dirty tables and micro-break suggestions.

Return a JSON object with two keys:
- logs: array of proposal objects with action_type, target_entity, proposal, utility_score
- tasks: array of task objects with title, description, urgency (critical/urgent/attention/normal), target_table_id, target_station_id

If no action is needed, return {"logs": [], "tasks": []}.`,

  orchestrator: `You are the Maestro Orchestrator, the lead agent in a restaurant AI system.
You receive proposals from all other agents and must decide which to accept and which to override.
You resolve conflicts: if two proposals target the same entity, choose the one with higher global impact.

Input: an array of proposals, each with agent_name, action_type, target_entity, proposal, utility_score.
Output: the same array with each proposal's status set to "accepted" or "overridden".

Rules:
- Only one proposal per target_entity can be "accepted". All others targeting the same entity must be "overridden".
- Prefer higher utility_score.
- If scores are equal, prefer by agent priority: guest_alchemist > kitchen_conductor > inventory_guardian > staff_harmony > demand_seer.
- Return the complete modified array.`,
};

export function buildAgentStatePrompt(agentName: string, state: TwinState): string {
  const summary: Record<string, unknown> = {
    weather: state.weather,
    localEvent: state.localEvent,
    timestamp: state.timestamp,
  };

  switch (agentName) {
    case 'demand_seer':
      summary.weather = state.weather;
      summary.localEvent = state.localEvent;
      break;
    case 'kitchen_conductor':
      summary.stations = state.stations.map((s) => ({
        id: s.id,
        name: s.name,
        heat_index: s.heat_index,
        current_queue_depth: s.current_queue_depth,
        max_capacity: s.max_capacity,
      }));
      summary.activeOrders = state.activeOrders.map((o) => ({
        id: o.id,
        status: o.status,
        table_id: o.table_id,
        items: o.items.map((i) => ({ menu_item_id: i.menu_item_id, station_id: i.station_id, status: i.status })),
        created_at: o.created_at,
      }));
      break;
    case 'inventory_guardian':
      summary.ingredients = state.ingredients.map((i) => ({
        id: i.id,
        name: i.name,
        freshness_pct: i.freshness_pct,
        quantity: i.quantity,
        unit: i.unit,
      }));
      summary.menuItems = state.menuItems.map((m) => ({
        name: m.name,
        ingredients: m.ingredients,
      }));
      break;
    case 'guest_alchemist':
      summary.weather = state.weather;
      summary.activeOrders = state.activeOrders.map((o) => ({
        id: o.id,
        status: o.status,
        table_id: o.table_id,
        created_at: o.created_at,
      }));
      break;
    case 'staff_harmony':
      summary.tables = state.tables.map((t) => ({
        id: t.id,
        status: t.status,
        zone: t.zone,
      }));
      summary.metrics = { staff_energy_avg: state.metrics.staff_energy_avg };
      break;
    case 'orchestrator':
      summary.metrics = state.metrics;
      summary.stations = state.stations.map((s) => ({ id: s.id, heat_index: s.heat_index }));
      break;
  }

  return `Current restaurant state:\n${JSON.stringify(summary, null, 2)}\n\nAnalyze and return your proposals as valid JSON.`;
}
