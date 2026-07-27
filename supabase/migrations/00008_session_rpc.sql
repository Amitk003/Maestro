-- RPC for proxy session validation (uses SECURITY DEFINER so anon key can call it)
create or replace function public.get_session_user(p_token text)
returns table (id uuid, role text, name text, restaurant_id uuid)
language plpgsql
security definer
set search_path = 'public'
as $$
begin
  return query
  select p.id, p.role, p.name, p.restaurant_id
  from public.user_sessions s
  join public.profiles p on p.id = s.user_id
  where s.token = p_token
    and s.expires_at > now();
end;
$$;
