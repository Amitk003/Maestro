import { z } from 'zod';

export const UserRoleSchema = z.enum(['customer', 'waiter', 'chef', 'manager', 'owner']);
export const TableStatusSchema = z.enum([
  'vacant',
  'reserved',
  'seated',
  'ordering',
  'waiting_food',
  'eating',
  'payment',
  'dirty',
]);
export const TableZoneSchema = z.enum(['patio', 'main', 'bar', 'private']);
export const OrderStatusSchema = z.enum([
  'pending',
  'in_prep',
  'ready',
  'served',
  'billed',
  'closed',
]);
export const OrderTypeSchema = z.enum(['dine_in', 'takeaway']);
export const OrderItemStatusSchema = z.enum(['pending', 'in_prep', 'completed']);
export const AgentNameSchema = z.enum([
  'demand_seer',
  'kitchen_conductor',
  'inventory_guardian',
  'guest_alchemist',
  'staff_harmony',
  'maestro_orchestrator',
]);
export const ProposalStatusSchema = z.enum(['proposed', 'accepted', 'overridden']);

export const TableSchema = z.object({
  id: z.string(),
  restaurant_id: z.string(),
  zone: TableZoneSchema,
  capacity: z.number(),
  status: TableStatusSchema,
  position_x: z.number(),
  position_y: z.number(),
  assigned_waiter_id: z.string().nullable(),
  active_session_id: z.string().nullable(),
  guest_intent: z.string().optional(),
});

export const KitchenStationSchema = z.object({
  id: z.string(),
  restaurant_id: z.string(),
  name: z.string(),
  max_capacity: z.number(),
  current_queue_depth: z.number(),
  heat_index: z.number(), // 0 to 100
  assigned_staff_ids: z.array(z.string()),
});

export const IngredientSchema = z.object({
  id: z.string(),
  restaurant_id: z.string(),
  name: z.string(),
  quantity: z.number(),
  unit: z.string(),
  shelf_life_hours: z.number(),
  harvested_at: z.string(),
  freshness_pct: z.number(), // 0 to 100
  storage_temp: z.number(),
  predicted_spoilage_at: z.string(),
});

export const MenuItemSchema = z.object({
  id: z.string(),
  restaurant_id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  base_prep_minutes: z.number(),
  ingredients: z.array(z.object({ ingredient_id: z.string(), ratio: z.number() })),
  station_requirements: z.array(z.string()),
  available: z.boolean(),
  image_url: z.string().nullable(),
  spoilage_priority_boost: z.number().default(0),
});

export const OrderItemSchema = z.object({
  id: z.string(),
  order_id: z.string(),
  menu_item_id: z.string(),
  quantity: z.number(),
  modifiers: z.record(z.string(), z.unknown()),
  station_id: z.string(),
  status: OrderItemStatusSchema,
  prep_started_at: z.string().nullable(),
  prep_completed_at: z.string().nullable(),
});

export const OrderSchema = z.object({
  id: z.string(),
  restaurant_id: z.string(),
  table_id: z.string(),
  customer_id: z.string(),
  status: OrderStatusSchema,
  type: OrderTypeSchema,
  notes: z.string(),
  items: z.array(OrderItemSchema),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AgentLogSchema = z.object({
  id: z.string(),
  agent_name: AgentNameSchema,
  action_type: z.string(),
  target_entity: z.string(),
  proposal: z.record(z.string(), z.unknown()),
  utility_score: z.number(),
  status: ProposalStatusSchema,
  created_at: z.string(),
});

export const StaffTaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  urgency: z.enum(['critical', 'urgent', 'attention', 'normal']),
  target_table_id: z.string().optional(),
  target_station_id: z.string().optional(),
  assigned_to_role: UserRoleSchema.optional(),
  status: z.enum(['pending', 'accepted', 'completed', 'snoozed']),
  created_at: z.string(),
});
