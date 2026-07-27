-- Maestro Row Level Security Policies
-- Run after 00001_schema.sql

-- Enable RLS on all tables
alter table if exists restaurants enable row level security;
alter table if exists profiles enable row level security;
alter table if exists tables enable row level security;
alter table if exists kitchen_stations enable row level security;
alter table if exists ingredients enable row level security;
alter table if exists menu_items enable row level security;
alter table if exists orders enable row level security;
alter table if exists order_items enable row level security;
alter table if exists agent_logs enable row level security;

-- Helper function to get the current user's role
create or replace function get_user_role()
returns text
language sql
stable
as $$
  select role from profiles where id = auth.uid();
$$;

-- RESTAURANTS: only managers and owners can modify
drop policy if exists "Restaurants are viewable by everyone" on restaurants;
create policy "Restaurants are viewable by everyone"
  on restaurants for select using (true);

drop policy if exists "Restaurants are editable by managers and owners" on restaurants;
create policy "Restaurants are editable by managers and owners"
  on restaurants for all using (
    get_user_role() in ('manager', 'owner')
  );

-- PROFILES: users can view their own, managers see all in their restaurant
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile"
  on profiles for select using (
    id = auth.uid()
    or get_user_role() in ('manager', 'owner')
  );

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile"
  on profiles for update using (id = auth.uid());

drop policy if exists "Managers can manage all profiles" on profiles;
create policy "Managers can manage all profiles"
  on profiles for all using (
    get_user_role() in ('manager', 'owner')
  );

-- TABLES: staff can view and update, managers can do everything
drop policy if exists "Tables viewable by all authenticated users" on tables;
create policy "Tables viewable by all authenticated users"
  on tables for select using (auth.role() = 'authenticated');

drop policy if exists "Staff can update table status" on tables;
create policy "Staff can update table status"
  on tables for update using (
    get_user_role() in ('waiter', 'chef', 'manager', 'owner')
  );

drop policy if exists "Managers can manage tables" on tables;
create policy "Managers can manage tables"
  on tables for all using (
    get_user_role() in ('manager', 'owner')
  );

-- KITCHEN STATIONS: similar to tables
drop policy if exists "Stations viewable by all authenticated users" on kitchen_stations;
create policy "Stations viewable by all authenticated users"
  on kitchen_stations for select using (auth.role() = 'authenticated');

drop policy if exists "Chefs and managers can update stations" on kitchen_stations;
create policy "Chefs and managers can update stations"
  on kitchen_stations for update using (
    get_user_role() in ('chef', 'manager', 'owner')
  );

drop policy if exists "Managers can manage stations" on kitchen_stations;
create policy "Managers can manage stations"
  on kitchen_stations for all using (
    get_user_role() in ('manager', 'owner')
  );

-- INGREDIENTS: managers and owners can manage
drop policy if exists "Ingredients viewable by all authenticated users" on ingredients;
create policy "Ingredients viewable by all authenticated users"
  on ingredients for select using (auth.role() = 'authenticated');

drop policy if exists "Managers can manage ingredients" on ingredients;
create policy "Managers can manage ingredients"
  on ingredients for all using (
    get_user_role() in ('manager', 'owner')
  );

-- MENU ITEMS: everyone can view, staff can update availability
drop policy if exists "Menu items viewable by everyone" on menu_items;
create policy "Menu items viewable by everyone"
  on menu_items for select using (true);

drop policy if exists "Staff can update menu availability" on menu_items;
create policy "Staff can update menu availability"
  on menu_items for update using (
    get_user_role() in ('waiter', 'chef', 'manager', 'owner')
  );

drop policy if exists "Managers can manage menu items" on menu_items;
create policy "Managers can manage menu items"
  on menu_items for all using (
    get_user_role() in ('manager', 'owner')
  );

-- ORDERS: customers see their own, staff see all
drop policy if exists "Customers can view own orders" on orders;
create policy "Customers can view own orders"
  on orders for select using (
    customer_id = auth.uid()
    or get_user_role() in ('waiter', 'chef', 'manager', 'owner')
  );

drop policy if exists "Customers can create orders" on orders;
create policy "Customers can create orders"
  on orders for insert with check (true);

drop policy if exists "Staff can update orders" on orders;
create policy "Staff can update orders"
  on orders for update using (
    get_user_role() in ('waiter', 'chef', 'manager', 'owner')
  );

-- ORDER ITEMS: inherits from orders
drop policy if exists "Order items viewable by order owners and staff" on order_items;
create policy "Order items viewable by order owners and staff"
  on order_items for select using (
    order_id in (select id from orders where customer_id = auth.uid())
    or get_user_role() in ('waiter', 'chef', 'manager', 'owner')
  );

drop policy if exists "Order items insertable by customers" on order_items;
create policy "Order items insertable by customers"
  on order_items for insert with check (true);

drop policy if exists "Chefs can update order item status" on order_items;
create policy "Chefs can update order item status"
  on order_items for update using (
    get_user_role() in ('chef', 'manager', 'owner')
  );

-- AGENT LOGS: staff can view, system inserts
drop policy if exists "Agent logs viewable by staff" on agent_logs;
create policy "Agent logs viewable by staff"
  on agent_logs for select using (
    get_user_role() in ('waiter', 'chef', 'manager', 'owner')
  );

drop policy if exists "Agent logs insertable by system" on agent_logs;
create policy "Agent logs insertable by system"
  on agent_logs for insert with check (true);
