-- Create a test user directly (bypasses email OTP)
-- Run this in Supabase SQL Editor after all other migrations

-- Create test user in auth.users
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
);

-- Create matching profile with manager role
insert into profiles (id, email, name, role, restaurant_id)
values (
  (select id from auth.users where email = 'test@maestro.demo'),
  'test@maestro.demo',
  'Test Manager',
  'manager',
  'a0000000-0000-0000-0000-000000000001'
);
