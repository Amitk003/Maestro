-- Maestro Database Schema
-- Run this in your Supabase SQL editor or via migration tool.

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- 1. RESTAURANTS
create table if not exists restaurants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text not null default '',
  timezone text not null default 'America/New_York',
  config jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- 2. PROFILES (extends Supabase auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text not null default '',
  role text not null default 'customer' check (role in ('customer', 'waiter', 'chef', 'manager', 'owner')),
  restaurant_id uuid references restaurants(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 3. TABLES
create table if not exists tables (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  zone text not null default 'main' check (zone in ('patio', 'main', 'bar', 'private')),
  capacity integer not null default 4,
  status text not null default 'vacant' check (status in ('vacant', 'reserved', 'seated', 'ordering', 'waiting_food', 'eating', 'payment', 'dirty')),
  position_x integer not null default 0,
  position_y integer not null default 0,
  assigned_waiter_id uuid references profiles(id) on delete set null,
  active_session_id uuid,
  created_at timestamptz not null default now()
);

-- 4. KITCHEN STATIONS
create table if not exists kitchen_stations (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name text not null,
  max_capacity integer not null default 10,
  current_queue_depth integer not null default 0,
  heat_index integer not null default 0 check (heat_index between 0 and 100),
  assigned_staff_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

-- 5. INGREDIENTS
create table if not exists ingredients (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name text not null,
  quantity decimal not null default 0,
  unit text not null default 'kg',
  shelf_life_hours integer not null default 24,
  harvested_at timestamptz not null default now(),
  freshness_pct integer not null default 100 check (freshness_pct between 0 and 100),
  storage_temp decimal not null default 4.0,
  predicted_spoilage_at timestamptz not null default now() + interval '24 hours',
  created_at timestamptz not null default now()
);

-- 6. MENU ITEMS
create table if not exists menu_items (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name text not null,
  description text not null default '',
  price decimal not null default 0,
  category text not null default 'Main' check (category in ('Starter', 'Main', 'Dessert', 'Drink')),
  base_prep_minutes integer not null default 10,
  ingredients jsonb not null default '[]',
  station_requirements jsonb not null default '[]',
  available boolean not null default true,
  image_url text,
  spoilage_priority_boost integer not null default 0,
  created_at timestamptz not null default now()
);

-- 7. ORDERS
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  table_id uuid references tables(id) on delete set null,
  customer_id uuid references profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'in_prep', 'ready', 'served', 'billed', 'closed')),
  type text not null default 'dine_in' check (type in ('dine_in', 'takeaway')),
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 8. ORDER ITEMS
create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id) on delete set null,
  quantity integer not null default 1,
  modifiers jsonb not null default '{}',
  station_id uuid references kitchen_stations(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'in_prep', 'completed')),
  prep_started_at timestamptz,
  prep_completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- 9. AGENT LOGS
create table if not exists agent_logs (
  id uuid primary key default uuid_generate_v4(),
  agent_name text not null check (agent_name in ('demand_seer', 'kitchen_conductor', 'inventory_guardian', 'guest_alchemist', 'staff_harmony', 'maestro_orchestrator')),
  action_type text not null,
  target_entity text not null default '',
  proposal jsonb not null default '{}',
  utility_score decimal not null default 0,
  status text not null default 'proposed' check (status in ('proposed', 'accepted', 'overridden')),
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_profiles_role on profiles(role);
create index if not exists idx_profiles_restaurant on profiles(restaurant_id);
create index if not exists idx_tables_restaurant on tables(restaurant_id);
create index if not exists idx_tables_status on tables(status);
create index if not exists idx_orders_restaurant on orders(restaurant_id);
create index if not exists idx_orders_table on orders(table_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_order_items_order on order_items(order_id);
create index if not exists idx_order_items_station on order_items(station_id);
create index if not exists idx_agent_logs_agent on agent_logs(agent_name);
create index if not exists idx_agent_logs_created on agent_logs(created_at desc);
