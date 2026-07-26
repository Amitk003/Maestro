export type UserRole = 'customer' | 'waiter' | 'chef' | 'manager' | 'owner';

export type TableStatus =
  | 'vacant'
  | 'reserved'
  | 'seated'
  | 'ordering'
  | 'waiting_food'
  | 'eating'
  | 'payment'
  | 'dirty';

export type TableZone = 'patio' | 'main' | 'bar' | 'private';

export type OrderStatus =
  | 'pending'
  | 'in_prep'
  | 'ready'
  | 'served'
  | 'billed'
  | 'closed';

export type OrderType = 'dine_in' | 'takeaway';

export type OrderItemStatus = 'pending' | 'in_prep' | 'completed';

export type AgentName =
  | 'demand_seer'
  | 'kitchen_conductor'
  | 'inventory_guardian'
  | 'guest_alchemist'
  | 'staff_harmony'
  | 'maestro_orchestrator';

export type ProposalStatus = 'proposed' | 'accepted' | 'overridden';

export interface Profile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  restaurant_id: string;
  created_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  timezone: string;
  config: Record<string, unknown>;
}

export interface Table {
  id: string;
  restaurant_id: string;
  zone: TableZone;
  capacity: number;
  status: TableStatus;
  position_x: number;
  position_y: number;
  assigned_waiter_id: string | null;
  active_session_id: string | null;
}

export interface KitchenStation {
  id: string;
  restaurant_id: string;
  name: string;
  max_capacity: number;
  current_queue_depth: number;
  heat_index: number;
  assigned_staff_ids: string[];
}

export interface Ingredient {
  id: string;
  restaurant_id: string;
  name: string;
  quantity: number;
  unit: string;
  shelf_life_hours: number;
  harvested_at: string;
  freshness_pct: number;
  storage_temp: number;
  predicted_spoilage_at: string;
}

export interface MenuItemIngredient {
  ingredient_id: string;
  ratio: number;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  base_prep_minutes: number;
  ingredients: MenuItemIngredient[];
  station_requirements: string[];
  available: boolean;
  image_url: string | null;
}

export interface Order {
  id: string;
  restaurant_id: string;
  table_id: string;
  customer_id: string;
  status: OrderStatus;
  type: OrderType;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  modifiers: Record<string, unknown>;
  station_id: string;
  status: OrderItemStatus;
  prep_started_at: string | null;
  prep_completed_at: string | null;
}

export interface AgentLog {
  id: string;
  agent_name: AgentName;
  action_type: string;
  target_entity: string;
  proposal: Record<string, unknown>;
  utility_score: number;
  status: ProposalStatus;
  created_at: string;
}
