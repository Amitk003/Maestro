-- Maestro Seed Data
-- Run after 00002_rls.sql

-- Insert demo restaurant
insert into restaurants (id, name, address, timezone, config)
values (
  'a0000000-0000-0000-0000-000000000001',
  'Maestro Demo Kitchen',
  '123 Main Street, New York, NY 10001',
  'America/New_York',
  '{"global_weights": {"guest_delight": 0.3, "kitchen_throughput": 0.25, "waste_reduction": 0.2, "staff_energy": 0.15, "profitability": 0.1}, "agent_tick_interval_ms": 5000, "max_station_capacity_pct": 0.85, "spoilage_warning_hours": 4}'
)
on conflict (id) do nothing;

-- Insert tables
insert into tables (id, restaurant_id, zone, capacity, status, position_x, position_y) values
  ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'patio', 2, 'seated', 50, 50),
  ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'patio', 4, 'vacant', 180, 50),
  ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'main', 4, 'waiting_food', 50, 180),
  ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'main', 6, 'ordering', 180, 180),
  ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'main', 2, 'eating', 310, 180),
  ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'main', 4, 'seated', 440, 180),
  ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'bar', 2, 'vacant', 50, 310),
  ('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'bar', 2, 'eating', 180, 310),
  ('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'bar', 4, 'reserved', 310, 310),
  ('b0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'private', 8, 'vacant', 440, 310),
  ('b0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000001', 'main', 4, 'dirty', 310, 50),
  ('b0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000001', 'main', 4, 'waiting_food', 440, 50)
on conflict (id) do nothing;

-- Insert kitchen stations
insert into kitchen_stations (id, restaurant_id, name, max_capacity, current_queue_depth, heat_index, assigned_staff_ids) values
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Grill Station', 10, 8, 85, '{}'),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Saute Station', 12, 4, 40, '{}'),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Cold Prep Bar', 15, 2, 20, '{}'),
  ('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Pastry & Dessert', 8, 1, 15, '{}')
on conflict (id) do nothing;

-- Insert ingredients
insert into ingredients (id, restaurant_id, name, quantity, unit, shelf_life_hours, freshness_pct, storage_temp) values
  ('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Wild Atlantic Salmon', 3.5, 'kg', 6, 45, 2.5),
  ('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'A5 Wagyu Beef Striploin', 8.0, 'kg', 48, 95, 1.5),
  ('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Black Summer Truffle', 0.4, 'kg', 18, 60, 4.0),
  ('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Organic Baby Greens', 5.0, 'kg', 12, 80, 3.0)
on conflict (id) do nothing;

-- Insert menu items
insert into menu_items (id, restaurant_id, name, description, price, category, base_prep_minutes, ingredients, station_requirements, available, spoilage_priority_boost) values
  ('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Charred Wagyu Ribeye Steak', 'Seared A5 Wagyu with truffle herb butter', 48, 'Main', 18, '[{"ingredient_id": "d0000000-0000-0000-0000-000000000002", "ratio": 0.3}, {"ingredient_id": "d0000000-0000-0000-0000-000000000003", "ratio": 0.02}]', '["c0000000-0000-0000-0000-000000000001"]', true, 0),
  ('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Pan-Seared Atlantic Salmon', 'Fresh wild salmon with lemon dill butter and greens', 34, 'Main', 14, '[{"ingredient_id": "d0000000-0000-0000-0000-000000000001", "ratio": 0.25}, {"ingredient_id": "d0000000-0000-0000-0000-000000000004", "ratio": 0.1}]', '["c0000000-0000-0000-0000-000000000002", "c0000000-0000-0000-0000-000000000003"]', true, 15),
  ('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Chilled Citrus Salmon Tartare', 'Raw sushi-grade salmon with avocado and citrus oil', 26, 'Starter', 6, '[{"ingredient_id": "d0000000-0000-0000-0000-000000000001", "ratio": 0.15}]', '["c0000000-0000-0000-0000-000000000003"]', true, 25),
  ('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Truffle Mushroom Risotto', 'Arborio rice with black truffle shave and parmesan', 28, 'Main', 12, '[{"ingredient_id": "d0000000-0000-0000-0000-000000000003", "ratio": 0.01}]', '["c0000000-0000-0000-0000-000000000002"]', true, 10)
on conflict (id) do nothing;
