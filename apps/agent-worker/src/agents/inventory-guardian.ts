import type { TwinState, AgentLog } from '@maestro/shared';

export function propose(_state: TwinState): AgentLog[] {
  const logs: AgentLog[] = [];
  const timestamp = new Date().toISOString();

  for (const ing of _state.ingredients) {
    if (ing.freshness_pct < 30) {
      const linkedItems = _state.menuItems.filter((m) =>
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
