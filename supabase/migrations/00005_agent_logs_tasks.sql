-- Staff tasks table (used by digital twin for proactive task dispatch)
create table if not exists staff_tasks (
  id uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  title text not null,
  description text not null default '',
  urgency text not null default 'normal' check (urgency in ('critical', 'urgent', 'attention', 'normal')),
  target_table_id uuid references tables(id) on delete set null,
  target_station_id uuid references kitchen_stations(id) on delete set null,
  assigned_to uuid references profiles(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'completed', 'snoozed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_staff_tasks_restaurant on staff_tasks(restaurant_id);
create index if not exists idx_staff_tasks_status on staff_tasks(status);
create index if not exists idx_staff_tasks_urgency on staff_tasks(urgency desc);

alter table if exists staff_tasks enable row level security;

create policy "Staff tasks viewable by staff"
  on staff_tasks for select using (
    get_user_role() in ('waiter', 'chef', 'manager', 'owner')
  );

create policy "Staff tasks insertable by system"
  on staff_tasks for insert with check (true);

create policy "Staff can update own tasks"
  on staff_tasks for update using (
    assigned_to = auth.uid()
    or get_user_role() in ('manager', 'owner')
  );
