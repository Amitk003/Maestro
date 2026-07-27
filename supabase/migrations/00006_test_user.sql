-- Create a test user directly (bypasses email OTP)
-- Run this in Supabase SQL Editor after all other migrations
-- Idempotent: safe to run multiple times.

create extension if not exists "pgcrypto";

do $$
declare
  user_id uuid;
begin
  -- Check if user already exists
  select id into user_id from auth.users where email = 'test@maestro.demo';

  if user_id is null then
    -- Create test user in auth.users (trigger auto-creates profile)
    insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, confirmation_sent_at, is_sso_user, deleted_at)
    values (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'test@maestro.demo',
      crypt('password123', gen_salt('bf')),
      now(),
      now(),
      now(),
      now(),
      false,
      null
    )
    returning id into user_id;
  end if;

  -- Update the profile with manager role and restaurant
  update profiles
  set role = 'manager',
      name = 'Test Manager',
      restaurant_id = 'a0000000-0000-0000-0000-000000000001'
  where id = user_id;
end;
$$;
