create table if not exists user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null unique,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '7 days')
);

create index if not exists idx_user_sessions_token on user_sessions(token);
create index if not exists idx_user_sessions_user_id on user_sessions(user_id);

alter table user_sessions enable row level security;

-- Service role can do everything; anon/authenticated get no access
create policy "service_role_all" on user_sessions
  for all to service_role
  using (true)
  with check (true);

-- Password verification function (bypasses broken GoTrue)
create or replace function public.verify_password(
  p_email text,
  p_password text
) returns table (
  user_id uuid,
  email text,
  role text,
  name text,
  restaurant_id uuid
)
language plpgsql
security definer
set search_path = 'public'
as $$
begin
  return query
  select
    u.id,
    u.email::text,
    p.role,
    p.name,
    p.restaurant_id
  from auth.users u
  left join public.profiles p on p.id = u.id
  where u.email = p_email
    and u.encrypted_password = extensions.crypt(p_password, u.encrypted_password)
    and u.deleted_at is null
    and u.is_anonymous = false
    and u.banned_until is null;
end;
$$;

-- Session creation function (returns token)
create or replace function public.create_session(p_user_id uuid)
returns text
language plpgsql
security definer
set search_path = 'public'
as $$
declare
  v_token text;
begin
  v_token := encode(extensions.gen_random_bytes(32), 'hex');
  insert into public.user_sessions (user_id, token)
  values (p_user_id, v_token);
  return v_token;
end;
$$;

-- Session cleanup function
create or replace function public.delete_session(p_token text)
returns void
language plpgsql
security definer
set search_path = 'public'
as $$
begin
  delete from public.user_sessions where token = p_token;
end;
$$;
