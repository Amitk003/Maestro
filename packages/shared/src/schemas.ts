export const TABLE_STATUSES_LIST = [
  'vacant', 'reserved', 'seated', 'ordering',
  'waiting_food', 'eating', 'payment', 'dirty',
] as const;

export const ORDER_STATUSES_LIST = [
  'pending', 'in_prep', 'ready', 'served', 'billed', 'closed',
] as const;

export const USER_ROLES_LIST = [
  'customer', 'waiter', 'chef', 'manager', 'owner',
] as const;

export const TABLE_ZONES_LIST = ['patio', 'main', 'bar', 'private'] as const;

export const AGENT_NAMES_LIST = [
  'demand_seer', 'kitchen_conductor', 'inventory_guardian',
  'guest_alchemist', 'staff_harmony', 'maestro_orchestrator',
] as const;

export const PROPOSAL_STATUSES_LIST = ['proposed', 'accepted', 'overridden'] as const;
