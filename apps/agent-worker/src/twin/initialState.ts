import { TwinState } from '@maestro/shared';

export const createInitialTwinState = (): TwinState => ({
  timestamp: new Date().toISOString(),
  tables: [
    { id: 'T1', restaurant_id: 'R1', zone: 'patio', capacity: 2, status: 'seated', position_x: 50, position_y: 50, assigned_waiter_id: 'W1', active_session_id: 'S1', guest_intent: '20 min quick lunch' },
    { id: 'T2', restaurant_id: 'R1', zone: 'patio', capacity: 4, status: 'vacant', position_x: 180, position_y: 50, assigned_waiter_id: 'W1', active_session_id: null },
    { id: 'T3', restaurant_id: 'R1', zone: 'main', capacity: 4, status: 'waiting_food', position_x: 50, position_y: 180, assigned_waiter_id: 'W2', active_session_id: 'S3', guest_intent: 'Anniversary dinner, cozy mood' },
    { id: 'T4', restaurant_id: 'R1', zone: 'main', capacity: 6, status: 'ordering', position_x: 180, position_y: 180, assigned_waiter_id: 'W2', active_session_id: 'S4', guest_intent: 'Group celebration, cocktails & tapas' },
    { id: 'T5', restaurant_id: 'R1', zone: 'main', capacity: 2, status: 'eating', position_x: 310, position_y: 180, assigned_waiter_id: 'W2', active_session_id: 'S5' },
    { id: 'T6', restaurant_id: 'R1', zone: 'main', capacity: 4, status: 'seated', position_x: 440, position_y: 180, assigned_waiter_id: 'W3', active_session_id: 'S6' },
    { id: 'T7', restaurant_id: 'R1', zone: 'bar', capacity: 2, status: 'vacant', position_x: 50, position_y: 310, assigned_waiter_id: 'W3', active_session_id: null },
    { id: 'T8', restaurant_id: 'R1', zone: 'bar', capacity: 2, status: 'eating', position_x: 180, position_y: 310, assigned_waiter_id: 'W3', active_session_id: 'S8' },
    { id: 'T9', restaurant_id: 'R1', zone: 'bar', capacity: 4, status: 'reserved', position_x: 310, position_y: 310, assigned_waiter_id: null, active_session_id: null },
    { id: 'T10', restaurant_id: 'R1', zone: 'private', capacity: 8, status: 'vacant', position_x: 440, position_y: 310, assigned_waiter_id: null, active_session_id: null },
    { id: 'T11', restaurant_id: 'R1', zone: 'main', capacity: 4, status: 'dirty', position_x: 310, position_y: 50, assigned_waiter_id: 'W1', active_session_id: null },
    { id: 'T12', restaurant_id: 'R1', zone: 'main', capacity: 4, status: 'waiting_food', position_x: 440, position_y: 50, assigned_waiter_id: 'W1', active_session_id: 'S12', guest_intent: 'High protein post-workout' },
  ],
  stations: [
    { id: 'ST_GRILL', restaurant_id: 'R1', name: 'Grill Station', max_capacity: 10, current_queue_depth: 8, heat_index: 85, assigned_staff_ids: ['C1'] },
    { id: 'ST_SAUTE', restaurant_id: 'R1', name: 'Saute Station', max_capacity: 12, current_queue_depth: 4, heat_index: 40, assigned_staff_ids: ['C2'] },
    { id: 'ST_COLD', restaurant_id: 'R1', name: 'Cold Prep Bar', max_capacity: 15, current_queue_depth: 2, heat_index: 20, assigned_staff_ids: ['C3'] },
    { id: 'ST_PASTRY', restaurant_id: 'R1', name: 'Pastry & Dessert', max_capacity: 8, current_queue_depth: 1, heat_index: 15, assigned_staff_ids: ['C4'] },
  ],
  ingredients: [
    { id: 'ING_SALMON', restaurant_id: 'R1', name: 'Wild Atlantic Salmon', quantity: 3.5, unit: 'kg', shelf_life_hours: 6, harvested_at: new Date(Date.now() - 30 * 3600 * 1000).toISOString(), freshness_pct: 45, storage_temp: 2.5, predicted_spoilage_at: new Date(Date.now() + 6 * 3600 * 1000).toISOString() },
    { id: 'ING_WAGYU', restaurant_id: 'R1', name: 'A5 Wagyu Beef Striploin', quantity: 8.0, unit: 'kg', shelf_life_hours: 48, harvested_at: new Date().toISOString(), freshness_pct: 95, storage_temp: 1.5, predicted_spoilage_at: new Date(Date.now() + 48 * 3600 * 1000).toISOString() },
    { id: 'ING_TRUFFLE', restaurant_id: 'R1', name: 'Black Summer Truffle', quantity: 0.4, unit: 'kg', shelf_life_hours: 18, harvested_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(), freshness_pct: 60, storage_temp: 4.0, predicted_spoilage_at: new Date(Date.now() + 18 * 3600 * 1000).toISOString() },
    { id: 'ING_GREENS', restaurant_id: 'R1', name: 'Organic Baby Greens', quantity: 5.0, unit: 'kg', shelf_life_hours: 12, harvested_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), freshness_pct: 80, storage_temp: 3.0, predicted_spoilage_at: new Date(Date.now() + 12 * 3600 * 1000).toISOString() },
  ],
  menuItems: [
    { id: 'M1', restaurant_id: 'R1', name: 'Charred Wagyu Ribeye Steak', description: 'Seared A5 Wagyu with truffle herb butter', price: 48, category: 'Mains', base_prep_minutes: 18, ingredients: [{ ingredient_id: 'ING_WAGYU', ratio: 0.3 }, { ingredient_id: 'ING_TRUFFLE', ratio: 0.02 }], station_requirements: ['ST_GRILL'], available: true, image_url: null, spoilage_priority_boost: 0 },
    { id: 'M2', restaurant_id: 'R1', name: 'Pan-Seared Atlantic Salmon', description: 'Fresh wild salmon with lemon dill butter and greens', price: 34, category: 'Mains', base_prep_minutes: 14, ingredients: [{ ingredient_id: 'ING_SALMON', ratio: 0.25 }, { ingredient_id: 'ING_GREENS', ratio: 0.1 }], station_requirements: ['ST_SAUTE', 'ST_COLD'], available: true, image_url: null, spoilage_priority_boost: 15 },
    { id: 'M3', restaurant_id: 'R1', name: 'Chilled Citrus Salmon Tartare', description: 'Raw sushi-grade salmon with avocado and citrus oil', price: 26, category: 'Starters', base_prep_minutes: 6, ingredients: [{ ingredient_id: 'ING_SALMON', ratio: 0.15 }], station_requirements: ['ST_COLD'], available: true, image_url: null, spoilage_priority_boost: 25 },
    { id: 'M4', restaurant_id: 'R1', name: 'Truffle Mushroom Risotto', description: 'Arborio rice with black truffle shave and parmesan', price: 28, category: 'Mains', base_prep_minutes: 12, ingredients: [{ ingredient_id: 'ING_TRUFFLE', ratio: 0.01 }], station_requirements: ['ST_SAUTE'], available: true, image_url: null, spoilage_priority_boost: 10 },
  ],
  activeOrders: [
    { id: 'ORD_101', restaurant_id: 'R1', table_id: 'T3', customer_id: 'CUST_3', status: 'in_prep', type: 'dine_in', notes: 'Anniversary celebratory seating', items: [{ id: 'OI_1', order_id: 'ORD_101', menu_item_id: 'M1', quantity: 2, modifiers: {}, station_id: 'ST_GRILL', status: 'in_prep', prep_started_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(), prep_completed_at: null }], created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() },
    { id: 'ORD_102', restaurant_id: 'R1', table_id: 'T12', customer_id: 'CUST_12', status: 'in_prep', type: 'dine_in', notes: 'High protein request', items: [{ id: 'OI_2', order_id: 'ORD_102', menu_item_id: 'M2', quantity: 1, modifiers: {}, station_id: 'ST_SAUTE', status: 'in_prep', prep_started_at: new Date(Date.now() - 4 * 60 * 1000).toISOString(), prep_completed_at: null }], created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), updated_at: new Date().toISOString() },
  ],
  agentLogs: [
    { id: 'LOG_1', agent_name: 'inventory_guardian', action_type: 'spoilage_boost', target_entity: 'ING_SALMON', proposal: { boost: 25, item: 'M3' }, utility_score: 8.5, status: 'accepted', created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString() },
    { id: 'LOG_2', agent_name: 'kitchen_conductor', action_type: 'station_load_rebalance', target_entity: 'ST_GRILL', proposal: { reroute_target: 'ST_COLD', item: 'M3' }, utility_score: 9.1, status: 'accepted', created_at: new Date(Date.now() - 1 * 60 * 1000).toISOString() },
  ],
  staffTasks: [
    { id: 'TASK_1', title: 'Move Table 12 to Table 8 now', description: 'Prevents 11-min predicted delay on incoming VIP reservation.', urgency: 'urgent', target_table_id: 'T12', status: 'pending', created_at: new Date().toISOString() },
    { id: 'TASK_2', title: 'Serve complimentary amuse-bouche to T3', description: 'Grill station overload detected - offsets 4-min steak delay.', urgency: 'attention', target_table_id: 'T3', target_station_id: 'ST_GRILL', status: 'pending', created_at: new Date().toISOString() },
  ],
  weather: { condition: 'rainy', temp_celsius: 14, description: 'Sudden cold downpour spiked soup/warm dish demand' },
  localEvent: { title: 'Symphony Hall Concert', location: '2 blocks away', expected_surge: 'high', start_time: '8:00 PM' },
  metrics: {
    table_turnover_min: 44,
    kitchen_bottleneck_pct: 32,
    guest_delight_score: 4.7,
    waste_prevented_kg: 4.2,
    staff_energy_avg: 78,
  },
});
