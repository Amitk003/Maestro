import { z } from 'zod';
import {
  UserRoleSchema,
  TableStatusSchema,
  TableZoneSchema,
  OrderStatusSchema,
  OrderTypeSchema,
  OrderItemStatusSchema,
  AgentNameSchema,
  ProposalStatusSchema,
  TableSchema,
  KitchenStationSchema,
  IngredientSchema,
  MenuItemSchema,
  OrderSchema,
  OrderItemSchema,
  AgentLogSchema,
  StaffTaskSchema,
} from './schemas';

export type UserRole = z.infer<typeof UserRoleSchema>;
export type TableStatus = z.infer<typeof TableStatusSchema>;
export type TableZone = z.infer<typeof TableZoneSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type OrderType = z.infer<typeof OrderTypeSchema>;
export type OrderItemStatus = z.infer<typeof OrderItemStatusSchema>;
export type AgentName = z.infer<typeof AgentNameSchema>;
export type ProposalStatus = z.infer<typeof ProposalStatusSchema>;

export type Table = z.infer<typeof TableSchema>;
export type KitchenStation = z.infer<typeof KitchenStationSchema>;
export type Ingredient = z.infer<typeof IngredientSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type AgentLog = z.infer<typeof AgentLogSchema>;
export type StaffTask = z.infer<typeof StaffTaskSchema>;

export interface WeatherInfo {
  condition: 'sunny' | 'rainy' | 'cold' | 'stormy';
  temp_celsius: number;
  description: string;
}

export interface LocalEventInfo {
  title: string;
  location: string;
  expected_surge: 'low' | 'medium' | 'high';
  start_time: string;
}

export interface TwinState {
  timestamp: string;
  tables: Table[];
  stations: KitchenStation[];
  ingredients: Ingredient[];
  menuItems: MenuItem[];
  activeOrders: Order[];
  agentLogs: AgentLog[];
  staffTasks: StaffTask[];
  weather: WeatherInfo;
  localEvent: LocalEventInfo;
  metrics: {
    table_turnover_min: number;
    kitchen_bottleneck_pct: number;
    guest_delight_score: number;
    waste_prevented_kg: number;
    staff_energy_avg: number;
  };
}
