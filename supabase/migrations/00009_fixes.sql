-- Maestro Fixes
-- 1. Add updated_at auto-update trigger on orders table
-- 2. Add guest_intent column to tables table

-- 1. updated_at trigger for orders
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_orders_updated_at on orders;
create trigger set_orders_updated_at
  before update on orders
  for each row
  execute function update_updated_at_column();

-- 2. Add guest_intent column to tables
alter table tables add column if not exists guest_intent text;
