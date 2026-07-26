export const TABLE_STATUSES: Record<string, string> = {
  vacant: 'Vacant',
  reserved: 'Reserved',
  seated: 'Seated',
  ordering: 'Ordering',
  waiting_food: 'Waiting for Food',
  eating: 'Eating',
  payment: 'Payment',
  dirty: 'Dirty',
} as const;

export const ORDER_STATUSES: Record<string, string> = {
  pending: 'Pending',
  in_prep: 'In Preparation',
  ready: 'Ready',
  served: 'Served',
  billed: 'Billed',
  closed: 'Closed',
} as const;

export const ROLES: Record<string, string> = {
  customer: 'Customer',
  waiter: 'Waiter',
  chef: 'Chef',
  manager: 'Manager',
  owner: 'Owner',
} as const;

export const AGENT_NAMES: Record<string, string> = {
  demand_seer: 'Demand Seer',
  kitchen_conductor: 'Kitchen Conductor',
  inventory_guardian: 'Inventory Guardian',
  guest_alchemist: 'Guest Alchemist',
  staff_harmony: 'Staff Harmony',
  maestro_orchestrator: 'Maestro Orchestrator',
} as const;

export const TABLE_ZONES = ['patio', 'main', 'bar', 'private'] as const;

export const DEFAULT_RESTAURANT_CONFIG = {
  global_weights: {
    guest_delight: 0.3,
    kitchen_throughput: 0.25,
    waste_reduction: 0.2,
    staff_energy: 0.15,
    profitability: 0.1,
  },
  agent_tick_interval_ms: 5000,
  max_station_capacity_pct: 0.85,
  spoilage_warning_hours: 4,
};

export const CRISIS_EVENTS = {
  rain_surge: 'Rain increases comfort food demand',
  event_rush: 'Local event ending - pre-rush window',
  grill_bottleneck: 'Grill station overload detected',
  vip_arrival: 'VIP party arriving - priority seating needed',
  ingredient_shortage: 'Key ingredient running low',
  staff_fatigue: 'Staff fatigue threshold crossed',
} as const;
